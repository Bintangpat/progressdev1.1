"use client";

import React from "react";
import { motion } from "framer-motion";
import { TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface ProgressCardProps {
  progress?: number;
  sprintName?: string;
  statusText?: string;
}

export function ProgressCard({
  progress = 75,
  sprintName = "Sprint 4 Development Timeline",
  statusText = "ON TRACK",
}: ProgressCardProps) {
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: { type: "spring" as const, stiffness: 260, damping: 25 },
    },
  };

  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ y: -2 }}
      className="lg:col-span-2"
    >
      <Card className="bg-[#1A1A1A] border-[#333333] rounded-2xl p-6 md:p-8 flex flex-col relative overflow-hidden group shadow-sm transition-all h-full min-h-[220px]">
        {/* Glow Visual Highlight Effect */}
        <div className="absolute -top-24 -right-24 size-48 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10 transition-all duration-500 pointer-events-none" />

        <div className="flex justify-between items-start mb-10 relative z-10">
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wide">
              Current Progress
            </h3>
            <p className="text-xs text-[#c4c7c9] opacity-60 mt-0.5">
              {sprintName}
            </p>
          </div>
          <span className="bg-white/10 text-white text-[10px] font-bold tracking-wider px-3 py-1 rounded-full border border-white/20 uppercase flex items-center gap-1.5">
            <TrendingUp size={12} /> {statusText}
          </span>
        </div>

        <div className="flex items-end gap-3 mb-6 relative z-10">
          <span className="text-5xl md:text-6xl font-bold tracking-tighter text-white leading-none">
            {progress}%
          </span>
          <span className="text-xs text-[#c4c7c9] pb-1 font-medium">
            Completed tasks of current sprint scope
          </span>
        </div>

        {/* Dynamic Animated Timeline Progress Bar */}
        <div className="w-full h-2.5 bg-[#353434] rounded-full overflow-hidden mt-auto relative z-10">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
            className="h-full bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,0.3)]"
          />
        </div>
      </Card>
    </motion.div>
  );
}
