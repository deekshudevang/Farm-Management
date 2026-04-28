import { z } from 'zod';

// ─── Auth Schemas ───────────────────────────────────────────────
export const RegisterSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  name: z.string().min(1, "Name is required").max(100, "Name is too long"),
});

export const LoginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

// ─── Field Schemas ──────────────────────────────────────────────
export const FieldSchema = z.object({
  name: z.string().min(1, "Field name is required").max(100),
  size: z.string().refine(val => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
    message: "Size must be a positive number",
  }),
  soilType: z.string().min(1, "Soil type is required"),
});

// ─── Crop Schemas ───────────────────────────────────────────────
export const CropSchema = z.object({
  name: z.string().min(1, "Crop name is required").max(100),
  stage: z.enum(["Seedling", "Growing", "Ready", "Harvested"]),
  fieldId: z.string().min(1, "Please select a field"),
});

// ─── Task Schemas ───────────────────────────────────────────────
export const TaskSchema = z.object({
  title: z.string().min(1, "Task title is required").max(200),
  status: z.enum(["PENDING", "IN_PROGRESS", "COMPLETED"]),
});

// ─── Inventory Schemas ──────────────────────────────────────────
export const InventorySchema = z.object({
  name: z.string().min(1, "Item name is required").max(100),
  category: z.enum(["SEED", "FERTILIZER", "EQUIPMENT"]),
  quantity: z.string().refine(val => !isNaN(parseInt(val)) && parseInt(val) >= 0, {
    message: "Quantity must be a non-negative number",
  }),
});

// ─── Inferred Types ─────────────────────────────────────────────
export type RegisterInput = z.infer<typeof RegisterSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;
export type FieldInput = z.infer<typeof FieldSchema>;
export type CropInput = z.infer<typeof CropSchema>;
export type TaskInput = z.infer<typeof TaskSchema>;
export type InventoryInput = z.infer<typeof InventorySchema>;

// ─── Entity Types (from API responses) ──────────────────────────
export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

export interface Field {
  id: string;
  name: string;
  size: number;
  soilType: string;
  userId: string;
  crops: Crop[];
  createdAt: string;
}

export interface Crop {
  id: string;
  name: string;
  variety: string;
  stage: string;
  fieldId: string;
  field?: Field;
  plantedAt: string;
  createdAt: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: string;
  status: string;
  dueDate: string | null;
  userId: string;
  createdAt: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  userId: string;
  createdAt: string;
}
