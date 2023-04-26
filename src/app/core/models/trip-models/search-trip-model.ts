import { TripOrderBy } from "../../enums/trip-order-by";

export interface SearchTripModel {
    startLat?: number;
    startLon?: number;
    endLat?: number;
    endLon?: number;
    startPlace: string;
    endPlace: string;
    startTime: Date | string;
    countOfSeats: number;
    orderBy?: TripOrderBy;
    take?: number
    skip?: number
}
