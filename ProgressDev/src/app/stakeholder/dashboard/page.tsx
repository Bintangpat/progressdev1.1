"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Search,
  BellRing,
  MoveUp,
  Calendar,
  CircleAlert,
  Share2,
  Plus,
  Loader2,
} from "lucide-react";
import { projectsApi, ApiProject } from "@/lib/api";
import Link from "next/link";
import { useSession } from "next-auth/react";

export default function StakeholderDashboard() {
  const { data: session } = useSession();
  const [searchQuery, setSearchQuery] = useState("");
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
  const overallCompletion = activeProjects.length > 0
    ? activeProjects.reduce((acc, p) => acc + (p.progress || 0), 0) / activeProjects.length
    : 0;
  
  // Hitung total budget burn rate (disimulasikan dari persentase budget yang terpakai)
  const totalBudget = activeProjects.reduce((acc, p) => acc + (p.budget || 0), 0);
  const formattedBudget = totalBudget >= 1000000 
    ? `$${(totalBudget / 1000000).toFixed(1)}M`
    : `$${(totalBudget / 1000).toFixed(1)}k`;

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

  return (
    <div className="min-h-screen bg-[#f8f9ff] text-[#0b1c30] font-sans selection:bg-[#0058be]/20">
      {/* TopNavBar Anchor (Full Width) */}
      <header className="fixed top-0 left-0 w-full h-16 bg-[#f8f9ff] border-b border-[#c5c6cd] flex justify-between items-center px-8 z-50">
        <div className="flex items-center gap-6">
          <div className="mr-8">
            <h1 className="text-[24px] font-bold text-[#091426] tracking-tight leading-none">
              DevProgress
            </h1>
          </div>
          <div className="relative w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#45474c] w-5 h-5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[#eff4ff] border border-[#c5c6cd] rounded-lg text-[14px] focus:outline-none focus:ring-2 focus:ring-[#0058be]/20 focus:border-[#0058be] transition-all"
              placeholder="Search milestones or projects..."
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-[#e5eeff] rounded-full transition-all text-[#45474c]">
            <BellRing className="w-5 h-5" />
          </button>
          <Link href="/stakeholder/newproject">
            <button className="px-4 py-2 bg-[#091426] text-white text-[14px] font-medium rounded-lg hover:bg-[#091426]/90 transition-all flex items-center gap-2">
              <Plus className="w-4 h-4" /> New Project
            </button>
          </Link>
          <div className="ml-2 flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#091426] flex items-center justify-center text-white font-bold overflow-hidden border border-[#c5c6cd]">
              <div className="w-full h-full bg-[#0058be] flex items-center justify-center text-xs text-white uppercase">
                {session?.user?.name?.[0] || 'U'}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Canvas */}
      <main className="w-full mt-16 p-8 min-h-screen max-w-7xl mx-auto">
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
              <span className="text-[12px] font-semibold text-[#45474c]">
                System Status: Optimal
              </span>
            </div>
          </div>
        </div>

        {/* High-Level Metrics Bento Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {/* Overall Completion */}
          <motion.div
            variants={itemVariants}
            className="bg-white/80 backdrop-blur-md border border-[#e2e8f0] p-6 rounded-xl flex flex-col justify-between shadow-sm"
          >
            <div>
              <p className="text-[12px] font-semibold text-[#45474c] uppercase tracking-wider">
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
            <div className="w-full bg-[#d3e4fe] h-2 rounded-full mt-6 overflow-hidden">
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
            className="bg-white/80 backdrop-blur-md border border-[#e2e8f0] p-6 rounded-xl shadow-sm"
          >
            <p className="text-[12px] font-semibold text-[#45474c] uppercase tracking-wider">
              Velocity
            </p>
            <div className="mt-2">
              <span className="text-[30px] font-bold text-[#091426]">
                {activeProjects.length}{" "}
                <span className="text-[20px] font-normal text-[#45474c]">
                  projects
                </span>
              </span>
            </div>
            <div className="flex gap-1 items-end h-10 mt-6">
              <div className="w-full bg-[#0058be]/20 h-[60%] rounded-t-sm"></div>
              <div className="w-full bg-[#0058be]/40 h-[80%] rounded-t-sm"></div>
              <div className="w-full bg-[#0058be]/60 h-[70%] rounded-t-sm"></div>
              <div className="w-full bg-[#0058be] h-[95%] rounded-t-sm"></div>
              <div className="w-full bg-[#0058be]/80 h-[85%] rounded-t-sm"></div>
            </div>
          </motion.div>

          {/* Est. Completion */}
          <motion.div
            variants={itemVariants}
            className="bg-white/80 backdrop-blur-md border border-[#e2e8f0] p-6 rounded-xl shadow-sm"
          >
            <p className="text-[12px] font-semibold text-[#45474c] uppercase tracking-wider">
              Est. Completion
            </p>
            <div className="mt-2">
              <span className="text-[30px] font-bold text-[#091426]">
                {activeProjects.length > 0 ? "Q3 2026" : "N/A"}
              </span>
            </div>
            <p className="text-[14px] text-[#45474c] mt-6 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#0058be]" /> Est. Release
            </p>
          </motion.div>

          {/* Budget Burn Rate */}
          <motion.div
            variants={itemVariants}
            className="bg-white/80 backdrop-blur-md border border-[#e2e8f0] p-6 rounded-xl shadow-sm"
          >
            <p className="text-[12px] font-semibold text-[#45474c] uppercase tracking-wider">
              Budget Burn Rate
            </p>
            <div className="mt-2">
              <span className="text-[30px] font-bold text-[#091426]">
                {formattedBudget}{" "}
                <span className="text-[20px] font-normal text-[#45474c]">
                  Total
                </span>
              </span>
            </div>
            <div className="mt-6 p-2 bg-[#ffdad6]/40 rounded-lg flex items-center gap-2 border border-[#ba1a1a]/10">
              <CircleAlert className="text-[#ba1a1a] w-4 h-4 shrink-0" />
              <span className="text-[#ba1a1a] text-[12px] font-semibold">
                Monitor Expenses
              </span>
            </div>
          </motion.div>
        </motion.div>

        {/* Main Strategic Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Strategic Milestones Timeline */}
          <div className="lg:col-span-2 bg-white/80 backdrop-blur-md border border-[#e2e8f0] rounded-xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-[20px] font-bold text-[#091426]">
                Strategic Milestones
              </h3>
              <button className="text-[#0058be] text-[14px] font-medium hover:underline">
                View Roadmap
              </button>
            </div>

            <div className="relative pl-8 space-y-6 before:content-[''] before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-[#c5c6cd]">
              {/* Milestone 1 */}
              <div className="relative">
                <div className="absolute -left-[31px] top-1 w-6 h-6 rounded-full bg-emerald-500 border-4 border-white shadow-sm z-10"></div>
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-[14px] font-bold text-[#091426]">
                      Cloud Infrastructure Foundation
                    </h4>
                    <p className="text-[14px] text-[#45474c] mt-1">
                      Completion of core networking and security protocols for
                      the Enterprise Migration.
                    </p>
                    <div className="flex gap-4 mt-2">
                      <span className="text-[12px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                        Completed
                      </span>
                      <span className="text-[12px] text-[#45474c]">
                        May 12, 2024
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Milestone 2 */}
              <div className="relative">
                <div className="absolute -left-[31px] top-1 w-6 h-6 rounded-full bg-[#0058be] border-4 border-white shadow-sm z-10"></div>
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-[14px] font-bold text-[#091426]">
                      Payment API Alpha Release
                    </h4>
                    <p className="text-[14px] text-[#45474c] mt-1">
                      Internal testing phase for the new unified checkout
                      experience.
                    </p>
                    <div className="flex gap-4 mt-2">
                      <span className="text-[12px] font-semibold text-[#0058be] bg-[#d8e2ff] px-2 py-0.5 rounded">
                        In Progress
                      </span>
                      <span className="text-[12px] text-[#45474c]">
                        Est. July 20, 2024
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-mono text-[#091426] font-bold">
                      85%
                    </span>
                  </div>
                </div>
              </div>

              {/* Milestone 3 */}
              <div className="relative opacity-60">
                <div className="absolute -left-[31px] top-1 w-6 h-6 rounded-full bg-[#c5c6cd] border-4 border-white shadow-sm z-10"></div>
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-[14px] font-bold text-[#091426]">
                      Global Data Audit Completion
                    </h4>
                    <p className="text-[14px] text-[#45474c] mt-1">
                      Compliance validation for EMEA and APAC regions.
                    </p>
                    <div className="flex gap-4 mt-2">
                      <span className="text-[12px] font-semibold text-[#45474c] bg-[#eff4ff] px-2 py-0.5 rounded">
                        Upcoming
                      </span>
                      <span className="text-[12px] text-[#45474c]">
                        Sept 05, 2024
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Risk & Health Aside */}
          <div className="space-y-6">
            {/* Project Portfolio Health */}
            <div className="bg-white/80 backdrop-blur-md border border-[#e2e8f0] rounded-xl p-6 shadow-sm">
              <h3 className="text-[20px] font-bold text-[#091426] mb-4">
                Portfolio Health
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[14px] font-medium text-[#0b1c30]">
                      Resource Allocation
                    </span>
                    <span className="text-[12px] font-semibold text-[#0058be]">
                      Optimal
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-[#eff4ff] rounded-full">
                    <div className="w-[92%] h-full bg-[#0058be] rounded-full"></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[14px] font-medium text-[#0b1c30]">
                      Time Variance
                    </span>
                    <span className="text-[12px] font-semibold text-[#ba1a1a]">
                      Delayed
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-[#eff4ff] rounded-full">
                    <div className="w-[45%] h-full bg-[#ba1a1a] rounded-full"></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[14px] font-medium text-[#0b1c30]">
                      Scope Compliance
                    </span>
                    <span className="text-[12px] font-semibold text-emerald-600">
                      Strict
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-[#eff4ff] rounded-full">
                    <div className="w-[98%] h-full bg-emerald-500 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Project Card (Featured) */}
            {activeProjects.length > 0 ? (
            <Link href={`/stakeholder/${activeProjects[0].publicSlug}`}>
              <div className="relative overflow-hidden group rounded-xl border border-[#c5c6cd] h-64 shadow-sm cursor-pointer">
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110 bg-[#091426]"
                  style={{
                    backgroundImage: `url('https://images.unsplash.com/photo-1600132806370-bf17e65e942f?q=80&w=600&auto=format&fit=crop')`,
                  }}
                ></div>
                <div className="absolute inset-0 bg-linear-to-t from-[#091426]/90 via-[#091426]/40 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-6 text-white">
                  <span className="px-2 py-0.5 bg-[#0058be] text-[10px] font-bold rounded uppercase tracking-wider">
                    Current Priority
                  </span>
                  <h4 className="text-[20px] font-bold mt-2">
                    {activeProjects[0].platformName}
                  </h4>
                  <p className="text-sm opacity-80 mt-1">
                    {activeProjects[0].stakeholderName}
                  </p>
                </div>
              </div>
            </Link>
            ) : (
              <div className="relative overflow-hidden rounded-xl border border-dashed border-[#c5c6cd] bg-[#eff4ff]/50 flex items-center justify-center h-64 shadow-sm">
                <p className="text-[#45474c] text-[14px]">No active projects.</p>
              </div>
            )}
          </div>
        </div>

        {/* Active Context Indicators */}
        <div className="mt-6 bg-white/80 backdrop-blur-md border border-[#e2e8f0] rounded-xl p-6 flex flex-wrap gap-6 items-center justify-between shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex -space-x-2">
              <div className="w-10 h-10 rounded-full border-2 border-white bg-slate-300 flex items-center justify-center text-xs font-bold">
                TL
              </div>
              <div className="w-10 h-10 rounded-full border-2 border-white bg-slate-400 flex items-center justify-center text-xs font-bold">
                AR
              </div>
              <div className="w-10 h-10 rounded-full border-2 border-white bg-slate-500 flex items-center justify-center text-xs font-bold">
                DS
              </div>
              <div className="w-10 h-10 rounded-full bg-[#eff4ff] flex items-center justify-center border-2 border-white text-xs font-bold text-[#45474c]">
                +12
              </div>
            </div>
            <div>
              <p className="text-[14px] font-medium text-[#091426]">
                Active Steering Committee
              </p>
              <p className="text-[11px] text-[#45474c]">
                Scheduled Sync: Today, 3:00 PM
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <button className="px-4 py-2 border border-[#c5c6cd] rounded-lg hover:bg-[#eff4ff] transition-all text-[14px] font-medium flex items-center gap-2">
              <Share2 className="w-4 h-4" /> Export Report
            </button>
            <button className="px-4 py-2 bg-[#0058be] text-white rounded-lg hover:bg-[#0058be]/90 transition-all text-[14px] font-medium flex items-center gap-2">
              <Plus className="w-4 h-4" /> Request Briefing
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
