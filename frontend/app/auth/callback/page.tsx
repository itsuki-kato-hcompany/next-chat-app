'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setAccessToken } = useAuth();

  useEffect(() => {
    const token = searchParams.get('token');

    if (token) {
      setAccessToken(token);
      router.push('/channels/1');
    } else {
      // エラーの場合はログインページにリダイレクト
      router.push('/login');
    }
  }, [searchParams, setAccessToken, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-gray-600">認証処理中...</div>
    </div>
  );
}
