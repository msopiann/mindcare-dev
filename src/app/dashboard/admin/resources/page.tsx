"use client";

import React from "react";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  BookOpen,
  Video,
  Headphones,
  FileText,
  PenToolIcon as Tool,
  Plus,
  Edit,
  Trash2,
  Star,
  Search,
  ExternalLink,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useAdminResources,
  useCreateResource,
  useUpdateResource,
  useDeleteResource,
} from "@/hooks/use-resources-api";
import {
  createResourceSchema,
  updateResourceSchema,
  type CreateResourceInput,
  type UpdateResourceInput,
} from "@/lib/validations/resources";

const resourceTypeIcons = {
  ARTICLE: BookOpen,
  VIDEO: Video,
  PODCAST: Headphones,
  GUIDE: FileText,
  TOOL: Tool,
};

const resourceTypeLabels = {
  ARTICLE: "Article",
  VIDEO: "Video",
  PODCAST: "Podcast",
  GUIDE: "Guide",
  TOOL: "Tool",
};

export default function AdminResourcesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingResource, setEditingResource] = useState<any>(null);

  // Fetch resources
  const { data: resourcesData, isLoading } = useAdminResources();
  const resources = resourcesData?.resources || [];

  // Mutations
  const createResourceMutation = useCreateResource();
  const updateResourceMutation = useUpdateResource();
  const deleteResourceMutation = useDeleteResource();

  // Forms
  const createForm = useForm<CreateResourceInput>({
    resolver: zodResolver(createResourceSchema),
    defaultValues: {
      highlighted: false,
      type: "ARTICLE",
    },
  });

  const editForm = useForm<UpdateResourceInput>({
    resolver: zodResolver(updateResourceSchema),
  });

  // Filter resources by search query
  const filteredResources = resources.filter(
    (resource) =>
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.publisher.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.type.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const onCreateResource = (data: CreateResourceInput) => {
    createResourceMutation.mutate(data, {
      onSuccess: () => {
        setIsCreateDialogOpen(false);
        createForm.reset();
      },
    });
  };

  const onUpdateResource = (data: UpdateResourceInput) => {
    if (!editingResource) return;
    updateResourceMutation.mutate(
      { id: editingResource.id, data },
      {
        onSuccess: () => {
          setEditingResource(null);
          editForm.reset();
        },
      },
    );
  };

  const onDeleteResource = (resourceId: string) => {
    deleteResourceMutation.mutate(resourceId);
  };

  const openEditDialog = (resource: any) => {
    setEditingResource(resource);
    editForm.reset({
      title: resource.title,
      description: resource.description || "",
      type: resource.type,
      publisher: resource.publisher,
      image: resource.image || "",
      link: resource.link,
      highlighted: resource.highlighted,
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Resources Management</h1>
          <p className="text-muted-foreground">
            Create and manage mental health resources
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Resource
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Resource</DialogTitle>
              <DialogDescription>
                Add a new mental health resource for users to access.
              </DialogDescription>
            </DialogHeader>
            <form
              onSubmit={createForm.handleSubmit(onCreateResource)}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="md:col-span-2">
                  <Label htmlFor="create-title">Title</Label>
                  <Input
                    id="create-title"
                    {...createForm.register("title")}
                    className={
                      createForm.formState.errors.title ? "border-red-500" : ""
                    }
                  />
                  {createForm.formState.errors.title && (
                    <p className="text-sm text-red-500">
                      {createForm.formState.errors.title.message}
                    </p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="create-description">Description</Label>
                  <Textarea
                    id="create-description"
                    {...createForm.register("description")}
                    rows={3}
                  />
                  {createForm.formState.errors.description && (
                    <p className="text-sm text-red-500">
                      {createForm.formState.errors.description.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="create-type">Type</Label>
                  <Select
                    value={createForm.watch("type")}
                    onValueChange={(value) =>
                      createForm.setValue("type", value as any)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(resourceTypeLabels).map(
                        ([value, label]) => (
                          <SelectItem key={value} value={value}>
                            <div className="flex items-center">
                              {React.createElement(
                                resourceTypeIcons[
                                  value as keyof typeof resourceTypeIcons
                                ],
                                {
                                  className: "h-4 w-4 mr-2",
                                },
                              )}
                              {label}
                            </div>
                          </SelectItem>
                        ),
                      )}
                    </SelectContent>
                  </Select>
                  {createForm.formState.errors.type && (
                    <p className="text-sm text-red-500">
                      {createForm.formState.errors.type.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="create-publisher">Publisher</Label>
                  <Input
                    id="create-publisher"
                    {...createForm.register("publisher")}
                    className={
                      createForm.formState.errors.publisher
                        ? "border-red-500"
                        : ""
                    }
                  />
                  {createForm.formState.errors.publisher && (
                    <p className="text-sm text-red-500">
                      {createForm.formState.errors.publisher.message}
                    </p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="create-link">Link</Label>
                  <Input
                    id="create-link"
                    type="url"
                    {...createForm.register("link")}
                    className={
                      createForm.formState.errors.link ? "border-red-500" : ""
                    }
                  />
                  {createForm.formState.errors.link && (
                    <p className="text-sm text-red-500">
                      {createForm.formState.errors.link.message}
                    </p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="create-image">Image URL</Label>
                  <Input
                    id="create-image"
                    type="url"
                    {...createForm.register("image")}
                  />
                  {createForm.formState.errors.image && (
                    <p className="text-sm text-red-500">
                      {createForm.formState.errors.image.message}
                    </p>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    id="create-highlighted"
                    type="checkbox"
                    {...createForm.register("highlighted")}
                    className="rounded"
                  />
                  <Label htmlFor="create-highlighted">Featured Resource</Label>
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsCreateDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={createResourceMutation.isPending}
                >
                  {createResourceMutation.isPending
                    ? "Creating..."
                    : "Create Resource"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Resources
            </CardTitle>
            <BookOpen className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{resources.length}</div>
          </CardContent>
        </Card>
        {Object.entries(resourceTypeLabels).map(([type, label]) => {
          const Icon =
            resourceTypeIcons[type as keyof typeof resourceTypeIcons];
          const count = resources.filter((r) => r.type === type).length;
          return (
            <Card key={type}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{label}s</CardTitle>
                <Icon className="text-muted-foreground h-4 w-4" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{count}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
        <Input
          placeholder="Search resources..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Resources List */}
      <Card>
        <CardHeader>
          <CardTitle>Resources</CardTitle>
          <CardDescription>
            {filteredResources.length} resource
            {filteredResources.length !== 1 ? "s" : ""} found
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="flex items-center space-x-4 rounded-lg border p-4"
                >
                  <div className="bg-muted h-16 w-16 animate-pulse rounded" />
                  <div className="flex-1 space-y-2">
                    <div className="bg-muted h-4 w-1/3 animate-pulse rounded" />
                    <div className="bg-muted h-4 w-1/2 animate-pulse rounded" />
                    <div className="bg-muted h-4 w-1/4 animate-pulse rounded" />
                  </div>
                  <div className="flex space-x-2">
                    <div className="bg-muted h-8 w-16 animate-pulse rounded" />
                    <div className="bg-muted h-8 w-16 animate-pulse rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredResources.length === 0 ? (
            <div className="py-8 text-center">
              <BookOpen className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
              <h3 className="mb-2 text-lg font-medium">No resources found</h3>
              <p className="text-muted-foreground">
                {searchQuery
                  ? "Try adjusting your search query"
                  : "Create your first resource to get started"}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredResources.map((resource) => {
                const Icon =
                  resourceTypeIcons[
                    resource.type as keyof typeof resourceTypeIcons
                  ];
                return (
                  <div
                    key={resource.id}
                    className="hover:bg-muted/50 flex items-center space-x-4 rounded-lg border p-4"
                  >
                    <div className="flex-1">
                      <div className="mb-2 flex items-center space-x-2">
                        <h3 className="font-medium">{resource.title}</h3>
                        {resource.highlighted && (
                          <Badge className="bg-yellow-500 text-yellow-900">
                            <Star className="mr-1 h-3 w-3" />
                            Featured
                          </Badge>
                        )}
                      </div>
                      {resource.description && (
                        <p className="text-muted-foreground mb-2 line-clamp-2 text-sm">
                          {resource.description}
                        </p>
                      )}
                      <div className="text-muted-foreground flex items-center space-x-4 text-sm">
                        <div className="flex items-center">
                          <Icon className="mr-2 h-4 w-4" />
                          {
                            resourceTypeLabels[
                              resource.type as keyof typeof resourceTypeLabels
                            ]
                          }
                        </div>
                        <div>By {resource.publisher}</div>
                        <a
                          href={resource.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-primary flex items-center"
                        >
                          <ExternalLink className="mr-1 h-4 w-4" />
                          View Resource
                        </a>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(resource)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Resource</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete &quot;
                              {resource.title}
                              &quot;? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => onDeleteResource(resource.id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog
        open={!!editingResource}
        onOpenChange={() => setEditingResource(null)}
      >
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Resource</DialogTitle>
            <DialogDescription>Update the resource details.</DialogDescription>
          </DialogHeader>
          {editingResource && (
            <form
              onSubmit={editForm.handleSubmit(onUpdateResource)}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="md:col-span-2">
                  <Label htmlFor="edit-title">Title</Label>
                  <Input
                    id="edit-title"
                    {...editForm.register("title")}
                    className={
                      editForm.formState.errors.title ? "border-red-500" : ""
                    }
                  />
                  {editForm.formState.errors.title && (
                    <p className="text-sm text-red-500">
                      {editForm.formState.errors.title.message}
                    </p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="edit-description">Description</Label>
                  <Textarea
                    id="edit-description"
                    {...editForm.register("description")}
                    rows={3}
                  />
                  {editForm.formState.errors.description && (
                    <p className="text-sm text-red-500">
                      {editForm.formState.errors.description.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="edit-type">Type</Label>
                  <Select
                    value={editForm.watch("type")}
                    onValueChange={(value) =>
                      editForm.setValue("type", value as any)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(resourceTypeLabels).map(
                        ([value, label]) => (
                          <SelectItem key={value} value={value}>
                            <div className="flex items-center">
                              {React.createElement(
                                resourceTypeIcons[
                                  value as keyof typeof resourceTypeIcons
                                ],
                                {
                                  className: "h-4 w-4 mr-2",
                                },
                              )}
                              {label}
                            </div>
                          </SelectItem>
                        ),
                      )}
                    </SelectContent>
                  </Select>
                  {editForm.formState.errors.type && (
                    <p className="text-sm text-red-500">
                      {editForm.formState.errors.type.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="edit-publisher">Publisher</Label>
                  <Input
                    id="edit-publisher"
                    {...editForm.register("publisher")}
                    className={
                      editForm.formState.errors.publisher
                        ? "border-red-500"
                        : ""
                    }
                  />
                  {editForm.formState.errors.publisher && (
                    <p className="text-sm text-red-500">
                      {editForm.formState.errors.publisher.message}
                    </p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="edit-link">Link</Label>
                  <Input
                    id="edit-link"
                    type="url"
                    {...editForm.register("link")}
                    className={
                      editForm.formState.errors.link ? "border-red-500" : ""
                    }
                  />
                  {editForm.formState.errors.link && (
                    <p className="text-sm text-red-500">
                      {editForm.formState.errors.link.message}
                    </p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="edit-image">Image URL</Label>
                  <Input
                    id="edit-image"
                    type="url"
                    {...editForm.register("image")}
                  />
                  {editForm.formState.errors.image && (
                    <p className="text-sm text-red-500">
                      {editForm.formState.errors.image.message}
                    </p>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    id="edit-highlighted"
                    type="checkbox"
                    {...editForm.register("highlighted")}
                    className="rounded"
                  />
                  <Label htmlFor="edit-highlighted">Featured Resource</Label>
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditingResource(null)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={updateResourceMutation.isPending}
                >
                  {updateResourceMutation.isPending
                    ? "Updating..."
                    : "Update Resource"}
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
