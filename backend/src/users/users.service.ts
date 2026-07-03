import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Profile, Prisma, Role } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findByEmail(email: string): Promise<Profile | null> {
    return this.prisma.profile.findUnique({ where: { email } });
  }

  async findById(id: string): Promise<Profile | null> {
    return this.prisma.profile.findUnique({ where: { id } });
  }

  async findByIdWithoutPassword(
    id: string,
  ): Promise<Omit<Profile, 'password'> | null> {
    const user = await this.prisma.profile.findUnique({ where: { id } });
    if (!user) return null;
    const { password, ...result } = user;
    return result;
  }

  async findByRole(role: Role): Promise<Profile[]> {
    return this.prisma.profile.findMany({ where: { role } });
  }

  async findAll(): Promise<Profile[]> {
    return this.prisma.profile.findMany();
  }

  async create(
    data: Prisma.ProfileCreateInput,
    workspaces?: string[],
    team?: string,
  ): Promise<Profile> {
    const profileData: Prisma.ProfileCreateInput = {
      ...data,
      workspaces:
        workspaces && workspaces.length > 0
          ? {
              connect: workspaces.map((name) => ({ name })),
            }
          : undefined,
    };

    const profile = await this.prisma.profile.create({
      data: profileData,
    });

    if (profile.role === 'developer' && team) {
      await this.prisma.projectTeamMember.create({
        data: {
          profileId: profile.id,
          role: 'developer',
          nama: team,
        },
      });
    }

    return profile;
  }

  async update(id: string, data: Prisma.ProfileUpdateInput): Promise<Profile> {
    return this.prisma.profile.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<Profile> {
    return this.prisma.profile.delete({
      where: { id },
    });
  }
}
