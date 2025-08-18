"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageItem } from "./message-item";
import { useEffect, useRef } from "react";
import type { Message } from "../../src/generated/types";

interface MessageListProps {
  channelId: number;
  messages: Message[];
  currentUserId?: number;
}

export function MessageList({ channelId, messages, currentUserId = 1 }: MessageListProps) {
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // チャンネル変更時やメッセージ追加時にスクロールを最下部に移動
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight;
      }
    }
  }, [messages, channelId]);

  if (!messages || messages.length === 0) {
    return (
      <ScrollArea className="flex-1 px-4">
        <div className="flex-1 flex items-center justify-center text-gray-500 py-8">
          <p>まだメッセージがありません。最初のメッセージを送信してみましょう！</p>
        </div>
      </ScrollArea>
    );
  }

  return (
    <ScrollArea className="flex-1 px-4" ref={scrollAreaRef}>
      <div className="space-y-2 py-4">
        {messages.map((message) => (
          <MessageItem
            key={message.id}
            message={message}
            currentUserId={currentUserId}
          />
        ))}
      </div>
    </ScrollArea>
  );
}