export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  DateTime: { input: any; output: any; }
};

export type AuthTokens = {
  __typename?: 'AuthTokens';
  accessToken: Scalars['String']['output'];
};

export type Channel = {
  __typename?: 'Channel';
  createdAt: Scalars['DateTime']['output'];
  creatorId: Scalars['Float']['output'];
  deletedAt?: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['Float']['output'];
  isArchive: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
  updaterId: Scalars['Float']['output'];
};

export type CheckChannelInvitationResult = {
  __typename?: 'CheckChannelInvitationResult';
  alreadyMemberUsers: Array<User>;
  notFoundUserIds: Array<Scalars['Int']['output']>;
  validUsers: Array<User>;
};

export type CreateChannelInput = {
  name: Scalars['String']['input'];
};

export type CreateMessageInput = {
  channelId: Scalars['Int']['input'];
  message: Scalars['String']['input'];
  userId: Scalars['Int']['input'];
};

export type InviteToChannelInput = {
  channelId: Scalars['Int']['input'];
  userIds: Array<Scalars['Int']['input']>;
};

export type InviteToChannelResult = {
  __typename?: 'InviteToChannelResult';
  alreadyMemberUsers: Array<User>;
  channel: Channel;
  invitedUsers: Array<User>;
  notFoundUserIds: Array<Scalars['Int']['output']>;
};

export type JoinChannelInput = {
  channelId: Scalars['Int']['input'];
};

export type Message = {
  __typename?: 'Message';
  channel?: Maybe<Channel>;
  channelId: Scalars['Float']['output'];
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['Float']['output'];
  message: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
  user?: Maybe<User>;
  userId: Scalars['Float']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  addMessage: Message;
  createChannel: Channel;
  inviteToChannel: InviteToChannelResult;
  joinChannel: Channel;
  refreshToken: AuthTokens;
};


export type MutationAddMessageArgs = {
  messageInput: CreateMessageInput;
};


export type MutationCreateChannelArgs = {
  input: CreateChannelInput;
};


export type MutationInviteToChannelArgs = {
  input: InviteToChannelInput;
};


export type MutationJoinChannelArgs = {
  input: JoinChannelInput;
};

export type Query = {
  __typename?: 'Query';
  availableChannels: Array<Channel>;
  channel?: Maybe<Channel>;
  channels: Array<Channel>;
  checkChannelInvitation: CheckChannelInvitationResult;
  /** 開発環境専用: テスト用アクセストークン取得 */
  getAccessToken: AuthTokens;
  invitableUsers: Array<User>;
  me?: Maybe<User>;
  messages: Array<Message>;
  myChannels: Array<Channel>;
};


export type QueryAvailableChannelsArgs = {
  limit?: InputMaybe<Scalars['Float']['input']>;
  offset?: InputMaybe<Scalars['Float']['input']>;
};


export type QueryChannelArgs = {
  id: Scalars['Float']['input'];
};


export type QueryCheckChannelInvitationArgs = {
  input: InviteToChannelInput;
};


export type QueryGetAccessTokenArgs = {
  userId: Scalars['Int']['input'];
};


export type QueryInvitableUsersArgs = {
  channelId: Scalars['Float']['input'];
  limit?: InputMaybe<Scalars['Float']['input']>;
  offset?: InputMaybe<Scalars['Float']['input']>;
  query: Scalars['String']['input'];
};


export type QueryMessagesArgs = {
  channelId: Scalars['Float']['input'];
  limit?: InputMaybe<Scalars['Float']['input']>;
  offset?: InputMaybe<Scalars['Float']['input']>;
};


export type QueryMyChannelsArgs = {
  limit?: InputMaybe<Scalars['Float']['input']>;
  offset?: InputMaybe<Scalars['Float']['input']>;
};

export type Subscription = {
  __typename?: 'Subscription';
  messageAdded: Message;
};

export type User = {
  __typename?: 'User';
  createdAt: Scalars['DateTime']['output'];
  deletedAt?: Maybe<Scalars['DateTime']['output']>;
  email: Scalars['String']['output'];
  id: Scalars['Float']['output'];
  name: Scalars['String']['output'];
  profileImgPath?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['DateTime']['output'];
};

export type ChannelFragmentFragment = { __typename?: 'Channel', id: number, name: string, isArchive: boolean, createdAt: any, updatedAt: any, creatorId: number, updaterId: number };

