import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { User } from '@prisma/client';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { GqlAuthGuard } from 'src/auth/guards/gql-auth.guard';
import { CreateChannelInput } from './graphql-types/input/create-channel.input';
import { Channel } from './graphql-types/object/channel';
import { CreateChannelUseCase } from './usecases/create-channel.usecase';
import { GetChannelUseCase } from './usecases/get-channel.usecase';
import { GetChannelsUseCase } from './usecases/get-channels.usecase';

@Resolver(() => Channel)
export class ChannelResolver {
  constructor(
    private readonly createChannelUseCase: CreateChannelUseCase,
    private readonly getChannelUseCase: GetChannelUseCase,
    private readonly getChannelsUseCase: GetChannelsUseCase,
  ) {}

  @Mutation(() => Channel)
  @UseGuards(GqlAuthGuard)
  async createChannel(
    @Args('input') input: CreateChannelInput,
    @CurrentUser() currentUser: User,
  ): Promise<Channel> {
    return this.createChannelUseCase.execute(input, currentUser);
  }

  @Query(() => [Channel], { name: 'channels' })
  async getChannels(): Promise<Channel[]> {
    return this.getChannelsUseCase.execute();
  }

  @Query(() => Channel, { name: 'channel', nullable: true })
  async getChannel(@Args('id') id: number): Promise<Channel | null> {
    return this.getChannelUseCase.execute(id);
  }
}