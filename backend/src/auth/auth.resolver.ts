import { Args, Resolver, Query, Mutation, Context, Int } from '@nestjs/graphql';
import { Inject, UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User as PrismaUser } from '@prisma/client';
import { Request, Response } from 'express';
import { User } from 'src/user/graphql-types/object/user';
import { GqlAuthGuard } from './guards/gql-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import { RefreshTokenUseCase } from './usecases/refresh-token.usecase';
import { AuthTokens } from './graphql-types/object/auth-response';
import { IAuthDao } from './dao/auth.dao.interface';
import { AUTH_DAO_TOKEN } from './dao/auth.dao.token';

@Resolver()
export class AuthResolver {
  constructor(
    private readonly refreshTokenUseCase: RefreshTokenUseCase,
    private readonly jwtService: JwtService,
    @Inject(AUTH_DAO_TOKEN) private readonly authDao: IAuthDao,
  ) {}

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

  /**
   * 開発環境用: テスト用のアクセストークンを取得
   * ユーザーIDを指定してアクセストークンを生成する
   */
  @Query(() => AuthTokens, {
    name: 'getAccessToken',
    description: '開発環境専用: テスト用アクセストークン取得',
  })
  async getAccessToken(@Args('userId', { type: () => Int }) userId: number): Promise<AuthTokens> {
    // 本番環境では使用不可
    if (process.env.NODE_ENV === 'production') {
      throw new Error('このエンドポイントは本番環境では使用できません');
    }

    const user = await this.authDao.findUserById(userId);
    if (!user) {
      throw new Error('ユーザーが見つかりません');
    }

    const accessToken = this.jwtService.sign({
      sub: user.id,
      email: user.email,
    });

    return { accessToken };
  }
}
