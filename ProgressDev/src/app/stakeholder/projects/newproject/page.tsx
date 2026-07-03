"use client";

import React, { useState } from "react";
import { motion, AnimatePresence, motion as m } from "framer-motion";
import {
  ChevronRight,
  X,
  Calendar,
  ShieldCheck,
  Loader2,
} from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbPage,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import { projectsApi, usersApi, ApiProfile } from "@/lib/api";
import { useRouter, usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  Combobox,
  ComboboxInput,
  ComboboxContent,
  ComboboxList,
  ComboboxItem,
  ComboboxEmpty,
} from "@/components/ui/combobox";

const formatRupiah = (val: string) => {
  if (!val) return "Rp 0";
  const num = parseInt(val, 10);
  if (isNaN(num)) return "Rp 0";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(num);
};

const formatDate = (dateString: string) => {
  if (!dateString) return "";
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

export default function CreateProject() {
  const router = useRouter();
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  const { data: session } = useSession();
  const [teamMembers, setTeamMembers] = useState<ApiProfile[]>([]);
  const [developers, setDevelopers] = useState<ApiProfile[]>([]);
  const [selectedLeadId, setSelectedLeadId] = useState<string>("");

  const [formData, setFormData] = useState({
    platformName: "",
    durationEnd: "",
    budget: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  React.useEffect(() => {
    usersApi.getByRole("developer").then(setDevelopers).catch(console.error);
  }, []);

  const removeMember = (id: string) => {
    setTeamMembers(teamMembers.filter((member) => member.id !== id));
  };

  const addMember = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    if (!id) return;
    const dev = developers.find((d) => d.id === id);
    if (dev && !teamMembers.find((m) => m.id === id) && id !== selectedLeadId) {
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
          ...teamMembers.map((m) => ({ profileId: m.id, role: "Developer" })),
        ],
      });
      router.push("/stakeholder/dashboard");
    } catch (error) {
      console.error("Error creating project:", error);
      alert("Failed to create project");
      setIsSubmitting(false);
    }
  };

  // Staggered Animation variants
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
      <div className="flex flex-col w-full">
        {/* Main Content Area */}
        <main className="flex-1 w-full min-w-0 p-6 md:p-12 relative overflow-hidden">
          {/* Background Decorative Element */}
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#0058be]/5 rounded-full blur-3xl pointer-events-none"></div>

          <div className="max-w-6xl mx-auto">
            <header className="mb-8">
              {/* Breadcrumb section */}
              <Breadcrumb className="mb-4">
                <BreadcrumbList className="text-[12px] font-semibold tracking-wider text-[#75777d] uppercase">
                  {segments.map((segment, index) => {
                    const href = `/${segments.slice(0, index + 1).join("/")}`;
                    const isLast = index === segments.length - 1;
                    const mapping = {
                      stakeholder: { label: "Stakeholder", href: "#" },
                      projects: { label: "Projects", href: "/stakeholder/projects" },
                      newproject: { label: "New Project", href: "/stakeholder/projects/newproject" },
                    }[segment] || { label: segment, href };

                    return (
                      <React.Fragment key={segment}>
                        <BreadcrumbItem>
                          {isLast ? (
                            <BreadcrumbPage className="font-bold text-[#0b1c30]">
                              {mapping.label}
                            </BreadcrumbPage>
                          ) : (
                            <BreadcrumbLink asChild>
                              <Link
                                href={mapping.href}
                                className="text-[#75777d] hover:text-[#0058be] transition-colors"
                              >
                                {mapping.label}
                              </Link>
                            </BreadcrumbLink>
                          )}
                        </BreadcrumbItem>
                        {!isLast && (
                          <BreadcrumbSeparator className="text-[#75777d]" />
                        )}
                      </React.Fragment>
                    );
                  })}
                </BreadcrumbList>
              </Breadcrumb>
              <h1 className="text-[30px] font-bold text-[#091426] tracking-tight">
                Create New Project
              </h1>
              <p className="text-foreground text-[16px] mt-1">
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
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            platformName: e.target.value,
                          })
                        }
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
                      <Combobox
                        value={selectedLeadId}
                        onValueChange={(val) => setSelectedLeadId(val || "")}
                      >
                        <div className="relative">
                          <ComboboxInput
                            placeholder="Search & select lead..."
                            className="w-full px-4 py-3 rounded-lg border border-[#c5c6cd] focus:border-[#0058be] focus:ring-4 focus:ring-[#0058be]/10 transition-all outline-none bg-[#f8f9ff] text-[14px]"
                          />
                        </div>
                        <ComboboxContent className="bg-white border border-[#c5c6cd] rounded-lg shadow-md max-h-60 overflow-y-auto z-50">
                          <ComboboxList>
                            {developers.map((dev) => (
                              <ComboboxItem
                                key={dev.id}
                                value={dev.id}
                                className="px-4 py-2 hover:bg-[#eff4ff] cursor-pointer text-[14px] flex items-center justify-between"
                              >
                                <span>{dev.displayName || dev.email}</span>
                              </ComboboxItem>
                            ))}
                            {developers.length === 0 && (
                              <ComboboxEmpty className="p-4 text-center text-sm text-[#75777d]">
                                No leads found
                              </ComboboxEmpty>
                            )}
                          </ComboboxList>
                        </ComboboxContent>
                      </Combobox>
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
                          className="bg-transparent text-foreground text-[14px] px-1 outline-none appearance-none cursor-pointer"
                          onChange={addMember}
                          value=""
                        >
                          <option value="" disabled>
                            Add member...
                          </option>
                          {developers
                            .filter(
                              (d) =>
                                d.id !== selectedLeadId &&
                                !teamMembers.find((m) => m.id === d.id),
                            )
                            .map((d) => (
                              <option key={d.id} value={d.id}>
                                {d.displayName || d.email}
                              </option>
                            ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </m.section>
              </div>

              {/* Right Column: Settings & Meta */}
              <div className="md:col-span-4 space-y-6">
                {/* Schedule & Budget */}
                <m.section
                  variants={itemVariants}
                  className="bg-[#eff4ff] border border-[#c5c6cd] p-6 rounded-xl space-y-6"
                >
                  <h2 className="text-[20px] font-bold text-[#091426] mb-2">
                    Schedule & Budget
                  </h2>
                  <div className="space-y-6">
                    {/* DatePicker */}
                    <div>
                      <label className="block text-[14px] font-medium text-[#091426] mb-2">
                        Deadline
                      </label>
                      <div className="relative">
                        <button
                          type="button"
                          className="w-full flex items-center justify-between px-4 py-3 rounded-lg border border-[#c5c6cd] hover:border-[#0058be] transition-all bg-[#f8f9ff] text-[14px] outline-none cursor-pointer"
                          onClick={() => {
                            document.getElementById("deadline-input")?.showPicker();
                          }}
                        >
                          <span className={formData.durationEnd ? "text-[#0b1c30]" : "text-[#75777d]"}>
                            {formData.durationEnd ? formatDate(formData.durationEnd) : "Select Deadline"}
                          </span>
                          <Calendar className="w-4 h-4 text-[#75777d]" />
                        </button>
                        <input
                          id="deadline-input"
                          type="date"
                          className="absolute inset-0 opacity-0 pointer-events-none"
                          value={formData.durationEnd}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              durationEnd: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>

                    {/* Budget in Rupiah */}
                    <div>
                      <label className="block text-[14px] font-medium text-[#091426] mb-2">
                        Budget (IDR)
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[#75777d] font-semibold">
                          Rp
                        </span>
                        <input
                          className="w-full px-4 py-3 pl-10 rounded-lg border border-[#c5c6cd] focus:border-[#0058be] focus:ring-4 focus:ring-[#0058be]/10 transition-all outline-none bg-[#f8f9ff] text-[14px]"
                          type="number"
                          placeholder="e.g. 50000000"
                          value={formData.budget}
                          onChange={(e) =>
                            setFormData({ ...formData, budget: e.target.value })
                          }
                        />
                      </div>
                      <p className="mt-1.5 text-xs font-semibold text-[#0058be]">
                        Value: {formatRupiah(formData.budget)}
                      </p>
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
                    className="w-full py-3 bg-[#0058be] text-white rounded-lg text-[14px] font-bold shadow-lg shadow-[#0058be]/20 hover:bg-[#0058be]/90 active:scale-[0.98] transition-all disabled:opacity-50 flex justify-center items-center gap-2 cursor-pointer"
                  >
                    {isSubmitting && (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    )}
                    Create Project
                  </button>
                  <button
                    onClick={() => router.push("/stakeholder/dashboard")}
                    className="w-full py-3 bg-[#d3e4fe] text-[#0058be] rounded-lg text-[14px] font-medium hover:bg-[#dce9ff] transition-all cursor-pointer"
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
                    <p className="text-[12px] text-foreground">
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
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-[14px] font-bold text-[#091426]">
                      Milestone Tracking
                    </h4>
                    <p className="text-[12px] text-foreground">
                      Precise date logging and timeline planning.
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
