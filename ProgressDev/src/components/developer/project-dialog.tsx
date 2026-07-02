"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ApiProject,
  CreateProjectPayload,
  UpdateProjectPayload,
} from "@/lib/api";
import { Loader2 } from "lucide-react";

// ──────────────────────────────────────────────
// Zod Schema — sesuai backend DTO
// ──────────────────────────────────────────────
const projectSchema = z.object({
  stakeholderName: z.string().min(2, "Nama stakeholder minimal 2 karakter"),
  platformName: z.string().min(2, "Nama platform minimal 2 karakter"),
  durationStart: z.string().min(1, "Tanggal mulai wajib diisi"),
  durationEnd: z.string().min(1, "Tanggal selesai wajib diisi"),
  developerWhatsapp: z.string().min(9, "Nomor WhatsApp tidak valid"),
  status: z.enum(["draft", "active", "completed"]).optional(),
});

type ProjectFormValues = z.infer<typeof projectSchema>;

interface ProjectDialogProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "create" | "edit" | "delete";
  project?: ApiProject | null;
  isLoading?: boolean;
  onSubmit: (data: CreateProjectPayload | UpdateProjectPayload) => void;
  onConfirmDelete: (id: string) => void;
}

// Helper: konversi ISO string → input[type=date] value (YYYY-MM-DD)
function toDateInputValue(isoString?: string): string {
  if (!isoString) return "";
  return new Date(isoString).toISOString().split("T")[0];
}

// Helper: konversi YYYY-MM-DD → ISO datetime string
function toISODatetime(dateStr: string): string {
  return new Date(dateStr).toISOString();
}

