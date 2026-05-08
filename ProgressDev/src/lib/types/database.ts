export type ProjectStatus = "draft" | "active" | "completed";

export type TaskStatus =
  | "direncanakan"
  | "dalam_pengerjaan"
  | "sedang_direview"
  | "pengujian"
  | "selesai";

export const TASK_STATUS_CONFIG: Record<
  TaskStatus,
  { label: string; color: string; bgColor: string; borderColor: string }
> = {
  direncanakan: {
    label: "Direncanakan",
    color: "text-slate-400",
    bgColor: "bg-slate-500/10",
    borderColor: "border-slate-500/30",
  },
  dalam_pengerjaan: {
    label: "Dalam Pengerjaan",
    color: "text-blue-400",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/30",
  },
  sedang_direview: {
    label: "Sedang Di Review",
    color: "text-amber-400",
    bgColor: "bg-amber-500/10",
    borderColor: "border-amber-500/30",
  },
  pengujian: {
    label: "Pengujian",
    color: "text-purple-400",
    bgColor: "bg-purple-500/10",
    borderColor: "border-purple-500/30",
  },
  selesai: {
    label: "Selesai",
    color: "text-emerald-400",
    bgColor: "bg-emerald-500/10",
    borderColor: "border-emerald-500/30",
  },
};

export const TASK_STATUSES: TaskStatus[] = [
  "direncanakan",
  "dalam_pengerjaan",
  "sedang_direview",
  "pengujian",
  "selesai",
];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          display_name: string | null;
          whatsapp: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          email: string;
          display_name?: string | null;
          whatsapp?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          display_name?: string | null;
          whatsapp?: string | null;
          created_at?: string;
        };
      };
      projects: {
        Row: {
          id: string;
          user_id: string;
          stakeholder_name: string;
          platform_name: string;
          duration_start: string;
          duration_end: string;
          public_slug: string;
          status: ProjectStatus;
          developer_whatsapp: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          stakeholder_name: string;
          platform_name: string;
          duration_start: string;
          duration_end: string;
          public_slug?: string;
          status?: ProjectStatus;
          developer_whatsapp: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          stakeholder_name?: string;
          platform_name?: string;
          duration_start?: string;
          duration_end?: string;
          public_slug?: string;
          status?: ProjectStatus;
          developer_whatsapp?: string;
          created_at?: string;
        };
      };
      tasks: {
        Row: {
          id: string;
          project_id: string;
          title: string;
          description: string | null;
          is_completed: boolean;
          status: TaskStatus;
          order_index: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          title: string;
          description?: string | null;
          is_completed?: boolean;
          status?: TaskStatus;
          order_index?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          project_id?: string;
          title?: string;
          description?: string | null;
          is_completed?: boolean;
          status?: TaskStatus;
          order_index?: number;
          created_at?: string;
        };
      };
      checklist_items: {
        Row: {
          id: string;
          task_id: string;
          label: string;
          is_checked: boolean;
        };
        Insert: {
          id?: string;
          task_id: string;
          label: string;
          is_checked?: boolean;
        };
        Update: {
          id?: string;
          task_id?: string;
          label?: string;
          is_checked?: boolean;
        };
      };
      task_screenshots: {
        Row: {
          id: string;
          task_id: string;
          image_url: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          task_id: string;
          image_url: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          task_id?: string;
          image_url?: string;
          created_at?: string;
        };
      };
      comments: {
        Row: {
          id: string;
          project_id: string;
          parent_id: string | null;
          author_name: string;
          message: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          parent_id?: string | null;
          author_name: string;
          message: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          project_id?: string;
          parent_id?: string | null;
          author_name?: string;
          message?: string;
          created_at?: string;
        };
      };
    };
  };
}

// Convenience types
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Project = Database["public"]["Tables"]["projects"]["Row"];
export type Task = Database["public"]["Tables"]["tasks"]["Row"];
export type ChecklistItem =
  Database["public"]["Tables"]["checklist_items"]["Row"];
export type TaskScreenshot =
  Database["public"]["Tables"]["task_screenshots"]["Row"];
export type Comment = Database["public"]["Tables"]["comments"]["Row"];

// Extended types with relations
export type TaskWithDetails = Task & {
  checklist_items: ChecklistItem[];
  task_screenshots: TaskScreenshot[];
};

export type ProjectWithTasks = Project & {
  tasks: TaskWithDetails[];
};

export type CommentWithReplies = Comment & {
  replies: Comment[];
};
