import { Resolver, Query, Mutation, Context } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { User as PrismaUser } from '@prisma/client';
import { Request, Response } from 'express';
import { User } from 'src/user/graphql-types/object/user';
import { GqlAuthGuard } from './guards/gql-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import { RefreshTokenUseCase } from './usecases/refresh-token.usecase';
import { AuthTokens } from './graphql-types/object/auth-response';

@Resolver()
export class AuthResolver {
  constructor(private readonly refreshTokenUseCase: RefreshTokenUseCase) {}

  /**
   * 現在ログイン中のユーザー情報を取得
   * @CurrentUser - JWTから取得したユーザー情報を注入するカスタムデコレータ
   */
  @Query(() => User, { name: 'me', nullable: true })
  @UseGuards(GqlAuthGuard)
  async me(@CurrentUser() user: PrismaUser): Promise<User> {
    return user as User;
  }

  /**
   * リフレッシュトークンを使って新しいアクセストークンを取得
   * @Context - GraphQLコンテキストからreq/resオブジェクトを取得（Cookie操作に必要）
   */
  @Mutation(() => AuthTokens)
  async refreshToken(
    @Context() context: { req: Request; res: Response },
  ): Promise<AuthTokens> {
    // HTTP-only CookieからリフレッシュトークンをUseCaseに渡す
    const refreshToken = context.req.cookies?.refreshToken;

    if (!refreshToken) {
      throw new Error('リフレッシュトークンが見つかりません');
    }

    const tokens = await this.refreshTokenUseCase.execute(refreshToken);

    // 新しいリフレッシュトークンをHTTP-only Cookieに設定
    context.res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/',
    });

    return { accessToken: tokens.accessToken };
  }

  // TODO: ログアウト処理の実装
}
