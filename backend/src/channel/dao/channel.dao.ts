import { Injectable } from "@nestjs/common";
import { Channel as PrismaChannel } from "@prisma/client";
import { PrismaService } from "src/shared/prisma/prisma.service";
import { CreateChannelData, IChannelDao } from "./channel.dao.interface";

const CHANNEL_ROLE_OWNER = "owner";

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

  async createChannel(data: CreateChannelData): Promise<PrismaChannel> {
    return this.prismaService.$transaction(async (tx) => {
      // チャンネルを作成
      const channel = await tx.channel.create({
        data: {
          name: data.name,
          creatorId: data.creatorId,
          updaterId: data.creatorId,
        },
      });

      // チャンネルの作成者はデフォルトでオーナーでチャンネルに参加する
      await tx.channelUser.create({
        data: {
          userId: data.creatorId,
          channelId: channel.id,
          roleId: CHANNEL_ROLE_OWNER,
        },
      });

      return channel;
    });
  }
}