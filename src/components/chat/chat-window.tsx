import ChatInput, { ChatInputProps } from "./chat-input";
import type { Message as MessageType } from "./message-list";
import MessageList from "./message-list";

export interface ChatWindowProps {
  messages: MessageType[];
  onSendMessage: ChatInputProps["onSend"];
  isLoading?: boolean;
}

export default function ChatWindow({
  messages,
  onSendMessage,
  isLoading = false,
}: ChatWindowProps) {
  return (
    <main className="bg-background flex flex-1 flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto">
        {isLoading && messages.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <div className="mx-auto mb-2 h-6 w-6 animate-spin rounded-full border-b-2 border-indigo-600"></div>
              <p className="text-sm text-gray-500">Loading messages...</p>
            </div>
          </div>
        ) : (
          <MessageList messages={messages} />
        )}
      </div>
      <div className="flex-shrink-0">
        <ChatInput onSend={onSendMessage} disabled={isLoading} />
        <footer className="py-2 text-center text-xs text-gray-500 dark:text-gray-400">
          Mindcare can make mistakes. Check our Terms & Conditions.
        </footer>
      </div>
    </main>
  );
}
