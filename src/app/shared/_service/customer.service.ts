import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { saveCustomer } from '../_model/customer';
import { backend_url } from '../_env/env';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private apiUrl = backend_url+'savecustomer.php/';
  private apiUrlfind = backend_url+'findcustomer.php/';

  constructor(private http: HttpClient) { }

  insertCustomer(customer: saveCustomer): Observable<any> {
    const params = new URLSearchParams({
      stype: 'INSERTCUSTOMER',
      dbase: 'AQUAXA2425',
      cname: customer.cname,
      addr: customer.addr,
      phone: customer.phone,
      ttype: 'CLIENT',
      dob: customer.dob,
      id: '0',
      email: customer.email,
    }).toString();

    return this.http.get<any>(`${this.apiUrl}?${params}`).pipe(
      tap({
        complete: () => console.log('Observable completed in service.'),
      })
    );
  }
  findCustomers(dbase: string, ttype: string, phone: string): Observable<any> {
    const params = new URLSearchParams({
      stype: 'CUSTOMERLIST',
      dbase: dbase,
      ttype: ttype,
      phone: phone,
    }).toString();

    return this.http.get<any>(`${this.apiUrlfind}?${params}`).pipe(
      tap({
        complete: () => console.log('Find customers request completed.'),
      })
    );
  }
}
