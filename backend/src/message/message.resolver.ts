import { Resolver, Mutation, Args, Subscription, } from '@nestjs/graphql';
import { Inject } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';
import { Message } from './graphql-types/object/message';
import { CreateMessageInput } from './graphql-types/input/create-message.input';
import { PUB_SUB } from 'src/shared/pubsub/pubsub.module';
import { MessageDao } from './dao/message.dao';

const MESSAGE_ADDED_EVENT = 'messageAdded';

@Resolver(() => Message)
export class MessageResolver {
  constructor(@Inject(PUB_SUB) private pubSub: PubSub,
    private readonly messageDao: MessageDao
  ) { }

  @Subscription(() => Message, {
    name: MESSAGE_ADDED_EVENT,
  })
  messageAdded() {
    return this.pubSub.asyncIterableIterator(MESSAGE_ADDED_EVENT);
  }

  @Mutation(() => Message)
  async addMessage(
    @Args('messageInput') messageInput: CreateMessageInput,
  ): Promise<Message> {

    const newMessage = await this.messageDao.createMessage(messageInput);

    await this.pubSub.publish(MESSAGE_ADDED_EVENT, {
      [MESSAGE_ADDED_EVENT]: newMessage,
    });

    return newMessage;
  }
}