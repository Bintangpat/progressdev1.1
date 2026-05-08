"use client";

import React from "react";
import {
  LayoutDashboard,
  Network,
  ClipboardList,
  Code2,
  Users,
  Settings as SettingsIcon,
  Bell,
  HelpCircle,
  Search as SearchIcon,
  TrendingUp as TrendingUpIcon,
  Rocket,
  AlertTriangle,
  Bug,
  History as HistoryIcon,
  Terminal as TerminalIcon,
  Zap,
  MoreVertical,
  PlusCircle,
  Plus
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function DashboardOverview() {
  return (
    <div className="flex min-h-screen bg-[#f8f9ff] text-[#0b1c30] font-sans">
      {/* Sidebar */}
      <aside className="w-[280px] h-screen fixed left-0 top-0 flex flex-col py-6 px-4 bg-[#eff4ff] border-r border-[#c5c6cd] z-50">
        <div className="mb-8 px-2">
          <h1 className="text-2xl font-bold text-[#091426] tracking-tight">DevProgress</h1>
          <p className="text-xs font-semibold text-[#45474c] opacity-70 tracking-wider">v2.4.0</p>
        </div>
        <nav className="flex-1 space-y-1">
          <a href="/developer/dashboard" className="flex items-center gap-4 p-4 text-[#0058be] font-bold border-r-4 border-[#0058be] bg-[#d3e4fe] transition-colors active:scale-95 duration-150">
            <LayoutDashboard size={20} />
            <span className="text-sm font-medium">Dashboard</span>
          </a>
          <a href="/developer/project" className="flex items-center gap-4 p-4 rounded-lg text-[#45474c] hover:bg-[#d3e4fe] transition-colors active:scale-95 duration-150">
            <Network size={20} />
            <span className="text-sm font-medium">Projects</span>
          </a>
          <a href="#" className="flex items-center gap-4 p-4 rounded-lg text-[#45474c] hover:bg-[#d3e4fe] transition-colors active:scale-95 duration-150">
            <ClipboardList size={20} />
            <span className="text-sm font-medium">Tasks</span>
          </a>
          <a href="#" className="flex items-center gap-4 p-4 rounded-lg text-[#45474c] hover:bg-[#d3e4fe] transition-colors active:scale-95 duration-150">
            <Code2 size={20} />
            <span className="text-sm font-medium">Repository</span>
          </a>
          <a href="#" className="flex items-center gap-4 p-4 rounded-lg text-[#45474c] hover:bg-[#d3e4fe] transition-colors active:scale-95 duration-150">
            <Users size={20} />
            <span className="text-sm font-medium">Teams</span>
          </a>
          <a href="#" className="flex items-center gap-4 p-4 rounded-lg text-[#45474c] hover:bg-[#d3e4fe] transition-colors active:scale-95 duration-150">
            <SettingsIcon size={20} />
            <span className="text-sm font-medium">Settings</span>
          </a>
        </nav>
        <div className="mt-auto pt-6">
          <button className="w-full py-4 px-6 bg-[#2170e4] text-[#fefcff] rounded-xl text-sm font-medium flex items-center justify-center gap-2 hover:opacity-90 active:scale-95 transition-all">
            <Plus size={18} />
            New Project
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="ml-[280px] flex-1 min-h-screen">
        {/* Top Header */}
        <header className="flex items-center justify-between px-6 h-16 w-full sticky top-0 bg-[#f8f9ff] border-b border-[#c5c6cd] z-40">
          <div className="flex items-center gap-6 flex-1">
            <div className="relative w-full max-w-md">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-[#45474c]" size={18} />
              <input
                className="w-full pl-10 pr-4 py-2 bg-[#eff4ff] border border-[#c5c6cd] rounded-lg focus:outline-none focus:border-[#0058be] transition-all text-sm text-[#0b1c30]"
                placeholder="Search projects, tasks, or docs..."
                type="text"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 text-[#45474c] hover:bg-[#eff4ff] rounded-lg transition-all">
              <Bell size={20} />
            </button>
            <button className="p-2 text-[#45474c] hover:bg-[#eff4ff] rounded-lg transition-all">
              <HelpCircle size={20} />
            </button>
            <div className="h-8 w-px bg-[#c5c6cd] mx-2"></div>
            <div className="flex items-center gap-4 pl-2">
              <Avatar className="w-10 h-10 border border-[#c5c6cd]">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <button className="text-sm font-medium text-[#45474c] hover:text-[#091426] transition-colors">Sign Out</button>
            </div>
          </div>
        </header>

        {/* Canvas */}
        <main className="p-6 max-w-7xl mx-auto space-y-8">
          {/* Page Header */}
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-3xl font-bold text-[#091426] tracking-tight">My Projects</h2>
              <p className="text-base text-[#45474c] mt-1">Overview of your current technical roadmap and team performance.</p>
            </div>
            <button className="px-6 py-3 bg-[#0058be] text-white rounded-lg text-sm font-medium flex items-center gap-2 shadow-sm hover:brightness-110 active:scale-95 transition-all">
              <PlusCircle size={18} />
              New Project
            </button>
          </div>

          {/* Stats Grid */}
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-[#f8f9ff] border-[#c5c6cd] shadow-none">
              <CardContent className="p-6 flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold text-[#45474c] uppercase tracking-wider">Active Projects</p>
                  <h3 className="text-3xl font-bold mt-1 text-[#091426]">12</h3>
                  <p className="text-[#0058be] text-xs font-medium flex items-center gap-1 mt-2">
                    <TrendingUpIcon size={14} />
                    +2 this month
                  </p>
                </div>
                <div className="p-2 bg-[#dce9ff] rounded-lg text-[#0058be]">
                  <Rocket size={20} />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#f8f9ff] border-[#c5c6cd] shadow-none">
              <CardContent className="p-6 flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold text-[#45474c] uppercase tracking-wider">Open Issues</p>
                  <h3 className="text-3xl font-bold mt-1 text-[#091426]">48</h3>
                  <p className="text-[#ba1a1a] text-xs font-medium flex items-center gap-1 mt-2">
                    <AlertTriangle size={14} />
                    5 high priority
                  </p>
                </div>
                <div className="p-2 bg-[#dce9ff] rounded-lg text-[#0058be]">
                  <Bug size={20} />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#f8f9ff] border-[#c5c6cd] shadow-none">
              <CardContent className="p-6 flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold text-[#45474c] uppercase tracking-wider">Recent Commits</p>
                  <h3 className="text-3xl font-bold mt-1 text-[#091426]">256</h3>
                  <p className="text-[#45474c] text-xs font-medium flex items-center gap-1 mt-2">
                    <HistoryIcon size={14} />
                    Last 7 days
                  </p>
                </div>
                <div className="p-2 bg-[#dce9ff] rounded-lg text-[#0058be]">
                  <TerminalIcon size={20} />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#f8f9ff] border-[#c5c6cd] shadow-none">
              <CardContent className="p-6 flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold text-[#45474c] uppercase tracking-wider">Team Velocity</p>
                  <h3 className="text-3xl font-bold mt-1 text-[#091426]">94%</h3>
                  <div className="w-full bg-[#dce9ff] h-1.5 rounded-full mt-6 overflow-hidden">
                    <div className="bg-[#0058be] h-full w-[94%]"></div>
                  </div>
                </div>
                <div className="p-2 bg-[#dce9ff] rounded-lg text-[#0058be]">
                  <Zap size={20} />
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Projects Grid */}
          <section className="grid grid-cols-1 xl:grid-cols-3 gap-6 pb-8">
            <a href="/developer/project/1" className="block outline-none group">
              <Card className="bg-[#f8f9ff] border-[#c5c6cd] shadow-none hover:shadow-md transition-all flex flex-col h-full cursor-pointer h-full">
                <CardContent className="p-6 flex flex-col h-full">
                  <div className="flex justify-between items-start mb-4">
                    <span className="px-2 py-1 bg-[#d3e4fe] text-[#0058be] text-xs font-semibold rounded-lg">In Progress</span>
                    <button className="text-[#45474c] hover:text-[#091426] transition-colors">
                      <MoreVertical size={20} />
                    </button>
                  </div>
                  <h4 className="text-xl font-semibold text-[#091426] mb-2">E-commerce Mobile App</h4>
                  <p className="text-sm text-[#45474c] mb-6 line-clamp-2">Redesigning the core customer journey for high-conversion shopping experiences on iOS and Android.</p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    <span className="px-2 py-0.5 bg-[#eff4ff] text-[#45474c] font-mono text-[13px] border border-[#c5c6cd] rounded">React Native</span>
                    <span className="px-2 py-0.5 bg-[#eff4ff] text-[#45474c] font-mono text-[13px] border border-[#c5c6cd] rounded">Firebase</span>
                  </div>
                  <div className="mt-auto space-y-4">
                    <div>
                      <div className="flex justify-between text-xs font-medium text-[#45474c] mb-1">
                        <span>Development Progress</span>
                        <span>65%</span>
                      </div>
                      <div className="h-2 w-full bg-[#dce9ff] rounded-full overflow-hidden">
                        <div className="bg-[#0058be] h-full w-[65%] rounded-full"></div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-[#c5c6cd]">
                      <div className="flex -space-x-2">
                        <Avatar className="w-8 h-8 border-2 border-[#f8f9ff]">
                          <AvatarImage src="https://github.com/shadcn.png" />
                        </Avatar>
                        <Avatar className="w-8 h-8 border-2 border-[#f8f9ff]">
                          <AvatarFallback>JD</AvatarFallback>
                        </Avatar>
                        <div className="w-8 h-8 rounded-full border-2 border-[#f8f9ff] bg-[#d3e4fe] flex items-center justify-center text-xs font-medium text-[#0058be]">+3</div>
                      </div>
                      <span className="text-xs font-medium text-[#45474c] italic">Updated 2h ago</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </a>
            
            <a href="/developer/project/2" className="block outline-none group">
              <Card className="bg-[#f8f9ff] border-[#c5c6cd] shadow-none hover:shadow-md transition-all flex flex-col h-full cursor-pointer h-full">
                <CardContent className="p-6 flex flex-col h-full">
                  <div className="flex justify-between items-start mb-4">
                    <span className="px-2 py-1 bg-[#eff4ff] text-[#45474c] text-xs font-semibold rounded-lg">On Hold</span>
                    <button className="text-[#45474c] hover:text-[#091426] transition-colors">
                      <MoreVertical size={20} />
                    </button>
                  </div>
                  <h4 className="text-xl font-semibold text-[#091426] mb-2">Internal Analytics Tool</h4>
                  <p className="text-sm text-[#45474c] mb-6 line-clamp-2">Real-time data visualization dashboard for tracking server performance and user engagement metrics.</p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    <span className="px-2 py-0.5 bg-[#eff4ff] text-[#45474c] font-mono text-[13px] border border-[#c5c6cd] rounded">Vue.js</span>
                    <span className="px-2 py-0.5 bg-[#eff4ff] text-[#45474c] font-mono text-[13px] border border-[#c5c6cd] rounded">Python</span>
                  </div>
                  <div className="mt-auto space-y-4">
                    <div>
                      <div className="flex justify-between text-xs font-medium text-[#45474c] mb-1">
                        <span>Development Progress</span>
                        <span>30%</span>
                      </div>
                      <div className="h-2 w-full bg-[#dce9ff] rounded-full overflow-hidden">
                        <div className="bg-[#c5c6cd] h-full w-[30%] rounded-full"></div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-[#c5c6cd]">
                      <div className="flex -space-x-2">
                        <Avatar className="w-8 h-8 border-2 border-[#f8f9ff]">
                          <AvatarImage src="https://github.com/shadcn.png" />
                        </Avatar>
                      </div>
                      <span className="text-xs font-medium text-[#45474c] italic">Updated yesterday</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </a>

            <a href="/developer/project/3" className="block outline-none group">
              <Card className="bg-[#f8f9ff] border-b-4 border-b-[#0058be] border-[#c5c6cd] shadow-none hover:shadow-md transition-all flex flex-col h-full cursor-pointer h-full">
                <CardContent className="p-6 flex flex-col h-full">
                  <div className="flex justify-between items-start mb-4">
                    <span className="px-2 py-1 bg-green-50 text-green-700 border border-green-100 text-xs font-semibold rounded-lg">Completed</span>
                    <button className="text-[#45474c] hover:text-[#091426] transition-colors">
                      <MoreVertical size={20} />
                    </button>
                  </div>
                  <h4 className="text-xl font-semibold text-[#091426] mb-2">Payment API Integration</h4>
                  <p className="text-sm text-[#45474c] mb-6 line-clamp-2">Legacy payment gateway migration to Stripe Connect for multi-vendor marketplace support.</p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    <span className="px-2 py-0.5 bg-[#eff4ff] text-[#45474c] font-mono text-[13px] border border-[#c5c6cd] rounded">Node.js</span>
                    <span className="px-2 py-0.5 bg-[#eff4ff] text-[#45474c] font-mono text-[13px] border border-[#c5c6cd] rounded">PostgreSQL</span>
                  </div>
                  <div className="mt-auto space-y-4">
                    <div>
                      <div className="flex justify-between text-xs font-medium text-[#45474c] mb-1">
                        <span>Development Progress</span>
                        <span>100%</span>
                      </div>
                      <div className="h-2 w-full bg-[#dce9ff] rounded-full overflow-hidden">
                        <div className="bg-[#0058be] h-full w-[100%] rounded-full"></div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-[#c5c6cd]">
                      <div className="flex -space-x-2">
                        <Avatar className="w-8 h-8 border-2 border-[#f8f9ff]">
                          <AvatarImage src="https://github.com/shadcn.png" />
                        </Avatar>
                        <Avatar className="w-8 h-8 border-2 border-[#f8f9ff]">
                          <AvatarFallback>TK</AvatarFallback>
                        </Avatar>
                      </div>
                      <span className="text-xs font-medium text-[#45474c] italic">Updated 3 days ago</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </a>
          </section>
        </main>
      </div>
    </div>
  );
}
