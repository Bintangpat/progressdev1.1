import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { ProjectStatus } from '@prisma/client';

export const CreateProjectSchema = z.object({
  stakeholderName: z.string().min(2, 'Nama stakeholder minimal 2 karakter'),
  platformName: z.string().min(2, 'Nama platform minimal 2 karakter'),
  durationStart: z.string().datetime(),
  durationEnd: z.string().datetime(),
  developerWhatsapp: z.string().min(9, 'Nomor whatsapp tidak valid'),
});

export const UpdateProjectSchema = CreateProjectSchema.partial().extend({
  status: z.nativeEnum(ProjectStatus).optional()
});

export class CreateProjectDto extends createZodDto(CreateProjectSchema) {}
export class UpdateProjectDto extends createZodDto(UpdateProjectSchema) {}
