"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, MessageSquare } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export interface ActivityItem {
  id: string;
  type: "comment" | "status" | "create";
  title: string;
  time: string;
  subtitle: string;
  linkText: string;
  commentText?: string;
  tags?: { label: string; type: "error" | "neutral" }[];
}

interface ActivityFeedProps {
  activities: ActivityItem[];
}

export function ActivityFeed({ activities }: ActivityFeedProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="flex flex-col gap-4"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-white tracking-wide">
          Recent Activity Feed
        </h3>
        <button className="text-xs font-medium text-[#c4c7c9] hover:text-white flex items-center gap-1 transition-colors group cursor-pointer">
          <span>View All System Logs</span>
          <ArrowRight
            size={12}
            className="transform group-hover:translate-x-0.5 transition-transform"
          />
        </button>
      </div>

      <Card className="bg-[#1A1A1A] border-[#333333] rounded-2xl overflow-hidden shadow-md">
        <CardContent className="p-0">
          {activities.map((activity, index) => (
            <div
              key={activity.id}
              className={`p-4 md:p-5 hover:bg-[#222222] transition-colors flex gap-4 ${
                index !== activities.length - 1 ? "border-b border-[#333333]" : ""
              }`}
            >
              {/* timeline marker vertical line */}
              <div className="relative pt-1 flex-shrink-0">
                <div
                  className={`size-2 rounded-full ${
                    activity.type === "comment" ? "bg-white" : "bg-[#444749]"
                  } mt-1.5 ring-4 ring-[#1A1A1A] z-10 relative`}
                />
                {index !== activities.length - 1 && (
                  <div className="absolute top-4 bottom-[-24px] left-[3.5px] w-px bg-[#333333] z-0" />
                )}
              </div>

              {/* Log context details */}
              <div className="flex-1 min-w-0 flex flex-col gap-1">
                <div className="flex items-baseline justify-between gap-4">
                  <p className="text-sm font-semibold text-white truncate">
                    {activity.title}
                  </p>
                  <span className="text-[11px] text-[#c4c7c9] opacity-60 whitespace-nowrap">
                    {activity.time}
                  </span>
                </div>

                {/* Log subtitle and resource links */}
                <p className="text-xs text-[#c4c7c9] font-medium">
                  {activity.subtitle}
                  {activity.type === "status" && (
                    <span className="text-[#c4c7c9]/70 pr-1">
                      {activity.commentText}
                    </span>
                  )}
                  <a
                    href="#"
                    className="text-white font-semibold hover:underline inline-flex items-center gap-0.5"
                  >
                    {activity.linkText}
                  </a>
                </p>

                {/* Chat Bubble for Comment Types */}
                {activity.type === "comment" && activity.commentText && (
                  <div className="mt-2.5 p-3 bg-[#201f1f] rounded-xl border border-[#444749]/30 flex items-start gap-2 max-w-3xl">
                    <MessageSquare
                      size={12}
                      className="text-[#c4c7c9] mt-0.5 flex-shrink-0"
                    />
                    <p className="text-xs text-[#c4c7c9] italic leading-relaxed">
                      &ldquo;{activity.commentText}&rdquo;
                    </p>
                  </div>
                )}

                {/* Tags mapping using Shadcn Badge */}
                {activity.tags && (
                  <div className="mt-2.5 flex flex-wrap gap-1.5">
                    {activity.tags.map((tag, tIdx) => (
                      <Badge
                        key={tIdx}
                        variant={tag.type === "error" ? "destructive" : "secondary"}
                        className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border ${
                          tag.type === "error"
                            ? "bg-[#93000a]/10 text-[#ffb4ab] border-[#ffb4ab]/15 hover:bg-[#93000a]/20"
                            : "bg-[#201f1f] text-[#c4c7c9] border-[#444749]/40 hover:bg-[#2d2d2d]"
                        }`}
                      >
                        {tag.label}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </motion.div>
  );
}
