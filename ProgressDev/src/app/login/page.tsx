"use client";

import { useState } from "react";
import { login, signup } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, Activity } from "lucide-react";

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    try {
      if (isLogin) {
        const result = await login(formData);
        if (result?.error) {
          toast.error(result.error);
        }
      } else {
        const result = await signup(formData);
        if (result?.error) {
          toast.error(result.error);
        } else if (result?.success) {
          toast.success(result.success);
          setIsLogin(true);
        }
      }
    } catch {
      toast.error("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-background">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-linear-to-br from-violet-950/40 via-background to-indigo-950/40" />
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl" />

      <Card className="relative w-full max-w-md mx-4 border-white/10 bg-card/80 backdrop-blur-xl shadow-2xl">
        <CardHeader className="text-center space-y-3">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="p-2 rounded-xl bg-linear-to-br from-violet-500 to-indigo-600 shadow-lg shadow-violet-500/25">
              <Activity className="h-6 w-6 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold bg-linear-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
            DevProgress
          </CardTitle>
          <CardDescription>
            {isLogin
              ? "Masuk ke dashboard untuk mengelola proyek"
              : "Buat akun baru untuk mulai tracking proyek"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="displayName">Nama Lengkap</Label>
                <Input
                  id="displayName"
                  name="displayName"
                  type="text"
                  placeholder="John Doe"
                  required={!isLogin}
                  className="bg-white/5 border-white/10 focus:border-violet-500/50"
                />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="dev@example.com"
                required
                className="bg-white/5 border-white/10 focus:border-violet-500/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                required
                minLength={6}
                className="bg-white/5 border-white/10 focus:border-violet-500/50"
              />
            </div>
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="accessCode">Kode Akses</Label>
                <Input
                  id="accessCode"
                  name="accessCode"
                  type="password"
                  placeholder="Masukkan kode akses"
                  required={!isLogin}
                  className="bg-white/5 border-white/10 focus:border-violet-500/50"
                />
                <p className="text-xs text-muted-foreground">
                  Hubungi admin untuk mendapatkan kode akses.
                </p>
              </div>
            )}
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-linear-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 shadow-lg shadow-violet-500/25 transition-all duration-300"
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLogin ? "Masuk" : "Daftar"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-muted-foreground hover:text-violet-400 transition-colors"
            >
              {isLogin ? "Belum punya akun? Daftar" : "Sudah punya akun? Masuk"}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
