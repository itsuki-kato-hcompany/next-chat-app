"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Hash } from "lucide-react";

interface CreateChannelModalProps {
  children: React.ReactNode;
}

/**
 * チャンネル作成モーダルコンポーネント
 * - チャンネル名を入力して新規チャンネルを作成
 * - 作成者は自動でOWNERロールで参加
 * - 作成後は新チャンネルに遷移
 */
export function CreateChannelModal({ children }: CreateChannelModalProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // モーダルを閉じた時にステートをリセット
  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      setName("");
      setError(null);
    }
  };

  /**
   * チャンネル作成をroute handler経由で実行
   * 成功時はwindow.location.hrefで遷移（キャッシュ回避のため）
   */
  const handleCreate = async () => {
    const trimmedName = name.trim();

    // バリデーション
    if (trimmedName.length === 0) {
      setError("チャンネル名を入力してください");
      return;
    }
    if (trimmedName.length > 20) {
      setError("チャンネル名は20文字以内で入力してください");
      return;
    }

    setCreating(true);
    setError(null);
    try {
      const res = await fetch("/api/create-channel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: trimmedName }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "チャンネルの作成に失敗しました");
      }

      const data = await res.json();
      // 作成したチャンネルに遷移（サイドバー更新のためフルリロード）
      setOpen(false);
      window.location.href = `/channels/${data.channel.id}`;
    } catch (err) {
      setError(err instanceof Error ? err.message : "チャンネルの作成に失敗しました");
    } finally {
      setCreating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>チャンネルを作成</DialogTitle>
        </DialogHeader>

        {/* チャンネル名入力 */}
        <div className="space-y-2">
          <label htmlFor="channel-name" className="text-sm font-medium">
            チャンネル名
          </label>
          <div className="relative">
            <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              id="channel-name"
              placeholder="例: 雑談、開発チーム"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !creating) handleCreate();
              }}
              maxLength={20}
              className="pl-9"
            />
          </div>
          {/* 文字数カウンター */}
          <p className="text-xs text-muted-foreground text-right">
            {name.length}/20
          </p>
        </div>

        {/* エラーメッセージ */}
        {error && (
          <p className="text-sm text-red-500">{error}</p>
        )}

        {/* 作成ボタン */}
        <Button
          onClick={handleCreate}
          disabled={name.trim().length === 0 || creating}
          className="w-full"
        >
          {creating ? "作成中..." : "作成"}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
