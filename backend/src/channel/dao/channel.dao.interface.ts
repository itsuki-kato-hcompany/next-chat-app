import { Channel } from "@prisma/client";
import { CreateChannelInput } from "../graphql-types/input/create-channel.input";
import { JoinChannelInput } from "../graphql-types/input/join-channel.input";

export interface IChannelDao {
  findAllChannels(): Promise<Channel[]>;

  findChannelById(id: number): Promise<Channel | null>;

  createChannel(input: CreateChannelInput, userId: number): Promise<Channel>;

  joinChannel(input: JoinChannelInput, userId: number): Promise<Channel>;

  findChannelUserIdsByChannelId(channelId: number): Promise<number[]>;

  inviteUsersToChannel(channelId: number, userIds: number[]): Promise<void>;

  findChannelsByUserId(userId: number, limit: number, offset: number): Promise<Channel[]>;

  findAvailableChannelsByUserId(userId: number, limit: number, offset: number): Promise<Channel[]>;
}
