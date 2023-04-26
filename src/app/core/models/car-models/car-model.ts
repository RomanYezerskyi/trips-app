import { CarType } from "../../enums/car-type";
import { CarDocumentsModel } from "./car-documents-model";
import { CarStatus } from "./car-status";
import { SeatModel } from "./seat-model";
import { TripModel } from "../trip-models/trip-model";

export interface CarModel {
    id: number;
    modelName: string;
    registrationNumber: string;
    carType: CarType;
    seats: SeatModel[];
    carDocuments: CarDocumentsModel[]
    carStatus: CarStatus;
    trips?: TripModel[],
    createdAt?: Date
}
