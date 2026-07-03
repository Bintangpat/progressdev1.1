"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Folder,
  Calendar,
  DollarSign,
  Clock,
  Loader2,
  ChevronRight,
  ArrowLeft,
  PlusCircle,
} from "lucide-react";
import { projectsApi, briefsApi, ApiProject } from "@/lib/api";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();

  const [project, setProject] = useState<ApiProject | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmittingBrief, setIsSubmittingBrief] = useState(false);

  // Form states for Request Briefing
  const [briefType, setBriefType] = useState("Executive Summary");
  const [preferredDate, setPreferredDate] = useState("");
  const [preferredTime, setPreferredTime] = useState("");
  const [objectives, setObjectives] = useState("");

  const fetchProjectDetails = async () => {
    try {
      const slug = params.project as string;
      const baseProject = await projectsApi.getBySlug(slug);
      const fullProject = await projectsApi.getOne(baseProject.id);
      setProject(fullProject);
    } catch (err) {
      console.error("Failed to load project details:", err);
      toast.error("Failed to load project details");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (params.project) {
      fetchProjectDetails();
    }
  }, [params.project]);

  const handleBriefSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!project || !preferredDate || !preferredTime) {
      toast.error("Please fill in preferred date and time");
      return;
    }

    setIsSubmittingBrief(true);
    try {
      await briefsApi.create(project.id, {
        type: briefType,
        preferredDate: new Date(preferredDate).toISOString(),
        preferredTime: preferredTime,
        objectives,
      });
      toast.success("Briefing scheduled successfully");
      setIsDialogOpen(false);

      // Reset form fields
      setPreferredDate("");
      setPreferredTime("");
      setObjectives("");

      // Refresh project to show new brief in history
      fetchProjectDetails();
    } catch (err: any) {
      toast.error(err?.message || "Failed to schedule briefing");
    } finally {
      setIsSubmittingBrief(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
            Active
          </span>
        );
      case "completed":
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-[#0058be]/5 text-[#0058be] border border-[#0058be]/20">
            Completed
          </span>
        );
      case "draft":
      default:
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-slate-50 text-slate-600 border border-slate-200">
            Draft
          </span>
        );
    }
  };

  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(num);
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("id-ID", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-3 bg-[#f8f9ff]">
        <Loader2 className="w-10 h-10 animate-spin text-[#0058be]" />
        <span className="text-sm text-[#75777d] font-semibold">Loading project details...</span>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4 bg-[#f8f9ff]">
        <h2 className="text-xl font-bold">Project not found</h2>
        <Link href="/stakeholder/projects">
          <Button variant="outline">Back to Projects</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9ff] text-[#0b1c30] font-sans selection:bg-[#0058be]/20">
      <main className="w-full p-8 md:p-12 max-w-7xl mx-auto relative overflow-hidden">
        {/* Background Graphic */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#0058be]/5 rounded-full blur-3xl pointer-events-none"></div>

        {/* Back Link & Header */}
        <header className="mb-8">
          <Link
            href="/stakeholder/projects"
            className="flex items-center gap-1.5 text-sm font-semibold text-[#75777d] hover:text-[#0058be] transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Projects</span>
          </Link>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-[32px] font-bold text-[#091426] tracking-tight">
                  {project.platformName}
                </h1>
                {getStatusBadge(project.status)}
              </div>
              <p className="text-foreground text-[14px] mt-1">
                Stakeholder: <span className="font-semibold">{project.stakeholderName}</span>
              </p>
            </div>

            {/* Request Briefing Dialog Button */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-[#0058be] hover:bg-[#0058be]/90 font-bold px-6 py-3 h-auto cursor-pointer shadow-lg shadow-[#0058be]/20">
                  <PlusCircle className="mr-2 h-4 w-4" /> Request Briefing
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleBriefSubmit}>
                  <DialogHeader>
                    <DialogTitle>Request Project Briefing</DialogTitle>
                    <DialogDescription>
                      Schedule a sprint review, technical deep-dive, or budget overview.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="briefType" className="text-right">Type</Label>
                      <div className="col-span-3">
                        <Select value={briefType} onValueChange={setBriefType}>
                          <SelectTrigger className="w-full">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Executive Summary">Executive Summary</SelectItem>
                            <SelectItem value="Technical Deep-dive">Technical Deep-dive</SelectItem>
                            <SelectItem value="Budget & Timeline Review">Budget & Timeline Review</SelectItem>
                            <SelectItem value="Risk Assessment Briefing">Risk Assessment Briefing</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="prefDate" className="text-right">Date</Label>
                      <Input
                        id="prefDate"
                        type="date"
                        value={preferredDate}
                        onChange={(e) => setPreferredDate(e.target.value)}
                        className="col-span-3"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="prefTime" className="text-right">Time</Label>
                      <Input
                        id="prefTime"
                        type="time"
                        value={preferredTime}
                        onChange={(e) => setPreferredTime(e.target.value)}
                        className="col-span-3"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-4 items-start gap-4">
                      <Label htmlFor="objectives" className="text-right pt-2">Objectives</Label>
                      <Textarea
                        id="objectives"
                        value={objectives}
                        onChange={(e) => setObjectives(e.target.value)}
                        placeholder="Define objectives and topics..."
                        className="col-span-3 min-h-[100px] resize-none"
                        required
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isSubmittingBrief}>
                      Cancel
                    </Button>
                    <Button type="submit" className="bg-[#0058be]" disabled={isSubmittingBrief}>
                      {isSubmittingBrief ? "Scheduling..." : "Schedule Briefing"}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </header>

        {/* Top Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Progress Card */}
          <div className="bg-white border border-[#c5c6cd] p-6 rounded-xl shadow-sm flex flex-col justify-between">
            <div>
              <span className="text-[12px] font-bold text-[#75777d] uppercase tracking-wider">Overall Progress</span>
              <div className="text-[32px] font-bold text-[#091426] mt-1">{project.progress || 0}%</div>
            </div>
            <div className="w-full bg-[#d3e4fe] h-2 rounded-full mt-4 overflow-hidden">
              <div className="bg-[#0058be] h-full rounded-full transition-all duration-500" style={{ width: `${project.progress || 0}%` }}></div>
            </div>
          </div>

          {/* Timeline Card */}
          <div className="bg-white border border-[#c5c6cd] p-6 rounded-xl shadow-sm flex flex-col justify-between">
            <div>
              <span className="text-[12px] font-bold text-[#75777d] uppercase tracking-wider">Project Timeline</span>
              <div className="text-sm font-semibold mt-2 space-y-1">
                <div className="text-foreground">Start: {formatDate(project.durationStart)}</div>
                <div className="text-[#0058be]">End: {formatDate(project.durationEnd)}</div>
              </div>
            </div>
          </div>

          {/* Budget Card */}
          <div className="bg-white border border-[#c5c6cd] p-6 rounded-xl shadow-sm flex flex-col justify-between">
            <div>
              <span className="text-[12px] font-bold text-[#75777d] uppercase tracking-wider">Budget Allocation</span>
              <div className="text-[26px] font-bold text-[#091426] mt-1">{project.budget ? formatRupiah(project.budget) : "Rp 0"}</div>
            </div>
          </div>
        </div>

        {/* Tabs Area */}
        <div className="bg-white border border-[#c5c6cd] rounded-xl overflow-hidden shadow-sm">
          <Tabs defaultValue="tasks" className="w-full p-6">
            <TabsList className="mb-6">
              <TabsTrigger value="tasks">Tasks ({project.tasks?.length || 0})</TabsTrigger>
              <TabsTrigger value="briefs">Briefs History ({project.briefs?.length || 0})</TabsTrigger>
              <TabsTrigger value="team">Development Team ({project.teamMembers?.length || 0})</TabsTrigger>
            </TabsList>

            {/* Tasks Tab */}
            <TabsContent value="tasks" className="space-y-4">
              <h3 className="text-lg font-bold text-[#091426] mb-3">Project Execution Tasks</h3>
              <div className="divide-y divide-[#c5c6cd] border border-[#c5c6cd] rounded-lg overflow-hidden bg-white">
                {project.tasks && project.tasks.length > 0 ? (
                  project.tasks.map((task) => (
                    <div key={task.id} className="p-4 hover:bg-[#f8f9ff] transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <h4 className="font-semibold text-[#091426]">{task.title}</h4>
                        {task.description && (
                          <p className="text-xs text-[#75777d] mt-1">{task.description}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-xs font-semibold text-[#75777d] px-2 py-0.5 rounded bg-muted">
                          Checklist: {task.checklists?.filter(c => c.isChecked).length || 0}/{task.checklists?.length || 0}
                        </span>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          task.status === "selesai" ? "bg-emerald-50 text-emerald-700" : "bg-blue-50 text-[#0058be]"
                        }`}>
                          {task.status.replace("_", " ")}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-muted-foreground">No tasks initialized for this project</div>
                )}
              </div>
            </TabsContent>

            {/* Briefs Tab */}
            <TabsContent value="briefs" className="space-y-4">
              <h3 className="text-lg font-bold text-[#091426] mb-3">Briefing Request History</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {project.briefs && project.briefs.length > 0 ? (
                  project.briefs.map((brief) => (
                    <div key={brief.id} className="p-5 border border-[#c5c6cd] rounded-lg hover:border-[#0058be] transition-colors bg-white shadow-sm flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-center mb-3">
                          <span className="font-bold text-[#091426] text-sm">{brief.type}</span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-50 text-amber-700 border border-amber-200">
                            {brief.status || "Scheduled"}
                          </span>
                        </div>
                        <p className="text-xs text-foreground line-clamp-3 mb-4">{brief.objectives}</p>
                      </div>
                      <div className="border-t border-[#c5c6cd]/50 pt-3 flex justify-between items-center text-xs text-[#75777d]">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-[#0058be]" /> {formatDate(brief.preferredDate)}
                        </span>
                        <span className="flex items-center gap-1 font-semibold text-[#091426]">
                          <Clock className="w-3.5 h-3.5" /> {brief.preferredTime}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-2 p-8 text-center text-muted-foreground border border-dashed border-[#c5c6cd] rounded-lg">
                    No briefings requested yet. Click &quot;Request Briefing&quot; above to schedule one.
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Team Tab */}
            <TabsContent value="team" className="space-y-4">
              <h3 className="text-lg font-bold text-[#091426] mb-3">Development Team</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {project.teamMembers && project.teamMembers.length > 0 ? (
                  project.teamMembers.map((member) => (
                    <div key={member.id} className="p-4 border border-[#c5c6cd] rounded-lg bg-[#f8f9ff] flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#0058be] text-white flex items-center justify-center font-bold text-xs uppercase shadow-sm">
                        {(member.profile?.displayName || member.profile?.email || "Dev").substring(0, 2)}
                      </div>
                      <div>
                        <h4 className="font-bold text-[#091426]">{member.profile?.displayName || "Developer Sandbox"}</h4>
                        <p className="text-xs text-[#75777d]">{member.profile?.email}</p>
                        <span className="inline-block mt-1.5 px-2 py-0.5 bg-[#0058be]/10 text-[#0058be] rounded text-[10px] font-bold uppercase tracking-wider">
                          {member.role}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-2 p-8 text-center text-muted-foreground">No developers assigned to this project yet</div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
