# GraphQL設計
※とりあえず思いつく限り記載しました。
最小機能で実装する必要があるものに（★）を付与しています。

## Custom Scalar定義
```graphql
  type IntID "IDを表現する0以上の正の整数の型定義"（★）
```

## Enum定義
```graphql
（★）
enum ChannelRoleType {
  OWNER
  ADMIN
  MEMBER
}
```

## GraphQL Model定義

### User
```graphql
（★）
type User {
  id: IntID!
  name: String!
  email: String!
  password: String! @HideField() // フロント側からは参照不可
  profileImgPath: String
  deletedAt: DateTime
  createdAt: DateTime!
  updatedAt: DateTime!

  channels: [Channel!]! // 空の配列は返す
  sentMessages: [Message!]! // 空の配列は返す
  readMessages: [MessageRead!]! // 空の配列は返す
}
```

### Channel
```graphql
（★）
type Channel {
  id: IntID!
  name: String!
  isArchive: Boolean!
  createUserId: IntID!
  updateUserId: IntID!
  deletedAt: DateTime
  createdAt: DateTime!
  updatedAt: DateTime!

  createUser: User!
  updateUser: USer!
  channelUsers: [ChannelUser!]! // 空の配列は返す
  messages: [Message!]! // 空の配列は返す
}
```

### ChannelRole
```graphql
（★）
type ChannelRole {
  id: IntID!
  name: String!
  sortNo: Int!
  createdAt: DateTime!
  updatedAt: DateTime!
}
```

### ChannelUser
```graphql
（★）
type ChannelUser {
  id: IntID!
  userId: IntID!
  roleId: String!
  channelId: IntID!
  deletedAt: DateTime
  createdAt: DateTime!
  updatedAt: DateTime!

  user: User!
  channel: Channel!
  role: ChannelRole!
}
```

### Message
```graphql
（★）
type Message {
  id: IntID!
  message: String!
  createdAt: DateTime!
  updatedAt: DateTime!

  user: User!
  channel: Channel!
  messageReads: [MessageRead!]!
}
```

### MessageRead
```graphql
type MessageRead {
  id: IntID!
  user: User!
  message: Message!
  createdAt: DateTime!
  updatedAt: DateTime!
}
```

### AuthPayload
```graphql
type AuthPayload {
  user: User!
  accessToken: String!
  refreshToken: String!
}
```

## Input Types

### ユーザー関連
```graphql
## ユーザー登録用のInput
input CreateUserInput {
  name: String!
  email: String!
  password: String!
  profileImgPath: String
}

## ユーザー更新用のInput
input UpdateUserInput {
  id: IntID!
  name: String
  email: String
  profileImgPath: String
}
```

### チャンネル関連
```graphql
## チャンネル作成用のInput
input CreateChannelInput {
  userId: IntID!
  name: String!
}

## チャンネルアーカイブ用のInput
# NOTE：ChannelRole.MEMBER以上の権限で操作可能、バックエンドで検証する
input ArchiveChannelInput {
  channelId: IntID!
  userId: IntID!
}

## チャンネルアーカイブ復帰用のInput
# NOTE：ChannelRole.MEMBER以上の権限で操作可能、バックエンドで検証する
input UnarchiveChannelInput {
  channelId: IntID!
  userId: IntID!
}

## チャンネル参加用Input
# NOTE：MEMBER
input JoinChannelInput {
  channelId: IntID!
  roleId: IntID!
  # NOTE：招待したユーザーID. ChannelRole.MEMBERならroleはMEMBERだけ選択可能にする
  inviterId: IntID!
  userId: IntID!
}

## チャンネル退出用Input
input LeaveChannelInput {
  channelId: IntID!
  userId: IntID!
}
```

### メッセージ関連
```graphql
## メッセージ送信用Input
（★）
input SendMessageInput {
  userId: IntID!
  channelId: IntID!
  message: String!
}

## メッセージ既読用Input
# NOTE：messageIdは複数まとめて送信した方が負荷を考えるといいかも？
input MessageReadInput {
  userId: IntID!
  messageId: IntID!
}
```

