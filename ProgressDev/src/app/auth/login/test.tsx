"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Eye, EyeOff, ArrowRight, Chrome, Apple, Loader2 } from "lucide-react";
import { signIn, getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        toast.error("Email atau password salah");
      } else {
        toast.success("Berhasil masuk");
        const session = await getSession();
        const role = (session?.user as any)?.role || "stakeholder";
        router.push(`/${role}/dashboard`);
      }
    } catch (error) {
      toast.error("Terjadi kesalahan sistem");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    signIn("google");
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
            src="https://lh3.googleusercontent.com/aida/ADBb0uhrskDOy6YkY0gF-dPdsUfUeSbPYKf2EUx98GsD4BCcFTt3kff4G4DvwhR1j8Z_dBBFbtyTKh_zLYM_svojv29TPSXBx4Jgtm6hGShBDQbmF71OsBtDIzCK1aANrwo_U3_ioauGLUPIwbBqM1l6D63sObNF8bM7OLG2M0IUFg36QkII0T1suceHKeSi_hCnUv0GoUCWfjGAkPTAnhkD1TQXw8Brafgrvzhdrel7Hi_FrmJZnTqgN1sIoQ49JYPi-gt0n7ZoKbcqphM"
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
                Streamlining <br /> Technical Execution
              </motion.h1>
              <p className="text-white/60 text-sm">
                Empowering developers to reach milestones faster.
              </p>

              <div className="flex gap-2 mt-8">
                <span className="h-1 w-6 bg-white/20 rounded-full" />
                <span className="h-1 w-6 bg-white/20 rounded-full" />
                <span className="h-1 w-10 bg-white rounded-full" />
              </div>
            </div>
          </div>
        </section>

        {/* Sisi Kanan: Form Login */}
        <section className="w-full md:w-1/2 p-8 md:p-16 flex flex-col justify-center">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="w-full max-w-sm mx-auto md:mx-0"
          >
            <div className="mb-10 text-center md:text-left">
              <h2 className="text-3xl font-bold text-white mb-2">Sign in</h2>
              <p className="text-[#888eb0] text-sm">
                New to DevProgress?{" "}
                <Link
                  href="/auth/register"
                  className="text-[#7c5dfa] hover:underline font-medium"
                >
                  Create an account
                </Link>
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
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

              <motion.div
                variants={itemVariants}
                className="flex items-center justify-between text-xs"
              >
                <label className="flex items-center text-[#888eb0] cursor-pointer group">
                  <input
                    type="checkbox"
                    className="rounded bg-[#2d2d44] border-[#3f3f5f] text-[#7c5dfa] focus:ring-[#7c5dfa] mr-2 transition-colors"
                  />
                  Remember me
                </label>
                <Link
                  href="/auth/forgot-password"
                  className="text-[#7c5dfa] hover:underline"
                >
                  Forgot password?
                </Link>
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
                  "Sign In"
                )}
              </motion.button>

              <motion.div
                variants={itemVariants}
                className="relative flex items-center py-4"
              >
                <div className="grow border-t border-[#3f3f5f]"></div>
                <span className="shrink mx-4 text-xs text-[#888eb0]">
                  Or login with
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

            <motion.p
              variants={itemVariants}
              className="mt-10 text-center text-[11px] text-[#888eb0] leading-relaxed"
            >
              By clicking "Sign In", you agree to our <br />
              <Link href="/terms" className="underline hover:text-white">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="underline hover:text-white">
                Privacy Policy
              </Link>
            </motion.p>
          </motion.div>
        </section>
      </motion.main>
    </div>
  );
}
