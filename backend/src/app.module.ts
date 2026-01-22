// src/app.module.ts

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { MessageModule } from './message/message.module';
import { ChannelModule } from './channel/channel.module';
import { PrismaModule } from './shared/prisma/prisma.module';
import { PubSubModule } from './shared/pubsub/pubsub.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      playground: true,
      // Subscriptionsの設定
      subscriptions: {
        'graphql-ws': true, // WebSocketプロトコルを有効化
        'subscriptions-transport-ws': true,
      },
      // ResolverでCookieにアクセスするための設定
      // 参照：https://github.com/nestjs/graphql/issues/119
      context: ({ req, res }) => ({ req, res }),
    }),
    PrismaModule,
    PubSubModule,
    AuthModule,
    MessageModule,
    ChannelModule,
  ],
  providers: [],
})
export class AppModule {}