### 認証関連
<!-- NOTE：ちょっとまだふわっとしてるけど雰囲気こんなイメージ -->
```graphql
# ログイン認証用Input
input LoginInput {
  email: String!
  password: String!
}

# リフレッシュトークン更新用のInput
input RefreshTokenInput {
  userId: IntID!
  refreshToken: String!
}
```

## Query

```graphql
type Query {
  # ユーザー関連

  ## 自分のユーザー情報を取得する
  me: User!

  ## ユーザー情報単体取得
  user(id: IntID!): User

  ## ユーザー情報複数取得
  users(limit: Int, offset: Int): [User!]!
  
  # チャンネル関連

  ## チャンネル情報単体取得
  （★）
  channel(id: IntID!): Channel
  
  ## チャンネル情報複数取得
  （★）
  channels(
    # アーカイブ済みのチャンネルを含めるかどうか（default: false）
    includeArchive: Boolean
    limit: Int
    offset: Int
  ): [Channel!]!

  ## 自分が所属しているチャンネルの一覧取得
  myChannels(
    includeArchive: Boolean
    limit: Int
    offset: Int
  ): [Channel!]!
  
  ## チャンネルロール関連
  ## NOTE：基本的に選択肢の表示に利用する
  channelRoles: [ChannelRole!]!
  
  # メッセージ関連
  ## チャンネルに紐づくメッセージの複数取得
  messages(
    channelId: IntID!
    limit: Int
    offset: Int
  ): [Message!]!
}
```

## Mutation

```graphql
type Mutation {
  # 認証関連
  ## ユーザー登録
  signup(input: CreateUserInput!): User!

  ## ログイン認証
  login(input: LoginInput!): User!
  
  ## ログアウト
  # NOTE：データは削除するので成功（true）/失敗（false）を返却する
  logout: Boolean!

  ## リフレッシュトークンの更新
  refreshToken(input: RefreshTokenInput!): AuthPayload!
  
  # ユーザー関連
  ## ユーザー情報更新
  updateUser(input: UpdateUserInput!): User!

  ## ユーザー情報削除
  # NOTE：データは削除するので成功（true）/失敗（false）を返却する
  deleteUser(userId: IntID!): Boolean!
  
  # チャンネル関連
  ## チャンネル作成
  createChannel(input: CreateChannelInput!): Channel!
  
  ## アーカイブ
  # NOTE：ChannelRole.MEMBER以上の権限で操作可能、デコレータを実装する
  archiveChannel(input: ArchiveChannelInput!): Channel!
  
  ## アーカイブからの復帰
  # NOTE：ChannelRole.MEMBER以上の権限で操作可能、デコレータを実装する
  unarchiveChannel(input: UnarchiveChannelInput!): Channel! 
  
  # チャンネル参加・退出
  ## チャンネル参加
  joinChannel(input: JoinChannelInput!): ChannelUser!

  ## チャンネル退出
  # NOTE：データは削除するので成功（true）/失敗（false）を返却する
  leaveChannel(input: LeaveChannelInput!): Boolean!
  
  # メッセージ関連
  ## メッセージ送信
  （★）
  sendMessage(input: SendMessageInput!): Message!
  
  # 既読管理
  ## 既読登録
  readMessage(input: MessageReadInput!): [MessageRead!]!
}
```

## Subscription
<!-- NOTE：ちょっとまだイメージついてないけどリアルタイムには必須らしい -->
```graphql
type Subscription {
  （★）
  # メッセージのリアルタイム更新
  ## 新しいメッセージが送信されたときに通知
  messageAdded(channelId: IntID!): Message!

  # チャンネルメンバーの更新
  ## 新しいメンバーがチャンネルに参加したときに通知
  memberJoined(channelId: IntID!): ChannelUser!
  
  ## メンバーがチャンネルから退出したときに通知
  memberLeft(channelId: IntID!): IntID! # 退出したユーザーのID
  
  # 既読状態の更新
  ## メッセージが既読されたときに通知
  ## NOTE: パフォーマンスを考慮して、まとめて送信することも検討
  messageRead(channelId: IntID!): MessageRead!
}
```