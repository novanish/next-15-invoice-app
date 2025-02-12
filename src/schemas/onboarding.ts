import { z } from "zod";

export const onboardingSchema = z.object({
  firstName: z.string().min(2, { message: "First name is too short" }),
  lastName: z.string().min(2, { message: "Last name is too short" }),
  address: z.string({ message: "Address is required" }),
});

export type Onboarding = z.infer<typeof onboardingSchema>;
