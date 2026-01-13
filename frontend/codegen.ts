import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: 'http://nestjs_app:3000/graphql',
  documents: ['src/**/*.graphql'],
  // NOTE: graphql.tsにまとめて出力するとサーバーコンポーネントで使えなくなるので分割
  generates: {
    // 型定義（サーバーサイド用）
    './src/generated/types.ts': {
      plugins: ['typescript', 'typescript-operations'],
    },
    
    // GraphQLドキュメント（サーバーサイド用）
    './src/generated/documents.ts': {
      plugins: ['typed-document-node'],
    },
    
    // urqlフック（クライアントサイド用）
    './src/generated/hooks.ts': {
      plugins: ['typescript', 'typescript-operations', 'typescript-urql'],
      config: {
        withHooks: true,
      },
    },
  },
};

export default config;