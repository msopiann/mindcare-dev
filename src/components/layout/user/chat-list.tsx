import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import type { Chat } from "./chat-interface";

interface ChatListProps {
  chats: Chat[];
  selectedChatId: string | null;
  onSelectChat: (chatId: string) => void;
}

export function ChatList({
  chats,
  selectedChatId,
  onSelectChat,
}: ChatListProps) {
  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="border-b p-4">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Messages</h2>
        </div>
      </div>

      {/* Chat List */}
      <ScrollArea className="flex-1">
        <div className="p-2">
          {chats.map((chat, index) => (
            <div key={chat.id}>
              <div
                className={cn(
                  "hover:bg-muted/50 flex cursor-pointer items-center gap-3 rounded-lg p-3 transition-colors",
                  selectedChatId === chat.id && "bg-muted",
                )}
                onClick={() => onSelectChat(chat.id)}
              >
                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex items-center justify-between">
                    <h3 className="truncate text-sm font-medium">
                      {chat.topic}
                    </h3>
                  </div>
                  <p className="text-muted-foreground line-clamp-1 text-sm">
                    {chat.lastMessage}
                  </p>
                </div>
              </div>
              {index < chats.length - 1 && <Separator className="my-1" />}
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
