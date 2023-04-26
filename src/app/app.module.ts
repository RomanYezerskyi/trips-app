import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {JwtModule} from "@auth0/angular-jwt";
import {HttpClientModule} from "@angular/common/http";
import {AlertPage} from "./modules/shared/alert/alert.page";
import {AuthGuard} from "./core/guards/auth-guard/auth.guard";

export function tokenGetter() {
  return localStorage.getItem("jwt");
}
@NgModule({
  declarations: [
    AppComponent,

  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        allowedDomains: ["localhost:6001", "localhost:5001"],
        disallowedRoutes: []
      }
    }),
    AlertPage,
  ],
  providers: [AuthGuard, { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}
