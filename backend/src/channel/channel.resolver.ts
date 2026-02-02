import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { User } from '@prisma/client';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { GqlAuthGuard } from 'src/auth/guards/gql-auth.guard';
import { CreateChannelInput } from './graphql-types/input/create-channel.input';
import { InviteToChannelInput } from './graphql-types/input/invite-to-channel.input';
import { JoinChannelInput } from './graphql-types/input/join-channel.input';
import { Channel } from './graphql-types/object/channel';
import { InviteToChannelResult } from './graphql-types/object/invite-to-channel-result';
import { ValidateChannelInvitationResult } from './graphql-types/object/validate-channel-invitation-result';
import { CreateChannelUseCase } from './usecases/create-channel.usecase';
import { GetChannelUseCase } from './usecases/get-channel.usecase';
import { GetChannelsUseCase } from './usecases/get-channels.usecase';
import { InviteToChannelUseCase } from './usecases/invite-to-channel.usecase';
import { JoinChannelUseCase } from './usecases/join-channel.usecase';
import { ValidateChannelInvitationUseCase } from './usecases/validate-channel-invitation.usecase';

@Resolver(() => Channel)
export class ChannelResolver {
  constructor(
    private readonly createChannelUseCase: CreateChannelUseCase,
    private readonly getChannelUseCase: GetChannelUseCase,
    private readonly getChannelsUseCase: GetChannelsUseCase,
    private readonly inviteToChannelUseCase: InviteToChannelUseCase,
    private readonly joinChannelUseCase: JoinChannelUseCase,
    private readonly validateChannelInvitationUseCase: ValidateChannelInvitationUseCase,
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

  @Query(() => Channel, { name: 'channel', nullable: true })
  async getChannel(@Args('id') id: number): Promise<Channel | null> {
    return this.getChannelUseCase.execute(id);
  }

  @Query(() => ValidateChannelInvitationResult)
  @UseGuards(GqlAuthGuard)
  async validateChannelInvitation(
    @Args('input') input: InviteToChannelInput,
    @CurrentUser() currentUser: User,
  ): Promise<ValidateChannelInvitationResult> {
    return this.validateChannelInvitationUseCase.execute(input, currentUser);
  }
}