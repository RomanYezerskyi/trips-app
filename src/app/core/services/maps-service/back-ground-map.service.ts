import {Injectable} from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {IMapsBackgroundModel} from "../../models/maps-models/maps-background-model";
import {environment} from "../../../../environments/environment";
import * as L from "leaflet";
import {Geolocation} from "@capacitor/geolocation";

@Injectable({
  providedIn: 'root'
})
export class BackGroundMapService {
  private emptyMapModel: IMapsBackgroundModel = { buildMap: false, lon: undefined, lat: undefined }

  public _buildMainBackGroundMap: BehaviorSubject<IMapsBackgroundModel> = new BehaviorSubject(this.emptyMapModel);

  public _buildPlaceSuggestionBackGroundMap: BehaviorSubject<IMapsBackgroundModel> = new BehaviorSubject(this.emptyMapModel);
  public _changeMarkerPositionSuggestionBackGroundMap: BehaviorSubject<IMapsBackgroundModel> = new BehaviorSubject(this.emptyMapModel);
  constructor() { }

  public buildMainBackGroundMapHandler(value: IMapsBackgroundModel) {
    this._buildMainBackGroundMap.next(value);
    // setTimeout(() => this._buildMainBackGroundMap.next(), 5000);
  }

  public buildPlaceSuggestionBackGroundMapHandler(value: IMapsBackgroundModel) {
    this._buildPlaceSuggestionBackGroundMap.next(value);
    // setTimeout(() => this._buildMainBackGroundMap.next(), 5000);
  }

  public changeMarkerPositionSuggestionBackGroundMapHandler(value: IMapsBackgroundModel) {
    this._changeMarkerPositionSuggestionBackGroundMap.next(value);
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

  public addMapMarker(lat: number, lon: number, map: L.Map, marker: L.Marker, icon: L.Icon<L.IconOptions>) {
    map.panTo(new L.LatLng(lat, lon));

    map.eachLayer((layer) => {
      if (layer instanceof L.Marker) map.removeLayer(marker);
    });
    marker = L.marker([lat, lon], { icon: icon }).addTo(map);
  }

  public getCurrentPosition = async () => {
    return await Geolocation.getCurrentPosition();
  }
}
