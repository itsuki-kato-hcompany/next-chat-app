// src/app.module.ts

import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { AppResolver } from './app.resolver';
import { MessageModule } from './message/message.module';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      playground: true,
      // Subscriptionsの設定
      subscriptions: {
        'graphql-ws': true, // WebSocketプロトコルを有効化
      },
    }),
    MessageModule,
  ],
  providers: [AppResolver],
})
export class AppModule {}
