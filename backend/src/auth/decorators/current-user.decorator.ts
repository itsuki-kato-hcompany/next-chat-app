import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { User } from '@prisma/client';

/**
 * GraphQL Resolver用のカスタムパラメータデコレータ
 * GqlAuthGuardで認証済みのユーザー情報をreq.userから取得して注入する
 */
export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext): User => {
    // GraphQL用のコンテキストに変換してreq.userを取得
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req.user;
  },
);
