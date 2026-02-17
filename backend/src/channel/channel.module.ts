import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { PrismaModule } from 'src/shared/prisma/prisma.module';
import { ChannelResolver } from './channel.resolver';
import { ChannelDao } from './dao/channel.dao';
import { CHANNEL_DAO_TOKEN } from './dao/channel.dao.token';
import { ChannelInvitationService } from './services/channel-invitation.service';
import { CheckChannelInvitationUseCase } from './usecases/check-channel-invitation.usecase';
import { CreateChannelUseCase } from './usecases/create-channel.usecase';
import { GetChannelUseCase } from './usecases/get-channel.usecase';
import { GetChannelsUseCase } from './usecases/get-channels.usecase';
import { GetAvailableChannelsUseCase } from './usecases/get-available-channels.usecase';
import { GetMyChannelsUseCase } from './usecases/get-my-channels.usecase';
import { InviteToChannelUseCase } from './usecases/invite-to-channel.usecase';
import { JoinChannelUseCase } from './usecases/join-channel.usecase';

@Module({
  imports: [PrismaModule, AuthModule],
  providers: [
    ChannelResolver,
    {
      provide: CHANNEL_DAO_TOKEN,
      useClass: ChannelDao,
    },
    ChannelInvitationService,
    CreateChannelUseCase,
    GetChannelUseCase,
    GetChannelsUseCase,
    InviteToChannelUseCase,
    JoinChannelUseCase,
    CheckChannelInvitationUseCase,
    GetMyChannelsUseCase,
    GetAvailableChannelsUseCase,
  ],
})
export class ChannelModule {}
