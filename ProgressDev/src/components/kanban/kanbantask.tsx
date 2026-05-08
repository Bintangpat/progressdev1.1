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
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Bell,
  Moon,
  Plus,
  Filter,
  MoreHorizontal,
  Link as LinkIcon,
  MessageSquare,
  CheckCircle2,
} from "lucide-react";

// --- Types ---
interface Task {
  id: string;
  title: string;
  description: string;
  priority: "High" | "Medium" | "Low";
  progress: number;
  assignees: string[];
  comments: number;
  links: number;
}

interface Column {
  id: string;
  title: string;
  tasks: Task[];
}

// --- Mock Data ---
const INITIAL_COLUMNS: Column[] = [
  {
    id: "backlog",
    title: "Direncanakan",
    tasks: [
      {
        id: "1",
        title: "Integrate Stripe payment",
        description: "Compile competitor landing page...",
        priority: "High",
        progress: 10,
        assignees: ["/u1.jpg", "/u2.jpg"],
        comments: 4,
        links: 2,
      },
      {
        id: "2",
        title: "Redesign marketing homepage",
        description: "Focus on conversion rate...",
        priority: "Medium",
        progress: 0,
        assignees: ["/u3.jpg"],
        comments: 1,
        links: 1,
      },
    ],
  },
  {
    id: "in-progress",
    title: "Dikerjakan",
    tasks: [
      {
        id: "3",
        title: "Dark mode toggle",
        description: "Using Tailwind CSS implementation",
        priority: "High",
        progress: 40,
        assignees: ["/u4.jpg"],
        comments: 6,
        links: 2,
      },
    ],
  },
  { id: "review", title: "Review", tasks: [] },
  { id: "done", title: "Selesai", tasks: [] },
];

// --- Sub-Components ---

const TaskCard = ({
  task,
  isOverlay = false,
}: {
  task: Task;
  isOverlay?: boolean;
}) => {
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

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`bg-white p-5 rounded-lg border border-slate-200 shadow-sm transition-shadow cursor-grab active:cursor-grabbing ${
        !isOverlay
          ? "hover:shadow-md"
          : "shadow-xl rotate-3 scale-105 border-brand-primary"
      }`}
    >
      <h4 className="font-bold text-slate-800 mb-2 leading-tight">
        {task.title}
      </h4>
      <p className="text-xs text-slate-500 mb-6 line-clamp-2">
        {task.description}
      </p>

      <div className="flex items-center justify-between mb-4">
        <div className="flex -space-x-1.5">
          {task.assignees.map((src, i) => (
            <div
              key={i}
              className="w-7 h-7 rounded-full border-2 border-white bg-slate-200 overflow-hidden"
            />
          ))}
        </div>
        <div className="flex items-center space-x-1 text-slate-400 bg-slate-50 px-2 py-1 rounded-full border border-slate-100">
          <div
            className={`w-3 h-3 rounded-full border-2 ${task.progress === 100 ? "border-green-500" : "border-slate-300 border-t-blue-600 animate-spin"}`}
          />
          <span className="text-[10px] font-bold">{task.progress}%</span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-slate-100">
        <span
          className={`px-3 py-1 rounded text-[10px] font-bold ${
            task.priority === "High"
              ? "bg-red-50 text-red-600"
              : "bg-slate-100 text-slate-600"
          }`}
        >
          {task.priority}
        </span>
        <div className="flex items-center space-x-3 text-slate-400">
          <span className="flex items-center text-[10px] font-medium">
            <LinkIcon size={12} className="mr-1" /> {task.links}
          </span>
          <span className="flex items-center text-[10px] font-medium">
            <MessageSquare size={12} className="mr-1" /> {task.comments}
          </span>
        </div>
      </div>
    </div>
  );
};

