"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Search,
  Plus,
  LayoutGrid,
  AlertCircle,
  RefreshCw,
  User,
  Loader2,
  FolderOpen,
} from "lucide-react";
import { DashboardStats } from "@/components/developer/dashboard-stats";
import { ProjectCard } from "@/components/developer/project-card";
import { ProjectDialog } from "@/components/developer/project-dialog";
import { toast } from "sonner";
import {
  ApiProject,
  projectsApi,
  calcProjectProgress,
  CreateProjectPayload,
  UpdateProjectPayload,
} from "@/lib/api";
import { useSession } from "next-auth/react";

export default function ProjectDashboard() {
  const { data: session } = useSession();
  const user = session?.user as any;

  // ── State ──
  const [projects, setProjects] = useState<ApiProject[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"create" | "edit" | "delete">(
    "create",
  );
  const [selectedProject, setSelectedProject] = useState<ApiProject | null>(
    null,
  );

  // ── Fetch projects dari backend ──
  const fetchProjects = useCallback(async () => {
    setIsLoadingData(true);
    setFetchError(null);
    try {
      const data = await projectsApi.getAll();
      setProjects(data);
    } catch (err: any) {
      setFetchError(err.message || "Gagal memuat project");
      toast.error("Gagal memuat data project");
    } finally {
      setIsLoadingData(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  // ── Computed stats ──
  const totalProjects = projects.length;
  const activeSprints = projects.filter((p) => p.status === "active").length;
  const atRiskCount = projects.filter((p) => {
    if (p.status === "completed") return false;
    return new Date(p.durationEnd) < new Date();
  }).length;

  // ── Dialog handlers ──
  const handleOpenCreateDialog = () => {
    setDialogMode("create");
    setSelectedProject(null);
    setDialogOpen(true);
  };

  const handleOpenEditDialog = (project: ApiProject) => {
    setDialogMode("edit");
    setSelectedProject(project);
    setDialogOpen(true);
  };

  const handleOpenDeleteDialog = (id: string) => {
    const project = projects.find((p) => p.id === id);
    if (project) {
      setDialogMode("delete");
      setSelectedProject(project);
      setDialogOpen(true);
    }
  };

  const handleDialogSubmit = async (
    data: CreateProjectPayload | UpdateProjectPayload,
  ) => {
    setIsSubmitting(true);
    try {
      if (dialogMode === "create") {
        const newProject = await projectsApi.create(
          data as CreateProjectPayload,
        );
        setProjects((prev) => [newProject, ...prev]);
        toast.success("Project berhasil dibuat!");
      } else if (dialogMode === "edit" && selectedProject) {
        const updated = await projectsApi.update(
          selectedProject.id,
          data as UpdateProjectPayload,
        );
        setProjects((prev) =>
          prev.map((p) => (p.id === selectedProject.id ? updated : p)),
        );
        toast.success("Project berhasil diperbarui!");
      }
      setDialogOpen(false);
    } catch (err: any) {
      toast.error(err.message || "Terjadi kesalahan");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmDelete = async (id: string) => {
    setIsSubmitting(true);
    try {
      await projectsApi.delete(id);
      setProjects((prev) => prev.filter((p) => p.id !== id));
      toast.success("Project berhasil dihapus!");
      setDialogOpen(false);
    } catch (err: any) {
      toast.error(err.message || "Gagal menghapus project");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Filter projects ──
  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.platformName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.stakeholderName.toLowerCase().includes(searchQuery.toLowerCase());

    if (activeFilter === "All") return matchesSearch;
    if (activeFilter === "Active")
      return matchesSearch && project.status === "active";
    if (activeFilter === "Completed")
      return matchesSearch && project.status === "completed";
    if (activeFilter === "Draft")
      return matchesSearch && project.status === "draft";
    return matchesSearch;
  });

  // ── Username display ──
  const userInitials = user?.name
    ? user.name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "DV";

  return (
    <div className="bg-[#131313] text-[#e5e2e1] min-h-screen antialiased flex flex-col font-sans selection:bg-primary/20">
      {/* TopAppBar */}
      <header className="bg-[#131313] text-white border-b border-[#353434] w-full sticky top-0 z-30 backdrop-blur-md bg-opacity-80">
        <div className="flex justify-between items-center h-16 px-6 max-w-7xl mx-auto w-full">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-semibold tracking-tight text-white">
              Project Hub
            </h1>
            <span className="text-xs bg-[#2a2a2a] text-[#c4c7c9] px-2 py-0.5 rounded border border-[#353434] hidden sm:inline-block">
              v2.1.0
            </span>
          </div>

          {/* Center Search Bar (Desktop) */}
          <div className="relative hidden md:block w-96">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#c4c7c9] size-4" />
            <input
              type="text"
              placeholder="Cari project atau klien..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#1a1a1a] border border-[#333333] text-[#e5e2e1] text-sm rounded-lg pl-9 pr-4 py-1.5 focus:outline-none focus:border-white focus:ring-1 focus:ring-white placeholder-[#9ca3af] transition-all"
            />
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={handleOpenCreateDialog}
              className="bg-white text-[#141414] text-sm font-medium px-4 py-1.5 rounded-lg hover:bg-opacity-90 transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <Plus className="size-4" /> New Project
            </button>
            <div className="size-8 rounded-full bg-[#353434] flex items-center justify-center border border-[#444749] overflow-hidden cursor-pointer">
              <span className="text-xs font-bold text-white">
                {userInitials}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="grow px-4 md:px-8 py-8 w-full max-w-7xl mx-auto pb-24 md:pb-12">
        <div className="flex flex-col gap-8">
          {/* Header */}
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-white md:text-3xl">
              All Projects
            </h2>
            <p className="text-sm text-[#c4c7c9] mt-1">
              Overview produksi aktif dan status sprint untuk semua klien.
            </p>
          </div>

          {/* Stats */}
          <DashboardStats
            totalProjects={totalProjects}
            activeSprints={activeSprints}
            atRiskCount={atRiskCount}
          />

          {/* Controls */}
          <section className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pt-2">
            <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
              {["All", "Active", "Draft", "Completed"].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-all whitespace-nowrap cursor-pointer ${
                    activeFilter === filter
                      ? "bg-white text-[#141414] border-white"
                      : "bg-transparent text-[#c4c7c9] border-[#333333] hover:border-[#8e9193]"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>

            {/* Mobile Search */}
            <div className="w-full md:hidden relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#c4c7c9] size-4" />
              <input
                type="text"
                placeholder="Cari project..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#1a1a1a] border border-[#333333] text-[#e5e2e1] text-sm rounded-lg pl-9 pr-4 py-2 focus:outline-none focus:border-white placeholder-[#9ca3af]"
              />
            </div>
          </section>

          {/* Project Grid / States */}
          {isLoadingData ? (
            /* Loading Skeleton */
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-[#1c1b1b] border border-[#333333] rounded-xl h-52 animate-pulse"
                />
              ))}
            </section>
          ) : fetchError ? (
            /* Error State */
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <AlertCircle className="size-10 text-red-400" />
              <p className="text-[#c4c7c9] text-sm text-center">{fetchError}</p>
              <button
                onClick={fetchProjects}
                className="flex items-center gap-2 px-4 py-2 border border-[#333333] rounded-lg text-[#c4c7c9] hover:text-white hover:border-white text-sm transition-all cursor-pointer"
              >
                <RefreshCw className="size-4" /> Coba Lagi
              </button>
            </div>
          ) : filteredProjects.length === 0 ? (
            /* Empty State */
            <div className="flex flex-col items-center justify-center py-24 gap-3">
              <FolderOpen className="size-10 text-[#444749]" />
              <p className="text-[#c4c7c9] text-sm text-center">
                {searchQuery
                  ? "Tidak ada project yang cocok dengan pencarian."
                  : "Belum ada project. Buat project pertamamu!"}
              </p>
              {!searchQuery && (
                <button
                  onClick={handleOpenCreateDialog}
                  className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded-lg text-sm font-medium hover:bg-white/90 transition-all cursor-pointer"
                >
                  <Plus className="size-4" /> Buat Project
                </button>
              )}
            </div>
          ) : (
            /* Project Grid */
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  progress={calcProjectProgress(project.tasks ?? [])}
                  onEdit={handleOpenEditDialog}
                  onDelete={handleOpenDeleteDialog}
                />
              ))}
            </section>
          )}
        </div>
      </main>

      {/* Bottom Floating Navigation (Mobile Only) */}
      <nav className="md:hidden bg-[#0e0e0e] border-t border-[#333333] fixed bottom-0 left-0 right-0 z-50 shadow-lg">
        <div className="flex justify-around items-center h-16">
          <button className="flex flex-col items-center justify-center text-white focus:outline-none cursor-pointer">
            <LayoutGrid className="size-5 text-white" />
            <span className="text-[10px] mt-1 font-medium">Board</span>
          </button>
          <button className="flex flex-col items-center justify-center text-[#c4c7c9] opacity-60 hover:opacity-100 transition-all focus:outline-none cursor-pointer">
            <AlertCircle className="size-5" />
            <span className="text-[10px] mt-1 font-medium">Issues</span>
          </button>
          <button className="flex flex-col items-center justify-center text-[#c4c7c9] opacity-60 hover:opacity-100 transition-all focus:outline-none cursor-pointer">
            <RefreshCw className="size-5" />
            <span className="text-[10px] mt-1 font-medium">Timeline</span>
          </button>
          <button className="flex flex-col items-center justify-center text-[#c4c7c9] opacity-60 hover:opacity-100 transition-all focus:outline-none cursor-pointer">
            <User className="size-5" />
            <span className="text-[10px] mt-1 font-medium">Profile</span>
          </button>
        </div>
      </nav>

      {/* Project Dialog */}
      <ProjectDialog
        isOpen={dialogOpen}
        onClose={() => setDialogOpen(false)}
        mode={dialogMode}
        project={selectedProject}
        isLoading={isSubmitting}
        onSubmit={handleDialogSubmit}
        onConfirmDelete={handleConfirmDelete}
      />
    </div>
  );
}
