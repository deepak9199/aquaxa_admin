import { Component } from '@angular/core';
import { ItemsService } from '../../shared/_service/items.service';
import { Ticket } from '../../shared/_model/ticket_model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-ticket',
  standalone: false,
  templateUrl: './ticket.component.html',
  styleUrl: './ticket.component.css'
})
export class TicketComponent {
  tickets: Ticket[] = [];
  loading = false;
  private ticketSubscription!: Subscription; // Store the subscription

  constructor(private ticketService: ItemsService) {
    console.warn('Ticket Paged Loaded')
  }

  ngOnInit() {
    this.fetchTickets();
  }

  fetchTickets() {
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

  ngOnDestroy() {
    if (this.ticketSubscription) {
      this.ticketSubscription.unsubscribe(); // Prevent memory leaks
      console.log('Unsubscribed from ticket service.');
    }
  }
}
