import { Inject, Injectable, Logger } from "@nestjs/common";
import { User } from "@prisma/client";
import { IChannelDao } from "../dao/channel.dao.interface";
import { CHANNEL_DAO_TOKEN } from "../dao/channel.dao.token";
import { InviteToChannelInput } from "../graphql-types/input/invite-to-channel.input";
import { InviteToChannelResult } from "../graphql-types/object/invite-to-channel-result";
import { ChannelInvitationService } from "../services/channel-invitation.service";

@Injectable()
export class InviteToChannelUseCase {
  private readonly logger = new Logger(InviteToChannelUseCase.name);

  constructor(
    @Inject(CHANNEL_DAO_TOKEN) private readonly channelDao: IChannelDao,
    private readonly channelInvitationService: ChannelInvitationService,
  ) {}

  async execute(input: InviteToChannelInput, currentUser: User): Promise<InviteToChannelResult> {
    const { channel, validUsers, alreadyMemberUsers, notFoundUserIds } =
      await this.channelInvitationService.checkInvitation(
        input.channelId,
        input.userIds,
        currentUser,
      );

    // ログ出力
    // NOTE：存在しないユーザーIDや既にメンバーのユーザーIDは登録をスキップして警告ログとして出力
    if (notFoundUserIds.length > 0) {
      this.logger.warn(`存在しないユーザーID: ${notFoundUserIds.join(", ")}`);
    }
    if (alreadyMemberUsers.length > 0) {
      this.logger.warn(`既にメンバーのユーザーID: ${alreadyMemberUsers.map((u) => u.id).join(", ")}`);
    }

    // 招待実行
    if (validUsers.length > 0) {
      await this.channelDao.inviteUsersToChannel(input.channelId, validUsers.map((u) => u.id));
    }

    return {
      channel,
      invitedUsers: validUsers,
      alreadyMemberUsers,
      notFoundUserIds,
    };
  }
}
