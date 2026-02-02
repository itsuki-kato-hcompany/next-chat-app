import { Injectable } from "@nestjs/common";
import { Channel } from "@prisma/client";
import { PrismaService } from "src/shared/prisma/prisma.service";
import { ChannelRole } from "src/shared/graphql-types/enums/channel-role.enum";
import { CreateChannelInput } from "../graphql-types/input/create-channel.input";
import { JoinChannelInput } from "../graphql-types/input/join-channel.input";
import { IChannelDao } from "./channel.dao.interface";

@Injectable()
export class ChannelDao implements IChannelDao {
  constructor(private readonly prismaService: PrismaService) { }

  async findAllChannels(): Promise<Channel[]> {
    return this.prismaService.channel.findMany({
      where: {
        deletedAt: null,
      },
      orderBy: {
        createdAt: "asc",
      },
    });
  }

  async findChannelById(id: number): Promise<Channel | null> {
    return this.prismaService.channel.findUnique({
      where: {
        id,
        deletedAt: null,
      },
    });
  }

  async createChannel(
    input: CreateChannelInput,
    userId: number,
  ): Promise<Channel> {
    return this.prismaService.$transaction(async (tx) => {
      // チャンネルを作成
      const channel = await tx.channel.create({
        data: {
          name: input.name,
          creatorId: userId,
          updaterId: userId,
        },
      });

      // チャンネルの作成者はデフォルトでオーナーでチャンネルに参加する
      await tx.channelUser.create({
        data: {
          userId: userId,
          channelId: channel.id,
          roleId: ChannelRole.OWNER,
        },
      });

      return channel;
    });
  }

  async joinChannel(
    input: JoinChannelInput,
    userId: number,
  ): Promise<Channel> {
    // ChannelUserを作成（参加の場合はデフォルトmemberロール）
    await this.prismaService.channelUser.create({
      data: {
        userId: userId,
        channelId: input.channelId,
        roleId: ChannelRole.MEMBER,
      },
    });

    return this.prismaService.channel.findUniqueOrThrow({
      where: { id: input.channelId },
    });
  }
}
