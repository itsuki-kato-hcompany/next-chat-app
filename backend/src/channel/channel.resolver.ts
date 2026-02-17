import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { User } from '@prisma/client';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { GqlAuthGuard } from 'src/auth/guards/gql-auth.guard';
import { PaginationArgs } from 'src/shared/graphql-types/args/pagination.args';
import { CreateChannelInput } from './graphql-types/input/create-channel.input';
import { InviteToChannelInput } from './graphql-types/input/invite-to-channel.input';
import { JoinChannelInput } from './graphql-types/input/join-channel.input';
import { Channel } from './graphql-types/object/channel';
import { CheckChannelInvitationResult } from './graphql-types/object/check-channel-invitation-result';
import { InviteToChannelResult } from './graphql-types/object/invite-to-channel-result';
import { CheckChannelInvitationUseCase } from './usecases/check-channel-invitation.usecase';
import { CreateChannelUseCase } from './usecases/create-channel.usecase';
import { GetChannelUseCase } from './usecases/get-channel.usecase';
import { GetChannelsUseCase } from './usecases/get-channels.usecase';
import { GetAvailableChannelsUseCase } from './usecases/get-available-channels.usecase';
import { GetMyChannelsUseCase } from './usecases/get-my-channels.usecase';
import { InviteToChannelUseCase } from './usecases/invite-to-channel.usecase';
import { JoinChannelUseCase } from './usecases/join-channel.usecase';

@Resolver(() => Channel)
export class ChannelResolver {
  constructor(
    private readonly createChannelUseCase: CreateChannelUseCase,
    private readonly getChannelUseCase: GetChannelUseCase,
    private readonly getChannelsUseCase: GetChannelsUseCase,
    private readonly inviteToChannelUseCase: InviteToChannelUseCase,
    private readonly joinChannelUseCase: JoinChannelUseCase,
    private readonly checkChannelInvitationUseCase: CheckChannelInvitationUseCase,
    private readonly getMyChannelsUseCase: GetMyChannelsUseCase,
    private readonly getAvailableChannelsUseCase: GetAvailableChannelsUseCase,
  ) {}

  @Mutation(() => Channel)
  @UseGuards(GqlAuthGuard)
  async createChannel(
    @Args('input') input: CreateChannelInput,
    @CurrentUser() currentUser: User,
  ): Promise<Channel> {
    return this.createChannelUseCase.execute(input, currentUser);
  }

  @Mutation(() => Channel)
  @UseGuards(GqlAuthGuard)
  async joinChannel(
    @Args('input') input: JoinChannelInput,
    @CurrentUser() currentUser: User,
  ): Promise<Channel> {
    return this.joinChannelUseCase.execute(input, currentUser);
  }

  @Mutation(() => InviteToChannelResult)
  @UseGuards(GqlAuthGuard)
  async inviteToChannel(
    @Args('input') input: InviteToChannelInput,
    @CurrentUser() currentUser: User,
  ): Promise<InviteToChannelResult> {
    return this.inviteToChannelUseCase.execute(input, currentUser);
  }

  @Query(() => [Channel], { name: 'channels' })
  async getChannels(): Promise<Channel[]> {
    return this.getChannelsUseCase.execute();
  }

  @Query(() => [Channel], { name: 'myChannels' })
  @UseGuards(GqlAuthGuard)
  async getMyChannels(
    @Args() { limit, offset }: PaginationArgs,
    @CurrentUser() currentUser: User,
  ): Promise<Channel[]> {
    return this.getMyChannelsUseCase.execute(currentUser.id, limit, offset);
  }

  @Query(() => [Channel], { name: 'availableChannels' })
  @UseGuards(GqlAuthGuard)
  async getAvailableChannels(
    @Args() { limit, offset }: PaginationArgs,
    @CurrentUser() currentUser: User,
  ): Promise<Channel[]> {
    return this.getAvailableChannelsUseCase.execute(currentUser.id, limit, offset);
  }

  @Query(() => Channel, { name: 'channel', nullable: true })
  async getChannel(@Args('id') id: number): Promise<Channel | null> {
    return this.getChannelUseCase.execute(id);
  }

  @Query(() => CheckChannelInvitationResult)
  @UseGuards(GqlAuthGuard)
  async checkChannelInvitation(
    @Args('input') input: InviteToChannelInput,
    @CurrentUser() currentUser: User,
  ): Promise<CheckChannelInvitationResult> {
    return this.checkChannelInvitationUseCase.execute(input, currentUser);
  }
}
