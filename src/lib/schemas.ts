import { z } from "zod";

export const volunteerFormSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  email: z.string().email("Enter a valid email"),
  phone: z.string().min(7, "Phone number is required"),
  areaOfInterest: z.string().min(2, "Area of interest is required"),
  availability: z.string().min(2, "Availability is required"),
  motivation: z.string().min(10, "Tell us a bit more about your motivation"),
});

export const adminLoginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password is required"),
});
