import { Resolver, Query, Mutation, Args, Int, Subscription } from '@nestjs/graphql';
import { Message } from './graphql-types/object/message';
import { PubSub } from 'graphql-subscriptions';

const pubSub = new PubSub();

@Resolver(() => Message)
export class MessageResolver {
  @Subscription(() => Message)
  messageAdded() {
    return pubSub.asyncIterableIterator('messageAdded');
  }
}
