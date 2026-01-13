import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-github2';
import { OAuthUserProfile } from './google.strategy';

@Injectable()
export class GitHubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor(configService: ConfigService) {
    super({
      clientID: configService.getOrThrow<string>('GITHUB_CLIENT_ID'),
      clientSecret: configService.getOrThrow<string>('GITHUB_CLIENT_SECRET'),
      callbackURL: configService.getOrThrow<string>('GITHUB_CALLBACK_URL'),
      scope: ['user:email'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: (err: Error | null, user?: OAuthUserProfile) => void,
  ): Promise<void> {
    const { id, emails, displayName, username, photos } = profile;

    const user: OAuthUserProfile = {
      provider: 'github',
      providerId: id,
      email: emails?.[0]?.value ?? '',
      name: displayName || username || 'Unknown',
      profileImgPath: photos?.[0]?.value,
      accessToken,
      refreshToken,
    };

    done(null, user);
  }
}
