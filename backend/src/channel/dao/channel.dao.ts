import { Injectable } from "@nestjs/common";
import { Channel as PrismaChannel } from "@prisma/client";
import { PrismaService } from "src/shared/prisma/prisma.service";
import { IChannelDao } from "./channel.dao.interface";

@Injectable()
export class ChannelDao implements IChannelDao {
  constructor(private readonly prismaService: PrismaService) { }

  async findAllChannels(): Promise<PrismaChannel[]> {
    return this.prismaService.channel.findMany({
      where: {
        deletedAt: null,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });
  }

  async findChannelById(id: number): Promise<PrismaChannel | null> {
    return this.prismaService.channel.findUnique({
      where: { 
        id,
        deletedAt: null,
      },
    });
  }
}