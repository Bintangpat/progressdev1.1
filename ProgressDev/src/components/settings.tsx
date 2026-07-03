"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { toast } from "sonner";
import { settingsApi } from "@/lib/api";
import {
  IconUser,
  IconShieldLock,
  IconPhone,
  IconInfoCircle,
  IconCheck,
  IconLoader2,
} from "@tabler/icons-react";

type SaveState = "idle" | "saving" | "saved";

function useSaveState() {
  const [state, setState] = useState<SaveState>("idle");

  const startSaving = () => setState("saving");
  const markSaved = () => {
    setState("saved");
    setTimeout(() => setState("idle"), 2000);
  };
  const reset = () => setState("idle");

  return { state, startSaving, markSaved, reset };
}

function SaveButton({
  state,
  onClick,
  idleLabel,
}: {
  state: SaveState;
  onClick: () => void;
  idleLabel: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={state !== "idle"}
      className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-6 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 active:opacity-80 disabled:cursor-default cursor-pointer"
    >
      {state === "saving" && (
        <>
          <IconLoader2 className="size-4 animate-spin" />
          Saving...
        </>
      )}
      {state === "saved" && (
        <>
          <IconCheck className="size-4" />
          Saved
        </>
      )}
      {state === "idle" && idleLabel}
    </button>
  );
}

