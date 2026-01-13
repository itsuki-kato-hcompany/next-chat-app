import { Channel as PrismaChannel } from "@prisma/client";

export interface IChannelDao {
  findAllChannels(): Promise<PrismaChannel[]>;
  
  findChannelById(id: number): Promise<PrismaChannel | null>;
}