import {Component, Input, OnInit} from '@angular/core';
import {SearchTripModel} from "../../core/models/trip-models/search-trip-model";
import {Geolocation} from "@capacitor/geolocation";
import {Subject} from "rxjs";
import {PlaceSuggestionModel} from "../../core/models/maps-models/place-suggestion-model";
import * as L from "leaflet";
import {environment} from "../../../environments/environment";
import {latLng, tileLayer} from "leaflet";
import {BackGroundMapService} from "../../core/services/maps-service/back-ground-map.service";

@Component({
  selector: 'app-user',
  templateUrl: './user.page.html',
  styleUrls: ['./user.page.scss'],
})
export class UserPage implements OnInit {
  private unsubscribe$: Subject<void> = new Subject<void>();

  constructor(
    private mapsBackgroundService: BackGroundMapService,
  ) { }
  ngOnInit() {}

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  ionViewDidEnter(): void {
    this.mapsBackgroundService.getCurrentPosition().then((value) => {
      this.mapsBackgroundService.buildMainBackGroundMapHandler(
        {
          buildMap: true,
          lon: value.coords.longitude,
          lat: value.coords.latitude
        }
      );
    });
  }
}
