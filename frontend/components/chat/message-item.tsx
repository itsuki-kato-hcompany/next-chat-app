import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { formatMessageTime } from "@/lib/date-utils";
import type { Message } from "../../src/generated/types";

interface MessageItemProps {
  message: Message;
  isOwnMessage?: boolean;
  currentUserId?: number;
}

export function MessageItem({ message, isOwnMessage = false, currentUserId }: MessageItemProps) {
  // 自分のメッセージかどうかを判定
  const isOwn = currentUserId ? message.userId === currentUserId : isOwnMessage;

  return (
    <div className={cn(
      "flex gap-3 p-3 hover:bg-slate-50",
      isOwn && "flex-row-reverse"
    )}>
      <Avatar className="w-8 h-8">
        <AvatarImage src={message.user?.profileImgPath || undefined} />
        <AvatarFallback className="text-xs">
          {message.user?.name ? message.user.name.slice(0, 2).toUpperCase() : 'U'}
        </AvatarFallback>
      </Avatar>

      <div className={cn(
        "max-w-[70%] min-w-0",
        isOwn && "flex flex-col items-end"
      )}>
        <div className={cn(
          "flex items-baseline gap-2 mb-1",
          isOwn && "flex-row-reverse"
        )}>
          <span className="font-medium text-sm">{message.user?.name || 'Unknown User'}</span>
          <span className="text-xs text-slate-500">{formatMessageTime(message.createdAt)}</span>
        </div>

        <div className={cn(
          "bg-white border rounded-lg p-3 shadow-sm inline-block",
          isOwn && "bg-blue-50 border-blue-200"
        )}>
          <p className="text-sm whitespace-pre-wrap break-words">
            {message.message}
          </p>
        </div>
      </div>
    </div>
  );
}