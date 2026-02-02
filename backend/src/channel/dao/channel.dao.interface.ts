import { Channel as PrismaChannel } from "@prisma/client";

export interface CreateChannelData {
  name: string;
  creatorId: number;
}

export interface IChannelDao {
  findAllChannels(): Promise<PrismaChannel[]>;

  findChannelById(id: number): Promise<PrismaChannel | null>;

  createChannel(data: CreateChannelData): Promise<PrismaChannel>;
}