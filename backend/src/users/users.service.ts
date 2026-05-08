import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Profile, Prisma } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findByEmail(email: string): Promise<Profile | null> {
    return this.prisma.profile.findUnique({ where: { email } });
  }

  async findById(id: string): Promise<Profile | null> {
    return this.prisma.profile.findUnique({ where: { id } });
  }

  async create(data: Prisma.ProfileCreateInput): Promise<Profile> {
    return this.prisma.profile.create({ data });
  }
}
