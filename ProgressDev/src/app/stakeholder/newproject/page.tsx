"use client";

import React, { useState } from "react";
import { motion, AnimatePresence, motion as m } from "framer-motion";
import {
  ChevronRight,
  Search,
  Bell,
  Settings,
  X,
  ChevronDown,
  Calendar,
  Terminal,
  GitBranch,
  ShieldCheck,
  CheckCircle2,
  Loader2,
} from "lucide-react";

import { projectsApi, usersApi, ApiProfile } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

type Priority = "low" | "med" | "high";

export default function CreateProject() {
  const router = useRouter();
  const { data: session } = useSession();
  const [priority, setPriority] = useState<Priority>("high");
  const [selectedTemplate, setSelectedTemplate] = useState<string>("agile");
  const [teamMembers, setTeamMembers] = useState<ApiProfile[]>([]);
  const [developers, setDevelopers] = useState<ApiProfile[]>([]);
  const [selectedLeadId, setSelectedLeadId] = useState<string>("");

  const [formData, setFormData] = useState({
    platformName: "",
    description: "",
    durationEnd: "",
    budget: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  React.useEffect(() => {
    usersApi.getByRole("developer")
      .then(setDevelopers)
      .catch(console.error);
  }, []);

  const removeMember = (id: string) => {
    setTeamMembers(teamMembers.filter((member) => member.id !== id));
  };

  const addMember = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    if (!id) return;
    const dev = developers.find(d => d.id === id);
    if (dev && !teamMembers.find(m => m.id === id) && id !== selectedLeadId) {
      setTeamMembers([...teamMembers, dev]);
    }
  };

  const handleSubmit = async () => {
    if (!formData.platformName || !formData.durationEnd || !selectedLeadId) {
      alert("Please fill in project name, deadline, and select a Project Lead");
      return;
    }
    
    setIsSubmitting(true);
    try {
      await projectsApi.create({
        platformName: formData.platformName,
        stakeholderName: session?.user?.name || "Unknown Stakeholder",
        durationStart: new Date().toISOString(),
        durationEnd: new Date(formData.durationEnd).toISOString(),
        developerWhatsapp: "081234567890", // placeholder
        budget: Number(formData.budget) || 0,
        teamMembers: [
          { profileId: selectedLeadId, role: "Project Lead" },
          ...teamMembers.map(m => ({ profileId: m.id, role: "Developer" }))
        ],
      });
      router.push("/stakeholder/dashboard");
    } catch (error) {
      console.error("Error creating project:", error);
      alert("Failed to create project");
      setIsSubmitting(false);
    }
  };

  // Variasi Animasi Penurunan Staggered
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 120 } as const,
    },
  };

  return (
    <div className="bg-[#f8f9ff] text-[#0b1c30] min-h-screen font-sans overflow-x-hidden selection:bg-[#0058be]/20">
      {/* TopNavBar */}
      <header className="w-full top-0 sticky z-50 bg-white border-b border-[#c5c6cd] flex justify-between items-center h-16 px-6 backdrop-blur-md bg-opacity-95">
        <div className="flex items-center gap-6">
          <span className="text-[24px] font-bold text-[#091426] tracking-tight">
            DevProgress
          </span>
          <nav className="hidden md:flex gap-4 ml-8 text-[14px]">
            <a
              className="text-[#45474c] hover:bg-[#eff4ff] px-3 py-1.5 rounded transition-colors"
              href="#"
            >
              Dashboard
            </a>
            <a
              className="text-[#0058be] font-bold border-b-2 border-[#0058be] pb-1 px-1"
              href="#"
            >
              Projects
            </a>
            <a
              className="text-[#45474c] hover:bg-[#eff4ff] px-3 py-1.5 rounded transition-colors"
              href="#"
            >
              Tasks
            </a>
            <a
              className="text-[#45474c] hover:bg-[#eff4ff] px-3 py-1.5 rounded transition-colors"
              href="#"
            >
              Settings
            </a>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative hidden sm:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#75777d] w-4 h-4" />
            <input
              className="pl-10 pr-4 py-2 bg-[#eff4ff] border-none rounded-lg text-[14px] w-64 focus:ring-2 focus:ring-[#0058be]/20 outline-none placeholder-[#75777d]"
              placeholder="Search resources..."
              type="text"
            />
          </div>
          <button className="p-2 text-[#45474c] hover:bg-[#eff4ff] rounded-full transition-colors">
            <Bell className="w-5 h-5" />
          </button>
          <button className="p-2 text-[#45474c] hover:bg-[#eff4ff] rounded-full transition-colors">
            <Settings className="w-5 h-5" />
          </button>
          <div className="w-8 h-8 rounded-full bg-[#d8e2ff] flex items-center justify-center text-[#0058be] font-bold text-xs overflow-hidden border border-[#c5c6cd]">
            U
          </div>
        </div>
      </header>

      <div className="flex flex-col w-full">
        {/* Main Content Area */}
        <main className="flex-1 w-full min-w-0 p-6 md:p-12 relative overflow-hidden">
          {/* Background Decorative Element */}
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#0058be]/5 rounded-full blur-3xl pointer-events-none"></div>

          <div className="max-w-6xl mx-auto">
            <header className="mb-8">
              <div className="flex items-center gap-1 text-[#45474c] mb-2 text-[14px]">
                <a className="hover:text-[#0058be] transition-colors" href="#">
                  Projects
                </a>
                <ChevronRight className="w-4 h-4 text-[#75777d]" />
                <span className="text-[#091426] font-medium">New Project</span>
              </div>
              <h1 className="text-[30px] font-bold text-[#091426] tracking-tight">
                Create New Project
              </h1>
              <p className="text-[#45474c] text-[16px] mt-1">
                Initialize a new technical execution workspace with team and
                deadlines.
              </p>
            </header>

            {/* Bento-style Form Layout */}
            <m.div
              className="grid grid-cols-1 md:grid-cols-12 gap-6"
              variants={containerVariants}
              initial="hidden"
              animate="show"
            >
              {/* Left Column: Primary Details */}
              <div className="md:col-span-8 space-y-6">
                {/* General Information */}
                <m.section
                  variants={itemVariants}
                  className="bg-white border border-[#c5c6cd] p-6 rounded-xl shadow-sm"
                >
                  <h2 className="text-[20px] font-bold text-[#091426] mb-6">
                    General Information
                  </h2>
                  <div className="space-y-6">
                    <div>
                      <label
                        className="block text-[14px] font-medium text-[#091426] mb-2"
                        htmlFor="p-name"
                      >
                        Project Name
                      </label>
                      <input
                        className="w-full px-4 py-3 rounded-lg border border-[#c5c6cd] focus:border-[#0058be] focus:ring-4 focus:ring-[#0058be]/10 transition-all outline-none bg-[#f8f9ff] text-[14px]"
                        id="p-name"
                        placeholder="e.g., Cloud Infrastructure Audit 2024"
                        type="text"
                        value={formData.platformName}
                        onChange={(e) => setFormData({ ...formData, platformName: e.target.value })}
                      />
                    </div>
                    <div>
                      <label
                        className="block text-[14px] font-medium text-[#091426] mb-2"
                        htmlFor="p-desc"
                      >
                        Description
                      </label>
                      <textarea
                        className="w-full px-4 py-3 rounded-lg border border-[#c5c6cd] focus:border-[#0058be] focus:ring-4 focus:ring-[#0058be]/10 transition-all outline-none bg-[#f8f9ff] resize-none text-[14px]"
                        id="p-desc"
                        placeholder="Provide technical scope and objectives..."
                        rows={6}
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      />
                    </div>
                  </div>
                </m.section>

                {/* Team Selection */}
                <m.section
                  variants={itemVariants}
                  className="bg-white border border-[#c5c6cd] p-6 rounded-xl shadow-sm"
                >
                  <h2 className="text-[20px] font-bold text-[#091426] mb-6">
                    Project Team
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[14px] font-medium text-[#091426] mb-2">
                        Project Lead
                      </label>
                      <div className="relative">
                        <select 
                          className="w-full appearance-none px-4 py-3 rounded-lg border border-[#c5c6cd] focus:border-[#0058be] focus:ring-4 focus:ring-[#0058be]/10 transition-all outline-none bg-[#f8f9ff] pr-10 text-[14px]"
                          value={selectedLeadId}
                          onChange={(e) => setSelectedLeadId(e.target.value)}
                        >
                          <option value="" disabled>Select Lead</option>
                          {developers.map(dev => (
                            <option key={dev.id} value={dev.id}>{dev.displayName || dev.email}</option>
                          ))}
                        </select>
                        <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#75777d]" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[14px] font-medium text-[#091426] mb-2">
                        Team Members
                      </label>
                      <div className="flex flex-wrap gap-1.5 p-2 min-h-[46px] rounded-lg border border-[#c5c6cd] bg-[#f8f9ff] items-center cursor-pointer hover:border-[#75777d] transition-colors">
                        <AnimatePresence>
                          {teamMembers.map((member) => (
                            <m.span
                              key={member.id}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.8 }}
                              className="bg-[#d8e2ff] text-[#001a42] px-2.5 py-1 rounded-full text-[12px] font-semibold flex items-center gap-1 shadow-sm"
                            >
                              {member.displayName || member.email}
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeMember(member.id);
                                }}
                                className="hover:text-[#ba1a1a] transition-colors"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </m.span>
                          ))}
                        </AnimatePresence>
                        <select 
                          className="bg-transparent text-[#45474c] text-[14px] px-1 outline-none appearance-none cursor-pointer"
                          onChange={addMember}
                          value=""
                        >
                          <option value="" disabled>Add member...</option>
                          {developers
                            .filter(d => d.id !== selectedLeadId && !teamMembers.find(m => m.id === d.id))
                            .map(d => (
                            <option key={d.id} value={d.id}>{d.displayName || d.email}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </m.section>
              </div>

              {/* Right Column: Settings & Meta */}
              <div className="md:col-span-4 space-y-6">
                {/* Schedule & Rank */}
                <m.section
                  variants={itemVariants}
                  className="bg-[#eff4ff] border border-[#c5c6cd] p-6 rounded-xl"
                >
                  <h2 className="text-[20px] font-bold text-[#091426] mb-6">
                    Schedule & Rank
                  </h2>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-[14px] font-medium text-[#091426] mb-2">
                        Deadline
                      </label>
                      <div className="relative">
                        <input
                          className="w-full px-4 py-3 rounded-lg border border-[#c5c6cd] focus:border-[#0058be] focus:ring-4 focus:ring-[#0058be]/10 transition-all outline-none bg-[#f8f9ff] text-[14px]"
                          type="date"
                          value={formData.durationEnd}
                          onChange={(e) => setFormData({ ...formData, durationEnd: e.target.value })}
                        />
                        <Calendar className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#75777d]" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[14px] font-medium text-[#091426] mb-2">
                        Priority Level
                      </label>
                      <div className="grid grid-cols-3 gap-1.5">
                        <button
                          type="button"
                          onClick={() => setPriority("low")}
                          className={`flex flex-col items-center gap-1.5 p-3 rounded-lg border transition-all ${priority === "low" ? "border-[#0058be] bg-[#d3e4fe]" : "border-[#c5c6cd] bg-[#f8f9ff]"}`}
                        >
                          <span className="w-3 h-3 rounded-full bg-[#0058be]"></span>
                          <span
                            className={`text-[12px] ${priority === "low" ? "text-[#0058be] font-bold" : "text-[#45474c]"}`}
                          >
                            Low
                          </span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setPriority("med")}
                          className={`flex flex-col items-center gap-1.5 p-3 rounded-lg border transition-all ${priority === "med" ? "border-[#0058be] bg-[#d3e4fe]" : "border-[#c5c6cd] bg-[#f8f9ff]"}`}
                        >
                          <span className="w-3 h-3 rounded-full bg-[#0d0093]"></span>
                          <span
                            className={`text-[12px] ${priority === "med" ? "text-[#0058be] font-bold" : "text-[#45474c]"}`}
                          >
                            Med
                          </span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setPriority("high")}
                          className={`flex flex-col items-center gap-1.5 p-3 rounded-lg border transition-all ${priority === "high" ? "border-[#0058be] bg-[#d3e4fe]" : "border-[#c5c6cd] bg-[#f8f9ff]"}`}
                        >
                          <span className="w-3 h-3 rounded-full bg-[#ba1a1a]"></span>
                          <span
                            className={`text-[12px] ${priority === "high" ? "text-[#0058be] font-bold" : "text-[#45474c]"}`}
                          >
                            High
                          </span>
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-[14px] font-medium text-[#091426] mb-2">
                        Budget ($)
                      </label>
                      <input
                        className="w-full px-4 py-3 rounded-lg border border-[#c5c6cd] focus:border-[#0058be] focus:ring-4 focus:ring-[#0058be]/10 transition-all outline-none bg-[#f8f9ff] text-[14px]"
                        type="number"
                        placeholder="e.g. 50000"
                        value={formData.budget}
                        onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                      />
                    </div>
                  </div>
                </m.section>

                {/* Project Template Selection */}
                <m.section
                  variants={itemVariants}
                  className="bg-white border border-[#c5c6cd] p-6 rounded-xl shadow-sm"
                >
                  <h2 className="text-[20px] font-bold text-[#091426] mb-1">
                    Template
                  </h2>
                  <p className="text-[#45474c] text-[12px] mb-4">
                    Select a workflow structure to pre-fill tasks.
                  </p>
                  <div className="space-y-2">
                    <div
                      onClick={() => setSelectedTemplate("agile")}
                      className={`flex items-center justify-between p-3 border rounded-lg transition-colors cursor-pointer group ${selectedTemplate === "agile" ? "border-[#0058be] bg-[#eff4ff]" : "border-[#c5c6cd] hover:bg-[#eff4ff]"}`}
                    >
                      <div className="flex items-center gap-3">
                        <Terminal className="w-4 h-4 text-[#0058be]" />
                        <span className="text-[14px] font-medium text-[#091426]">
                          Agile Sprint
                        </span>
                      </div>
                      <CheckCircle2
                        className={`w-4 h-4 text-[#0058be] transition-opacity ${selectedTemplate === "agile" ? "opacity-100" : "opacity-0 group-hover:opacity-40"}`}
                      />
                    </div>
                    <div
                      onClick={() => setSelectedTemplate("kanban")}
                      className={`flex items-center justify-between p-3 border rounded-lg transition-colors cursor-pointer group ${selectedTemplate === "kanban" ? "border-[#0058be] bg-[#eff4ff]" : "border-[#c5c6cd] hover:bg-[#eff4ff]"}`}
                    >
                      <div className="flex items-center gap-3">
                        <GitBranch className="w-4 h-4 text-[#0058be]" />
                        <span className="text-[14px] font-medium text-[#091426]">
                          Kanban Flow
                        </span>
                      </div>
                      <CheckCircle2
                        className={`w-4 h-4 text-[#0058be] transition-opacity ${selectedTemplate === "kanban" ? "opacity-100" : "opacity-0 group-hover:opacity-40"}`}
                      />
                    </div>
                  </div>
                </m.section>

                {/* Form Actions */}
                <m.div
                  variants={itemVariants}
                  className="pt-2 flex flex-col gap-2"
                >
                  <button 
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="w-full py-3 bg-[#0058be] text-white rounded-lg text-[14px] font-bold shadow-lg shadow-[#0058be]/20 hover:bg-[#0058be]/90 active:scale-[0.98] transition-all disabled:opacity-50 flex justify-center items-center gap-2"
                  >
                    {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                    Create Project
                  </button>
                  <button 
                    onClick={() => router.push("/stakeholder/dashboard")}
                    className="w-full py-3 bg-[#d3e4fe] text-[#0058be] rounded-lg text-[14px] font-medium hover:bg-[#dce9ff] transition-all"
                  >
                    Cancel
                  </button>
                </m.div>
              </div>
            </m.div>

            {/* Decorative Illustration Section */}
            <m.div
              className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6 items-center opacity-85"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.85 }}
              transition={{ delay: 0.4 }}
            >
              <div className="p-4 rounded-2xl border border-[#c5c6cd] border-dashed bg-white/50 backdrop-blur-sm">
                <div className="flex items-center gap-4 mb-3">
                  <div className="p-2 bg-[#0058be]/10 rounded-lg text-[#0058be]">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-[14px] font-bold text-[#091426]">
                      Secure Execution
                    </h4>
                    <p className="text-[12px] text-[#45474c]">
                      Encrypted project logs and access control.
                    </p>
                  </div>
                </div>
                <div className="h-1.5 w-full bg-[#dce9ff] rounded-full overflow-hidden">
                  <div className="h-full bg-[#0058be] w-1/3"></div>
                </div>
              </div>

              <div className="p-4 rounded-2xl border border-[#c5c6cd] border-dashed bg-white/50 backdrop-blur-sm">
                <div className="flex items-center gap-4 mb-3">
                  <div className="p-2 bg-[#0058be]/10 rounded-lg text-[#0058be]">
                    <GitBranch className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-[14px] font-bold text-[#091426]">
                      Team Integration
                    </h4>
                    <p className="text-[12px] text-[#45474c]">
                      Direct sync with GitHub and Jira tickets.
                    </p>
                  </div>
                </div>
                <div className="h-1.5 w-full bg-[#dce9ff] rounded-full overflow-hidden">
                  <div className="h-full bg-[#0058be] w-2/3"></div>
                </div>
              </div>
            </m.div>
          </div>
        </main>
      </div>
    </div>
  );
}
