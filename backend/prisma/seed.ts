import { PrismaClient, ProjectStatus, TaskStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString =
  process.env.DATABASE_URL ||
  'postgresql://postgres:postgres@localhost:5433/devprogress?schema=public';
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// ──────────────────────────────────────────────
// Utility helpers
// ──────────────────────────────────────────────
function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

// ──────────────────────────────────────────────
// Seed Data
// ──────────────────────────────────────────────
const PROJECTS_DATA = [
  {
    stakeholderName: 'PT Mitra Sejahtera',
    platformName: 'Atlas CRM Platform',
    developerWhatsapp: '+6281234567890',
    status: ProjectStatus.active,
    daysOffset: -30,
    durationDays: 90,
  },
  {
    stakeholderName: 'CV Berkah Digital',
    platformName: 'Nimbus Cloud Dashboard',
    developerWhatsapp: '+6281234567891',
    status: ProjectStatus.active,
    daysOffset: -15,
    durationDays: 60,
  },
  {
    stakeholderName: 'Budi Santoso',
    platformName: 'Orion API Gateway',
    developerWhatsapp: '+6281234567892',
    status: ProjectStatus.completed,
    daysOffset: -90,
    durationDays: 45,
  },
  {
    stakeholderName: 'PT Teknologi Masa Depan',
    platformName: 'Helio Task System',
    developerWhatsapp: '+6281234567893',
    status: ProjectStatus.draft,
    daysOffset: 0,
    durationDays: 120,
  },
  {
    stakeholderName: 'Universitas Nusantara',
    platformName: 'Nova Learning Portal',
    developerWhatsapp: '+6281234567894',
    status: ProjectStatus.active,
    daysOffset: -45,
    durationDays: 180,
  },
];

const TASK_TEMPLATES = [
  // Frontend Tasks
  {
    title: 'Setup project repository & CI/CD pipeline',
    desc: 'Initialize repo, configure GitHub Actions for automated testing and deployment to staging.',
  },
  {
    title: 'Design system foundation (tokens, colors, typography)',
    desc: 'Create base design tokens including color palette, spacing scale, and typography hierarchy.',
  },
  {
    title: 'Implement authentication flow',
    desc: 'Build login, register, and password reset screens with JWT-based session management.',
  },
  {
    title: 'Build responsive dashboard layout',
    desc: 'Create the main dashboard with sidebar navigation, header, and content area.',
  },
  {
    title: 'Develop data table component with pagination',
    desc: 'Reusable table component with sorting, filtering, and server-side pagination support.',
  },
  {
    title: 'Integrate charting library for analytics',
    desc: 'Add Chart.js or Recharts for visualizing KPIs and project metrics on the dashboard.',
  },
  {
    title: 'Implement search & filter functionality',
    desc: 'Global search with debounce, advanced filters, and URL query params synchronization.',
  },
  {
    title: 'Form validation with Zod schema',
    desc: 'Standardize all form validation using Zod schemas with react-hook-form integration.',
  },
  // Backend Tasks
  {
    title: 'Database schema design & migration',
    desc: 'Design normalized schema, write Prisma migrations, and seed initial lookup data.',
  },
  {
    title: 'REST API endpoint implementation',
    desc: 'Build CRUD endpoints with proper error handling, request validation, and response DTOs.',
  },
  {
    title: 'JWT authentication middleware',
    desc: 'Implement JWT guard, role-based access control, and token refresh mechanism.',
  },
  {
    title: 'File upload service with cloud storage',
    desc: 'Implement multipart upload with Supabase Storage, file type validation, and CDN URL generation.',
  },
  {
    title: 'Email notification service',
    desc: 'Setup transactional email with templates for account verification and project updates.',
  },
  {
    title: 'API rate limiting & caching layer',
    desc: 'Add Redis-based rate limiting and response caching for high-frequency endpoints.',
  },
  // QA/Testing Tasks
  {
    title: 'Write unit tests for service layer',
    desc: 'Achieve 80%+ coverage on business logic with Jest unit tests and mocks.',
  },
  {
    title: 'Integration tests for API endpoints',
    desc: 'End-to-end API testing using Supertest covering happy paths and edge cases.',
  },
  {
    title: 'Cross-browser compatibility testing',
    desc: 'Test UI across Chrome, Firefox, Safari, and Edge on desktop and mobile viewports.',
  },
  {
    title: 'Performance audit & optimization',
    desc: 'Run Lighthouse audit, optimize bundle size, lazy load images, and improve Core Web Vitals.',
  },
  // Deployment
  {
    title: 'Production deployment setup',
    desc: 'Configure Docker containers, environment variables, and deploy to cloud provider.',
  },
  {
    title: 'Monitoring & error tracking integration',
    desc: 'Integrate Sentry for error tracking and set up uptime monitoring alerts.',
  },
];

const CHECKLIST_TEMPLATES = [
  [
    'Review requirements with stakeholder',
    'Create implementation plan',
    'Get approval before starting',
  ],
  ['Write code', 'Write tests', 'Code review', 'Merge to main'],
  [
    'Unit test coverage > 80%',
    'Integration tests passing',
    'Manual QA sign-off',
  ],
  [
    'Staging deployment successful',
    'Production deployment approved',
    'Monitoring dashboard configured',
  ],
  ['Documentation updated', 'Changelog written', 'Team notification sent'],
];

const ALL_STATUSES: TaskStatus[] = [
  TaskStatus.direncanakan,
  TaskStatus.dalam_pengerjaan,
  TaskStatus.sedang_direview,
  TaskStatus.pengujian,
  TaskStatus.selesai,
];

// ──────────────────────────────────────────────
// Main Seed Function
// ──────────────────────────────────────────────
async function main() {
  console.log('🌱 Starting database seed...');

  // 1. Cleanup
  console.log('🗑️  Cleaning existing data...');
  await prisma.comment.deleteMany();
  await prisma.taskScreenshot.deleteMany();
  await prisma.checklistItem.deleteMany();
  await prisma.task.deleteMany();
  await prisma.projectBrief.deleteMany();
  await prisma.projectTeamMember.deleteMany();
  await prisma.projectStakeholder.deleteMany();
  await prisma.project.deleteMany();
  await prisma.profile.deleteMany();
  await prisma.workspace.deleteMany();

  // 1b. Create default workspaces
  console.log('🌐 Creating default workspaces...');
  const workspaces = ['Alpha', 'Beta', 'Enterprise'];
  for (const ws of workspaces) {
    await prisma.workspace.create({
      data: { name: ws },
    });
  }

  // 2. Create profiles/users
  console.log('👤 Creating user profiles...');
  const hashedPassword = await bcrypt.hash('developer123', 10);

  // 2a. Primary Stakeholder (Main Owner)
  const stakeholder = await prisma.profile.create({
    data: {
      email: 'stakeholder@progressdev.com',
      password: hashedPassword,
      displayName: 'John Stakeholder',
      role: 'stakeholder',
      whatsapp: '+6281234567801',
    },
  });

  // 2b. Secondary Stakeholder (Guest observer)
  const stakeholder2 = await prisma.profile.create({
    data: {
      email: 'stakeholder2@progressdev.com',
      password: hashedPassword,
      displayName: 'Alice Stakeholder',
      role: 'stakeholder',
      whatsapp: '+6281234567802',
    },
  });

  // 2c. Developer
  const developer = await prisma.profile.create({
    data: {
      email: 'developer@progressdev.com',
      password: hashedPassword,
      displayName: 'Dev Sandbox',
      role: 'developer',
      whatsapp: '+6281234567800',
    },
  });

  // 2d. Admin
  const admin = await prisma.profile.create({
    data: {
      email: 'admin@progressdev.com',
      password: hashedPassword,
      displayName: 'System Admin',
      role: 'admin',
      whatsapp: '+6281234567899',
    },
  });

  console.log(`   ✓ Stakeholder 1: ${stakeholder.email}`);
  console.log(`   ✓ Stakeholder 2: ${stakeholder2.email}`);
  console.log(`   ✓ Developer    : ${developer.email}`);
  console.log(`   ✓ Admin        : ${admin.email}`);

  // 3. Create projects with tasks and members
  const now = new Date();
  let taskTemplateIndex = 0;

  for (const projectData of PROJECTS_DATA) {
    const startDate = addDays(now, projectData.daysOffset);
    const endDate = addDays(startDate, projectData.durationDays);

    console.log(`📁 Creating project: ${projectData.platformName}...`);
    const project = await prisma.project.create({
      data: {
        userId: stakeholder.id, // Primary stakeholder owns all seeded projects
        stakeholderName: projectData.stakeholderName,
        platformName: projectData.platformName,
        durationStart: startDate,
        durationEnd: endDate,
        developerWhatsapp: projectData.developerWhatsapp,
        status: projectData.status,
      },
    });

    // 3b. Assign Developer as team member
    await prisma.projectTeamMember.create({
      data: {
        projectId: project.id,
        profileId: developer.id,
        role: 'developer',
        nama: 'Beta Team',
      },
    });

    // 3c. Assign Stakeholder 2 (Alice) as secondary guest stakeholder on specific projects
    if (
      projectData.platformName === 'Atlas CRM Platform' ||
      projectData.platformName === 'Orion API Gateway'
    ) {
      await prisma.projectStakeholder.create({
        data: {
          projectId: project.id,
          profileId: stakeholder2.id,
        },
      });
      console.log(
        `   ✓ Assigned guest stakeholder ${stakeholder2.displayName} to project`,
      );
    }

    // 4. Create 4–6 tasks per project
    const taskCount = randomInt(4, 6);
    for (let i = 0; i < taskCount; i++) {
      const template =
        TASK_TEMPLATES[taskTemplateIndex % TASK_TEMPLATES.length];
      taskTemplateIndex++;

      let status: TaskStatus;
      if (projectData.status === ProjectStatus.completed) {
        status =
          Math.random() > 0.2 ? TaskStatus.selesai : TaskStatus.pengujian;
      } else if (projectData.status === ProjectStatus.draft) {
        status =
          Math.random() > 0.3
            ? TaskStatus.direncanakan
            : TaskStatus.dalam_pengerjaan;
      } else {
        status = randomItem(ALL_STATUSES);
      }

      const task = await prisma.task.create({
        data: {
          projectId: project.id,
          title: template.title,
          description: template.desc,
          status,
          orderIndex: i,
          isCompleted: status === TaskStatus.selesai,
        },
      });

      // 5. Create 2–4 checklist items per task
      const checklistTemplate = randomItem(CHECKLIST_TEMPLATES);
      const checklistCount = randomInt(
        2,
        Math.min(4, checklistTemplate.length),
      );
      for (let j = 0; j < checklistCount; j++) {
        const isChecked =
          status === TaskStatus.selesai
            ? true
            : status === TaskStatus.direncanakan
              ? false
              : Math.random() > 0.5;

        await prisma.checklistItem.create({
          data: {
            taskId: task.id,
            label: checklistTemplate[j],
            isChecked,
          },
        });
      }
    }

    // 6. Add sample comments
    await prisma.comment.create({
      data: {
        projectId: project.id,
        authorName: projectData.stakeholderName,
        message: `Terima kasih sudah memulai project ${projectData.platformName}. Mohon update progress secara berkala ya.`,
      },
    });

    console.log(`   ✓ ${project.platformName} — ${taskCount} tasks created`);
  }

  // Summary
  const projectCount = await prisma.project.count();
  const taskCount = await prisma.task.count();
  const checklistCount = await prisma.checklistItem.count();
  const teamMemberCount = await prisma.projectTeamMember.count();
  const guestStakeholderCount = await prisma.projectStakeholder.count();

  console.log('\n✅ Seed completed successfully!');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`   Workspaces    : ${workspaces.length}`);
  console.log(`   Projects      : ${projectCount}`);
  console.log(`   Team Members  : ${teamMemberCount}`);
  console.log(`   Guest Access  : ${guestStakeholderCount}`);
  console.log(`   Tasks         : ${taskCount}`);
  console.log(`   Checklists    : ${checklistCount}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('   Login credentials (all passwords: developer123):');
  console.log('   1. Admin       : admin@progressdev.com');
  console.log('   2. Developer   : developer@progressdev.com');
  console.log('   3. Stakeholder1: stakeholder@progressdev.com (Main Owner)');
  console.log(
    '   4. Stakeholder2: stakeholder2@progressdev.com (Guest Observer)',
  );
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
