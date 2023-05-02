import {AfterViewInit, Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Subject} from "rxjs";
import {PlaceSuggestionModel} from "../../../core/models/autocomplete-models/place-suggestion-model";
import * as L from "leaflet";
import {environment} from "../../../../environments/environment";
import 'mapbox-gl-leaflet';

@Component({
  selector: 'app-back-ground',
  templateUrl: './back-ground.page.html',
  styleUrls: ['./back-ground.page.scss'],
})
export class BackGroundPage implements OnInit, OnDestroy {
  private unsubscribe$: Subject<void> = new Subject<void>();
  @Input() place: PlaceSuggestionModel = {} as PlaceSuggestionModel;
  private startMap!: L.Map;
  private startMarker!: L.Marker

  constructor() { }
  ngOnInit() {}

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
  private createMap(): void {
    this.startMap = L.map('map').setView([51.505, -0.09], 10);
    L.tileLayer(`${environment.geoapifyTileLayer}${environment.geoapifyFirstApiKey}`, {
      maxZoom: 10,
      id: "osm-bright",
      //attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(this.startMap);
  }

}
