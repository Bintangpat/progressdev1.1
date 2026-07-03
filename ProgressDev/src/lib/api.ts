/**
 * Centralized API client untuk komunikasi dengan NestJS backend (localhost:3001)
 * Semua request otomatis menyertakan Bearer token dari NextAuth session.
 */

import { getSession } from "next-auth/react";
import { ProjectStatus, TaskStatus } from "./types/database";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

// ──────────────────────────────────────────────
// Type Definitions (sesuai response NestJS backend)
// ──────────────────────────────────────────────

export interface ApiProject {
  id: string;
  userId: string;
  stakeholderName: string;
  platformName: string;
  durationStart: string;
  durationEnd: string;
  publicSlug: string;
  status: ProjectStatus;
  developerWhatsapp: string;
  budget: number;
  createdAt: string;
  progress?: number;
  tasks?: ApiTask[];
  user?: { displayName: string; email: string };
  teamMembers?: ApiTeamMember[];
  briefs?: ApiBrief[];
}

export interface ApiTask {
  id: string;
  projectId: string;
  title: string;
  description?: string | null;
  isCompleted: boolean;
  status: TaskStatus;
  orderIndex: number;
  createdAt: string;
  checklists?: ApiChecklistItem[];
  screenshots?: ApiScreenshot[];
}

export interface ApiChecklistItem {
  id: string;
  taskId: string;
  label: string;
  isChecked: boolean;
}

export interface ApiScreenshot {
  id: string;
  taskId: string;
  imageUrl: string;
  createdAt: string;
}

export interface ApiTeamMember {
  id: string;
  projectId: string;
  profileId: string;
  role: string;
  profile?: { displayName: string; email: string };
}

export interface ApiBrief {
  id: string;
  projectId: string;
  type: string;
  preferredDate: string;
  preferredTime: string;
  objectives: string;
  status: string;
  createdAt: string;
}

export interface ApiProfile {
  id: string;
  email: string;
  displayName: string | null;
  whatsapp: string | null;
  role: string;
  createdAt: string;
}

export interface CreateProjectPayload {
  stakeholderName: string;
  platformName: string;
  durationStart: string; // ISO datetime string
  durationEnd: string;   // ISO datetime string
  developerWhatsapp: string;
  budget?: number;
  teamMembers?: { profileId: string; role: string }[];
}

export interface UpdateProjectPayload extends Partial<CreateProjectPayload> {
  status?: ProjectStatus;
}

export interface CreateTaskPayload {
  projectId: string;
  title: string;
  description?: string;
  orderIndex?: number;
}

export interface UpdateTaskPayload {
  title?: string;
  description?: string;
  status?: TaskStatus;
  isCompleted?: boolean;
  orderIndex?: number;
}

export interface CreateBriefPayload {
  type: string;
  preferredDate: string;
  preferredTime: string;
  objectives: string;
}

// ──────────────────────────────────────────────
// Core Fetch Wrapper
// ──────────────────────────────────────────────

async function apiRequest<T>(
  method: "GET" | "POST" | "PATCH" | "DELETE",
  path: string,
  body?: unknown
): Promise<T> {
  const session = await getSession();
  const token = (session?.user as any)?.accessToken;

  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const options: RequestInit = {
    method,
    headers,
    cache: "no-store",
  };

  if (body !== undefined) {
    options.body = JSON.stringify(body);
  }

  const res = await fetch(`${API_BASE_URL}${path}`, options);

  if (!res.ok) {
    let errorMessage = `API Error: ${res.status}`;
    try {
      const errData = await res.json();
      errorMessage = errData.message || errorMessage;
    } catch {}
    throw new Error(errorMessage);
  }

  // DELETE responses are often empty
  if (res.status === 204 || method === "DELETE") {
    return undefined as T;
  }

  return res.json() as Promise<T>;
}

// ──────────────────────────────────────────────
// Project API Functions
// ──────────────────────────────────────────────

export const projectsApi = {
  /** Ambil semua project user */
  getAll: () => apiRequest<ApiProject[]>("GET", "/projects"),
  /** Buat project baru */
  create: (data: CreateProjectPayload) =>
    apiRequest<ApiProject>("POST", "/projects", data),
  /** Ambil detail project */
  getOne: (id: string) => apiRequest<ApiProject>("GET", `/projects/${id}`),
  /** Ambil project via public slug (untuk stakeholder) */
  getBySlug: (slug: string) => apiRequest<ApiProject>("GET", `/projects/public/${slug}`),
  /** Update project */
  update: (id: string, data: UpdateProjectPayload) =>
    apiRequest<ApiProject>("PATCH", `/projects/${id}`, data),
  /** Hapus project */
  delete: (id: string) => apiRequest<void>("DELETE", `/projects/${id}`),
};

