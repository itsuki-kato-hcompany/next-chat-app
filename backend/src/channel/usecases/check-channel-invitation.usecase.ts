import { Injectable } from "@nestjs/common";
import { User } from "@prisma/client";
import { InviteToChannelInput } from "../graphql-types/input/invite-to-channel.input";
import { CheckChannelInvitationResult } from "../graphql-types/object/check-channel-invitation-result";
import { ChannelInvitationService } from "../services/channel-invitation.service";

@Injectable()
export class CheckChannelInvitationUseCase {
  constructor(
    private readonly channelInvitationService: ChannelInvitationService,
  ) {}

  async execute(
    input: InviteToChannelInput,
    currentUser: User,
  ): Promise<CheckChannelInvitationResult> {
    const { validUsers, alreadyMemberUsers, notFoundUserIds } =
      await this.channelInvitationService.checkInvitation(
        input.channelId,
        input.userIds,
        currentUser,
      );

    return {
      validUsers,
      alreadyMemberUsers,
      notFoundUserIds,
    };
  }
}
