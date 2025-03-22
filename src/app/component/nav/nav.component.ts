import { Component } from '@angular/core';
import { User } from '../../shared/_model/user_model';
import { TokenStorageService } from '../../shared/_service/token-storage.service';

@Component({
  selector: 'app-nav',
  standalone: false,
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css'
})
export class NavComponent {

  user: User = {
    id: 0,
    user_name: '',
    user_phone: '',
    pin: '',
    user_type: '',
    ref_code: '',
    is_exist: false
  }
  constructor(
    private token: TokenStorageService
  ) {
    console.log('nav loaded')
  }

  ngOnInit() {
    const tokenuser = this.token.getUser()
    if (tokenuser) {
      this.user = tokenuser
    }
    else {
      console.error('user data not found')
    }
  }
}
