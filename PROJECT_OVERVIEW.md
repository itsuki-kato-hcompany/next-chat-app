# Next.js Chat App - 実装説明書

## プロジェクト概要

NestJS + Next.js + PostgreSQL + GraphQLを使用したリアルタイムチャットアプリケーション。GraphQL Subscriptionによるリアルタイム通信とCode First開発を採用し、型安全性を重視した設計になっています。

## アーキテクチャ構成

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Database      │
│   (Next.js)     │───▶│   (NestJS)      │───▶│  (PostgreSQL)   │
│   Port: 3001    │    │   Port: 3000    │    │   Port: 5432    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### 技術スタック
- **Backend**: NestJS + GraphQL + Prisma ORM
- **Frontend**: Next.js 15 + React 19 + urql
- **Database**: PostgreSQL
- **Infrastructure**: Docker + Docker Compose
- **Real-time**: GraphQL Subscriptions + graphql-ws

## 追加実装した主要機能

### バックエンド GraphQL API

#### 1. チャンネル関連のクエリ実装

**チャンネル一覧取得**
```typescript
// backend/src/channel/channel.resolver.ts
@Resolver(() => Channel)
export class ChannelResolver {
  @Query(() => [Channel], { name: 'channels' })
  async getChannels(): Promise<Channel[]> {
    return this.getChannelsUseCase.execute();
  }

  @Query(() => Channel, { name: 'channel', nullable: true })
  async getChannel(@Args('id') id: number): Promise<Channel | null> {
    return this.getChannelUseCase.execute(id);
  }
}
```

#### 2. メッセージ送信とリアルタイム配信

**Subscriptionを使ったリアルタイム通信**
```typescript
// backend/src/message/message.resolver.ts
@Subscription(() => Message, {
  name: MESSAGE_ADDED_EVENT,
})
messageAdded() {
  return this.pubSub.asyncIterableIterator(MESSAGE_ADDED_EVENT);
}

@Mutation(() => Message)
async addMessage(@Args('messageInput') messageInput: CreateMessageInput): Promise<Message> {
  return this.createMessageUseCase.execute(messageInput);
}
```

**メッセージ作成時のPubSub発行**
```typescript
// backend/src/message/usecases/create-message.usecase.ts
async execute(input: CreateMessageInput): Promise<Message> {
  const newMessage = await this.messageDao.createMessage(input);

  await this.pubSub.publish(MESSAGE_ADDED_EVENT, {
    [MESSAGE_ADDED_EVENT]: newMessage,
  });

  return newMessage;
}
```

### フロントエンド実装のポイント

#### 1. GraphQL Code Generator設定

**分割出力による最適化**
```typescript
// frontend/codegen.ts
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
```

#### 2. Fragment活用による型安全性確保

**Fragment定義**
```graphql
# frontend/src/graphql/fragments/channel.graphql
fragment ChannelFragment on Channel {
  id
  name
  isArchive
  createdAt
  updatedAt
  creatorId
  updaterId
}
```

**Fragment使用例**
```graphql
# frontend/src/graphql/queries/getChannels.graphql
#import "../fragments/channel.graphql"

query GetChannels {
  channels {
    ...ChannelFragment
  }
}
```

#### 3. コンポーネント設計とデータフェッチ戦略

**レイアウトレベルでのデータ取得**
```typescript
// frontend/app/channels/layout.tsx
export default async function ChannelsLayout({ children, params }: ChannelsLayoutProps) {
  const { channelId } = await params;
  const selectedChannelId = parseInt(channelId, 10);

  const client = getClient();

  // チャンネル一覧を取得
  const channelsResult = await client.query<GetChannelsQuery, GetChannelsQueryVariables>(
    GetChannelsDocument,
    {}
  ).toPromise();

  const channels = channelsResult?.data?.channels || [];

  return (
    <div className="h-screen flex pt-16">
      <Sidebar selectedChannelId={selectedChannelId} channels={channels} />
      {children}
    </div>
  );
}
```

**ページレベルでのメッセージデータ取得**
```typescript
// frontend/app/channels/[channelId]/page.tsx
export default async function ChannelPage({ params }: ChannelPageProps) {
  const { channelId } = await params;
  const channelIdNum = parseInt(channelId, 10);

  const client = getClient();

  // メッセージの取得
  const messagesResult = await client.query<GetMessagesQuery, GetMessagesQueryVariables>(
    GetMessagesDocument,
    {
      channelId: channelIdNum,
      limit: 50,
      offset: 0
    }
  ).toPromise();

  const messages = messagesResult?.data?.messages || [];

  return (
    <ChatContainer
      selectedChannelId={channelIdNum}
      channelName={channel.name}
      initialMessages={messages}
      currentUserId={currentUserId}
    />
  );
}
```

#### 4. リアルタイム通信の実装

