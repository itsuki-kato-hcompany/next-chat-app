import { Injectable, Inject } from '@nestjs/common';
import { Channel } from '../graphql-types/object/channel';
import { IChannelDao } from '../dao/channel.dao.interface';
import { CHANNEL_DAO_TOKEN } from '../dao/channel.dao.token';

@Injectable()
export class GetChannelUseCase {
  constructor(@Inject(CHANNEL_DAO_TOKEN) private readonly channelDao: IChannelDao) {}

  async execute(id: number): Promise<Channel | null> {
    return this.channelDao.findChannelById(id);
  }
}