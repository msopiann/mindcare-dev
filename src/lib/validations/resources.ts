import { z } from "zod";

export const createResourceSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(200, "Title must be less than 200 characters"),
  description: z
    .string()
    .max(2000, "Description must be less than 2000 characters")
    .optional(),
  type: z.enum(["ARTICLE", "VIDEO", "PODCAST", "GUIDE", "TOOL"], {
    required_error: "Resource type is required",
  }),
  publisher: z
    .string()
    .min(1, "Publisher is required")
    .max(100, "Publisher must be less than 100 characters"),
  image: z.string().url("Image must be a valid URL").optional(),
  link: z.string().url("Link must be a valid URL").min(1, "Link is required"),
  highlighted: z.boolean().default(false),
});

export const updateResourceSchema = createResourceSchema.partial();

export const resourceQuerySchema = z.object({
  type: z.enum(["ARTICLE", "VIDEO", "PODCAST", "GUIDE", "TOOL"]).optional(),
  highlighted: z
    .string()
    .optional()
    .transform((val) =>
      val === "true" ? true : val === "false" ? false : undefined,
    ),
  limit: z
    .string()
    .optional()
    .default("20")
    .transform((val) => Number.parseInt(val, 10))
    .refine((val) => val > 0 && val <= 100, "Limit must be between 1 and 100"),
  offset: z
    .string()
    .optional()
    .default("0")
    .transform((val) => Number.parseInt(val, 10))
    .refine((val) => val >= 0, "Offset must be non-negative"),
});

export type CreateResourceInput = z.infer<typeof createResourceSchema>;
export type UpdateResourceInput = z.infer<typeof updateResourceSchema>;
export type ResourceQueryInput = z.infer<typeof resourceQuerySchema>;
