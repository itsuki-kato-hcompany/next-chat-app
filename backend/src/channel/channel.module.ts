import { Module } from '@nestjs/common';
import { ChannelResolver } from './channel.resolver';
import { ChannelDao } from './dao/channel.dao';
import { CHANNEL_DAO_TOKEN } from './dao/channel.dao.token';
import { GetChannelsUseCase } from './usecases/get-channels.usecase';
import { GetChannelUseCase } from './usecases/get-channel.usecase';
import { PrismaModule } from 'src/shared/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [
    ChannelResolver,
    {
      provide: CHANNEL_DAO_TOKEN,
      useClass: ChannelDao,
    },
    GetChannelsUseCase,
    GetChannelUseCase,
  ],
})
export class ChannelModule { }