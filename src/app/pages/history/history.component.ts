import { Component } from '@angular/core';
import { BookingService } from '../../shared/_service/booking.service';
import { Subscription } from 'rxjs';
import { TokenStorageService } from '../../shared/_service/token-storage.service';
import { BookingList } from '../../shared/_model/booking';
import { ToastrService } from 'ngx-toastr';
import { SendMessageService } from '../../shared/_service/send-message.service';
import emailjs, { send, type EmailJSResponseStatus } from '@emailjs/browser';
import { CustomerService } from '../../shared/_service/customer.service';
import { ClientDetail } from '../../shared/_model/customer';
@Component({
  selector: 'app-history',
  standalone: false,
  templateUrl: './history.component.html',
  styleUrl: './history.component.css',
})
export class HistoryComponent {
  loading: boolean = false;
  resendloading: boolean = false;
  bookingList: BookingList[] = [];
  selectedCoupons: string[] = [];
  private bookingHistorySubscription: Subscription = new Subscription();
  private agentID: number = 0;
  constructor(
    private bookingService: BookingService,
    private token: TokenStorageService,
    private toster: ToastrService,
    private sendmessage: SendMessageService,
    private customerService: CustomerService,
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
  resend(booking: BookingList) {
    this.findCustomer(booking.phoneno, booking);
  }
  private sendToWhatsapp(phone: string, coupons: string[], refnumber: string) {
    this.toster.info('Sending WhatsApp message please wait...');
    this.resendloading = true;
    this.bookingHistorySubscription.add(
      this.sendmessage.sendWhatsApp(coupons, refnumber, phone).subscribe({
        next: (response) => {
          console.log('Response:', response),
            this.toster.success('WhatsApp message sent successfully!');
          this.resendloading = false;
        },
        error: (err) => {
          console.error('Error:', err),
            this.toster.error('Failed to send WhatsApp message.');
          this.resendloading = false;
        },
      })
    );
  }
  private sendEmail(coupon_no: string, refnumber: string, email: string, name: string) {
    this.resendloading = true;
    this.toster.info('Sending Email message please wait...');
    const templateParams = {
      name: name,
      email: email,
      coupons: coupon_no,
      url: `https://print.tensoftware.in/aquaxa.php?refno=${refnumber}`
    };
    emailjs
      .send('service_qygfern', 'template_hfw8cr8', templateParams, {
        publicKey: 'T5Dq1EBq43VRLoMxQ',
      })
      .then(
        () => {
          console.log('SUCCESS!');
          this.toster.success('Email sent successfully!');
          this.resendloading = false;
        },
        (error: EmailJSResponseStatus) => {
          console.log('FAILED...', error.text);
          this.resendloading = false;
        }
      );
  }
  private fetchBookingHistory() {
    this.loading = true;
    this.bookingHistorySubscription.add(
      this.bookingService.getAgentBookings(this.agentID).subscribe({
        next: (response: BookingList[]) => {
          // console.log('response : ', response);
          // Sort by issue_date DESC
          this.bookingList = response.sort((a, b) => {
            const toDate = (d: string) => {
              const [day, month, year] = d.split('/').map(Number);
              return new Date(year, month - 1, day);
            };
            return toDate(b.issue_date).getTime() - toDate(a.issue_date).getTime();
          });
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
  private findCustomer(
    number: string,
    booking: BookingList,
  ) {
    this.resendloading = true
    this.bookingHistorySubscription.add(
      this.customerService.findCustomers('AQUAXA2425', '', number).subscribe({
        next: (response) => {
          // console.log('Customers:', response, booking, paymentRef);
          const findCustomers: ClientDetail = response[0];
          const coupon_no = booking.coupon_no;
          const refnumber = booking.ref_no;
          const email = findCustomers.email;
          const phone = booking.phoneno;
          const name = booking.customer_name;
          if (booking.coupon_no.length > 0) {
            this.sendToWhatsapp(phone, coupon_no, refnumber),
              this.sendEmail(coupon_no.join(','), refnumber, email, name), this.resendloading = false;
          } else {
            this.toster.error('Please select a coupon to resend!'), this.resendloading = false;
          }

        },
        error: (error) => {
          console.error('Error fetching customers:', error);
          this.resendloading = false;
        },
        complete: () => {
          console.log('Customer search completed.');
          this.resendloading = false;
        },
      })
    );
  }
  ngOnDestroy() {
    this.bookingHistorySubscription.unsubscribe();
  }
}
