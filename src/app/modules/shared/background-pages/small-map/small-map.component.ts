import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Subject} from "rxjs";
import {PlaceSuggestionModel} from "../../../../core/models/maps-models/place-suggestion-model";
import * as L from "leaflet";
import 'leaflet-routing-machine';
import {environment} from "../../../../../environments/environment";
import {BackGroundMapService} from "../../../../core/services/maps-service/back-ground-map.service";


@Component({
  selector: 'app-small-map',
  templateUrl: './small-map.component.html',
  styleUrls: ['./small-map.component.scss'],
})
export class SmallMapComponent  implements OnInit, OnDestroy {
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
    this.mapsBackgroundService._buildRouteMap.subscribe((value) => {
      debugger;
      if (value.buildMap) {
        setTimeout(() => {
          this.map = this.mapsBackgroundService.buildMap(
            value.fromLat ? value.fromLat : this.defaultPlace.lat,
            value.formLon ? value.formLon : this.defaultPlace.lon,
            15,
            "small-map")

          this.mapsBackgroundService.buildMapTileLayer(
            value.fromLat ? value.fromLat : this.defaultPlace.lat,
            value.formLon ? value.formLon : this.defaultPlace.lon,
            15,
            this.map);

          if (value.fromLat && value.formLon && value.toLat && value.toLon) {
            // this.mapsBackgroundService.buildRouteLayer(
            //   value.fromLat,
            //   value.formLon,
            //   value.toLat,
            //   value.toLon,
            //   15,
            //   this.map);

            this.mapsBackgroundService.addMapMarkers(
              value.fromLat ? value.fromLat : this.defaultPlace.lat,
              value.formLon ? value.formLon : this.defaultPlace.lon,
              this.map,
              this.marker,
              this.myIcon
            );

            this.mapsBackgroundService.addMapMarkers(
              value.toLat ? value.toLat : this.defaultPlace.lat,
              value.toLon ? value.toLon : this.defaultPlace.lon,
              this.map,
              this.marker,
              this.myIcon
            );

            let route = L.Routing.control({
              waypoints: [
                L.latLng(40.5663651,-75.6032277),
                L.latLng(40.00195, -76.073299),
                L.latLng(42.3673945,-83.0750408)
              ]
            }).addTo(this.map)

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