export type MessageFragmentFragment = { __typename?: 'Message', id: number, message: string, userId: number, channelId: number, createdAt: any, updatedAt: any, user?: { __typename?: 'User', id: number, name: string, email: string, profileImgPath?: string | null, createdAt: any, updatedAt: any } | null, channel?: { __typename?: 'Channel', id: number, name: string, isArchive: boolean, createdAt: any, updatedAt: any, creatorId: number, updaterId: number } | null };

export type UserFragmentFragment = { __typename?: 'User', id: number, name: string, email: string, profileImgPath?: string | null, createdAt: any, updatedAt: any };

export type JoinChannelMutationVariables = Exact<{
  input: JoinChannelInput;
}>;


export type JoinChannelMutation = { __typename?: 'Mutation', joinChannel: { __typename?: 'Channel', id: number, name: string, isArchive: boolean, createdAt: any, updatedAt: any, creatorId: number, updaterId: number } };

export type SendMessageMutationVariables = Exact<{
  messageInput: CreateMessageInput;
}>;


export type SendMessageMutation = { __typename?: 'Mutation', addMessage: { __typename?: 'Message', id: number, message: string, userId: number, channelId: number, createdAt: any, updatedAt: any, user?: { __typename?: 'User', id: number, name: string, email: string, profileImgPath?: string | null, createdAt: any, updatedAt: any } | null, channel?: { __typename?: 'Channel', id: number, name: string, isArchive: boolean, createdAt: any, updatedAt: any, creatorId: number, updaterId: number } | null } };

export type GetAvailableChannelsQueryVariables = Exact<{
  limit?: InputMaybe<Scalars['Float']['input']>;
  offset?: InputMaybe<Scalars['Float']['input']>;
}>;


export type GetAvailableChannelsQuery = { __typename?: 'Query', availableChannels: Array<{ __typename?: 'Channel', id: number, name: string, isArchive: boolean, createdAt: any, updatedAt: any, creatorId: number, updaterId: number }> };

export type GetChannelQueryVariables = Exact<{
  id: Scalars['Float']['input'];
}>;


export type GetChannelQuery = { __typename?: 'Query', channel?: { __typename?: 'Channel', id: number, name: string, isArchive: boolean, createdAt: any, updatedAt: any, creatorId: number, updaterId: number } | null };

export type GetChannelNameQueryVariables = Exact<{
  id: Scalars['Float']['input'];
}>;


export type GetChannelNameQuery = { __typename?: 'Query', channel?: { __typename?: 'Channel', id: number, name: string } | null };

export type GetChannelsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetChannelsQuery = { __typename?: 'Query', channels: Array<{ __typename?: 'Channel', id: number, name: string, isArchive: boolean, createdAt: any, updatedAt: any, creatorId: number, updaterId: number }> };

export type GetMessagesQueryVariables = Exact<{
  channelId: Scalars['Float']['input'];
  limit?: InputMaybe<Scalars['Float']['input']>;
  offset?: InputMaybe<Scalars['Float']['input']>;
}>;


export type GetMessagesQuery = { __typename?: 'Query', messages: Array<{ __typename?: 'Message', id: number, message: string, userId: number, channelId: number, createdAt: any, updatedAt: any, user?: { __typename?: 'User', id: number, name: string, email: string, profileImgPath?: string | null, createdAt: any, updatedAt: any } | null, channel?: { __typename?: 'Channel', id: number, name: string, isArchive: boolean, createdAt: any, updatedAt: any, creatorId: number, updaterId: number } | null }> };

export type GetMyChannelsQueryVariables = Exact<{
  limit?: InputMaybe<Scalars['Float']['input']>;
  offset?: InputMaybe<Scalars['Float']['input']>;
}>;


export type GetMyChannelsQuery = { __typename?: 'Query', myChannels: Array<{ __typename?: 'Channel', id: number, name: string, isArchive: boolean, createdAt: any, updatedAt: any, creatorId: number, updaterId: number }> };

export type MessageAddedSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type MessageAddedSubscription = { __typename?: 'Subscription', messageAdded: { __typename?: 'Message', id: number, message: string, userId: number, channelId: number, createdAt: any, updatedAt: any, user?: { __typename?: 'User', id: number, name: string, email: string, profileImgPath?: string | null, createdAt: any, updatedAt: any } | null, channel?: { __typename?: 'Channel', id: number, name: string, isArchive: boolean, createdAt: any, updatedAt: any, creatorId: number, updaterId: number } | null } };
