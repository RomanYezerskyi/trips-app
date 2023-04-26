import { SeatModel } from "../car-models/seat-model";
import { UserModel } from "../user-models/user-model";

export interface TripUserModel {
    id: string;
    seat: SeatModel;
    seatId: string;
    user?: UserModel;
    userId?: string;
    tripId: string;
}
