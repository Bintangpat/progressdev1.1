"use client";

import { DragDropContext, type DropResult } from "@hello-pangea/dnd";
import { KanbanColumn } from "./kanban-column";
import {
  TASK_STATUSES,
  type TaskStatus,
  type TaskWithDetails,
} from "@/lib/types/database";

interface KanbanBoardProps {
  tasks: TaskWithDetails[];
  onStatusChange: (taskId: string, newStatus: TaskStatus) => void;
  onTaskClick: (task: TaskWithDetails) => void;
}

export function KanbanBoard({
  tasks,
  onStatusChange,
  onTaskClick,
}: KanbanBoardProps) {
  // Group tasks by status
  const groupedTasks: Record<TaskStatus, TaskWithDetails[]> = {
    direncanakan: [],
    dalam_pengerjaan: [],
    sedang_direview: [],
    pengujian: [],
    selesai: [],
  };

  tasks.forEach((task) => {
    const status = task.status || "direncanakan";
    if (groupedTasks[status]) {
      groupedTasks[status].push(task);
    }
  });

  function handleDragEnd(result: DropResult) {
    const { destination, source, draggableId } = result;

    // Dropped outside
    if (!destination) return;

    // Dropped in same place
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    // Status changed
    if (destination.droppableId !== source.droppableId) {
      const newStatus = destination.droppableId as TaskStatus;
      onStatusChange(draggableId, newStatus);
    }
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="kanban-board flex gap-4 overflow-x-auto pb-4 -mx-2 px-2">
        {TASK_STATUSES.map((status) => (
          <KanbanColumn
            key={status}
            status={status}
            tasks={groupedTasks[status]}
            onTaskClick={onTaskClick}
          />
        ))}
      </div>
    </DragDropContext>
  );
}
