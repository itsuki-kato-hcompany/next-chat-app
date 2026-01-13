"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageItem } from "./message-item";
import { useAuth } from "@/lib/auth-context";
import type { Message } from "../../src/generated/types";

interface MessageListProps {
  messages: Message[];
}

export function MessageList({ messages }: MessageListProps) {
  const { user } = useAuth();
  const currentUserId = user?.id ?? 0;
  if (!messages || messages.length === 0) {
    return (
      <ScrollArea className="flex-1 px-4">
        <div className="flex-1 flex items-center justify-center text-gray-500 py-8">
          <p>まだメッセージがありません。</p>
        </div>
      </ScrollArea>
    );
  }

  return (
    <ScrollArea className="flex-1 px-4">
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