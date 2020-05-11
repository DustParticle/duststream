import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

//Theme directives and components
import { AsideToggleDirective, BreadcrumbsComponent, NAV_DROPDOWN_DIRECTIVES, SIDEBAR_TOGGLE_DIRECTIVES, SmartResizeDirective } from './shared/index';

import { NavbarComponent, SidebarComponent, SidebarItemComponent, SidebarItemActive } from './shared/index';

import { DashboardComponent } from './dashboard.component';
import { ProjectModule } from './project/project.module';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,

    ProjectModule,
  ],
  declarations: [
    DashboardComponent,

    NAV_DROPDOWN_DIRECTIVES,
    BreadcrumbsComponent,
    SIDEBAR_TOGGLE_DIRECTIVES,
    AsideToggleDirective,
    SmartResizeDirective,

    SidebarComponent,
    SidebarItemComponent,
    NavbarComponent,
    SidebarItemActive
  ]
})
export class DashboardModule { }
