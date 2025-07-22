import { Injectable, Inject } from "@nestjs/common";
import { PubSub } from "graphql-subscriptions";
import { MessageDao } from "../dao/message.dao";
import { CreateMessageInput } from "../graphql-types/input/create-message.input";
import { Message } from "../graphql-types/object/message";
import { PUB_SUB } from "src/shared/pubsub/pubsub.module";

const MESSAGE_ADDED_EVENT = 'messageAdded';

@Injectable()
export class CreateMessageUseCase {
  constructor(
    private readonly messageDao: MessageDao,
    @Inject(PUB_SUB) private readonly pubSub: PubSub
  ) {}

  async execute(input: CreateMessageInput): Promise<Message> {
    console.log('CreateMessageUseCase input:', input);
    
    const newMessage = await this.messageDao.createMessage(input);

    await this.pubSub.publish(MESSAGE_ADDED_EVENT, {
      [MESSAGE_ADDED_EVENT]: newMessage,
    });

    return newMessage;
  }
}