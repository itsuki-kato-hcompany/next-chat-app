import { cache } from 'react';
import { createClient, cacheExchange, fetchExchange } from '@urql/next';

// `cache`でラップすることで、この関数は1リクエスト内で1度しか実行されない
export const getClient = cache(() => {
  const client = createClient({
    url: 'http://host.docker.internal:3000/graphql', // あなたのGraphQLエンドポイント
    exchanges: [cacheExchange, fetchExchange],
  });
  return client;
});