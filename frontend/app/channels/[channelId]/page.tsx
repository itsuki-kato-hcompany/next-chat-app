import { notFound } from "next/navigation";
import { ChatArea } from "@/components/chat/chat-area";
import { getClient } from "@/lib/urqlServer";
import { GetMessagesDocument, GetChannelDocument } from "../../../src/generated/documents";
import type { GetMessagesQuery, GetMessagesQueryVariables, GetChannelQuery, GetChannelQueryVariables } from "../../../src/generated/types";

interface ChannelPageProps {
  params: Promise<{
    channelId: string;
  }>;
}

export default async function ChannelPage({ params }: ChannelPageProps) {
  const { channelId } = await params;
  const channelIdNum = parseInt(channelId, 10);

  // 無効なチャンネルIDの場合は404
  if (isNaN(channelIdNum)) {
    notFound();
  }

  const client = getClient();

  // メッセージの取得（型安全）
  const variables: GetMessagesQueryVariables = {
    channelId: channelIdNum,
    limit: 50,
    offset: 0
  };

  const messagesResult = await client.query<GetMessagesQuery, GetMessagesQueryVariables>(
    GetMessagesDocument,
    variables
  ).toPromise();

  const messages = messagesResult?.data?.messages || [];

  // チャンネル情報を取得
  const channelResult = await client.query<GetChannelQuery, GetChannelQueryVariables>(
    GetChannelDocument,
    { id: channelIdNum }
  ).toPromise();

  const channel = channelResult?.data?.channel;

  // チャンネルが存在しない場合は404
  if (!channel) {
    notFound();
  }

  // 仮の現在ユーザーID（実際の実装では認証から取得）
  const currentUserId = 1;

  return (
    <ChatArea
      selectedChannelId={channelIdNum}
      channelName={channel.name}
      messages={messages}
      currentUserId={currentUserId}
    />
  );
}