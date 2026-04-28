import { describe, it, expect } from 'vitest';
import { LoginSchema, RegisterSchema, CropSchema, FieldSchema, TaskSchema, InventorySchema } from '../../utils/schemas';

describe('LoginSchema', () => {
  it('should validate a valid login', () => {
    const result = LoginSchema.safeParse({ email: 'test@farm.com', password: 'secret123' });
    expect(result.success).toBe(true);
  });

  it('should reject an invalid email', () => {
    const result = LoginSchema.safeParse({ email: 'not-an-email', password: 'secret123' });
    expect(result.success).toBe(false);
  });

  it('should reject an empty password', () => {
    const result = LoginSchema.safeParse({ email: 'test@farm.com', password: '' });
    expect(result.success).toBe(false);
  });
});

describe('RegisterSchema', () => {
  it('should validate a valid registration', () => {
    const result = RegisterSchema.safeParse({ email: 'new@farm.com', password: 'secret123', name: 'John' });
    expect(result.success).toBe(true);
  });

  it('should reject a short password', () => {
    const result = RegisterSchema.safeParse({ email: 'new@farm.com', password: '12', name: 'John' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain('at least 6');
    }
  });

  it('should reject an empty name', () => {
    const result = RegisterSchema.safeParse({ email: 'new@farm.com', password: 'secret123', name: '' });
    expect(result.success).toBe(false);
  });
});

describe('CropSchema', () => {
  it('should validate a valid crop', () => {
    const result = CropSchema.safeParse({ name: 'Wheat', stage: 'Seedling', fieldId: '550e8400-e29b-41d4-a716-446655440000' });
    expect(result.success).toBe(true);
  });

  it('should reject an invalid stage', () => {
    const result = CropSchema.safeParse({ name: 'Wheat', stage: 'Flying', fieldId: '550e8400-e29b-41d4-a716-446655440000' });
    expect(result.success).toBe(false);
  });
});

describe('FieldSchema', () => {
  it('should validate a valid field', () => {
    const result = FieldSchema.safeParse({ name: 'North Plot', size: '12.5', soilType: 'Loamy' });
    expect(result.success).toBe(true);
  });

  it('should reject a negative size', () => {
    const result = FieldSchema.safeParse({ name: 'North Plot', size: '-5', soilType: 'Loamy' });
    expect(result.success).toBe(false);
  });
});

describe('TaskSchema', () => {
  it('should validate a valid task', () => {
    const result = TaskSchema.safeParse({ title: 'Water the crops' });
    expect(result.success).toBe(true);
  });

  it('should reject an empty title', () => {
    const result = TaskSchema.safeParse({ title: '' });
    expect(result.success).toBe(false);
  });
});

describe('InventorySchema', () => {
  it('should validate a valid inventory item', () => {
    const result = InventorySchema.safeParse({ name: 'NPK Fertilizer', category: 'FERTILIZER', quantity: '50' });
    expect(result.success).toBe(true);
  });

  it('should reject an invalid category', () => {
    const result = InventorySchema.safeParse({ name: 'Water', category: 'LIQUID', quantity: '100' });
    expect(result.success).toBe(false);
  });

  it('should reject a negative quantity', () => {
    const result = InventorySchema.safeParse({ name: 'Seeds', category: 'SEED', quantity: '-10' });
    expect(result.success).toBe(false);
  });
});
