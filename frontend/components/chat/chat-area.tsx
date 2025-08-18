import { MessageList } from "./message-list";
import { MessageInput } from "./message-input";
import { Hash } from "lucide-react";
import type { Message } from "../../src/generated/types";

interface ChatAreaProps {
  selectedChannelId: number;
  channelName: string;
  messages: Message[];
  currentUserId?: number;
}

export function ChatArea({ selectedChannelId, channelName, messages, currentUserId }: ChatAreaProps) {

  return (
    <div className="flex-1 flex flex-col bg-white">
      {/* チャンネルヘッダー */}
      <div className="border-b bg-white px-4 py-3">
        <div className="flex items-center gap-2">
          <Hash className="w-5 h-5 text-gray-600" />
          <h1 className="font-semibold text-lg">{channelName}</h1>
          <span className="text-sm text-gray-500 ml-auto">
            {messages.length} メッセージ
          </span>
        </div>
      </div>

      {/* メッセージエリア */}
      <div className="flex-1 flex flex-col min-h-0">
        <MessageList
          channelId={selectedChannelId}
          messages={messages}
          currentUserId={currentUserId}
        />
        <MessageInput channelId={selectedChannelId} />
      </div>
    </div>
  );
}