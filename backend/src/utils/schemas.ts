import { z } from 'zod';

export const RegisterSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  name: z.string().min(1, "Name is required"),
});

export const LoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const FieldSchema = z.object({
  name: z.string().min(1, "Field name is required"),
  size: z.number().positive("Size must be positive"),
  soilType: z.string().min(1, "Soil type is required"),
});

export const CropSchema = z.object({
  name: z.string().min(1, "Crop name is required"),
  variety: z.string().optional(),
  stage: z.enum(["Seedling", "Growing", "Ready", "Harvested"]),
  fieldId: z.string().uuid("Invalid field ID"),
});

export const CropUpdateSchema = z.object({
  stage: z.enum(["Seedling", "Growing", "Ready", "Harvested"]),
});

export const TaskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  priority: z.enum(["low", "medium", "high"]).default("medium"),
  status: z.enum(["PENDING", "IN_PROGRESS", "COMPLETED"]).default("PENDING"),
  dueDate: z.string().datetime().optional().nullable(),
});

export const InventorySchema = z.object({
  name: z.string().min(1, "Item name is required"),
  category: z.enum(["SEED", "FERTILIZER", "EQUIPMENT"]),
  quantity: z.number().nonnegative("Quantity cannot be negative"),
  unit: z.string().default("units"),
});