export const briefsApi = {
  /** Buat request briefing untuk sebuah project */
  create: (projectId: string, data: CreateBriefPayload) =>
    apiRequest<ApiBrief>("POST", `/projects/${projectId}/briefs`, data),
};

export const usersApi = {
  /** Ambil semua user */
  getAll: () => apiRequest<ApiProfile[]>("GET", `/users`),
  /** Buat user baru */
  create: (data: {
    email: string;
    displayName: string;
    role: string;
    password?: string;
    team?: string;
    workspaces?: string[];
  }) => apiRequest<ApiProfile>("POST", "/users", data),
  /** Update user */
  update: (id: string, data: {
    email?: string;
    displayName?: string;
    role?: string;
    password?: string;
  }) => apiRequest<ApiProfile>("PATCH", `/users/${id}`, data),
  /** Hapus user */
  delete: (id: string) => apiRequest<void>("DELETE", `/users/${id}`),
  /** Ambil user berdasarkan role */
  getByRole: (role: string) => apiRequest<ApiProfile[]>("GET", `/users?role=${role}`),
};

// ──────────────────────────────────────────────
// Task API Functions
// ──────────────────────────────────────────────

export const tasksApi = {
  /** Buat task baru */
  create: (data: CreateTaskPayload) =>
    apiRequest<ApiTask>("POST", "/tasks", data),

  /** Update task (status, title, dll) */
  update: (id: string, data: UpdateTaskPayload) =>
    apiRequest<ApiTask>("PATCH", `/tasks/${id}/status`, data),

  /** Hapus task */
  delete: (id: string) => apiRequest<void>("DELETE", `/tasks/${id}`),
};

// ──────────────────────────────────────────────
// Checklist API Functions
// ──────────────────────────────────────────────

export const checklistsApi = {
  create: (taskId: string, label: string) =>
    apiRequest<ApiChecklistItem>("POST", `/tasks/${taskId}/checklist`, { label }),
  update: (id: string, data: { label?: string; isChecked?: boolean }) =>
    apiRequest<ApiChecklistItem>("PATCH", `/tasks/checklist/${id}`, data),
  delete: (id: string) => apiRequest<void>("DELETE", `/tasks/checklist/${id}`),
};

// ──────────────────────────────────────────────
// Utility: Hitung progress project dari tasks
// ──────────────────────────────────────────────

export function calcProjectProgress(tasks: ApiTask[]): number {
  const allChecklists = tasks.flatMap((t) => t.checklists ?? []);
  if (allChecklists.length === 0) {
    // Fallback: hitung dari tasks selesai
    if (tasks.length === 0) return 0;
    const done = tasks.filter((t) => t.status === "selesai").length;
    return Math.round((done / tasks.length) * 100);
  }
  const checked = allChecklists.filter((c) => c.isChecked).length;
  return Math.round((checked / allChecklists.length) * 100);
}

/** Konversi ApiProject ke label status yang lebih user-friendly */
export function getProjectStatusLabel(status: ProjectStatus): string {
  switch (status) {
    case "active":
      return "Active";
    case "completed":
      return "Completed";
    case "draft":
    default:
      return "Draft";
  }
}

/** Konversi ProjectStatus ke color classes */
export function getProjectStatusColors(status: ProjectStatus): {
  statusColor: string;
  barColor: string;
} {
  switch (status) {
    case "active":
      return {
        statusColor: "bg-[#1a3a2a] text-[#81c995]",
        barColor: "bg-[#81c995]",
      };
    case "completed":
      return {
        statusColor: "bg-[#1a2a3a] text-[#82b4ff]",
        barColor: "bg-[#82b4ff]",
      };
    case "draft":
    default:
      return {
        statusColor: "bg-[#2a2a2a] text-[#c4c7c9]",
        barColor: "bg-[#c4c7c9]",
      };
  }
}

// ──────────────────────────────────────────────
// Settings API Functions
// ──────────────────────────────────────────────

export interface UpdateProfilePayload {
  displayName?: string;
  email?: string;
  whatsapp?: string;
}

export const settingsApi = {
  getMe: () => apiRequest<ApiProfile>("GET", "/users/me"),
  updateMe: (data: UpdateProfilePayload) => apiRequest<ApiProfile>("PATCH", "/users/me", data),
  changePassword: (data: any) => apiRequest<{ message: string }>("PATCH", "/users/me/password", data),
  deactivateMe: () => apiRequest<{ message: string }>("DELETE", "/users/me"),
};
