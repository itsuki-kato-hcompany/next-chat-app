import { Resolver, Query, Args } from '@nestjs/graphql';
import { Channel } from './graphql-types/object/channel';
import { GetChannelsUseCase } from './usecases/get-channels.usecase';
import { GetChannelUseCase } from './usecases/get-channel.usecase';

@Resolver(() => Channel)
export class ChannelResolver {
  constructor(
    private readonly getChannelsUseCase: GetChannelsUseCase,
    private readonly getChannelUseCase: GetChannelUseCase,
  ) { }

  @Query(() => [Channel], { name: 'channels' })
  async getChannels(): Promise<Channel[]> {
    return this.getChannelsUseCase.execute();
  }

  @Query(() => Channel, { name: 'channel', nullable: true })
  async getChannel(@Args('id') id: number): Promise<Channel | null> {
    return this.getChannelUseCase.execute(id);
  }
}