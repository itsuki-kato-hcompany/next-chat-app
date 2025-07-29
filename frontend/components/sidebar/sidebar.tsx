"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Hash } from "lucide-react";
import { useRouter } from "next/navigation";

// モックデータ
const mockChannels = [
  { id: 1, name: "雑談", unreadCount: 3 },
  { id: 2, name: "お知らせ", unreadCount: 0 },
  { id: 3, name: "開発", unreadCount: 12 },
  { id: 4, name: "デザイン", unreadCount: 1 },
  { id: 5, name: "プロジェクト", unreadCount: 0 },
];

interface SidebarProps {
  selectedChannelId: number;
}

export function Sidebar({ selectedChannelId }: SidebarProps) {
  const router = useRouter();

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
          {mockChannels.map((channel) => (
            <Button
              key={channel.id}
              variant={selectedChannelId === channel.id ? "secondary" : "ghost"}
              className="w-full justify-start text-left"
              onClick={() => handleChannelSelect(channel.id)}
            >
              <Hash className="w-4 h-4 mr-2" />
              <span className="flex-1">{channel.name}</span>
              {channel.unreadCount > 0 && (
                <span className="ml-auto bg-blue-500 text-white text-xs rounded-full px-2 py-0.5 min-w-[20px] text-center">
                  {channel.unreadCount}
                </span>
              )}
            </Button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}