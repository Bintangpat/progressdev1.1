"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { getPublicProject } from "@/app/actions/public";
import { calculateProgress, formatDateRange, whatsappLink } from "@/lib/utils";
import { CommentSection } from "@/components/comments/comment-section";
import { ThemeToggle } from "@/components/theme-toggle";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Activity,
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  ExternalLink,
  MessageSquare,
  Phone,
  Square,
  User,
} from "lucide-react";
import type { ProjectWithTasks } from "@/lib/types/database";
import { TASK_STATUS_CONFIG } from "@/lib/types/database";

export default function PublicProjectPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [project, setProject] = useState<ProjectWithTasks | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const fetchProject = useCallback(async () => {
    const result = await getPublicProject(slug);
    if (result.error || !result.data) {
      setNotFound(true);
    } else {
      setProject(result.data as unknown as ProjectWithTasks);
    }
    setLoading(false);
  }, [slug]);

  useEffect(() => {
    fetchProject();
  }, [fetchProject]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse space-y-4 w-full max-w-3xl px-6">
          <div className="h-10 w-64 rounded bg-white/5" />
          <div className="h-48 rounded-xl border border-white/10 bg-card/30" />
          <div className="h-32 rounded-xl border border-white/10 bg-card/30" />
        </div>
      </div>
    );
  }

  if (notFound || !project) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="p-4 rounded-2xl bg-red-500/10 mx-auto w-fit">
            <ExternalLink className="h-8 w-8 text-red-400" />
          </div>
          <h1 className="text-2xl font-bold">Proyek Tidak Ditemukan</h1>
          <p className="text-muted-foreground">
            Link yang Anda buka tidak valid atau proyek telah dihapus.
          </p>
        </div>
      </div>
    );
  }

  const progress = calculateProgress(project.tasks);
  const totalTasks = project.tasks.length;
  const completedTasks = project.tasks.filter((t) => t.is_completed).length;
  const statusCounts = project.tasks.reduce(
    (acc, t) => {
      const status = t.status || "direncanakan";
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );
  const allChecklist = project.tasks.flatMap((t) => t.checklist_items);
  const totalChecklist = allChecklist.length;
  const checkedChecklist = allChecklist.filter((c) => c.is_checked).length;

  return (
    <div className="min-h-screen bg-background">
      {/* Background */}
      <div className="fixed inset-0 bg-linear-to-br from-violet-950/30 via-background to-indigo-950/30 -z-10" />

      {/* Header */}
      <header className="border-b border-white/10 bg-card/50 backdrop-blur-xl">
        <div className="max-w-3xl mx-auto px-6 py-5 flex items-center gap-3">
          <div className="p-1.5 rounded-lg bg-linear-to-br from-violet-500 to-indigo-600 shadow-lg shadow-violet-500/20">
            <Activity className="h-4 w-4 text-white" />
          </div>
          <span className="font-bold bg-linear-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
            DevProgress
          </span>
          <div className="flex-1" />
          <ThemeToggle />
          <button
            className="w-fit h-fit px-4 py-2 bg-foreground text-background rounded-lg hover:bg-foreground/80 transition-colors cursor-pointer"
            onClick={() => window.location.reload()}
          >
            Fetch Data
          </button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-8 space-y-8">
        {/* Project Info */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                {project.platform_name}
              </h1>
              <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-muted-foreground">
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
            <Badge
              variant="outline"
              className={
                project.status === "completed"
                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                  : "bg-amber-500/10 text-amber-400 border-amber-500/30"
              }
            >
              {project.status === "completed" ? (
                <CheckCircle2 className="mr-1 h-3 w-3" />
              ) : (
                <Clock className="mr-1 h-3 w-3" />
              )}
              {project.status === "completed" ? "Selesai" : "Dalam Pengerjaan"}
            </Badge>
          </div>

          {/* Progress Card */}
          <Card className="border-white/10 bg-card/60 backdrop-blur-sm">
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Overall Progress
                </span>
                <span className="text-2xl font-bold text-violet-400">
                  {progress}%
                </span>
              </div>
              <Progress value={progress} className="h-3 bg-white/5" />
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="rounded-lg bg-white/3 p-3">
                  <p className="text-lg font-semibold">
                    {completedTasks}/{totalTasks}
                  </p>
                  <p className="text-xs text-muted-foreground">Task Selesai</p>
                </div>
                <div className="rounded-lg bg-white/3 p-3">
                  <p className="text-lg font-semibold">
                    {checkedChecklist}/{totalChecklist}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Checklist Selesai
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tasks */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-violet-400" />
            Task Progress
          </h2>

          {project.tasks.length === 0 ? (
            <Card className="border-white/10 bg-card/30">
              <CardContent className="py-10 text-center text-sm text-muted-foreground">
                Belum ada task untuk proyek ini.
              </CardContent>
            </Card>
          ) : (
            <Accordion type="multiple" className="space-y-3">
              {project.tasks.map((task, index) => {
                const taskChecked = task.checklist_items.filter(
                  (c) => c.is_checked,
                ).length;
                const taskTotal = task.checklist_items.length;

                return (
                  <AccordionItem
                    key={task.id}
                    value={task.id}
                    className="rounded-xl border border-white/10 bg-card/50 backdrop-blur-sm px-0 overflow-hidden"
                  >
                    <AccordionTrigger className="px-5 py-4 hover:no-underline hover:bg-white/2">
                      <div className="flex items-center gap-3 flex-1 text-left">
                        <span className="h-7 w-7 rounded-full bg-violet-500/10 flex items-center justify-center text-xs font-medium text-violet-400 shrink-0">
                          {index + 1}
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span
                              className={`font-medium ${task.is_completed ? "line-through text-muted-foreground" : ""}`}
                            >
                              {task.title}
                            </span>
                            {(() => {
                              const status = task.status || "direncanakan";
                              const config = TASK_STATUS_CONFIG[status];
                              return (
                                <span
                                  className={`inline-flex items-center text-[10px] font-medium px-1.5 py-0.5 rounded-full ${config.bgColor} ${config.color} ${config.borderColor} border`}
                                >
                                  {config.label}
                                </span>
                              );
                            })()}
                          </div>
                          {taskTotal > 0 && (
                            <span className="ml-0 text-xs text-muted-foreground">
                              ({taskChecked}/{taskTotal})
                            </span>
                          )}
                        </div>
                        {task.is_completed && (
                          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                        )}
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-5 pb-5">
                      <div className="space-y-4 ml-10">
                        {task.description && (
                          <p className="text-sm text-muted-foreground">
                            {task.description}
                          </p>
                        )}

                        {/* Checklist */}
                        {task.checklist_items.length > 0 && (
                          <div className="space-y-2">
                            {task.checklist_items.map((item) => (
                              <div
                                key={item.id}
                                className="flex items-center gap-3"
                              >
                                {item.is_checked ? (
                                  <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                                ) : (
                                  <Square className="h-4 w-4 text-muted-foreground shrink-0" />
                                )}
                                <span
                                  className={`text-sm ${item.is_checked ? "line-through text-muted-foreground" : ""}`}
                                >
                                  {item.label}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Screenshots */}
                        {task.task_screenshots.length > 0 && (
                          <div className="grid grid-cols-2 gap-3 mt-3">
                            {task.task_screenshots.map((ss) => (
                              <a
                                key={ss.id}
                                href={ss.image_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="rounded-lg overflow-hidden border border-white/10 hover:border-violet-500/30 transition-colors"
                              >
                                <img
                                  src={ss.image_url}
                                  alt="Screenshot"
                                  className="w-full h-32 object-cover hover:scale-105 transition-transform duration-300"
                                />
                              </a>
                            ))}
                          </div>
                        )}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          )}
        </div>

        <Separator className="bg-white/5" />

        {/* Comments */}
        <CommentSection projectId={project.id} />

        <Separator className="bg-white/5" />

        {/* WhatsApp Button */}
        <div className="flex justify-center py-4">
          <a
            href={whatsappLink(
              project.developer_whatsapp,
              project.platform_name,
            )}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button
              size="lg"
              className="bg-linear-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 shadow-lg shadow-emerald-500/20 text-base px-8"
            >
              <Phone className="mr-2 h-5 w-5" />
              Hubungi Developer via WhatsApp
            </Button>
          </a>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-card/30 mt-8">
        <div className="max-w-3xl mx-auto px-6 py-5 text-center">
          <p className="text-xs text-muted-foreground">
            Powered by{" "}
            <span className="font-medium text-foreground">DevProgress</span>
          </p>
        </div>
      </footer>
    </div>
  );
}
