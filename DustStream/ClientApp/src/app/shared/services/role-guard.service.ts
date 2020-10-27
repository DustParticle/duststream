import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { RolesService } from './roles.service';
import { MsAdalAngular6Service } from 'microsoft-adal-angular6';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(public authService: MsAdalAngular6Service, public rolesService: RolesService, public router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot): boolean {
    if (!this.authService.isAuthenticated) {
      this.authService.login();
      return false;
    }

    const expectedRole = route.data.expectedRole;
    if (!this.rolesService.hasRole(expectedRole)) {
      this.router.navigate(['projects']);
      return false;
    }
    return true;
  }
}
