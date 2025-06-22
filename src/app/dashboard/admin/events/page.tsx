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
  Calendar,
  MapPin,
  Plus,
  Edit,
  Trash2,
  Star,
  Search,
  Ticket,
  TicketX,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format, isSameDay } from "date-fns";
import {
  useAdminEvents,
  useCreateEvent,
  useUpdateEvent,
  useDeleteEvent,
} from "@/hooks/use-events-api";
import {
  createEventSchema,
  updateEventSchema,
  type CreateEventInput,
  type UpdateEventInput,
} from "@/lib/validations/events";

export default function AdminEventsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<any>(null);

  // Fetch events
  const { data: eventsData, isLoading } = useAdminEvents();
  const events = eventsData?.events || [];

  // Mutations
  const createEventMutation = useCreateEvent();
  const updateEventMutation = useUpdateEvent();
  const deleteEventMutation = useDeleteEvent();

  // Forms
  const createForm = useForm<CreateEventInput>({
    resolver: zodResolver(createEventSchema),
    defaultValues: {
      highlighted: false,
      ticketAvailability: true,
      price: null,
    },
  });

  const editForm = useForm<UpdateEventInput>({
    resolver: zodResolver(updateEventSchema),
  });

  // Filter events by search query
  const filteredEvents = events.filter(
    (event) =>
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.location.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const formatEventDate = (startDate: string, endDate?: string) => {
    try {
      const start = new Date(startDate);

      if (!endDate) {
        return format(start, "MMM dd, yyyy");
      }

      const end = new Date(endDate);

      if (isSameDay(start, end)) {
        return format(start, "MMM dd, yyyy");
      }

      if (start.getFullYear() === end.getFullYear()) {
        if (start.getMonth() === end.getMonth()) {
          return `${format(start, "MMM dd")}-${format(end, "dd, yyyy")}`;
        } else {
          return `${format(start, "MMM dd")} - ${format(end, "MMM dd, yyyy")}`;
        }
      } else {
        return `${format(start, "MMM dd, yyyy")} - ${format(end, "MMM dd, yyyy")}`;
      }
    } catch {
      return startDate;
    }
  };

  const formatPrice = (price?: number) => {
    if (price === null || price === undefined || price === 0) {
      return "Free";
    }
    return `$${price.toFixed(2)}`;
  };

  const onCreateEvent = (data: CreateEventInput) => {
    const processedData = {
      ...data,
      price:
        data.price === 0 || data.price === null || data.price === undefined
          ? null
          : data.price,
    };

    createEventMutation.mutate(processedData, {
      onSuccess: () => {
        setIsCreateDialogOpen(false);
        createForm.reset({
          highlighted: false,
          ticketAvailability: true,
          price: null,
        });
      },
    });
  };

  const onUpdateEvent = (data: UpdateEventInput) => {
    if (!editingEvent) return;

    const processedData = {
      ...data,
      price:
        data.price === 0 || data.price === null || data.price === undefined
          ? null
          : data.price,
    };

    updateEventMutation.mutate(
      { id: editingEvent.id, data: processedData },
      {
        onSuccess: () => {
          setEditingEvent(null);
          editForm.reset();
        },
      },
    );
  };

  const onDeleteEvent = (eventId: string) => {
    deleteEventMutation.mutate(eventId);
  };

  const openEditDialog = (event: any) => {
    setEditingEvent(event);
    editForm.reset({
      title: event.title,
      description: event.description || "",
      startDate: format(new Date(event.startDate), "yyyy-MM-dd"),
      endDate: event.endDate
        ? format(new Date(event.endDate), "yyyy-MM-dd")
        : "",
      location: event.location,
      price: event.price,
      image: event.image || "",
      link: event.link || "",
      highlighted: event.highlighted,
      ticketAvailability: event.ticketAvailability,
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Events Management</h1>
          <p className="text-muted-foreground">
            Create and manage mental health events from external sources
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Event
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Event</DialogTitle>
              <DialogDescription>
                Add a new mental health event from external sources like WHO,
                CDC, etc.
              </DialogDescription>
            </DialogHeader>
            <form
              onSubmit={createForm.handleSubmit(onCreateEvent)}
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
                  <Label htmlFor="create-startDate">Start Date</Label>
                  <Input
                    id="create-startDate"
                    type="date"
                    {...createForm.register("startDate")}
                    className={
                      createForm.formState.errors.startDate
                        ? "border-red-500"
                        : ""
                    }
                  />
                  {createForm.formState.errors.startDate && (
                    <p className="text-sm text-red-500">
                      {createForm.formState.errors.startDate.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="create-endDate">
                    End Date (optional for single-day events)
                  </Label>
                  <Input
                    id="create-endDate"
                    type="date"
                    {...createForm.register("endDate")}
                    className={
                      createForm.formState.errors.endDate
                        ? "border-red-500"
                        : ""
                    }
                  />
                  {createForm.formState.errors.endDate && (
                    <p className="text-sm text-red-500">
                      {createForm.formState.errors.endDate.message}
                    </p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="create-location">Location</Label>
                  <Input
                    id="create-location"
                    {...createForm.register("location")}
                    className={
                      createForm.formState.errors.location
                        ? "border-red-500"
                        : ""
                    }
                  />
                  {createForm.formState.errors.location && (
                    <p className="text-sm text-red-500">
                      {createForm.formState.errors.location.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="create-price">
                    Price (leave empty for free events)
                  </Label>
                  <Input
                    id="create-price"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="Leave empty for free"
                    {...createForm.register("price", {
                      setValueAs: (value) =>
                        value === "" || value === null ? null : Number(value),
                    })}
                  />
                  {createForm.formState.errors.price && (
                    <p className="text-sm text-red-500">
                      {createForm.formState.errors.price.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="create-image">Image URL (optional)</Label>
                  <Input
                    id="create-image"
                    type="url"
                    placeholder="https://..."
                    {...createForm.register("image")}
                  />
                  {createForm.formState.errors.image && (
                    <p className="text-sm text-red-500">
                      {createForm.formState.errors.image.message}
                    </p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="create-link">External Link (required)</Label>
                  <Input
                    id="create-link"
                    type="url"
                    placeholder="https://who.int/events/example-event"
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

                <div className="flex items-center space-x-2">
                  <input
                    id="create-highlighted"
                    type="checkbox"
                    {...createForm.register("highlighted")}
                    className="rounded"
                  />
                  <Label htmlFor="create-highlighted">Featured Event</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    id="create-ticketAvailability"
                    type="checkbox"
                    {...createForm.register("ticketAvailability")}
                    className="rounded"
                  />
                  <Label htmlFor="create-ticketAvailability">
                    Tickets Available
                  </Label>
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
                <Button type="submit" disabled={createEventMutation.isPending}>
                  {createEventMutation.isPending
                    ? "Creating..."
                    : "Create Event"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Events</CardTitle>
            <Calendar className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{events.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Featured</CardTitle>
            <Star className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {events.filter((e) => e.highlighted).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available</CardTitle>
            <Ticket className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {events.filter((e) => e.ticketAvailability).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Free Events</CardTitle>
            <TicketX className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {events.filter((e) => e.isFree).length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
        <Input
          placeholder="Search events..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Events List */}
      <Card>
        <CardHeader>
          <CardTitle>Events</CardTitle>
          <CardDescription>
            {filteredEvents.length} event
            {filteredEvents.length !== 1 ? "s" : ""} found
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
          ) : filteredEvents.length === 0 ? (
            <div className="py-8 text-center">
              <Calendar className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
              <h3 className="mb-2 text-lg font-medium">No events found</h3>
              <p className="text-muted-foreground">
                {searchQuery
                  ? "Try adjusting your search query"
                  : "Create your first event to get started"}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredEvents.map((event) => (
                <div
                  key={event.id}
                  className="hover:bg-muted/50 flex items-center space-x-4 rounded-lg border p-4"
                >
                  <div className="flex-1">
                    <div className="mb-2 flex items-center space-x-2">
                      <h3 className="font-medium">{event.title}</h3>
                      {event.highlighted && (
                        <Badge className="bg-yellow-500 text-yellow-900">
                          <Star className="mr-1 h-3 w-3" />
                          Featured
                        </Badge>
                      )}
                      {event.ticketAvailability ? (
                        <Badge variant="default" className="bg-green-600">
                          <Ticket className="mr-1 h-3 w-3" />
                          Available
                        </Badge>
                      ) : (
                        <Badge variant="destructive">
                          <TicketX className="mr-1 h-3 w-3" />
                          Sold Out
                        </Badge>
                      )}
                      <Badge
                        variant={
                          event.status === "UPCOMING" ? "default" : "secondary"
                        }
                      >
                        {event.status}
                      </Badge>
                    </div>
                    <div className="text-muted-foreground grid grid-cols-1 gap-2 text-sm md:grid-cols-2">
                      <div className="flex items-center">
                        <Calendar className="mr-2 h-4 w-4" />
                        {formatEventDate(event.startDate, event.endDate)}
                      </div>
                      <div className="flex items-center">
                        <MapPin className="mr-2 h-4 w-4" />
                        {event.location}
                      </div>
                    </div>
                    <div className="mt-2 flex items-center space-x-4">
                      <span className="text-primary text-sm font-medium">
                        {formatPrice(event.price)}
                      </span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditDialog(event)}
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
                          <AlertDialogTitle>Delete Event</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete &quot;{event.title}
                            &quot;? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => onDeleteEvent(event.id)}
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

      {/* Edit Dialog */}
      <Dialog open={!!editingEvent} onOpenChange={() => setEditingEvent(null)}>
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Event</DialogTitle>
            <DialogDescription>Update the event details.</DialogDescription>
          </DialogHeader>
          {editingEvent && (
            <form
              onSubmit={editForm.handleSubmit(onUpdateEvent)}
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
                  <Label htmlFor="edit-startDate">Start Date</Label>
                  <Input
                    id="edit-startDate"
                    type="date"
                    {...editForm.register("startDate")}
                    className={
                      editForm.formState.errors.startDate
                        ? "border-red-500"
                        : ""
                    }
                  />
                  {editForm.formState.errors.startDate && (
                    <p className="text-sm text-red-500">
                      {editForm.formState.errors.startDate.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="edit-endDate">
                    End Date (optional for single-day events)
                  </Label>
                  <Input
                    id="edit-endDate"
                    type="date"
                    {...editForm.register("endDate")}
                    className={
                      editForm.formState.errors.endDate ? "border-red-500" : ""
                    }
                  />
                  {editForm.formState.errors.endDate && (
                    <p className="text-sm text-red-500">
                      {editForm.formState.errors.endDate.message}
                    </p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="edit-location">Location</Label>
                  <Input
                    id="edit-location"
                    {...editForm.register("location")}
                    className={
                      editForm.formState.errors.location ? "border-red-500" : ""
                    }
                  />
                  {editForm.formState.errors.location && (
                    <p className="text-sm text-red-500">
                      {editForm.formState.errors.location.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="edit-price">
                    Price (leave empty for free events)
                  </Label>
                  <Input
                    id="edit-price"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="Leave empty for free"
                    {...editForm.register("price", {
                      setValueAs: (value) =>
                        value === "" || value === null ? null : Number(value),
                    })}
                  />
                  {editForm.formState.errors.price && (
                    <p className="text-sm text-red-500">
                      {editForm.formState.errors.price.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="edit-image">Image URL (optional)</Label>
                  <Input
                    id="edit-image"
                    type="url"
                    placeholder="https://..."
                    {...editForm.register("image")}
                  />
                  {editForm.formState.errors.image && (
                    <p className="text-sm text-red-500">
                      {editForm.formState.errors.image.message}
                    </p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="edit-link">External Link (required)</Label>
                  <Input
                    id="edit-link"
                    type="url"
                    placeholder="https://who.int/events/example-event"
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

                <div className="flex items-center space-x-2">
                  <input
                    id="edit-highlighted"
                    type="checkbox"
                    {...editForm.register("highlighted")}
                    className="rounded"
                  />
                  <Label htmlFor="edit-highlighted">Featured Event</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    id="edit-ticketAvailability"
                    type="checkbox"
                    {...editForm.register("ticketAvailability")}
                    className="rounded"
                  />
                  <Label htmlFor="edit-ticketAvailability">
                    Tickets Available
                  </Label>
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditingEvent(null)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={updateEventMutation.isPending}>
                  {updateEventMutation.isPending
                    ? "Updating..."
                    : "Update Event"}
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
