import { CarModel } from "../car-models/car-model";
import { RoleModel } from "../auth-models/role-model";
import { TripModel } from "../trip-models/trip-model";
import { UserDocumentsModel } from "./user-documents-model";
import { UserStatus } from "./user-status";

export interface UserModel {
    id: string;
    email: string;
    firstName: string;
    phoneNumber: string;
    userImg?: string
    roles: any[];
    userDocuments: UserDocumentsModel[];
    userStatus: UserStatus;
    cars: CarModel[];
    trips?: TripModel[];
    tripUsers?: TripModel[];
    createdAt?: Date;
    newRole?: string;
}
