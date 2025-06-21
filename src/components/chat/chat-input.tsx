"use client";

import { useState, type FormEvent } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ArrowUp, Mic, Paperclip } from "lucide-react";

export interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export default function ChatInput({
  onSend,
  disabled = false,
}: ChatInputProps) {
  const [value, setValue] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!value.trim() || disabled) return;
    onSend(value.trim());
    setValue("");
  };

  return (
    <form onSubmit={handleSubmit} className="px-4 py-2">
      <div className="bg-background focus-within:ring-ring rounded-6xl flex items-center gap-2 border px-3 py-2 shadow-sm focus-within:ring-2">
        {/* Attach button */}
        <button
          type="button"
          disabled={disabled}
          className="text-muted-foreground hover:text-foreground p-2 disabled:opacity-50"
        >
          <Paperclip className="h-5 w-5" />
        </button>

        {/* Textarea */}
        <Textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={disabled ? "Sending..." : "Message Mindcare..."}
          disabled={disabled}
          className="flex-1 resize-none border-none bg-transparent px-2 py-1 text-sm focus-visible:ring-0 focus-visible:ring-offset-0"
          rows={1}
        />

        {/* Voice button */}
        <button
          type="button"
          disabled={disabled}
          className="text-muted-foreground hover:text-foreground p-2 disabled:opacity-50"
        >
          <Mic className="h-5 w-5" />
        </button>

        {/* Send button */}
        <Button
          type="submit"
          size="icon"
          disabled={disabled || !value.trim()}
          className="h-8 w-8 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50"
        >
          <ArrowUp className="h-4 w-4" />
        </Button>
      </div>
    </form>
  );
}
