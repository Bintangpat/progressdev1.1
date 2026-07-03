-- AlterTable
ALTER TABLE "project_team_members" ADD COLUMN     "nama" TEXT,
ALTER COLUMN "project_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "projects" ALTER COLUMN "public_slug" SET DEFAULT encode(gen_random_bytes(8), 'hex');

-- CreateTable
CREATE TABLE "workspaces" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "workspaces_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_stakeholders" (
    "id" UUID NOT NULL,
    "project_id" UUID NOT NULL,
    "profile_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "project_stakeholders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ProfileWorkspaces" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL,

    CONSTRAINT "_ProfileWorkspaces_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "workspaces_name_key" ON "workspaces"("name");

-- CreateIndex
CREATE INDEX "project_stakeholders_profile_id_idx" ON "project_stakeholders"("profile_id");

-- CreateIndex
CREATE INDEX "project_stakeholders_project_id_idx" ON "project_stakeholders"("project_id");

-- CreateIndex
CREATE UNIQUE INDEX "project_stakeholders_project_id_profile_id_key" ON "project_stakeholders"("project_id", "profile_id");

-- CreateIndex
CREATE INDEX "_ProfileWorkspaces_B_index" ON "_ProfileWorkspaces"("B");

-- AddForeignKey
ALTER TABLE "project_stakeholders" ADD CONSTRAINT "project_stakeholders_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_stakeholders" ADD CONSTRAINT "project_stakeholders_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProfileWorkspaces" ADD CONSTRAINT "_ProfileWorkspaces_A_fkey" FOREIGN KEY ("A") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProfileWorkspaces" ADD CONSTRAINT "_ProfileWorkspaces_B_fkey" FOREIGN KEY ("B") REFERENCES "workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;
