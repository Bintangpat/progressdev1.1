"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Folder,
  LayoutGrid,
  ArrowLeft,
  Loader2,
  AlertCircle,
  Calendar,
  Phone,
  User,
} from "lucide-react";
import { ProgressCard } from "@/components/developer/overview/progress-card";
import { MetricCards } from "@/components/developer/overview/metric-cards";
import { projectsApi, ApiProject, calcProjectProgress } from "@/lib/api";

export default function ProjectOverview() {
  const params = useParams();
  const router = useRouter();
  const projectId = params?.id as string;

  const [project, setProject] = useState<ApiProject | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!projectId) return;
    const fetchProject = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await projectsApi.getOne(projectId);
        setProject(data);
      } catch (err: any) {
        setError(err.message || "Gagal memuat project");
      } finally {
        setIsLoading(false);
      }
    };
    fetchProject();
  }, [projectId]);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.08 } },
  };

  // ── Computed values ──
  const tasks = project?.tasks ?? [];
  const progress = calcProjectProgress(tasks);
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === "selesai").length;
  const startDate = project
    ? new Date(project.durationStart).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "";
  const endDate = project
    ? new Date(project.durationEnd).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "";

  const statusConfig = {
    active: { label: "Active", color: "bg-emerald-500" },
    draft: { label: "Draft", color: "bg-gray-500" },
    completed: { label: "Completed", color: "bg-blue-500" },
  };

  return (
    <div className="bg-[#131313] text-[#e5e2e1] min-h-screen flex flex-col font-sans antialiased overflow-x-hidden selection:bg-white selection:text-black">
      {/* ── TOP APP BAR ── */}
      <header className="w-full h-16 border-b border-[#444749]/30 bg-[#131313] flex items-center justify-between px-6 sticky top-0 z-40">
        {/* Left: back + project name */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="size-8 rounded bg-[#201f1f] flex items-center justify-center border border-[#444749]/40 hover:border-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="text-white size-4" />
          </button>

          {isLoading ? (
            <div className="h-4 w-40 bg-[#2a2a2a] animate-pulse rounded" />
          ) : (
            <div className="flex items-center gap-2">
              <div className="size-8 rounded bg-[#201f1f] flex items-center justify-center border border-[#444749]/40">
                <Folder className="text-white size-4" />
              </div>
              <div>
                <h1 className="text-sm font-semibold text-white tracking-wide leading-tight">
                  {project?.platformName ?? "Project"}
                </h1>
                <p className="text-[10px] text-[#c4c7c9]/60 leading-tight">
                  {project?.stakeholderName}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Right: Navigasi ke Task Board */}
        <button
          onClick={() => router.push(`/developer/project/${projectId}/task`)}
          className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-white text-black text-xs font-semibold hover:bg-white/90 transition-all cursor-pointer shadow-sm"
        >
          <LayoutGrid size={14} />
          <span>Task Board</span>
        </button>
      </header>

      {/* ── MAIN CONTENT ── */}
      <main className="flex-1 overflow-y-auto p-6 md:p-10 bg-[#131313]">
        {isLoading ? (
          /* Loading State */
          <div className="flex flex-col items-center justify-center h-64 gap-4">
            <Loader2 className="size-8 text-[#c4c7c9] animate-spin" />
            <p className="text-[#c4c7c9] text-sm">Memuat data project...</p>
          </div>
        ) : error ? (
          /* Error State */
          <div className="flex flex-col items-center justify-center h-64 gap-4">
            <AlertCircle className="size-8 text-red-400" />
            <p className="text-[#c4c7c9] text-sm">{error}</p>
            <button
              onClick={() => router.back()}
              className="text-xs text-white underline cursor-pointer"
            >
              Kembali ke Dashboard
            </button>
          </div>
        ) : (
          <div className="max-w-7xl mx-auto flex flex-col gap-10">
            {/* ── Header Summary ── */}
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 border-b border-[#444749]/15 pb-6"
            >
              <div>
                <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-white mb-1">
                  Project Overview
                </h2>
                <p className="text-sm text-[#c4c7c9]/80 mb-4">
                  Track progress, metrics, dan aktivitas terkini untuk{" "}
                  <span className="text-white font-medium">
                    {project?.platformName}
                  </span>
                  .
                </p>

                {/* Meta info row */}
                <div className="flex flex-wrap gap-4 text-xs text-[#c4c7c9]">
                  <span className="flex items-center gap-1.5">
                    <User className="size-3.5" />
                    {project?.stakeholderName}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Phone className="size-3.5" />
                    {project?.developerWhatsapp}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Calendar className="size-3.5" />
                    {startDate} — {endDate}
                  </span>
                </div>
              </div>

              {/* Status badge + sync indicator */}
              <div className="flex items-center gap-3 shrink-0">
                {project?.status && (
                  <span className="flex items-center gap-1.5 text-xs text-[#c4c7c9] bg-[#1c1b1b] border border-[#444749]/30 px-3 py-1.5 rounded-md">
                    <span
                      className={`size-2 rounded-full ${statusConfig[project.status as keyof typeof statusConfig]?.color ?? "bg-gray-500"}`}
                    />
                    {
                      statusConfig[project.status as keyof typeof statusConfig]
                        ?.label
                    }
                  </span>
                )}
                <div className="flex items-center gap-2 text-xs text-[#c4c7c9] bg-[#1c1b1b] border border-[#444749]/30 px-3 py-1.5 rounded-md">
                  <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="font-medium">Live Sync</span>
                </div>
              </div>
            </motion.div>

            {/* ── Bento Grid: Progress + Metrics ── */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 lg:grid-cols-3 gap-6"
            >
              <ProgressCard
                progress={progress}
                sprintName={`${project?.platformName} — ${totalTasks} Task Total`}
                statusText={project?.status?.toUpperCase() ?? "DRAFT"}
              />
              <MetricCards
                totalTasks={totalTasks}
                completedTasks={completedTasks}
                teamMembers={1}
                weeklyIncrease={
                  tasks.filter((t) => {
                    const created = new Date(t.createdAt);
                    const weekAgo = new Date();
                    weekAgo.setDate(weekAgo.getDate() - 7);
                    return created > weekAgo;
                  }).length
                }
              />
            </motion.div>

            {/* ── Task Status Summary ── */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-[#1a1a1a] border border-[#333333] rounded-2xl p-6"
            >
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-sm font-semibold text-white">
                  Ringkasan Task
                </h3>
                <button
                  onClick={() =>
                    router.push(`/developer/project/${projectId}/task`)
                  }
                  className="text-xs text-[#c4c7c9] hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
                >
                  Lihat semua →
                </button>
              </div>

              {tasks.length === 0 ? (
                <p className="text-[#c4c7c9] text-sm text-center py-6">
                  Belum ada task. Tambahkan task di{" "}
                  <button
                    onClick={() =>
                      router.push(`/developer/project/${projectId}/task`)
                    }
                    className="text-white underline cursor-pointer"
                  >
                    Task Board
                  </button>
                  .
                </p>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  {(
                    [
                      {
                        key: "direncanakan",
                        label: "Direncanakan",
                        color:
                          "text-slate-400 bg-slate-500/10 border-slate-500/30",
                      },
                      {
                        key: "dalam_pengerjaan",
                        label: "Dikerjakan",
                        color:
                          "text-blue-400 bg-blue-500/10 border-blue-500/30",
                      },
                      {
                        key: "sedang_direview",
                        label: "Review",
                        color:
                          "text-amber-400 bg-amber-500/10 border-amber-500/30",
                      },
                      {
                        key: "pengujian",
                        label: "Testing",
                        color:
                          "text-purple-400 bg-purple-500/10 border-purple-500/30",
                      },
                      {
                        key: "selesai",
                        label: "Selesai",
                        color:
                          "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
                      },
                    ] as const
                  ).map(({ key, label, color }) => {
                    const count = tasks.filter((t) => t.status === key).length;
                    return (
                      <div
                        key={key}
                        className={`rounded-xl border px-3 py-3 text-center ${color}`}
                      >
                        <p className="text-2xl font-bold leading-none mb-1">
                          {count}
                        </p>
                        <p className="text-[10px] font-medium opacity-80">
                          {label}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          </div>
        )}
      </main>
    </div>
  );
}
