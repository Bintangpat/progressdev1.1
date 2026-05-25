"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  ArrowUpRight,
  ArrowRight,
  Star,
  Paintbrush,
  Globe,
  Code,
  Smartphone,
  Terminal,
} from "lucide-react";

// Data untuk Bento Core Features
const FEATURES = [
  {
    icon: Star,
    title: "Real-time Dashboard",
    desc: "Visibilitas instan untuk status proyek, progres sprint, dan metrik kesehatan development.",
  },
  {
    icon: Paintbrush,
    title: "Milestone Tracking",
    desc: "Pantau pencapaian besar dan pastikan pengerjaan fitur berjalan sesuai tenggat waktu.",
  },
  {
    icon: Globe,
    title: "Client Portal",
    desc: "Akses khusus dan aman bagi stakeholder untuk melihat update tanpa mengganggu alur kerja developer.",
  },
  {
    icon: Code,
    title: "Task & Bug Management",
    desc: "Kelola backlog, perbaikan bug, dan penugasan tim secara terstruktur.",
  },
  {
    icon: Smartphone,
    title: "Automated Reports",
    desc: "Hasilkan ringkasan progres mingguan atau bulanan secara otomatis dengan satu klik.",
  },
  {
    icon: Terminal,
    title: "Feedback Loop",
    desc: "Stakeholder dapat meninggalkan komentar atau revisi langsung pada task atau fitur tertentu.",
  },
];

// Data untuk Slanted Cards (How it works)
const STEPS = [
  {
    id: "01",
    title: "01 Inisiasi",
    desc: "Tambahkan stakeholder, definisikan scope proyek, dan tetapkan milestone utama pengembangan.",
    rotate: "hover:rotate-0 rotate-[3deg]",
    align: "md:self-end md:mr-24",
  },
  {
    id: "02",
    title: "02 Tracking",
    desc: "Tim developer memperbarui status task dan sprint secara progresif di dalam sistem.",
    rotate: "hover:rotate-0 rotate-[-2deg]",
    align: "md:self-start md:ml-12",
  },
  {
    id: "03",
    title: "03 Review",
    desc: "Stakeholder dapat memantau timeline, melihat hasil kerja, dan memberikan feedback langsung.",
    rotate: "hover:rotate-0 rotate-[4deg]",
    align: "md:self-end md:mr-32",
  },
  {
    id: "04",
    title: "04 Delivery",
    desc: "Aplikasi siap dirilis. Sistem menyediakan laporan otomatis dari awal hingga akhir siklus development.",
    rotate: "hover:rotate-0 rotate-[-3deg]",
    align: "md:self-start md:ml-24",
  },
];

