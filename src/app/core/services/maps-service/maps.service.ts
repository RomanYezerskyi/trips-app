import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TripModel } from 'src/app/core/models/trip-models/trip-model';
import { GeocodingFeatureProperties } from 'src/app/core/models/autocomplete-models/place-suggestion-model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MapsService {
  private geoapifyApiUrl = environment.geoapifyApiUrl;
  private geoapifyFirstApiKey = environment.geoapifyFirstApiKey;
  private geoapifySecondApiKey = environment.geoapifySecondApiKey;
  constructor(private http: HttpClient) { }

  getPlaceName(text: string): Observable<any> {
    const url = this.geoapifyApiUrl + `search?text=${text}&apiKey=${this.geoapifyFirstApiKey}`;
    return this.http.get<any>(url);
  }
  getPlace(text: string): Observable<any> {
    const url = this.geoapifyApiUrl + `autocomplete?text=${text}&limit=5&apiKey=${this.geoapifySecondApiKey}`;
    return this.http.get<any>(url);
  }
  generateShortAddress(properties: GeocodingFeatureProperties): string {
    let shortAddress = properties.name;

    if (!shortAddress && properties.street && properties.housenumber) {
      shortAddress = `${properties.street} ${properties.housenumber}`;
    }

    shortAddress += (properties.postcode && properties.city) ? `, ${properties.postcode}-${properties.city}` : '';
    shortAddress += (!properties.postcode && properties.city && properties.city !== properties.name) ? `, ${properties.city}` : '';
    shortAddress += (properties.country && properties.country !== properties.name) ? `, ${properties.country}` : '';

    return shortAddress;
  }
  generateFullAddress(properties: GeocodingFeatureProperties): string {
    let fullAddress = properties.name ? properties.name : properties.address_line1;
    fullAddress += properties.street ? `, ${properties.street}` : '';
    fullAddress += properties.housenumber ? ` ${properties.housenumber}` : '';
    fullAddress += (properties.postcode && properties.city) ? `, ${properties.postcode}-${properties.city}` : '';
    fullAddress += (!properties.postcode && properties.city && properties.city !== properties.name) ? `, ${properties.city}` : '';
    fullAddress += properties.state ? `, ${properties.state}` : '';
    fullAddress += (properties.country && properties.country !== properties.name) ? `, ${properties.country}` : '';
    return fullAddress;
  }
}
