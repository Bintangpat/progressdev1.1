"use client";

import { Droppable, Draggable } from "@hello-pangea/dnd";
import { KanbanCard } from "./kanban-card";
import type { TaskStatus, TaskWithDetails } from "@/lib/types/database";
import { TASK_STATUS_CONFIG } from "@/lib/types/database";

interface KanbanColumnProps {
  status: TaskStatus;
  tasks: TaskWithDetails[];
  onTaskClick: (task: TaskWithDetails) => void;
}

export function KanbanColumn({
  status,
  tasks,
  onTaskClick,
}: KanbanColumnProps) {
  const config = TASK_STATUS_CONFIG[status];

  return (
    <div className="kanban-column flex flex-col min-w-[280px] max-w-[320px] shrink-0">
      {/* Column Header */}
      <div
        className={`flex items-center gap-2 px-3 py-2.5 rounded-t-xl border border-b-0 border-white/10 ${config.bgColor}`}
      >
        <div
          className={`h-2.5 w-2.5 rounded-full ${config.color.replace("text-", "bg-")}`}
        />
        <span className={`text-sm font-semibold ${config.color}`}>
          {config.label}
        </span>
        <span
          className={`ml-auto text-xs font-medium px-1.5 py-0.5 rounded-full ${config.bgColor} ${config.color}`}
        >
          {tasks.length}
        </span>
      </div>

      {/* Droppable Area */}
      <Droppable droppableId={status}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`
              flex-1 p-2 space-y-2 rounded-b-xl border border-white/10 min-h-[200px]
              transition-colors duration-200 overflow-y-auto max-h-[calc(100vh-320px)]
              ${
                snapshot.isDraggingOver
                  ? "bg-white/4 border-violet-500/20"
                  : "bg-card/20"
              }
            `}
          >
            {tasks.map((task, index) => (
              <Draggable key={task.id} draggableId={task.id} index={index}>
                {(provided, snapshot) => (
                  <KanbanCard
                    task={task}
                    onClick={onTaskClick}
                    provided={provided}
                    isDragging={snapshot.isDragging}
                  />
                )}
              </Draggable>
            ))}
            {provided.placeholder}
            {tasks.length === 0 && !snapshot.isDraggingOver && (
              <div className="flex items-center justify-center h-20 text-xs text-muted-foreground/50 border border-dashed border-white/5 rounded-lg">
                Kosong
              </div>
            )}
          </div>
        )}
      </Droppable>
    </div>
  );
}
