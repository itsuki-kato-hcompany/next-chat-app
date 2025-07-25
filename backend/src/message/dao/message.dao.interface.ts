import { CreateMessageInput } from "../graphql-types/input/create-message.input";
import { Message as PrismaMessage } from "@prisma/client";

export interface IMessageDao {
  createMessage(createMessageInput: CreateMessageInput): Promise<PrismaMessage>;
  
  findAllMessages(): Promise<PrismaMessage[]>;
  
  findMessageById(id: number): Promise<PrismaMessage | null>;
  
  findMessagesByChannel(
    channelId: number,
    limit?: number,
    offset?: number
  ): Promise<(PrismaMessage)[]>;
}