import { Routes } from '@angular/router';

import { AuthenticationGuard } from 'microsoft-adal-angular6';

import { DashboardComponent } from './dashboard.component';
import { ProjectRoutes } from './project/index';

export const DashboardRoutes: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthenticationGuard],
    children: [
      ...ProjectRoutes
    ]
  }
];
