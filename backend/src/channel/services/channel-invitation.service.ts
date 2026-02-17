import { ForbiddenException, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { Channel, User } from "@prisma/client";
import { IAuthDao } from "src/auth/dao/auth.dao.interface";
import { AUTH_DAO_TOKEN } from "src/auth/dao/auth.dao.token";
import { IChannelDao } from "../dao/channel.dao.interface";
import { CHANNEL_DAO_TOKEN } from "../dao/channel.dao.token";

export interface ChannelInvitationCheckResult {
  channel: Channel;
  validUsers: User[];
  alreadyMemberUsers: User[];
  notFoundUserIds: number[];
}

@Injectable()
export class ChannelInvitationService {
  constructor(
    @Inject(CHANNEL_DAO_TOKEN) private readonly channelDao: IChannelDao,
    @Inject(AUTH_DAO_TOKEN) private readonly authDao: IAuthDao,
  ) {}

  async checkInvitation(
    channelId: number,
    userIds: number[],
    currentUser: User,
  ): Promise<ChannelInvitationCheckResult> {
    // 自分自身を除外
    const targetUserIds = userIds.filter((id) => id !== currentUser.id);

    // チャンネル存在確認
    const channel = await this.channelDao.findChannelById(channelId);
    if (!channel) {
      throw new NotFoundException("指定のチャンネルが見つかりません");
    }

    // ユーザー存在確認
    const existingUsers = await this.authDao.findUsersByIds(targetUserIds);
    const existingUserIds = existingUsers.map((u) => u.id);
    const notFoundUserIds = targetUserIds.filter((id) => !existingUserIds.includes(id));

    // 既存メンバー確認
    const currentMemberIds = await this.channelDao.findChannelUserIdsByChannelId(channelId);

    // 招待者がメンバーかどうか確認
    if (!currentMemberIds.includes(currentUser.id)) {
      throw new ForbiddenException("参加しているチャンネルのメンバーのみ招待できます");
    }

    // ユーザー分類
    const alreadyMemberUsers = existingUsers.filter((u) => currentMemberIds.includes(u.id));
    const validUsers = existingUsers.filter((u) => !currentMemberIds.includes(u.id));

    return {
      channel,
      validUsers,
      alreadyMemberUsers,
      notFoundUserIds,
    };
  }
}
