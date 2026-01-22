import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
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
  ) {}

  async execute(refreshToken: string): Promise<AuthTokens> {
    const storedToken = await this.authDao.findRefreshToken(refreshToken);
    if (!storedToken) {
      throw new UnauthorizedException('無効なリフレッシュトークンです');
    }

    // 期限切れなら削除して例外を投げる
    if (new Date() > storedToken.expiredAt) {
      await this.authDao.deleteRefreshToken(refreshToken);
      throw new UnauthorizedException('リフレッシュトークンの有効期限が切れています');
    }

    const user = await this.authDao.findUserById(storedToken.userId);
    if (!user || user.deletedAt) {
      throw new UnauthorizedException('ユーザーが見つかりません');
    }

    // 古いトークンを削除して新しいトークンを発行
    await this.authDao.deleteRefreshToken(refreshToken);

    const accessToken = this.jwtService.sign({ sub: user.id, email: user.email });
    const newRefreshToken = randomBytes(64).toString('hex');

    await this.authDao.createRefreshToken({
      token: newRefreshToken,
      userId: user.id,
      expiredAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 有効期限は7日後
    });

    return { accessToken, refreshToken: newRefreshToken };
  }
}
