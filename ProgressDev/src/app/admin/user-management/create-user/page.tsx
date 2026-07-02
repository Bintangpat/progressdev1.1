"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Bell,
  Settings,
  ChevronRight,
  ChevronDown,
  Mail,
  Eye,
  EyeOff,
  UserPlus,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { usersApi } from "@/lib/api";
import { useRouter } from "next/navigation";

type InviteMethod = "email" | "manual";

export default function AddUser() {
  const [inviteMethod, setInviteMethod] = useState<InviteMethod>("email");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const router = useRouter();

  // Form Fields
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [tempPassword, setTempPassword] = useState("");

  // State untuk melacak checkbox yang dipilih agar styling dinamis Tailwind bekerja
  const [workspaces, setWorkspaces] = useState({
    alpha: false,
    beta: false,
    enterprise: false,
  });

  const handleCheckboxChange = (key: keyof typeof workspaces) => {
    setWorkspaces((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg("");

    try {
      const payload = {
        email,
        displayName: fullName,
        role: role || "stakeholder",
        password: inviteMethod === "manual" ? tempPassword : undefined,
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

  // Varian animasi untuk transisi elemen form
  const containerVariants = {
    hidden: { opacity: 0, y: 15 },
    show: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 100 } as const,
    },
  };

  return (
    <div className="flex-1 flex flex-col bg-[#f8f9ff] text-[#0b1c30] font-sans">
      {/* Main Content Canvas */}
      <main className="min-h-[calc(100vh-64px)] flex flex-col py-8 px-8">
        {/* Breadcrumb & Header Cluster */}
        <div className="max-w-[800px] w-full mx-auto mb-6">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-1 text-[12px] font-semibold uppercase tracking-wider text-[#75777d] mb-2"
          >
            <a className="hover:text-[#0058be] transition-colors" href="#">
              User Management
            </a>
            <ChevronRight className="w-3.5 h-3.5 text-[#75777d]" />
            <span className="text-[#0b1c30] font-bold">Add User</span>
          </nav>
          <h1 className="text-[30px] font-bold text-[#091426] tracking-tight">
            New Team Member
          </h1>
          <p className="text-[16px] text-[#45474c] mt-1">
            Provision a new user account and set workspace permissions.
          </p>
        </div>

        {/* Form Container */}
        <motion.div
          className="max-w-[800px] w-full mx-auto bg-white border border-[#c5c6cd] rounded-xl overflow-hidden shadow-sm"
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
                <label
                  className="text-[14px] font-medium text-[#0b1c30]"
                  htmlFor="full_name"
                >
                  Full Name
                </label>
                <input
                  className="border border-[#c5c6cd] rounded-lg p-3 text-[14px] focus:border-[#0058be] focus:ring-2 focus:ring-[#0058be]/20 transition-all outline-none bg-white"
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
                <label
                  className="text-[14px] font-medium text-[#0b1c30]"
                  htmlFor="email"
                >
                  Email Address
                </label>
                <input
                  className="border border-[#c5c6cd] rounded-lg p-3 text-[14px] focus:border-[#0058be] focus:ring-2 focus:ring-[#0058be]/20 transition-all outline-none bg-white"
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

            {/* Section: Role & Team */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-[#e5eeff] pt-6">
              <div className="flex flex-col gap-2">
                <label
                  className="text-[14px] font-medium text-[#0b1c30]"
                  htmlFor="role"
                >
                  Role
                </label>
                <div className="relative">
                  <select
                    className="w-full border border-[#c5c6cd] rounded-lg p-3 text-[14px] focus:border-[#0058be] focus:ring-2 focus:ring-[#0058be]/20 appearance-none transition-all outline-none bg-white pr-10"
                    id="role"
                    name="role"
                    required
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                  >
                    <option value="" disabled>
                      Select a role
                    </option>
                    <option value="admin">Admin</option>
                    <option value="developer">Developer</option>
                    <option value="stakeholder">Stakeholder</option>
                  </select>
                  <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#75777d]" />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label
                  className="text-[14px] font-medium text-[#0b1c30]"
                  htmlFor="department"
                >
                  Team/Department
                </label>
                <div className="relative">
                  <select
                    className="w-full border border-[#c5c6cd] rounded-lg p-3 text-[14px] focus:border-[#0058be] focus:ring-2 focus:ring-[#0058be]/20 appearance-none transition-all outline-none bg-white pr-10"
                    id="department"
                    name="department"
                  >
                    <option value="" disabled selected>
                      Select a team
                    </option>
                    <option value="engineering">Engineering</option>
                    <option value="product">Product</option>
                    <option value="design">Design</option>
                    <option value="qa">Quality Assurance</option>
                  </select>
                  <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#75777d]" />
                </div>
              </div>
            </div>

            {/* Section: Workspace Access */}
            <div className="space-y-2 border-t border-[#e5eeff] pt-6">
              <span className="text-[14px] font-medium text-[#0b1c30]">
                Workspace Access
              </span>
              <p className="text-[12px] text-[#75777d] font-semibold tracking-wide uppercase mb-4">
                Select the environments this user can access.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Alpha */}
                <label
                  className={`flex items-center gap-4 p-4 border rounded-lg cursor-pointer transition-colors group select-none ${
                    workspaces.alpha
                      ? "bg-[#dce9ff] border-[#0058be]"
                      : "border-[#c5c6cd] hover:bg-[#eff4ff]"
                  }`}
                >
                  <input
                    className="w-5 h-5 rounded border-[#c5c6cd] text-[#0058be] focus:ring-[#0058be]"
                    name="workspace"
                    type="checkbox"
                    checked={workspaces.alpha}
                    onChange={() => handleCheckboxChange("alpha")}
                    value="alpha"
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
                    workspaces.beta
                      ? "bg-[#dce9ff] border-[#0058be]"
                      : "border-[#c5c6cd] hover:bg-[#eff4ff]"
                  }`}
                >
                  <input
                    className="w-5 h-5 rounded border-[#c5c6cd] text-[#0058be] focus:ring-[#0058be]"
                    name="workspace"
                    type="checkbox"
                    checked={workspaces.beta}
                    onChange={() => handleCheckboxChange("beta")}
                    value="beta"
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
                    workspaces.enterprise
                      ? "bg-[#dce9ff] border-[#0058be]"
                      : "border-[#c5c6cd] hover:bg-[#eff4ff]"
                  }`}
                >
                  <input
                    className="w-5 h-5 rounded border-[#c5c6cd] text-[#0058be] focus:ring-[#0058be]"
                    name="workspace"
                    type="checkbox"
                    checked={workspaces.enterprise}
                    onChange={() => handleCheckboxChange("enterprise")}
                    value="enterprise"
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
                        ? "bg-[#0058be] text-white shadow-sm"
                        : "text-[#45474c] hover:text-[#091426]"
                    }`}
                    type="button"
                    onClick={() => setInviteMethod("email")}
                  >
                    Email Invite
                  </button>
                  <button
                    className={`px-4 py-1 rounded-full text-[12px] font-semibold transition-all duration-200 ${
                      inviteMethod === "manual"
                        ? "bg-[#0058be] text-white shadow-sm"
                        : "text-[#45474c] hover:text-[#091426]"
                    }`}
                    type="button"
                    onClick={() => setInviteMethod("manual")}
                  >
                    Manual Pass
                  </button>
                </div>
              </div>

              {/* Animasi Transisi Konten Dinamis Berdasarkan Metode Undangan */}
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
                      <p className="text-[14px] text-[#45474c] leading-relaxed">
                        An automated email will be sent to the user with a
                        secure link to set up their account and password. This
                        link expires in 24 hours.
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
                        <label
                          className="text-[14px] font-medium text-[#0b1c30]"
                          htmlFor="temp_password"
                        >
                          Temporary Password
                        </label>
                        <div className="relative max-w-md">
                          <input
                            className="w-full border border-[#c5c6cd] rounded-lg p-3 pr-10 text-[14px] focus:border-[#0058be] focus:ring-2 focus:ring-[#0058be]/20 transition-all outline-none bg-white"
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
              <button
                className="w-full sm:w-auto px-5 py-2.5 text-[14px] font-medium text-[#45474c] hover:bg-[#eff4ff] transition-all rounded-lg"
                type="button"
                onClick={() => router.push("/admin/user-management")}
              >
                Cancel
              </button>

              <button
                className={`w-full sm:w-auto px-6 py-2.5 text-[14px] font-medium rounded-lg shadow-sm transition-all duration-200 flex items-center justify-center gap-2 ${
                  isSuccess
                    ? "bg-emerald-600 text-white shadow-emerald-600/10"
                    : "bg-[#0058be] text-white shadow-[#0058be]/10 hover:shadow-md hover:scale-[1.01] active:scale-[0.99]"
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
              </button>
            </div>
          </form>
        </motion.div>

        {/* Footer / Policy Info Links */}
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
