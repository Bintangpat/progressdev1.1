import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProjectDto, UpdateProjectDto, CreateBriefDto } from './dto/project.dto';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, createProjectDto: CreateProjectDto) {
    const { teamMembers, ...rest } = createProjectDto;
    
    return this.prisma.project.create({
      data: {
        ...rest,
        userId,
        durationStart: new Date(createProjectDto.durationStart),
        durationEnd: new Date(createProjectDto.durationEnd),
        teamMembers: {
          create: teamMembers?.map(t => ({
            profileId: t.profileId,
            role: t.role,
          })) || [],
        }
      },
    });
  }

  async findAllByUser(userId: string, role: string) {
    const includeRelations = {
      user: true,
      briefs: { orderBy: { createdAt: 'desc' } as const },
      tasks: { include: { checklists: true } }
    };

    if (role === 'admin') {
      return this.prisma.project.findMany({ include: includeRelations });
    }
    
    if (role === 'developer') {
      return this.prisma.project.findMany({
        where: {
          teamMembers: {
            some: { profileId: userId }
          }
        },
        include: includeRelations
      });
    }

    // For stakeholders (Primary owners OR invited stakeholders)
    return this.prisma.project.findMany({
      where: {
        OR: [
          { userId },
          { stakeholders: { some: { profileId: userId } } }
        ]
      },
      include: includeRelations
    });
  }

  async findOne(id: string, userId: string, role: string) {
    const project = await this.prisma.project.findUnique({
      where: { id },
      include: { 
        tasks: { include: { checklists: true } },
        teamMembers: { include: { profile: true } },
        stakeholders: { include: { profile: true } },
        briefs: { orderBy: { createdAt: 'desc' } }
      }
    });
    
    if (!project) throw new NotFoundException('Project not found');
    
    // Authorization Check
    if (role !== 'admin') {
      if (role === 'developer') {
        const isTeamMember = project.teamMembers.some(t => t.profileId === userId);
        if (!isTeamMember) throw new ForbiddenException('Access denied to this project');
      } else {
        // Stakeholder check (Owner or invited guest)
        const isOwner = project.userId === userId;
        const isInvitedStakeholder = project.stakeholders.some(s => s.profileId === userId);
        if (!isOwner && !isInvitedStakeholder) {
          throw new ForbiddenException('Access denied to this project');
        }
      }
    }
    
    // Calculate progress
    const totalChecklists = project.tasks.reduce((acc, task) => acc + task.checklists.length, 0);
    const checkedChecklists = project.tasks.reduce((acc, task) => acc + task.checklists.filter(c => c.isChecked).length, 0);
    const progress = totalChecklists === 0 ? 0 : Math.round((checkedChecklists / totalChecklists) * 100);

    return { ...project, progress };
  }

  async findBySlug(slug: string) {
    const project = await this.prisma.project.findUnique({
      where: { publicSlug: slug },
      include: { tasks: { include: { checklists: true, screenshots: true }, orderBy: { orderIndex: 'asc' } } }
    });
    
    if (!project) throw new NotFoundException('Project not found');

    const totalChecklists = project.tasks.reduce((acc, task) => acc + task.checklists.length, 0);
    const checkedChecklists = project.tasks.reduce((acc, task) => acc + task.checklists.filter(c => c.isChecked).length, 0);
    const progress = totalChecklists === 0 ? 0 : Math.round((checkedChecklists / totalChecklists) * 100);

    return { ...project, progress };
  }

  async update(id: string, updateProjectDto: UpdateProjectDto, userId: string) {
    const project = await this.prisma.project.findUnique({ where: { id } });
    if (!project) throw new NotFoundException('Project not found');
    if (project.userId !== userId) throw new ForbiddenException('Access denied');

    const data: any = { ...updateProjectDto };
    if (data.durationStart) data.durationStart = new Date(data.durationStart);
    if (data.durationEnd) data.durationEnd = new Date(data.durationEnd);

    return this.prisma.project.update({
      where: { id },
      data,
    });
  }

  async remove(id: string, userId: string) {
    const project = await this.prisma.project.findUnique({ where: { id } });
    if (!project) throw new NotFoundException('Project not found');
    if (project.userId !== userId) throw new ForbiddenException('Access denied');

    return this.prisma.project.delete({ where: { id } });
  }

  async createBrief(projectId: string, dto: CreateBriefDto) {
    const project = await this.prisma.project.findUnique({ where: { id: projectId } });
    if (!project) throw new NotFoundException('Project not found');

    return this.prisma.projectBrief.create({
      data: {
        projectId,
        type: dto.type,
        preferredDate: new Date(dto.preferredDate),
        preferredTime: dto.preferredTime,
        objectives: dto.objectives,
      }
    });
  }

  async addStakeholder(projectId: string, profileId: string) {
    const project = await this.prisma.project.findUnique({ where: { id: projectId } });
    if (!project) throw new NotFoundException('Project not found');

    const profile = await this.prisma.profile.findUnique({ where: { id: profileId } });
    if (!profile) throw new NotFoundException('Profile not found');

    return this.prisma.projectStakeholder.create({
      data: { projectId, profileId },
      include: { profile: true }
    });
  }

  async removeStakeholder(projectId: string, profileId: string) {
    const record = await this.prisma.projectStakeholder.findUnique({
      where: {
        projectId_profileId: { projectId, profileId }
      }
    });
    if (!record) throw new NotFoundException('Stakeholder assignment not found');

    await this.prisma.projectStakeholder.delete({
      where: {
        projectId_profileId: { projectId, profileId }
      }
    });
    return { message: 'Stakeholder access removed' };
  }
}
