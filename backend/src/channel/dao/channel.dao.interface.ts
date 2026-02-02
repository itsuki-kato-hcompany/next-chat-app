import { Channel } from "@prisma/client";
import { CreateChannelInput } from "../graphql-types/input/create-channel.input";
import { JoinChannelInput } from "../graphql-types/input/join-channel.input";

export interface IChannelDao {
  findAllChannels(): Promise<Channel[]>;

  findChannelById(id: number): Promise<Channel | null>;

  createChannel(input: CreateChannelInput, userId: number): Promise<Channel>;

  joinChannel(input: JoinChannelInput, userId: number): Promise<Channel>;
}
