"use client";

import { useState, useCallback } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Trash2 } from "lucide-react";
import {
  useSystemPrompts,
  useCreateSystemPrompt,
  useUpdateSystemPrompt,
  useDeleteSystemPrompt,
} from "@/hooks/use-admin-chat-api";
import { toast } from "sonner";

interface TestMessage {
  user: string;
  bot: string;
}

export default function AdminDashboardChatPromptSettings() {
  const { data: prompts = [], isLoading } = useSystemPrompts();
  const createPrompt = useCreateSystemPrompt();
  const updatePrompt = useUpdateSystemPrompt();
  const deletePrompt = useDeleteSystemPrompt();

  const [editingPrompts, setEditingPrompts] = useState<
    Record<string, { name: string; content: string }>
  >({});
  const [testInputs, setTestInputs] = useState<Record<string, string>>({});
  const [conversations, setConversations] = useState<
    Record<string, TestMessage[]>
  >({});
  const [newPrompt, setNewPrompt] = useState({ name: "", content: "" });

  const updateEditingPrompt = useCallback(
    (id: string, field: "name" | "content", value: string) => {
      setEditingPrompts((prev) => ({
        ...prev,
        [id]: {
          ...prev[id],
          [field]: value,
        },
      }));
    },
    [],
  );

  const updateTestInput = useCallback((id: string, value: string) => {
    setTestInputs((prev) => ({ ...prev, [id]: value }));
  }, []);

  const handleTest = useCallback(
    (promptId: string) => {
      const prompt = prompts.find((p) => p.id === promptId);
      const userMessage = testInputs[promptId]?.trim();
      if (!prompt || !userMessage) return;

      const botReply = `🤖 [Mock response to "${userMessage}" using prompt "${prompt.name}"]`;

      setConversations((prev) => ({
        ...prev,
        [promptId]: [
          ...(prev[promptId] || []),
          { user: userMessage, bot: botReply },
        ],
      }));
      setTestInputs((prev) => ({ ...prev, [promptId]: "" }));
    },
    [prompts, testInputs],
  );

  const handleSavePrompt = async (promptId: string) => {
    const editedPrompt = editingPrompts[promptId];
    if (!editedPrompt) return;

    try {
      await updatePrompt.mutateAsync({
        id: promptId,
        ...editedPrompt,
      });
      setEditingPrompts((prev) => {
        const { [promptId]: _, ...rest } = prev;
        return rest;
      });
    } catch (error) {
      toast.error("Failed to save prompt");
    }
  };

  const handleDeletePrompt = async (promptId: string) => {
    if (!confirm("Are you sure you want to delete this prompt?")) return;

    try {
      await deletePrompt.mutateAsync(promptId);
    } catch (error) {
      toast.error("Failed to delete prompt");
    }
  };

  const handleCreatePrompt = async () => {
    if (!newPrompt.name.trim() || !newPrompt.content.trim()) {
      toast.error("Please fill in both name and content");
      return;
    }

    try {
      await createPrompt.mutateAsync(newPrompt);
      setNewPrompt({ name: "", content: "" });
    } catch (error) {
      toast.error("Failed to create prompt");
    }
  };

  const startEditing = (prompt: any) => {
    setEditingPrompts((prev) => ({
      ...prev,
      [prompt.id]: {
        name: prompt.name,
        content: prompt.content,
      },
    }));
  };

  const cancelEditing = (promptId: string) => {
    setEditingPrompts((prev) => {
      const { [promptId]: _, ...rest } = prev;
      return rest;
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-6">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2 border-indigo-600"></div>
          <p>Loading system prompts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">System Prompt Settings</h2>
      </div>

      {/* Create New Prompt */}
      <Card className="p-6">
        <h3 className="mb-4 text-lg font-semibold">Create New Prompt</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-1">
            <Label htmlFor="new-name">Name</Label>
            <Input
              id="new-name"
              value={newPrompt.name}
              onChange={(e) =>
                setNewPrompt((prev) => ({ ...prev, name: e.target.value }))
              }
              placeholder="e.g. Greeting Prompt"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="new-content">Prompt Text</Label>
            <Textarea
              id="new-content"
              value={newPrompt.content}
              onChange={(e) =>
                setNewPrompt((prev) => ({ ...prev, content: e.target.value }))
              }
              placeholder="Hello, how can I help you today?"
              className="h-24"
            />
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <Button
            onClick={handleCreatePrompt}
            disabled={createPrompt.isPending}
          >
            {createPrompt.isPending ? "Creating..." : "Create Prompt"}
          </Button>
        </div>
      </Card>

      {/* Existing Prompts */}
      <div className="space-y-6">
        {prompts.map((prompt) => {
          const isEditing = editingPrompts[prompt.id];
          const currentName = isEditing?.name ?? prompt.name;
          const currentContent = isEditing?.content ?? prompt.content;

          return (
            <Card key={prompt.id} className="p-6">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold">
                  {isEditing ? "Editing Prompt" : prompt.name}
                </h3>
                <div className="flex gap-2">
                  {isEditing ? (
                    <>
                      <Button
                        size="sm"
                        onClick={() => handleSavePrompt(prompt.id)}
                        disabled={updatePrompt.isPending}
                      >
                        {updatePrompt.isPending ? "Saving..." : "Save"}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => cancelEditing(prompt.id)}
                      >
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => startEditing(prompt)}
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeletePrompt(prompt.id)}
                        disabled={deletePrompt.isPending}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </div>
              </div>

              {/* Name & Content */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-1">
                  <Label htmlFor={`name-${prompt.id}`}>Name</Label>
                  <Input
                    id={`name-${prompt.id}`}
                    value={currentName}
                    onChange={(e) =>
                      updateEditingPrompt(prompt.id, "name", e.target.value)
                    }
                    placeholder="e.g. Greeting Prompt"
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor={`content-${prompt.id}`}>Prompt Text</Label>
                  <Textarea
                    id={`content-${prompt.id}`}
                    value={currentContent}
                    onChange={(e) =>
                      updateEditingPrompt(prompt.id, "content", e.target.value)
                    }
                    placeholder="Hello, how can I help you today?"
                    className="h-24"
                    disabled={!isEditing}
                  />
                </div>
              </div>

              {/* Test Playground */}
              <div className="mt-4 space-y-3 border-t pt-4">
                <h4 className="font-medium">Test Prompt</h4>
                <div className="max-h-64 space-y-2 overflow-y-auto rounded bg-gray-50 p-3">
                  {(conversations[prompt.id] || []).map((msg, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="text-right text-sm text-blue-600">
                        You: {msg.user}
                      </div>
                      <div className="text-left text-sm text-gray-800">
                        Bot: {msg.bot}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex items-start gap-2">
                  <Input
                    className="flex-1"
                    placeholder="Type a message..."
                    value={testInputs[prompt.id] || ""}
                    onChange={(e) => updateTestInput(prompt.id, e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleTest(prompt.id);
                      }
                    }}
                  />
                  <Button onClick={() => handleTest(prompt.id)}>Send</Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {prompts.length === 0 && (
        <Card className="p-6 text-center">
          <p className="text-gray-500">
            No system prompts found. Create your first prompt above.
          </p>
        </Card>
      )}
    </div>
  );
}
