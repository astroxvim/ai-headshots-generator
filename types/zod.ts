import { z } from "zod";

export const fileUploadFormSchema = z.object({
  // name: z
  //   .string()
  //   .min(1)
  //   .max(50)
  //   .regex(/^[a-zA-Z ]+$/, "Only letters and spaces are allowed"),
  gender: z.string().min(1).max(500),
  shot: z.string().min(1).max(500),
  background: z.string().min(1).max(500),
  light: z.string().min(1).max(500),
  clothing: z.string().min(1).max(500),
  expression: z.string().min(1).max(500),
  colorPalette: z.string().min(1).max(500),
});