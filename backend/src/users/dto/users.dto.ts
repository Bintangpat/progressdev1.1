import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const CreateUserSchema = z.object({
  email: z.string().email('Format email tidak valid'),
  password: z.string().min(8, 'Password minimal 8 karakter').optional(),
  displayName: z.string().min(2, 'Nama minimal 2 karakter').optional(),
  role: z.enum(['admin', 'developer', 'stakeholder']).default('stakeholder'),
  team: z.string().optional(),
  workspaces: z.array(z.string()).optional(),
});

export class CreateUserDto extends createZodDto(CreateUserSchema) {}
