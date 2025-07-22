import { PrismaService } from "src/shared/prisma/prisma.service";
import { CreateMessageInput } from "../graphql-types/input/create-message.input";
import { Message, Prisma } from "@prisma/client";
import { Injectable } from "@nestjs/common";

@Injectable()
export class MessageDao {
  constructor(private readonly prismaService: PrismaService) { }

  async createMessage(createMessageInput: CreateMessageInput): Promise<Message> {
    return this.prismaService.message.create({
      data: {
        message: createMessageInput.message,
      },
    });
  }

  async findAllMessages(): Promise<Message[]> {
    return this.prismaService.message.findMany();
  }

  async findMessageById(id: number): Promise<Message | null> {
    return this.prismaService.message.findUnique({
      where: { id },
    });
  }

  async findMessagesByChannel(
    channelId: number,
    limit: number = 50,
    offset: number = 0
  ): Promise<(Message & { user: any; channel: any })[]> {
    return this.prismaService.message.findMany({
      where: {
        channelId: channelId,
      },
      include: {
        user: true,
        channel: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
      skip: offset,
    });
  }
}