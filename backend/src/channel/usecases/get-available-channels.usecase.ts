import { Injectable, Inject } from "@nestjs/common";
import { IChannelDao } from "../dao/channel.dao.interface";
import { CHANNEL_DAO_TOKEN } from "../dao/channel.dao.token";
import { Channel } from "../graphql-types/object/channel";

@Injectable()
export class GetAvailableChannelsUseCase {
  constructor(@Inject(CHANNEL_DAO_TOKEN) private readonly channelDao: IChannelDao) {}

  async execute(userId: number, limit: number = 50, offset: number = 0): Promise<Channel[]> {
    return this.channelDao.findAvailableChannelsByUserId(userId, limit, offset);
  }
}
