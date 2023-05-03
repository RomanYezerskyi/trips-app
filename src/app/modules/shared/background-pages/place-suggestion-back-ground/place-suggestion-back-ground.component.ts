import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Subject} from "rxjs";
import {PlaceSuggestionModel} from "../../../../core/models/maps-models/place-suggestion-model";
import * as L from "leaflet";
import {environment} from "../../../../../environments/environment";
import {BackGroundMapService} from "../../../../core/services/maps-service/back-ground-map.service";

@Component({
  selector: 'app-place-suggestion-back-ground',
  templateUrl: './place-suggestion-back-ground.component.html',
  styleUrls: ['./place-suggestion-back-ground.component.scss'],
})
export class PlaceSuggestionBackGroundComponent  implements OnInit, OnDestroy {
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
    this.changeMarkerPosition();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  private defaultPlace = {lat: 51.505, lon:-0.09};
  private createMap(): void {
    this.mapsBackgroundService._buildPlaceSuggestionBackGroundMap.subscribe((value) => {
      if (value.buildMap) {
        setTimeout(() => {
          this.map = this.mapsBackgroundService.buildMap(
            value.lat ? value.lat : this.defaultPlace.lat,
            value.lon ? value.lon : this.defaultPlace.lon,
            15,
            "map-suggestion");

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
        }, 300);
      }
    } )
  }

  private changeMarkerPosition(): void {
    this.mapsBackgroundService._changeMarkerPositionSuggestionBackGroundMap.subscribe((value) => {
      if (value.buildMap) {
        this.mapsBackgroundService.addMapMarker(
          value.lat ? value.lat : this.defaultPlace.lat,
          value.lon ? value.lon : this.defaultPlace.lon,
          this.map,
          this.marker,
          this.myIcon
        );
      }
    });
  }

}
