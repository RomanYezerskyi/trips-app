import { SeatModel } from "../car-models/seat-model";
import { UserModel } from "../user-models/user-model";

export interface BookedTripUsersModel {
    userId: string;
    user: UserModel;
    seats: SeatModel[];
}
