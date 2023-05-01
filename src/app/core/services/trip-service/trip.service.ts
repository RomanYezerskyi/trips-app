import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { AddTripModel } from 'src/app/core/models/trip-models/add-trip-model';
import { BookedTripModel } from 'src/app/core/models/trip-models/booked-trip-model';
import { SearchTripModel } from 'src/app/core/models/trip-models/search-trip-model';
import { TripsResponseModel } from 'src/app/core/models/trip-models/trips-response-model';
import { TripModel } from 'src/app/core/models/trip-models/trip-model';
import { TripUserModel } from 'src/app/core/models/trip-models/trip-user-model';
import { UserTrips, UserTripsResponseModel } from 'src/app/core/models/user-models/user-trips-response-model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TripService {
  private baseApiUrl = environment.baseApiUrl;
  constructor(private http: HttpClient) { }
  deleteBookedSeat(tripUser: TripUserModel): Observable<any> {
    const url = this.baseApiUrl + 'BookedTrip/seat';
    return this.http.delete(url, { body: tripUser });
  }
  deleteBookedTrip(trip: TripModel): Observable<any> {
    const url = this.baseApiUrl + 'BookedTrip/trip';
    return this.http.delete(url, { body: trip });
  }
  getUserBookedTrips(take: number, skip: number): Observable<TripsResponseModel> {
    const url = this.baseApiUrl + 'BookedTrip/trips';
    return this.http.get<TripsResponseModel>(url, { params: { take: take, skip: skip } });
  }

  deleteUserFromTrip(tripUser: { userId: string, tripId: number }): Observable<any> {
    const url = this.baseApiUrl + 'BookedTrip/user';
    return this.http.delete(url, { body: tripUser });
  }

  bookSeatsInTrip(bookedtrip: BookedTripModel): Observable<any> {
    const url = this.baseApiUrl + 'BookedTrip';
    return this.http.post(url, bookedtrip, {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    });
  }
  //
  getUserTrips(take: number, skip: number): Observable<UserTripsResponseModel> {
    const url = this.baseApiUrl + 'Trips/user-trips';
    return this.http.get<UserTripsResponseModel>(url, { params: { take: take, skip: skip } })
  }
  getTripById(tripId: number): Observable<TripModel> {
    const url = this.baseApiUrl + 'Trips/'
    return this.http.get<TripModel>(url + tripId);
  }
  SearchTrip(trip: SearchTripModel): Observable<TripsResponseModel> {
    const url = this.baseApiUrl + 'Trips/search/'
    return this.http.post<TripsResponseModel>(url, trip);
  }
  addNewtrip(trip: AddTripModel): Observable<any> {
    const url = this.baseApiUrl + 'Trips/'
    return this.http.post(url, trip);
  }
  deleteTrip(id: number): Observable<any> {
    const url = this.baseApiUrl + 'Trips/';
    return this.http.delete(url + id);
  }
}
