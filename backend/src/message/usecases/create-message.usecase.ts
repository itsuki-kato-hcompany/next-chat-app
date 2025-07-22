import { Injectable, Inject } from "@nestjs/common";
import { PubSub } from "graphql-subscriptions";
import { IMessageDao } from "../dao/message.dao.interface";
import { MESSAGE_DAO_TOKEN } from "../dao/message.dao.token";
import { CreateMessageInput } from "../graphql-types/input/create-message.input";
import { Message } from "../graphql-types/object/message";
import { PUB_SUB } from "src/shared/pubsub/pubsub.module";

const MESSAGE_ADDED_EVENT = 'messageAdded';

@Injectable()
export class CreateMessageUseCase {
  constructor(
    @Inject(MESSAGE_DAO_TOKEN) private readonly messageDao: IMessageDao,
    @Inject(PUB_SUB) private readonly pubSub: PubSub
  ) {}

  async execute(input: CreateMessageInput): Promise<Message> {
    const newMessage = await this.messageDao.createMessage(input);

    await this.pubSub.publish(MESSAGE_ADDED_EVENT, {
      [MESSAGE_ADDED_EVENT]: newMessage,
    });

    return newMessage;
  }
}