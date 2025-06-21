import { z } from "zod";

export const createEventSchema = z
  .object({
    title: z
      .string()
      .min(1, "Title is required")
      .max(200, "Title must be less than 200 characters"),
    description: z
      .string()
      .max(2000, "Description must be less than 2000 characters")
      .optional(),
    startDate: z.string().refine((date) => {
      const eventDate = new Date(date);
      return eventDate > new Date();
    }, "Event start date must be in the future"),
    endDate: z
      .string()
      .optional()
      .refine((date) => {
        if (!date) return true; // Optional field
        const eventDate = new Date(date);
        return eventDate > new Date();
      }, "Event end date must be in the future"),
    location: z
      .string()
      .min(1, "Location is required")
      .max(200, "Location must be less than 200 characters"),
    price: z.number().min(0, "Price cannot be negative").optional().nullable(),
    image: z.string().url("Image must be a valid URL").optional(),
    link: z
      .string()
      .url("Link must be a valid URL")
      .min(1, "Link to external source is required"),
    highlighted: z.boolean().default(false),
    ticketAvailability: z.boolean().default(true),
  })
  .refine(
    (data) => {
      if (data.endDate && data.startDate) {
        return new Date(data.endDate) >= new Date(data.startDate);
      }
      return true;
    },
    {
      message: "End date must be after or equal to start date",
      path: ["endDate"],
    },
  );

export const updateEventSchema = z
  .object({
    title: z
      .string()
      .min(1, "Title is required")
      .max(200, "Title must be less than 200 characters")
      .optional(),
    description: z
      .string()
      .max(2000, "Description must be less than 2000 characters")
      .optional(),
    startDate: z
      .string()
      .refine((date) => {
        const eventDate = new Date(date);
        return eventDate > new Date();
      }, "Event start date must be in the future")
      .optional(),
    endDate: z
      .string()
      .optional()
      .refine((date) => {
        if (!date) return true; // Optional field
        const eventDate = new Date(date);
        return eventDate > new Date();
      }, "Event end date must be in the future"),
    location: z
      .string()
      .min(1, "Location is required")
      .max(200, "Location must be less than 200 characters")
      .optional(),
    price: z.number().min(0, "Price cannot be negative").optional().nullable(),
    image: z.string().url("Image must be a valid URL").optional(),
    link: z
      .string()
      .url("Link must be a valid URL")
      .min(1, "Link to external source is required")
      .optional(),
    highlighted: z.boolean().optional(),
    ticketAvailability: z.boolean().optional(),
  })
  .refine(
    (data) => {
      if (data.endDate && data.startDate) {
        return new Date(data.endDate) >= new Date(data.startDate);
      }
      return true;
    },
    {
      message: "End date must be after or equal to start date",
      path: ["endDate"],
    },
  );

export const eventQuerySchema = z.object({
  highlighted: z
    .string()
    .optional()
    .transform((val) =>
      val === "true" ? true : val === "false" ? false : undefined,
    ),
  ticketAvailability: z
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

export type CreateEventInput = z.infer<typeof createEventSchema>;
export type UpdateEventInput = z.infer<typeof updateEventSchema>;
export type EventQueryInput = z.infer<typeof eventQuerySchema>;
