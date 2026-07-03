"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Folder,
  Calendar,
  DollarSign,
  Plus,
  Search,
  ArrowRight,
  Clock,
  Loader2,
  ChevronRight,
  FileText,
} from "lucide-react";
import { projectsApi, ApiProject } from "@/lib/api";
import Link from "next/link";
import { useSession } from "next-auth/react";

export default function StakeholderProjectsPage() {
  const { data: session } = useSession();
  const [projects, setProjects] = useState<ApiProject[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadProjects() {
      try {
        const data = await projectsApi.getAll();
        setProjects(data);
      } catch (error) {
        console.error("Failed to load projects:", error);
      } finally {
        setIsLoading(false);
      }
    }
    if (session) {
      loadProjects();
    }
  }, [session]);

  const filteredProjects = projects.filter(
    (project) =>
      project.platformName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.stakeholderName.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 100 } as const,
    },
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
            Active
          </span>
        );
      case "completed":
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-[#0058be]/5 text-[#0058be] border border-[#0058be]/20">
            Completed
          </span>
        );
      case "draft":
      default:
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-slate-50 text-slate-600 border border-slate-200">
            Draft
          </span>
        );
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("id-ID", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9ff] text-[#0b1c30] font-sans selection:bg-[#0058be]/20">
      <main className="w-full p-8 md:p-12 min-h-screen max-w-7xl mx-auto relative overflow-hidden">
        {/* Background Decorative Element */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#0058be]/5 rounded-full blur-3xl pointer-events-none"></div>

        {/* Breadcrumb & Header */}
        <header className="mb-8">
          <div className="flex items-center gap-1 text-foreground mb-2 text-[14px]">
            <Link
              className="hover:text-[#0058be] transition-colors"
              href="/stakeholder/dashboard"
            >
              Dashboard
            </Link>
            <ChevronRight className="w-4 h-4 text-[#75777d]" />
            <span className="text-[#091426] font-medium">Projects</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-[32px] font-bold text-[#091426] tracking-tight">
                Project Portfolio
              </h1>
              <p className="text-foreground text-[16px] mt-1">
                Monitor performance, timelines, and technical briefs across all
                active workspaces.
              </p>
            </div>
            <Link href="/stakeholder/projects/newproject">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-[#0058be] text-white px-6 py-3 rounded-lg font-bold flex items-center gap-2 shadow-lg shadow-[#0058be]/20 hover:bg-[#0058be]/90 transition-all cursor-pointer text-[14px]"
              >
                <Plus size={18} />
                <span>Add Project</span>
              </motion.button>
            </Link>
          </div>
        </header>

        {/* Filter and Search Bar */}
        <div className="mb-8 flex flex-col sm:flex-row items-center gap-4 bg-white p-4 rounded-xl border border-[#c5c6cd] shadow-sm">
          <div className="relative w-full">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#75777d]" />
            <input
              type="text"
              placeholder="Search projects by name or stakeholder..."
              className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-[#c5c6cd] bg-[#f8f9ff] focus:border-[#0058be] focus:ring-2 focus:ring-[#0058be]/10 outline-none transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="shrink-0 text-xs font-semibold text-[#75777d] uppercase tracking-wider">
            Total: {filteredProjects.length} Projects
          </div>
        </div>

        {/* Projects Loading State */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-3">
            <Loader2 className="w-10 h-10 animate-spin text-[#0058be]" />
            <span className="text-sm text-[#75777d] font-semibold">
              Loading your portfolio...
            </span>
          </div>
        ) : (
          <AnimatePresence>
            {filteredProjects.length > 0 ? (
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                variants={containerVariants}
                initial="hidden"
                animate="show"
              >
                {filteredProjects.map((project) => (
                  <motion.div
                    key={project.id}
                    variants={cardVariants}
                    className="bg-white border border-[#c5c6cd] rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col group"
                  >
                    {/* Header */}
                    <div className="p-6 border-b border-[#c5c6cd] flex-1">
                      <div className="flex items-start justify-between gap-3 mb-4">
                        <div className="w-10 h-10 rounded-lg bg-[#eff4ff] flex items-center justify-center text-[#0058be]">
                          <Folder className="w-5 h-5" />
                        </div>
                        {getStatusBadge(project.status)}
                      </div>

                      <h3 className="text-[18px] font-bold text-[#091426] line-clamp-1 group-hover:text-[#0058be] transition-colors">
                        {project.platformName}
                      </h3>
                      <p className="text-[12px] text-[#75777d] mt-1 font-semibold uppercase tracking-wider">
                        Client: {project.stakeholderName}
                      </p>

                      {/* Timeline */}
                      <div className="mt-6 space-y-2.5">
                        <div className="flex items-center gap-2 text-xs text-foreground">
                          <Calendar className="w-4 h-4 text-[#0058be]" />
                          <span>
                            {formatDate(project.durationStart)} —{" "}
                            {formatDate(project.durationEnd)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-foreground">
                          <DollarSign className="w-4 h-4 text-emerald-600" />
                          <span className="font-semibold">
                            Budget:{" "}
                            {project.budget
                              ? `$${project.budget.toLocaleString()}`
                              : "$0"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Progress Area */}
                    <div className="px-6 py-4 bg-[#f8f9ff] border-t border-[#c5c6cd]">
                      <div className="flex justify-between items-center text-xs font-semibold mb-2">
                        <span className="text-foreground">
                          Progress Completion
                        </span>
                        <span className="text-[#0058be] font-bold">
                          {project.progress || 0}%
                        </span>
                      </div>
                      <div className="w-full bg-[#d3e4fe] h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-[#0058be] h-full rounded-full transition-all duration-500"
                          style={{ width: `${project.progress || 0}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Bottom Action Footer */}
                    <div className="p-4 bg-[#eff4ff] border-t border-[#c5c6cd] flex justify-between items-center">
                      <div className="flex items-center gap-1 text-[11px] text-[#75777d] font-semibold">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Briefs: {project.briefs?.length || 0}</span>
                      </div>
                      <Link
                        href={`/stakeholder/projects/${project.publicSlug}`}
                        className="text-[13px] font-bold text-[#0058be] hover:text-[#0058be]/80 flex items-center gap-1 group/btn"
                      >
                        <span>View Details</span>
                        <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                      </Link>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white border border-[#c5c6cd] border-dashed rounded-xl p-12 text-center flex flex-col items-center justify-center max-w-lg mx-auto"
              >
                <div className="w-16 h-16 rounded-full bg-[#eff4ff] flex items-center justify-center text-[#0058be] mb-4">
                  <FileText className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-[#091426] mb-1">
                  No Projects Found
                </h3>
                <p className="text-sm text-foreground mb-6">
                  {searchQuery
                    ? "No projects match your current search query. Try adjusting your keywords."
                    : "You do not have any projects assigned to your profile yet."}
                </p>
                {!searchQuery && (
                  <Link href="/stakeholder/projects/newproject">
                    <button className="bg-[#0058be] text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-[#0058be]/90 transition-all text-sm">
                      Create Your First Project
                    </button>
                  </Link>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </main>
    </div>
  );
}
