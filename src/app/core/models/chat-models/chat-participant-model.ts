import { UserModel } from "../user-models/user-model";
import { ChatModel } from "./chat-model";

export interface ChatParticipantModel {
    userId?: string,
    user?: UserModel,
    chatId?: string,
    chat?: ChatModel,
    role: number
}
