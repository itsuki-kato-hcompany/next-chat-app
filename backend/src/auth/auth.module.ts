import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PrismaModule } from 'src/shared/prisma/prisma.module';
import { JwtStrategy } from './strategies/jwt.strategy';
import { GoogleStrategy } from './strategies/google.strategy';
import { GitHubStrategy } from './strategies/github.strategy';
import { GqlAuthGuard } from './guards/gql-auth.guard';
import { GoogleAuthGuard } from './guards/google-auth.guard';
import { GitHubAuthGuard } from './guards/github-auth.guard';
import { AuthDao } from './dao/auth.dao';
import { AUTH_DAO_TOKEN } from './dao/auth.dao.token';
import { OAuthLoginUseCase } from './usecases/oauth-login.usecase';
import { RefreshTokenUseCase } from './usecases/refresh-token.usecase';
import { AuthController } from './auth.controller';
import { AuthResolver } from './auth.resolver';

@Module({
  imports: [
    PrismaModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.getOrThrow<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: '15m' as const, // アクセストークンの有効期限
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [
    JwtStrategy,
    GoogleStrategy,
    GitHubStrategy,
    GqlAuthGuard,
    GoogleAuthGuard,
    GitHubAuthGuard,
    {
      provide: AUTH_DAO_TOKEN,
      useClass: AuthDao,
    },
    OAuthLoginUseCase,
    RefreshTokenUseCase,
    AuthResolver,
  ],
  exports: [GqlAuthGuard],
})
export class AuthModule {}
