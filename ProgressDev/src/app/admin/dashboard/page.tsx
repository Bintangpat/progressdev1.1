"use client";

import React from "react";
import {
  CheckCircle,
  CircleAlert,
  ShelvingUnit,
  StickyNote,
  Loader2,
} from "lucide-react";
import { motion } from "framer-motion";
import { projectsApi, ApiProject } from "@/lib/api";
import { DataTable } from "@/components/data-table";
import { columns } from "./columns";

export default function GlobalOverview() {
  const [projects, setProjects] = React.useState<ApiProject[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  const fetchProjects = () => {
    setIsLoading(true);
    projectsApi
      .getAll()
      .then((data) => {
        setProjects(data);
        setIsLoading(false);
      })
      .catch(console.error);
  };

  React.useEffect(() => {
    fetchProjects();
  }, []);

  const totalProjects = projects.length;
  const completedProjects = projects.filter(
    (p) => p.status === "completed",
  ).length;
  const onTrackProjects = projects.filter((p) => p.status === "active").length;
  const delayedProjects = projects.filter((p) => {
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
            <p className="text-foreground mt-1 text-sm">
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
            </div>

            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-16 gap-3">
                <Loader2 className="w-8 h-8 animate-spin text-[#0058be]" />
                <span className="text-sm text-[#75777d] font-semibold">Loading portfolio...</span>
              </div>
            ) : (
              <DataTable
                columns={columns}
                data={projects}
                filterColumnId="platformName"
                filterPlaceholder="Search projects..."
                meta={{ refresh: fetchProjects }}
              />
            )}
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
