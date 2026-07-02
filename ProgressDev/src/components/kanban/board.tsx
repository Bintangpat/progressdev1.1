"use client";

import React, { useState } from "react";
import {
  DndContext,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  defaultDropAnimationSideEffects,
} from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { KanbanColumn, Column } from "./column";
import { KanbanCard } from "./card";
import { ApiTask } from "@/lib/api";
import { TaskStatus } from "@/lib/types/database";

interface KanbanBoardProps {
  columns: Column[];
  setColumns: React.Dispatch<React.SetStateAction<Column[]>>;
  onAddTask: (columnId: TaskStatus) => void;
  onEditTask: (task: ApiTask) => void;
  onDeleteTask: (id: string) => void;
  onTaskMove?: (
    taskId: string,
    newStatus: TaskStatus,
    newOrderIndex: number,
  ) => void;
}

export function KanbanBoard({
  columns,
  setColumns,
  onAddTask,
  onEditTask,
  onDeleteTask,
  onTaskMove,
}: KanbanBoardProps) {
  const [activeTask, setActiveTask] = useState<ApiTask | null>(null);

  // Setup sensors (Pointer & Keyboard support)
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // allows clicking action buttons without triggering drag
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragStart = (event: any) => {
    const { active } = event;
    const task = columns
      .flatMap((c) => c.cards)
      .find((t) => t.id === active.id);
    setActiveTask(task || null);
  };

  const handleDragOver = (event: any) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    const activeColumn = columns.find((col) =>
      col.cards.some((t) => t.id === activeId),
    );
    const overColumn = columns.find(
      (col) => col.id === overId || col.cards.some((t) => t.id === overId),
    );

    if (!activeColumn || !overColumn || activeColumn === overColumn) return;

    setColumns((prev) => {
      const activeCards = [...activeColumn.cards];
      const overCards = [...overColumn.cards];

      const taskIndex = activeCards.findIndex((t) => t.id === activeId);
      const [movedTask] = activeCards.splice(taskIndex, 1);

      const isOverColumn = overColumn.id === overId;
      const overIndex = isOverColumn
        ? overCards.length
        : overCards.findIndex((t) => t.id === overId);

      // Mutate the task status locally so it renders in the correct column format if needed
      movedTask.status = overColumn.id as TaskStatus;
      overCards.splice(overIndex, 0, movedTask);

      return prev.map((col) => {
        if (col.id === activeColumn.id) return { ...col, cards: activeCards };
        if (col.id === overColumn.id) return { ...col, cards: overCards };
        return col;
      });
    });
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    const activeColumn = columns.find((col) =>
      col.cards.some((t) => t.id === activeId),
    );
    if (!activeColumn) return;

    if (activeId !== overId) {
      setColumns((prev) => {
        const newCols = prev.map((col) => {
          if (col.id === activeColumn.id) {
            const oldIndex = col.cards.findIndex((t) => t.id === activeId);
            const newIndex = col.cards.findIndex((t) => t.id === overId);
            const reordered = arrayMove(col.cards, oldIndex, newIndex);

            // Re-assign order index locally
            reordered.forEach((c, idx) => (c.orderIndex = idx));

            // Notify parent about the final drop position
            if (onTaskMove) {
              const movedTask = reordered.find((t) => t.id === activeId);
              if (movedTask) {
                // If it was dropped in the same column, we need the new index
                // Wait, if activeColumn !== overColumn, it was handled by DragOver.
                // DragEnd handles same-column sorting AND final confirmation of cross-column
                onTaskMove(activeId, col.id, newIndex);
              }
            }

            return { ...col, cards: reordered };
          }
          return col;
        });
        return newCols;
      });
    } else if (onTaskMove) {
      // It was moved across columns and dropped exactly on the column id or dropped in same spot
      const taskIndex = activeColumn.cards.findIndex((t) => t.id === activeId);
      onTaskMove(activeId, activeColumn.id, taskIndex);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-6 h-full pb-4 overflow-auto kanban-board-scroll">
        {columns.map((col) => (
          <KanbanColumn
            key={col.id}
            column={col}
            onAddTask={onAddTask}
            onEditTask={onEditTask}
            onDeleteTask={onDeleteTask}
          />
        ))}
      </div>

      {/* Floating Drag Overlay Card Element */}
      <DragOverlay
        dropAnimation={{
          sideEffects: defaultDropAnimationSideEffects({
            styles: {
              active: {
                opacity: "0.5",
              },
            },
          }),
        }}
      >
        {activeTask ? (
          <KanbanCard
            task={activeTask}
            isOverlay
            onEdit={onEditTask}
            onDelete={onDeleteTask}
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
