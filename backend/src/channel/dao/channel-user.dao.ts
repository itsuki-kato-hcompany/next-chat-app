import { Injectable } from "@nestjs/common";
import { User } from "@prisma/client";
import { PrismaService } from "src/shared/prisma/prisma.service";
import { IChannelUserDao } from "./channel-user.dao.interface";

@Injectable()
export class ChannelUserDao implements IChannelUserDao {
  constructor(private readonly prismaService: PrismaService) {}

  async isChannelMember(channelId: number, userId: number): Promise<boolean> {
    const channelUser = await this.prismaService.channelUser.findFirst({
      where: {
        channelId,
        userId,
        deletedAt: null,
      },
    });
    return channelUser !== null;
  }

  async findInvitableUsersByChannelId(
    channelId: number,
    query: string,
    limit: number = 50,
    offset: number = 0,
  ): Promise<User[]> {
    return this.prismaService.user.findMany({
      where: {
        deletedAt: null,
        channels: {
          none: {
            channelId, // すでにチャンネルに参加しているユーザーは除外（自分自身も含む）
            deletedAt: null,
          },
        },
        OR: [ // 名前またはメールアドレスにクエリが部分一致するユーザーを検索
          { name: { contains: query, mode: "insensitive" } },
          { email: { contains: query, mode: "insensitive" } },
        ],
      },
      orderBy: {
        name: "asc",
      },
      take: limit,
      skip: offset,
    });
  }
}
