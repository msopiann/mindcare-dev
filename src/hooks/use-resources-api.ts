import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type {
  CreateResourceInput,
  UpdateResourceInput,
  ResourceQueryInput,
} from "@/lib/validations/resources";

interface Resource {
  id: string;
  title: string;
  description?: string;
  type: string;
  publisher: string;
  image?: string;
  link: string;
  highlighted: boolean;
  createdBy: {
    id: string;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface ResourcesResponse {
  resources: Resource[];
  total: number;
}

interface ResourceResponse {
  resource: Resource;
}

interface ResourceBanner {
  id: string;
  title: string;
  description?: string;
  image: string;
  link?: string;
  active: boolean;
  order: number;
}

// Extended query interface to support multiple types
interface ExtendedResourceQueryInput extends Omit<ResourceQueryInput, "type"> {
  types?: string[]; // Array of types
  type?: string; // Single type (for backward compatibility)
}

async function resourcesFetch(
  endpoint: string,
  options: RequestInit = {},
): Promise<any> {
  const response = await fetch(`/api/resources${endpoint}`, {
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

// Updated useResources hook
export function useResources(query: Partial<ExtendedResourceQueryInput> = {}) {
  const searchParams = new URLSearchParams();

  // Handle single type (backward compatibility)
  if (query.type) searchParams.set("type", query.type);

  // Handle multiple types - we'll filter client-side for now
  // You could also modify the API to accept multiple types

  if (query.highlighted !== undefined)
    searchParams.set("highlighted", query.highlighted.toString());
  if (query.limit) searchParams.set("limit", query.limit.toString());
  if (query.offset) searchParams.set("offset", query.offset.toString());

  const queryString = searchParams.toString();

  return useQuery({
    queryKey: ["resources", queryString, query.types], // Include types in query key
    queryFn: async () => {
      const result = (await resourcesFetch(
        queryString ? `?${queryString}` : "",
      )) as ResourcesResponse;

      // Client-side filtering for multiple types
      if (query.types && query.types.length > 0) {
        const filteredResources = result.resources.filter((resource) =>
          query.types!.includes(resource.type),
        );
        return {
          ...result,
          resources: filteredResources,
          total: filteredResources.length,
        };
      }

      return result;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Rest of the hooks remain the same...
export function useResource(id: string) {
  return useQuery({
    queryKey: ["resources", id],
    queryFn: () => resourcesFetch(`/${id}`) as Promise<ResourceResponse>,
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

export function useResourceBanners() {
  return useQuery({
    queryKey: ["resources", "banners"],
    queryFn: () =>
      resourcesFetch("/banners") as Promise<{ banners: ResourceBanner[] }>,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Admin hooks remain the same...
async function adminResourcesFetch(
  endpoint: string,
  options: RequestInit = {},
): Promise<any> {
  const response = await fetch(`/api/admin/resources${endpoint}`, {
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

export function useAdminResources() {
  return useQuery({
    queryKey: ["admin", "resources"],
    queryFn: () =>
      adminResourcesFetch("") as Promise<{ resources: Resource[] }>,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

export function useCreateResource() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateResourceInput) =>
      adminResourcesFetch("", {
        method: "POST",
        body: JSON.stringify(data),
      }) as Promise<ResourceResponse>,
    onSuccess: (data) => {
      toast.success("Resource created successfully");
      queryClient.invalidateQueries({ queryKey: ["admin", "resources"] });
      queryClient.invalidateQueries({ queryKey: ["resources"] });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

export function useUpdateResource() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateResourceInput }) =>
      adminResourcesFetch(`/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }) as Promise<ResourceResponse>,
    onSuccess: (data, variables) => {
      toast.success("Resource updated successfully");
      queryClient.invalidateQueries({ queryKey: ["admin", "resources"] });
      queryClient.invalidateQueries({ queryKey: ["resources"] });
      queryClient.invalidateQueries({ queryKey: ["resources", variables.id] });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

export function useDeleteResource() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      adminResourcesFetch(`/${id}`, {
        method: "DELETE",
      }) as Promise<{ message: string }>,
    onSuccess: () => {
      toast.success("Resource deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["admin", "resources"] });
      queryClient.invalidateQueries({ queryKey: ["resources"] });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}
