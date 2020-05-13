import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap'

import { MsAdalAngular6Module, MsAdalAngular6Service, AuthenticationGuard } from 'microsoft-adal-angular6'; 

import { SharedModule } from './shared/shared.module'

import { AppComponent } from './app.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { NgbdSortableHeader } from './shared/table-layout.component';
import { InsertAuthTokenInterceptor } from './shared/insert-auth-token-interceptor';

import { AppConfig } from './app.config';
import { appRoutes } from './app.routes';
import { DashboardModule } from './dashboard/dashboard.module';

export function initializeApp(appConfig: AppConfig) {
  return () => appConfig.load();
}

let adalConfig: any; // will be initialized by APP_INITIALIZER
export function msAdalAngular6ConfigFactory() {
  adalConfig = AppConfig.settings.adal;
  return adalConfig; // will be invoked later when creating MsAdalAngular6Service
}

@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    NgbdSortableHeader
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot(appRoutes),
    MsAdalAngular6Module,
    NgbModule,
    DashboardModule,
    SharedModule
  ],
  providers: [
    AppConfig,
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      deps: [AppConfig],
      multi: true
    },
    MsAdalAngular6Service,
    {
      provide: 'adalConfig',
      useFactory: msAdalAngular6ConfigFactory,
      deps: []
    },
    AuthenticationGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: InsertAuthTokenInterceptor,
      multi: true
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
