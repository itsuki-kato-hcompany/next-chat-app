import gql from 'graphql-tag';
import * as Urql from 'urql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
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

export type MessageAddedSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type MessageAddedSubscription = { __typename?: 'Subscription', messageAdded: { __typename?: 'Message', id: number, message: string, userId: number, channelId: number, createdAt: any, updatedAt: any, user?: { __typename?: 'User', id: number, name: string, email: string, profileImgPath?: string | null, createdAt: any, updatedAt: any } | null, channel?: { __typename?: 'Channel', id: number, name: string, isArchive: boolean, createdAt: any, updatedAt: any, creatorId: number, updaterId: number } | null } };

export const UserFragmentFragmentDoc = gql`
    fragment UserFragment on User {
  id
  name
  email
  profileImgPath
  createdAt
  updatedAt
}
    `;
export const ChannelFragmentFragmentDoc = gql`
    fragment ChannelFragment on Channel {
  id
  name
  isArchive
  createdAt
  updatedAt
  creatorId
  updaterId
}
    `;
export const MessageFragmentFragmentDoc = gql`
    fragment MessageFragment on Message {
  id
  message
  userId
  channelId
  createdAt
  updatedAt
  user {
    ...UserFragment
  }
  channel {
    ...ChannelFragment
  }
}
    ${UserFragmentFragmentDoc}
${ChannelFragmentFragmentDoc}`;
export const SendMessageDocument = gql`
    mutation SendMessage($messageInput: CreateMessageInput!) {
  addMessage(messageInput: $messageInput) {
    ...MessageFragment
  }
}
    ${MessageFragmentFragmentDoc}`;

export function useSendMessageMutation() {
  return Urql.useMutation<SendMessageMutation, SendMessageMutationVariables>(SendMessageDocument);
};
export const GetChannelDocument = gql`
    query GetChannel($id: Float!) {
  channel(id: $id) {
    ...ChannelFragment
  }
}
    ${ChannelFragmentFragmentDoc}`;

export function useGetChannelQuery(options: Omit<Urql.UseQueryArgs<GetChannelQueryVariables>, 'query'>) {
  return Urql.useQuery<GetChannelQuery, GetChannelQueryVariables>({ query: GetChannelDocument, ...options });
};
export const GetChannelNameDocument = gql`
    query GetChannelName($id: Float!) {
  channel(id: $id) {
    id
    name
  }
}
    `;

export function useGetChannelNameQuery(options: Omit<Urql.UseQueryArgs<GetChannelNameQueryVariables>, 'query'>) {
  return Urql.useQuery<GetChannelNameQuery, GetChannelNameQueryVariables>({ query: GetChannelNameDocument, ...options });
};
export const GetChannelsDocument = gql`
    query GetChannels {
  channels {
    ...ChannelFragment
  }
}
    ${ChannelFragmentFragmentDoc}`;

export function useGetChannelsQuery(options?: Omit<Urql.UseQueryArgs<GetChannelsQueryVariables>, 'query'>) {
  return Urql.useQuery<GetChannelsQuery, GetChannelsQueryVariables>({ query: GetChannelsDocument, ...options });
};
export const GetMessagesDocument = gql`
    query GetMessages($channelId: Float!, $limit: Float = 50, $offset: Float = 0) {
  messages(channelId: $channelId, limit: $limit, offset: $offset) {
    ...MessageFragment
  }
}
    ${MessageFragmentFragmentDoc}`;

export function useGetMessagesQuery(options: Omit<Urql.UseQueryArgs<GetMessagesQueryVariables>, 'query'>) {
  return Urql.useQuery<GetMessagesQuery, GetMessagesQueryVariables>({ query: GetMessagesDocument, ...options });
};
export const MessageAddedDocument = gql`
    subscription MessageAdded {
  messageAdded {
    ...MessageFragment
  }
}
    ${MessageFragmentFragmentDoc}`;

export function useMessageAddedSubscription<TData = MessageAddedSubscription>(options?: Omit<Urql.UseSubscriptionArgs<MessageAddedSubscriptionVariables>, 'query'>, handler?: Urql.SubscriptionHandler<MessageAddedSubscription, TData>) {
  return Urql.useSubscription<MessageAddedSubscription, TData, MessageAddedSubscriptionVariables>({ query: MessageAddedDocument, ...options }, handler);
};