'use client'; // このコンポーネントがクライアントで実行されることを示す

import { UrqlProvider as Provider, cacheExchange, createClient, fetchExchange, ssrExchange } from '@urql/next';
import { useMemo } from 'react';

// UrqlProviderをラップするコンポーネント
export function UrqlProvider({ children }: { children: React.ReactNode }) {
  const [client, ssr] = useMemo(() => {
    // SSR Exchangeを初期化
    const ssr = ssrExchange();

    // urqlクライアントを作成
    const client = createClient({
      // ここにGraphQLサーバーのエンドポイントURLを指定
      url: 'http://localhost:3000/graphql',
      exchanges: [cacheExchange, ssr, fetchExchange],
      suspense: true, // React Suspenseとの連携を有効にする
    });

    return [client, ssr];
  }, []);

  return (
    <Provider client={client} ssr={ssr}>
      {children}
    </Provider>
  );
}