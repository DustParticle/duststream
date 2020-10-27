import { Injectable } from '@angular/core';
import { MsAdalAngular6Service } from 'microsoft-adal-angular6';

export enum Roles {
  GlobalAdmin = 'GlobalAdmin'
}

@Injectable()
export class RolesService {
  constructor(public authService: MsAdalAngular6Service) {
  }

  hasRole(role: string): boolean {
    if (!this.authService.isAuthenticated || !this.authService.userInfo.profile.roles.includes(role)) {
      return false;
    }
    return true;
  }
}
