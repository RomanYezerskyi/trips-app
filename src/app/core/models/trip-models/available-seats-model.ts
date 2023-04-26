import { AvailableSeatsType } from "../../enums/available-seats-type";
import { SeatModel } from "../car-models/seat-model";
export interface AvailableSeatsModel {
    id: number,
    tripId: number,
    seatId: number,
    availableSeatsType: AvailableSeatsType,
    seat: SeatModel
}
