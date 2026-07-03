"use client";

import React, { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { ApiProfile, usersApi } from "@/lib/api";
import { Edit2, Trash2 } from "lucide-react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const columns: ColumnDef<ApiProfile>[] = [
  {
    accessorKey: "displayName",
    header: "Name",
    cell: ({ row }) => {
      const user = row.original;
      const initials = (user.displayName || user.email)
        .substring(0, 2)
        .toUpperCase();
      return (
        <div className="flex items-center gap-3">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-[10px] text-white ${
              user.role === "admin" ? "bg-[#091426]" : "bg-[#2f2ebe]"
            }`}
          >
            {initials}
          </div>
          <span className="font-semibold text-[#091426]">
            {user.displayName || "No Name"}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => (
      <code className="text-xs font-mono text-foreground">
        {row.original.email}
      </code>
    ),
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => {
      const role = row.original.role;
      const colors: Record<string, string> = {
        admin: "bg-primary text-[#0058be]",
        developer: "bg-primary text-foreground",
        stakeholder: "bg-secondary text-[#2f2ebe]",
      };
      return (
        <span
          className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${
            colors[role] || colors.developer
          }`}
        >
          {role}
        </span>
      );
    },
  },
  {
    id: "status",
    header: "Status",
    cell: () => (
      <div className="flex items-center gap-1.5 text-sm font-semibold text-emerald-600">
        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
        Active
      </div>
    ),
  },
  {
    id: "actions",
    header: () => <div className="text-right">Actions</div>,
    cell: ({ row, table }) => <RowActions row={row} table={table} />,
  },
];

function RowActions({ row, table }: { row: any; table: any }) {
  const user = row.original;
  const refreshData = table.options.meta?.refreshData;

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form states for Edit Dialog
  const [displayName, setDisplayName] = useState(user.displayName || "");
  const [email, setEmail] = useState(user.email);
  const [role, setRole] = useState(user.role);

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await usersApi.update(user.id, {
        displayName,
        email,
        role,
      });
      toast.success("User updated successfully");
      setIsEditDialogOpen(false);
      if (refreshData) refreshData();
    } catch (error: any) {
      toast.error(error?.message || "Failed to update user");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteSubmit = async () => {
    setIsSubmitting(true);
    try {
      await usersApi.delete(user.id);
      toast.success("User deleted successfully");
      setIsDeleteDialogOpen(false);
      if (refreshData) refreshData();
    } catch (error: any) {
      toast.error(error?.message || "Failed to delete user");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
      <button
        onClick={() => setIsEditDialogOpen(true)}
        className="p-2 text-foreground hover:text-[#0058be] hover:bg-[#0058be]/5 rounded-lg transition-colors cursor-pointer"
      >
        <Edit2 size={16} />
      </button>
      <button
        onClick={() => setIsDeleteDialogOpen(true)}
        className="p-2 text-foreground hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
      >
        <Trash2 size={16} />
      </button>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <form onSubmit={handleEditSubmit}>
            <DialogHeader>
              <DialogTitle>Edit User</DialogTitle>
              <DialogDescription>
                Modify profile details for the user and save changes.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="displayName" className="text-right">
                  Name
                </Label>
                <Input
                  id="displayName"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="role" className="text-right">
                  Role
                </Label>
                <div className="col-span-3">
                  <Select value={role} onValueChange={setRole}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="developer">Developer</SelectItem>
                      <SelectItem value="stakeholder">Stakeholder</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditDialogOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Alert Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. Deleting this user will delete their
              profile, and because of database cascade settings, all projects
              owned or run by this user will also be permanently deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSubmitting}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleDeleteSubmit();
              }}
              className="bg-red-600 hover:bg-red-700 text-white"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Deleting..." : "Yes, Delete User"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
