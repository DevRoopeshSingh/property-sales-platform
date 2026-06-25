import * as z from "zod";

export const leadFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  propertyType: z.string().optional(),
  budget: z.string().optional(),
  message: z.string().optional(),
});

export type LeadFormValues = z.infer<typeof leadFormSchema>;
