import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { OAuthAccount, User } from '@prisma/client';
import { randomBytes } from 'crypto';
import { IAuthDao } from '../dao/auth.dao.interface';
import { AUTH_DAO_TOKEN } from '../dao/auth.dao.token';
import { OAuthUserProfile } from '../strategies/google.strategy';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface OAuthLoginResult {
  user: User;
  tokens: AuthTokens;
}

@Injectable()
export class OAuthLoginUseCase {
  constructor(
    @Inject(AUTH_DAO_TOKEN)
    private readonly authDao: IAuthDao,
    private readonly jwtService: JwtService,
  ) { }

  async execute(profile: OAuthUserProfile): Promise<OAuthLoginResult> {
    // OAuthアカウントを検索
    const oauthAccount = await this.authDao.findOAuthAccount(
      profile.provider,
      profile.providerId,
    );

    // OAuthアカウントが存在する場合は既存のユーザーを更新し、存在しない場合は新規作成する
    const user = oauthAccount
      ? await this.handleExistingOAuthAccount(oauthAccount, profile)
      : await this.handleNewOAuthAccount(profile);

    const tokens = await this.generateTokens(user);

    return { user, tokens };
  }

  private async handleExistingOAuthAccount(
    oauthAccount: OAuthAccount,
    profile: OAuthUserProfile,
  ): Promise<User> {
    const user = await this.authDao.findUserById(oauthAccount.userId);
    if (!user) {
      throw new Error('ユーザーが見つかりません');
    }

    await this.authDao.updateOAuthAccount(oauthAccount.id, {
      accessToken: profile.accessToken,
      refreshToken: profile.refreshToken,
    });

    return this.updateUser(user, profile);
  }

  private async handleNewOAuthAccount(profile: OAuthUserProfile): Promise<User> {
    // 別のOAuthでログインしていた場合に備えて、メールアドレスでユーザーを検索
    const existingUser = await this.authDao.findUserByEmail(profile.email);

    if (!existingUser) {
      throw new Error('ユーザーが見つかりません');
    }

    await this.authDao.createOAuthAccount({
      provider: profile.provider,
      providerId: profile.providerId,
      userId: existingUser.id,
      accessToken: profile.accessToken,
      refreshToken: profile.refreshToken,
    });

    return existingUser;
  }

  private async updateUser(
    user: User,
    profile: OAuthUserProfile,
  ): Promise<User> {
    const updateData: { name?: string; email?: string; profileImgPath?: string } = {};

    // 情報が変更されている場合に更新
    if (profile.name && profile.name !== user.name) {
      updateData.name = profile.name;
    }
    if (profile.email && profile.email !== user.email) {
      updateData.email = profile.email;
    }
    if (profile.profileImgPath && profile.profileImgPath !== user.profileImgPath) {
      updateData.profileImgPath = profile.profileImgPath;
    }

    if (Object.keys(updateData).length > 0) {
      return this.authDao.updateUser(user.id, updateData);
    }

    return user;
  }

  private async generateTokens(user: User): Promise<AuthTokens> {
    const accessToken = this.jwtService.sign({ sub: user.id, email: user.email });
    const refreshToken = randomBytes(64).toString('hex');

    await this.authDao.createRefreshToken({
      token: refreshToken,
      userId: user.id,
      expiredAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    return { accessToken, refreshToken };
  }
}
