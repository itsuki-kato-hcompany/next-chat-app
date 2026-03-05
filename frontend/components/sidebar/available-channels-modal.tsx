"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Hash } from "lucide-react";
import type { Channel } from "../../src/generated/types";

type AvailableChannel = Pick<Channel, "id" | "name">;

interface AvailableChannelsModalProps {
  children: React.ReactNode;
}

export function AvailableChannelsModal({ children }: AvailableChannelsModalProps) {
  const [open, setOpen] = useState(false);
  const [channels, setChannels] = useState<AvailableChannel[]>([]);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState(false);

  const fetchChannels = useCallback(async () => {
    setFetching(true);
    setError(false);
    try {
      // 未参加チャンネル一覧をroute handler経由で取得
      const res = await fetch("/api/available-channels");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setChannels(data.channels);
    } catch {
      setError(true);
    } finally {
      setFetching(false);
    }
  }, []);

  useEffect(() => {
    if (open) {
      fetchChannels();
    }
  }, [open, fetchChannels]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>チャンネルを探す</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-80">
          <div className="space-y-1">
            {fetching && (
              <p className="text-sm text-muted-foreground py-4 text-center">
                読み込み中...
              </p>
            )}
            {error && (
              <p className="text-sm text-red-500 py-4 text-center">
                チャンネルの取得に失敗しました
              </p>
            )}
            {!fetching && !error && channels.length === 0 && (
              <p className="text-sm text-muted-foreground py-4 text-center">
                参加可能なチャンネルはありません
              </p>
            )}
            {channels.map((channel) => (
              <div
                key={channel.id}
                className="flex items-center justify-between px-3 py-2 rounded-md hover:bg-slate-100"
              >
                <div className="flex items-center gap-2">
                  <Hash className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">{channel.name}</span>
                </div>
                <Button size="sm" variant="outline">
                  参加
                </Button>
              </div>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
