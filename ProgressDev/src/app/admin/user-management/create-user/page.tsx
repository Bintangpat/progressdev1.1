"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight,
  Mail,
  Eye,
  EyeOff,
  UserPlus,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { usersApi } from "@/lib/api";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

// Import Shadcn UI Components
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  Combobox,
  ComboboxInput,
  ComboboxContent,
  ComboboxList,
  ComboboxItem,
} from "@/components/ui/combobox";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

type InviteMethod = "email" | "manual";

export default function AddUser() {
  const [inviteMethod, setInviteMethod] = useState<InviteMethod>("email");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const router = useRouter();
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  // Form Fields
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [tempPassword, setTempPassword] = useState("");
  const [team, setTeam] = useState("");

  // Workspaces selection state
  const [workspaces, setWorkspaces] = useState({
    Alpha: false,
    Beta: false,
    Enterprise: false,
  });

  const handleCheckboxChange = (key: keyof typeof workspaces) => {
    setWorkspaces((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg("");

    const selectedWorkspaces = Object.entries(workspaces)
      .filter(([_, checked]) => checked)
      .map(([name]) => name);

    // Business Logic Frontend Validation
    if (role === "developer") {
      if (!team) {
        setErrorMsg("Developer wajib dimasukkan ke dalam team/department");
        setIsSubmitting(false);
        return;
      }
      if (selectedWorkspaces.length === 0) {
        setErrorMsg("Developer wajib memilih minimal satu workspace");
        setIsSubmitting(false);
        return;
      }
    }

    try {
      const payload = {
        email,
        displayName: fullName,
        role: role || "stakeholder",
        password: inviteMethod === "manual" ? tempPassword : undefined,
        team: role === "developer" ? team : undefined,
        workspaces: role === "developer" ? selectedWorkspaces : undefined,
      };

      await usersApi.create(payload);
      setIsSuccess(true);
      setTimeout(() => {
        router.push("/admin/user-management");
      }, 1500);
    } catch (err: any) {
      setErrorMsg(err.message || "Gagal membuat user");
      setIsSubmitting(false);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 15 },
    show: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 100 } as const,
    },
  };

  return (
    <div className="flex-1 flex flex-col bg-background  font-sans">
      {/* Main Content Canvas */}
      <main className="min-h-[calc(100vh-64px)]  text-foreground flex justify-items-start flex-col py-8 px-8">
        {/* Breadcrumb & Header Cluster */}
        <div className="max-w-[800px] w-full mb-4">
          <Breadcrumb className="mb-2">
            <BreadcrumbList>
              {segments.map((segment, index) => {
                const isLast = index === segments.length - 1;
                const mapping = {
                  label:
                    segment.charAt(0).toUpperCase() +
                    segment.slice(1).replace(/-/g, " "),
                  href: "/" + segments.slice(0, index + 1).join("/"),
                };

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
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight text-balance">
            New Team Member
          </h1>
          <p className="text-[16px] text-foreground mt-1">
            Provision a new user account and set workspace permissions.
          </p>
        </div>

        {/* Form Container */}
        <motion.div
          className=" w-full mx-auto bg-card border-border border-1 rounded-xl overflow-hidden shadow-sm"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          <form
            onSubmit={handleSubmit}
            className="p-8 space-y-6"
            id="add-user-form"
          >
            {/* Section: Personal Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <Label htmlFor="full_name">Full Name</Label>
                <Input
                  id="full_name"
                  name="full_name"
                  placeholder="e.g. Alex Rivera"
                  required
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  name="email"
                  placeholder="alex@devprogress.io"
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* Section: Role */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-[#e5eeff] pt-6">
              <div className="flex flex-col gap-2">
                <Label htmlFor="role">Role</Label>
                <Combobox
                  value={role}
                  onValueChange={(val) => {
                    setRole(val || "");
                    // Clear team and workspaces if not a developer
                    if (val !== "developer") {
                      setTeam("");
                      setWorkspaces({
                        Alpha: false,
                        Beta: false,
                        Enterprise: false,
                      });
                    }
                  }}
                >
                  <ComboboxInput placeholder="Select a role" />
                  <ComboboxContent className="bg-white border border-[#c5c6cd] rounded-md shadow-md max-h-60 overflow-y-auto">
                    <ComboboxList>
                      <ComboboxItem value="admin">Admin</ComboboxItem>
                      <ComboboxItem value="developer">Developer</ComboboxItem>
                      <ComboboxItem value="stakeholder">
                        Stakeholder
                      </ComboboxItem>
                    </ComboboxList>
                  </ComboboxContent>
                </Combobox>
              </div>
            </div>

            {/* Dynamic Section: Team & Workspaces (Developer Only) */}
            <AnimatePresence>
              {role === "developer" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6 border-t border-[#e5eeff] pt-6 overflow-hidden"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="team">Team / Department</Label>
                      <Combobox
                        value={team}
                        onValueChange={(val) => setTeam(val || "")}
                      >
                        <ComboboxInput placeholder="Select a team" />
                        <ComboboxContent className="bg-white border border-[#c5c6cd] rounded-md shadow-md max-h-60 overflow-y-auto">
                          <ComboboxList>
                            <ComboboxItem value="Engineering">
                              Engineering
                            </ComboboxItem>
                            <ComboboxItem value="Product">Product</ComboboxItem>
                            <ComboboxItem value="Design">Design</ComboboxItem>
                            <ComboboxItem value="Quality Assurance">
                              Quality Assurance
                            </ComboboxItem>
                          </ComboboxList>
                        </ComboboxContent>
                      </Combobox>
                    </div>
                  </div>

                  {/* Workspace Access */}
                  <div className="space-y-3">
                    <div>
                      <Label className="text-[14px]">Workspace Access</Label>
                      <p className="text-[12px] text-[#75777d] mt-0.5">
                        Select the environments this developer can access.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {/* Alpha */}
                      <label
                        className={`flex items-center gap-4 p-4 border rounded-lg cursor-pointer transition-colors group select-none ${
                          workspaces.Alpha
                            ? "bg-[#dce9ff] border-[#0058be]"
                            : "border-[#c5c6cd] hover:bg-[#eff4ff]"
                        }`}
                      >
                        <Checkbox
                          checked={workspaces.Alpha}
                          onCheckedChange={() => handleCheckboxChange("Alpha")}
                        />
                        <div className="flex flex-col">
                          <span className="text-[14px] font-medium text-[#0b1c30]">
                            Alpha
                          </span>
                          <span className="text-[10px] text-[#75777d] uppercase tracking-wider font-semibold">
                            Internal Dev
                          </span>
                        </div>
                      </label>

                      {/* Beta */}
                      <label
                        className={`flex items-center gap-4 p-4 border rounded-lg cursor-pointer transition-colors group select-none ${
                          workspaces.Beta
                            ? "bg-[#dce9ff] border-[#0058be]"
                            : "border-[#c5c6cd] hover:bg-[#eff4ff]"
                        }`}
                      >
                        <Checkbox
                          checked={workspaces.Beta}
                          onCheckedChange={() => handleCheckboxChange("Beta")}
                        />
                        <div className="flex flex-col">
                          <span className="text-[14px] font-medium text-[#0b1c30]">
                            Beta
                          </span>
                          <span className="text-[10px] text-[#75777d] uppercase tracking-wider font-semibold">
                            Client Staging
                          </span>
                        </div>
                      </label>

                      {/* Enterprise */}
                      <label
                        className={`flex items-center gap-4 p-4 border rounded-lg cursor-pointer transition-colors group select-none ${
                          workspaces.Enterprise
                            ? "bg-[#dce9ff] border-[#0058be]"
                            : "border-[#c5c6cd] hover:bg-[#eff4ff]"
                        }`}
                      >
                        <Checkbox
                          checked={workspaces.Enterprise}
                          onCheckedChange={() =>
                            handleCheckboxChange("Enterprise")
                          }
                        />
                        <div className="flex flex-col">
                          <span className="text-[14px] font-medium text-[#0b1c30]">
                            Enterprise
                          </span>
                          <span className="text-[10px] text-[#75777d] uppercase tracking-wider font-semibold">
                            Production
                          </span>
                        </div>
                      </label>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Section: Invite Method */}
            <div className="border-t border-[#e5eeff] pt-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
                <div>
                  <span className="text-[14px] font-medium text-[#0b1c30] block">
                    Invitation Method
                  </span>
                  <span className="text-[12px] text-[#75777d]">
                    How should the user receive their credentials?
                  </span>
                </div>
                <div className="flex items-center gap-1 bg-[#eff4ff] p-1 rounded-full border border-[#c5c6cd] self-start sm:self-auto shadow-inner">
                  <button
                    className={`px-4 py-1 rounded-full text-[12px] font-semibold transition-all duration-200 ${
                      inviteMethod === "email"
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-foreground hover:text-[#091426]"
                    }`}
                    type="button"
                    onClick={() => setInviteMethod("email")}
                  >
                    Email Invite
                  </button>
                  <button
                    className={`px-4 py-1 rounded-full text-[12px] font-semibold transition-all duration-200 ${
                      inviteMethod === "manual"
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-foreground hover:text-[#091426]"
                    }`}
                    type="button"
                    onClick={() => setInviteMethod("manual")}
                  >
                    Manual Pass
                  </button>
                </div>
              </div>

              {/* Invitation Content Panel */}
              <div className="min-h-[85px] relative">
                <AnimatePresence mode="wait">
                  {inviteMethod === "email" ? (
                    <motion.div
                      key="email-panel"
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      transition={{ duration: 0.2 }}
                      className="bg-[#f8f9ff] p-4 rounded-lg border border-dashed border-[#c5c6cd]"
                    >
                      <div className="flex items-center gap-2 text-[#0058be] mb-1">
                        <Mail className="w-4 h-4" />
                        <span className="text-[14px] font-bold">
                          Invitation Email
                        </span>
                      </div>
                      <p className="text-[14px] text-foreground leading-relaxed">
                        An automated email will be sent to the user via Resend
                        with a generated temporary password to set up their
                        account.
                      </p>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="manual-panel"
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-2"
                    >
                      <div className="flex flex-col gap-2">
                        <Label htmlFor="temp_password">
                          Temporary Password
                        </Label>
                        <div className="relative max-w-md">
                          <Input
                            id="temp_password"
                            placeholder="••••••••"
                            type={showPassword ? "text" : "password"}
                            value={tempPassword}
                            onChange={(e) => setTempPassword(e.target.value)}
                            required={inviteMethod === "manual"}
                          />
                          <button
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#75777d] hover:text-[#091426] transition-colors"
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff className="w-4 h-4" />
                            ) : (
                              <Eye className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                        <p className="text-[11px] font-medium text-[#75777d]">
                          User will be required to change this upon first login.
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Error Message */}
            {errorMsg && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-medium border border-red-200">
                {errorMsg}
              </div>
            )}

            {/* Form Actions Panel */}
            <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-4 border-t border-[#e5eeff] pt-6">
              <Button
                variant="ghost"
                className="w-full sm:w-auto px-5 py-2.5 text-[14px] font-medium text-foreground hover:bg-[#eff4ff] transition-all rounded-lg"
                type="button"
                onClick={() => router.push("/admin/user-management")}
              >
                Cancel
              </Button>

              <Button
                className={`w-full sm:w-auto px-6 py-2.5 text-[14px] font-medium rounded-lg shadow-sm transition-all duration-200 flex items-center justify-center gap-2 ${
                  isSuccess
                    ? "bg-emerald-600 text-white shadow-emerald-600/10 hover:bg-emerald-700"
                    : "bg-primary text-primary-foreground shadow-[#0058be]/10 hover:bg-sidebar-foreground hover:shadow-md hover:scale-[1.01] active:scale-[0.99]"
                }`}
                type="submit"
                disabled={isSubmitting || isSuccess}
              >
                <AnimatePresence mode="wait">
                  {isSubmitting ? (
                    <motion.span
                      key="submitting"
                      className="flex items-center gap-2"
                    >
                      <Loader2 className="w-4 h-4 animate-spin" /> Processing...
                    </motion.span>
                  ) : isSuccess ? (
                    <motion.span
                      key="success"
                      className="flex items-center gap-2"
                      initial={{ scale: 0.9 }}
                      animate={{ scale: 1 }}
                    >
                      <CheckCircle2 className="w-4 h-4" /> User Created
                    </motion.span>
                  ) : (
                    <motion.span key="idle" className="flex items-center gap-2">
                      <UserPlus className="w-4 h-4" /> Add User
                    </motion.span>
                  )}
                </AnimatePresence>
              </Button>
            </div>
          </form>
        </motion.div>

        {/* Footer */}
        <footer className="max-w-[800px] w-full mx-auto mt-6 flex justify-between items-center text-[12px] font-medium text-[#75777d]">
          <span>© {new Date().getFullYear()} DevProgress Systems</span>
          <div className="flex gap-4">
            <a className="hover:text-[#0058be] transition-colors" href="#">
              Security Policy
            </a>
            <a className="hover:text-[#0058be] transition-colors" href="#">
              Audit Logs
            </a>
          </div>
        </footer>
      </main>
    </div>
  );
}
