"use client";

import React from "react";
import Image from "next/image";
import {
  Terminal,
  Plus,
  Users,
  LayoutDashboard,
  Kanban,
  Flag,
  Settings,
  LogOut,
  Search,
  Bell,
  HelpCircle,
  CheckCircle,
  CircleAlert,
  ShelvingUnit,
  ArrowDownWideNarrow,
  Download,
  Ellipsis,
  ChevronLeft,
  ChevronRight,
  StickyNote,
} from "lucide-react"; // Menggunakan Lucide sebagai standar modern Next.js [cite: 6, 12]
import { motion } from "framer-motion";
import { Stick } from "next/font/google";

import { projectsApi, ApiProject } from "@/lib/api";

export default function GlobalOverview() {
  const [projects, setProjects] = React.useState<ApiProject[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    projectsApi.getAll()
      .then(data => {
        setProjects(data);
        setIsLoading(false);
      })
      .catch(console.error);
  }, []);

  const totalProjects = projects.length;
  const completedProjects = projects.filter(p => p.status === "completed").length;
  const onTrackProjects = projects.filter(p => p.status === "active").length;
  const delayedProjects = projects.filter(p => {
    const end = new Date(p.durationEnd).getTime();
    const now = new Date().getTime();
    return p.status === "active" && end < now;
  }).length;

  return (
    <div className="flex min-h-screen bg-[#f8f9ff] text-[#0b1c30] font-sans">
      {/* Main Content Area */}
      <main className="flex-1 flex flex-col">

        {/* Content Canvas */}
        <div className="p-8">
          {/* Welcome Section */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold text-[#091426]">
              Global Project Overview
            </h1>
            <p className="text-[#45474c] mt-1 text-sm">
              Real-time execution metrics across all active initiatives.
            </p>
          </motion.div>

          {/* Bento Grid Metrics  */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            <MetricCard
              label="Total Projects"
              value={totalProjects.toString()}
              subValue="Active & Completed"
              icon={<ShelvingUnit className="text-[#0058be]" />}
            />
            <MetricCard
              label="On Track"
              value={onTrackProjects.toString()}
              subValue="Active"
              icon={<CheckCircle className="text-green-600" />}
            />
            <MetricCard
              label="Delayed"
              value={delayedProjects.toString()}
              subValue="Requires Attention"
              icon={<CircleAlert className="text-[#ba1a1a]" />}
              isError={delayedProjects > 0}
            />
            <MetricCard
              label="Completed"
              value={completedProjects.toString()}
              subValue="Done"
              icon={<StickyNote className="text-[#040057]" />}
            />
          </div>

          {/* Project List Table */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-[#c5c6cd] rounded-xl overflow-hidden shadow-sm"
          >
            <div className="px-6 py-4 border-b border-[#c5c6cd] flex justify-between items-center bg-[#f8f9ff]">
              <h3 className="font-bold text-[#091426]">Active Portfolio</h3>
              <div className="flex gap-2">
                <TableActionBtn
                  icon={<ArrowDownWideNarrow size={16} />}
                  label="Filter"
                />
                <TableActionBtn icon={<Download size={16} />} label="Export" />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#f0f4ff] border-b border-[#c5c6cd]">
                    <Th>Project Name</Th>
                    <Th>Health</Th>
                    <Th>Stakeholder</Th>
                    <Th>Progress</Th>
                    <Th>Deadline</Th>
                    <Th className="text-right">Action</Th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#c5c6cd]">
                  {isLoading ? (
                    <tr>
                      <td colSpan={6} className="text-center py-8 text-[#75777d]">Loading projects...</td>
                    </tr>
                  ) : projects.map((proj) => {
                    const health = proj.status === "completed" ? "Completed" : proj.status === "draft" ? "Draft" : new Date(proj.durationEnd).getTime() < new Date().getTime() ? "Delayed" : "On Track";
                    const membersCount = proj.teamMembers?.length || 0;
                    return (
                    <tr
                      key={proj.id}
                      className="hover:bg-[#f8f9ff] transition-colors group"
                    >
                      <td className="px-6 py-5">
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-[#091426]">
                            {proj.platformName}
                          </span>
                          <span className="text-[12px] text-[#45474c]">
                            Budget: ${proj.budget}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <HealthBadge status={health} />
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex -space-x-2">
                          {[...Array(Math.min(membersCount, 3))].map((_, i) => (
                            <div
                              key={i}
                              className="w-8 h-8 rounded-full border-2 border-white bg-gray-200 relative overflow-hidden flex items-center justify-center text-[10px] font-bold"
                            >
                              {proj.teamMembers?.[i]?.profile?.displayName?.substring(0, 2).toUpperCase() || "MB"}
                            </div>
                          ))}
                          {membersCount > 3 && (
                            <div className="w-8 h-8 rounded-full border-2 border-white bg-[#e5eeff] flex items-center justify-center text-[10px] font-bold text-[#45474c]">
                              +{membersCount - 3}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-5 w-48">
                        <div className="flex flex-col gap-1.5">
                          <span className="text-[11px] font-bold text-[#45474c]">
                            {proj.progress || 0}%
                          </span>
                          <div className="w-full h-1.5 bg-[#e5eeff] rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${health === "Delayed" ? "bg-[#ba1a1a]" : "bg-[#0058be]"}`}
                              style={{ width: `${proj.progress || 0}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-sm text-[#45474c]">
                        {new Date(proj.durationEnd).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-5 text-right">
                        <button className="p-1.5 hover:bg-[#e5eeff] rounded-lg transition-all text-[#45474c]">
                          <Ellipsis size={18} />
                        </button>
                      </td>
                    </tr>
                  )})}
                </tbody>
              </table>
            </div>

            <div className="px-6 py-4 border-t border-[#c5c6cd] flex justify-between items-center bg-[#f8f9ff]">
              <span className="text-xs font-medium text-[#45474c]">
                Showing {projects.length} projects
              </span>
              <div className="flex items-center gap-2">
                <button
                  className="p-1 rounded-lg hover:bg-[#e5eeff] disabled:opacity-30"
                  disabled
                >
                  <ChevronLeft size={18} />
                </button>
                <div className="flex gap-1">
                  <button className="w-8 h-8 flex items-center justify-center bg-[#0058be] text-white rounded-lg text-xs font-bold">
                    1
                  </button>
                  <button className="w-8 h-8 flex items-center justify-center hover:bg-[#e5eeff] rounded-lg text-xs font-bold text-[#45474c]">
                    2
                  </button>
                  <button className="w-8 h-8 flex items-center justify-center hover:bg-[#e5eeff] rounded-lg text-xs font-bold text-[#45474c]">
                    3
                  </button>
                </div>
                <button className="p-1 rounded-lg hover:bg-[#e5eeff]">
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </motion.section>
        </div>
      </main>
    </div>
  );
}

// --- Sub-components ---



const MetricCard = ({
  label,
  value,
  subValue,
  icon,
  isError = false,
}: {
  label: string;
  value: string;
  subValue: string;
  icon: any;
  isError?: boolean;
}) => (
  <motion.div
    whileHover={{ y: -4 }}
    className="bg-white border border-[#c5c6cd] rounded-xl p-5 flex flex-col gap-3 shadow-sm"
  >
    <div className="flex justify-between items-start">
      <span className="text-[11px] font-bold text-[#75777d] uppercase tracking-wider">
        {label}
      </span>
      <div className="p-2 bg-[#f0f4ff] rounded-lg">{icon}</div>
    </div>
    <div className="flex items-baseline gap-2">
      <span className="text-3xl font-bold">{value}</span>
      <span
        className={`text-[11px] font-bold ${isError ? "text-[#ba1a1a]" : label === "On Track" ? "text-green-600" : "text-[#0058be]"}`}
      >
        {subValue}
      </span>
    </div>
  </motion.div>
);

const Th = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <th
    className={`px-6 py-3 text-[10px] font-bold text-[#75777d] uppercase tracking-widest ${className}`}
  >
    {children}
  </th>
);

const TableActionBtn = ({ icon, label }: { icon: any; label: string }) => (
  <button className="flex items-center gap-1.5 px-3 py-1.5 border border-[#c5c6cd] rounded-lg text-[#45474c] text-[11px] font-bold hover:bg-white transition-all">
    {icon} {label}
  </button>
);

const HealthBadge = ({ status }: { status: string }) => {
  const styles: any = {
    "On Track": "bg-green-50 text-green-700",
    "Completed": "bg-blue-50 text-blue-700",
    "Draft": "bg-gray-50 text-gray-700",
    Delayed: "bg-[#ffdad6] text-[#93000a]",
  };
  const dots: any = {
    "On Track": "bg-green-600",
    "Completed": "bg-blue-600",
    "Draft": "bg-gray-600",
    Delayed: "bg-[#ba1a1a]",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${styles[status]}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dots[status]}`}></span>
      {status}
    </span>
  );
};
