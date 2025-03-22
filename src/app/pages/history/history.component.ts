import { Component } from '@angular/core';
import { BookingService } from '../../shared/_service/booking.service';
import { Subscription } from 'rxjs';
import { TokenStorageService } from '../../shared/_service/token-storage.service';
import { BookingList } from '../../shared/_model/booking';

@Component({
  selector: 'app-history',
  standalone: false,
  templateUrl: './history.component.html',
  styleUrl: './history.component.css',
})
export class HistoryComponent {
  loading: boolean = false;
  bookingList: BookingList[] = [];
  selectedCoupons: string[] = [];
  private bookingHistorySubscription: Subscription = new Subscription();
  private agentID: number = 0;
  constructor(
    private bookingService: BookingService,
    private token: TokenStorageService
  ) {
    console.warn('booking history is loaded');
  }
  ngOnInit() {
    const userData = this.token.getUser();
    if (userData) {
      this.agentID = userData.id;
      this.fetchBookingHistory();
    } else {
      console.error('User Data Not Found');
    }
  }
  select(coupons: string[]) {
    this.selectedCoupons = coupons;
  }
  private fetchBookingHistory() {
    this.loading = true;
    this.bookingHistorySubscription.add(
      this.bookingService.getAgentBookings(this.agentID).subscribe({
        next: (response) => {
          // console.log('response : ', response);
          this.bookingList = response;
        },
        error: (err) => {
          console.error(err);
        },
        complete: () => {
          this.loading = false;
          console.log('Complated Fetch booking history');
        },
      })
    );
  }
}
