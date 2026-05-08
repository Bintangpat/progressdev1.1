"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { getProject } from "@/app/actions/projects";
import {
  createTask,
  deleteTask,
  updateTaskStatus,
  toggleChecklistItem,
  addChecklistItem,
  deleteChecklistItem,
  uploadScreenshot,
  deleteScreenshot,
} from "@/app/actions/tasks";
import { calculateProgress, formatDateRange } from "@/lib/utils";
import { KanbanBoard } from "@/components/dashboard/kanban-board";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import {
  ArrowLeft,
  Calendar,
  Check,
  CheckCircle2,
  Copy,
  ImagePlus,
  Loader2,
  MessageSquare,
  Plus,
  Square,
  Trash2,
  User,
  X,
} from "lucide-react";
import type {
  ProjectWithTasks,
  TaskStatus,
  TaskWithDetails,
} from "@/lib/types/database";
import { TASK_STATUS_CONFIG } from "@/lib/types/database";

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;
  const [project, setProject] = useState<ProjectWithTasks | null>(null);
  const [loading, setLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const [taskLoading, setTaskLoading] = useState(false);
  const [selectedTask, setSelectedTask] = useState<TaskWithDetails | null>(
    null,
  );
  const [detailOpen, setDetailOpen] = useState(false);
  const [newChecklistLabel, setNewChecklistLabel] = useState<
    Record<string, string>
  >({});

  const fetchProject = useCallback(async () => {
    const result = await getProject(projectId);
    if (result.data) {
      setProject(result.data as unknown as ProjectWithTasks);
    }
    setLoading(false);
  }, [projectId]);

  useEffect(() => {
    fetchProject();
  }, [fetchProject]);

  // Update selectedTask from fresh project data when project changes
  useEffect(() => {
    if (selectedTask && project) {
      const updatedTask = project.tasks.find((t) => t.id === selectedTask.id);
      if (updatedTask) {
        setSelectedTask(updatedTask);
      }
    }
  }, [project]);

  async function handleCreateTask(formData: FormData) {
    setTaskLoading(true);
    const result = await createTask(projectId, formData);
    setTaskLoading(false);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Task berhasil dibuat!");
      setCreateOpen(false);
      fetchProject();
    }
  }

  async function handleDeleteTask(taskId: string) {
    const result = await deleteTask(taskId, projectId);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Task dihapus.");
      setDetailOpen(false);
      setSelectedTask(null);
      fetchProject();
    }
  }

  async function handleStatusChange(taskId: string, newStatus: TaskStatus) {
    // Optimistic update
    setProject((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        tasks: prev.tasks.map((t) =>
          t.id === taskId
            ? { ...t, status: newStatus, is_completed: newStatus === "selesai" }
            : t,
        ),
      };
    });

    const result = await updateTaskStatus(taskId, newStatus, projectId);
    if (result.error) {
      toast.error(result.error);
      fetchProject(); // Revert on error
    }
  }

  async function handleToggleChecklist(itemId: string, checked: boolean) {
    const result = await toggleChecklistItem(itemId, checked, projectId);
    if (result.error) {
      toast.error(result.error);
    } else {
      fetchProject();
    }
  }

  async function handleAddChecklist(taskId: string) {
    const label = newChecklistLabel[taskId]?.trim();
    if (!label) return;
    const result = await addChecklistItem(taskId, label, projectId);
    if (result.error) {
      toast.error(result.error);
    } else {
      setNewChecklistLabel((prev) => ({ ...prev, [taskId]: "" }));
      fetchProject();
    }
  }

  async function handleDeleteChecklist(itemId: string) {
    const result = await deleteChecklistItem(itemId, projectId);
    if (result.error) {
      toast.error(result.error);
    } else {
      fetchProject();
    }
  }

  async function handleUploadScreenshot(taskId: string, file: File) {
    const formData = new FormData();
    formData.append("file", file);
    const result = await uploadScreenshot(taskId, projectId, formData);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Screenshot diupload!");
      fetchProject();
    }
  }

  async function handleDeleteScreenshot(
    screenshotId: string,
    imageUrl: string,
  ) {
    const result = await deleteScreenshot(screenshotId, imageUrl, projectId);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Screenshot dihapus.");
      fetchProject();
    }
  }

  async function handleCopyLink() {
    if (!project) return;
    const url = `${window.location.origin}/project/${project.public_slug}`;
    await navigator.clipboard.writeText(url);
    toast.success("Link publik disalin!");
  }

  function handleTaskClick(task: TaskWithDetails) {
    setSelectedTask(task);
    setDetailOpen(true);
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 rounded bg-white/5 animate-pulse" />
        <div className="h-40 rounded-xl border border-white/10 bg-card/30 animate-pulse" />
        <div className="flex gap-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="h-64 w-72 rounded-xl border border-white/10 bg-card/30 animate-pulse shrink-0"
            />
          ))}
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-semibold">Proyek tidak ditemukan</h2>
        <Button
          variant="link"
          onClick={() => router.push("/dashboard")}
          className="mt-4 text-violet-400"
        >
          Kembali ke Dashboard
        </Button>
      </div>
    );
  }

  const progress = calculateProgress(project.tasks);

  return (
    <div className="space-y-6">
      {/* Back button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => router.push("/dashboard")}
        className="text-muted-foreground hover:text-foreground -ml-2"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Dashboard
      </Button>

      {/* Project Header */}
      <Card className="border-white/10 bg-card/60 backdrop-blur-sm">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="space-y-2">
              <CardTitle className="text-2xl">
                {project.platform_name}
              </CardTitle>
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5" />
                  {project.stakeholder_name}
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" />
                  {formatDateRange(
                    project.duration_start,
                    project.duration_end,
                  )}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className={
                  project.status === "completed"
                    ? "bg-violet-500/10 text-violet-400 border-violet-500/30"
                    : project.status === "active"
                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                      : "bg-zinc-500/10 text-zinc-400 border-zinc-500/30"
                }
              >
                {project.status === "completed" && (
                  <CheckCircle2 className="mr-1 h-3 w-3" />
                )}
                {project.status === "completed"
                  ? "Selesai"
                  : project.status === "active"
                    ? "Aktif"
                    : "Draft"}
              </Badge>
              <Button
                variant="outline"
                size="sm"
                className="border-white/10"
                onClick={handleCopyLink}
              >
                <Copy className="mr-1.5 h-3.5 w-3.5" />
                Copy Link
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Overall Progress</span>
              <span className="font-semibold text-violet-400">{progress}%</span>
            </div>
            <Progress value={progress} className="h-3 bg-white/5" />
            <p className="text-xs text-muted-foreground">
              {project.tasks.filter((t) => t.is_completed).length}/
              {project.tasks.length} task selesai
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Task Section Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Kanban Board</h2>
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button
              size="sm"
              className="bg-linear-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500"
            >
              <Plus className="mr-1.5 h-3.5 w-3.5" />
              Tambah Task
            </Button>
          </DialogTrigger>
          <DialogContent className="border-white/10 bg-card/95 backdrop-blur-xl">
            <DialogHeader>
              <DialogTitle>Buat Task Baru</DialogTitle>
            </DialogHeader>
            <form action={handleCreateTask} className="space-y-4">
              <div className="space-y-2">
                <Label>Judul Task</Label>
                <Input
                  name="title"
                  placeholder="Implement Login Page"
                  required
                  className="bg-white/5 border-white/10"
                />
              </div>
              <div className="space-y-2">
                <Label>Deskripsi (opsional)</Label>
                <Textarea
                  name="description"
                  placeholder="Detail tentang task ini..."
                  className="bg-white/5 border-white/10 min-h-[80px]"
                />
              </div>
              <Button
                type="submit"
                disabled={taskLoading}
                className="w-full bg-linear-to-r from-violet-600 to-indigo-600"
              >
                {taskLoading && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Buat Task
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Kanban Board */}
      {project.tasks.length === 0 ? (
        <Card className="border-white/10 bg-card/30">
          <CardContent className="flex flex-col items-center py-10 text-center">
            <MessageSquare className="h-8 w-8 text-muted-foreground mb-3" />
            <p className="text-sm text-muted-foreground">
              Belum ada task. Klik &quot;Tambah Task&quot; untuk memulai.
            </p>
          </CardContent>
        </Card>
      ) : (
        <KanbanBoard
          tasks={project.tasks}
          onStatusChange={handleStatusChange}
          onTaskClick={handleTaskClick}
        />
      )}

      {/* Task Detail Dialog */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="border-white/10 bg-card/95 backdrop-blur-xl max-w-xl max-h-[85vh] overflow-y-auto">
          {selectedTask && (
            <>
              <DialogHeader>
                <div className="flex items-start justify-between gap-3">
                  <DialogTitle className="text-lg pr-4">
                    {selectedTask.title}
                  </DialogTitle>
                  <Badge
                    variant="outline"
                    className={`shrink-0 ${TASK_STATUS_CONFIG[selectedTask.status].bgColor} ${TASK_STATUS_CONFIG[selectedTask.status].color} ${TASK_STATUS_CONFIG[selectedTask.status].borderColor}`}
                  >
                    {TASK_STATUS_CONFIG[selectedTask.status].label}
                  </Badge>
                </div>
              </DialogHeader>

              <div className="space-y-5 mt-2">
                {/* Description */}
                {selectedTask.description && (
                  <p className="text-sm text-muted-foreground">
                    {selectedTask.description}
                  </p>
                )}

                {/* Progress */}
                {selectedTask.checklist_items.length > 0 &&
                  (() => {
                    const taskChecked = selectedTask.checklist_items.filter(
                      (c) => c.is_checked,
                    ).length;
                    const taskTotal = selectedTask.checklist_items.length;
                    const taskProgress = Math.round(
                      (taskChecked / taskTotal) * 100,
                    );
                    return (
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Progress</span>
                          <span>{taskProgress}%</span>
                        </div>
                        <Progress
                          value={taskProgress}
                          className="h-1.5 bg-white/5"
                        />
                      </div>
                    );
                  })()}

                {/* Checklist */}
                <div className="space-y-2">
                  <p className="text-sm font-medium">Checklist</p>
                  {selectedTask.checklist_items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-3 group/item"
                    >
                      <button
                        onClick={() =>
                          handleToggleChecklist(item.id, !item.is_checked)
                        }
                        className="shrink-0"
                      >
                        {item.is_checked ? (
                          <Check className="h-4 w-4 text-emerald-400" />
                        ) : (
                          <Square className="h-4 w-4 text-muted-foreground hover:text-violet-400" />
                        )}
                      </button>
                      <span
                        className={`text-sm flex-1 ${item.is_checked ? "line-through text-muted-foreground" : ""}`}
                      >
                        {item.label}
                      </span>
                      <button
                        onClick={() => handleDeleteChecklist(item.id)}
                        className="opacity-0 group-hover/item:opacity-100 text-muted-foreground hover:text-red-400 transition-opacity"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                  {/* Add checklist */}
                  <div className="flex items-center gap-2 mt-2">
                    <Input
                      placeholder="Tambah checklist..."
                      value={newChecklistLabel[selectedTask.id] || ""}
                      onChange={(e) =>
                        setNewChecklistLabel((prev) => ({
                          ...prev,
                          [selectedTask.id]: e.target.value,
                        }))
                      }
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddChecklist(selectedTask.id);
                        }
                      }}
                      className="h-8 text-sm bg-white/5 border-white/10"
                    />
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleAddChecklist(selectedTask.id)}
                      className="shrink-0 h-8 px-2"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>

                <Separator className="bg-white/5" />

                {/* Screenshots */}
                <div className="space-y-3">
                  <p className="text-sm font-medium">Screenshots</p>
                  {selectedTask.task_screenshots.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {selectedTask.task_screenshots.map((ss) => (
                        <div
                          key={ss.id}
                          className="relative group/ss rounded-lg overflow-hidden border border-white/10"
                        >
                          <img
                            src={ss.image_url}
                            alt="Screenshot"
                            className="w-full h-32 object-cover"
                          />
                          <button
                            onClick={() =>
                              handleDeleteScreenshot(ss.id, ss.image_url)
                            }
                            className="absolute top-1.5 right-1.5 p-1 rounded bg-black/60 text-white opacity-0 group-hover/ss:opacity-100 transition-opacity hover:bg-red-600"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  <label className="flex items-center justify-center gap-2 p-3 rounded-lg border border-dashed border-white/10 hover:border-violet-500/30 cursor-pointer text-sm text-muted-foreground hover:text-violet-400 transition-colors">
                    <ImagePlus className="h-4 w-4" />
                    Upload Screenshot
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleUploadScreenshot(selectedTask.id, file);
                          e.target.value = "";
                        }
                      }}
                    />
                  </label>
                </div>

                <Separator className="bg-white/5" />

                {/* Delete Task */}
                <div className="flex justify-end">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                      >
                        <Trash2 className="mr-1.5 h-3.5 w-3.5" />
                        Hapus Task
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="border-white/10 bg-card/95 backdrop-blur-xl">
                      <AlertDialogHeader>
                        <AlertDialogTitle>Hapus Task?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Semua checklist dan screenshot dalam task ini akan
                          ikut terhapus.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="border-white/10">
                          Batal
                        </AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDeleteTask(selectedTask.id)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Hapus
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
