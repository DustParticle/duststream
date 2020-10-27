import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Roles, RolesService } from '../../services';
import { SidebarService } from '../../services/sidebar.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SidebarComponent implements OnInit {

  constructor(public sidebarService: SidebarService, public rolesService: RolesService) { }

  ngOnInit() {
  }

  allowCreatingProject(): boolean {
    return this.rolesService.hasRole(Roles.GlobalAdmin);
  }
}
