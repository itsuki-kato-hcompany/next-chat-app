import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: 'http://nestjs_app:3000/graphql',
  documents: ['src/**/*.graphql'],
  generates: {
    // 1. 型定義のみ（サーバーサイド用）
    './src/generated/types.ts': {
      plugins: ['typescript', 'typescript-operations'],
    },
    
    // 2. GraphQLドキュメントのみ（サーバーサイド用）
    './src/generated/documents.ts': {
      plugins: ['typed-document-node'],
    },
    
    // 3. URQLフック（クライアントサイド用）
    './src/generated/hooks.ts': {
      plugins: ['typescript', 'typescript-operations', 'typescript-urql'],
      config: {
        withHooks: true,
      },
    },
  },
};

export default config;