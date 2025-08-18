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

export type CreateMessageInput = {
  channelId: Scalars['Int']['input'];
  message: Scalars['String']['input'];
  userId: Scalars['Int']['input'];
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
};


export type MutationAddMessageArgs = {
  messageInput: CreateMessageInput;
};

export type Query = {
  __typename?: 'Query';
  channel?: Maybe<Channel>;
  channels: Array<Channel>;
  messages: Array<Message>;
};


export type QueryChannelArgs = {
  id: Scalars['Float']['input'];
};


export type QueryMessagesArgs = {
  channelId: Scalars['Float']['input'];
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

export type SendMessageMutationVariables = Exact<{
  messageInput: CreateMessageInput;
}>;


export type SendMessageMutation = { __typename?: 'Mutation', addMessage: { __typename?: 'Message', id: number, message: string, userId: number, channelId: number, createdAt: any, updatedAt: any, user?: { __typename?: 'User', id: number, name: string, email: string, profileImgPath?: string | null, createdAt: any, updatedAt: any } | null, channel?: { __typename?: 'Channel', id: number, name: string, isArchive: boolean, createdAt: any, updatedAt: any, creatorId: number, updaterId: number } | null } };

export type GetChannelQueryVariables = Exact<{
  id: Scalars['Float']['input'];
}>;


export type GetChannelQuery = { __typename?: 'Query', channel?: { __typename?: 'Channel', id: number, name: string, isArchive: boolean, createdAt: any, updatedAt: any, creatorId: number, updaterId: number } | null };

export type GetChannelsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetChannelsQuery = { __typename?: 'Query', channels: Array<{ __typename?: 'Channel', id: number, name: string, isArchive: boolean, createdAt: any, updatedAt: any, creatorId: number, updaterId: number }> };

export type GetMessagesQueryVariables = Exact<{
  channelId: Scalars['Float']['input'];
  limit?: InputMaybe<Scalars['Float']['input']>;
  offset?: InputMaybe<Scalars['Float']['input']>;
}>;


export type GetMessagesQuery = { __typename?: 'Query', messages: Array<{ __typename?: 'Message', id: number, message: string, userId: number, channelId: number, createdAt: any, updatedAt: any, user?: { __typename?: 'User', id: number, name: string, email: string, profileImgPath?: string | null, createdAt: any, updatedAt: any } | null, channel?: { __typename?: 'Channel', id: number, name: string, isArchive: boolean, createdAt: any, updatedAt: any, creatorId: number, updaterId: number } | null }> };

export type MessageAddedSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type MessageAddedSubscription = { __typename?: 'Subscription', messageAdded: { __typename?: 'Message', id: number, message: string, userId: number, channelId: number, createdAt: any, updatedAt: any, user?: { __typename?: 'User', id: number, name: string, email: string, profileImgPath?: string | null, createdAt: any, updatedAt: any } | null, channel?: { __typename?: 'Channel', id: number, name: string, isArchive: boolean, createdAt: any, updatedAt: any, creatorId: number, updaterId: number } | null } };
