import { HttpClientModule } from '@angular/common/http';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { AuthenticationGuard, MsAdalAngular6Module, MsAdalAngular6Service } from 'microsoft-adal-angular6';
import { AppComponent } from './app.component';
import { AppConfig } from './app.config';
import { appRoutes } from './app.routes';
import { DefaultModule } from './layouts/default/default.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { SharedModule } from './shared/shared.module';

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
    AppComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    BrowserAnimationsModule,
    FormsModule,
    RouterModule.forRoot(appRoutes),
    MsAdalAngular6Module,
    DefaultModule,
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
    AuthenticationGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
