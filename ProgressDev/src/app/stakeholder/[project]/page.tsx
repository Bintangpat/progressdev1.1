"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import { projectsApi, ApiProject } from "@/lib/api";
import {
  Terminal,
  LayoutDashboard,
  CheckCircle,
  ClipboardList,
  Settings,
  User,
  Calendar,
  Database,
  Share2,
  Plus,
  ListTodo,
  Filter,
  MoreVertical,
  CheckSquare,
  MessageSquare,
  AlertCircle,
  TrendingUp,
  MessageSquareCode,
  Send,
  PhoneCall,
} from "lucide-react";

export default function StakeHolderSlugPage() {
  const params = useParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("projects");
  const [message, setMessage] = useState("");
  const [project, setProject] = useState<ApiProject | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (params.project) {
      projectsApi.getBySlug(params.project as string)
        .then(data => {
          setProject(data);
          setIsLoading(false);
        })
        .catch(err => {
          console.error("Failed to fetch project:", err);
          setIsLoading(false);
        });
    }
  }, [params.project]);

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-[#f8f9ff]">Loading...</div>;
  }

  if (!project) {
    return <div className="min-h-screen flex items-center justify-center bg-[#f8f9ff]">Project not found.</div>;
  }

  // Cari Lead
  const lead = project.teamMembers?.find(t => t.role.toLowerCase().includes("lead"));
  const leadName = lead?.profile?.displayName || "TBD";

  // Variasi Animasi Framer Motion
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.08 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 110 } as const,
    },
  };

  return (
    <div className="min-h-screen bg-[#f8f9ff] text-[#0b1c30] font-sans selection:bg-[#0058be]/20">
      {/* Top Navigation Bar */}
      <nav className="sticky top-0 w-full bg-[#eff4ff] border-b border-[#c5c6cd] px-6 py-4 z-50 backdrop-blur-md bg-opacity-95">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-[#091426] rounded-lg flex items-center justify-center text-white shadow-md">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-[20px] font-bold text-[#091426] tracking-tight leading-tight">
                DevProgress
              </h2>
              <p className="text-[12px] font-semibold text-[#45474c] uppercase tracking-wider">
                Technical Execution
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`p-3 rounded-lg transition-all duration-200 ${activeTab === "dashboard" ? "bg-[#0058be] text-white" : "text-[#45474c] hover:bg-[#dce9ff]"}`}
              title="Dashboard"
            >
              <LayoutDashboard className="w-5 h-5" />
            </button>
            <button
              onClick={() => setActiveTab("projects")}
              className={`p-3 rounded-lg transition-all duration-200 ${activeTab === "projects" ? "bg-[#0058be] text-white" : "text-[#45474c] hover:bg-[#dce9ff]"}`}
              title="Projects"
            >
              <ClipboardList className="w-5 h-5" />
            </button>
            <button
              onClick={() => setActiveTab("tasks")}
              className={`p-3 rounded-lg transition-all duration-200 ${activeTab === "tasks" ? "bg-[#0058be] text-white" : "text-[#45474c] hover:bg-[#dce9ff]"}`}
              title="Tasks"
            >
              <CheckCircle className="w-5 h-5" />
            </button>
            <div className="w-px h-8 bg-[#c5c6cd] mx-2"></div>
            <button
              onClick={() => setActiveTab("settings")}
              className={`p-3 rounded-lg transition-all duration-200 ${activeTab === "settings" ? "bg-[#0058be] text-white" : "text-[#45474c] hover:bg-[#dce9ff]"}`}
              title="Settings"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </nav>

      {/* Main Canvas */}
      <main className="w-full max-w-[1400px] mx-auto p-6 min-h-[calc(100vh-80px)]">
        {/* Header Section */}
        <header className="flex flex-col md:flex-row justify-between items-start mb-8 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-4 flex-wrap">
              <h1 className="text-[30px] font-bold text-[#091426] tracking-tight">
                {project.platformName}
              </h1>
              <span className="px-2 py-1 bg-[#2170e4] text-white rounded text-[12px] font-semibold uppercase tracking-wider">
                {project.status}
              </span>
            </div>
            <div className="flex items-center gap-6 text-[#45474c] flex-wrap text-[14px]">
              <div className="flex items-center gap-1.5">
                <User className="w-4 h-4 text-[#0058be]" />
                <span>
                  Lead:{" "}
                  <span className="font-bold text-[#091426]">
                    {leadName}
                  </span>
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-[#0058be]" />
                <span>
                  Deadline:{" "}
                  <span className="font-bold text-[#091426]">
                    {new Date(project.durationEnd).toLocaleDateString()}
                  </span>
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <Database className="w-4 h-4 text-[#0058be]" />
                <span>
                  Client:{" "}
                  <span className="font-bold text-[#091426]">
                    {project.stakeholderName}
                  </span>
                </span>
              </div>
            </div>
          </div>

          <div className="flex gap-3 w-full md:w-auto">
            <button className="flex-1 md:flex-none px-4 py-2.5 border border-[#75777d] text-[#0b1c30] rounded-lg font-medium text-[14px] hover:bg-[#e5eeff] transition-colors flex items-center justify-center gap-2">
              <Share2 className="w-4 h-4" /> Share
            </button>
            <button className="flex-1 md:flex-none px-4 py-2.5 bg-[#0058be] text-white rounded-lg font-medium text-[14px] hover:bg-[#0058be]/90 transition-all flex items-center justify-center gap-2 shadow-md shadow-[#0058be]/20">
              <Plus className="w-4 h-4" /> New Task
            </button>
          </div>
        </header>

        {/* Bento Layout */}
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {/* Execution Tasks (Left Column Cluster) */}
          <div className="lg:col-span-8 space-y-6">
            <motion.div
              variants={itemVariants}
              className="bg-white border border-[#c5c6cd] p-6 rounded-xl shadow-sm"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-[20px] font-bold text-[#091426] flex items-center gap-2">
                  <ListTodo className="w-5 h-5 text-[#0058be]" /> Execution
                  Roadmap
                </h3>
                <div className="flex gap-1">
                  <button className="p-1.5 hover:bg-[#eff4ff] rounded transition-colors text-[#75777d]">
                    <Filter className="w-4 h-4" />
                  </button>
                  <button className="p-1.5 hover:bg-[#eff4ff] rounded transition-colors text-[#75777d]">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                {project.tasks?.map((task) => {
                  const taskProgress = task.checklists?.length 
                    ? Math.round((task.checklists.filter(c => c.isChecked).length / task.checklists.length) * 100)
                    : 0;

                  return (
                    <motion.div
                      key={task.id}
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.99 }}
                      className="p-4 border border-[#c5c6cd] rounded-lg hover:border-[#0058be] transition-all cursor-pointer group bg-white"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="text-[14px] font-bold text-[#091426] group-hover:text-[#0058be] transition-colors">
                            {task.title}
                          </h4>
                          <p className="text-[14px] text-[#45474c] mt-0.5 line-clamp-1">
                            {task.description || "No description provided."}
                          </p>
                        </div>
                        <div className="flex -space-x-2 shrink-0">
                          <div className="w-8 h-8 rounded-full border-2 border-white bg-blue-500 flex items-center justify-center text-[10px] text-white font-bold">
                            T
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex-1 h-2 bg-[#eff4ff] rounded-full overflow-hidden">
                          <div className="h-full bg-[#0058be] rounded-full" style={{ width: `${taskProgress}%` }}></div>
                        </div>
                        <span className="text-[12px] font-semibold text-[#45474c]">
                          {taskProgress}%
                        </span>
                      </div>
                      <div className="mt-4 flex items-center gap-6 text-[12px] text-[#45474c]">
                        <span className="flex items-center gap-1">
                          <CheckSquare className="w-3.5 h-3.5" /> {task.checklists?.filter(c => c.isChecked).length || 0}/{task.checklists?.length || 0} Sub-tasks
                        </span>
                        <span className="flex items-center gap-1">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${task.isCompleted ? "bg-emerald-100 text-emerald-700" : "bg-[#eff4ff] text-[#0058be]"}`}>
                            {task.status.replace("_", " ")}
                          </span>
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
                {(!project.tasks || project.tasks.length === 0) && (
                  <p className="text-[#45474c] text-[14px]">No tasks found for this project.</p>
                )}
              </div>
            </motion.div>

            {/* Progress Metrics Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Timeline Card */}
              <motion.div
                variants={itemVariants}
                className="bg-white/80 backdrop-blur-md border border-[#e2e8f0] p-6 rounded-xl shadow-sm"
              >
                <h4 className="text-[14px] font-bold text-[#45474c] mb-4 uppercase tracking-wider">
                  Migration Timeline
                </h4>
                <div className="flex items-end gap-2 h-32 pt-2">
                  <div
                    className="flex-1 bg-[#d3e4fe] rounded-t-sm"
                    style={{ height: "40%" }}
                  ></div>
                  <div
                    className="flex-1 bg-[#d3e4fe] rounded-t-sm"
                    style={{ height: "60%" }}
                  ></div>
                  <div
                    className="flex-1 bg-[#d3e4fe] rounded-t-sm"
                    style={{ height: "45%" }}
                  ></div>
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: "85%" }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="flex-1 bg-[#0058be] rounded-t-sm relative group"
                  ></motion.div>
                  <div
                    className="flex-1 bg-[#dce9ff] rounded-t-sm"
                    style={{ height: "30%" }}
                  ></div>
                  <div
                    className="flex-1 bg-[#dce9ff] rounded-t-sm"
                    style={{ height: "20%" }}
                  ></div>
                  <div
                    className="flex-1 bg-[#dce9ff] rounded-t-sm"
                    style={{ height: "10%" }}
                  ></div>
                </div>
                <div className="flex justify-between mt-3 text-[12px] font-medium text-[#45474c]">
                  <span>WK 32</span>
                  <span className="text-[#0058be] font-bold">
                    WK 35 (Current)
                  </span>
                  <span>WK 38</span>
                </div>
              </motion.div>

              {/* Budget Utilization */}
              <motion.div
                variants={itemVariants}
                className="bg-white/80 backdrop-blur-md border border-[#e2e8f0] p-6 rounded-xl shadow-sm"
              >
                <h4 className="text-[14px] font-bold text-[#45474c] mb-4 uppercase tracking-wider">
                  Budget Utilization
                </h4>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[24px] font-bold text-[#091426]">
                    ${project.budget ? project.budget.toLocaleString() : "0"}
                  </span>
                  <span className="text-emerald-500 text-[12px] font-semibold flex items-center gap-1">
                    <TrendingUp className="w-4 h-4" /> On track
                  </span>
                </div>
                <p className="text-[14px] text-[#45474c] mb-4">
                  Total Project Budget: ${project.budget ? project.budget.toLocaleString() : "0"}
                </p>
                <div className="w-full h-4 bg-[#eff4ff] rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "0%" }} // Placeholder for actual spent budget
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="h-full bg-[#0058be]"
                  />
                </div>
              </motion.div>
            </div>
          </div>

          {/* Discussion Sidebar & Context (Right Column) */}
          <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-[88px]">
            {/* Team Sync Live Chat Container */}
            <motion.div
              variants={itemVariants}
              className="bg-white rounded-xl border border-[#c5c6cd] shadow-sm flex flex-col h-[520px]"
            >
              <div className="p-4 border-b border-[#c5c6cd] flex justify-between items-center bg-[#f8f9ff] rounded-t-xl">
                <h3 className="text-[16px] font-bold text-[#091426] flex items-center gap-2">
                  <MessageSquareCode className="w-5 h-5 text-[#0058be]" /> Team
                  Sync
                </h3>
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              </div>

              {/* Message Feed Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar max-h-[380px]">
                {/* Message 1 */}
                <div className="flex gap-3">
                  <div className="w-9 h-9 rounded-full bg-amber-500 text-white font-bold flex items-center justify-center text-xs shrink-0">
                    SJ
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-baseline gap-2">
                      <span className="text-[13px] font-bold text-[#091426]">
                        Sarah Jenkins
                      </span>
                      <span className="text-[11px] text-[#45474c]">
                        2:14 PM
                      </span>
                    </div>
                    <div className="bg-[#eff4ff] p-3 rounded-lg rounded-tl-none border border-[#c5c6cd]/30 max-w-[240px]">
                      <p className="text-[13px] text-[#0b1c30] leading-relaxed">
                        The subnet mask conflict in the staging VPC has been
                        resolved. We are ready for the initial database dump
                        migration tomorrow morning.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Message 2 */}
                <div className="flex gap-3">
                  <div className="w-9 h-9 rounded-full bg-purple-500 text-white font-bold flex items-center justify-center text-xs shrink-0">
                    MT
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-baseline gap-2">
                      <span className="text-[13px] font-bold text-[#091426]">
                        Marcus Thorne
                      </span>
                      <span className="text-[11px] text-[#45474c]">
                        2:20 PM
                      </span>
                    </div>
                    <div className="bg-[#eff4ff] p-3 rounded-lg rounded-tl-none border border-[#c5c6cd]/30 max-w-[240px]">
                      <p className="text-[13px] text-[#0b1c30] leading-relaxed">
                        Great news. @Sarah, did you update the security groups
                        for the bastion host as well?
                      </p>
                    </div>
                  </div>
                </div>

                {/* Message 3 (Self) */}
                <div className="flex gap-3 flex-row-reverse">
                  <div className="w-9 h-9 rounded-full bg-[#091426] text-white font-bold flex items-center justify-center text-xs shrink-0">
                    ME
                  </div>
                  <div className="space-y-1 text-right">
                    <div className="flex items-baseline gap-2 justify-end">
                      <span className="text-[11px] text-[#45474c]">
                        Just now
                      </span>
                      <span className="text-[13px] font-bold text-[#091426]">
                        Me
                      </span>
                    </div>
                    <div className="bg-[#0058be] p-3 rounded-lg rounded-tr-none text-white text-left shadow-sm max-w-[240px]">
                      <p className="text-[13px] leading-relaxed">
                        I'll review the yaml file shortly. Looks like we're
                        ahead of schedule.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Chat Input Dock */}
              <div className="p-4 bg-[#f8f9ff] border-t border-[#c5c6cd] rounded-b-xl mt-auto">
                <div className="relative flex items-center">
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full bg-white border border-[#c5c6cd] rounded-lg pl-3 pr-10 py-2.5 focus:ring-2 focus:ring-[#0058be] focus:border-[#0058be] transition-all resize-none text-[13px] h-[40px] focus:outline-none"
                    placeholder="Type a message..."
                    rows={1}
                  ></textarea>
                  <button className="absolute right-3 text-[#0058be] hover:scale-110 transition-transform">
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Active Participants / On-Call Card */}
            <motion.div
              variants={itemVariants}
              className="bg-[#091426] text-white p-6 rounded-xl shadow-lg"
            >
              <h4 className="text-[12px] font-bold text-[#bcc7de] mb-4 uppercase tracking-wider">
                On-Call Team
              </h4>
              <div className="space-y-4">
                {project.teamMembers && project.teamMembers.length > 0 ? (
                  project.teamMembers.map((member) => (
                    <div key={member.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <div className="w-9 h-9 rounded-full bg-blue-500 font-bold text-white flex items-center justify-center text-xs">
                            {member.profile?.displayName?.[0] || 'T'}
                          </div>
                          <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 border-2 border-[#091426] rounded-full"></div>
                        </div>
                        <div>
                          <p className="text-[14px] font-bold">{member.profile?.displayName || member.role}</p>
                          <p className="text-[12px] text-[#bcc7de]">{member.role}</p>
                        </div>
                      </div>
                      <button className="text-[#bcc7de] hover:text-white transition-colors">
                        <PhoneCall className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-[13px] text-[#bcc7de]">No team members assigned.</p>
                )}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
