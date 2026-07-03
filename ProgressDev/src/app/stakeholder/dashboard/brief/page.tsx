"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Cpu,
  Search,
  Bell,
  HelpCircle,
  ChevronRight,
  ChevronDown,
  Calendar,
  Clock,
  X,
  Plus,
  History,
  FileText,
  ArrowRight,
  Lightbulb,
  Loader2,
  CheckCircle2,
} from "lucide-react";

import { useParams, useRouter } from "next/navigation";
import { projectsApi, briefsApi, usersApi } from "@/lib/api";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ParticipantSheet } from "./sheet";

export default function RequestBriefing() {
  const params = useParams();
  const router = useRouter();

  // State manajemen form sederhana
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [projectId, setProjectId] = useState<string>("");
  const [developers, setDevelopers] = useState<any[]>([]);
  const [selectedParticipants, setSelectedParticipants] = useState<any[]>([]);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const [formData, setFormData] = useState({
    type: "Executive Summary",
    preferredDate: "",
    preferredTime: "",
    objectives: "",
  });

  useEffect(() => {
    if (params.project) {
      projectsApi
        .getBySlug(params.project as string)
        .then((res) => setProjectId(res.id))
        .catch(console.error);
    }
    usersApi.getByRole("developer")
      .then(setDevelopers)
      .catch(console.error);
  }, [params.project]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectId || !formData.preferredDate || !formData.preferredTime) {
      alert("Please fill in the required date and time.");
      return;
    }

    setIsSubmitting(true);
    try {
      await briefsApi.create(projectId, {
        type: formData.type,
        preferredDate: new Date(formData.preferredDate).toISOString(),
        preferredTime: formData.preferredTime,
        objectives: formData.objectives,
      });
      setIsSubmitting(false);
      setIsSuccess(true);
      setTimeout(() => {
        router.push(`/stakeholder/${params.project}`);
      }, 1500);
    } catch (error) {
      console.error(error);
      alert("Failed to schedule briefing.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9ff] text-[#0b1c30] font-sans antialiased selection:bg-[#0058be]/20">
      {/* Main Content Canvas */}
      <main className=" p-8 min-h-screen w-full">
        <div className="max-w-7xl mx-auto grid grid-cols-12 gap-8">
          {/* Header Section */}
          <div className="col-span-12 mb-2">
            <nav className="flex items-center gap-1 text-foreground text-[12px] font-semibold uppercase tracking-wider mb-2">
              <span className="hover:text-[#0058be] cursor-pointer">
                Stakeholder View
              </span>
              <ChevronRight className="w-3.5 h-3.5 text-[#75777d]" />
              <span className="text-[#0058be]">Request Briefing</span>
            </nav>
            <h2 className="text-[30px] font-bold text-[#091426] tracking-tight">
              Request Briefing
            </h2>
            <p className="text-foreground text-[16px] mt-1">
              Schedule a high-level review or a technical deep-dive for your
              active projects.
            </p>
          </div>

          {/* Form Section (Left Side) */}
          <div className="col-span-12 lg:col-span-8">
            <div className="bg-white border border-[#c5c6cd] rounded-xl p-8 shadow-sm">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Project Context & Briefing Type Selection */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[14px] font-medium text-[#0b1c30] mb-2">
                      Project Context
                    </label>
                    <div className="relative">
                      <select className="w-full bg-white border border-[#c5c6cd] rounded-lg p-3 pr-10 text-[14px] text-[#0b1c30] focus:ring-2 focus:ring-[#0058be]/20 focus:border-[#0058be] appearance-none transition-all outline-none">
                        <option>Enterprise Cloud Migration</option>
                        <option>Q3 API Optimization</option>
                        <option>AI-driven Analytics Suite</option>
                        <option>Mobile App Redesign</option>
                      </select>
                      <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#75777d]" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[14px] font-medium text-[#0b1c30] mb-2">
                      Briefing Type
                    </label>
                    <div className="relative">
                      <select
                        value={formData.type}
                        onChange={(e) =>
                          setFormData({ ...formData, type: e.target.value })
                        }
                        className="w-full bg-white border border-[#c5c6cd] rounded-lg p-3 pr-10 text-[14px] text-[#0b1c30] focus:ring-2 focus:ring-[#0058be]/20 focus:border-[#0058be] appearance-none transition-all outline-none"
                      >
                        <option value="Executive Summary">
                          Executive Summary
                        </option>
                        <option value="Technical Deep-dive">
                          Technical Deep-dive
                        </option>
                        <option value="Budget & Timeline Review">
                          Budget & Timeline Review
                        </option>
                        <option value="Risk Assessment Briefing">
                          Risk Assessment Briefing
                        </option>
                      </select>
                      <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#75777d]" />
                    </div>
                  </div>
                </div>

                {/* Date and Time Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[14px] font-medium text-[#0b1c30] mb-2">
                      Preferred Date
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        value={formData.preferredDate}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            preferredDate: e.target.value,
                          })
                        }
                        className="w-full bg-white border border-[#c5c6cd] rounded-lg p-3 text-[14px] text-[#0b1c30] focus:ring-2 focus:ring-[#0058be]/20 focus:border-[#0058be] transition-all outline-none"
                      />
                      <Calendar className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#75777d]" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[14px] font-medium text-[#0b1c30] mb-2">
                      Preferred Time (EST)
                    </label>
                    <div className="relative">
                      <input
                        type="time"
                        value={formData.preferredTime}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            preferredTime: e.target.value,
                          })
                        }
                        className="w-full bg-white border border-[#c5c6cd] rounded-lg p-3 text-[14px] text-[#0b1c30] focus:ring-2 focus:ring-[#0058be]/20 focus:border-[#0058be] transition-all outline-none"
                      />
                      <Clock className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#75777d]" />
                    </div>
                  </div>
                </div>

                {/* Participants Badge List */}
                <div>
                  <label className="block text-[14px] font-medium text-[#0b1c30] mb-2">
                    Participants & Presenters
                  </label>
                  <div className="flex flex-wrap gap-3 items-center bg-[#eff4ff]/50 p-4 rounded-lg border border-[#c5c6cd] border-dashed">
                    {selectedParticipants.map((p) => (
                      <Badge
                        key={p.id}
                        variant="secondary"
                        className="pl-1 pr-2 py-1 h-8 rounded-full bg-[#d8e2ff] text-[#001a42] flex items-center gap-1.5 border-none shadow-xs"
                      >
                        <Avatar className="w-6 h-6">
                          <AvatarFallback className="text-[10px] font-bold bg-[#0058be] text-white">
                            {p.displayName.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-xs font-semibold">{p.displayName}</span>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedParticipants(selectedParticipants.filter((s) => s.id !== p.id));
                          }}
                          className="hover:text-[#ba1a1a] transition-colors cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </Badge>
                    ))}

                    {/* Add Button */}
                    <button
                      type="button"
                      onClick={() => setIsSheetOpen(true)}
                      className="w-7 h-7 flex items-center justify-center rounded-full border border-[#0058be] border-dashed text-[#0058be] hover:bg-[#0058be] hover:text-white transition-all cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                    <span className="text-[#75777d] text-[12px] italic ml-2">
                      Click plus to invite team members...
                    </span>
                  </div>
                </div>

                {/* Agenda & Objectives */}
                <div>
                  <label className="block text-[14px] font-medium text-[#0b1c30] mb-2">
                    Briefing Objectives & Agenda
                  </label>
                  <textarea
                    value={formData.objectives}
                    onChange={(e) =>
                      setFormData({ ...formData, objectives: e.target.value })
                    }
                    className="w-full bg-white border border-[#c5c6cd] rounded-lg p-3 text-[14px] text-[#0b1c30] focus:ring-2 focus:ring-[#0058be]/20 focus:border-[#0058be] transition-all resize-none outline-none"
                    placeholder="Please outline the key topics you would like to cover during this session..."
                    rows={6}
                  />
                  <div className="mt-1 flex justify-between text-[11px] text-[#75777d] font-semibold uppercase tracking-wider">
                    <span>Recommended: Define at least 3 objectives</span>
                    <span>0 / 2000 characters</span>
                  </div>
                </div>

                {/* Action Buttons Hub */}
                <div className="flex items-center justify-end gap-4 pt-4 border-t border-[#c5c6cd]">
                  <button
                    type="button"
                    onClick={() =>
                      router.push(`/stakeholder/${params.project}`)
                    }
                    className="px-5 py-2 rounded-lg text-[14px] font-medium text-foreground hover:bg-[#e5eeff] transition-all"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={isSubmitting || isSuccess}
                    className={`px-6 py-2 rounded-lg text-[14px] font-medium transition-all duration-200 flex items-center gap-2 shadow-lg min-w-[170px] justify-center ${
                      isSuccess
                        ? "bg-emerald-600 text-white shadow-emerald-600/20"
                        : "bg-[#0058be] text-white shadow-[#0058be]/20 hover:shadow-xl hover:-translate-y-[1px]"
                    }`}
                  >
                    <AnimatePresence mode="wait">
                      {isSubmitting ? (
                        <motion.span
                          key="loading"
                          className="flex items-center gap-2"
                        >
                          <Loader2 className="w-4 h-4 animate-spin" />{" "}
                          Scheduling...
                        </motion.span>
                      ) : isSuccess ? (
                        <motion.span
                          key="success"
                          className="flex items-center gap-2"
                          initial={{ scale: 0.8 }}
                          animate={{ scale: 1 }}
                        >
                          <CheckCircle2 className="w-4 h-4" /> Success!
                        </motion.span>
                      ) : (
                        <span key="default">Schedule Briefing</span>
                      )}
                    </AnimatePresence>
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Activity Logs Sidebar (Right Side) */}
          <div className="col-span-12 lg:col-span-4 space-y-6">
            <div className="bg-white border border-[#c5c6cd] rounded-xl p-6 shadow-sm">
              <h3 className="text-[16px] font-bold text-[#091426] mb-4 flex items-center gap-2">
                <History className="w-5 h-5 text-[#0058be]" /> Recent Activity
              </h3>

              <div className="space-y-4">
                {/* History Item 1 */}
                <div className="p-4 rounded-lg bg-[#f8f9ff] border border-transparent hover:border-[#c5c6cd] transition-all cursor-pointer">
                  <div className="flex justify-between items-center mb-2">
                    <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase tracking-wider">
                      Completed
                    </span>
                    <span className="text-[#75777d] text-[11px] font-medium">
                      2 days ago
                    </span>
                  </div>
                  <h4 className="text-[14px] font-bold text-[#0b1c30]">
                    Cloud Migration Q2 Status
                  </h4>
                  <p className="text-foreground text-[12px] line-clamp-2 mt-1">
                    High-level recap of infrastructure deployment and remaining
                    roadmap...
                  </p>
                  <div className="mt-3 flex items-center gap-1.5 text-[#0058be] text-[12px] font-semibold hover:underline">
                    <FileText className="w-3.5 h-3.5" />
                    <span>View Transcript</span>
                  </div>
                </div>

                {/* History Item 2 */}
                <div className="p-4 rounded-lg bg-[#f8f9ff] border border-transparent hover:border-[#c5c6cd] transition-all cursor-pointer">
                  <div className="flex justify-between items-center mb-2">
                    <span className="px-2 py-0.5 rounded bg-[#d8e2ff] text-[#004395] text-[10px] font-bold uppercase tracking-wider">
                      Scheduled
                    </span>
                    <span className="text-[#75777d] text-[11px] font-medium">
                      In 3 hours
                    </span>
                  </div>
                  <h4 className="text-[14px] font-bold text-[#0b1c30]">
                    Budget Review: Phase 4
                  </h4>
                  <p className="text-foreground text-[12px] line-clamp-2 mt-1">
                    Detailed breakdown of expenditure vs. projection for API
                    overhaul.
                  </p>
                  <div className="mt-3 flex -space-x-2">
                    <div className="w-6 h-6 rounded-full border-2 border-white bg-blue-500 text-white flex items-center justify-center text-[9px] font-bold">
                      JD
                    </div>
                    <div className="w-6 h-6 rounded-full border-2 border-white bg-[#091426] text-white text-[8px] flex items-center justify-center font-bold">
                      +3
                    </div>
                  </div>
                </div>
              </div>

              <button className="w-full mt-4 py-1 text-[#0058be] text-[14px] font-medium hover:underline flex items-center justify-center gap-1">
                View Full History <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Micro Info Insight Card */}
            <div className="bg-[#091426] text-white rounded-xl p-6 relative overflow-hidden shadow-md">
              <div className="relative z-10">
                <Lightbulb className="w-5 h-5 text-[#adc6ff] mb-2" />
                <h4 className="text-[14px] font-bold mb-1">Efficiency Tip</h4>
                <p className="text-[12px] text-[#8590a6] leading-relaxed">
                  Briefings requested 48 hours in advance are 35% more likely to
                  result in comprehensive documentation and immediate action
                  items.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <ParticipantSheet
        isOpen={isSheetOpen}
        onOpenChange={setIsSheetOpen}
        availableParticipants={developers}
        selectedParticipants={selectedParticipants}
        onSelect={(p) => setSelectedParticipants([...selectedParticipants, p])}
        onRemove={(id) => setSelectedParticipants(selectedParticipants.filter((s) => s.id !== id))}
      />
    </div>
  );
}
