import { Injectable } from '@angular/core';
import { Observable, from, of, throwError } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';
import { TokenStorageService } from './token-storage.service';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';
import { User } from '../_model/user_model';
import { backend_url } from '../_env/env';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = backend_url+'salesman/auth.php';

  constructor(private http: HttpClient, private tokenStorage: TokenStorageService) { }

  login(identifier: string | number, pin: string): Observable<User> {
    return this.http.get<User[]>(`${this.apiUrl}?stype=USERDETAIL&dbase=aquaxa2425&uname=${identifier}`).pipe(
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
