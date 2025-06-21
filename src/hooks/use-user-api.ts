import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type {
  UpdateProfileInput,
  UpdatePasswordInput,
} from "@/lib/validations/user";

interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  name: string;
  email: string;
  avatar?: string;
  role: string;
  emailVerified: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

interface UpdateProfileResponse {
  message: string;
  user: UserProfile;
}

interface UpdatePasswordResponse {
  message: string;
}

async function userApiFetch(
  endpoint: string,
  options: RequestInit = {},
): Promise<any> {
  const response = await fetch(`/api/users/${endpoint}`, {
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

export function useUserProfile() {
  return useQuery({
    queryKey: ["user", "profile"],
    queryFn: () => userApiFetch("profile"),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateProfileInput) =>
      userApiFetch("profile", {
        method: "PUT",
        body: JSON.stringify(data),
      }) as Promise<UpdateProfileResponse>,
    onSuccess: (data) => {
      toast.success(data.message);
      // Update the cached profile data
      queryClient.setQueryData(["user", "profile"], data.user);
      // Invalidate session to update navbar
      queryClient.invalidateQueries({ queryKey: ["session"] });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

export function useUpdatePassword() {
  return useMutation({
    mutationFn: (data: UpdatePasswordInput) =>
      userApiFetch("password", {
        method: "PUT",
        body: JSON.stringify(data),
      }) as Promise<UpdatePasswordResponse>,
    onSuccess: (data) => {
      toast.success(data.message);
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}
