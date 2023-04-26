import { NotificationStatus } from "../../enums/notification-status";
import { UserModel } from "../user-models/user-model";

export interface NotificationsModel {
    id?: string;
    text: string;
    userId?: string;
    user?: UserModel
    notificationStatus?: NotificationStatus;
    readNotificationStatus?: number;
    createdAt?: Date;
    feedBackOnUser?: string;
}
