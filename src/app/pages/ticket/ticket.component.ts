import { Component } from '@angular/core';
import { ItemsService } from '../../shared/_service/items.service';
import { Ticket } from '../../shared/_model/ticket_model';
import { Subscription } from 'rxjs';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BookingForm, CouponRequest } from '../../shared/_model/booking';
import {
  ClientDetail,
  findCustomer,
  saveCustomer,
} from '../../shared/_model/customer';
import { CustomerService } from '../../shared/_service/customer.service';
import { ToastrService } from 'ngx-toastr';
import { BookingService } from '../../shared/_service/booking.service';
import { TokenStorageService } from '../../shared/_service/token-storage.service';

@Component({
  selector: 'app-ticket',
  standalone: false,
  templateUrl: './ticket.component.html',
  styleUrl: './ticket.component.css',
})
export class TicketComponent {
  tickets: Ticket[] = [];
  loading: boolean = false;
  loadingSearch: boolean = false;
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
    expiry_date: null,
  };
  private agentid: number = 0;
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
    specialdate: '',
    ticket: {
      id: 0,
      item_name: '',
      item_type: 'PRODUCT',
      gst: 0,
      user_code: '',
      rate: 0,
      mrp: 0,
      expiry_days: 0,
      staff_margin: 0,
      group_code: 0,
      is_web_display: false,
      image1: '',
      coupons: 0,
    },
  };
  private ticketSubscription = new Subscription(); // Store the subscription
  constructor(
    private token: TokenStorageService,
    private ticketService: ItemsService,
    private fb: FormBuilder,
    private customerService: CustomerService,
    private toster: ToastrService,
    private couponService: BookingService
  ) {
    console.warn('Ticket Paged Loaded');
  }
  ngOnInit() {
    const userData = this.token.getUser();
    if (userData) {
      this.agentid = userData.id;
      this.fetchTickets();
    } else {
      console.error('login user data not found');
    }
  }
  selectedTicket(obj: Ticket) {
    this.booking.rate = obj.rate;
    this.booking.ticket = obj;
    // console.log(this.booking);
    this.generateCouponFields(obj.coupons);
  }
  search() {
    this.findCustomer(this.booking.phone, this.booking);
  }
  getRandomStrings(length: number): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789';
    return Array.from(
      { length },
      () => chars[Math.floor(Math.random() * chars.length)]
    ).join('');
  }
  private saveCustomer(
    customer: saveCustomer,
    booking: BookingForm,
    paymentRef: string
  ) {
    this.loading = true;
    this.ticketSubscription.add(
      this.customerService.insertCustomer(customer).subscribe({
        next: (response) => {
          console.log('Response:', response);
          if (response[0].issaved)
            this.findCustomer(booking.phone, booking, paymentRef, true);
        },
        error: (error) => console.error('Error:', error),
        complete: () => {
          console.log('Subscription completed in component.');
          this.loading = false;
        },
      })
    );
  }
  private convertToDateString(dob: string): string | null {
    if (!dob) return null;

    const [day, month, year] = dob.split('/').map(Number);
    const fullYear = year + (year < 50 ? 2000 : 1900); // Handle two-digit year

    return `${fullYear}-${String(month).padStart(2, '0')}-${String(
      day
    ).padStart(2, '0')}`;
  }
  private findCustomer(
    number: string,
    booking?: BookingForm,
    paymentRef?: string,
    isgenerateCoupon: boolean = false
  ) {
    this.loadingSearch = true;
    this.ticketSubscription.add(
      this.customerService.findCustomers('AQUAXA2425', '', number).subscribe({
        next: (response) => {
          console.log('Customers:', response);
          this.findCustomers = response[0];
          if (this.findCustomers.isfound) {
            this.booking.name = this.findCustomers.acname;
            this.booking.phone = this.findCustomers.phone;
            this.booking.email = this.findCustomers.email;
            this.booking.specialdate =
              this.convertToDateString(this.findCustomers.dob) || '';
            if (isgenerateCoupon == true)
              if (booking && paymentRef) {
                let coupons: CouponRequest = {
                  intval: booking.ticket.coupons,
                  refno: paymentRef,
                  item_code: booking.ticket.id,
                  id: this.findCustomers.id,
                  phone: '',
                  agent: this.agentid,
                };
                this.generateCoupons(coupons);
              }
          } else {
            this.toster.error('Customer Detail Not Found');
            this.booking = {
              name: '',
              address: '',
              phone: number,
              numberOfAdultsChildren: 0,
              totalAmount: 0,
              coupons: [],
              sendToWhatsapp: false,
              rate: booking ? booking.ticket.rate : 0,
              email: '',
              specialdate: '',
              ticket: {
                id: 0,
                item_name: '',
                item_type: 'PRODUCT',
                gst: 0,
                user_code: '',
                rate: 0,
                mrp: 0,
                expiry_days: 0,
                staff_margin: 0,
                group_code: 0,
                is_web_display: false,
                image1: '',
                coupons: 0,
              },
            };
          }
        },
        error: (error) => {
          console.error('Error fetching customers:', error);
        },
        complete: () => {
          console.log('Customer search completed.');
          this.loadingSearch = false;
        },
      })
    );
  }
  private fetchTickets() {
    this.loading = true;
    this.ticketSubscription.add(
      this.ticketService.getTicketList().subscribe({
        next: (data) => (this.tickets = data),
        error: (err) => console.error(err),
        complete: () => {
          this.loading = false;
          console.log('Fetch tickets API call completed.');
        },
      })
    );
  }
  private generateCoupons(coupons: CouponRequest) {
    this.loading = true;
    this.ticketSubscription.add(
      this.couponService.generateCoupon(coupons).subscribe({
        next: (response) => {
          console.log('Coupon Generated:', response);
          const ref = document.getElementById('closeModelBooking');
          if (ref)
            ref.click(),
              this.ngOnInit(),
              this.toster.success('Ticket Booked'),
              (this.booking = {
                name: '',
                address: '',
                phone: '',
                numberOfAdultsChildren: 0,
                totalAmount: 0,
                coupons: [],
                sendToWhatsapp: false,
                rate: 0,
                email: '',
                specialdate: '',
                ticket: {
                  id: 0,
                  item_name: '',
                  item_type: 'PRODUCT',
                  gst: 0,
                  user_code: '',
                  rate: 0,
                  mrp: 0,
                  expiry_days: 0,
                  staff_margin: 0,
                  group_code: 0,
                  is_web_display: false,
                  image1: '',
                  coupons: 0,
                },
              });
          // this.couponResponse = response;
        },
        error: (error) => {
          console.error('Error generating coupon:', error);
        },
        complete: () => {
          this.loading = false;
          console.log('Coupon generation process completed.');
        },
      })
    );
  }
  calcuateTotalAmount() {
    this.booking.totalAmount =
      this.booking.rate * this.booking.numberOfAdultsChildren;
  }
  calculateOfferPercentage(mrp: number, rate: number): number {
    if (!mrp || !rate || mrp <= rate) return 0; // If no MRP or no discount, return 0%
    return Math.round(((mrp - rate) / mrp) * 100);
  }
  onSubmit() {
    console.log(this.findCustomers.isfound);
    if (this.findCustomers.isfound === true) {
      let coupons: CouponRequest = {
        intval: this.booking.ticket.coupons,
        refno: this.getRandomStrings(10),
        item_code: this.booking.ticket.id,
        id: this.findCustomers.id,
        phone: '',
        agent: this.agentid,
      };
      this.generateCoupons(coupons);
    } else {
      let customer: saveCustomer = {
        cname: this.booking.name,
        addr: this.booking.address,
        phone: this.booking.phone,
        dob: this.booking.specialdate,
        email: this.booking.email,
      };
      this.saveCustomer(customer, this.booking, 'UPI4578423');
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
