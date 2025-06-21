import { z } from "zod";

// Event Banner Schemas
export const createEventBannerSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(200, "Title must be less than 200 characters"),
  description: z
    .string()
    .max(500, "Description must be less than 500 characters")
    .optional(),
  image: z
    .string()
    .url("Image must be a valid URL")
    .min(1, "Image is required"),
  link: z.string().url("Link must be a valid URL").optional(),
  active: z.boolean().default(true),
  order: z
    .number()
    .int()
    .min(0, "Order must be a non-negative integer")
    .default(0),
});

export const updateEventBannerSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(200, "Title must be less than 200 characters")
    .optional(),
  description: z
    .string()
    .max(500, "Description must be less than 500 characters")
    .optional(),
  image: z.string().url("Image must be a valid URL").optional(),
  link: z.string().url("Link must be a valid URL").optional(),
  active: z.boolean().optional(),
  order: z
    .number()
    .int()
    .min(0, "Order must be a non-negative integer")
    .optional(),
});

// Resource Banner Schemas
export const createResourceBannerSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(200, "Title must be less than 200 characters"),
  description: z
    .string()
    .max(500, "Description must be less than 500 characters")
    .optional(),
  image: z
    .string()
    .url("Image must be a valid URL")
    .min(1, "Image is required"),
  link: z.string().url("Link must be a valid URL").optional(),
  active: z.boolean().default(true),
  order: z
    .number()
    .int()
    .min(0, "Order must be a non-negative integer")
    .default(0),
});

export const updateResourceBannerSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(200, "Title must be less than 200 characters")
    .optional(),
  description: z
    .string()
    .max(500, "Description must be less than 500 characters")
    .optional(),
  image: z.string().url("Image must be a valid URL").optional(),
  link: z.string().url("Link must be a valid URL").optional(),
  active: z.boolean().optional(),
  order: z
    .number()
    .int()
    .min(0, "Order must be a non-negative integer")
    .optional(),
});

// Recommendation Card Schemas
export const createRecommendationSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(200, "Title must be less than 200 characters"),
  description: z
    .string()
    .max(500, "Description must be less than 500 characters")
    .optional(),
  image: z
    .string()
    .url("Image must be a valid URL")
    .min(1, "Image is required"),
  link: z.string().url("Link must be a valid URL").min(1, "Link is required"),
  category: z
    .string()
    .min(1, "Category is required")
    .max(100, "Category must be less than 100 characters"),
  active: z.boolean().default(true),
  order: z
    .number()
    .int()
    .min(0, "Order must be a non-negative integer")
    .default(0),
});

export const updateRecommendationSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(200, "Title must be less than 200 characters")
    .optional(),
  description: z
    .string()
    .max(500, "Description must be less than 500 characters")
    .optional(),
  image: z.string().url("Image must be a valid URL").optional(),
  link: z.string().url("Link must be a valid URL").optional(),
  category: z
    .string()
    .min(1, "Category is required")
    .max(100, "Category must be less than 100 characters")
    .optional(),
  active: z.boolean().optional(),
  order: z
    .number()
    .int()
    .min(0, "Order must be a non-negative integer")
    .optional(),
});

export type CreateEventBannerInput = z.infer<typeof createEventBannerSchema>;
export type UpdateEventBannerInput = z.infer<typeof updateEventBannerSchema>;
export type CreateResourceBannerInput = z.infer<
  typeof createResourceBannerSchema
>;
export type UpdateResourceBannerInput = z.infer<
  typeof updateResourceBannerSchema
>;
export type CreateRecommendationInput = z.infer<
  typeof createRecommendationSchema
>;
export type UpdateRecommendationInput = z.infer<
  typeof updateRecommendationSchema
>;
