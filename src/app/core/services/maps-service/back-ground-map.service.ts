import {Injectable} from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {IMapsBackgroundModel} from "../../models/maps-models/maps-background-model";
import {environment} from "../../../../environments/environment";
import * as L from "leaflet";
import {Geolocation} from "@capacitor/geolocation";
import {IRouteMapModel} from "../../models/maps-models/route-map-model";

@Injectable({
  providedIn: 'root'
})
export class BackGroundMapService {
  private emptyMapModel: IMapsBackgroundModel = { buildMap: false, lon: undefined, lat: undefined };
  private emptyRouteMapModel: IRouteMapModel = { buildMap: false, toLon: undefined, formLon: undefined, fromLat: undefined, toLat: undefined};
  public _buildMainBackGroundMap: BehaviorSubject<IMapsBackgroundModel> = new BehaviorSubject(this.emptyMapModel);
  public _buildPlaceSuggestionBackGroundMap: BehaviorSubject<IMapsBackgroundModel> = new BehaviorSubject(this.emptyMapModel);
  public _changeMarkerPositionSuggestionBackGroundMap: BehaviorSubject<IMapsBackgroundModel> = new BehaviorSubject(this.emptyMapModel);
  public _buildRouteMap: BehaviorSubject<IRouteMapModel> = new BehaviorSubject(this.emptyRouteMapModel);
  public _tripDistance: BehaviorSubject<{distance: number, time: number}> = new BehaviorSubject({ time: 0, distance: 0 });

  constructor() { }

  public buildMainBackGroundMapHandler(value: IMapsBackgroundModel) {
    this._buildMainBackGroundMap.next(value);
  }

  public buildPlaceSuggestionBackGroundMapHandler(value: IMapsBackgroundModel) {
    this._buildPlaceSuggestionBackGroundMap.next(value);
  }

  public changeMarkerPositionSuggestionBackGroundMapHandler(value: IMapsBackgroundModel) {
    this._changeMarkerPositionSuggestionBackGroundMap.next(value);
  }

  public buildRouteMapHandler(value: IRouteMapModel) {
    this._buildRouteMap.next(value);
  }


  public buildMap(lat: number, lon: number, zoom: number, name: string) {
    return L.map(name).setView([lat, lon], zoom);
  }

  public buildMapTileLayer(lat: number, lon: number, zoom: number, map: L.Map) {
    L.tileLayer(`${environment.geoapifyTileLayer}${environment.geoapifyFirstApiKey}`, {
      maxZoom: zoom,
      id: "osm-bright",
      //attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);
  }

  public buildRouteLayer(fromLat: number, fromLon: number, toLat: number, toLon: number, map: L.Map) {
   L.Routing.control({
      waypoints: [L.latLng(fromLat, fromLon), L.latLng(toLat, toLon)],
      routeWhileDragging: false,
    }).addTo(map);
  }

  public getRouteData(fromLat: number, fromLon: number, toLat: number, toLon: number, map: L.Map) {
    const route = L.Routing.control({
      waypoints: [L.latLng(fromLat, fromLon), L.latLng(toLat, toLon)],
      routeWhileDragging: false
    }).addTo(map);

    route.on('routesfound', (e) => {
      const routes = e.routes;
      const summary = routes[0].summary;

      this._tripDistance.next({
        distance: parseInt((summary.totalDistance / 1000)?.toFixed(0)),
        time: summary.totalTime
      });
    } )
  }

  public addMapMarker(lat: number, lon: number, map: L.Map, marker: L.Marker, icon: L.Icon<L.IconOptions>) {
    map.panTo(new L.LatLng(lat, lon));

    map.eachLayer((layer) => {
      if (layer instanceof L.Marker) map.removeLayer(marker);
    });
    marker = L.marker([lat, lon], { icon: icon }).addTo(map);
  }

  public addMapMarkers(lat: number, lon: number, map: L.Map, marker: L.Marker, icon: L.Icon<L.IconOptions>) {
    map.panTo(new L.LatLng(lat, lon));
    marker = L.marker([lat, lon], { icon: icon }).addTo(map);
  }

  public getCurrentPosition = async () => {
    return await Geolocation.getCurrentPosition();
  }
}
