import { Routes } from '@angular/router';
import { DefaultComponent } from './layouts/default/default.component';
import { DashboardRoutes } from './modules/dashboard/dashboard.routes';

export const appRoutes: Routes = [
  ...DashboardRoutes,
  { path: '**', redirectTo: '/projects' },
];
