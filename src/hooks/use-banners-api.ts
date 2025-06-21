import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type {
  CreateEventBannerInput,
  UpdateEventBannerInput,
  CreateResourceBannerInput,
  UpdateResourceBannerInput,
  CreateRecommendationInput,
  UpdateRecommendationInput,
} from "@/lib/validations/banners";

interface EventBanner {
  id: string;
  title: string;
  description?: string;
  image: string;
  link?: string;
  active: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

interface ResourceBanner {
  id: string;
  title: string;
  description?: string;
  image: string;
  link?: string;
  active: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
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
  createdAt: string;
  updatedAt: string;
}

async function adminFetch(
  endpoint: string,
  options: RequestInit = {},
): Promise<any> {
  const response = await fetch(`/api/admin${endpoint}`, {
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

// Event Banners Hooks
export function useAdminEventBanners() {
  return useQuery({
    queryKey: ["admin", "events", "banners"],
    queryFn: () =>
      adminFetch("/events/banners") as Promise<{ banners: EventBanner[] }>,
    staleTime: 2 * 60 * 1000,
  });
}

export function useCreateEventBanner() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateEventBannerInput) =>
      adminFetch("/events/banners", {
        method: "POST",
        body: JSON.stringify(data),
      }) as Promise<{ banner: EventBanner }>,
    onSuccess: () => {
      toast.success("Event banner created successfully");
      queryClient.invalidateQueries({
        queryKey: ["admin", "events", "banners"],
      });
      queryClient.invalidateQueries({ queryKey: ["events", "banners"] });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

export function useUpdateEventBanner() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateEventBannerInput }) =>
      adminFetch(`/events/banners/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }) as Promise<{ banner: EventBanner }>,
    onSuccess: () => {
      toast.success("Event banner updated successfully");
      queryClient.invalidateQueries({
        queryKey: ["admin", "events", "banners"],
      });
      queryClient.invalidateQueries({ queryKey: ["events", "banners"] });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

export function useDeleteEventBanner() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      adminFetch(`/events/banners/${id}`, {
        method: "DELETE",
      }) as Promise<{ message: string }>,
    onSuccess: () => {
      toast.success("Event banner deleted successfully");
      queryClient.invalidateQueries({
        queryKey: ["admin", "events", "banners"],
      });
      queryClient.invalidateQueries({ queryKey: ["events", "banners"] });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

// Resource Banners Hooks
export function useAdminResourceBanners() {
  return useQuery({
    queryKey: ["admin", "resources", "banners"],
    queryFn: () =>
      adminFetch("/resources/banners") as Promise<{
        banners: ResourceBanner[];
      }>,
    staleTime: 2 * 60 * 1000,
  });
}

export function useCreateResourceBanner() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateResourceBannerInput) =>
      adminFetch("/resources/banners", {
        method: "POST",
        body: JSON.stringify(data),
      }) as Promise<{ banner: ResourceBanner }>,
    onSuccess: () => {
      toast.success("Resource banner created successfully");
      queryClient.invalidateQueries({
        queryKey: ["admin", "resources", "banners"],
      });
      queryClient.invalidateQueries({ queryKey: ["resources", "banners"] });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

export function useUpdateResourceBanner() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: UpdateResourceBannerInput;
    }) =>
      adminFetch(`/resources/banners/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }) as Promise<{ banner: ResourceBanner }>,
    onSuccess: () => {
      toast.success("Resource banner updated successfully");
      queryClient.invalidateQueries({
        queryKey: ["admin", "resources", "banners"],
      });
      queryClient.invalidateQueries({ queryKey: ["resources", "banners"] });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

export function useDeleteResourceBanner() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      adminFetch(`/resources/banners/${id}`, {
        method: "DELETE",
      }) as Promise<{ message: string }>,
    onSuccess: () => {
      toast.success("Resource banner deleted successfully");
      queryClient.invalidateQueries({
        queryKey: ["admin", "resources", "banners"],
      });
      queryClient.invalidateQueries({ queryKey: ["resources", "banners"] });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

// Recommendations Hooks
export function useAdminRecommendations() {
  return useQuery({
    queryKey: ["admin", "recommendations"],
    queryFn: () =>
      adminFetch("/recommendations") as Promise<{
        recommendations: RecommendationCard[];
      }>,
    staleTime: 2 * 60 * 1000,
  });
}

export function useCreateRecommendation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateRecommendationInput) =>
      adminFetch("/recommendations", {
        method: "POST",
        body: JSON.stringify(data),
      }) as Promise<{ recommendation: RecommendationCard }>,
    onSuccess: () => {
      toast.success("Recommendation created successfully");
      queryClient.invalidateQueries({ queryKey: ["admin", "recommendations"] });
      queryClient.invalidateQueries({
        queryKey: ["events", "recommendations"],
      });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

export function useUpdateRecommendation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: UpdateRecommendationInput;
    }) =>
      adminFetch(`/recommendations/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }) as Promise<{ recommendation: RecommendationCard }>,
    onSuccess: () => {
      toast.success("Recommendation updated successfully");
      queryClient.invalidateQueries({ queryKey: ["admin", "recommendations"] });
      queryClient.invalidateQueries({
        queryKey: ["events", "recommendations"],
      });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

export function useDeleteRecommendation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      adminFetch(`/recommendations/${id}`, {
        method: "DELETE",
      }) as Promise<{ message: string }>,
    onSuccess: () => {
      toast.success("Recommendation deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["admin", "recommendations"] });
      queryClient.invalidateQueries({
        queryKey: ["events", "recommendations"],
      });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}
