import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto, UpdateTaskDto, CreateChecklistDto, UpdateChecklistDto } from './dto/task.dto';
import { StorageService } from '../storage/storage.service';

@Injectable()
export class TasksService {
  constructor(
    private prisma: PrismaService,
    private storageService: StorageService,
  ) {}

  async uploadScreenshot(taskId: string, file: Express.Multer.File, userId: string, role: string) {
    const task = await this.prisma.task.findUnique({ where: { id: taskId }, include: { project: true } });
    if (!task) throw new NotFoundException('Task not found');
    if (role !== 'admin' && task.project.userId !== userId) throw new ForbiddenException('Access denied');

    const publicUrl = await this.storageService.uploadScreenshot(file, taskId, userId);

    return this.prisma.taskScreenshot.create({
      data: {
        taskId,
        imageUrl: publicUrl,
      }
    });
  }

  async create(createTaskDto: CreateTaskDto, userId: string, role: string) {
    // Validate project ownership if not admin
    const project = await this.prisma.project.findUnique({ where: { id: createTaskDto.projectId } });
    if (!project) throw new NotFoundException('Project not found');
    if (role !== 'admin' && project.userId !== userId) throw new ForbiddenException('Access denied to this project');

    return this.prisma.task.create({
      data: createTaskDto,
    });
  }

  async updateStatus(id: string, updateTaskDto: UpdateTaskDto, userId: string, role: string) {
    const task = await this.prisma.task.findUnique({ where: { id }, include: { project: true } });
    if (!task) throw new NotFoundException('Task not found');
    if (role !== 'admin' && task.project.userId !== userId) throw new ForbiddenException('Access denied');

    return this.prisma.task.update({
      where: { id },
      data: updateTaskDto,
    });
  }

  async addChecklist(taskId: string, createChecklistDto: CreateChecklistDto, userId: string, role: string) {
    const task = await this.prisma.task.findUnique({ where: { id: taskId }, include: { project: true } });
    if (!task) throw new NotFoundException('Task not found');
    if (role !== 'admin' && task.project.userId !== userId) throw new ForbiddenException('Access denied');

    return this.prisma.checklistItem.create({
      data: {
        ...createChecklistDto,
        taskId,
      },
    });
  }

  async updateChecklist(checklistId: string, updateChecklistDto: UpdateChecklistDto, userId: string, role: string) {
    const checklist = await this.prisma.checklistItem.findUnique({ where: { id: checklistId }, include: { task: { include: { project: true } } } });
    if (!checklist) throw new NotFoundException('Checklist not found');
    if (role !== 'admin' && checklist.task.project.userId !== userId) throw new ForbiddenException('Access denied');

    return this.prisma.checklistItem.update({
      where: { id: checklistId },
      data: updateChecklistDto,
    });
  }

  async removeTask(id: string, userId: string, role: string) {
    const task = await this.prisma.task.findUnique({ where: { id }, include: { project: true } });
    if (!task) throw new NotFoundException('Task not found');
    if (role !== 'admin' && task.project.userId !== userId) throw new ForbiddenException('Access denied');

    return this.prisma.task.delete({ where: { id } });
  }

  async removeChecklist(id: string, userId: string, role: string) {
    const checklist = await this.prisma.checklistItem.findUnique({ where: { id }, include: { task: { include: { project: true } } } });
    if (!checklist) throw new NotFoundException('Checklist not found');
    if (role !== 'admin' && checklist.task.project.userId !== userId) throw new ForbiddenException('Access denied');

    return this.prisma.checklistItem.delete({ where: { id } });
  }
}
