import { Component } from '@angular/core';
import { ItemsService } from '../../shared/_service/items.service';
import { Ticket } from '../../shared/_model/ticket_model';
import { Subscription } from 'rxjs';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BookingForm } from '../../shared/_model/booking';

@Component({
  selector: 'app-ticket',
  standalone: false,
  templateUrl: './ticket.component.html',
  styleUrl: './ticket.component.css'
})
export class TicketComponent {
  tickets: Ticket[] = [];
  loading = false;

  booking: BookingForm = {
    name: '',
    address: '',
    phone: 0,
    numberOfAdultsChildren: 0,
    totalAmount: 0,
    bookingDate: '',
    coupons: [],
    sendToWhatsapp: false,
    rate: 0
  }

  selectedRate: number = 0
  private ticketSubscription!: Subscription; // Store the subscription

  constructor(private ticketService: ItemsService, private fb: FormBuilder) {
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

  private fetchTickets() {
    this.loading = true;
    this.ticketSubscription = this.ticketService.getTicketList().subscribe({
      next: (data) => this.tickets = data,
      error: (err) => console.error(err),
      complete: () => {
        this.loading = false;
        console.log('Fetch tickets API call completed.');
      }
    });
  }

  calcuateTotalAmount() {
    this.booking.totalAmount = this.booking.rate * this.booking.numberOfAdultsChildren
  }

  ngOnDestroy() {
    if (this.ticketSubscription) {
      this.ticketSubscription.unsubscribe(); // Prevent memory leaks
      console.log('Unsubscribed from ticket service.');
    }
  }

  onSubmit() {
    console.log(this.booking)
  }
  generateCouponFields(count: number) {
    this.booking.coupons = Array(count).fill('');
  }
}
