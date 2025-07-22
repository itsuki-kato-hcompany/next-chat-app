import { Injectable } from "@nestjs/common";
import { MessageDao } from "../dao/message.dao";
import { Message } from "../graphql-types/object/message";

export interface GetMessagesUseCaseInput {
  channelId: number;
  limit?: number;
  offset?: number;
}

@Injectable()
export class GetMessagesUseCase {
  constructor(private readonly messageDao: MessageDao) {}

  async execute(input: GetMessagesUseCaseInput): Promise<Message[]> {
    const { channelId, limit = 50, offset = 0 } = input;
    
    return this.messageDao.findMessagesByChannel(channelId, limit, offset);
  }
}