export default function SettingsPage() {
  const { data: session, update: updateSession } = useSession();

  const profile = useSaveState();
  const security = useSaveState();
  const contact = useSaveState();
  const global = useSaveState();

  // Inputs state
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");

  // Password states
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Fetch current user details on mount
  useEffect(() => {
    settingsApi
      .getMe()
      .then((data) => {
        setDisplayName(data.displayName || "");
        setEmail(data.email || "");
        setWhatsapp(data.whatsapp || "");
      })
      .catch((err) => {
        console.error(err);
        toast.error("Failed to load account settings");
      });
  }, []);

  const handleUpdateProfile = async () => {
    if (!displayName || !email) {
      toast.error("Name and Email are required");
      return;
    }
    profile.startSaving();
    try {
      await settingsApi.updateMe({ displayName, email });
      if (updateSession) {
        await updateSession({
          ...session,
          user: {
            ...session?.user,
            name: displayName,
            email: email,
          },
        });
      }
      toast.success("Profile updated successfully");
      profile.markSaved();
    } catch (err: any) {
      toast.error(err?.message || "Failed to update profile");
      profile.reset();
    }
  };

  const handleUpdateSecurity = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("All password fields are required");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }
    security.startSaving();
    try {
      await settingsApi.changePassword({
        currentPassword,
        newPassword,
        confirmPassword,
      });
      toast.success("Password changed successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      security.markSaved();
    } catch (err: any) {
      toast.error(err?.message || "Failed to change password");
      security.reset();
    }
  };

  const handleUpdateContact = async () => {
    contact.startSaving();
    try {
      await settingsApi.updateMe({ whatsapp });
      toast.success("Contact details updated successfully");
      contact.markSaved();
    } catch (err: any) {
      toast.error(err?.message || "Failed to update contact details");
      contact.reset();
    }
  };

  const handleSaveAll = async () => {
    global.startSaving();
    try {
      // 1. Update Profile & Whatsapp
      await settingsApi.updateMe({ displayName, email, whatsapp });
      if (updateSession) {
        await updateSession({
          ...session,
          user: {
            ...session?.user,
            name: displayName,
            email: email,
          },
        });
      }

      // 2. If password fields are filled, update password
      if (currentPassword || newPassword || confirmPassword) {
        if (!currentPassword || !newPassword || !confirmPassword) {
          throw new Error("To change password, all password fields must be filled.");
        }
        if (newPassword !== confirmPassword) {
          throw new Error("New passwords do not match.");
        }
        await settingsApi.changePassword({
          currentPassword,
          newPassword,
          confirmPassword,
        });
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }

      toast.success("All settings saved successfully");
      global.markSaved();
    } catch (err: any) {
      toast.error(err?.message || "Failed to save settings");
      global.reset();
    }
  };

  const handleDeactivate = async () => {
    const confirm = window.confirm(
      "Are you sure you want to deactivate your account? This action is permanent and cannot be undone."
    );
    if (!confirm) return;

    try {
      await settingsApi.deactivateMe();
      toast.success("Account deactivated successfully");
      signOut({ callbackUrl: "/login" });
    } catch (err: any) {
      toast.error(err?.message || "Failed to deactivate account");
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="mx-auto max-w-7xl px-8 py-8">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Account Settings
          </h1>
          <p className="mt-2 text-muted-foreground">
            Manage your profile information, security preferences, and
            communication settings.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-6">
          {/* Profile Information */}
          <section className="rounded-xl border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-md">
            <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
              <div>
                <h2 className="flex items-center gap-2 text-xl font-semibold">
                  <IconUser className="size-5 text-primary" />
                  Profile Information
                </h2>
                <p className="text-xs text-muted-foreground">
                  Update your public profile details and identity.
                </p>
              </div>
              <SaveButton
                state={profile.state}
                onClick={handleUpdateProfile}
                idleLabel="Update Profile"
              />
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-1">
                <label className="block text-sm font-medium text-muted-foreground">
                  Full Name
                </label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full rounded-lg border border-input bg-background p-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring/30"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-sm font-medium text-muted-foreground">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full rounded-lg border border-input bg-background p-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring/30"
                />
              </div>
            </div>
          </section>

          {/* Security */}
          <section className="rounded-xl border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-md">
            <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
              <div>
                <h2 className="flex items-center gap-2 text-xl font-semibold">
                  <IconShieldLock className="size-5 text-primary" />
                  Security
                </h2>
                <p className="text-xs text-muted-foreground">
                  Maintain your account&apos;s integrity with a strong password.
                </p>
              </div>
              <SaveButton
                state={security.state}
                onClick={handleUpdateSecurity}
                idleLabel="Change Password"
              />
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <div className="space-y-1">
                <label className="block text-sm font-medium text-muted-foreground">
                  Current Password
                </label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-input bg-background p-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring/30"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-sm font-medium text-muted-foreground">
                  New Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Min. 8 characters"
                  className="w-full rounded-lg border border-input bg-background p-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring/30"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-sm font-medium text-muted-foreground">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat new password"
                  className="w-full rounded-lg border border-input bg-background p-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring/30"
                />
              </div>
            </div>
            <div className="mt-4 flex items-start gap-2 rounded-lg bg-muted p-4">
              <IconInfoCircle className="size-5 shrink-0 text-primary" />
              <p className="text-xs text-muted-foreground">
                Passwords should include at least one uppercase letter, one
                number, and one special character for maximum security.
              </p>
            </div>
          </section>

          {/* Contact Details */}
          <section className="rounded-xl border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-md">
            <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
              <div>
                <h2 className="flex items-center gap-2 text-xl font-semibold">
                  <IconPhone className="size-5 text-primary" />
                  Contact Details
                </h2>
                <p className="text-xs text-muted-foreground">
                  Set your direct communication channels for urgent project
                  updates.
                </p>
              </div>
              <SaveButton
                state={contact.state}
                onClick={handleUpdateContact}
                idleLabel="Save Contact"
              />
            </div>
            <div className="max-w-md">
              <div className="space-y-1">
                <label className="block text-sm font-medium text-muted-foreground">
                  WhatsApp Number
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                    +
                  </span>
                  <input
                    type="tel"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    placeholder="Country code + Number"
                    className="w-full rounded-lg border border-input bg-background p-3 pl-8 text-sm focus:outline-none focus:ring-2 focus:ring-ring/30"
                  />
                </div>
                <p className="mt-1 text-xs italic text-muted-foreground">
                  Used for automated build alerts and critical system pings.
                </p>
              </div>
            </div>
          </section>

          {/* Dangerous Actions */}
          <section className="flex flex-col items-center justify-between gap-4 rounded-xl border border-destructive/30 bg-destructive/5 p-6 md:flex-row">
            <div>
              <h3 className="text-sm font-bold text-destructive">
                Deactivate Account
              </h3>
              <p className="text-xs text-muted-foreground">
                Permanently remove your access and data from ProjectMatrix. This
                action cannot be undone.
              </p>
            </div>
            <button
              onClick={handleDeactivate}
              className="rounded-lg border border-destructive px-6 py-2 text-sm font-medium text-destructive transition-all hover:bg-destructive hover:text-destructive-foreground active:opacity-80 cursor-pointer"
            >
              Deactivate
            </button>
          </section>
        </div>

        {/* Global Actions */}
        <div className="mt-12 flex items-center justify-end gap-4 border-t border-border pt-8">
          <button
            onClick={() => {
              settingsApi
                .getMe()
                .then((data) => {
                  setDisplayName(data.displayName || "");
                  setEmail(data.email || "");
                  setWhatsapp(data.whatsapp || "");
                  setCurrentPassword("");
                  setNewPassword("");
                  setConfirmPassword("");
                })
                .catch(console.error);
            }}
            className="text-sm font-medium text-muted-foreground decoration-border hover:underline cursor-pointer"
          >
            Cancel Changes
          </button>
          <SaveButton
            state={global.state}
            onClick={handleSaveAll}
            idleLabel="Save All Settings"
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-12 w-full border-t border-border bg-muted text-xs text-muted-foreground">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between px-8 py-4 md:flex-row">
          <div className="mb-2 md:mb-0">
            <span className="text-sm font-bold text-primary">
              ProjectMatrix
            </span>
            <span className="ml-2">
              © 2024 ProjectMatrix Technical Solutions. All rights reserved.
            </span>
          </div>
          <div className="flex gap-6">
            <a
              href="#"
              className="underline transition-colors hover:text-primary"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="underline transition-colors hover:text-primary"
            >
              Terms of Service
            </a>
            <a
              href="#"
              className="underline transition-colors hover:text-primary"
            >
              API Documentation
            </a>
            <a
              href="#"
              className="underline transition-colors hover:text-primary"
            >
              Support
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
