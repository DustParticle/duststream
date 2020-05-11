import { Routes }        from '@angular/router';

import { DashboardRoutes } from './dashboard/dashboard.routes';

export const appRoutes: Routes = [
    ...DashboardRoutes,

    { path: '**', redirectTo: 'dashboard' },
];
