import { AvailableSeatsModel } from "../trip-models/available-seats-model";
import { BookedTripUsersModel } from "../trip-models/booked-trip-users-model";
import { CarModel } from "../car-models/car-model";
import { UserModel } from "./user-model";
import { TripUserModel } from "../trip-models/trip-user-model";

export interface UserTripsResponseModel {
    trips: Array<UserTrips>;
    totalTrips?: number;
}
export interface UserTrips {
    id: number;
    startPlace: string;
    endPlace: string;
    startLat?: number;
    startLon?: number;
    endLat?: number;
    endLon?: number;
    startTime: Date;
    endTime: Date;
    pricePerSeat: number;
    description: string;
    countOfSeats: number;
    userId: string;
    availableSeats: AvailableSeatsModel[];
    car: CarModel
    user?: UserModel;
    tripUsers: TripUserModel[];
    bookedTripUsers: Array<BookedTripUsersModel>

}
