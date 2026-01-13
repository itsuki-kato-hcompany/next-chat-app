import { PrismaService } from "src/shared/prisma/prisma.service";
import { CreateMessageInput } from "../graphql-types/input/create-message.input";
import { Injectable } from "@nestjs/common";
import { Message as PrismaMessage } from "@prisma/client";
import { IMessageDao } from "./message.dao.interface";

@Injectable()
export class MessageDao implements IMessageDao {
  constructor(private readonly prismaService: PrismaService) { }

  async createMessage(createMessageInput: CreateMessageInput): Promise<PrismaMessage> {
    return this.prismaService.message.create({
      data: {
        message: createMessageInput.message,
        userId: createMessageInput.userId,
        channelId: createMessageInput.channelId,
      },
      include: {
        user: true,
        channel: true,
      },
    });
  }

  async findAllMessages(): Promise<PrismaMessage[]> {
    return this.prismaService.message.findMany();
  }

  async findMessageById(id: number): Promise<PrismaMessage | null> {
    return this.prismaService.message.findUnique({
      where: { id },
    });
  }

  async findMessagesByChannel(
    channelId: number,
    limit: number = 50,
    offset: number = 0
  ): Promise<(PrismaMessage)[]> {
    return this.prismaService.message.findMany({
      where: {
        channelId: channelId,
      },
      include: {
        user: true,
        channel: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
      take: limit,
      skip: offset,
    });
  }
}