import { Component } from '@angular/core';
import { ItemsService } from '../../shared/_service/items.service';
import { Ticket } from '../../shared/_model/ticket_model';
import { Subscription } from 'rxjs';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BookingForm } from '../../shared/_model/booking';
import { ClientDetail, findCustomer, saveCustomer } from '../../shared/_model/customer';
import { CustomerService } from '../../shared/_service/customer.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-ticket',
  standalone: false,
  templateUrl: './ticket.component.html',
  styleUrl: './ticket.component.css'
})
export class TicketComponent {
  tickets: Ticket[] = [];
  loading: boolean = false;
  loadingSearch: boolean = false
  findCustomers: ClientDetail = {
    acname: '',
    type: '',
    address: '',
    dob: '',
    doa: null,
    loyalty: 0,
    id: 0,
    gender: '',
    religion: null,
    remarks: null,
    subtype: null,
    phone: '',
    agent: null,
    email: '',
    identity_type: null,
    identity_no: null,
    nation: null,
    business_id: 0,
    isfound: false,
    cdp: 0,
    expiry_date: null
  };
  booking: BookingForm = {
    name: '',
    address: '',
    phone: '',
    numberOfAdultsChildren: 0,
    totalAmount: 0,
    coupons: [],
    sendToWhatsapp: false,
    rate: 0,
    email: '',
    specialdate: ''
  }
  selectedRate: number = 0
  private ticketSubscription = new Subscription; // Store the subscription
  constructor(private ticketService: ItemsService, private fb: FormBuilder, private customerService: CustomerService, private toster: ToastrService) {
    console.warn('Ticket Paged Loaded')
  }
  ngOnInit() {
    this.fetchTickets();
  }
  selectedTicket(obj: Ticket) {
    this.booking.rate = obj.rate
    console.log(this.booking)
    this.generateCouponFields(obj.coupons)
  }
  search() {
    this.findCustomer(this.booking.phone)
  }
  private saveCustomer(customer: saveCustomer) {
    this.loading = true
    this.ticketSubscription.add(
      this.customerService.insertCustomer(customer).subscribe({
        next: (response) => console.log('Response:', response),
        error: (error) => console.error('Error:', error),
        complete: () => { console.log('Subscription completed in component.'); this.loading = false },
      }));
  }
  private convertToDateString(dob: string): string | null {
    if (!dob) return null;

    const [day, month, year] = dob.split('/').map(Number);
    const fullYear = year + (year < 50 ? 2000 : 1900); // Handle two-digit year

    return `${fullYear}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  }
  private findCustomer(number: string) {
    this.loadingSearch = true
    this.ticketSubscription.add(
      this.customerService.findCustomers('AQUAXA2425', '', number).subscribe({
        next: (response) => {
          console.log('Customers:', response);
          this.findCustomers = response[0];
          if (this.findCustomers.isfound) {
            this.booking.name = this.findCustomers.acname
            this.booking.phone = this.findCustomers.phone
            this.booking.email = this.findCustomers.email
            this.booking.specialdate = this.convertToDateString(this.findCustomers.dob) || ''
          }
          else {
            this.toster.error('Customer Detail Not Found')
            this.booking = {
              name: '',
              address: '',
              phone: number,
              numberOfAdultsChildren: 0,
              totalAmount: 0,
              coupons: [],
              sendToWhatsapp: false,
              rate: 0,
              email: '',
              specialdate: ''
            }
          }

        },
        error: (error) => {
          console.error('Error fetching customers:', error);
        },
        complete: () => {
          console.log('Customer search completed.');
          this.loadingSearch = false
        }
      }));
  }
  private fetchTickets() {
    this.loading = true;
    this.ticketSubscription.add(this.ticketService.getTicketList().subscribe({
      next: (data) => this.tickets = data,
      error: (err) => console.error(err),
      complete: () => {
        this.loading = false;
        console.log('Fetch tickets API call completed.');
      }
    }));
  }
  calcuateTotalAmount() {
    this.booking.totalAmount = this.booking.rate * this.booking.numberOfAdultsChildren
  }
  calculateOfferPercentage(mrp: number, rate: number): number {
    if (!mrp || !rate || mrp <= rate) return 0; // If no MRP or no discount, return 0%
    return Math.round(((mrp - rate) / mrp) * 100);
  }
  onSubmit() {
    console.log(this.booking)
    if (this.findCustomers.isfound) {

    }
    else {
      let customer: saveCustomer = {
        cname: this.booking.name,
        addr: this.booking.address,
        phone: this.booking.phone,
        dob: this.booking.specialdate,
        email: this.booking.email
      }
      this.saveCustomer(customer)
    }

  }
  generateCouponFields(count: number) {
    this.booking.coupons = Array(count).fill('');
  }
  ngOnDestroy() {
    if (this.ticketSubscription) {
      this.ticketSubscription.unsubscribe(); // Prevent memory leaks
      console.log('Unsubscribed from ticket service.');
    }
  }
}
