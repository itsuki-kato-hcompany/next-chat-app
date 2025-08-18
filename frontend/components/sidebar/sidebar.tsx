"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Hash } from "lucide-react";
import { useRouter } from "next/navigation";
import type { Channel } from "../../src/generated/types";

interface SidebarProps {
  selectedChannelId: number;
  channels: Channel[];
}

export function Sidebar({ selectedChannelId, channels }: SidebarProps) {
  const router = useRouter();

  // チャンネル選択時のハンドラー
  const handleChannelSelect = (channelId: number) => {
    router.push(`/channels/${channelId}`);
  };

  return (
    <div className="w-64 bg-slate-100 border-r flex flex-col h-full">
      <div className="p-4 border-b">
        <h2 className="font-semibold text-lg">チャンネル</h2>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {channels.map((channel) => (
            <Button
              key={channel.id}
              variant={selectedChannelId === channel.id ? "secondary" : "ghost"}
              className="w-full justify-start text-left transition-colors duration-200 hover:!bg-slate-200/75"
              onClick={() => handleChannelSelect(channel.id)}
            >
              <Hash className="w-4 h-4 mr-2" />
              <span className="flex-1">{channel.name}</span>
            </Button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}