import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { CouponRequest } from '../_model/booking';

@Injectable({
  providedIn: 'root',
})
export class BookingService {
  private apiUrl = 'https://backend.aquaxa.in/bookingreport.php/';
  private apiUrlbooking = 'https://backend.aquaxa.in/booking.php/';

  constructor(private http: HttpClient) { }
  generateCoupon(request: CouponRequest): Observable<any> {
    console.log(request);
    const params = new URLSearchParams({
      stype: 'GENERATECOUPON',
      dbase: 'AQUAXA2425',
      intval: request.intval.toString(),
      refno: request.refno,
      item_code: request.item_code.toString(),
      id: request.id.toString(),
      phone: request.phone,
      agent: request.agent.toString(),
      iscash: '0',
    }).toString();
    console.log(`${this.apiUrlbooking}?${params}`)
    return this.http.get<any>(`${this.apiUrlbooking}?${params}`).pipe(
      tap({
        complete: () => console.log('Coupon generation request completed.'),
      })
    );
  }
  getAgentBookings(agent: number): Observable<any> {
    const params = new URLSearchParams({
      stype: 'AGENTBOOKINGLIST',
      dbase: 'AQUAXA2425',
      agent: agent.toString(),
    }).toString();

    return this.http.get<any>(`${this.apiUrl}?${params}`).pipe(
      tap({
        complete: () => console.log('Agent booking report request completed.'),
      })
    );
  }
}
