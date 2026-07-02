"use client";

import React from "react";
import { FolderOpen, RefreshCw, AlertTriangle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface DashboardStatsProps {
  totalProjects: number;
  activeSprints: number;
  atRiskCount: number;
}

export function DashboardStats({
  totalProjects,
  activeSprints,
  atRiskCount,
}: DashboardStatsProps) {
  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {/* Total Projects */}
      <Card className="bg-[#1a1a1a] border-[#333333] rounded-xl hover:border-[#444444] transition-colors shadow-sm">
        <CardContent className="p-5 flex flex-col justify-between h-32">
          <span className="text-xs font-semibold text-[#c4c7c9] uppercase tracking-wider">
            Total Projects
          </span>
          <div className="flex items-end justify-between">
            <span className="text-3xl font-bold text-white leading-none">
              {totalProjects}
            </span>
            <FolderOpen className="text-[#c4c7c9] opacity-40 size-6" />
          </div>
        </CardContent>
      </Card>

      {/* Active Sprints */}
      <Card className="bg-[#1a1a1a] border-[#333333] rounded-xl hover:border-[#444444] transition-colors shadow-sm">
        <CardContent className="p-5 flex flex-col justify-between h-32">
          <span className="text-xs font-semibold text-[#c4c7c9] uppercase tracking-wider">
            Active Sprints
          </span>
          <div className="flex items-end justify-between">
            <span className="text-3xl font-bold text-white leading-none">
              {activeSprints}
            </span>
            <RefreshCw className="text-[#c4c7c9] opacity-40 size-6" />
          </div>
        </CardContent>
      </Card>

      {/* At Risk Projects */}
      <Card className="bg-[#93000a]/10 border-[#93000a]/30 rounded-xl col-span-1 sm:col-span-2 md:col-span-1 shadow-sm">
        <CardContent className="p-5 flex flex-col justify-between h-32">
          <span className="text-xs font-semibold text-[#ffb4ab] uppercase tracking-wider">
            At Risk
          </span>
          <div className="flex items-end justify-between">
            <span className="text-3xl font-bold text-[#ffb4ab] leading-none">
              {atRiskCount}
            </span>
            <AlertTriangle className="text-[#ffb4ab] opacity-50 size-6" />
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
