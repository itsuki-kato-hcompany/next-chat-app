import { Module } from '@nestjs/common';
import { MessageResolver } from './message.resolver';
import { MessageDao } from './dao/message.dao';
import { GetMessagesUseCase } from './usecases/get-messages.usecase';
import { CreateMessageUseCase } from './usecases/create-message.usecase';
import { PrismaModule } from 'src/shared/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [
    MessageResolver,
    MessageDao,
    GetMessagesUseCase,
    CreateMessageUseCase
  ],
})
export class MessageModule { }