export function ProjectDialog({
  isOpen,
  onClose,
  mode,
  project,
  isLoading = false,
  onSubmit,
  onConfirmDelete,
}: ProjectDialogProps) {
  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      stakeholderName: "",
      platformName: "",
      durationStart: "",
      durationEnd: "",
      developerWhatsapp: "",
      status: "draft",
    },
  });

  // Reset form saat dialog buka / project berubah
  useEffect(() => {
    if (isOpen) {
      if (mode === "edit" && project) {
        form.reset({
          stakeholderName: project.stakeholderName,
          platformName: project.platformName,
          durationStart: toDateInputValue(project.durationStart),
          durationEnd: toDateInputValue(project.durationEnd),
          developerWhatsapp: project.developerWhatsapp,
          status: project.status as "draft" | "active" | "completed",
        });
      } else {
        form.reset({
          stakeholderName: "",
          platformName: "",
          durationStart: "",
          durationEnd: "",
          developerWhatsapp: "",
          status: "draft",
        });
      }
    }
  }, [isOpen, mode, project, form]);

  const handleFormSubmit = (values: ProjectFormValues) => {
    const payload: CreateProjectPayload | UpdateProjectPayload = {
      stakeholderName: values.stakeholderName,
      platformName: values.platformName,
      durationStart: toISODatetime(values.durationStart),
      durationEnd: toISODatetime(values.durationEnd),
      developerWhatsapp: values.developerWhatsapp,
      ...(mode === "edit" && values.status ? { status: values.status } : {}),
    };
    onSubmit(payload);
  };

  const handleDeleteConfirm = () => {
    if (project) onConfirmDelete(project.id);
  };

  const inputClass =
    "bg-[#131313] border-[#333333] text-white placeholder-gray-600 focus-visible:ring-1 focus-visible:ring-white focus-visible:border-white focus-visible:ring-offset-0";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#1c1b1b] border-[#333333] text-white sm:max-w-[520px]">
        {mode === "delete" ? (
          /* ── Delete Confirmation ── */
          <div>
            <DialogHeader className="gap-2">
              <DialogTitle className="text-xl font-bold text-red-400">
                Hapus Project
              </DialogTitle>
              <DialogDescription className="text-gray-400 text-xs leading-relaxed">
                Apakah kamu yakin ingin menghapus project{" "}
                <span className="font-semibold text-white">
                  &ldquo;{project?.platformName}&rdquo;
                </span>
                ? Seluruh task dan data terkait akan dihapus permanen.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="mt-6 flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={onClose}
                disabled={isLoading}
                className="bg-[#2a2a2a] hover:bg-[#353434] text-white border-transparent cursor-pointer"
              >
                Batal
              </Button>
              <Button
                variant="destructive"
                onClick={handleDeleteConfirm}
                disabled={isLoading}
                className="bg-red-600 hover:bg-red-700 text-white border-transparent cursor-pointer"
              >
                {isLoading ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  "Hapus Project"
                )}
              </Button>
            </DialogFooter>
          </div>
        ) : (
          /* ── Create / Edit Form ── */
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleFormSubmit)}
              className="flex flex-col gap-5"
            >
              <DialogHeader>
                <DialogTitle className="text-xl font-bold text-white">
                  {mode === "create" ? "Buat Project Baru" : "Edit Project"}
                </DialogTitle>
                <DialogDescription className="text-gray-400 text-xs">
                  {mode === "create"
                    ? "Isi detail project untuk klien baru."
                    : "Perbarui informasi project yang sudah ada."}
                </DialogDescription>
              </DialogHeader>

              <div className="flex flex-col gap-4">
                {/* Platform Name */}
                <FormField
                  control={form.control}
                  name="platformName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold text-[#c4c7c9] tracking-wide">
                        NAMA PLATFORM / PROJECT
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g. Atlas CRM Platform"
                          {...field}
                          className={inputClass}
                        />
                      </FormControl>
                      <FormMessage className="text-[10px] text-red-400" />
                    </FormItem>
                  )}
                />

                {/* Stakeholder Name */}
                <FormField
                  control={form.control}
                  name="stakeholderName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold text-[#c4c7c9] tracking-wide">
                        NAMA KLIEN / STAKEHOLDER
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g. PT Mitra Sejahtera"
                          {...field}
                          className={inputClass}
                        />
                      </FormControl>
                      <FormMessage className="text-[10px] text-red-400" />
                    </FormItem>
                  )}
                />

                {/* WhatsApp */}
                <FormField
                  control={form.control}
                  name="developerWhatsapp"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold text-[#c4c7c9] tracking-wide">
                        NOMOR WHATSAPP DEVELOPER
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g. +6281234567890"
                          {...field}
                          className={inputClass}
                        />
                      </FormControl>
                      <FormMessage className="text-[10px] text-red-400" />
                    </FormItem>
                  )}
                />

                {/* Duration */}
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="durationStart"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-semibold text-[#c4c7c9] tracking-wide">
                          TANGGAL MULAI
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="date"
                            {...field}
                            className={`${inputClass} schemedark`}
                          />
                        </FormControl>
                        <FormMessage className="text-[10px] text-red-400" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="durationEnd"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-semibold text-[#c4c7c9] tracking-wide">
                          TANGGAL SELESAI
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="date"
                            {...field}
                            className={`${inputClass} scheme=dark`}
                          />
                        </FormControl>
                        <FormMessage className="text-[10px] text-red-400" />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Status — hanya tampil saat edit */}
                {mode === "edit" && (
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-semibold text-[#c4c7c9] tracking-wide">
                          STATUS PROJECT
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="bg-[#131313] border-[#333333] text-white focus:ring-1 focus:ring-white focus:ring-offset-0">
                              <SelectValue placeholder="Pilih status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-[#1c1b1b] border-[#333333] text-white">
                            <SelectItem
                              value="draft"
                              className="focus:bg-[#2a2a2a] cursor-pointer"
                            >
                              Draft
                            </SelectItem>
                            <SelectItem
                              value="active"
                              className="focus:bg-[#2a2a2a] cursor-pointer"
                            >
                              Active
                            </SelectItem>
                            <SelectItem
                              value="completed"
                              className="focus:bg-[#2a2a2a] cursor-pointer"
                            >
                              Completed
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage className="text-[10px] text-red-400" />
                      </FormItem>
                    )}
                  />
                )}
              </div>

              <DialogFooter className="mt-2 flex gap-2 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  disabled={isLoading}
                  className="bg-[#2a2a2a] hover:bg-[#353434] text-white border-transparent cursor-pointer"
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="bg-white hover:bg-white/90 text-black border-transparent cursor-pointer font-medium min-w-[120px]"
                >
                  {isLoading ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : mode === "create" ? (
                    "Buat Project"
                  ) : (
                    "Simpan Perubahan"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}
