import Message from "./message";

export interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: string;
}

export interface MessageListProps {
  messages: Message[];
}

export default function MessageList({ messages }: MessageListProps) {
  return (
    <div
      role="list"
      className="flex flex-1 flex-col overflow-y-auto px-4 py-2 md:px-16"
    >
      {messages.map((msg) => (
        <Message key={msg.id} message={msg} />
      ))}
    </div>
  );
}
