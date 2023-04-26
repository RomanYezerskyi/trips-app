import { CarType } from "src/app/core/enums/car-type";
import { CarDocumentsModel } from "./car-documents-model";
import { SeatModel } from "./seat-model";

export interface CarUpdateModel {
    id: number;
    modelName: string;
    registNum: string;
    countOfSeats: number;
    carType: CarType;
    seats: Array<SeatModel>;
    techPassportFile: File[];
    deletedDocuments: CarDocumentsModel[];
}
