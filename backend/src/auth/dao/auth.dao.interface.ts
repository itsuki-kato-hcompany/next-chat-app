import { User, OAuthAccount, RefreshToken } from '@prisma/client';

export interface CreateUserInput {
  name: string;
  email: string;
  profileImgPath?: string;
}

export interface CreateOAuthAccountInput {
  provider: string;
  providerId: string;
  userId: number;
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: Date;
}

export interface CreateRefreshTokenInput {
  token: string;
  userId: number;
  expiredAt: Date;
}

export interface IAuthDao {
  findUserByEmail(email: string): Promise<User | null>;
  findUserById(id: number): Promise<User | null>;
  createUser(input: CreateUserInput): Promise<User>;
  updateUser(id: number, data: Partial<CreateUserInput>): Promise<User>;

  findOAuthAccount(provider: string, providerId: string): Promise<OAuthAccount | null>;
  createOAuthAccount(input: CreateOAuthAccountInput): Promise<OAuthAccount>;
  updateOAuthAccount(id: number, data: Partial<CreateOAuthAccountInput>): Promise<OAuthAccount>;

  createRefreshToken(input: CreateRefreshTokenInput): Promise<RefreshToken>;
  findRefreshToken(token: string): Promise<RefreshToken | null>;
  deleteRefreshToken(token: string): Promise<void>;
  deleteUserRefreshTokens(userId: number): Promise<void>;
}
