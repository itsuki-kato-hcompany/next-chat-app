import { Resolver, Query, Mutation, Context } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { User as PrismaUser } from '@prisma/client';
import { Request, Response } from 'express';
import { User } from 'src/user/graphql-types/object/user';
import { GqlAuthGuard } from './guards/gql-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import { RefreshTokenUseCase } from './usecases/refresh-token.usecase';
import { LogoutUseCase } from './usecases/logout.usecase';
import { AuthTokens } from './graphql-types/object/auth-response';

@Resolver()
export class AuthResolver {
  constructor(
    private readonly refreshTokenUseCase: RefreshTokenUseCase,
    private readonly logoutUseCase: LogoutUseCase,
  ) {}

  @Query(() => User, { name: 'me', nullable: true })
  @UseGuards(GqlAuthGuard)
  async me(@CurrentUser() user: PrismaUser): Promise<User> {
    return user as User;
  }

  @Mutation(() => AuthTokens)
  async refreshToken(
    @Context() context: { req: Request; res: Response },
  ): Promise<AuthTokens> {
    const refreshToken = context.req.cookies?.refreshToken;

    if (!refreshToken) {
      throw new Error('Refresh token not found');
    }

    const tokens = await this.refreshTokenUseCase.execute(refreshToken);

    // 新しいRefresh TokenをCookieに設定
    context.res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/',
    });

    return { accessToken: tokens.accessToken };
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async logout(
    @CurrentUser() user: PrismaUser,
    @Context() context: { req: Request; res: Response },
  ): Promise<boolean> {
    const refreshToken = context.req.cookies?.refreshToken;

    await this.logoutUseCase.execute(user.id, refreshToken);

    // Cookieを削除
    context.res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });

    return true;
  }
}
