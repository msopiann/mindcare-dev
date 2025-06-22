"use client";

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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { ImageIcon, Plus, Edit, Trash2, Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useAdminEventBanners,
  useCreateEventBanner,
  useUpdateEventBanner,
  useDeleteEventBanner,
  useAdminResourceBanners,
  useCreateResourceBanner,
  useUpdateResourceBanner,
  useDeleteResourceBanner,
  useAdminRecommendations,
  useCreateRecommendation,
  useUpdateRecommendation,
  useDeleteRecommendation,
} from "@/hooks/use-banners-api";
import {
  createEventBannerSchema,
  createResourceBannerSchema,
  createRecommendationSchema,
  type CreateEventBannerInput,
  type CreateResourceBannerInput,
  type CreateRecommendationInput,
} from "@/lib/validations/banners";
import Image from "next/image";
import { normalizeImageUrl } from "@/lib/utils";

export default function AdminContentPage() {
  const [activeTab, setActiveTab] = useState("event-banners");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  // Fetch data
  const { data: eventBannersData, isLoading: eventBannersLoading } =
    useAdminEventBanners();
  const { data: resourceBannersData, isLoading: resourceBannersLoading } =
    useAdminResourceBanners();
  const { data: recommendationsData, isLoading: recommendationsLoading } =
    useAdminRecommendations();

  const eventBanners = eventBannersData?.banners || [];
  const resourceBanners = resourceBannersData?.banners || [];
  const recommendations = recommendationsData?.recommendations || [];

  // Mutations
  const createEventBannerMutation = useCreateEventBanner();
  const updateEventBannerMutation = useUpdateEventBanner();
  const deleteEventBannerMutation = useDeleteEventBanner();

  const createResourceBannerMutation = useCreateResourceBanner();
  const updateResourceBannerMutation = useUpdateResourceBanner();
  const deleteResourceBannerMutation = useDeleteResourceBanner();

  const createRecommendationMutation = useCreateRecommendation();
  const updateRecommendationMutation = useUpdateRecommendation();
  const deleteRecommendationMutation = useDeleteRecommendation();

  // Forms
  const eventBannerForm = useForm<CreateEventBannerInput>({
    resolver: zodResolver(createEventBannerSchema),
    defaultValues: { active: true, order: 0 },
  });

  const resourceBannerForm = useForm<CreateResourceBannerInput>({
    resolver: zodResolver(createResourceBannerSchema),
    defaultValues: { active: true, order: 0 },
  });

  const recommendationForm = useForm<CreateRecommendationInput>({
    resolver: zodResolver(createRecommendationSchema),
    defaultValues: { active: true, order: 0 },
  });

  const editForm = useForm();

  const handleCreate = (data: any) => {
    switch (activeTab) {
      case "event-banners":
        createEventBannerMutation.mutate(data, {
          onSuccess: () => {
            setIsCreateDialogOpen(false);
            eventBannerForm.reset({ active: true, order: 0 });
          },
        });
        break;
      case "resource-banners":
        createResourceBannerMutation.mutate(data, {
          onSuccess: () => {
            setIsCreateDialogOpen(false);
            resourceBannerForm.reset({ active: true, order: 0 });
          },
        });
        break;
      case "recommendations":
        createRecommendationMutation.mutate(data, {
          onSuccess: () => {
            setIsCreateDialogOpen(false);
            recommendationForm.reset({ active: true, order: 0 });
          },
        });
        break;
    }
  };

  const handleUpdate = (data: any) => {
    if (!editingItem) return;

    switch (activeTab) {
      case "event-banners":
        updateEventBannerMutation.mutate(
          { id: editingItem.id, data },
          {
            onSuccess: () => {
              setEditingItem(null);
              editForm.reset();
            },
          },
        );
        break;
      case "resource-banners":
        updateResourceBannerMutation.mutate(
          { id: editingItem.id, data },
          {
            onSuccess: () => {
              setEditingItem(null);
              editForm.reset();
            },
          },
        );
        break;
      case "recommendations":
        updateRecommendationMutation.mutate(
          { id: editingItem.id, data },
          {
            onSuccess: () => {
              setEditingItem(null);
              editForm.reset();
            },
          },
        );
        break;
    }
  };

  const handleDelete = (id: string) => {
    switch (activeTab) {
      case "event-banners":
        deleteEventBannerMutation.mutate(id);
        break;
      case "resource-banners":
        deleteResourceBannerMutation.mutate(id);
        break;
      case "recommendations":
        deleteRecommendationMutation.mutate(id);
        break;
    }
  };

  const openEditDialog = (item: any) => {
    setEditingItem(item);
    editForm.reset(item);
  };

  const getCreateForm = () => {
    switch (activeTab) {
      case "event-banners":
        return eventBannerForm;
      case "resource-banners":
        return resourceBannerForm;
      case "recommendations":
        return recommendationForm;
      default:
        return eventBannerForm;
    }
  };

  const getCurrentData = () => {
    switch (activeTab) {
      case "event-banners":
        return { data: eventBanners, loading: eventBannersLoading };
      case "resource-banners":
        return { data: resourceBanners, loading: resourceBannersLoading };
      case "recommendations":
        return { data: recommendations, loading: recommendationsLoading };
      default:
        return { data: [], loading: false };
    }
  };

  const getTabTitle = () => {
    switch (activeTab) {
      case "event-banners":
        return "Event Banner";
      case "resource-banners":
        return "Resource Banner";
      case "recommendations":
        return "Recommendation";
      default:
        return "Item";
    }
  };

  const currentForm = getCreateForm();
  const { data: currentData, loading: currentLoading } = getCurrentData();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Content Management</h1>
          <p className="text-muted-foreground">
            Manage banners and recommendation cards
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create {getTabTitle()}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New {getTabTitle()}</DialogTitle>
              <DialogDescription>
                Add a new {getTabTitle().toLowerCase()} to the system.
              </DialogDescription>
            </DialogHeader>
            <form
              onSubmit={currentForm.handleSubmit(handleCreate)}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="md:col-span-2">
                  <Label htmlFor="create-title">Title</Label>
                  <Input
                    id="create-title"
                    {...currentForm.register("title")}
                    className={
                      currentForm.formState.errors.title ? "border-red-500" : ""
                    }
                  />
                  {currentForm.formState.errors.title && (
                    <p className="text-sm text-red-500">
                      {currentForm.formState.errors.title.message}
                    </p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="create-description">
                    Description (optional)
                  </Label>
                  <Textarea
                    id="create-description"
                    {...currentForm.register("description")}
                    rows={3}
                  />
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="create-image">Image URL</Label>
                  <Input
                    id="create-image"
                    type="url"
                    {...currentForm.register("image")}
                    className={
                      currentForm.formState.errors.image ? "border-red-500" : ""
                    }
                  />
                  {currentForm.formState.errors.image && (
                    <p className="text-sm text-red-500">
                      {currentForm.formState.errors.image.message}
                    </p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="create-link">Link (optional)</Label>
                  <Input
                    id="create-link"
                    type="url"
                    {...currentForm.register("link")}
                  />
                </div>

                {activeTab === "recommendations" && (
                  <div>
                    <Label htmlFor="create-category">Category</Label>
                    <Input
                      id="create-category"
                      {...currentForm.register("category")}
                      className={
                        currentForm.formState.errors.category
                          ? "border-red-500"
                          : ""
                      }
                    />
                    {currentForm.formState.errors.category && (
                      <p className="text-sm text-red-500">
                        {currentForm.formState.errors.category.message}
                      </p>
                    )}
                  </div>
                )}

                <div>
                  <Label htmlFor="create-order">Display Order</Label>
                  <Input
                    id="create-order"
                    type="number"
                    min="0"
                    {...currentForm.register("order", { valueAsNumber: true })}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    id="create-active"
                    type="checkbox"
                    {...currentForm.register("active")}
                    className="rounded"
                  />
                  <Label htmlFor="create-active">Active</Label>
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
                <Button type="submit">Create {getTabTitle()}</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="event-banners">Event Banners</TabsTrigger>
          <TabsTrigger value="resource-banners">Resource Banners</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
        </TabsList>

        <TabsContent value="event-banners" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Event Banners</CardTitle>
              <CardDescription>
                {eventBanners.length} banners configured
              </CardDescription>
            </CardHeader>
            <CardContent>
              {eventBannersLoading ? (
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div
                      key={i}
                      className="flex items-center space-x-4 rounded-lg border p-4"
                    >
                      <div className="bg-muted h-16 w-24 animate-pulse rounded" />
                      <div className="flex-1 space-y-2">
                        <div className="bg-muted h-4 w-1/3 animate-pulse rounded" />
                        <div className="bg-muted h-4 w-1/2 animate-pulse rounded" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : eventBanners.length === 0 ? (
                <div className="py-8 text-center">
                  <ImageIcon className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
                  <h3 className="mb-2 text-lg font-medium">No event banners</h3>
                  <p className="text-muted-foreground">
                    Create your first event banner to get started
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {eventBanners.map((banner) => (
                    <div
                      key={banner.id}
                      className="flex items-center space-x-4 rounded-lg border p-4"
                    >
                      <Image
                        src={normalizeImageUrl(banner.image)}
                        alt={banner.title}
                        width={0}
                        height={0}
                        className="h-16 w-24 rounded object-cover"
                      />
                      <div className="flex-1">
                        <div className="mb-2 flex items-center space-x-2">
                          <h3 className="font-medium">{banner.title}</h3>
                          {banner.active ? (
                            <Badge className="bg-green-600">
                              <Eye className="mr-1 h-3 w-3" />
                              Active
                            </Badge>
                          ) : (
                            <Badge variant="secondary">
                              <EyeOff className="mr-1 h-3 w-3" />
                              Inactive
                            </Badge>
                          )}
                          <Badge variant="outline">Order: {banner.order}</Badge>
                        </div>
                        {banner.description && (
                          <p className="text-muted-foreground text-sm">
                            {banner.description}
                          </p>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditDialog(banner)}
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
                              <AlertDialogTitle>Delete Banner</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete &quot;
                                {banner.title}
                                &quot;? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(banner.id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resource-banners" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Resource Banners</CardTitle>
              <CardDescription>
                {resourceBanners.length} banners configured
              </CardDescription>
            </CardHeader>
            <CardContent>
              {resourceBannersLoading ? (
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div
                      key={i}
                      className="flex items-center space-x-4 rounded-lg border p-4"
                    >
                      <div className="bg-muted h-16 w-24 animate-pulse rounded" />
                      <div className="flex-1 space-y-2">
                        <div className="bg-muted h-4 w-1/3 animate-pulse rounded" />
                        <div className="bg-muted h-4 w-1/2 animate-pulse rounded" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : resourceBanners.length === 0 ? (
                <div className="py-8 text-center">
                  <ImageIcon className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
                  <h3 className="mb-2 text-lg font-medium">
                    No resource banners
                  </h3>
                  <p className="text-muted-foreground">
                    Create your first resource banner to get started
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {resourceBanners.map((banner) => (
                    <div
                      key={banner.id}
                      className="flex items-center space-x-4 rounded-lg border p-4"
                    >
                      <Image
                        src={normalizeImageUrl(banner.image)}
                        alt={banner.title}
                        width={0}
                        height={0}
                        className="h-16 w-24 rounded object-cover"
                      />
                      <div className="flex-1">
                        <div className="mb-2 flex items-center space-x-2">
                          <h3 className="font-medium">{banner.title}</h3>
                          {banner.active ? (
                            <Badge className="bg-green-600">
                              <Eye className="mr-1 h-3 w-3" />
                              Active
                            </Badge>
                          ) : (
                            <Badge variant="secondary">
                              <EyeOff className="mr-1 h-3 w-3" />
                              Inactive
                            </Badge>
                          )}
                          <Badge variant="outline">Order: {banner.order}</Badge>
                        </div>
                        {banner.description && (
                          <p className="text-muted-foreground text-sm">
                            {banner.description}
                          </p>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditDialog(banner)}
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
                              <AlertDialogTitle>Delete Banner</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete &quot;
                                {banner.title}
                                &quot;? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(banner.id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recommendation Cards</CardTitle>
              <CardDescription>
                {recommendations.length} recommendations configured
              </CardDescription>
            </CardHeader>
            <CardContent>
              {recommendationsLoading ? (
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div
                      key={i}
                      className="flex items-center space-x-4 rounded-lg border p-4"
                    >
                      <div className="bg-muted h-16 w-24 animate-pulse rounded" />
                      <div className="flex-1 space-y-2">
                        <div className="bg-muted h-4 w-1/3 animate-pulse rounded" />
                        <div className="bg-muted h-4 w-1/2 animate-pulse rounded" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : recommendations.length === 0 ? (
                <div className="py-8 text-center">
                  <ImageIcon className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
                  <h3 className="mb-2 text-lg font-medium">
                    No recommendations
                  </h3>
                  <p className="text-muted-foreground">
                    Create your first recommendation to get started
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recommendations.map((recommendation) => (
                    <div
                      key={recommendation.id}
                      className="flex items-center space-x-4 rounded-lg border p-4"
                    >
                      <Image
                        src={normalizeImageUrl(recommendation.image)}
                        alt={recommendation.title}
                        width={0}
                        height={0}
                        className="h-16 w-24 rounded object-cover"
                      />
                      <div className="flex-1">
                        <div className="mb-2 flex items-center space-x-2">
                          <h3 className="font-medium">
                            {recommendation.title}
                          </h3>
                          {recommendation.active ? (
                            <Badge className="bg-green-600">
                              <Eye className="mr-1 h-3 w-3" />
                              Active
                            </Badge>
                          ) : (
                            <Badge variant="secondary">
                              <EyeOff className="mr-1 h-3 w-3" />
                              Inactive
                            </Badge>
                          )}
                          <Badge variant="outline">
                            {recommendation.category}
                          </Badge>
                          <Badge variant="outline">
                            Order: {recommendation.order}
                          </Badge>
                        </div>
                        {recommendation.description && (
                          <p className="text-muted-foreground text-sm">
                            {recommendation.description}
                          </p>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditDialog(recommendation)}
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
                              <AlertDialogTitle>
                                Delete Recommendation
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete &quot;
                                {recommendation.title}&quot;? This action cannot
                                be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(recommendation.id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit Dialog */}
      <Dialog open={!!editingItem} onOpenChange={() => setEditingItem(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit {getTabTitle()}</DialogTitle>
            <DialogDescription>
              Update the {getTabTitle().toLowerCase()} details.
            </DialogDescription>
          </DialogHeader>
          {editingItem && (
            <form
              onSubmit={editForm.handleSubmit(handleUpdate)}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="md:col-span-2">
                  <Label htmlFor="edit-title">Title</Label>
                  <Input id="edit-title" {...editForm.register("title")} />
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="edit-description">
                    Description (optional)
                  </Label>
                  <Textarea
                    id="edit-description"
                    {...editForm.register("description")}
                    rows={3}
                  />
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="edit-image">Image URL</Label>
                  <Input
                    id="edit-image"
                    type="url"
                    {...editForm.register("image")}
                  />
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="edit-link">Link (optional)</Label>
                  <Input
                    id="edit-link"
                    type="url"
                    {...editForm.register("link")}
                  />
                </div>

                {activeTab === "recommendations" && (
                  <div>
                    <Label htmlFor="edit-category">Category</Label>
                    <Input
                      id="edit-category"
                      {...editForm.register("category")}
                    />
                  </div>
                )}

                <div>
                  <Label htmlFor="edit-order">Display Order</Label>
                  <Input
                    id="edit-order"
                    type="number"
                    min="0"
                    {...editForm.register("order", { valueAsNumber: true })}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    id="edit-active"
                    type="checkbox"
                    {...editForm.register("active")}
                    className="rounded"
                  />
                  <Label htmlFor="edit-active">Active</Label>
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditingItem(null)}
                >
                  Cancel
                </Button>
                <Button type="submit">Update {getTabTitle()}</Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
