"use client";

import React, { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
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
import { Textarea } from "@/components/ui/textarea";
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
import { Loader2, Plus, Trash2 } from "lucide-react";
import { ApiTask, CreateTaskPayload, UpdateTaskPayload } from "@/lib/api";
import { TaskStatus } from "@/lib/types/database";
import { Checkbox } from "@/components/ui/checkbox";

const taskSchema = z.object({
  title: z.string().min(3, "Judul task minimal 3 karakter"),
  description: z.string().optional(),
  status: z.enum(["direncanakan", "dalam_pengerjaan", "sedang_direview", "pengujian", "selesai"]),
  checklists: z.array(z.object({
    id: z.string().optional(),
    label: z.string().min(1, "Label diperlukan"),
    isChecked: z.boolean(),
  })),
});

type TaskFormValues = z.infer<typeof taskSchema>;

interface TaskDialogProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "create" | "edit" | "delete";
  task?: ApiTask | null;
  columnId?: TaskStatus; 
  columns: { id: string; title: string }[];
  isLoading?: boolean;
  onSubmit: (data: Partial<CreateTaskPayload | UpdateTaskPayload> & { 
    id?: string; 
    status?: TaskStatus;
    checklists: { id?: string; label: string; isChecked: boolean }[];
  }) => void;
  onConfirmDelete: (id: string) => void;
}

