import { LayoutDashboard, Users, FolderKanban, ListTodo, Settings, LogOut } from "lucide-react";

export const NAVIGATION_CONFIG = {
  admin: [
    {
      title: "Dashboard",
      url: "/admin/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "User Management",
      url: "/admin/user-management",
      icon: Users,
    },
    {
      title: "Settings",
      url: "/admin/settings",
      icon: Settings,
    },
  ],
  developer: [
    {
      title: "Dashboard",
      url: "/developer/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Projects",
      url: "/developer/projects",
      icon: FolderKanban,
    },
    {
      title: "Tasks",
      url: "/developer/tasks",
      icon: ListTodo,
    },
    {
      title: "Settings",
      url: "/developer/settings",
      icon: Settings,
    },
  ],
  stakeholder: [
    {
      title: "Dashboard",
      url: "/stakeholder/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Projects",
      url: "/stakeholder/projects",
      icon: FolderKanban,
    },
    {
      title: "Settings",
      url: "/stakeholder/settings",
      icon: Settings,
    },
  ],
};

export type Role = keyof typeof NAVIGATION_CONFIG;
