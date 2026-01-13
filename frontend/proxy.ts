import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const refreshToken = request.cookies.get('refreshToken');

  if (!refreshToken) {
    // リフレッシュトークンがない場合はログインページへリダイレクト
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  // APIルート・静的ファイル・画像・ログインページ・OAuthコールバックページを除外
  matcher: ['/((?!api|_next/static|_next/image|login|auth/callback|favicon.ico).*)'],
};
