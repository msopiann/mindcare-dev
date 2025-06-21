"use client";

import Image from "next/image";
import { ChevronDown, Menu, Settings } from "lucide-react";
import ChatThemeToggle from "./custom-theme-toggle";

const ChatHeader = () => {
  return (
    <header className="bg-background flex items-center justify-between border-b px-4 py-2">
      {/* Brand / context selector */}
      <div className="flex items-center space-x-2">
        <button
          aria-label="Select chat context"
          className="flex items-center rounded text-lg font-medium hover:text-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:hover:text-gray-300"
        >
          Chat Mind
          <ChevronDown className="ml-1 h-4 w-4" />
        </button>
      </div>

      {/* Dark mode toggle */}
      <ChatThemeToggle />
      {/* Controls */}
      <div className="flex items-center space-x-4">
        {/* Menu / Settings / Avatar */}
        <button
          aria-label="Open menu"
          className="rounded p-2 hover:bg-gray-100 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:hover:bg-gray-700"
        >
          <Menu className="h-5 w-5" />
        </button>
        <button
          aria-label="Settings"
          className="rounded p-2 hover:bg-gray-100 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:hover:bg-gray-700"
        >
          <Settings className="h-5 w-5" />
        </button>
        <Image
          src="/assets/image/chat/avatar-user.png"
          alt="User avatar"
          width={32}
          height={32}
          className="rounded-full"
        />
      </div>
    </header>
  );
};

export default ChatHeader;
