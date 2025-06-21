import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type {
  CreateEventInput,
  UpdateEventInput,
  EventQueryInput,
} from "@/lib/validations/events";

interface Event {
  id: string;
  title: string;
  description?: string;
  startDate: string;
  endDate?: string;
  location: string;
  price?: number;
  image?: string;
  link: string;
  highlighted: boolean;
  ticketAvailability: boolean;
  status: string;
  isFree: boolean;
  createdBy: {
    id: string;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface EventsResponse {
  events: Event[];
  total: number;
}

interface EventResponse {
  event: Event;
}

interface EventBanner {
  id: string;
  title: string;
  description?: string;
  image: string;
  link?: string;
  active: boolean;
  order: number;
}

interface RecommendationCard {
  id: string;
  title: string;
  description?: string;
  image: string;
  link: string;
  category: string;
  active: boolean;
  order: number;
}

async function eventsFetch(
  endpoint: string,
  options: RequestInit = {},
): Promise<any> {
  const response = await fetch(`/api/events${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || "An error occurred");
  }

  return result;
}

async function adminEventsFetch(
  endpoint: string,
  options: RequestInit = {},
): Promise<any> {
  const response = await fetch(`/api/admin/events${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || "An error occurred");
  }

  return result;
}

// Public Events Hooks
export function useEvents(query: Partial<EventQueryInput> = {}) {
  const searchParams = new URLSearchParams();

  if (query.highlighted !== undefined)
    searchParams.set("highlighted", query.highlighted.toString());
  if (query.ticketAvailability !== undefined)
    searchParams.set("ticketAvailability", query.ticketAvailability.toString());
  if (query.limit) searchParams.set("limit", query.limit.toString());
  if (query.offset) searchParams.set("offset", query.offset.toString());

  const queryString = searchParams.toString();

  return useQuery({
    queryKey: ["events", queryString],
    queryFn: () =>
      eventsFetch(
        queryString ? `?${queryString}` : "",
      ) as Promise<EventsResponse>,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useEvent(id: string) {
  return useQuery({
    queryKey: ["events", id],
    queryFn: () => eventsFetch(`/${id}`) as Promise<EventResponse>,
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

export function useEventBanners() {
  return useQuery({
    queryKey: ["events", "banners"],
    queryFn: () =>
      eventsFetch("/banners") as Promise<{ banners: EventBanner[] }>,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

export function useRecommendations() {
  return useQuery({
    queryKey: ["events", "recommendations"],
    queryFn: () =>
      eventsFetch("/recommendations") as Promise<{
        recommendations: RecommendationCard[];
      }>,
    staleTime: 10 * 60 * 1000,
  });
}

// Admin Events Hooks
export function useAdminEvents() {
  return useQuery({
    queryKey: ["admin", "events"],
    queryFn: () => adminEventsFetch("") as Promise<{ events: Event[] }>,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

export function useCreateEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateEventInput) =>
      adminEventsFetch("", {
        method: "POST",
        body: JSON.stringify(data),
      }) as Promise<EventResponse>,
    onSuccess: (data) => {
      toast.success("Event created successfully");
      queryClient.invalidateQueries({ queryKey: ["admin", "events"] });
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

export function useUpdateEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateEventInput }) =>
      adminEventsFetch(`/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }) as Promise<EventResponse>,
    onSuccess: (data, variables) => {
      toast.success("Event updated successfully");
      queryClient.invalidateQueries({ queryKey: ["admin", "events"] });
      queryClient.invalidateQueries({ queryKey: ["events"] });
      queryClient.invalidateQueries({ queryKey: ["events", variables.id] });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

export function useDeleteEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      adminEventsFetch(`/${id}`, {
        method: "DELETE",
      }) as Promise<{ message: string }>,
    onSuccess: () => {
      toast.success("Event deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["admin", "events"] });
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}
