import { PrismaService } from "src/shared/prisma/prisma.service";
import { CreateMessageInput } from "../graphql-types/input/create-message.input";
import { Injectable } from "@nestjs/common";
import { Message as PrismaMessage } from "@prisma/client";

@Injectable()
export class MessageDao {
  constructor(private readonly prismaService: PrismaService) { }

  async createMessage(createMessageInput: CreateMessageInput): Promise<PrismaMessage> {
    console.log('CreateMessageInput received:', createMessageInput);
    console.log('userId:', createMessageInput.userId, 'type:', typeof createMessageInput.userId);
    console.log('channelId:', createMessageInput.channelId, 'type:', typeof createMessageInput.channelId);
    
    const data = {
      message: createMessageInput.message,
      userId: createMessageInput.userId,
      channelId: createMessageInput.channelId,
    };
    
    console.log('Data being sent to Prisma:', data);
    
    return this.prismaService.message.create({
      data,
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
  ): Promise<(PrismaMessage & { user: any; channel: any })[]> {
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