"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Trash2, Edit, Plus, Power } from "lucide-react";
import { toast } from "sonner";

interface SystemPrompt {
  id: string;
  name: string;
  content: string;
  description?: string;
  active: boolean;
  createdAt: string;
}

export default function PromptsManagement() {
  const [prompts, setPrompts] = useState<SystemPrompt[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingPrompt, setEditingPrompt] = useState<SystemPrompt | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    content: "",
  });

  useEffect(() => {
    fetchPrompts();
  }, []);

  const fetchPrompts = async () => {
    try {
      const response = await fetch("/api/admin/chat/system-prompts");
      const data = await response.json();
      setPrompts(data.prompts);
    } catch (error) {
      toast.error("Failed to fetch prompts");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const url = editingPrompt
        ? `/api/admin/chat/system-prompts/${editingPrompt.id}`
        : "/api/admin/chat/system-prompts";

      const method = editingPrompt ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success(
          `Prompt ${editingPrompt ? "updated" : "created"} successfully`,
        );

        setFormData({ name: "", content: "" });
        setShowCreateForm(false);
        setEditingPrompt(null);
        fetchPrompts();
      }
    } catch (error) {
      toast.error("Failed to save prompt");
    }
  };

  const activatePrompt = async (id: string) => {
    try {
      const response = await fetch(
        `/api/admin/chat/system-prompts/${id}/activate`,
        {
          method: "POST",
        },
      );

      if (response.ok) {
        toast.success("Prompt activated successfully");
        fetchPrompts();
      }
    } catch (error) {
      toast.error("Failed to activate prompt");
    }
  };

  const deletePrompt = async (id: string) => {
    if (!confirm("Are you sure you want to delete this prompt?")) return;

    try {
      const response = await fetch(`/api/admin/chat/system-prompts/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Prompt deleted successfully");
        fetchPrompts();
      }
    } catch (error) {
      toast.error("Failed to delete prompt");
    }
  };

  const startEdit = (prompt: SystemPrompt) => {
    setEditingPrompt(prompt);
    setFormData({
      name: prompt.name,
      content: prompt.content,
    });
    setShowCreateForm(true);
  };

  const cancelEdit = () => {
    setEditingPrompt(null);
    setShowCreateForm(false);
    setFormData({ name: "", content: "" });
  };

  if (isLoading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="mx-auto max-w-6xl p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">AI Prompts Management</h1>
          <p className="text-gray-600">
            Manage your AI assistant personalities
          </p>
        </div>
        <Button
          onClick={() => setShowCreateForm(true)}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Create Prompt
        </Button>
      </div>

      {showCreateForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>
              {editingPrompt ? "Edit Prompt" : "Create New Prompt"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium">Name</label>
                <Input
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="e.g., Superhero Assistant"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  System Prompt
                </label>
                <Textarea
                  value={formData.content}
                  onChange={(e) =>
                    setFormData({ ...formData, content: e.target.value })
                  }
                  placeholder="You are a superhero assistant who speaks with confidence and uses heroic language..."
                  rows={6}
                  required
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit">
                  {editingPrompt ? "Update" : "Create"} Prompt
                </Button>
                <Button type="button" variant="outline" onClick={cancelEdit}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {prompts.map((prompt) => (
          <Card
            key={prompt.id}
            className={prompt.active ? "ring-2 ring-green-500" : ""}
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {prompt.name}
                    {prompt.active && (
                      <Badge variant="default" className="bg-green-500">
                        Active
                      </Badge>
                    )}
                  </CardTitle>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant={prompt.active ? "secondary" : "default"}
                    onClick={() => activatePrompt(prompt.id)}
                    disabled={prompt.active}
                  >
                    <Power className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => startEdit(prompt)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => deletePrompt(prompt.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded bg-gray-50 p-3 text-sm">
                <strong>System Prompt:</strong>
                <p className="mt-1 whitespace-pre-wrap">{prompt.content}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {prompts.length === 0 && (
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-gray-500">No prompts created yet.</p>
            <Button onClick={() => setShowCreateForm(true)} className="mt-4">
              Create Your First Prompt
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
