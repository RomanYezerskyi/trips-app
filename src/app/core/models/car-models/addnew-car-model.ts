import { CarType } from "../../enums/car-type";

export interface AddNewCarModel {
    modelName: string;
    registNum: string;
    countOfSeats: number;
    carType: CarType;
    techPassportFile: File[]
}
