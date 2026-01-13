import { Injectable } from '@nestjs/common';
import { User, OAuthAccount, RefreshToken } from '@prisma/client';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import {
  IAuthDao,
  CreateUserInput,
  CreateOAuthAccountInput,
  CreateRefreshTokenInput,
} from './auth.dao.interface';

@Injectable()
export class AuthDao implements IAuthDao {
  constructor(private readonly prisma: PrismaService) {}

  async findUserByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async findUserById(id: number): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async createUser(input: CreateUserInput): Promise<User> {
    return this.prisma.user.create({
      data: {
        name: input.name,
        email: input.email,
        profileImgPath: input.profileImgPath,
      },
    });
  }

  async updateUser(id: number, data: Partial<CreateUserInput>): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data,
    });
  }

  async findOAuthAccount(
    provider: string,
    providerId: string,
  ): Promise<OAuthAccount | null> {
    return this.prisma.oAuthAccount.findUnique({
      where: {
        provider_providerId: {
          provider,
          providerId,
        },
      },
    });
  }

  async createOAuthAccount(
    input: CreateOAuthAccountInput,
  ): Promise<OAuthAccount> {
    return this.prisma.oAuthAccount.create({
      data: {
        provider: input.provider,
        providerId: input.providerId,
        userId: input.userId,
        accessToken: input.accessToken,
        refreshToken: input.refreshToken,
        expiresAt: input.expiresAt,
      },
    });
  }

  async updateOAuthAccount(
    id: number,
    data: Partial<CreateOAuthAccountInput>,
  ): Promise<OAuthAccount> {
    return this.prisma.oAuthAccount.update({
      where: { id },
      data,
    });
  }

  async createRefreshToken(
    input: CreateRefreshTokenInput,
  ): Promise<RefreshToken> {
    return this.prisma.refreshToken.create({
      data: {
        token: input.token,
        userId: input.userId,
        expiredAt: input.expiredAt,
      },
    });
  }

  async findRefreshToken(token: string): Promise<RefreshToken | null> {
    return this.prisma.refreshToken.findUnique({
      where: { token },
    });
  }

  async deleteRefreshToken(token: string): Promise<void> {
    await this.prisma.refreshToken.delete({
      where: { token },
    });
  }
}
