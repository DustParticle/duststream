import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { MsAdalAngular6Service } from 'microsoft-adal-angular6';

/**
 * This is a part of the component FullLayoutComponent got from theme
 */
@Component({
  selector: 'navbar',
  templateUrl: './navbar.component.html',
  styles: ['.avatars-stack .avatar { margin-right: 0 !important; }']
})
export class NavbarComponent {
  constructor(public authService: MsAdalAngular6Service, private router: Router) { }

  public disabled: boolean = false;
  public status: { isopen: boolean } = { isopen: false };

  public toggleDropdown($event: MouseEvent): void {
    $event.preventDefault();
    $event.stopPropagation();
    this.status.isopen = !this.status.isopen;
  }

  logout() {
    this.authService.logout();
    this.router.navigateByUrl('');
  }
}
