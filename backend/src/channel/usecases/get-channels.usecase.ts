import { Injectable, Inject } from "@nestjs/common";
import { IChannelDao } from "../dao/channel.dao.interface";
import { CHANNEL_DAO_TOKEN } from "../dao/channel.dao.token";
import { Channel } from "../graphql-types/object/channel";

@Injectable()
export class GetChannelsUseCase {
  constructor(@Inject(CHANNEL_DAO_TOKEN) private readonly channelDao: IChannelDao) {}

  async execute(): Promise<Channel[]> {
    return this.channelDao.findAllChannels();
  }
}