import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { TasksService } from './tasks.service';
import {
  CreateTaskDto,
  UpdateTaskDto,
  CreateChecklistDto,
  UpdateChecklistDto,
} from './dto/task.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../guards/roles.decorator';
import { CurrentUser } from '../guards/current-user.decorator';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { Role } from '@prisma/client';

@ApiTags('Tasks & Checklists')
@Controller('tasks')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post(':id/screenshot')
  @Roles(Role.admin, Role.developer)
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Upload a screenshot for a task' })
  async uploadScreenshot(
    @Param('id') taskId: string,
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() user: any,
  ) {
    if (!file) throw new BadRequestException('File is required');
    return this.tasksService.uploadScreenshot(taskId, file, user.id, user.role);
  }

  @Post()
  @Roles(Role.admin, Role.developer)
  @ApiOperation({ summary: 'Create a new task' })
  create(@Body() createTaskDto: CreateTaskDto, @CurrentUser() user: any) {
    return this.tasksService.create(createTaskDto, user.id, user.role);
  }

  @Patch(':id/status')
  @Roles(Role.admin, Role.developer)
  @ApiOperation({ summary: 'Update task status/details' })
  updateStatus(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
    @CurrentUser() user: any,
  ) {
    return this.tasksService.updateStatus(
      id,
      updateTaskDto,
      user.id,
      user.role,
    );
  }

  @Delete(':id')
  @Roles(Role.admin, Role.developer)
  @ApiOperation({ summary: 'Delete a task' })
  remove(@Param('id') id: string, @CurrentUser() user: any) {
    return this.tasksService.removeTask(id, user.id, user.role);
  }

  @Post(':id/checklist')
  @Roles(Role.admin, Role.developer)
  @ApiOperation({ summary: 'Add a checklist item to a task' })
  addChecklist(
    @Param('id') taskId: string,
    @Body() createChecklistDto: CreateChecklistDto,
    @CurrentUser() user: any,
  ) {
    return this.tasksService.addChecklist(
      taskId,
      createChecklistDto,
      user.id,
      user.role,
    );
  }

  @Patch('checklist/:id')
  @Roles(Role.admin, Role.developer)
  @ApiOperation({ summary: 'Update a checklist item (e.g. check/uncheck)' })
  updateChecklist(
    @Param('id') checklistId: string,
    @Body() updateChecklistDto: UpdateChecklistDto,
    @CurrentUser() user: any,
  ) {
    return this.tasksService.updateChecklist(
      checklistId,
      updateChecklistDto,
      user.id,
      user.role,
    );
  }

  @Delete('checklist/:id')
  @Roles(Role.admin, Role.developer)
  @ApiOperation({ summary: 'Delete a checklist item' })
  removeChecklist(@Param('id') checklistId: string, @CurrentUser() user: any) {
    return this.tasksService.removeChecklist(checklistId, user.id, user.role);
  }
}
