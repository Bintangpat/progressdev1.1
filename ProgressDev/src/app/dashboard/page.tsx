"use client";

import { useEffect, useState, useCallback } from "react";
import { getProjects } from "@/app/actions/projects";
import { CreateProjectDialog } from "@/components/dashboard/create-project-dialog";
import { ProjectCard } from "@/components/dashboard/project-card";
import { Activity, FolderOpen } from "lucide-react";

interface ProjectData {
  id: string;
  platform_name: string;
  stakeholder_name: string;
  duration_start: string;
  duration_end: string;
  status: string;
  public_slug: string;
  created_at: string;
  tasks: {
    id: string;
    is_completed: boolean;
    checklist_items: { id: string; is_checked: boolean }[];
  }[];
}

export default function DashboardPage() {
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    const result = await getProjects();
    if (result.data) {
      setProjects(result.data as unknown as ProjectData[]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Proyek Saya</h1>
          <p className="text-muted-foreground mt-1">
            Kelola dan pantau semua proyek development Anda.
          </p>
        </div>
        <CreateProjectDialog onCreated={fetchProjects} />
      </div>

      {/* Project Grid */}
      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-64 rounded-xl border border-white/10 bg-card/30 animate-pulse"
            />
          ))}
        </div>
      ) : projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="p-4 rounded-2xl bg-violet-500/10 mb-4">
            <FolderOpen className="h-10 w-10 text-violet-400" />
          </div>
          <h3 className="text-lg font-semibold">Belum ada proyek</h3>
          <p className="text-sm text-muted-foreground mt-1 max-w-sm">
            Mulai buat proyek pertama Anda untuk tracking progress bersama
            stakeholder.
          </p>
          <div className="mt-6">
            <CreateProjectDialog onCreated={fetchProjects} />
          </div>
        </div>
      ) : (
        <>
          {/* Stats */}
          <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
            {[
              {
                label: "Total Proyek",
                value: projects.length,
                icon: Activity,
              },
              {
                label: "Aktif",
                value: projects.filter((p) => p.status === "active").length,
                icon: Activity,
                color: "text-emerald-400",
              },
              {
                label: "Selesai",
                value: projects.filter((p) => p.status === "completed").length,
                icon: Activity,
                color: "text-violet-400",
              },
              {
                label: "Draft",
                value: projects.filter((p) => p.status === "draft").length,
                icon: Activity,
                color: "text-zinc-400",
              },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl border border-white/10 bg-card/40 backdrop-blur-sm p-4"
              >
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p
                  className={`text-2xl font-bold mt-1 ${stat.color || "text-foreground"}`}
                >
                  {stat.value}
                </p>
              </div>
            ))}
          </div>

          {/* Grid */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onDeleted={fetchProjects}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
