import { Resolver, Mutation, Args, Subscription, Query } from '@nestjs/graphql';
import { Inject } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';
import { Message } from './graphql-types/object/message';
import { CreateMessageInput } from './graphql-types/input/create-message.input';
import { GetMessagesArgs } from './graphql-types/args/get-messages.args';
import { PUB_SUB } from 'src/shared/pubsub/pubsub.module';
import { GetMessagesUseCase } from './usecases/get-messages.usecase';
import { CreateMessageUseCase } from './usecases/create-message.usecase';

const MESSAGE_ADDED_EVENT = 'messageAdded';

@Resolver(() => Message)
export class MessageResolver {
  constructor(
    @Inject(PUB_SUB) private pubSub: PubSub,
    private readonly getMessagesUseCase: GetMessagesUseCase,
    private readonly createMessageUseCase: CreateMessageUseCase
  ) { }

  @Query(() => [Message], { name: 'messages' })
  async getMessages(@Args() args: GetMessagesArgs): Promise<Message[]> {
    return this.getMessagesUseCase.execute({
      channelId: args.channelId,
      limit: args.limit,
      offset: args.offset
    });
  }

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
    return this.createMessageUseCase.execute(messageInput);
  }
}