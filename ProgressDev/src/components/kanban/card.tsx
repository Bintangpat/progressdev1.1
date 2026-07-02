"use client";

import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { motion } from "framer-motion";
import { MoreHorizontal, Paperclip, Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ApiTask } from "@/lib/api";

interface KanbanCardProps {
  task: ApiTask;
  isOverlay?: boolean;
  onEdit: (task: ApiTask) => void;
  onDelete: (id: string) => void;
}

export function KanbanCard({
  task,
  isOverlay = false,
  onEdit,
  onDelete,
}: KanbanCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
  };

  const handleDropdownClick = (e: React.MouseEvent) => {
    // Prevent dragging when interacting with dropdown
    e.stopPropagation();
  };

  const checklistTotal = task.checklists?.length || 0;
  const checklistCompleted = task.checklists?.filter((c) => c.isChecked).length || 0;
  const attachmentsCount = task.screenshots?.length || 0;
  const createdDate = new Date(task.createdAt).toLocaleDateString("id-ID", { month: "short", day: "numeric" });

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`select-none ${isOverlay ? "z-50" : ""}`}
    >
      <Card
        className={`bg-[#222222] border-[#333333] rounded-xl hover:border-[#444444] transition-all cursor-grab active:cursor-grabbing group shadow-sm flex flex-col ${
          isOverlay ? "shadow-2xl border-white/20 rotate-2 scale-[1.02]" : ""
        }`}
      >
        <CardContent className="p-4">
          {/* Header & Options */}
          <div className="flex items-center justify-end mb-2">
            <div onClick={handleDropdownClick}>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="opacity-0 group-hover:opacity-100 text-[#c4c7c9] hover:text-white transition-opacity p-0.5 rounded hover:bg-[#353434] cursor-pointer">
                    <MoreHorizontal className="size-3.5" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-[#1a1a1a] border-[#333333] text-white">
                  <DropdownMenuItem
                    className="focus:bg-[#2a2a2a] cursor-pointer"
                    onClick={() => onEdit(task)}
                  >
                    Edit Task
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-red-400 focus:bg-[#2a2a2a] cursor-pointer"
                    onClick={() => onDelete(task.id)}
                  >
                    Delete Task
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Task Title & Description */}
          <h3 className="text-sm font-semibold text-white tracking-wide mb-1 leading-snug">
            {task.title}
          </h3>
          {task.description && (
            <p className="text-xs text-[#c4c7c9]/80 line-clamp-2 mb-4 leading-relaxed">
              {task.description}
            </p>
          )}

          {/* Checklist Element */}
          {checklistTotal > 0 && (
            <div className="mb-4 mt-2">
              <div className="flex justify-between text-[10px] text-[#c4c7c9] font-medium mb-1">
                <span>Checklist</span>
                <span>
                  {checklistCompleted}/{checklistTotal} selesai
                </span>
              </div>
              <div className="w-full bg-[#141414] rounded-full h-1">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{
                    width: `${(checklistCompleted / checklistTotal) * 100}%`,
                  }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="bg-white h-1 rounded-full"
                />
              </div>
            </div>
          )}

          {/* Card Metadata Footer Info */}
          <div className="flex items-center justify-between mt-auto pt-2.5 border-t border-[#333333]/40">
            {/* Avatars */}
            <div className="flex -space-x-1.5">
              <Avatar className="size-6 border border-[#222222]">
                <AvatarFallback className="bg-neutral-600 text-[8px] text-white font-bold">DV</AvatarFallback>
              </Avatar>
            </div>

            <div className="flex items-center gap-3 text-[#c4c7c9] text-[11px] font-medium opacity-80">
              <div className="flex items-center gap-1">
                <Calendar className="size-3" />
                <span>{createdDate}</span>
              </div>
              {attachmentsCount > 0 && (
                <div className="flex items-center gap-1">
                  <Paperclip className="size-3" />
                  <span>{attachmentsCount}</span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
