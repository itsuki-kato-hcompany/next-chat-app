import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PrismaModule } from 'src/shared/prisma/prisma.module';

// Strategies
import { JwtStrategy } from './strategies/jwt.strategy';
import { GoogleStrategy } from './strategies/google.strategy';
import { GitHubStrategy } from './strategies/github.strategy';

// Guards
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { GqlAuthGuard } from './guards/gql-auth.guard';
import { GoogleAuthGuard } from './guards/google-auth.guard';
import { GitHubAuthGuard } from './guards/github-auth.guard';

// DAO
import { AuthDao } from './dao/auth.dao';
import { AUTH_DAO_TOKEN } from './dao/auth.dao.token';

// UseCases
import { OAuthLoginUseCase } from './usecases/oauth-login.usecase';
import { RefreshTokenUseCase } from './usecases/refresh-token.usecase';
import { LogoutUseCase } from './usecases/logout.usecase';

// Controller & Resolver
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
          expiresIn: '15m' as const,
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [
    // Strategies
    JwtStrategy,
    GoogleStrategy,
    GitHubStrategy,

    // Guards
    JwtAuthGuard,
    GqlAuthGuard,
    GoogleAuthGuard,
    GitHubAuthGuard,

    // DAO
    {
      provide: AUTH_DAO_TOKEN,
      useClass: AuthDao,
    },

    // UseCases
    OAuthLoginUseCase,
    RefreshTokenUseCase,
    LogoutUseCase,

    // Resolver
    AuthResolver,
  ],
  exports: [JwtAuthGuard, GqlAuthGuard],
})
export class AuthModule {}
