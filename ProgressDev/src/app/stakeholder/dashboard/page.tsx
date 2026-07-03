"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  MoveUp,
  Calendar,
  Clock,
  FileText,
  Share2,
  Plus,
  Loader2,
} from "lucide-react";
import { projectsApi, ApiProject } from "@/lib/api";
import Link from "next/link";
import { useSession } from "next-auth/react";

export default function StakeholderDashboard() {
  const { data: session } = useSession();
  const [projects, setProjects] = useState<ApiProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadProjects() {
      try {
        const data = await projectsApi.getAll();
        setProjects(data);
      } catch (error) {
        console.error("Failed to load projects", error);
      } finally {
        setIsLoading(false);
      }
    }
    if (session) {
      loadProjects();
    }
  }, [session]);

  const activeProjects = projects.filter((p) => p.status !== "completed");
  const overallCompletion =
    activeProjects.length > 0
      ? activeProjects.reduce((acc, p) => acc + (p.progress || 0), 0) /
        activeProjects.length
      : 0;

  // Hitung total budget portofolio dalam Rupiah (IDR)
  const totalBudget = activeProjects.reduce(
    (acc, p) => acc + (p.budget || 0),
    0,
  );

  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(num);
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("id-ID", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  // Ambil data briefing dari semua project secara dinamis
  const recentBriefs = projects
    .flatMap((p) => (p.briefs || []).map((b) => ({ ...b, platformName: p.platformName })))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3);

  // Variasi Animasi Framer Motion
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 100 } as const,
    },
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-3 bg-[#f8f9ff]">
        <Loader2 className="w-10 h-10 animate-spin text-[#0058be]" />
        <span className="text-sm text-[#75777d] font-semibold">Loading dashboard...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9ff] text-[#0b1c30] font-sans selection:bg-[#0058be]/20">
      {/* Main Content Canvas */}
      <main className="w-full p-8 min-h-screen max-w-7xl mx-auto">
        {/* Dashboard Header */}
        <div className="flex justify-between items-end mb-8">
          <div>
            <p className="text-[12px] text-[#0058be] uppercase tracking-widest font-bold">
              Project Pulse
            </p>
            <h2 className="text-[30px] font-bold text-[#091426] tracking-tight mt-1">
              Strategic Overview
            </h2>
          </div>
          <div>
            <div className="px-4 py-2 bg-white border border-[#c5c6cd] rounded-lg flex items-center gap-2 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-[12px] font-semibold text-foreground">
                System Status: Optimal
              </span>
            </div>
          </div>
        </div>

        {/* High-Level Metrics Bento Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {/* Overall Completion */}
          <motion.div
            variants={itemVariants}
            className="bg-white/80 backdrop-blur-md border border-[#e2e8f0] p-6 rounded-xl flex flex-col justify-between shadow-sm h-40"
          >
            <div>
              <p className="text-[12px] font-bold text-[#75777d] uppercase tracking-wider">
                Overall Completion
              </p>
              <div className="flex items-end gap-1 mt-2">
                <span className="text-[30px] font-bold text-[#091426]">
                  {overallCompletion.toFixed(1)}%
                </span>
                <span className="text-emerald-500 text-[14px] font-medium mb-2 flex items-center gap-0.5">
                  <MoveUp className="w-4 h-4" /> Active
                </span>
              </div>
            </div>
            <div className="w-full bg-[#d3e4fe] h-2 rounded-full overflow-hidden">
              <motion.div
                className="bg-[#0058be] h-full rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${overallCompletion}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
          </motion.div>

          {/* Velocity */}
          <motion.div
            variants={itemVariants}
            className="bg-white/80 backdrop-blur-md border border-[#e2e8f0] p-6 rounded-xl shadow-sm h-40 flex flex-col justify-between"
          >
            <div>
              <p className="text-[12px] font-bold text-[#75777d] uppercase tracking-wider">
                Active Projects
              </p>
              <div className="mt-2">
                <span className="text-[30px] font-bold text-[#091426]">
                  {activeProjects.length}{" "}
                  <span className="text-[20px] font-normal text-foreground">
                    Workspaces
                  </span>
                </span>
              </div>
            </div>
            <div className="flex gap-1 items-end h-8">
              <div className="w-full bg-[#0058be]/20 h-[60%] rounded-t-sm"></div>
              <div className="w-full bg-[#0058be]/40 h-[80%] rounded-t-sm"></div>
              <div className="w-full bg-[#0058be]/60 h-[70%] rounded-t-sm"></div>
              <div className="w-full bg-[#0058be] h-[95%] rounded-t-sm"></div>
              <div className="w-full bg-[#0058be]/80 h-[85%] rounded-t-sm"></div>
            </div>
          </motion.div>

          {/* Total Budget Portfolio in Rupiah IDR */}
          <motion.div
            variants={itemVariants}
            className="bg-white/80 backdrop-blur-md border border-[#e2e8f0] p-6 rounded-xl shadow-sm h-40 flex flex-col justify-between"
          >
            <div>
              <p className="text-[12px] font-bold text-[#75777d] uppercase tracking-wider">
                Total Budget Portfolio
              </p>
              <div className="mt-2">
                <span className="text-[26px] font-bold text-[#091426] tracking-tight">
                  {formatRupiah(totalBudget)}
                </span>
              </div>
            </div>
            <div className="text-[12px] text-[#0058be] font-semibold uppercase tracking-wider">
              IDR Currency Allocation
            </div>
          </motion.div>
        </motion.div>

        {/* Main Strategic Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Dynamic Recent Briefing Requests */}
          <div className="lg:col-span-2 bg-white/80 backdrop-blur-md border border-[#e2e8f0] rounded-xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-[20px] font-bold text-[#091426]">
                Recent Briefing Requests
              </h3>
              <Link href="/stakeholder/projects" className="text-[#0058be] text-[14px] font-medium hover:underline">
                View All Projects
              </Link>
            </div>

            <div className="space-y-4">
              {recentBriefs.length > 0 ? (
                recentBriefs.map((brief, index) => (
                  <div
                    key={brief.id}
                    className="p-4 border border-[#c5c6cd] rounded-xl bg-[#f8f9ff] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 bg-[#0058be]/10 text-[#0058be] text-[10px] font-bold rounded uppercase tracking-wider">
                          {brief.type}
                        </span>
                        <span className="text-xs text-[#75777d] font-semibold">
                          Project: {brief.platformName}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-[#091426] mt-2 line-clamp-1">
                        {brief.objectives}
                      </h4>
                    </div>

                    <div className="flex items-center gap-4 shrink-0 text-xs text-[#75777d]">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-[#0058be]" /> {formatDate(brief.preferredDate)}
                      </span>
                      <span className="flex items-center gap-1 font-semibold text-[#091426]">
                        <Clock className="w-3.5 h-3.5" /> {brief.preferredTime}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-12 border border-dashed border-[#c5c6cd] rounded-xl text-center text-[#75777d] text-sm italic">
                  No briefings requested yet.
                </div>
              )}
            </div>
          </div>

          {/* Featured Project Column */}
          <div className="space-y-6">
            {/* Recent Project Card (Featured) */}
            {activeProjects.length > 0 ? (
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-[#75777d] uppercase tracking-wider">
                  Featured Workspace
                </h3>
                <Link href={`/stakeholder/projects/${activeProjects[0].publicSlug}`}>
                  <div className="relative overflow-hidden group rounded-xl border border-[#c5c6cd] h-64 shadow-sm cursor-pointer">
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110 bg-[#091426]"
                      style={{
                        backgroundImage: `url('https://images.unsplash.com/photo-1600132806370-bf17e65e942f?q=80&w=600&auto=format&fit=crop')`,
                      }}
                    ></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-[#091426]/90 via-[#091426]/40 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 p-6 text-white">
                      <span className="px-2 py-0.5 bg-[#0058be] text-[10px] font-bold rounded uppercase tracking-wider">
                        Current Focus
                      </span>
                      <h4 className="text-[20px] font-bold mt-2">
                        {activeProjects[0].platformName}
                      </h4>
                      <p className="text-sm opacity-80 mt-1">
                        Client: {activeProjects[0].stakeholderName}
                      </p>
                    </div>
                  </div>
                </Link>
              </div>
            ) : (
              <div className="relative overflow-hidden rounded-xl border border-dashed border-[#c5c6cd] bg-[#eff4ff]/50 flex items-center justify-center h-64 shadow-sm">
                <p className="text-foreground text-[14px]">
                  No active projects.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Dashboard Bottom Actions Area */}
        <div className="mt-8 flex justify-end gap-3 border-t border-[#c5c6cd] pt-6">
          <button className="px-5 py-2.5 border border-[#c5c6cd] rounded-lg hover:bg-[#eff4ff] transition-all text-[14px] font-semibold flex items-center gap-2 cursor-pointer bg-white shadow-xs">
            <Share2 className="w-4 h-4" /> Export Report
          </button>
          <Link href="/stakeholder/projects/newproject">
            <button className="px-5 py-2.5 bg-[#0058be] text-white rounded-lg hover:bg-[#0058be]/90 transition-all text-[14px] font-bold flex items-center gap-2 cursor-pointer shadow-md shadow-[#0058be]/10">
              <Plus className="w-4 h-4" /> Add Project
            </button>
          </Link>
        </div>
      </main>
    </div>
  );
}
