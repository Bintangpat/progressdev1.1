"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Search, Folder, ArrowLeft, Loader2, AlertCircle } from "lucide-react";

import { KanbanBoard } from "@/components/kanban/board";
import { TaskDialog } from "@/components/kanban/task-dialog";
import { SearchFilters } from "@/components/kanban/search-filters";
import { SubTabNav } from "@/components/kanban/sub-tab-nav";
import {
  ApiTask,
  projectsApi,
  tasksApi,
  checklistsApi,
  CreateTaskPayload,
  UpdateTaskPayload,
} from "@/lib/api";
import { TaskStatus } from "@/lib/types/database";
import { toast } from "sonner";
import { Column } from "@/components/kanban/column";

const DEFAULT_COLUMNS: Column[] = [
  { id: "direncanakan", title: "Direncanakan", cards: [] },
  { id: "dalam_pengerjaan", title: "Dalam Pengerjaan", cards: [] },
  { id: "sedang_direview", title: "Sedang Direview", cards: [] },
  { id: "pengujian", title: "Pengujian", cards: [] },
  { id: "selesai", title: "Selesai", cards: [] },
];

export default function KanbanPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params?.id as string;

  // ── State ──
  const [columns, setColumns] = useState<Column[]>(DEFAULT_COLUMNS);
  const [projectName, setProjectName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | "none">("none");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"create" | "edit" | "delete">(
    "create",
  );
  const [selectedTask, setSelectedTask] = useState<ApiTask | null>(null);
  const [selectedColumnId, setSelectedColumnId] = useState<
    TaskStatus | undefined
  >();

  // ── Fetch Data ──
  const fetchProjectData = useCallback(async () => {
    if (!projectId) return;
    setIsLoading(true);
    setError(null);
    try {
      const project = await projectsApi.getOne(projectId);
      setProjectName(project.platformName);

      // Kelompokkan task berdasarkan status
      const newCols = DEFAULT_COLUMNS.map((col) => ({
        ...col,
        cards:
          project.tasks
            ?.filter((t) => t.status === col.id)
            .sort((a, b) => a.orderIndex - b.orderIndex) || [],
      }));
      setColumns(newCols);
    } catch (err: any) {
      setError(err.message || "Gagal memuat task board");
      toast.error("Gagal memuat task board");
    } finally {
      setIsLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchProjectData();
  }, [fetchProjectData]);

  // ── Filter Data ──
  const filteredColumns = columns.map((col) => {
    let filteredCards = col.cards.filter((card) => {
      const matchesSearch =
        card.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (card.description &&
          card.description.toLowerCase().includes(searchQuery.toLowerCase()));
      // We don't have priority in ApiTask yet, so priority filter is a placeholder
      return matchesSearch;
    });

    if (sortOrder === "asc") {
      filteredCards.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortOrder === "desc") {
      filteredCards.sort((a, b) => b.title.localeCompare(a.title));
    }

    return { ...col, cards: filteredCards };
  });

  // ── Handlers ──
  const handleAddTask = (columnId: TaskStatus) => {
    setSelectedColumnId(columnId);
    setSelectedTask(null);
    setDialogMode("create");
    setDialogOpen(true);
  };

  const handleEditTask = (task: ApiTask) => {
    setSelectedTask(task);
    setDialogMode("edit");
    setDialogOpen(true);
  };

  const handleDeleteTask = (id: string) => {
    // Find task
    const task = columns.flatMap((c) => c.cards).find((t) => t.id === id);
    if (task) {
      setSelectedTask(task);
      setDialogMode("delete");
      setDialogOpen(true);
    }
  };

  const handleDialogSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      if (dialogMode === "create") {
        const payload: CreateTaskPayload = {
          projectId,
          title: data.title,
          description: data.description,
        };
        // the API currently doesn't let us pass status in CreateTaskPayload
        // It uses "direncanakan" by default based on backend defaults.
        // We'll update the status right after creation if needed.
        let newTask = await tasksApi.create(payload);

        if (data.status !== "direncanakan") {
          newTask = await tasksApi.update(newTask.id, {
            status: data.status,
            isCompleted: data.status === "selesai",
          });
        }

        newTask.checklists = [];
        if (data.checklists && data.checklists.length > 0) {
          for (const item of data.checklists) {
            let createdCl = await checklistsApi.create(newTask.id, item.label);
            if (item.isChecked) {
              createdCl = await checklistsApi.update(createdCl.id, {
                isChecked: true,
              });
            }
            newTask.checklists.push(createdCl);
          }
        }

        // update local state
        setColumns((prev) =>
          prev.map((col) =>
            col.id === newTask.status
              ? { ...col, cards: [...col.cards, newTask] }
              : col,
          ),
        );
        toast.success("Task berhasil dibuat");
      } else if (dialogMode === "edit" && selectedTask) {
        const payload: UpdateTaskPayload = {
          title: data.title,
          description: data.description,
          status: data.status,
          isCompleted: data.isCompleted,
        };
        const updatedTask = await tasksApi.update(selectedTask.id, payload);
        updatedTask.checklists = selectedTask.checklists || [];

        if (data.checklists) {
          const incomingIds = data.checklists
            .map((c: any) => c.id)
            .filter(Boolean);

          for (const existingCl of updatedTask.checklists) {
            if (!incomingIds.includes(existingCl.id)) {
              await checklistsApi.delete(existingCl.id);
            }
          }

          const newChecklists = [];
          for (const item of data.checklists) {
            if (item.id) {
              const updatedCl = await checklistsApi.update(item.id, {
                label: item.label,
                isChecked: item.isChecked,
              });
              newChecklists.push(updatedCl);
            } else {
              let createdCl = await checklistsApi.create(
                updatedTask.id,
                item.label,
              );
              if (item.isChecked) {
                createdCl = await checklistsApi.update(createdCl.id, {
                  isChecked: true,
                });
              }
              newChecklists.push(createdCl);
            }
          }
          updatedTask.checklists = newChecklists;
        }

        setColumns((prev) => {
          // hapus dari kolom lama
          const newCols = prev.map((col) => ({
            ...col,
            cards: col.cards.filter((t) => t.id !== updatedTask.id),
          }));
          // tambahkan ke kolom baru
          const targetCol = newCols.find((c) => c.id === updatedTask.status);
          if (targetCol) {
            targetCol.cards.push(updatedTask);
          }
          return newCols;
        });
        toast.success("Task berhasil diperbarui");
      }
      setDialogOpen(false);
    } catch (err: any) {
      toast.error(err.message || "Gagal menyimpan task");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmDelete = async (id: string) => {
    setIsSubmitting(true);
    try {
      await tasksApi.delete(id);
      setColumns((prev) =>
        prev.map((col) => ({
          ...col,
          cards: col.cards.filter((t) => t.id !== id),
        })),
      );
      toast.success("Task berhasil dihapus");
      setDialogOpen(false);
    } catch (err: any) {
      toast.error(err.message || "Gagal menghapus task");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTaskMove = async (
    taskId: string,
    newStatus: TaskStatus,
    newOrderIndex: number,
  ) => {
    try {
      await tasksApi.update(taskId, {
        status: newStatus,
        orderIndex: newOrderIndex,
        isCompleted: newStatus === "selesai",
      });
    } catch (err: any) {
      toast.error("Gagal menyimpan posisi task ke server");
      // Optional: rollback state locally if needed
    }
  };

  return (
    <div className="bg-[#131313] text-[#e5e2e1] h-screen flex flex-col font-sans antialiased overflow-hidden">
      {/* ── TOP APP BAR ── */}
      <header className="w-full h-16 border-b border-[#444749]/30 bg-[#131313] flex items-center justify-between px-6 shrink-0 z-40">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="size-8 rounded bg-[#201f1f] flex items-center justify-center border border-[#444749]/40 hover:border-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="text-white size-4" />
          </button>
          {isLoading ? (
            <div className="h-4 w-32 bg-[#2a2a2a] animate-pulse rounded" />
          ) : (
            <div className="flex items-center gap-2">
              <div className="size-8 rounded bg-[#201f1f] items-center justify-center border border-[#444749]/40 hidden md:flex">
                <Folder className="text-white size-4" />
              </div>
              <div>
                <h1 className="text-sm font-semibold text-white tracking-wide">
                  {projectName || "Project"}
                </h1>
                <p className="text-[10px] text-[#c4c7c9]/60 leading-tight">
                  Board View
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          <div className="relative hidden md:block w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#c4c7c9] size-3.5" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#1c1b1b] border border-[#333333] text-white text-xs rounded-md pl-8 pr-4 py-1.5 focus:outline-none focus:border-white transition-all"
            />
          </div>
        </div>
      </header>

      {/* ── SUB-NAV TABS ── */}
      <SubTabNav activeTab="Board" />

      {/* ── MAIN BOARD AREA ── */}
      <main className="flex-1 overflow-hidden flex flex-col">
        {/* Board Header Options */}
        <div className="px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#444749]/15 shrink-0 bg-[#131313]">
          <SearchFilters
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            priorityFilter={priorityFilter}
            setPriorityFilter={setPriorityFilter}
            sortOrder={sortOrder}
            setSortOrder={setSortOrder}
          />

          <button
            onClick={() => handleAddTask("direncanakan")}
            className="bg-white text-black text-xs font-semibold px-4 py-2 rounded hover:bg-white/90 transition-colors shadow-sm cursor-pointer"
          >
            + Create New Task
          </button>
        </div>

        {/* Board Horizontal Scroll Area */}
        <div className="flex-1 overflow-hidden">
          <div className=" inset-0 overflow-x-auto scrollbar-thin scrollbar-thumb-[#333333] scrollbar-track-transparent">
            {isLoading ? (
              <div className="flex gap-6 h-full pb-4">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="flex flex-col h-full bg-[#1A1A1A] rounded-2xl border border-[#333333] w-80 md:w-[340px] shrink-0 p-4 gap-4 animate-pulse"
                  >
                    <div className="h-5 bg-[#2a2a2a] rounded w-1/2" />
                    <div className="h-24 bg-[#2a2a2a] rounded-xl" />
                    <div className="h-32 bg-[#2a2a2a] rounded-xl" />
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center h-full gap-4">
                <AlertCircle className="size-10 text-red-400" />
                <p className="text-[#c4c7c9] text-sm">{error}</p>
                <button
                  onClick={fetchProjectData}
                  className="px-4 py-2 bg-[#2a2a2a] text-white rounded text-sm hover:bg-[#353434] transition-colors cursor-pointer"
                >
                  Coba Lagi
                </button>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="h-full"
              >
                <KanbanBoard
                  columns={filteredColumns}
                  setColumns={setColumns}
                  onAddTask={handleAddTask}
                  onEditTask={handleEditTask}
                  onDeleteTask={handleDeleteTask}
                  onTaskMove={handleTaskMove}
                />
              </motion.div>
            )}
          </div>
        </div>
      </main>

      {/* ── Dialog Create/Edit/Delete Task ── */}
      <TaskDialog
        isOpen={dialogOpen}
        onClose={() => setDialogOpen(false)}
        mode={dialogMode}
        task={selectedTask}
        columnId={selectedColumnId}
        columns={DEFAULT_COLUMNS}
        isLoading={isSubmitting}
        onSubmit={handleDialogSubmit}
        onConfirmDelete={handleConfirmDelete}
      />
    </div>
  );
}
