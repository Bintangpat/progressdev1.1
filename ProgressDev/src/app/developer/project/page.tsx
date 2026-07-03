aaaaaaaa"use client";

import React from "react";
import { motion } from "framer-motion";
import { Folder, Search } from "lucide-react";
import { ProgressCard } from "@/components/developer/overview/progress-card";
import { MetricCards } from "@/components/developer/overview/metric-cards";
import { ActivityFeed, ActivityItem } from "@/components/developer/overview/activity-feed";

const RECENT_ACTIVITIES: ActivityItem[] = [
  {
    id: "act-1",
    type: "comment",
    title: "John added a comment",
    time: "10 mins ago",
    subtitle: "On task ",
    linkText: "Design System Update",
    commentText:
      "I've pushed the latest token changes to the repository. Please review when you have a moment.",
  },
  {
    id: "act-2",
    type: "status",
    title: "Task moved to Done",
    time: "1 hour ago",
    subtitle: "",
    linkText: "API Integration Auth",
    commentText: "was moved by Sarah.",
  },
  {
    id: "act-3",
    type: "create",
    title: "New Task Created",
    time: "Yesterday",
    subtitle: "Admin created ",
    linkText: "Update User Profile View",
    tags: [
      { label: "High Priority", type: "error" },
      { label: "Frontend", type: "neutral" },
    ],
  },
];

export default function ProjectOverview() {
  // Bento Grid entrance stagger variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.08 } },
  };

  return (
    <div className="bg-[#131313] text-[#e5e2e1] min-h-screen flex flex-col font-sans antialiased overflow-x-hidden selection:bg-white selection:text-black">
      {/* --- TOP APP BAR (FULL WIDTH) --- */}
      <header className="w-full h-16 border-b border-[#444749]/30 bg-[#131313] flex items-center justify-between px-6 sticky top-0 z-40">
        <div className="flex items-center gap-3 cursor-pointer group">
          <div className="size-8 rounded bg-[#201f1f] flex items-center justify-center border border-[#444749]/40 group-hover:border-white transition-colors">
            <Folder className="text-white size-4" />
          </div>
          <h1 className="text-sm font-semibold text-white tracking-wide">
            Atlas CRM Revamp
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 px-4 py-1.5 rounded-lg border border-[#444749]/40 text-[#c4c7c9] hover:text-white hover:border-white transition-all text-xs bg-[#1c1b1b] cursor-pointer">
            <Search size={14} />
            <span>Search Workspace...</span>
          </button>
        </div>
      </header>

      {/* --- DASHBOARD WRAPPER CONTENT --- */}
      <main className="flex-1 overflow-y-auto p-6 md:p-10 bg-[#131313]">
        <div className="max-w-7xl mx-auto flex flex-col gap-10">
          {/* Main header summary */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-[#444749]/15 pb-6"
          >
            <div>
              <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-white mb-1">
                Project Overview
              </h2>
              <p className="text-sm text-[#c4c7c9]/80">
                Track progress, metrics, and recent team activity for the Atlas
                CRM Revamp.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs text-[#c4c7c9] bg-[#1c1b1b] border border-[#444749]/30 px-3 py-1.5 rounded-md">
              <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-medium">System Auto Sync: Active</span>
            </div>
          </motion.div>

          {/* Bento grid metric blocks */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          >
            {/* Phase 2: Modular ProgressCard */}
            <ProgressCard progress={75} sprintName="Sprint 4 Development Timeline" statusText="ON TRACK" />

            {/* Phase 2: Modular MetricCards Stack */}
            <MetricCards totalTasks={124} completedTasks={93} teamMembers={8} weeklyIncrease={12} />
          </motion.div>

          {/* Phase 2: Modular Activity Timeline Logs */}
          <ActivityFeed activities={RECENT_ACTIVITIES} />
        </div>
      </main>
    </div>
  );
}
