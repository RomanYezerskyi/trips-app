import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UserPageRoutingModule } from './user-routing.module';

import { UserPage } from './user.page';
import {SearchFormComponent} from "../shared/search-form/search-form.component";
import {MapsAutocompleteComponent} from "../shared/maps-autocomplete/maps-autocomplete.component";
import {MatExpansionModule} from "@angular/material/expansion";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatNativeDateModule} from "@angular/material/core";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {MatInputModule} from "@angular/material/input";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatIconModule} from "@angular/material/icon";
import {MatSelectModule} from "@angular/material/select";
import {MatListModule} from "@angular/material/list";
import {HomeComponent} from "./home/home.component";
import {TripsListComponent} from "./trips-list/trips-list.component";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'

@NgModule({
  declarations: [
    UserPage,
    SearchFormComponent,
    MapsAutocompleteComponent,
    HomeComponent,
    TripsListComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    UserPageRoutingModule,
    MatExpansionModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    MatInputModule,
    MatTooltipModule,
    MatIconModule,
    MatSelectModule,
    MatListModule,
    MatProgressSpinnerModule,
    FontAwesomeModule
  ],

})
export class UserPageModule {}