export default function ProgressDevLanding() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Varian animasi global untuk Scroll Reveal
  const fadeInUpVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  return (
    <div
      className="bg-[#fdf8f8] text-[#1c1b1b] font-sans antialiased overflow-x-hidden pt-20 selection:bg-[#1c1b1b] selection:text-[#fdf8f8]"
      style={{
        backgroundImage: "radial-gradient(#e5e2e1 1px, transparent 1px)",
        backgroundSize: "20px 20px",
      }}
    >
      {/* --- NAVIGATION BAR --- */}
      <nav className="bg-[#fdf8f8]/80 backdrop-blur-md fixed top-0 left-0 right-0 z-50 border-b border-[#c4c7c7]/30">
        <div className="max-w-[1280px] mx-auto flex justify-between items-center px-6 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-[#444748] hover:opacity-70 transition-opacity md:hidden"
              aria-label="Toggle Menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <div className="font-semibold text-2xl md:text-3xl text-black tracking-tighter">
              Progress Dev.
            </div>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex gap-8 items-center">
            {["Home", "About us", "How we work", "Services", "Portfolio"].map(
              (item, idx) => (
                <a
                  key={idx}
                  className={`${idx === 0 ? "text-black font-bold" : "text-[#444748]"} hover:opacity-70 transition-opacity text-base font-medium`}
                  href="#"
                >
                  {item}
                </a>
              ),
            )}
          </div>

          <button className="bg-black text-white rounded-full px-6 py-2.5 text-xs font-semibold hover:opacity-70 transition-opacity hidden md:block">
            Akses Platform
          </button>
        </div>

        {/* Mobile Dropdown Links */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-[#c4c7c7]/20 bg-[#fdf8f8] px-6 py-4 flex flex-col gap-4"
            >
              {["Home", "About us", "How we work", "Services", "Portfolio"].map(
                (item, idx) => (
                  <a
                    key={idx}
                    className="text-[#444748] text-base font-medium block"
                    href="#"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item}
                  </a>
                ),
              )}
              <button className="bg-black text-white w-full rounded-full py-3 text-sm font-semibold mt-2">
                Akses Platform
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* --- HERO SECTION --- */}
      <header className="px-6 py-12 md:py-24 max-w-[1280px] mx-auto relative flex flex-col md:flex-row gap-12 items-center">
        {/* Left Grid: Text Content */}
        <div className="flex-1 space-y-6 relative z-10">
          <div className="inline-flex items-center border border-[#c4c7c7] rounded-full px-4 py-1">
            <span className="text-[12px] font-semibold text-[#444748] uppercase tracking-wider">
              WELCOME TO PROGRESS DEV
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight uppercase text-black relative leading-[1.1]">
            MEMBANGUN TRANSPARANSI & KEPERCAYAAN STAKEHOLDER
            <svg
              className="absolute -right-4 md:-right-12 top-1/2 w-16 h-16 text-black hidden lg:block"
              fill="none"
              viewBox="0 0 100 100"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M50 5L60 40L95 50L60 60L50 95L40 60L5 50L40 40L50 5Z"
                stroke="currentColor"
                strokeJoin="round"
                strokeWidth="2"
              ></path>
              <path
                d="M50 20V80M20 50H80M30 30L70 70M30 70L70 30"
                stroke="currentColor"
                strokeLinecap="round"
                strokeWidth="1"
              ></path>
            </svg>
          </h1>

          <p className="text-lg md:text-xl text-[#444748] max-w-lg leading-relaxed">
            Pantau setiap fase pengembangan aplikasi dengan mudah. Progress Dev
            menjembatani tim developer dan stakeholder melalui pembaruan
            real-time, memastikan visi Anda terwujud tanpa miskomunikasi.
          </p>

          <div className="flex items-center gap-6 pt-4 relative">
            <button className="bg-black text-white rounded-full px-6 py-3.5 text-xs font-semibold flex items-center gap-2 hover:opacity-80 transition-opacity group">
              Lihat Repositori / Coba Sekarang
              <span className="bg-white text-black rounded-full p-1 flex items-center justify-center transition-transform group-hover:rotate-45">
                <ArrowUpRight size={14} />
              </span>
            </button>
            {/* Hand-drawn decorative arrow wrapper */}
            <svg
              className="w-12 h-12 text-[#444748] absolute left-64 top-10 hidden sm:block opacity-60"
              fill="none"
              viewBox="0 0 50 50"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M5 5Q20 30 45 45M45 45L30 40M45 45L40 30"
                stroke="currentColor"
                strokeLinecap="round"
                strokeJoin="round"
                strokeWidth="2"
              ></path>
            </svg>
          </div>
        </div>

        {/* Right Grid: Visual Card Structure */}
        <div className="flex-1 relative w-full flex justify-center md:justify-end mt-12 md:mt-0">
          {/* Badge Transparansi */}
          <div className="absolute -top-8 -left-4 md:-left-12 bg-white border border-[#c4c7c7] rounded-2xl p-4 shadow-md z-20 flex flex-col items-center rotate-[-5deg]">
            <span className="text-3xl md:text-4xl font-bold text-black tracking-tight">
              250+
            </span>
            <span className="text-[12px] font-semibold text-[#444748] text-center mt-1">
              100% Transparansi Proyek
            </span>
            <div className="flex -space-x-2 mt-3">
              {[0, 1, 2].map((num) => (
                <div
                  key={num}
                  className="w-8 h-8 rounded-full border-2 border-white bg-neutral-300 overflow-hidden"
                >
                  <div className="w-full h-full bg-neutral-400 flex items-center justify-center text-[10px] text-white">
                    Dev
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Main Visual Display Placeholder */}
          <div className="relative w-full max-w-[400px] aspect-[4/5] rounded-[3rem] overflow-hidden bg-[#e5e2e1] shadow-xl">
            <div className="w-full h-full bg-gradient-to-tr from-neutral-400 to-neutral-200 flex items-center justify-center p-8 text-center text-neutral-600 font-medium">
              [Visual Grid Layout Representation Component]
            </div>
          </div>

          <div className="absolute bottom-8 -right-4 md:right-8 bg-black text-white px-6 py-3 rounded-full text-xs font-semibold z-20 shadow-lg">
            Solusi Tracking Development
          </div>
        </div>
      </header>

      {/* --- TEXT MARQUEE --- */}
      <section className="border-y border-[#c4c7c7]/30 py-6 overflow-hidden bg-white mt-12">
        <div className="flex whitespace-nowrap opacity-50 px-4 animate-[marquee_20s_linear_infinite] gap-12 text-2xl md:text-4xl font-medium items-center tracking-tighter">
          <span className="italic">* Real-time Tracking</span>
          <span>*</span>
          <span className="italic">Task Management</span>
          <span>*</span>
          <span className="font-bold">Client Portal</span>
          <span>*</span>
          <span className="font-bold">Seamless Communication *</span>
        </div>
      </section>

      {/* --- BENTO ABOUT SECTION --- */}
      <section className="px-6 py-20 max-w-[1280px] mx-auto">
        <div className="inline-flex items-center border border-[#c4c7c7] rounded-full px-4 py-1 mb-8">
          <span className="text-[12px] font-semibold text-[#444748] uppercase tracking-wider">
            ABOUT PROGRESS DEV
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Left Text Intro */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUpVariants}
            className="md:col-span-5 flex flex-col justify-center space-y-6 relative"
          >
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-black leading-tight">
              Kenali Progress Dev: Mitra Manajemen Proyek Anda
            </h2>
            <p className="text-base text-[#444748] leading-relaxed">
              Kami mengerti bahwa pertanyaan &ldquo;sampai mana
              progresnya?&rdquo; sering kali menghambat produktivitas. Progress
              Dev hadir bukan sekadar sebagai tool, melainkan sebagai jembatan
              komunikasi. Kami menyajikan visibilitas penuh atas status
              pengembangan aplikasi agar tim teknis bisa fokus coding dan
              stakeholder bisa tenang memantau hasil.
            </p>
          </motion.div>

          {/* Right Grid Graphics (Bento Arrangement) */}
          <div className="md:col-span-7 grid grid-cols-2 gap-4 min-h-[350px]">
            <div className="bg-neutral-800 rounded-[24px] flex items-center justify-center text-white/40 font-mono text-xs text-center p-4">
              [Collab Asset Grid Block]
            </div>
            <div className="grid grid-rows-2 gap-4">
              <div className="bg-neutral-300 rounded-[24px] flex items-center justify-center text-neutral-600 font-mono text-xs text-center p-4">
                [Workspace Asset Block]
              </div>
              <div className="bg-neutral-200 rounded-[24px] flex items-center justify-center text-neutral-600 font-mono text-xs text-center p-4">
                [Meeting Asset Block]
              </div>
            </div>
          </div>

          {/* Full Width Highlight Statistics Banner */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUpVariants}
            className="md:col-span-12 bg-black text-white rounded-[2rem] p-8 md:p-12 mt-4 relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-8"
          >
            {/* Background vector aesthetics decor */}
            <svg
              className="absolute bottom-0 right-0 w-1/2 h-full text-white/5 pointer-events-none"
              fill="none"
              preserveAspectRatio="none"
              viewBox="0 0 200 100"
            >
              <path
                d="M0,100 C50,80 100,120 150,80 C200,40 250,100 300,60"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              ></path>
              <path
                d="M0,100 C50,60 100,140 150,60 C200,0 250,120 300,40"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              ></path>
            </svg>

            <div className="relative z-10">
              <div className="text-6xl md:text-7xl font-bold tracking-tighter">
                0%
              </div>
              <div className="text-base text-[#e5e2e1] mt-2 font-medium">
                Miskomunikasi antara Dev & Klien
              </div>
            </div>

            <div className="flex flex-wrap gap-2.5 relative z-10 max-w-lg justify-start md:justify-end">
              {[
                "REAL-TIME UPDATE",
                "KANBAN BOARD",
                "MILESTONES",
                "BUG TRACKING",
                "SPRINT REPORTS",
                "GITHUB INTEGRATION",
              ].map((tag, idx) => (
                <span
                  key={idx}
                  className={`rounded-full px-5 py-2 text-[11px] font-bold tracking-wider uppercase ${idx === 1 || idx === 4 ? "bg-white text-black" : "bg-white/10 border border-white/20 text-white"}`}
                >
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* --- PROCESS SECTION WITH SLANTED CARDS --- */}
      <section className="px-6 py-20 max-w-[1280px] mx-auto relative overflow-hidden">
        <div className="inline-flex items-center border border-[#c4c7c7] rounded-full px-4 py-1 mb-8">
          <span className="text-[12px] font-semibold text-[#444748] uppercase tracking-wider">
            HOW IT WORKS
          </span>
        </div>

        <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-black max-w-2xl mb-16 relative z-10">
          Pantau dari baris kode pertama hingga peluncuran
        </h2>

        <div className="relative w-full max-w-4xl mx-auto flex flex-col gap-12 py-8">
          {/* Central Path Grid Tracker for Desktop Viewport */}
          <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[2px] bg-dashed-path border-l-2 border-dashed border-[#e5e2e1] hidden md:block" />

          {/* Card Engine Loop Mapping */}
          {STEPS.map((step, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              className={`relative z-10 w-full max-w-xs bg-white rounded-2xl border border-[#c4c7c7] p-8 shadow-sm transform transition-all duration-300 ${step.rotate} ${step.align}`}
            >
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-[#fdf8f8] rounded-full border border-[#c4c7c7] flex items-center justify-center">
                <div className="w-2 h-2 bg-black rounded-full" />
              </div>
              <div className="text-4xl font-bold text-[#e5e2e1] tracking-tight">
                {step.id}
              </div>
              <h3 className="text-lg font-bold text-black mt-2">
                {step.title}
              </h3>
              <p className="text-sm text-[#444748] mt-3 leading-relaxed">
                {step.desc}
              </p>
            </motion.div>
          ))}

          <div className="text-center text-3xl md:text-4xl font-medium text-[#c4c7c7] mt-12 rotate-[-2deg] italic tracking-tight">
            &ldquo;No more &apos;how is the progress?&apos; emails.&rdquo;
          </div>
        </div>
      </section>

      {/* --- DARK MODE SERVICES CORE FEATURES GRID --- */}
      <section className="bg-black text-white py-24 mt-12">
        <div className="px-6 max-w-[1280px] mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8">
            <div className="space-y-6 max-w-xl">
              <div className="inline-flex items-center border border-white/20 rounded-full px-4 py-1">
                <span className="text-[12px] font-semibold text-[#e5e2e1] uppercase tracking-wider">
                  CORE FEATURES
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight">
                Dirancang khusus untuk transparansi, bukan sekadar pelaporan
              </h2>
            </div>
            <p className="text-sm text-[#e5e2e1] max-w-sm leading-relaxed">
              Progress Dev menyediakan ekosistem lengkap untuk menjaga
              ekspektasi dan memberikan visibilitas penuh kepada klien Anda.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map((feat, idx) => {
              const IconComp = feat.icon;
              return (
                <div
                  key={idx}
                  className="border border-white/10 rounded-[24px] p-8 bg-white/5 hover:bg-white/10 transition-colors group"
                >
                  <IconComp
                    className="w-8 h-8 text-[#e5e2e1] mb-6 transform group-hover:scale-110 transition-transform"
                    strokeWidth={1.5}
                  />
                  <h3 className="text-lg font-bold mb-2 tracking-tight">
                    {feat.title}
                  </h3>
                  <p className="text-sm text-[#e5e2e1]/70 leading-relaxed">
                    {feat.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* --- FOOTER COMPONENT + END CTA --- */}
      <footer className="bg-white border-t border-[#c4c7c7]/30 w-full rounded-t-[24px] mt-24">
        <div className="px-6 py-20 max-w-[1280px] mx-auto">
          {/* Internal High-impact Dark Box Action Call Container */}
          <div className="bg-black text-white rounded-[2rem] p-12 flex flex-col items-center text-center mb-16 relative overflow-hidden shadow-xl">
            <div
              className="absolute inset-0 opacity-5 pointer-events-none"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(45deg, transparent, transparent 10px, #ffffff 10px, #ffffff 11px)",
              }}
            />
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 relative z-10 max-w-2xl">
              Mari tingkatkan standar komunikasi proyek Anda
            </h2>
            <p className="text-sm md:text-base text-[#e5e2e1] mb-8 max-w-md relative z-10 leading-relaxed">
              Ingin melihat bagaimana Progress Dev dapat menghilangkan hambatan
              komunikasi antara developer dan stakeholder?
            </p>
            <button className="bg-white text-black rounded-full px-8 py-4 text-xs font-semibold flex items-center gap-2 hover:opacity-90 transition-opacity relative z-10">
              Kunjungi GitHub / Akses Platform
              <ArrowRight size={14} />
            </button>
          </div>

          {/* Navigational Anchor Grid Hierarchy */}
          <div className="flex flex-col md:flex-row justify-between items-start gap-8 pt-8 border-t border-[#c4c7c7]/20">
            <div className="text-2xl font-bold tracking-tighter text-black">
              Progress Dev.
            </div>
            <div className="flex flex-col sm:flex-row gap-12 font-medium text-sm text-[#444748]">
              <div className="flex flex-col gap-2.5">
                <a className="hover:text-black transition-colors" href="#">
                  Work
                </a>
                <a className="hover:text-black transition-colors" href="#">
                  Services
                </a>
              </div>
              <div className="flex flex-col gap-2.5">
                <a className="hover:text-black transition-colors" href="#">
                  Process
                </a>
                <a className="hover:text-black transition-colors" href="#">
                  About
                </a>
              </div>
              <div className="flex flex-col gap-2.5">
                <a className="text-black underline font-semibold" href="#">
                  Contact
                </a>
              </div>
            </div>
            <div className="text-xs text-[#444748] opacity-70">
              &copy; 2026 Progress Dev. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