const KanbanColumn = ({ column }: { column: Column }) => {
  return (
    <section className="shrink-0 w-80 flex flex-col">
      <div className="flex items-center justify-between mb-4 px-1">
        <div className="flex items-center space-x-2">
          <h3 className="font-semibold text-slate-800">{column.title}</h3>
          <span className="px-2 py-0.5 bg-slate-200 text-slate-600 rounded text-xs font-bold">
            {column.tasks.length}
          </span>
        </div>
        <div className="flex items-center space-x-2 text-slate-400">
          <button className="hover:text-slate-600">
            <MoreHorizontal size={18} />
          </button>
          <button className="hover:text-slate-600">
            <Plus size={18} />
          </button>
        </div>
      </div>

      <div className="bg-slate-100/50 p-2 rounded-xl flex-1">
        <SortableContext
          items={column.tasks.map((t) => t.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-4 min-h-[150px]">
            <AnimatePresence>
              {column.tasks.map((task) => (
                <motion.div
                  key={task.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                >
                  <TaskCard task={task} />
                </motion.div>
              ))}
            </AnimatePresence>
            {column.tasks.length === 0 && (
              <div className="h-32 border-2 border-dashed border-slate-200 rounded-lg flex items-center justify-center text-slate-400 text-xs">
                Drop tasks here
              </div>
            )}
          </div>
        </SortableContext>
      </div>
    </section>
  );
};

// --- Main Page ---

export default function KanbanBoard() {
  const [columns, setColumns] = useState<Column[]>(INITIAL_COLUMNS);
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragStart = (event: any) => {
    const { active } = event;
    const task = columns
      .flatMap((c) => c.tasks)
      .find((t) => t.id === active.id);
    setActiveTask(task || null);
  };

  const handleDragOver = (event: any) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    const activeColumn = columns.find((col) =>
      col.tasks.some((t) => t.id === activeId),
    );
    const overColumn = columns.find(
      (col) => col.id === overId || col.tasks.some((t) => t.id === overId),
    );

    if (!activeColumn || !overColumn || activeColumn === overColumn) return;

    setColumns((prev) => {
      const activeTasks = [...activeColumn.tasks];
      const overTasks = [...overColumn.tasks];
      const taskIndex = activeTasks.findIndex((t) => t.id === activeId);
      const [movedTask] = activeTasks.splice(taskIndex, 1);

      // Tentukan posisi sisip
      const isOverColumn = overColumn.id === overId;
      const overIndex = isOverColumn
        ? overTasks.length
        : overTasks.findIndex((t) => t.id === overId);
      overTasks.splice(overIndex, 0, movedTask);

      return prev.map((col) => {
        if (col.id === activeColumn.id) return { ...col, tasks: activeTasks };
        if (col.id === overColumn.id) return { ...col, tasks: overTasks };
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
      col.tasks.some((t) => t.id === activeId),
    );
    if (!activeColumn) return;

    if (activeId !== overId) {
      setColumns((prev) =>
        prev.map((col) => {
          if (col.id === activeColumn.id) {
            const oldIndex = col.tasks.findIndex((t) => t.id === activeId);
            const newIndex = col.tasks.findIndex((t) => t.id === overId);
            return { ...col, tasks: arrayMove(col.tasks, oldIndex, newIndex) };
          }
          return col;
        }),
      );
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      {/* Sidebar - Static as per original */}
      <aside className="w-16 flex flex-col items-center py-4 bg-white border-r border-slate-200">
        <div className="w-10 h-10 bg-slate-900 rounded-lg flex items-center justify-center text-white font-bold mb-8">
          DP
        </div>
        <nav className="space-y-6 text-slate-400">
          <Plus className="cursor-pointer hover:text-slate-900" />
          <Search className="cursor-pointer hover:text-slate-900" />
          <Filter className="cursor-pointer hover:text-slate-900" />
        </nav>
      </aside>

      <main className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8">
          <div className="relative w-72">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={16}
            />
            <input
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border-none rounded-lg text-sm focus:ring-1 focus:ring-slate-200"
              placeholder="Search tasks..."
            />
          </div>
          <div className="flex items-center space-x-4">
            <button className="p-2 text-slate-400 hover:bg-slate-50 rounded-full">
              <Bell size={20} />
            </button>
            <div className="w-8 h-8 rounded-full bg-slate-200 border border-slate-300" />
          </div>
        </header>

        {/* Board Area */}
        <div className="p-8 flex-1 overflow-hidden flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-bold text-slate-800">Kanban Board</h1>
            <button className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center">
              <Plus size={16} className="mr-2" /> Add Task
            </button>
          </div>

          <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
          >
            <div className="flex space-x-6 overflow-x-auto pb-4 flex-1 custom-scrollbar">
              {columns.map((col) => (
                <KanbanColumn key={col.id} column={col} />
              ))}
            </div>

            <DragOverlay
              dropAnimation={{
                sideEffects: defaultDropAnimationSideEffects({
                  styles: { active: { opacity: "0.5" } },
                }),
              }}
            >
              {activeTask ? <TaskCard task={activeTask} isOverlay /> : null}
            </DragOverlay>
          </DndContext>
        </div>
      </main>
    </div>
  );
}