export function TaskDialog({
  isOpen,
  onClose,
  mode,
  task,
  columnId,
  columns,
  isLoading = false,
  onSubmit,
  onConfirmDelete,
}: TaskDialogProps) {
  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: "",
      description: "",
      status: "direncanakan",
      checklists: [],
    },
  });

  const { fields: checklistFields, append: appendChecklist, remove: removeChecklist } = useFieldArray({
    control: form.control,
    name: "checklists",
  });

  useEffect(() => {
    if (isOpen) {
      if (mode === "edit" && task) {
        form.reset({
          title: task.title,
          description: task.description || "",
          status: task.status,
          checklists: task.checklists || [],
        });
      } else {
        form.reset({
          title: "",
          description: "",
          status: columnId || "direncanakan",
          checklists: [],
        });
      }
    }
  }, [isOpen, mode, task, columnId, form]);

  const handleFormSubmit = (values: TaskFormValues) => {
    onSubmit({
      id: task?.id,
      title: values.title,
      description: values.description,
      status: values.status as TaskStatus,
      isCompleted: values.status === "selesai",
      checklists: values.checklists,
    });
  };

  const handleDeleteConfirm = () => {
    if (task) {
      onConfirmDelete(task.id);
    }
  };

  const inputClass =
    "bg-[#131313] border-[#333333] text-white placeholder-gray-600 focus-visible:ring-1 focus-visible:ring-white focus-visible:border-white focus-visible:ring-offset-0";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#1c1b1b] border-[#333333] text-white sm:max-w-[480px]">
        {mode === "delete" ? (
          <div>
            <DialogHeader className="gap-2">
              <DialogTitle className="text-xl font-bold text-red-400">
                Hapus Task
              </DialogTitle>
              <DialogDescription className="text-gray-400 text-xs leading-relaxed">
                Apakah Anda yakin ingin menghapus task{" "}
                <span className="font-semibold text-white">
                  &ldquo;{task?.title}&rdquo;
                </span>
                ? Tindakan ini tidak dapat dibatalkan.
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
                {isLoading ? <Loader2 className="size-4 animate-spin" /> : "Hapus Task"}
              </Button>
            </DialogFooter>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleFormSubmit)} className="flex flex-col gap-5">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold text-white">
                  {mode === "create" ? "Buat Task Baru" : "Edit Detail Task"}
                </DialogTitle>
                <DialogDescription className="text-gray-400 text-xs">
                  Atur detail pekerjaan untuk task ini.
                </DialogDescription>
              </DialogHeader>

              <div className="flex flex-col gap-4">
                {/* Title */}
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem className="flex flex-col gap-1.5">
                      <FormLabel className="text-xs font-semibold text-[#c4c7c9] tracking-wide">
                        JUDUL TASK
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g. Buat komponen navbar"
                          {...field}
                          className={inputClass}
                        />
                      </FormControl>
                      <FormMessage className="text-[10px] text-red-400" />
                    </FormItem>
                  )}
                />

                {/* Description */}
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem className="flex flex-col gap-1.5">
                      <FormLabel className="text-xs font-semibold text-[#c4c7c9] tracking-wide">
                        DESKRIPSI (Opsional)
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Tuliskan spesifikasi detail atau instruksi..."
                          {...field}
                          className={`${inputClass} min-h-[100px] leading-relaxed`}
                        />
                      </FormControl>
                      <FormMessage className="text-[10px] text-red-400" />
                    </FormItem>
                  )}
                />

                {/* Status Column Select */}
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem className="flex flex-col gap-1.5">
                      <FormLabel className="text-xs font-semibold text-[#c4c7c9] tracking-wide">
                        STATUS / KOLOM KANBAN
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="bg-[#131313] border-[#333333] text-white focus:ring-1 focus:ring-white focus:ring-offset-0">
                            <SelectValue placeholder="Status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-[#1c1b1b] border-[#333333] text-white">
                          {columns.map((col) => (
                            <SelectItem key={col.id} value={col.id} className="focus:bg-[#2a2a2a] cursor-pointer">
                              {col.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-[10px] text-red-400" />
                    </FormItem>
                  )}
                />

                {/* Checklists Section */}
                <div className="flex flex-col gap-2 mt-2">
                  <FormLabel className="text-xs font-semibold text-[#c4c7c9] tracking-wide flex justify-between items-center">
                    CHECKLIST PROGRESS
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-6 px-2 text-[10px] bg-[#2a2a2a] hover:bg-[#353434] text-white rounded"
                      onClick={() => appendChecklist({ label: "", isChecked: false })}
                    >
                      <Plus className="size-3 mr-1" /> Tambah
                    </Button>
                  </FormLabel>
                  
                  {checklistFields.length === 0 ? (
                    <div className="text-center py-4 text-xs text-gray-500 border border-dashed border-[#333333] rounded-md bg-[#131313]">
                      Tidak ada checklist.
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2 max-h-[160px] overflow-y-auto pr-1 hide-scrollbar">
                      {checklistFields.map((field, index) => (
                        <div key={field.id} className="flex flex-row items-start gap-2">
                          <FormField
                            control={form.control}
                            name={`checklists.${index}.isChecked`}
                            render={({ field: checkField }) => (
                              <FormItem className="mt-2.5">
                                <FormControl>
                                  <Checkbox
                                    checked={checkField.value}
                                    onCheckedChange={checkField.onChange}
                                    className="border-[#444749] data-[state=checked]:bg-white data-[state=checked]:text-black"
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name={`checklists.${index}.label`}
                            render={({ field: inputField }) => (
                              <FormItem className="flex-1">
                                <FormControl>
                                  <Input
                                    placeholder="Deskripsi checklist"
                                    {...inputField}
                                    className={`${inputClass} h-8 text-xs`}
                                  />
                                </FormControl>
                                <FormMessage className="text-[10px] text-red-400 mt-1" />
                              </FormItem>
                            )}
                          />

                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeChecklist(index)}
                            className="h-8 w-8 text-gray-500 hover:text-red-400 hover:bg-[#2a2a2a] shrink-0"
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <DialogFooter className="mt-4 flex gap-2 justify-end">
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
                  className="bg-white hover:bg-white/90 text-black border-transparent cursor-pointer font-medium min-w-[100px]"
                >
                  {isLoading ? <Loader2 className="size-4 animate-spin" /> : mode === "create" ? "Buat Task" : "Simpan"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}
