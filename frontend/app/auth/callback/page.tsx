'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';

// Cookieからトークンを取得するヘルパー
function getCookie(name: string): string | null {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop()?.split(';').shift() || null;
  }
  return null;
}

// Cookieを削除するヘルパー
function deleteCookie(name: string) {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}

export default function AuthCallbackPage() {
  const router = useRouter();
  const { setAccessToken } = useAuth();

  useEffect(() => {
    const token = getCookie('accessToken');

    if (token) {
      setAccessToken(token);
      deleteCookie('accessToken'); // Cookieから削除（セキュリティ向上）
      router.push('/channels/1');
    } else {
      // エラーの場合はログインページにリダイレクト
      router.push('/login');
    }
  }, [setAccessToken, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-gray-600">認証処理中...</div>
    </div>
  );
}
