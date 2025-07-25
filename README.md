# Next Chat App

NestJS + Next.js + PostgreSQL を使用したリアルタイムチャットアプリケーション

## 構成

- **Backend**: NestJS + GraphQL + Prisma (ポート: 3000)
- **Frontend**: Next.js + React (ポート: 3001)  
- **Database**: PostgreSQL (ポート: 5432)

## 開発環境の起動

### 全サービスを一括起動
```bash
docker-compose up --build
```

### 個別にサービスを起動
```bash
# Backend のみ
cd backend && docker-compose up --build

# Frontend のみ  
cd frontend && docker-compose up --build
```

## アクセス URL

- **Frontend**: http://localhost:3001
- **Backend GraphQL Playground**: http://localhost:3000/graphql
- **Prisma Studio**: http://localhost:5555

## 開発コマンド

### Backend
```bash
# マイグレーション実行
npm run prisma:migrate

# Seedデータ投入
npm run seed

# Prisma Studio起動
npm run prisma:studio
```

### Frontend
```bash
# 開発サーバー起動
npm run dev

# ビルド
npm run build
```

## Dev Container

VS Code の Dev Container 機能を使用して開発環境を構築できます：

1. VS Code で backend または frontend ディレクトリを開く
2. "Dev Containers: Reopen in Container" を実行
3. 自動的に開発環境がセットアップされます

## GraphQL API

### メッセージ一覧取得
```graphql
query {
  messages(channelId: 1, limit: 20, offset: 0) {
    id
    message
    createdAt
    user {
      id
      name
    }
    channel {
      id
      name
    }
  }
}
```

### メッセージ送信
```graphql
mutation {
  addMessage(messageInput: {
    message: "Hello World",
    userId: 1,
    channelId: 1
  }) {
    id
    message
    createdAt
  }
}
```