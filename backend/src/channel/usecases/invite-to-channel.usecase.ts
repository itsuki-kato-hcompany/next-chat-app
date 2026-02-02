import { Inject, Injectable, Logger, NotFoundException } from "@nestjs/common";
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

  async execute(input: InviteToChannelInput): Promise<InviteToChannelResult> {
    // チャンネル存在確認
    const channel = await this.channelDao.findChannelById(input.channelId).then((channel) => {
      if (!channel) {
        throw new NotFoundException("指定のチャンネルが見つかりません");
      }
      return channel;
    });

    // ユーザー存在確認
    // 存在するユーザーID、存在しないユーザーIDに分ける
    const existingUsers = await this.authDao.findUsersByIds(input.userIds);
    const existingUserIds = existingUsers.map((user) => user.id);
    const notFoundUserIds = input.userIds.filter((id) => !existingUserIds.includes(id));

    // 既存メンバー確認
    // 既にメンバーのユーザーID、招待可能なユーザーIDに分ける
    const currentMemberIds = await this.channelDao.findChannelUserIdsByChannelId(input.channelId);
    const alreadyMemberUserIds = existingUserIds.filter((id) => currentMemberIds.includes(id));
    const usersToInvite = existingUserIds.filter((id) => !currentMemberIds.includes(id));

    // ログ出力
    // NOTE：存在しないユーザーIDや既にメンバーのユーザーIDは登録をスキップして警告ログとして出力
    if (notFoundUserIds.length > 0) {
      this.logger.warn(`存在しないユーザーID: ${notFoundUserIds.join(", ")}`);
    }
    if (alreadyMemberUserIds.length > 0) {
      this.logger.warn(`既にメンバーのユーザーID: ${alreadyMemberUserIds.join(", ")}`);
    }

    // 招待実行
    if (usersToInvite.length > 0) {
      await this.channelDao.inviteUsersToChannel(input.channelId, usersToInvite);
    }

    return {
      channel,
      invitedUserIds: usersToInvite,
      alreadyMemberUserIds,
      notFoundUserIds,
    };
  }
}
