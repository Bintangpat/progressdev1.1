"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "@/app/actions/auth";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { Activity, LayoutDashboard, LogOut, Menu, X } from "lucide-react";
import type { User } from "@supabase/supabase-js";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
];

export function DashboardShell({
  children,
  user,
}: {
  children: React.ReactNode;
  user: User;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-50 h-full w-64 border-r border-white/10 bg-card/95 backdrop-blur-xl transition-transform duration-300 lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex items-center gap-3 border-b border-white/10 px-6 py-5">
            <div className="p-1.5 rounded-lg bg-linear-to-br from-violet-500 to-indigo-600 shadow-lg shadow-violet-500/20">
              <Activity className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-lg bg-linear-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
              DevProgress
            </span>
            <button
              className="ml-auto lg:hidden text-muted-foreground hover:text-foreground"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-3 py-4">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-violet-500/10 text-violet-400 shadow-sm"
                      : "text-muted-foreground hover:bg-white/5 hover:text-foreground",
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* User & Logout */}
          <div className="border-t border-white/10 px-4 py-4 space-y-3">
            <div className="flex items-center gap-3 px-2">
              <div className="h-8 w-8 rounded-full bg-linear-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-xs font-bold text-white">
                {user.email?.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user.email}</p>
              </div>
            </div>
            <form action={logout}>
              <Button
                type="submit"
                variant="ghost"
                className="w-full justify-start text-muted-foreground hover:text-red-400 hover:bg-red-500/10"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </form>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex items-center gap-4 border-b border-white/10 bg-background/80 backdrop-blur-xl px-6 py-4 lg:px-8">
          <button
            className="lg:hidden text-muted-foreground hover:text-foreground"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex-1" />
          <ThemeToggle />
        </header>

        <main className="p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
