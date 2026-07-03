import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import {
  CreateProjectDto,
  UpdateProjectDto,
  CreateBriefDto,
} from './dto/project.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../guards/roles.decorator';
import { CurrentUser } from '../guards/current-user.decorator';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { Role } from '@prisma/client';

@ApiTags('Projects')
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.admin, Role.developer, Role.stakeholder)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create new project (Admin/Developer/Stakeholder)' })
  create(@Body() createProjectDto: CreateProjectDto, @CurrentUser() user: any) {
    return this.projectsService.create(user.id, createProjectDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all user projects' })
  findAll(@CurrentUser() user: any) {
    return this.projectsService.findAllByUser(user.id, user.role);
  }

  @Get('public/:slug')
  @ApiOperation({ summary: 'Get project by public slug for stakeholders' })
  findBySlug(@Param('slug') slug: string) {
    return this.projectsService.findBySlug(slug);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get specific project details' })
  findOne(@Param('id') id: string, @CurrentUser() user: any) {
    return this.projectsService.findOne(id, user.id, user.role);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.admin, Role.developer, Role.stakeholder)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update project' })
  update(
    @Param('id') id: string,
    @Body() updateProjectDto: UpdateProjectDto,
    @CurrentUser() user: any,
  ) {
    return this.projectsService.update(id, updateProjectDto, user.id, user.role);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.admin, Role.developer, Role.stakeholder)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete project' })
  remove(@Param('id') id: string, @CurrentUser() user: any) {
    return this.projectsService.remove(id, user.id, user.role);
  }

  @Post(':id/briefs')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new project brief (Stakeholder)' })
  createBrief(@Param('id') id: string, @Body() createBriefDto: CreateBriefDto) {
    return this.projectsService.createBrief(id, createBriefDto);
  }

  @Post(':id/stakeholders')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.admin)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Add additional stakeholder guest to project (Admin)',
  })
  addStakeholder(
    @Param('id') id: string,
    @Body('profileId') profileId: string,
  ) {
    return this.projectsService.addStakeholder(id, profileId);
  }

  @Delete(':id/stakeholders/:profileId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.admin)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Remove additional stakeholder guest from project (Admin)',
  })
  removeStakeholder(
    @Param('id') id: string,
    @Param('profileId') profileId: string,
  ) {
    return this.projectsService.removeStakeholder(id, profileId);
  }
}
