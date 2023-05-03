import {AfterViewInit, Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Subject} from "rxjs";
import {PlaceSuggestionModel} from "../../../../core/models/maps-models/place-suggestion-model";
import * as L from "leaflet";
import {environment} from "../../../../../environments/environment";
import 'mapbox-gl-leaflet';
import {BackGroundMapService} from "../../../../core/services/maps-service/back-ground-map.service";
import {LatLngTuple} from "leaflet";

@Component({
  selector: 'app-back-ground',
  templateUrl: './back-ground.page.html',
  styleUrls: ['./back-ground.page.scss'],
})
export class BackGroundPage implements OnInit, OnDestroy {
  private unsubscribe$: Subject<void> = new Subject<void>();
  @Input() place: PlaceSuggestionModel = {} as PlaceSuggestionModel;
  private map!: L.Map;
  private marker!: L.Marker
  private myIcon = L.icon({
    iconUrl: `${environment.geoapifyMarkerPoin}${environment.geoapifyFirstApiKey}`,
    iconSize: [24, 40],
  });

  constructor(
    private mapsBackgroundService: BackGroundMapService,
  ) { }
  ngOnInit() {
    this.createMap();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  private defaultPlace = {lat: 51.505, lon:-0.09};
  private createMap(): void {
    this.mapsBackgroundService._buildMainBackGroundMap.subscribe((value) => {
     if (value.buildMap) {
       this.map = this.mapsBackgroundService.buildMap(
         value.lat ? value.lat : this.defaultPlace.lat,
         value.lon ? value.lon : this.defaultPlace.lon,
       15,
       "map");

       this.mapsBackgroundService.buildMapTileLayer(
         value.lat ? value.lat : this.defaultPlace.lat,
         value.lon ? value.lon : this.defaultPlace.lon,
       15,
             this.map);

       if (value.lat && value.lon) {
         this.mapsBackgroundService.addMapMarker(
           value.lat ? value.lat : this.defaultPlace.lat,
           value.lon ? value.lon : this.defaultPlace.lon,
               this.map,
               this.marker,
               this.myIcon
         );
       }
     }
    } )


  }

}
