import { TripModel } from "./trip-model";


export interface TripsResponseModel {
    trips: TripModel[],
    totalTrips: number
}
