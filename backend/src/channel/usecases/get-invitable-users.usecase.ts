import { Injectable, Inject, ForbiddenException, NotFoundException } from "@nestjs/common";
import { User } from "@prisma/client";
import { IChannelDao } from "../dao/channel.dao.interface";
import { CHANNEL_DAO_TOKEN } from "../dao/channel.dao.token";
import { IChannelUserDao } from "../dao/channel-user.dao.interface";
import { CHANNEL_USER_DAO_TOKEN } from "../dao/channel-user.dao.token";

@Injectable()
export class GetInvitableUsersUseCase {
  constructor(
    @Inject(CHANNEL_DAO_TOKEN) private readonly channelDao: IChannelDao,
    @Inject(CHANNEL_USER_DAO_TOKEN) private readonly channelUserDao: IChannelUserDao,
  ) {}

  async execute(channelId: number, userId: number, query: string, limit: number = 50, offset: number = 0): Promise<User[]> {
    const channel = await this.channelDao.findChannelById(channelId);
    if (!channel) {
      throw new NotFoundException("指定のチャンネルが見つかりません");
    }

    const isMember = await this.channelUserDao.isChannelMember(channelId, userId);
    if (!isMember) {
      throw new ForbiddenException("参加しているチャンネルのメンバーのみ招待可能ユーザーを検索できます");
    }

    return this.channelUserDao.findInvitableUsersByChannelId(channelId, query, limit, offset);
  }
}
