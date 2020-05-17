import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { MsAdalAngular6Service } from 'microsoft-adal-angular6';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  @Output() toggleSideBar: EventEmitter<any> = new EventEmitter();

  constructor(private authService: MsAdalAngular6Service) { }

  ngOnInit() { }

  toggleSB() {
    this.toggleSideBar.emit();
    setTimeout(() => {
      window.dispatchEvent(
        new Event('resize')
      );
    }, 300);
  }

  logout() {
    this.authService.logout();
  }
}
