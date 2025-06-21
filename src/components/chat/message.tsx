import clsx from "clsx";
import { Message as MessageType } from "./message-list";
import Image from "next/image";

export interface MessageProps {
  message: MessageType;
}

export default function Message({ message }: MessageProps) {
  const isUser = message.sender === "user";

  return (
    <div className="flex w-full flex-row items-start space-x-3 px-4 py-2 sm:px-6 sm:py-3">
      {/* Avatar */}
      <div className="shrink-0">
        <div className="h-8 w-8">
          <Image
            src={
              isUser
                ? "/assets/image/chat/avatar-user.png"
                : "/assets/image/chat/avatar-bot.png"
            }
            alt="Avatar"
            width={32}
            height={32}
            className="rounded-full object-cover"
          />
        </div>
      </div>

      {/* Message Content */}
      <div className="flex flex-1 flex-col">
        {/* Sender and Timestamp */}
        <div className="flex flex-wrap items-center gap-2 text-sm sm:text-base">
          <p className="font-medium">{isUser ? "You" : "Mindcare"}</p>
          <time className="text-xs text-gray-500 dark:text-gray-400">
            {message.timestamp}
          </time>
        </div>

        {/* Message Bubble */}
        <div
          role="listitem"
          className={clsx(
            "mt-2 w-fit max-w-[90%] rounded-lg px-4 py-2 text-sm break-words sm:text-base",
            isUser
              ? "bg-[#F8FAFC] text-[#475569] dark:bg-[#475569] dark:text-[#F8FAFC]"
              : "bg-[#F8FAFC] text-[#475569] dark:bg-[#475569] dark:text-[#F8FAFC]",
          )}
        >
          <p className="whitespace-pre-wrap">{message.text}</p>
        </div>
      </div>
    </div>
  );
}
