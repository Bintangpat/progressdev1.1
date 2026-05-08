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

// --- Data Mocking ---
const PROJECTS = [
  {
    id: 1,
    name: "Cloud Infrastructure Migration",
    type: "Infrastructure",
    priority: "High",
    health: "On Track",
    progress: 68,
    deadline: "Oct 24, 2023",
    members: 4,
  },
  {
    id: 2,
    name: "Mobile App Redesign",
    type: "UX/UI",
    priority: "Medium",
    health: "At Risk",
    progress: 42,
    deadline: "Nov 12, 2023",
    members: 5,
  },
  {
    id: 3,
    name: "API Gateway V2",
    type: "Backend",
    priority: "High",
    health: "Delayed",
    progress: 15,
    deadline: "Dec 01, 2023",
    members: 1,
  },
  {
    id: 4,
    name: "Auth Provider Integration",
    type: "Security",
    priority: "Low",
    health: "On Track",
    progress: 92,
    deadline: "Oct 15, 2023",
    members: 1,
  },
];

export default function GlobalOverview() {
  return (
    <div className="flex min-h-screen bg-[#f8f9ff] text-[#0b1c30] font-sans">
      {/* SideNavBar Component [cite: 4] */}
      <aside className="fixed left-0 top-0 h-full w-[280px] bg-[#eff4ff] border-r border-[#c5c6cd] flex flex-col py-6 px-4 z-50">
        <div className="flex items-center gap-3 px-2 mb-8">
          <div className="w-10 h-10 rounded-lg bg-[#0058be] flex items-center justify-center text-white">
            <Terminal size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[#091426]">DevProgress</h2>
            <p className="text-[12px] text-[#45474c] font-medium opacity-70">
              Technical Execution
            </p>
          </div>
        </div>

        <button className="mb-6 mx-2 py-2.5 px-4 bg-[#0058be] text-white rounded-lg text-sm font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-md">
          <Plus size={18} />
          Create Project
        </button>

        <nav className="flex flex-col gap-1 grow">
          <SidebarLink icon={<Users size={20} />} label="User Management" />
          <SidebarLink
            icon={<LayoutDashboard size={20} />}
            label="Global Overview"
            active
          />
          <SidebarLink icon={<Kanban size={20} />} label="Kanban Board" />
          <SidebarLink icon={<Flag size={20} />} label="Stakeholder View" />
        </nav>

        <div className="mt-auto flex flex-col gap-1 pt-6 border-t border-[#c5c6cd]">
          <SidebarLink icon={<Settings size={20} />} label="Settings" />
          <SidebarLink icon={<LogOut size={20} />} label="Logout" />
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="ml-[280px] flex-1 flex flex-col">
        {/* TopAppBar Component [cite: 4] */}
        <header className="h-16 bg-white border-b border-[#c5c6cd] flex justify-between items-center px-8 sticky top-0 z-40">
          <div className="relative w-full max-w-xl">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#45474c]"
              size={18}
            />
            <input
              className="w-full bg-[#f0f4ff] border-none rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-[#0058be] transition-all outline-none"
              placeholder="Search projects, tasks, or members..."
              type="text"
            />
          </div>

          <div className="flex items-center gap-4">
            <button className="w-10 h-10 flex items-center justify-center text-[#45474c] hover:bg-[#eff4ff] transition-colors rounded-full relative">
              <Bell size={20} />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-[#ba1a1a] rounded-full border-2 border-white"></span>
            </button>
            <div className="h-8 w-px bg-[#c5c6cd]" />
            <div className="flex items-center gap-3 pl-2">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-[#091426]">Alex Rivera</p>
                <p className="text-[11px] font-bold text-[#75777d] uppercase tracking-wider">
                  System Admin
                </p>
              </div>
              <div className="w-10 h-10 rounded-full border border-[#c5c6cd] overflow-hidden relative">
                <Image
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop"
                  alt="Profile"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </header>

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
              value="42"
              subValue="+3 this month"
              icon={<ShelvingUnit className="text-[#0058be]" />}
            />
            <MetricCard
              label="On Track"
              value="31"
              subValue="74% Total"
              icon={<CheckCircle className="text-green-600" />}
            />
            <MetricCard
              label="Delayed"
              value="6"
              subValue="Requires Attention"
              icon={<CircleAlert className="text-[#ba1a1a]" />}
              isError
            />
            <MetricCard
              label="Completed"
              value="5"
              subValue="Q3 Milestone"
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
                  {PROJECTS.map((proj) => (
                    <tr
                      key={proj.id}
                      className="hover:bg-[#f8f9ff] transition-colors group"
                    >
                      <td className="px-6 py-5">
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-[#091426]">
                            {proj.name}
                          </span>
                          <span className="text-[12px] text-[#45474c]">
                            {proj.type} • {proj.priority} Priority
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <HealthBadge status={proj.health} />
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex -space-x-2">
                          {[...Array(Math.min(proj.members, 3))].map((_, i) => (
                            <div
                              key={i}
                              className="w-8 h-8 rounded-full border-2 border-white bg-gray-200 relative overflow-hidden"
                            >
                              <Image
                                src={`https://i.pravatar.cc/100?img=${proj.id + i + 10}`}
                                alt="Member"
                                fill
                              />
                            </div>
                          ))}
                          {proj.members > 3 && (
                            <div className="w-8 h-8 rounded-full border-2 border-white bg-[#e5eeff] flex items-center justify-center text-[10px] font-bold text-[#45474c]">
                              +{proj.members - 3}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-5 w-48">
                        <div className="flex flex-col gap-1.5">
                          <span className="text-[11px] font-bold text-[#45474c]">
                            {proj.progress}%
                          </span>
                          <div className="w-full h-1.5 bg-[#e5eeff] rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${proj.health === "Delayed" ? "bg-[#ba1a1a]" : proj.health === "At Risk" ? "bg-orange-500" : "bg-[#0058be]"}`}
                              style={{ width: `${proj.progress}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-sm text-[#45474c]">
                        {proj.deadline}
                      </td>
                      <td className="px-6 py-5 text-right">
                        <button className="p-1.5 hover:bg-[#e5eeff] rounded-lg transition-all text-[#45474c]">
                          <Ellipsis size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="px-6 py-4 border-t border-[#c5c6cd] flex justify-between items-center bg-[#f8f9ff]">
              <span className="text-xs font-medium text-[#45474c]">
                Showing 1-10 of 42 projects
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

const SidebarLink = ({
  icon,
  label,
  active = false,
}: {
  icon: any;
  label: string;
  active?: boolean;
}) => (
  <a
    href="#"
    className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all ${active ? "bg-[#d3e4fe] text-[#0058be] font-bold" : "text-[#45474c] hover:bg-[#e5eeff]"}`}
  >
    {icon}
    <span className="text-sm">{label}</span>
  </a>
);

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
    "At Risk": "bg-orange-50 text-orange-700",
    Delayed: "bg-[#ffdad6] text-[#93000a]",
  };
  const dots: any = {
    "On Track": "bg-green-600",
    "At Risk": "bg-orange-500",
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
