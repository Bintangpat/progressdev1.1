"use client";

import { useState } from "react";
import { createProject } from "@/app/actions/projects";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Loader2, Plus } from "lucide-react";

export function CreateProjectDialog({ onCreated }: { onCreated?: () => void }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    const result = await createProject(formData);
    setLoading(false);

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Proyek berhasil dibuat!");
      setOpen(false);
      onCreated?.();
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 shadow-lg shadow-violet-500/20">
          <Plus className="mr-2 h-4 w-4" />
          Proyek Baru
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md border-white/10 bg-card/95 backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle>Buat Proyek Baru</DialogTitle>
          <DialogDescription>
            Isi detail proyek untuk memulai tracking progress.
          </DialogDescription>
        </DialogHeader>
        <form action={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="platform_name">Nama Platform / Proyek</Label>
            <Input
              id="platform_name"
              name="platform_name"
              placeholder="Website Toko Online"
              required
              className="bg-white/5 border-white/10"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="stakeholder_name">Nama Stakeholder</Label>
            <Input
              id="stakeholder_name"
              name="stakeholder_name"
              placeholder="PT Maju Bersama"
              required
              className="bg-white/5 border-white/10"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="duration_start">Tanggal Mulai</Label>
              <Input
                id="duration_start"
                name="duration_start"
                type="date"
                required
                className="bg-white/5 border-white/10"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="duration_end">Tanggal Selesai</Label>
              <Input
                id="duration_end"
                name="duration_end"
                type="date"
                required
                className="bg-white/5 border-white/10"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="developer_whatsapp">No. WhatsApp Developer</Label>
            <Input
              id="developer_whatsapp"
              name="developer_whatsapp"
              placeholder="6281234567890"
              required
              className="bg-white/5 border-white/10"
            />
          </div>
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500"
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Buat Proyek
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
