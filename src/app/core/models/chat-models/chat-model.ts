import { UserModel } from "../user-models/user-model";
import { MessageModel } from "./message-model";
import { ChatParticipantModel } from "./chat-participant-model";

export interface ChatModel {
    id?: string
    chatName?: string,
    chatImage?: string,
    messages?: Array<MessageModel>,
    users?: Array<ChatParticipantModel>,
    chatType?: number,
    createdAt?: Date,
    lastMessage?: MessageModel;
}
