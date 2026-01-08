import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { User } from '@prisma/client';
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
    private readonly configService: ConfigService,
  ) {}

  async execute(profile: OAuthUserProfile): Promise<OAuthLoginResult> {
    // 1. OAuthアカウントを検索
    let oauthAccount = await this.authDao.findOAuthAccount(
      profile.provider,
      profile.providerId,
    );

    let user: User;

    if (oauthAccount) {
      // 既存のOAuthアカウントがある場合、ユーザーを取得
      user = (await this.authDao.findUserById(oauthAccount.userId))!;

      // OAuthアカウントのトークンを更新
      await this.authDao.updateOAuthAccount(oauthAccount.id, {
        accessToken: profile.accessToken,
        refreshToken: profile.refreshToken,
      });

      // ユーザー情報を更新（名前、メール、プロフィール画像）
      const updateData: { name?: string; email?: string; profileImgPath?: string } = {};

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
        user = await this.authDao.updateUser(user.id, updateData);
      }
    } else {
      // 新規ユーザーの場合
      // まずemailで既存ユーザーを検索
      user = await this.authDao.findUserByEmail(profile.email) as User;

      if (!user) {
        // ユーザーが存在しない場合は作成
        user = await this.authDao.createUser({
          name: profile.name,
          email: profile.email,
          profileImgPath: profile.profileImgPath,
        });
      }

      // OAuthアカウントを作成
      await this.authDao.createOAuthAccount({
        provider: profile.provider,
        providerId: profile.providerId,
        userId: user.id,
        accessToken: profile.accessToken,
        refreshToken: profile.refreshToken,
      });
    }

    // 2. トークンを生成
    const tokens = await this.generateTokens(user);

    return { user, tokens };
  }

  private async generateTokens(user: User): Promise<AuthTokens> {
    // Access Token生成（expiresInはJwtModule設定を使用）
    const accessToken = this.jwtService.sign({ sub: user.id, email: user.email });

    // Refresh Token生成
    const refreshToken = randomBytes(64).toString('hex');
    const refreshTokenExpiresIn = this.configService.get<string>(
      'REFRESH_TOKEN_EXPIRES_IN',
      '7d',
    );

    // Refresh Tokenの有効期限を計算
    const expiredAt = this.calculateExpiredAt(refreshTokenExpiresIn);

    // Refresh TokenをDBに保存
    await this.authDao.createRefreshToken({
      token: refreshToken,
      userId: user.id,
      expiredAt,
    });

    return { accessToken, refreshToken };
  }

  private calculateExpiredAt(expiresIn: string): Date {
    const match = expiresIn.match(/^(\d+)([smhd])$/);
    if (!match) {
      return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // default 7 days
    }

    const value = parseInt(match[1], 10);
    const unit = match[2];

    const multipliers: Record<string, number> = {
      s: 1000,
      m: 60 * 1000,
      h: 60 * 60 * 1000,
      d: 24 * 60 * 60 * 1000,
    };

    return new Date(Date.now() + value * multipliers[unit]);
  }
}
