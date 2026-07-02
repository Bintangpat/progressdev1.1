"use client";

import React from "react";
import { motion } from "framer-motion";
import { CheckSquare, CheckCircle2, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface MetricCardsProps {
  totalTasks?: number;
  completedTasks?: number;
  teamMembers?: number;
  weeklyIncrease?: number;
}

export function MetricCards({
  totalTasks = 124,
  completedTasks = 93,
  teamMembers = 8,
  weeklyIncrease = 12,
}: MetricCardsProps) {
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: { type: "spring" as const, stiffness: 260, damping: 25 },
    },
  };

  const ratio = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="flex flex-col gap-4 justify-between">
      {/* Metric Card 1: Total Tasks */}
      <motion.div variants={itemVariants} whileHover={{ x: 2 }}>
        <Card className="bg-[#1A1A1A] border-[#333333] rounded-xl hover:border-[#444444] transition-colors shadow-sm">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div className="size-10 rounded-lg bg-[#201f1f] flex items-center justify-center border border-[#444749]/40">
                <CheckSquare className="text-white size-4" />
              </div>
              <div>
                <p className="text-xs text-[#c4c7c9] font-medium">
                  Total Tasks
                </p>
                <p className="text-base font-bold text-white mt-0.5">
                  {totalTasks} Items
                </p>
              </div>
            </div>
            <span className="text-xs font-semibold text-white bg-[#2a2a2a] px-2 py-0.5 rounded border border-[#444749]/20">
              +{weeklyIncrease} this wk
            </span>
          </CardContent>
        </Card>
      </motion.div>

      {/* Metric Card 2: Completed Tasks */}
      <motion.div variants={itemVariants} whileHover={{ x: 2 }}>
        <Card className="bg-[#1A1A1A] border-[#333333] rounded-xl hover:border-[#444444] transition-colors shadow-sm">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div className="size-10 rounded-lg bg-[#201f1f] flex items-center justify-center border border-[#444749]/40">
                <CheckCircle2 className="text-white size-4" />
              </div>
              <div>
                <p className="text-xs text-[#c4c7c9] font-medium">
                  Completed Tasks
                </p>
                <p className="text-base font-bold text-white mt-0.5">
                  {completedTasks} Resolved
                </p>
              </div>
            </div>
            <span className="text-xs font-bold text-white">{ratio}% Ratio</span>
          </CardContent>
        </Card>
      </motion.div>

      {/* Metric Card 3: Team Members */}
      <motion.div variants={itemVariants} whileHover={{ x: 2 }}>
        <Card className="bg-[#1A1A1A] border-[#333333] rounded-xl hover:border-[#444444] transition-colors shadow-sm">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div className="size-10 rounded-lg bg-[#201f1f] flex items-center justify-center border border-[#444749]/40">
                <Users className="text-white size-4" />
              </div>
              <div>
                <p className="text-xs text-[#c4c7c9] font-medium">
                  Team Members
                </p>
                <p className="text-base font-bold text-white mt-0.5">
                  {teamMembers} Active Now
                </p>
              </div>
            </div>

            {/* Member Profile Avatar Stacks */}
            <div className="flex -space-x-1.5">
              <Avatar className="size-6 border border-[#1A1A1A]">
                <AvatarFallback className="bg-neutral-600 text-[8px] text-white">U1</AvatarFallback>
              </Avatar>
              <Avatar className="size-6 border border-[#1A1A1A]">
                <AvatarFallback className="bg-neutral-500 text-[8px] text-white">U2</AvatarFallback>
              </Avatar>
              <Avatar className="size-6 border border-[#1A1A1A]">
                <AvatarFallback className="bg-[#201f1f] text-[#c4c7c9] text-[9px] font-bold">
                  +{teamMembers - 2 > 0 ? teamMembers - 2 : 0}
                </AvatarFallback>
              </Avatar>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
