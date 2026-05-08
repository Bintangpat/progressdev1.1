import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Calculate overall project progress based on completed tasks
 * progress = completed_tasks / total_tasks * 100
 */
export function calculateProgress(
  tasks: { is_completed: boolean; checklist_items?: unknown[] }[],
): number {
  if (tasks.length === 0) return 0;
  const completed = tasks.filter((t) => t.is_completed).length;
  return Math.round((completed / tasks.length) * 100);
}

/**
 * Format WhatsApp link
 */
export function whatsappLink(phone: string, platformName: string): string {
  const cleaned = phone.replace(/\D/g, "");
  const text = encodeURIComponent(`Halo, terkait project ${platformName}`);
  return `https://wa.me/${cleaned}?text=${text}`;
}

/**
 * Format date range
 */
export function formatDateRange(start: string, end: string): string {
  const s = new Date(start);
  const e = new Date(end);
  const opts: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "short",
    year: "numeric",
  };
  return `${s.toLocaleDateString("id-ID", opts)} — ${e.toLocaleDateString("id-ID", opts)}`;
}

/**
 * Get relative time string
 */
export function timeAgo(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days} hari lalu`;
  if (hours > 0) return `${hours} jam lalu`;
  if (minutes > 0) return `${minutes} menit lalu`;
  return "Baru saja";
}
