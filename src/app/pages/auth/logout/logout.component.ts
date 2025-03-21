import { Component } from '@angular/core';
import { AuthService } from '../../../shared/_service/auth.service';
import { ToastrService } from 'ngx-toastr';
import { SharedService } from '../../../shared/_service/shared.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-logout',
  standalone: false,
  templateUrl: './logout.component.html',
  styleUrl: './logout.component.css'
})
export class LogoutComponent {
  loading: boolean = true
  private subscription = new Subscription();
  constructor(
    private authService: AuthService,
    private toster: ToastrService,
    private sharedService: SharedService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.logout()
  }
  logout() {
    this.authService.logout();
    this.trigertrefreshnavbar()
    // this.toster.success('Logout SuccessFully')
    this.router.navigate(['/']).then(() => {
      this.toster.success('Logout SuccessFully')
      this.loading = false
    });
  }
  // signout() {
  //   this.loading = true
  //   this.subscription.add(
  //     this.authService.signOut().subscribe({
  //       next: (data) => {
  //         this.loading = false
  //         this.logout()
  //       },
  //       error: (err) => {
  //         this.loading = false
  //         console.error(err)
  //       }
  //     })
  //   )
  // }
  private trigertrefreshnavbar() {
    this.sharedService.triggerFunction();
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
