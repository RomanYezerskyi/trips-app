import {Component, Input, OnInit} from '@angular/core';
import {SearchTripModel} from "../../core/models/trip-models/search-trip-model";
import {Geolocation} from "@capacitor/geolocation";
import {Subject} from "rxjs";
import {PlaceSuggestionModel} from "../../core/models/autocomplete-models/place-suggestion-model";
import * as L from "leaflet";
import {environment} from "../../../environments/environment";
import {latLng, tileLayer} from "leaflet";

@Component({
  selector: 'app-user',
  templateUrl: './user.page.html',
  styleUrls: ['./user.page.scss'],
})
export class UserPage implements OnInit {
  private unsubscribe$: Subject<void> = new Subject<void>();
  @Input() place: PlaceSuggestionModel = {} as PlaceSuggestionModel;
  private startMap!: L.Map;
  private startMarker!: L.Marker

  options = {
    layers: [
      tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '...' })
    ],
    zoom: 5,
    center: latLng(46.879966, -121.726909)
  }

  constructor() { }
  ngOnInit() {}

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  // ngAfterViewInit() {
  //   this.createMap();
  // }

  ionViewDidEnter(): void {
    console.log("aa")

    this.createMap();
  }
  private createMap(): void {
    this.startMap = L.map('map').setView([51.505, -0.09], 10);
    L.tileLayer(`${environment.geoapifyTileLayer}${environment.geoapifyFirstApiKey}`, {
      maxZoom: 10,
      id: "osm-bright",
      //attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(this.startMap);
    this.startMap.invalidateSize();
  }


  onMapReady(map: L.Map) {
    setTimeout(() => {
      map.invalidateSize();
    }, 0);
  }

  printCurrentPosition = async () => {
    const coordinates = await Geolocation.getCurrentPosition();

    console.log('Current position:', coordinates);
  }
}
