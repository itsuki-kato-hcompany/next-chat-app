"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import { useState } from "react";
import { useSendMessageMutation } from "../../src/generated/hooks";
import { useAuth } from "@/lib/auth-context";

interface MessageInputProps {
  channelId: number;
}

export function MessageInput({ channelId }: MessageInputProps) {
  const { user } = useAuth();
  const currentUserId = user?.id ?? 0;
  const [message, setMessage] = useState("");
  const [{ fetching }, sendMessage] = useSendMessageMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fetching) {
      try {
        await sendMessage({
          messageInput: {
            message: message,
            userId: currentUserId,
            channelId: channelId,
          },
        });
        setMessage("");
      } catch (error) {
        console.error("メッセージ送信エラー:", error);
      }
    }
  };

  return (
    <div className="border-t bg-white p-4">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="メッセージを入力..."
          className="flex-1"
          autoComplete="off"
        />
        <Button
          type="submit"
          size="icon"
          disabled={!message || fetching}
        >
          <Send className="w-4 h-4" />
        </Button>
      </form>
    </div>
  );
}