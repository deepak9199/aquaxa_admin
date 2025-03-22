import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { login } from '../../../shared/_model/login';
import { AuthService } from '../../../shared/_service/auth.service';
import { TokenStorageService } from '../../../shared/_service/token-storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loading: boolean = false
  currentDateTime: any;
  form_login: login = {
    email: '',
    password: ''
  }
  passwordFieldType: string = 'password';
  private subscription: Subscription = new Subscription()
  constructor(
    private authService: AuthService,
    private router: Router,
    private toster: ToastrService,
    private tokenstorage: TokenStorageService,
  ) {
    console.warn('login is loaded')
  }
  ngOnInit() {
    this.status()
  }
  // login function
  signIn() {
    // console.log(this.form_login)
    this.loginauthapi(this.form_login)
  }
  togglePasswordVisibility() {
    this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
  }
  private status() {
    const user = this.tokenstorage.getUser()
    if (user) {
      this.route('salesman')
    }
  }
  // login api
  private loginauthapi(login: login) {
    // console.log(login)
    this.loading = true
    this.authService.login(login.email, login.password).subscribe({
      next: (data) => {
        console.log(data)
        this.route('salesman');
        // if (data && data.token) {
        //   this.loading = false;
        //   this.tokenstorage.saveUser(data);
        //   this.tokenstorage.saveToken(data.token);

        //   // Route based on user role
        //   const user = this.tokenstorage.getUser();
        //   if (user && user.role) {
        //     this.route(user.role);
        //     this.toster.success("Login Successfully");
        //   } else {
        //     console.error("User or user role is null or undefined.");
        //   }
        // } else {
        //   // Handle the case when data or data.token is null
        //   console.error("Data or token is null.");
        //   this.loading = false;
        // }

      },
      error: (error) => {
        console.error('Error signing in:', error);
        this.toster.error('Error signing in')
        this.loading = false
      }
    });
  }
  private route(role: string) {
    switch (role) {
      case 'admin': {
        this.router.navigate(['/complainList']).then(() => {
        });
        break;
      }
      case 'salesman': {
        this.router.navigate(['/booking']).then(() => {
          window.location.reload()
        });
        break
      }
      default: {
        this.router.navigate(['/'])
        console.log('Login Token Not Found')
      }

    }
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
