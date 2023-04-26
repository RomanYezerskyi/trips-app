import { UserModel } from "./user-model";

export interface UserRequestResponseModel {
    users: Array<UserModel>;
    totalRequests: number;
}
