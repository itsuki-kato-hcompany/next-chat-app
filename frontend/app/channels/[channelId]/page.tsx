import { notFound } from "next/navigation";
import { Sidebar } from "@/components/sidebar/sidebar";
import { ChatArea } from "@/components/chat/chat-area";

// TODO：バックエンドの実装ができたら削除
const channelIds = [1, 2, 3, 4, 5];

interface ChannelPageProps {
  params: Promise<{
    channelId: string;
  }>;
}

export default async function ChannelPage({ params }: ChannelPageProps) {
  const { channelId } = await params;
  const channelIdNum = parseInt(channelId, 10);

  // TODO：チャンネルの一覧取得
  const channels = [
    { id: 1, name: "雑談" },
    { id: 2, name: "お知らせ" },
    { id: 3, name: "開発" },
    { id: 4, name: "デザイン" },
    { id: 5, name: "プロジェクト" },
  ];

  // TODO：メッセージの一覧取得はここでやった方がいいのか？

  // 無効なチャンネルIDの場合は404
  if (isNaN(channelIdNum) || !channelIds.includes(channelIdNum)) {
    notFound();
  }

  return (
    <div className="h-screen flex pt-16">
      <Sidebar selectedChannelId={channelIdNum} channels={channels} />
      <ChatArea selectedChannelId={channelIdNum} channels={channels} />
    </div>
  );
}