**Subscriptionを使ったリアルタイムメッセージ受信**
```typescript
// frontend/components/chat/chat-container.tsx
export function ChatContainer({ selectedChannelId, channelName, initialMessages, currentUserId = 1 }: ChatContainerProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [subscriptionResult] = useMessageAddedSubscription();

  useEffect(() => {
    if (subscriptionResult.data?.messageAdded) {
      const newMessage = subscriptionResult.data.messageAdded;
      // TODO：全てのチャンネルのメッセージを受信してしまっている。要修正。
      if (newMessage.channelId === selectedChannelId) {
        setMessages((currentMessages) => {
          const messageExists = currentMessages.some(m => m.id === newMessage.id);
          if (!messageExists) {
            return [...currentMessages, newMessage];
          }
          return currentMessages;
        });
      }
    }
  }, [subscriptionResult.data, selectedChannelId]);

  return (
    <ChatArea
      selectedChannelId={selectedChannelId}
      channelName={channelName}
      messages={messages}
      currentUserId={currentUserId}
    />
  );
}
```

**WebSocketクライアント設定**
```typescript
// frontend/lib/urqlProvider.tsx
export function UrqlProvider({ children }: { children: React.ReactNode }) {
  const [client, ssr] = useMemo(() => {
    const ssr = ssrExchange();

    // WebSocketクライアントを作成（subscriptions用）
    const wsClient = createWSClient({
      url: 'ws://localhost:3000/graphql',
    });

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
      suspense: true,
    });

    return [client, ssr];
  }, []);

  return <Provider client={client} ssr={ssr}>{children}</Provider>;
}
```

#### 5. メッセージ送信機能

**型安全なMutation実行**
```typescript
// frontend/components/chat/message-input.tsx
export function MessageInput({ channelId, currentUserId = 1 }: MessageInputProps) {
  const [message, setMessage] = useState("");
  const [{ fetching }, sendMessage] = useSendMessageMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fetching) {
      try {
        await sendMessage({
          messageInput: {
            message: message,
            userId: currentUserId,
            channelId: channelId,
          },
        });
        setMessage("");
      } catch (error) {
        console.error("メッセージ送信エラー:", error);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="メッセージを入力..."
        className="flex-1"
        autoComplete="off"
      />
      <Button type="submit" size="icon" disabled={!message || fetching}>
        <Send className="w-4 h-4" />
      </Button>
    </form>
  );
}
```

## 実装で意識したポイント

### 1. GraphQL Code Generatorによる型安全性

- **Fragment活用**: 再利用可能なGraphQLフラグメントで一貫性を保持
- **分割出力**: サーバーコンポーネントとクライアントコンポーネントで適切な型を使い分け
- **型定義の自動生成**: GraphQLスキーマから TypeScript型を自動生成

### 2. Next.js App Routerを活用したコンポーネント設計

- **Layout分離**: チャンネル一覧取得は `layout.tsx` で実装し、異なるレイアウトにも対応可能
- **サーバーコンポーネント**: データフェッチはサーバーサイドで実行し、パフォーマンスとセキュリティを重視
- **責務分離**: クライアントコンポーネントは UI ロジックに集中し、混在を避ける

### 3. リアルタイム通信のアーキテクチャ

- **GraphQL Subscriptions**: WebSocketを使った効率的なリアルタイム通信
- **PubSub パターン**: メッセージ作成時に自動的に全クライアントに配信
- **状態管理**: React Hooksを使った軽量な状態管理

## 改善が必要な点

### 1. Subscriptionのチャンネル別フィルタリング

現在の実装では全チャンネルのメッセージを受信し、フロントエンド側でフィルタリングしています：

```typescript
// 現在の実装（改善が必要）
useEffect(() => {
  if (subscriptionResult.data?.messageAdded) {
    const newMessage = subscriptionResult.data.messageAdded;
    // TODO：全てのチャンネルのメッセージを受信してしまっている。要修正。
    if (newMessage.channelId === selectedChannelId) {
      setMessages(/* ... */);
    }
  }
}, [subscriptionResult.data, selectedChannelId]);
```

**改善案**: バックエンドでチャンネルID別のSubscriptionを実装:

```typescript
// 改善後の理想的な実装
@Subscription(() => Message, {
  name: 'messageAddedToChannel',
  filter: ({ channelId }, { targetChannelId }) => channelId === targetChannelId
})
messageAddedToChannel(@Args('channelId') channelId: number) {
  return this.pubSub.asyncIterableIterator(`message_added_${channelId}`);
}
```

### 2. 認証システムの統合

現在は仮の `currentUserId = 1` を使用していますが、本格的な認証システムの導入が必要です。

### 3. エラーハンドリングの強化

GraphQLエラーやネットワークエラーに対する統一的なエラーハンドリング機能の追加が望ましいです。

## まとめ

このプロジェクトでは、モダンな技術スタックを活用してリアルタイムチャットアプリケーションを実装しました。特に以下の点で技術的な工夫を施しています：

1. **型安全性の確保**: GraphQL Code Generatorによる完全な型安全性
2. **パフォーマンス重視**: Next.js App Routerのサーバーコンポーネントを活用
3. **リアルタイム通信**: GraphQL Subscriptionsによる効率的な双方向通信
4. **保守性**: Fragment活用とコンポーネント責務分離による高い保守性

これらの実装により、スケーラブルで保守しやすいチャットアプリケーションの基盤を構築できました。