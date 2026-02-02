import { Inject, Injectable } from "@nestjs/common";
import { User } from "@prisma/client";
import { IChannelDao } from "../dao/channel.dao.interface";
import { CHANNEL_DAO_TOKEN } from "../dao/channel.dao.token";
import { CreateChannelInput } from "../graphql-types/input/create-channel.input";
import { Channel } from "../graphql-types/object/channel";

@Injectable()
export class CreateChannelUseCase {
  constructor(
    @Inject(CHANNEL_DAO_TOKEN) private readonly channelDao: IChannelDao,
  ) {}

  async execute(input: CreateChannelInput, currentUser: User): Promise<Channel> {
    return this.channelDao.createChannel({
      name: input.name,
      creatorId: currentUser.id,
    });
  }
}
