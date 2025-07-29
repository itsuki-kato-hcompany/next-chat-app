import { notFound } from "next/navigation";
import { Sidebar } from "@/components/sidebar/sidebar";
import { ChatArea } from "@/components/chat/chat-area";

// モックデータ - 有効なチャンネルID
const validChannelIds = [1, 2, 3, 4, 5];

interface ChannelPageProps {
  params: Promise<{
    channelId: string;
  }>;
}

export default async function ChannelPage({ params }: ChannelPageProps) {
  const { channelId } = await params;
  const channelIdNum = parseInt(channelId, 10);

  // 無効なチャンネルIDの場合は404
  if (isNaN(channelIdNum) || !validChannelIds.includes(channelIdNum)) {
    notFound();
  }

  return (
    <div className="h-screen flex pt-16">
      <Sidebar selectedChannelId={channelIdNum} />
      <ChatArea selectedChannelId={channelIdNum} />
    </div>
  );
}