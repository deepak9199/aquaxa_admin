import { Component } from '@angular/core';

@Component({
  selector: 'app-side-bar',
  standalone: false,
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.css'
})
export class SideBarComponent {
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
}
