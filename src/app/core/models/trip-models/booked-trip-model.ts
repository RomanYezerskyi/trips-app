import { SeatModel } from "../car-models/seat-model";

export interface BookedTripModel {
    id: number;
    tripId: number;
    requestedSeats: number;
    bookedSeats: SeatModel[];
}
