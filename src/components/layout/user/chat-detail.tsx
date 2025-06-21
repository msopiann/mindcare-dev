import { cn } from "@/lib/utils";
import { AvatarFallback } from "@/components/ui/avatar";
import { AvatarImage } from "@/components/ui/avatar";
import { Avatar } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Chat, Message } from "./chat-interface";

interface ChatDetailProps {
  chat: Chat;
  messages: Message[];
  isLoading?: boolean;
}

export function ChatDetail({
  chat,
  messages,
  isLoading = false,
}: ChatDetailProps) {
  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b p-4">
        <div className="flex items-center gap-3">
          <div>
            <h3 className="font-medium">{chat.topic}</h3>
            <p className="text-muted-foreground text-sm">
              {chat.messageCount} messages
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        {isLoading ? (
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <div className="mx-auto mb-2 h-6 w-6 animate-spin rounded-full border-b-2 border-indigo-600"></div>
              <p className="text-sm text-gray-500">Loading messages...</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <div key={message.id} className="flex justify-start gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={message.avatar || "/placeholder.svg"}
                    alt={message.senderName}
                  />
                  <AvatarFallback>
                    {message.senderName?.charAt(0)}
                  </AvatarFallback>
                </Avatar>

                <div
                  className={cn(
                    "max-w-[70%] rounded-lg px-3 py-2",
                    message.isOwn
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted",
                  )}
                >
                  <p className="text-sm">{message.content}</p>
                  <p
                    className={cn(
                      "mt-1 text-xs",
                      message.isOwn
                        ? "text-primary-foreground/70"
                        : "text-muted-foreground",
                    )}
                  >
                    {message.timestamp}
                  </p>
                </div>
              </div>
            ))}
            {messages.length === 0 && !isLoading && (
              <p className="text-center text-sm text-gray-500">
                No messages in this conversation yet.
              </p>
            )}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
