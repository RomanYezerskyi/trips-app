export interface PlaceSuggestionModel {
    shortAddress: string;
    fullAddress: string;
    data: GeocodingFeatureProperties;
}
export interface GeocodingFeatureProperties {
    name: string;
    address_line2: string
    address_line1: string
    country: string;
    state: string;
    postcode: string;
    city: string;
    street: string;
    housenumber: string;
    lat: number;
    lon: number;
    formatted: string;
}
