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
import {MatExpansionModule} from "@angular/material/expansion";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatNativeDateModule} from "@angular/material/core";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatInputModule} from "@angular/material/input";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatIconModule} from "@angular/material/icon";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";

export function tokenGetter() {
  return localStorage.getItem("jwt");
}
@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        allowedDomains: ["localhost:6001", "localhost:5001"],
        disallowedRoutes: []
      }
    }),
    AlertPage,
    MatExpansionModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    MatInputModule,
    MatTooltipModule,
    MatIconModule,
  ],
  providers: [AuthGuard, {provide: RouteReuseStrategy, useClass: IonicRouteStrategy}],
  bootstrap: [AppComponent],
  exports: []
})
export class AppModule {}
