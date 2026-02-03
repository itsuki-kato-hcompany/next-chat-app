import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { User } from "@prisma/client";
import { IChannelDao } from "../dao/channel.dao.interface";
import { CHANNEL_DAO_TOKEN } from "../dao/channel.dao.token";
import { JoinChannelInput } from "../graphql-types/input/join-channel.input";
import { Channel } from "../graphql-types/object/channel";

@Injectable()
export class JoinChannelUseCase {
  constructor(
    @Inject(CHANNEL_DAO_TOKEN) private readonly channelDao: IChannelDao,
  ) { }

  async execute(input: JoinChannelInput, currentUser: User): Promise<Channel> {
    // チャンネルの存在確認
    await this.channelDao.findChannelById(input.channelId).then((channel) => {
      if (!channel) {
        throw new NotFoundException("指定のチャンネルが見つかりません");
      }
    });

    return this.channelDao.joinChannel(input, currentUser.id);
  }
}
