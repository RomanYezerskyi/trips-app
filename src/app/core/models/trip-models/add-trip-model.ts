import { AddAvailableSeatsModel } from "./add-available-seats-model";

export interface AddTripModel {
    startLat?: number;
    startLon?: number;
    endLat?: number;
    endLon?: number;
    // startPlace?: string;
    // endPlace?: string;
    startTime?: Date | string;
    endTime?: Date | string;
    pricePerSeat?: number;
    description?: string;
    countOfSeats?: number;
    carId?: number;
    availableSeats: AddAvailableSeatsModel[];
}
