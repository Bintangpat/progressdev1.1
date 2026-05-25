"use client";

import * as React from "react";
import { signOut } from "next-auth/react";
import { useAuth } from "@/hooks/useAuth";
import { NAVIGATION_CONFIG, Role } from "@/config/navigation";
import { Button } from "./ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar";
import {
  LogOut,
  LayoutDashboard,
  ChevronDown,
  GalleryVerticalEnd,
  Users,
  Briefcase,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

// Dummy data for Developer Role
const DUMMY_TEAMS = [
  { name: "Squad Alpha", role: "Fullstack" },
  { name: "Squad Beta", role: "DevOps" },
];

const DUMMY_PROJECTS = [
  { name: "Progress Dev 1.1", url: "/developer/projects/1" },
  { name: "Mobile App X", url: "/developer/projects/2" },
  { name: "Admin Panel Y", url: "/developer/projects/3" },
];

export function AppSidebar() {
  const { role, user } = useAuth();
  const pathname = usePathname();

  // Get navigation for current role
  const navItems =
    NAVIGATION_CONFIG[role as Role] || NAVIGATION_CONFIG.stakeholder;

  const handleLogout = () => {
    signOut({ callbackUrl: "/auth/login" });
  };

  return (
    <Sidebar variant="sidebar" collapsible="icon">
      <SidebarHeader className="p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            {role === "developer" ? (
              <Collapsible className="group/collapsible">
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton
                    size="lg"
                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                  >
                    <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                      <GalleryVerticalEnd className="size-4" />
                    </div>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-medium">Acme Corp</span>
                      <span className="truncate text-xs">Development Team</span>
                    </div>
                    <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    <SidebarGroupLabel className="px-2 py-1 text-[10px]">
                      TEAM MEMBERS
                    </SidebarGroupLabel>
                    {DUMMY_TEAMS.map((team) => (
                      <SidebarMenuSubItem key={team.name}>
                        <SidebarMenuSubButton className="h-8">
                          <Users className="size-3 mr-2 text-muted-foreground" />
                          <div className="flex flex-col">
                            <span className="text-xs">{team.name}</span>
                            <span className="text-[10px] text-muted-foreground">
                              {team.role}
                            </span>
                          </div>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </Collapsible>
            ) : (
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <LayoutDashboard className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">DevProgress</span>
                  <span className="truncate text-xs capitalize">{role}</span>
                </div>
              </SidebarMenuButton>
            )}
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup className="p-4">
          <SidebarGroupLabel>Menu Utama</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                // Special case for Developer Projects dropdown
                if (role === "developer" && item.title === "Projects") {
                  return (
                    <Collapsible
                      key={item.title}
                      asChild
                      defaultOpen
                      className="group/collapsible-nav"
                    >
                      <SidebarMenuItem>
                        <CollapsibleTrigger asChild>
                          <SidebarMenuButton tooltip={item.title}>
                            <item.icon className="size-4" />
                            <span>{item.title}</span>
                            <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible-nav:rotate-180" />
                          </SidebarMenuButton>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <SidebarMenuSub>
                            {DUMMY_PROJECTS.map((proj) => (
                              <SidebarMenuSubItem key={proj.name}>
                                <SidebarMenuSubButton asChild>
                                  <Link
                                    href={proj.url}
                                    className={
                                      pathname === proj.url
                                        ? "text-primary font-medium"
                                        : ""
                                    }
                                  >
                                    <Briefcase className="size-3 mr-2" />
                                    <span>{proj.name}</span>
                                  </Link>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            ))}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </SidebarMenuItem>
                    </Collapsible>
                  );
                }

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === item.url}
                      tooltip={item.title}
                    >
                      <Link href={item.url}>
                        <item.icon className="size-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleLogout}
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
              tooltip="Logout"
            >
              <LogOut className="size-4" />
              <span>Keluar</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
