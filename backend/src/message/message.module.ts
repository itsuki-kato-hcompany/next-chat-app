import { Module } from '@nestjs/common';
import { MessageResolver } from './message.resolver';
import { MessageDao } from './dao/message.dao';
import { PrismaModule } from 'src/shared/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [MessageResolver, MessageDao],
})
export class MessageModule { }
