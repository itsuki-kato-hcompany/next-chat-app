const TOKEN_COOKIE_NAME = 'accessToken';
const TOKEN_MAX_AGE = 7 * 24 * 60 * 60; // 7日

export function setTokenCookie(token: string): void {
  document.cookie = `${TOKEN_COOKIE_NAME}=${encodeURIComponent(token)}; path=/; max-age=${TOKEN_MAX_AGE}; SameSite=Lax`;
}

export function getTokenCookie(): string | null {
  if (typeof window === 'undefined') return null;
  const match = document.cookie.match(
    new RegExp(`(?:^|; )${TOKEN_COOKIE_NAME}=([^;]*)`)
  );
  return match ? decodeURIComponent(match[1]) : null;
}

export function removeTokenCookie(): void {
  document.cookie = `${TOKEN_COOKIE_NAME}=; path=/; max-age=0`;
}
