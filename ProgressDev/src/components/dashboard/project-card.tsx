"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
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
import { deleteProject } from "@/app/actions/projects";
import { calculateProgress, formatDateRange } from "@/lib/utils";
import { toast } from "sonner";
import {
  Calendar,
  CheckCircle2,
  Clock,
  Copy,
  ExternalLink,
  Trash2,
  User,
} from "lucide-react";

interface ProjectCardProps {
  project: {
    id: string;
    platform_name: string;
    stakeholder_name: string;
    duration_start: string;
    duration_end: string;
    status: string;
    public_slug: string;
    tasks: {
      id: string;
      is_completed: boolean;
      checklist_items: { id: string; is_checked: boolean }[];
    }[];
  };
  onDeleted?: () => void;
}

const statusConfig: Record<string, { label: string; className: string }> = {
  draft: {
    label: "Draft",
    className: "bg-zinc-500/10 text-zinc-400 border-zinc-500/30",
  },
  active: {
    label: "Aktif",
    className: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
  },
  completed: {
    label: "Selesai",
    className: "bg-violet-500/10 text-violet-400 border-violet-500/30",
  },
};

export function ProjectCard({ project, onDeleted }: ProjectCardProps) {
  const progress = calculateProgress(project.tasks);
  const totalTasks = project.tasks.length;
  const completedTasks = project.tasks.filter((t) => t.is_completed).length;
  const statusInfo = statusConfig[project.status] || statusConfig.draft;

  async function handleCopyLink() {
    const url = `${window.location.origin}/project/${project.public_slug}`;
    await navigator.clipboard.writeText(url);
    toast.success("Link publik disalin!");
  }

  async function handleDelete() {
    const result = await deleteProject(project.id);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Proyek berhasil dihapus.");
      onDeleted?.();
    }
  }

  return (
    <Card className="group border-white/10 bg-card/60 backdrop-blur-sm hover:border-violet-500/30 hover:shadow-lg hover:shadow-violet-500/5 transition-all duration-300">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1 flex-1 min-w-0">
            <Link
              href={`/dashboard/project/${project.id}`}
              className="text-lg font-semibold hover:text-violet-400 transition-colors line-clamp-1"
            >
              {project.platform_name}
            </Link>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <User className="h-3.5 w-3.5" />
              <span className="truncate">{project.stakeholder_name}</span>
            </div>
          </div>
          <Badge variant="outline" className={statusInfo.className}>
            {project.status === "completed" ? (
              <CheckCircle2 className="mr-1 h-3 w-3" />
            ) : (
              <Clock className="mr-1 h-3 w-3" />
            )}
            {statusInfo.label}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium text-violet-400">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2 bg-white/5" />
          <p className="text-xs text-muted-foreground">
            {completedTasks}/{totalTasks} task selesai
          </p>
        </div>

        {/* Date */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Calendar className="h-3.5 w-3.5" />
          {formatDateRange(project.duration_start, project.duration_end)}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 pt-2 border-t border-white/5">
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-violet-400"
            onClick={handleCopyLink}
          >
            <Copy className="mr-1.5 h-3.5 w-3.5" />
            Copy Link
          </Button>
          <Link href={`/project/${project.public_slug}`} target="_blank">
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-emerald-400"
            >
              <ExternalLink className="mr-1.5 h-3.5 w-3.5" />
              Preview
            </Button>
          </Link>
          <div className="flex-1" />
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-red-400 hover:bg-red-500/10"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="border-white/10 bg-card/95 backdrop-blur-xl">
              <AlertDialogHeader>
                <AlertDialogTitle>Hapus Proyek?</AlertDialogTitle>
                <AlertDialogDescription>
                  Semua task, checklist, screenshot, dan komentar akan ikut
                  terhapus. Aksi ini tidak bisa dibatalkan.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="border-white/10">
                  Batal
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Hapus
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  );
}
