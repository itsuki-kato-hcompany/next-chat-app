"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageItem } from "./message-item";
import { useEffect } from "react";

// モックデータ
const messages = [
  {
    id: 1,
    user: { id: 1, name: "田中さん", avatar: undefined },
    message: "皆さんお疲れさまです！プロジェクトの進捗はいかがですか？",
    createdAt: "10:30",
  },
  {
    id: 2,
    user: { id: 2, name: "佐藤さん", avatar: undefined },
    message: "順調に進んでいます！API連携が完了しました。認証周りも問題なく動作しています。",
    createdAt: "10:32",
  },
  {
    id: 3,
    user: { id: 3, name: "あなた", avatar: undefined },
    message: "お疲れさまです！今日からフロントエンドのコンポーネント作成を始めます。",
    createdAt: "10:35",
  },
  {
    id: 4,
    user: { id: 1, name: "田中さん", avatar: undefined },
    message: "ありがとうございます！デザイン素材が必要でしたらお声がけください。",
    createdAt: "10:37",
  },
  {
    id: 5,
    user: { id: 4, name: "山田さん", avatar: undefined },
    message: "コンポーネントができたらテストのお手伝いします！🧪",
    createdAt: "10:40",
  },
  {
    id: 6,
    user: { id: 3, name: "あなた", avatar: undefined },
    message: "ありがとうございます！テスト可能な状態になったらご連絡します。",
    createdAt: "10:42",
  },
];

interface MessageListProps {
  channelId: number;
}

export function MessageList({ channelId }: MessageListProps) {
  const currentUserId = 3; // 仮の現在のユーザーID

  useEffect(() => {
    // TODO：多分ここでAPIからメッセージを取得して表示する
  }, [channelId]);

  return (
    <ScrollArea className="flex-1 px-4">
      <div className="space-y-2 py-4">
        {messages.map((message) => (
          <MessageItem
            key={message.id}
            message={message}
            isOwnMessage={message.user.id === currentUserId}
          />
        ))}
      </div>
    </ScrollArea>
  );
}