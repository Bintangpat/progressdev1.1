"use client";

import React from "react";
import Link from "next/link";
import {
  MoreVertical,
  Calendar,
  CheckCircle2,
  Clock,
  FileText,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ApiProject,
  getProjectStatusColors,
  getProjectStatusLabel,
} from "@/lib/api";
import { ProjectStatus } from "@/lib/types/database";

// Re-export tipe yang dipakai di luar komponen ini
export type { ApiProject as Project };

interface ProjectCardProps {
  project: ApiProject;
  progress: number;
  onEdit: (project: ApiProject) => void;
  onDelete: (id: string) => void;
}

export function ProjectCard({
  project,
  progress,
  onEdit,
  onDelete,
}: ProjectCardProps) {
  const { statusColor, barColor } = getProjectStatusColors(
    project.status as ProjectStatus,
  );
  const statusLabel = getProjectStatusLabel(project.status as ProjectStatus);

  const startDate = new Date(project.durationStart).toLocaleDateString(
    "id-ID",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
    },
  );
  const endDate = new Date(project.durationEnd).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const isOverdue =
    project.status !== "completed" &&
    new Date(project.durationEnd) < new Date();

  return (
    <Card className="bg-[#1c1b1b] border-[#333333] rounded-xl hover:border-[#444444] transition-all group flex flex-col h-full shadow-md hover:-translate-y-0.5 duration-200">
      <CardContent className="p-5 flex flex-col h-full">
        {/* Card Header */}
        <div className="flex justify-between items-start mb-1">
          <Link
            href={`/developer/project/${project.id}`}
            className="font-medium text-white hover:text-white/80 transition-colors cursor-pointer line-clamp-1 pr-2 flex-1"
          >
            {project.platformName}
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="text-[#c4c7c9] opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-[#2a2a2a] rounded cursor-pointer shrink-0">
                <MoreVertical className="size-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="bg-[#1a1a1a] border-[#333333] text-white"
            >
              <DropdownMenuItem
                className="hover:bg-[#2a2a2a] focus:bg-[#2a2a2a] cursor-pointer"
                onClick={() => onEdit(project)}
              >
                Edit Project
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-red-400 hover:bg-[#2a2a2a] focus:bg-[#2a2a2a] cursor-pointer"
                onClick={() => onDelete(project.id)}
              >
                Delete Project
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Stakeholder Name */}
        <p className="text-[10px] text-[#c4c7c9]/60 mb-3 flex items-center gap-1">
          <FileText className="size-3" />
          {project.stakeholderName}
        </p>

        {/* Card Footer Status */}
        <div className="mt-auto flex flex-col gap-4">
          <div className="flex justify-between items-center text-xs">
            <span
              className={`px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider ${statusColor}`}
            >
              {statusLabel}
            </span>
            <span className="font-semibold text-white">{progress}%</span>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-[#131313] rounded-full h-1.5 overflow-hidden border border-[#2a2a2a]">
            <div
              className={`${barColor} h-1.5 rounded-full transition-all duration-500`}
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Divider & Metadata */}
          <div className="flex justify-between items-center pt-3 border-t border-[#333333]">
            {/* Status badges */}
            <div className="flex items-center gap-1.5">
              {project.tasks && (
                <span className="flex items-center gap-1 text-[10px] text-[#c4c7c9]">
                  <CheckCircle2 className="size-3 text-emerald-400" />
                  {project.tasks.filter((t) => t.status === "selesai").length}/
                  {project.tasks.length} tasks
                </span>
              )}
            </div>

            {/* Timeline Info */}
            <span
              className={`text-xs flex items-center gap-1.5 font-medium ${isOverdue ? "text-[#ffb4ab]" : "text-[#c4c7c9]"}`}
            >
              {isOverdue ? (
                <Clock className="size-3.5 text-[#ffb4ab]" />
              ) : (
                <Calendar className="size-3.5" />
              )}
              {endDate}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
