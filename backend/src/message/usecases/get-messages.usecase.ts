import { Injectable, Inject } from "@nestjs/common";
import { IMessageDao } from "../dao/message.dao.interface";
import { MESSAGE_DAO_TOKEN } from "../dao/message.dao.token";
import { Message } from "../graphql-types/object/message";

export interface GetMessagesUseCaseInput {
  channelId: number;
  limit?: number;
  offset?: number;
}

@Injectable()
export class GetMessagesUseCase {
  constructor(@Inject(MESSAGE_DAO_TOKEN) private readonly messageDao: IMessageDao) {}

  async execute(input: GetMessagesUseCaseInput): Promise<Message[]> {
    const { channelId, limit = 50, offset = 0 } = input;
    
    return this.messageDao.findMessagesByChannel(channelId, limit, offset);
  }
}