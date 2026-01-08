import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import { GoogleAuthGuard } from './guards/google-auth.guard';
import { GitHubAuthGuard } from './guards/github-auth.guard';
import { OAuthLoginUseCase } from './usecases/oauth-login.usecase';
import { OAuthUserProfile } from './strategies/google.strategy';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly oauthLoginUseCase: OAuthLoginUseCase,
    private readonly configService: ConfigService,
  ) {}

  // Google OAuth
  @Get('google')
  @UseGuards(GoogleAuthGuard)
  googleAuth() {
    // Passportがリダイレクトを処理
  }

  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  async googleAuthCallback(@Req() req: Request, @Res() res: Response) {
    return this.handleOAuthCallback(req, res);
  }

  // GitHub OAuth
  @Get('github')
  @UseGuards(GitHubAuthGuard)
  githubAuth() {
    // Passportがリダイレクトを処理
  }

  @Get('github/callback')
  @UseGuards(GitHubAuthGuard)
  async githubAuthCallback(@Req() req: Request, @Res() res: Response) {
    return this.handleOAuthCallback(req, res);
  }

  private async handleOAuthCallback(req: Request, res: Response) {
    const profile = req.user as OAuthUserProfile;
    const { tokens } = await this.oauthLoginUseCase.execute(profile);

    // Refresh TokenをHTTP-only Cookieに設定
    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: '/',
    });

    // Access TokenをCookieに設定
    res.cookie('accessToken', tokens.accessToken, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 15 * 60 * 1000, // 15分
      path: '/',
    });

    // フロントエンドにリダイレクト（トークンなし）
    const frontendUrl = this.configService.get<string>(
      'FRONTEND_URL',
      'http://localhost:3001',
    );

    return res.redirect(`${frontendUrl}/auth/callback`);
  }
}
