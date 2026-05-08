"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Eye,
  EyeOff,
  ArrowRight,
  Chrome,
  Apple,
  Loader2,
  User,
} from "lucide-react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Varian animasi untuk transisi masuk
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 },
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch("http://localhost:3001/auth/register", {
        method: "POST",
        body: JSON.stringify(formData),
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Registrasi berhasil! Mengarahkan...");
        // Auto sign in after registration
        const result = await signIn("credentials", {
          email: formData.email,
          password: formData.password,
          redirect: false,
        });

        if (result?.error) {
          router.push("/auth/login");
        } else {
          router.push("/stakeholder");
        }
      } else {
        toast.error(data.message || "Gagal registrasi");
      }
    } catch (error) {
      toast.error("Terjadi kesalahan sistem");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    signIn("google", { callbackUrl: "/stakeholder" });
  };

  return (
    <div className="min-h-screen bg-[#13131a] flex items-center justify-center p-4 md:p-0">
      <motion.main
        initial={{ scale: 0.98, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-5xl bg-[#1e1e2d] rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row border border-[#3f3f5f]/30"
      >
        {/* Sisi Kiri: Visual Branding */}
        <section className="hidden md:flex md:w-1/2 relative bg-black overflow-hidden group">
          <Image
            alt="Technical Execution background"
            src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2070&auto=format&fit=crop"
            fill
            className="object-cover opacity-70 group-hover:scale-105 transition-transform duration-700"
            priority
          />
          <div className="relative z-10 p-12 flex flex-col justify-between h-full w-full bg-linear-to-t from-[#1e1e2d]/90 to-transparent">
            <div className="flex justify-between items-center">
              <div className="text-white font-bold text-2xl tracking-widest">
                DEVPROGRESS
              </div>
              <Link
                href="/"
                className="text-xs text-white/80 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full flex items-center gap-2 hover:bg-white/20 transition-colors border border-white/10"
              >
                Back to website <ArrowRight size={14} />
              </Link>
            </div>

            <div className="mb-12">
              <motion.h1
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="text-4xl font-bold text-white leading-tight mb-4"
              >
                Join the <br /> Future of Dev
              </motion.h1>
              <p className="text-white/60 text-sm">
                Start monitoring your projects with transparency and speed.
              </p>

              <div className="flex gap-2 mt-8">
                <span className="h-1 w-10 bg-white rounded-full" />
                <span className="h-1 w-6 bg-white/20 rounded-full" />
                <span className="h-1 w-6 bg-white/20 rounded-full" />
              </div>
            </div>
          </div>
        </section>

        {/* Sisi Kanan: Form Register */}
        <section className="w-full md:w-1/2 p-8 md:p-16 flex flex-col justify-center">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="w-full max-w-sm mx-auto md:mx-0"
          >
            <div className="mb-10 text-center md:text-left">
              <h2 className="text-3xl font-bold text-white mb-2">
                Create Account
              </h2>
              <p className="text-[#888eb0] text-sm">
                Already have an account?{" "}
                <Link
                  href="/auth/login"
                  className="text-[#7c5dfa] hover:underline font-medium"
                >
                  Sign in
                </Link>
              </p>
            </div>

            <form onSubmit={handleRegister} className="space-y-5">
              <motion.div variants={itemVariants}>
                <label className="sr-only">Full Name</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="Full Name"
                    className="w-full bg-[#2d2d44] border border-[#3f3f5f] rounded-xl p-4 pl-12 text-sm text-white placeholder-[#888eb0] focus:outline-none focus:ring-2 focus:ring-[#7c5dfa] focus:border-transparent transition-all"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                  <User
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#888eb0]"
                  />
                </div>
              </motion.div>

              <motion.div variants={itemVariants}>
                <label className="sr-only">Email</label>
                <input
                  type="email"
                  required
                  placeholder="Email address"
                  className="w-full bg-[#2d2d44] border border-[#3f3f5f] rounded-xl p-4 text-sm text-white placeholder-[#888eb0] focus:outline-none focus:ring-2 focus:ring-[#7c5dfa] focus:border-transparent transition-all"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </motion.div>

              <motion.div variants={itemVariants} className="relative">
                <label className="sr-only">Password</label>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Password"
                  className="w-full bg-[#2d2d44] border border-[#3f3f5f] rounded-xl p-4 text-sm text-white placeholder-[#888eb0] focus:outline-none focus:ring-2 focus:ring-[#7c5dfa] focus:border-transparent transition-all"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#888eb0] hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </motion.div>

              <motion.button
                variants={itemVariants}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#7c5dfa] hover:bg-[#6a4fdf] text-white font-semibold py-4 rounded-xl transition-all shadow-lg shadow-[#7c5dfa]/20 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  "Create Account"
                )}
              </motion.button>

              <motion.div
                variants={itemVariants}
                className="relative flex items-center py-4"
              >
                <div className="grow border-t border-[#3f3f5f]"></div>
                <span className="shrink mx-4 text-xs text-[#888eb0]">
                  Or register with
                </span>
                <div className="grow border-t border-[#3f3f5f]"></div>
              </motion.div>

              <motion.div
                variants={itemVariants}
                className="grid grid-cols-2 gap-4"
              >
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  className="flex items-center justify-center gap-2 py-3 border border-[#3f3f5f] rounded-xl hover:bg-[#2d2d44] text-white text-sm transition-colors group"
                >
                  <Chrome
                    size={18}
                    className="group-hover:scale-110 transition-transform text-[#EA4335]"
                  />
                  <span>Google</span>
                </button>
                <button
                  type="button"
                  className="flex items-center justify-center gap-2 py-3 border border-[#3f3f5f] rounded-xl hover:bg-[#2d2d44] text-white text-sm transition-colors group"
                >
                  <Apple
                    size={18}
                    className="group-hover:scale-110 transition-transform fill-white"
                  />
                  <span>Apple</span>
                </button>
              </motion.div>
            </form>
          </motion.div>
        </section>
      </motion.main>
    </div>
  );
}
