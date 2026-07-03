"use client";

import React, { useState } from "react";
import Head from "next/head";
import Image from "next/image";
import {
  Terminal,
  Users,
  LayoutDashboard,
  Kanban,
  Flag,
  Plus,
  Settings,
  LogOut,
  Search,
  Bell,
  HelpCircle,
  UserPlus,
  Shield,
  Mail,
  Filter,
  ArrowUpDown,
  Edit2,
  Trash2,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { usersApi, ApiProfile } from "@/lib/api";
import { DataTable } from "@/components/data-table";
import { columns } from "./columns";

export default function UserManagementPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState<ApiProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  React.useEffect(() => {
    usersApi
      .getAll()
      .then((data) => {
        setUsers(data);
        setIsLoading(false);
      })
      .catch(console.error);
  }, []);

  const admins = users.filter((u) => u.role === "admin").length;
  const developers = users.filter((u) => u.role === "developer").length;
  const stakeholders = users.filter((u) => u.role === "stakeholder").length;

  return (
    <div className="flex min-h-screen bg-background font-sans text-[#0b1c30]">
      {/* Main Content Area */}
      <main className="flex-1 flex flex-col">
        {/* Canvas Area */}
        <div className="p-8 max-w-7xl mx-auto w-full">
          {/* Page Title */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <h1 className="text-3xl font-bold text-foreground">
                User Management
              </h1>
              <p className="text-foreground mt-1">
                Provision and manage access controls for the DevProgress
                environment.
              </p>
            </motion.div>
            <Link href="/admin/user-management/create-user">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-primary text-primary-foreground hover:bg-chart-3 px-6 py-2.5 rounded-lg font-bold flex items-center gap-2 shadow-lg shadow-primary transition-all"
              >
                <UserPlus size={18} />
                <span>Add User</span>
              </motion.button>
            </Link>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <StatCard
              label="Total Users"
              value={users.length.toString()}
              trend="+2"
            />
            <StatCard
              label="Developers"
              value={developers.toString()}
              activePulse
            />
            <StatCard
              label="Admins"
              value={admins.toString()}
              icon={<Shield size={20} />}
            />
            <StatCard
              label="Stakeholders"
              value={stakeholders.toString()}
              icon={<Mail size={20} />}
            />
          </div>

          {/* Data Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card border border-border rounded-xl overflow-hidden shadow-sm"
          >
            {isLoading ? (
              <div className="text-center py-24 text-[#75777d]">
                Loading users...
              </div>
            ) : (
              <DataTable
                columns={columns}
                data={users}
                filterColumnId="email"
                filterPlaceholder="Search by email..."
                meta={{
                  refreshData: () => {
                    usersApi.getAll().then(setUsers).catch(console.error);
                  },
                }}
              />
            )}
          </motion.div>

          {/* Bottom Bento Grid */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 bg-[#1e293b] text-white p-8 rounded-xl relative overflow-hidden flex flex-col justify-between min-h-[240px]">
              <div className="relative z-10">
                <h3 className="text-2xl font-bold mb-2">
                  Access Control Audit
                </h3>
                <p className="max-w-md opacity-80 mb-6 text-sm">
                  Review detailed logs of all permission changes and user
                  creations within the last 24 hours. Ensuring compliance with
                  ISO 27001 standards.
                </p>
                <button className="bg-[#0058be] text-white px-6 py-2.5 rounded-lg font-bold inline-flex items-center gap-2 hover:brightness-110 transition-all">
                  View Audit Logs <ArrowRight size={18} />
                </button>
              </div>
              <div className="absolute right-[-20px] top-1/2 -translate-y-1/2 pointer-events-none opacity-10">
                <ShieldCheck size={200} />
              </div>
            </div>

            <div className="bg-[#e5eeff] p-8 rounded-xl flex flex-col items-center justify-center text-center border border-[#c5c6cd]">
              <div className="w-16 h-16 rounded-full bg-[#0058be]/10 flex items-center justify-center mb-4 text-[#0058be]">
                <Mail size={32} />
              </div>
              <h3 className="text-lg font-bold text-[#091426] mb-1">
                Invite Team
              </h3>
              <p className="text-sm text-foreground mb-6">
                Send bulk invitations to your engineering organization.
              </p>
              <button className="w-full py-2.5 rounded-lg border-2 border-[#0058be] text-[#0058be] font-bold hover:bg-[#0058be]/5 transition-colors">
                Send Invites
              </button>
            </div>
          </div>
        </div>

        <footer className="mt-auto px-8 py-6 text-center border-t border-[#c5c6cd]">
          <p className="text-xs font-semibold text-[#75777d] uppercase tracking-widest">
            © 2026 DevProgress Infrastructure. Precision Technical Execution
            Platform.
          </p>
        </footer>
      </main>
    </div>
  );
}

function StatCard({
  label,
  value,
  trend,
  activePulse,
  icon,
}: {
  label: string;
  value: string;
  trend?: string;
  activePulse?: boolean;
  icon?: React.ReactNode;
}) {
  return (
    <div className="bg-card p-5 h-32 flex flex-col justify-between border-border border-1 rounded-xl shadow-sm">
      <p className="text-sm font-bold text-foreground uppercase tracking-[0.15em] mb-1">
        {label}
      </p>
      <div className="flex items-center justify-between">
        <span className="text-4xl font-bold text-foreground tracking-tight">
          {value}
        </span>
        {trend && (
          <span className="text-[#0058be] bg-blue-50 px-1.5 py-0.5 rounded text-[11px] font-bold">
            {trend}
          </span>
        )}
        {activePulse && (
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
        )}
        {icon && <div className="text-[#75777d]">{icon}</div>}
      </div>
    </div>
  );
}
