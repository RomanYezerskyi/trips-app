import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Subject, switchMap, switchMapTo, takeUntil, timer} from "rxjs";
import {PlaceSuggestionModel} from "../../../../core/models/maps-models/place-suggestion-model";
import * as L from "leaflet";
import 'leaflet-routing-machine';
import {environment} from "../../../../../environments/environment";
import {BackGroundMapService} from "../../../../core/services/maps-service/back-ground-map.service";
import {SelectedTripModalService} from "../../../../core/services/trip-service/selected-trip-modal.service";
import {SignalRService} from "../../../../core/models/signalr-services/signalr.service";
import {IUserLocationModel} from "../../../../core/models/maps-models/user-location-model";
import {MapsService} from "../../../../core/services/maps-service/maps.service";

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
  private marker!: L.Marker;
  private userMarker: L.Marker | undefined;
  private carMarker: L.Marker | undefined;
  private myIcon = L.icon({
    iconUrl: `${environment.geoapifyMarkerPoin}${environment.geoapifyFirstApiKey}`,
    iconSize: [24, 40],
  });

  private userIcon = L.icon({
    iconUrl: `${environment.geoapifyMarkerUser}${environment.geoapifyFirstApiKey}`,
    iconSize: [24, 40],
  });

  private carIcon = L.icon({
    iconUrl: `${environment.geoapifyMarkerCar}${environment.geoapifyFirstApiKey}`,
    iconSize: [24, 40],
  });

  @Input() tripId : number | undefined;
  @Input() isDriver: boolean = false;
  showUserPosition: boolean = false;
  showDriverPosition: boolean = false;

  constructor(
    private mapsBackgroundService: BackGroundMapService,
    private mapsService: MapsService,
    private signal: SignalRService
  ) {
  }
  ngOnInit() {
    this.createMap();
    this.changeMarkerPosition();

    this.setSignalRUrls();
    this.connectToSignalRMapHub();
    if(!this.isDriver) {
      this.refreshUserMarker();
    } else {
      this.refreshCarMarker();
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  private defaultPlace = {lat: 51.505, lon:-0.09};

  private defaultIcon: L.Icon = L.icon({
    iconUrl: "https://unpkg.com/leaflet@1.5.1/dist/images/marker-icon.png"
  });

  setSignalRUrls(): void {
    debugger;
    if(this.tripId) {
      this.signal.setConnectionUrl = environment.mapHubConnectionUrl;
      this.signal.setHubMethod = environment.mapHubMethod
      this.signal.setHubMethodParams = this.tripId.toString();
      this.signal.setHandlerMethod = environment.mapHubHandlerMethod;
    }
  }

  connectToSignalRMapHub(): void {
    this.signal.getDataStream<IUserLocationModel>().pipe(takeUntil(this.unsubscribe$)).subscribe(message => {
      if(message.data.lat && message.data.lon && !message.data.passanger) {
        if(this.showDriverPosition && !this.carMarker) {
          this.carMarker = this.mapsBackgroundService.addMapMarker(
            message.data.lat,
            message.data.lon,
            this.map,
            this.carMarker,
            this.carIcon
          )
        }

        if(this.showDriverPosition && this.carMarker) {
          this.mapsBackgroundService.updateMapMarker(
            message.data.lat,
            message.data.lon,
            this.map,
            this.carMarker,
            this.carIcon);
        }
      }
    });
  }

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

  carPositionToggle(){
    this.mapsBackgroundService.getCurrentPosition().then((value) => {
      this.showDriverPosition = !this.showDriverPosition;

      if (!this.showDriverPosition && this.carMarker) {
        this.mapsBackgroundService.removeMapMarker(this.map, this.carMarker);
        this.carMarker = undefined;
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

  refreshCarMarker(): void {
    timer(0, 5000).pipe(takeUntil(this.unsubscribe$), switchMap(() => {
      return this.mapsBackgroundService.getCurrentPosition().then((value) => {
        this.mapsService.sendLocation({
          lat: value.coords.latitude,
          lon: value.coords.longitude,
          passanger: false,
          tripId: this.tripId?.toString(),
          userId: "test"
        }).subscribe();
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
