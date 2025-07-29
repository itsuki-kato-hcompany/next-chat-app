import { MessageList } from "./message-list";
import { MessageInput } from "./message-input";
import { Hash } from "lucide-react";

interface ChatAreaProps {
  selectedChannelId: number;
  channels: any[]; // TODO：バックエンド実装後に型を定義する
}

export function ChatArea({ selectedChannelId, channels }: ChatAreaProps) {
  // 現在選択されているチャンネルIDを取得
  const selectedChannel = channels.find(channel => channel.id === selectedChannelId);

  if (!selectedChannel) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center text-gray-500">
          <Hash className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>チャンネルを選択してチャットを開始</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-white">
      {/* チャンネルヘッダー */}
      <div className="border-b bg-white px-4 py-3">
        <div className="flex items-center gap-2">
          <Hash className="w-5 h-5 text-gray-600" />
          <h1 className="font-semibold text-lg">{selectedChannel.name}</h1>
        </div>
      </div>

      {/* メッセージエリア */}
      <div className="flex-1 flex flex-col min-h-0">
        <MessageList channelId={selectedChannelId} />
        <MessageInput channelId={selectedChannelId} />
      </div>
    </div>
  );
}