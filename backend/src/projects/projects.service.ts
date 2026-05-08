import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProjectDto, UpdateProjectDto } from './dto/project.dto';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, createProjectDto: CreateProjectDto) {
    return this.prisma.project.create({
      data: {
        ...createProjectDto,
        userId,
        durationStart: new Date(createProjectDto.durationStart),
        durationEnd: new Date(createProjectDto.durationEnd),
      },
    });
  }

  async findAllByUser(userId: string, role: string) {
    if (role === 'admin') {
      return this.prisma.project.findMany({ include: { user: true } });
    }
    return this.prisma.project.findMany({
      where: { userId },
    });
  }

  async findOne(id: string, userId: string, role: string) {
    const project = await this.prisma.project.findUnique({
      where: { id },
      include: { tasks: { include: { checklists: true } } }
    });
    
    if (!project) throw new NotFoundException('Project not found');
    
    if (role !== 'admin' && project.userId !== userId) {
      throw new ForbiddenException('Access denied to this project');
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
}
