"use client";

import type { DraggableProvided } from "@hello-pangea/dnd";
import { CheckCircle2, FileImage, ListChecks } from "lucide-react";
import type { TaskWithDetails } from "@/lib/types/database";
import { TASK_STATUS_CONFIG } from "@/lib/types/database";

interface KanbanCardProps {
  task: TaskWithDetails;
  onClick: (task: TaskWithDetails) => void;
  provided: DraggableProvided;
  isDragging: boolean;
}

export function KanbanCard({
  task,
  onClick,
  provided,
  isDragging,
}: KanbanCardProps) {
  const checkedCount = task.checklist_items.filter((c) => c.is_checked).length;
  const totalCount = task.checklist_items.length;
  const screenshotCount = task.task_screenshots.length;
  const statusConfig = TASK_STATUS_CONFIG[task.status];

  return (
    <div
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      onClick={() => onClick(task)}
      className={`
        group rounded-lg border bg-card/80 backdrop-blur-sm p-3.5 cursor-pointer
        transition-all duration-200
        ${
          isDragging
            ? "border-violet-500/50 shadow-lg shadow-violet-500/10 scale-[1.02] rotate-1"
            : "border-white/10 hover:border-white/20 hover:bg-card/90"
        }
      `}
    >
      {/* Title */}
      <h4
        className={`text-sm font-medium leading-snug mb-2 ${
          task.is_completed ? "line-through text-muted-foreground" : ""
        }`}
      >
        {task.title}
      </h4>

      {/* Description preview */}
      {task.description && (
        <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
          {task.description}
        </p>
      )}

      {/* Footer stats */}
      <div className="flex items-center gap-3 text-xs text-muted-foreground">
        {totalCount > 0 && (
          <span className="flex items-center gap-1">
            <ListChecks className="h-3 w-3" />
            <span
              className={checkedCount === totalCount ? "text-emerald-400" : ""}
            >
              {checkedCount}/{totalCount}
            </span>
          </span>
        )}
        {screenshotCount > 0 && (
          <span className="flex items-center gap-1">
            <FileImage className="h-3 w-3" />
            {screenshotCount}
          </span>
        )}
        {task.is_completed && (
          <CheckCircle2 className="h-3 w-3 text-emerald-400 ml-auto" />
        )}
      </div>
    </div>
  );
}
