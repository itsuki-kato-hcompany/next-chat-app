import { ForbiddenException, Inject, Injectable, Logger, NotFoundException } from "@nestjs/common";
import { User } from "@prisma/client";
import { IAuthDao } from "src/auth/dao/auth.dao.interface";
import { AUTH_DAO_TOKEN } from "src/auth/dao/auth.dao.token";
import { IChannelDao } from "../dao/channel.dao.interface";
import { CHANNEL_DAO_TOKEN } from "../dao/channel.dao.token";
import { InviteToChannelInput } from "../graphql-types/input/invite-to-channel.input";
import { InviteToChannelResult } from "../graphql-types/object/invite-to-channel-result";

@Injectable()
export class InviteToChannelUseCase {
  private readonly logger = new Logger(InviteToChannelUseCase.name);

  constructor(
    @Inject(CHANNEL_DAO_TOKEN) private readonly channelDao: IChannelDao,
    @Inject(AUTH_DAO_TOKEN) private readonly authDao: IAuthDao,
  ) { }

  async execute(input: InviteToChannelInput, currentUser: User): Promise<InviteToChannelResult> {
    // 自分自身を招待リストから除外
    const targetUserIds = input.userIds.filter((id) => id !== currentUser.id);
    
    // チャンネル存在確認
    const channel = await this.channelDao.findChannelById(input.channelId).then((channel) => {
      if (!channel) {
        throw new NotFoundException("指定のチャンネルが見つかりません");
      }
      return channel;
    });

    // ユーザー存在確認
    // 存在するユーザーID、存在しないユーザーIDに分ける
    const existingUsers = await this.authDao.findUsersByIds(targetUserIds);
    const existingUserIds = existingUsers.map((user) => user.id);
    const notFoundUserIds = targetUserIds.filter((id) => !existingUserIds.includes(id));

    // 既存メンバー確認
    const currentMemberIds = await this.channelDao.findChannelUserIdsByChannelId(input.channelId);

    // 招待者がチャンネルのメンバーかどうか確認
    if (!currentMemberIds.includes(currentUser.id)) {
      throw new ForbiddenException("参加しているチャンネルのメンバーのみ招待できます");
    }

    // 既にメンバーのユーザー、招待可能なユーザーに分ける
    const alreadyMemberUsers = existingUsers.filter((user) => currentMemberIds.includes(user.id));
    const invitedUsers = existingUsers.filter((user) => !currentMemberIds.includes(user.id));

    // ログ出力
    // NOTE：存在しないユーザーIDや既にメンバーのユーザーIDは登録をスキップして警告ログとして出力
    if (notFoundUserIds.length > 0) {
      this.logger.warn(`存在しないユーザーID: ${notFoundUserIds.join(", ")}`);
    }
    if (alreadyMemberUsers.length > 0) {
      this.logger.warn(`既にメンバーのユーザーID: ${alreadyMemberUsers.map((u) => u.id).join(", ")}`);
    }

    // 招待実行
    if (invitedUsers.length > 0) {
      await this.channelDao.inviteUsersToChannel(input.channelId, invitedUsers.map((u) => u.id));
    }

    return {
      channel,
      invitedUsers,
      alreadyMemberUsers,
      notFoundUserIds,
    };
  }
}
