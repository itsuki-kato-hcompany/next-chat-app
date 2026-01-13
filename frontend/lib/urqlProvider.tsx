'use client';

import { UrqlProvider as Provider, cacheExchange, createClient, fetchExchange, ssrExchange, subscriptionExchange } from '@urql/next';
import { authExchange, AuthUtilities } from '@urql/exchange-auth';
import { CombinedError, Operation } from '@urql/core';
import { createClient as createWSClient } from 'graphql-ws';
import { useMemo } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3000';
const TOKEN_KEY = 'accessToken';

// トークンを取得する関数
const getToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(TOKEN_KEY);
  }
  return null;
};

// UrqlProviderをラップするコンポーネント
export function UrqlProvider({ children }: { children: React.ReactNode }) {
  const [client, ssr] = useMemo(() => {
    // SSR Exchangeを初期化
    const ssr = ssrExchange();

    // WebSocketクライアントを作成（subscriptions用）
    const wsClient = createWSClient({
      url: `${WS_URL}/graphql`,
      connectionParams: () => {
        const token = getToken();
        return token ? { authorization: `Bearer ${token}` } : {};
      },
    });

    // urqlクライアントを作成
    const client = createClient({
      url: `${API_URL}/graphql`,
      exchanges: [
        cacheExchange,
        ssr,
        authExchange(async (utils: AuthUtilities) => {
          return {
            addAuthToOperation(operation: Operation) {
              const token = getToken();
              if (!token) return operation;

              return utils.appendHeaders(operation, {
                Authorization: `Bearer ${token}`,
              });
            },
            didAuthError(error: CombinedError) {
              return error.graphQLErrors.some(
                (e) => e.extensions?.code === 'UNAUTHENTICATED'
              );
            },
            async refreshAuth() {
              // トークンリフレッシュのロジック
              try {
                const response = await fetch(`${API_URL}/graphql`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  credentials: 'include',
                  body: JSON.stringify({
                    query: `
                      mutation RefreshToken {
                        refreshToken {
                          accessToken
                        }
                      }
                    `,
                  }),
                });

                const data = await response.json();
                const newToken = data.data?.refreshToken?.accessToken;

                if (newToken) {
                  localStorage.setItem(TOKEN_KEY, newToken);
                } else {
                  localStorage.removeItem(TOKEN_KEY);
                  window.location.href = '/login';
                }
              } catch {
                localStorage.removeItem(TOKEN_KEY);
                window.location.href = '/login';
              }
            },
          };
        }),
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
      fetchOptions: {
        credentials: 'include',
      },
    });

    return [client, ssr];
  }, []);

  return (
    <Provider client={client} ssr={ssr}>
      {children}
    </Provider>
  );
}