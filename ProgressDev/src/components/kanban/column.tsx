"use client";

import React from "react";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";
import { Plus, MoreHorizontal } from "lucide-react";
import { KanbanCard } from "./card";
import { ApiTask } from "@/lib/api";
import { TaskStatus } from "@/lib/types/database";

export interface Column {
  id: TaskStatus;
  title: string;
  cards: ApiTask[];
}

interface KanbanColumnProps {
  column: Column;
  onAddTask: (columnId: TaskStatus) => void;
  onEditTask: (task: ApiTask) => void;
  onDeleteTask: (id: string) => void;
}

export function KanbanColumn({
  column,
  onAddTask,
  onEditTask,
  onDeleteTask,
}: KanbanColumnProps) {
  // Column is a Droppable target
  const { setNodeRef } = useDroppable({
    id: column.id,
  });

  return (
    <div className="flex flex-col h-full bg-[#1A1A1A] rounded-2xl border border-[#333333] w-80 md:w-[340px] shrink-0 shadow-sm">
      {/* Column Header */}
      <div className="flex items-center justify-between p-4 border-b border-[#333333]">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-semibold text-white tracking-wide">
            {column.title}
          </h2>
          <span className="text-xs text-[#c4c7c9] bg-[#2a2a2a] px-2 py-0.5 rounded-full border border-[#333333]">
            {column.cards.length}
          </span>
        </div>
        <div className="flex gap-1 text-[#c4c7c9]">
          <button
            onClick={() => onAddTask(column.id)}
            className="size-6 flex items-center justify-center hover:text-white rounded hover:bg-[#222222] transition-colors cursor-pointer"
          >
            <Plus className="size-4" />
          </button>
          <button className="size-6 flex items-center justify-center hover:text-white rounded hover:bg-[#222222] transition-colors cursor-pointer">
            <MoreHorizontal className="size-4" />
          </button>
        </div>
      </div>

      {/* Cards Container */}
      <div
        ref={setNodeRef}
        className="flex-1 overflow-y-auto p-4 space-y-3 vertical-cards-scrollbar min-h-[200px]"
      >
        <SortableContext
          items={column.cards.map((card) => card.id)}
          strategy={verticalListSortingStrategy}
        >
          {column.cards.map((card) => (
            <KanbanCard
              key={card.id}
              task={card}
              onEdit={onEditTask}
              onDelete={onDeleteTask}
            />
          ))}

          {/* Empty column placeholder */}
          {column.cards.length === 0 && (
            <div className="h-32 border border-dashed border-[#333333] hover:border-gray-500 transition-colors rounded-xl flex items-center justify-center text-[#c4c7c9]/50 text-xs">
              Drop tasks here
            </div>
          )}
        </SortableContext>
      </div>
    </div>
  );
}
