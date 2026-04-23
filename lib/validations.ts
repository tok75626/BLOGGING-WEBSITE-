import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const postSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  content: z.string().min(10, "Content must be at least 10 characters"),
  summary: z.string().optional(),
  categoryId: z.string().optional(),
  tags: z.array(z.string()).optional(),
  published: z.boolean().default(false),
});

export const aiContentSchema = z.object({
  topic: z.string().min(3, "Topic is required"),
  tone: z.enum(["professional", "casual", "creative", "informative"]).default("informative"),
  length: z.enum(["short", "medium", "long"]).default("medium"),
});
