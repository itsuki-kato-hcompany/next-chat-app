import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { randomBytes } from 'crypto';
import { IAuthDao } from '../dao/auth.dao.interface';
import { AUTH_DAO_TOKEN } from '../dao/auth.dao.token';
import { AuthTokens } from './oauth-login.usecase';

@Injectable()
export class RefreshTokenUseCase {
  constructor(
    @Inject(AUTH_DAO_TOKEN)
    private readonly authDao: IAuthDao,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async execute(refreshToken: string): Promise<AuthTokens> {
    // 1. リフレッシュトークンを検索
    const storedToken = await this.authDao.findRefreshToken(refreshToken);

    if (!storedToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    // 2. 有効期限をチェック
    if (new Date() > storedToken.expiredAt) {
      await this.authDao.deleteRefreshToken(refreshToken);
      throw new UnauthorizedException('Refresh token expired');
    }

    // 3. ユーザーを取得
    const user = await this.authDao.findUserById(storedToken.userId);

    if (!user || user.deletedAt) {
      throw new UnauthorizedException('User not found');
    }

    // 4. 古いリフレッシュトークンを削除
    await this.authDao.deleteRefreshToken(refreshToken);

    // 5. 新しいトークンを生成（expiresInはJwtModule設定を使用）
    const accessToken = this.jwtService.sign({ sub: user.id, email: user.email });

    const newRefreshToken = randomBytes(64).toString('hex');
    const refreshTokenExpiresIn = this.configService.get<string>(
      'REFRESH_TOKEN_EXPIRES_IN',
      '7d',
    );

    const expiredAt = this.calculateExpiredAt(refreshTokenExpiresIn);

    await this.authDao.createRefreshToken({
      token: newRefreshToken,
      userId: user.id,
      expiredAt,
    });

    return { accessToken, refreshToken: newRefreshToken };
  }

  private calculateExpiredAt(expiresIn: string): Date {
    const match = expiresIn.match(/^(\d+)([smhd])$/);
    if (!match) {
      return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
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
