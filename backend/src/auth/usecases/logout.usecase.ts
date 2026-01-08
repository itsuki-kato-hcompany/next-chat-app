import { Inject, Injectable } from '@nestjs/common';
import { IAuthDao } from '../dao/auth.dao.interface';
import { AUTH_DAO_TOKEN } from '../dao/auth.dao.token';

@Injectable()
export class LogoutUseCase {
  constructor(
    @Inject(AUTH_DAO_TOKEN)
    private readonly authDao: IAuthDao,
  ) {}

  async execute(userId: number, refreshToken?: string): Promise<void> {
    if (refreshToken) {
      // 特定のリフレッシュトークンのみ削除
      try {
        await this.authDao.deleteRefreshToken(refreshToken);
      } catch {
        // トークンが存在しない場合は無視
      }
    } else {
      // 全てのリフレッシュトークンを削除（全デバイスからログアウト）
      await this.authDao.deleteUserRefreshTokens(userId);
    }
  }
}
