"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ApiProject } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Ellipsis, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { projectsApi } from "@/lib/api";

const formatRupiah = (num: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(num);
};

const getHealthStatus = (proj: ApiProject) => {
  if (proj.status === "completed") return "Completed";
  if (proj.status === "draft") return "Draft";
  const end = new Date(proj.durationEnd).getTime();
  const now = new Date().getTime();
  if (proj.status === "active" && end < now) return "Delayed";
  return "On Track";
};

export const columns: ColumnDef<ApiProject>[] = [
  {
    accessorKey: "platformName",
    header: "Project Name",
    cell: ({ row }) => {
      const proj = row.original;
      return (
        <div className="flex flex-col">
          <span className="text-sm font-bold text-[#091426]">
            {proj.platformName}
          </span>
          <span className="text-[12px] text-foreground">
            Budget: {formatRupiah(proj.budget)}
          </span>
        </div>
      );
    },
  },
  {
    id: "health",
    header: "Health",
    cell: ({ row }) => {
      const proj = row.original;
      const health = getHealthStatus(proj);

      const styles: any = {
        "On Track": "bg-green-50 text-green-700",
        Completed: "bg-blue-50 text-blue-700",
        Draft: "bg-gray-50 text-gray-700",
        Delayed: "bg-[#ffdad6] text-[#93000a]",
      };
      const dots: any = {
        "On Track": "bg-green-600",
        Completed: "bg-blue-600",
        Draft: "bg-gray-600",
        Delayed: "bg-[#ba1a1a]",
      };

      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${styles[health] || ""}`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${dots[health] || ""}`}></span>
          {health}
        </span>
      );
    },
  },
  {
    id: "team",
    header: "Team Members",
    cell: ({ row }) => {
      const proj = row.original;
      const membersCount = proj.teamMembers?.length || 0;

      return (
        <div className="flex -space-x-2">
          {[...Array(Math.min(membersCount, 3))].map((_, i) => (
            <div
              key={i}
              className="w-8 h-8 rounded-full border-2 border-white bg-gray-200 relative overflow-hidden flex items-center justify-center text-[10px] font-bold shadow-xs"
            >
              {proj.teamMembers?.[i]?.profile?.displayName
                ?.substring(0, 2)
                .toUpperCase() || "MB"}
            </div>
          ))}
          {membersCount > 3 && (
            <div className="w-8 h-8 rounded-full border-2 border-white bg-[#e5eeff] flex items-center justify-center text-[10px] font-bold text-foreground shadow-xs">
              +{membersCount - 3}
            </div>
          )}
          {membersCount === 0 && (
            <span className="text-xs text-[#75777d] italic">No members</span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "progress",
    header: "Progress",
    cell: ({ row }) => {
      const proj = row.original;
      const health = getHealthStatus(proj);
      const progress = proj.progress || 0;

      return (
        <div className="flex flex-col gap-1.5 w-40">
          <span className="text-[11px] font-bold text-foreground">
            {progress}%
          </span>
          <div className="w-full h-1.5 bg-[#e5eeff] rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${health === "Delayed" ? "bg-[#ba1a1a]" : "bg-[#0058be]"}`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "durationEnd",
    header: "Deadline",
    cell: ({ row }) => {
      const dateString = row.getValue("durationEnd") as string;
      try {
        return (
          <span className="text-sm text-foreground">
            {new Date(dateString).toLocaleDateString("id-ID", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </span>
        );
      } catch {
        return dateString;
      }
    },
  },
  {
    id: "actions",
    header: () => <div className="text-right">Action</div>,
    cell: ({ row, table }) => {
      const proj = row.original;
      const meta = table.options.meta as any;

      const handleDelete = async () => {
        if (confirm(`Are you sure you want to delete project: ${proj.platformName}?`)) {
          try {
            await projectsApi.delete(proj.id);
            toast.success("Project deleted successfully");
            if (meta && typeof meta.refresh === "function") {
              meta.refresh();
            }
          } catch (err: any) {
            toast.error(err.message || "Failed to delete project");
          }
        }
      };

      return (
        <div className="text-right">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-[#e5eeff] cursor-pointer">
                <Ellipsis className="h-4.5 w-4.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-white">
              <DropdownMenuItem
                onClick={handleDelete}
                className="text-red-600 focus:text-red-700 cursor-pointer flex items-center gap-2"
              >
                <Trash2 size={14} />
                <span>Delete Project</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
