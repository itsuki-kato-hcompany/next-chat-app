'use client';

import { UrqlProvider as Provider, cacheExchange, createClient, fetchExchange, ssrExchange, subscriptionExchange } from '@urql/next';
import { createClient as createWSClient } from 'graphql-ws';
import { useMemo } from 'react';

// UrqlProviderをラップするコンポーネント
export function UrqlProvider({ children }: { children: React.ReactNode }) {
  const [client, ssr] = useMemo(() => {
    // SSR Exchangeを初期化
    const ssr = ssrExchange();

    // WebSocketクライアントを作成（subscriptions用）
    const wsClient = createWSClient({
      url: 'ws://localhost:3000/graphql',
    });

    // urqlクライアントを作成
    const client = createClient({
      url: 'http://localhost:3000/graphql',
      exchanges: [
        cacheExchange,
        ssr,
        fetchExchange,
        subscriptionExchange({
          forwardSubscription(request) {
            const input = { ...request, query: request.query || '' };
            return {
              subscribe(sink) {
                const unsubscribe = wsClient.subscribe(input, sink);
                return { unsubscribe };
              },
            };
          },
        }),
      ],
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