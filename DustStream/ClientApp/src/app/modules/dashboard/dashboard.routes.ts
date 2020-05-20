import { Routes } from '@angular/router';

import { AuthenticationGuard } from 'microsoft-adal-angular6';

import { DashboardComponent } from './dashboard.component';
import { ProjectsRoutes } from './projects/index';

export const DashboardRoutes: Routes = [
  ...ProjectsRoutes
];
