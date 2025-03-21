import { Injectable } from '@angular/core';
import { Observable, from, of, throwError } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';
import { TokenStorageService } from './token-storage.service';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';
import { User } from '../_model/user_model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // URL to a server-side endpoint that returns the user's IP address
  private ipLookupUrl = 'https://api.ipify.org/?format=json';

  // Define the range of office IP addresses
  private officeIpRanges: string[] = ['49.37.25.44'];


  // Sign in with email and password
  private apiUrl = 'https://aquaxa.tensoftware.in/api/clientinfo';

  constructor(private http: HttpClient, private tokenStorage: TokenStorageService) { }

  login(identifier: string | number, pin: string): Observable<User> {
    return this.http.get<User[]>(`${this.apiUrl}?stype=USERDETAIL&dbase=aquaxa2425&uname=admin`).pipe(
      map(users => {
        const user = users.find(
          u => (u.id === identifier || u.user_name === identifier || u.user_phone === identifier) && u.pin === pin
        );
        if (!user) {
          throw new Error('Invalid credentials');
        }
        this.tokenStorage.saveUser(user);
        return user;
      })
    );
  }
  logout() {
    // remove user from local storage to log user out
    this.tokenStorage.signOut();
  }

}
