"use client";

import { useEffect, useState } from "react";
import { ChatArea } from "./chat-area";
import { useMessageAddedSubscription } from "../../src/generated/hooks";
import type { Message } from "../../src/generated/types";

interface ChatContainerProps {
  selectedChannelId: number;
  channelName: string;
  initialMessages: Message[];
}

export function ChatContainer({
  selectedChannelId,
  channelName,
  initialMessages,
}: ChatContainerProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);

  const [subscriptionResult] = useMessageAddedSubscription();

  useEffect(() => {
    if (subscriptionResult.data?.messageAdded) {
      const newMessage = subscriptionResult.data.messageAdded;
      // TODO：全てのチャンネルのメッセージを受信してしまっている。要修正。
      if (newMessage.channelId === selectedChannelId) {
        setMessages((currentMessages) => {
          const messageExists = currentMessages.some(m => m.id === newMessage.id);
          if (!messageExists) {
            return [...currentMessages, newMessage];
          }
          return currentMessages;
        });
      }
    }
  }, [subscriptionResult.data, selectedChannelId]);

  useEffect(() => {
    setMessages(initialMessages);
  }, [selectedChannelId, initialMessages]);

  return (
    <ChatArea
      selectedChannelId={selectedChannelId}
      channelName={channelName}
      messages={messages}
    />
  );
}