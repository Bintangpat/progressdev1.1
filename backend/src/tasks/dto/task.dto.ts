import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { TaskStatus } from '@prisma/client';

export const CreateTaskSchema = z.object({
  projectId: z.string().uuid(),
  title: z.string().min(2),
  description: z.string().optional(),
  orderIndex: z.number().int().optional(),
});

export const UpdateTaskSchema = CreateTaskSchema.partial().extend({
  status: z.nativeEnum(TaskStatus).optional(),
  isCompleted: z.boolean().optional(),
});

export const CreateChecklistSchema = z.object({
  label: z.string().min(2),
});

export const UpdateChecklistSchema = z.object({
  isChecked: z.boolean().optional(),
  label: z.string().optional(),
});

export class CreateTaskDto extends createZodDto(CreateTaskSchema) {}
export class UpdateTaskDto extends createZodDto(UpdateTaskSchema) {}
export class CreateChecklistDto extends createZodDto(CreateChecklistSchema) {}
export class UpdateChecklistDto extends createZodDto(UpdateChecklistSchema) {}
