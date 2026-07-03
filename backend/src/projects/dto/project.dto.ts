import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { ProjectStatus } from '@prisma/client';

export const CreateProjectSchema = z.object({
  stakeholderName: z.string().min(2, 'Nama stakeholder minimal 2 karakter'),
  platformName: z.string().min(2, 'Nama platform minimal 2 karakter'),
  durationStart: z.string().datetime(),
  durationEnd: z.string().datetime(),
  developerWhatsapp: z.string().min(9, 'Nomor whatsapp tidak valid'),
  budget: z.number().optional().default(0),
  teamMembers: z
    .array(
      z.object({
        profileId: z.string().uuid(),
        role: z.string(),
      }),
    )
    .optional(),
});

export const UpdateProjectSchema = CreateProjectSchema.partial().extend({
  status: z.nativeEnum(ProjectStatus).optional(),
});

export const CreateBriefSchema = z.object({
  type: z.string(),
  preferredDate: z.string().datetime(),
  preferredTime: z.string(),
  objectives: z.string(),
});

export class CreateProjectDto extends createZodDto(CreateProjectSchema) {}
export class UpdateProjectDto extends createZodDto(UpdateProjectSchema) {}
export class CreateBriefDto extends createZodDto(CreateBriefSchema) {}
