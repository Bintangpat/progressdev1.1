"use client";

import React from "react";
import { Search, ChevronDown, ArrowUpDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface SearchFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  priorityFilter: string;
  setPriorityFilter: (filter: string) => void;
  sortOrder: "asc" | "desc" | "none";
  setSortOrder: (order: "asc" | "desc" | "none") => void;
}

export function SearchFilters({
  searchQuery,
  setSearchQuery,
  priorityFilter,
  setPriorityFilter,
  sortOrder,
  setSortOrder,
}: SearchFiltersProps) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1 hide-scrollbar">
      {/* Search Input bar */}
      <div className="relative min-w-[220px]">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8e9193] size-[15px]"
        />
        <input
          type="text"
          placeholder="Search tasks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-[#1A1A1A] border border-[#333333] rounded-lg py-1.5 pl-9 pr-12 text-sm text-white placeholder-[#9CA3AF] focus:ring-1 focus:ring-white focus:border-white focus:outline-none h-8 transition-all"
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center justify-center px-1.5 py-0.5 rounded bg-[#1c1b1b] border border-[#444749] text-[9px] text-[#c4c7c9] font-mono select-none">
          ⌘F
        </div>
      </div>

      {/* Priority Filters Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center gap-1.5 bg-[#1A1A1A] border border-[#333333] rounded-lg px-3 h-8 text-xs text-[#c4c7c9] hover:text-white transition-colors whitespace-nowrap cursor-pointer">
            <span>Priority: {priorityFilter}</span>
            <ChevronDown className="size-3.5" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="bg-[#1a1a1a] border-[#333333] text-white">
          {["All", "High", "Medium"].map((priority) => (
            <DropdownMenuItem
              key={priority}
              onClick={() => setPriorityFilter(priority)}
              className="focus:bg-[#2a2a2a] cursor-pointer text-xs"
            >
              {priority}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Sorting Control */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center gap-1.5 bg-[#1A1A1A] border border-[#333333] rounded-lg px-3 h-8 text-xs text-[#c4c7c9] hover:text-white transition-colors whitespace-nowrap cursor-pointer">
            <ArrowUpDown className="size-3.5" />
            <span>Sort: {sortOrder === "none" ? "Default" : sortOrder === "asc" ? "A-Z" : "Z-A"}</span>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="bg-[#1a1a1a] border-[#333333] text-white">
          <DropdownMenuItem
            onClick={() => setSortOrder("none")}
            className="focus:bg-[#2a2a2a] cursor-pointer text-xs"
          >
            Default Order
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setSortOrder("asc")}
            className="focus:bg-[#2a2a2a] cursor-pointer text-xs"
          >
            Alphabetical A-Z
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setSortOrder("desc")}
            className="focus:bg-[#2a2a2a] cursor-pointer text-xs"
          >
            Alphabetical Z-A
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
