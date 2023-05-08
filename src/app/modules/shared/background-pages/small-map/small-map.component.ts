import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Subject, switchMap, switchMapTo, takeUntil, timer} from "rxjs";
import {PlaceSuggestionModel} from "../../../../core/models/maps-models/place-suggestion-model";
import * as L from "leaflet";
import 'leaflet-routing-machine';
import {environment} from "../../../../../environments/environment";
import {BackGroundMapService} from "../../../../core/services/maps-service/back-ground-map.service";
import {SelectedTripModalService} from "../../../../core/services/trip-service/selected-trip-modal.service";

@Component({
  selector: 'app-small-map',
  templateUrl: './small-map.component.html',
  styleUrls: ['./small-map.component.scss'],
})
export class SmallMapComponent  implements OnInit, OnDestroy {
  private unsubscribe$: Subject<void> = new Subject<void>();
  @Input() place: PlaceSuggestionModel = {} as PlaceSuggestionModel;
  @Input() isTrackerMode: boolean  = false;
  private map!: L.Map;
  private marker!: L.Marker
  private userMarker: L.Marker | undefined
  private myIcon = L.icon({
    iconUrl: `${environment.geoapifyMarkerPoin}${environment.geoapifyFirstApiKey}`,
    iconSize: [24, 40],
  });

  private userIcon = L.icon({
    iconUrl: `${environment.geoapifyMarkerUser}${environment.geoapifyFirstApiKey}`,
    iconSize: [24, 40],
  });
  showUserPosition: boolean = false;

  constructor(
    private mapsBackgroundService: BackGroundMapService,
  ) { }
  ngOnInit() {
    this.createMap();
    this.changeMarkerPosition();
    this.refreshUserMarker();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  private defaultPlace = {lat: 51.505, lon:-0.09};

  private defaultIcon: L.Icon = L.icon({
    iconUrl: "https://unpkg.com/leaflet@1.5.1/dist/images/marker-icon.png"
  });
  private createMap(): void {
    this.mapsBackgroundService._buildRouteMap.pipe(takeUntil(this.unsubscribe$)).subscribe((value) => {
      if (value.buildMap) {
        setTimeout(() => {
          this.map = this.mapsBackgroundService.buildMap(
            value.fromLat ? value.fromLat : this.defaultPlace.lat,
            value.formLon ? value.formLon : this.defaultPlace.lon,
            13,
            "small-map");

          this.mapsBackgroundService.buildMapTileLayer(
            value.fromLat ? value.fromLat : this.defaultPlace.lat,
            value.formLon ? value.formLon : this.defaultPlace.lon,
            20,
            this.map);

          L.Marker.prototype.options.icon = this.defaultIcon;

          if (value.fromLat && value.formLon && value.toLat && value.toLon) {
            this.mapsBackgroundService.buildRouteLayer(
              value.fromLat,
              value.formLon,
              value.toLat,
              value.toLon,
              this.map);
          }
        }, 300);
      }
    });
  }

  userPositionToggle(){
    this.mapsBackgroundService.getCurrentPosition().then((value) => {
      if (!this.userMarker && !this.showUserPosition) {
        this.userMarker = this.mapsBackgroundService.addMapMarker(
          value.coords.latitude,
          value.coords.longitude,
          this.map,
          this.userMarker,
          this.userIcon
        )
        this.showUserPosition = !this.showUserPosition;
      } else {
        this.showUserPosition = !this.showUserPosition;
      }

      if (!this.showUserPosition && this.userMarker) {
        this.mapsBackgroundService.removeMapMarker(this.map, this.userMarker);
        this.userMarker = undefined;
      }
    });
  }

  refreshUserMarker(): void {
    timer(0, 5000).pipe(takeUntil(this.unsubscribe$), switchMap(() => {
      return this.mapsBackgroundService.getCurrentPosition().then((value) => {
        if(this.showUserPosition && this.userMarker) {
          this.mapsBackgroundService.updateMapMarker(
            value.coords.latitude,
            value.coords.longitude,
            this.map,
            this.userMarker,
            this.userIcon);
        }
      });
    })).subscribe();
  }

  private changeMarkerPosition(): void {
    this.mapsBackgroundService._changeMarkerPositionSuggestionBackGroundMap.pipe(takeUntil(this.unsubscribe$)).subscribe((value) => {
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
