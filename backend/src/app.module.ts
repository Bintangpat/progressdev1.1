import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { GuardsModule } from './guards/guards.module';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { ProjectsModule } from './projects/projects.module';
import { TasksModule } from './tasks/tasks.module';
import { StorageModule } from './storage/storage.module';

@Module({
  imports: [AuthModule, GuardsModule, UsersModule, PrismaModule, ProjectsModule, TasksModule, StorageModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
