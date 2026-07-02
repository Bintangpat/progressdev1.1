"use client";

import React from "react";

interface SubTabNavProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

export function SubTabNav({
  activeTab = "Board",
  onTabChange,
}: SubTabNavProps) {
  const tabs = ["Overview", "Lists", "Board", "Timeline", "Files"];

  return (
    <nav className="p-6 flex gap-6 overflow-x-auto hide-scrollbar border-b border-transparent">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onTabChange?.(tab)}
          className={` text-sm font-semibold whitespace-nowrap transition-all border-b-2 cursor-pointer focus:outline-none ${
            tab === activeTab
              ? "text-white border-white"
              : "text-[#c4c7c9] border-transparent hover:text-white"
          }`}
        >
          {tab}
        </button>
      ))}
    </nav>
  );
}
