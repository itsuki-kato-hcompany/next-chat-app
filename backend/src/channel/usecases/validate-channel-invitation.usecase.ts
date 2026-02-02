import { ForbiddenException, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { User } from "@prisma/client";
import { IAuthDao } from "src/auth/dao/auth.dao.interface";
import { AUTH_DAO_TOKEN } from "src/auth/dao/auth.dao.token";
import { IChannelDao } from "../dao/channel.dao.interface";
import { CHANNEL_DAO_TOKEN } from "../dao/channel.dao.token";
import { InviteToChannelInput } from "../graphql-types/input/invite-to-channel.input";
import { ValidateChannelInvitationResult } from "../graphql-types/object/validate-channel-invitation-result";

@Injectable()
export class ValidateChannelInvitationUseCase {
  constructor(
    @Inject(CHANNEL_DAO_TOKEN) private readonly channelDao: IChannelDao,
    @Inject(AUTH_DAO_TOKEN) private readonly authDao: IAuthDao,
  ) {}

  async execute(
    input: InviteToChannelInput,
    currentUser: User,
  ): Promise<ValidateChannelInvitationResult> {
    // 自分自身を除外
    const targetUserIds = input.userIds.filter((id) => id !== currentUser.id);

    // チャンネル存在確認
    const channel = await this.channelDao.findChannelById(input.channelId);
    if (!channel) {
      throw new NotFoundException("指定のチャンネルが見つかりません");
    }

    // ユーザー存在確認
    const existingUsers = await this.authDao.findUsersByIds(targetUserIds);
    const existingUserIds = existingUsers.map((u) => u.id);
    const notFoundUserIds = targetUserIds.filter(
      (id) => !existingUserIds.includes(id),
    );

    // 既存メンバー確認
    const currentMemberIds =
      await this.channelDao.findChannelUserIdsByChannelId(input.channelId);

    // 招待者がチャンネルのメンバーかどうか確認
    if (!currentMemberIds.includes(currentUser.id)) {
      throw new ForbiddenException("参加しているチャンネルのメンバーのみ招待できます");
    }

    const alreadyMemberUsers = existingUsers.filter((user) =>
      currentMemberIds.includes(user.id),
    );
    const validUsers = existingUsers.filter(
      (user) => !currentMemberIds.includes(user.id),
    );

    return {
      validUsers,
      alreadyMemberUsers,
      notFoundUserIds,
    };
  }
}
