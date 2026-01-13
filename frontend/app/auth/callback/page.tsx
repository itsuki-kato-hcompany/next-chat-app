'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';

// OAuth認証後のコールバックページコンポーネント
export default function AuthCallbackPage() {
  const router = useRouter();
  const { setAccessToken } = useAuth();

  useEffect(() => {
    // URLフラグメントからアクセストークンを取得
    // 例：#token=xxxxxx
    const hash = window.location.hash;
    // 先頭の「#」を除去
    const params = new URLSearchParams(hash.substring(1));
    const token = params.get('token');

    if (token) {
      setAccessToken(token);

      // ブラウザ履歴にアクセストークンを残さないように履歴を削除
      window.history.replaceState(null, '', window.location.pathname);
      router.push('/channels/1');
    } else {
      router.push('/login');
    }
  }, [setAccessToken, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-gray-600">認証処理中...</div>
    </div>
  );
}
