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
  toggleHtmlClass() {
    const html = document.documentElement;
    const currentClasses = html.className;

    const compactClasses = 'light-style layout-navbar-fixed layout-menu-fixed layout-compact';
    const expandedClasses = 'light-style layout-navbar-fixed layout-compact layout-menu-fixed layout-menu-expanded';

    if (currentClasses === compactClasses) {
      html.className = expandedClasses;
    } else {
      html.className = compactClasses;
    }
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
