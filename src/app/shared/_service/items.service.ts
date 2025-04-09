import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TokenStorageService } from './token-storage.service';
import { catchError, finalize, Observable, throwError } from 'rxjs';
import { backend_url } from '../_env/env';
@Injectable({
  providedIn: 'root'
})
export class ItemsService {

  private apiUrl = backend_url+'salesman/items.php';

  constructor(private http: HttpClient, private tokenStorage: TokenStorageService) { }
  getTicketList(): Observable<any> {
    const params = {
      stype: 'TICKETLIST',
      dbase: 'aquaxa2425',
      is_web_display: 'false'
    };

    return this.http.get<any>(this.apiUrl, { params }).pipe(
      catchError(this.handleError),
      finalize(() => {
        console.log('API call completed'); // Always executed whether success or error
      })
    );
  }

  private handleError(error: HttpErrorResponse) {
    console.error('API Error:', error);
    return throwError(() => new Error('Failed to fetch ticket list. Please try again.'));
  }

}
