import { User } from "@prisma/client";

export interface IChannelUserDao {
  isChannelMember(channelId: number, userId: number): Promise<boolean>;
  findInvitableUsersByChannelId(channelId: number, query: string, limit: number, offset: number): Promise<User[]>;
}
