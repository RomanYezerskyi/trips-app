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
import {SelectedTripComponent} from "../shared/selected-trip/selected-trip.component";
import {BackGroundPage} from "../shared/background-pages/back-ground/back-ground.page";
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import {
  PlaceSuggestionBackGroundComponent
} from "../shared/background-pages/place-suggestion-back-ground/place-suggestion-back-ground.component";
import {SmallMapComponent} from "../shared/background-pages/small-map/small-map.component";
import {ProfileComponent} from "./profile/profile.component";
import {UserTripsListComponent} from "./profile/user-trips-list/user-trips-list.component";
import {BookedTripsListComponent} from "./profile/booked-trips-list/booked-trips-list.component";
import {CurrentTripsComponent} from "./current-trips/current-trips.component";
import {BookedCurrentTripsComponent} from "./current-trips/booked-current-trips/booked-current-trips.component";
import {MyCurrentTripsComponent} from "./current-trips/my-current-trips/my-current-trips.component";
@NgModule({
  declarations: [
    UserPage,
    SearchFormComponent,
    MapsAutocompleteComponent,
    HomeComponent,
    TripsListComponent,
    SelectedTripComponent,
    BackGroundPage,
    PlaceSuggestionBackGroundComponent,
    SmallMapComponent,
    ProfileComponent,
    UserTripsListComponent,
    BookedTripsListComponent,
    CurrentTripsComponent,
    BookedCurrentTripsComponent,
    MyCurrentTripsComponent
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
    FontAwesomeModule,
    // BackGroundPageModule
    LeafletModule
  ],

})
export class UserPageModule {}
