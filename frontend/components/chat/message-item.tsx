import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface Message {
  id: number;
  user: {
    id: number;
    name: string;
    avatar?: string;
  };
  message: string;
  createdAt: string;
}

interface MessageItemProps {
  message: Message;
  isOwnMessage?: boolean;
}

export function MessageItem({ message, isOwnMessage = false }: MessageItemProps) {
  return (
    <div className={cn(
      "flex gap-3 p-3 hover:bg-slate-50",
      isOwnMessage && "flex-row-reverse"
    )}>
      <Avatar className="w-8 h-8">
        <AvatarImage src={message.user.avatar} />
        <AvatarFallback className="text-xs">
          {message.user.name.slice(0, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar>

      <div className={cn(
        "max-w-[70%] min-w-0",
        isOwnMessage && "flex flex-col items-end"
      )}>
        <div className={cn(
          "flex items-baseline gap-2 mb-1",
          isOwnMessage && "flex-row-reverse"
        )}>
          <span className="font-medium text-sm">{message.user.name}</span>
          <span className="text-xs text-slate-500">{message.createdAt}</span>
        </div>

        <div className={cn(
          "bg-white border rounded-lg p-3 shadow-sm inline-block",
          isOwnMessage && "bg-blue-50 border-blue-200"
        )}>
          <p className="text-sm whitespace-pre-wrap break-words">
            {message.message}
          </p>
        </div>
      </div>
    </div>
  );
}