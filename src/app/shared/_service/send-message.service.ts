import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { backend_url } from '../_env/env';
@Injectable({
  providedIn: 'root',
})
export class SendMessageService {
  private baseUrl = backend_url+'message/sendwhatsapp.php';

  constructor(private http: HttpClient) {}

  sendWhatsApp(
    bookingIds: string[],
    refNo: string,
    phoneNo: string
  ): Observable<any> {
    // Build query parameters using URLSearchParams
    const params = new URLSearchParams({
      booking_ids: bookingIds.join(','), // e.g., "AQUA000349,AQUA000350"
      ref_no: refNo, // e.g., "2RV1OSUUNG"
      PhoneNo: phoneNo, // e.g., "9199731275"
    }).toString();

    // Construct the full URL
    const url = `${this.baseUrl}?${params}`;
    console.log(url);

    // Return the GET request observable
    return this.http.get<any>(url).pipe(
      tap({
        complete: () => console.log('WhatsApp message request completed.'),
      })
    );
  }
}
