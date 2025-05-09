import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
interface RazorpayOrder {
  id: string;
  amount: number;
  currency: string;
  receipt: string;
  status: string;
}

interface RazorpayVerifyResponse {
  success: boolean;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  constructor(private http: HttpClient) {}

  /**
   * Create Razorpay Order
   * @param amount Amount in rupees (e.g., 500 for ₹500)
   */
  createOrder(amount: number): Observable<RazorpayOrder> {
    return this.http.post<RazorpayOrder>('https://backend.aquaxa.in/payment/create_order.php', { amount });
  }

  /**
   * Verify Payment after success
   * @param response Razorpay success response from frontend
   */
  verifyPayment(response: any): Observable<RazorpayVerifyResponse> {
    console.log(response);
    return this.http.post<RazorpayVerifyResponse>('https://backend.aquaxa.in/payment/verify_payment.php', response);
  }
}
