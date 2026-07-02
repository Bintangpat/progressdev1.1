"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Star,
  Plus,
  Minus,
  Bolt,
  FolderOpen,
  Bot,
  Rocket,
  ShieldCheck,
  Network,
} from "lucide-react";
import Link from "next/link";

// Data untuk section Outcomes (Accordion)
const outcomesData = [
  {
    id: "01",
    title: "ACCELERATION SPRINTS™",
    description:
      "Test a new technology initiative in 1-2 weeks, create a strategy to increase key metrics, identify and eliminate delivery bottlenecks.",
    colorClass: "bg-[#ffa454] text-[#713b00] dark:bg-[#ffa454]/90",
    textClass: "text-[#713b00]",
    accentBg: "bg-[#ffdcc3]",
  },
  {
    id: "02",
    title: "EFFICIENT DEVELOPMENT",
    description:
      "Scale your delivery velocity with integrated high-performing engineers. Minimize tech debt while increasing feature deployment speed seamlessly.",
    colorClass: "bg-[#cabeff] text-[#1c0062] dark:bg-[#4a00e0] dark:text-white",
    textClass: "text-[#3300a3] dark:text-[#f0dbff]",
    accentBg: "bg-[#e6deff]",
  },
  {
    id: "03",
    title: "SPECIALISTS ON DEMAND",
    description:
      "Gain immediate access to deep domain experts in cloud architecture, cryptography, and complex systems engineering without the hiring overhead.",
    colorClass: "bg-[#ddb7ff] text-[#2c0050] dark:bg-[#6d00ba] dark:text-white",
    textClass: "text-[#4e0086] dark:text-[#f0dbff]",
    accentBg: "bg-[#f0dbff]",
  },
  {
    id: "04",
    title: "DATA & AI",
    description:
      "Integrate production-grade LLM chains, machine learning workflows, and robust data pipelines into your existing product lines securely.",
    colorClass: "bg-[#ffdad6] text-[#93000a] dark:bg-[#ba1a1a] dark:text-white",
    textClass: "text-[#ba1a1a] dark:text-[#ffdad6]",
    accentBg: "bg-[#ffdad6]",
  },
];

export default function DevProgressLanding() {
  const [activeAccordion, setActiveAccordion] = useState<string>("01");

  // Variasi animasi untuk staggered reveal load
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15 } as const,
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 90, damping: 14 } as const,
    },
  };

  return (
    <div className="bg-[#fcf9f8] text-[#1c1b1b] antialiased selection:bg-[#3300a3]/10 overflow-x-hidden min-h-screen ">
      {/* TopNavBar */}
      <nav className="fixed top-0 w-full z-50 bg-white/60 backdrop-blur-xl border-b border-[#f0eded] shadow-sm">
        <div className="flex justify-between items-center h-20 px-6 md:px-20 max-w-[1280px] mx-auto">
          <div className="text-[32px] font-bold text-[#1c1b1b] tracking-tight">
            DevProgress
          </div>
          <div className="hidden lg:flex items-center gap-8">
            <a
              className="text-[16px] text-[#3300a3] font-bold border-b-2 border-[#3300a3] py-1"
              href="#case-studies"
            >
              Case Studies
            </a>
            <a
              className="text-[16px] text-[#484456] hover:text-[#3300a3] transition-all duration-300"
              href="#services"
            >
              Services
            </a>
            <a
              className="text-[16px] text-[#484456] hover:text-[#3300a3] transition-all duration-300"
              href="#expertise"
            >
              Expertise
            </a>
            <a
              className="text-[16px] text-[#484456] hover:text-[#3300a3] transition-all duration-300"
              href="#how-we-deliver"
            >
              How we deliver
            </a>
            <a
              className="text-[16px] text-[#484456] hover:text-[#3300a3] transition-all duration-300"
              href="#insights"
            >
              Insights
            </a>
            <a
              className="text-[16px] text-[#484456] hover:text-[#3300a3] transition-all duration-300"
              href="#about"
            >
              About
            </a>
          </div>
          <Link href="/auth/login">
            <button className="bg-[#3300a3] text-white px-6 py-3 rounded-full text-[14px] font-semibold hover:bg-[#3300a3]/90 hover:scale-105 active:scale-95 transition-all duration-300 shadow-md shadow-[#3300a3]/10">
              Get in touch
            </button>
          </Link>
        </div>
      </nav>
      <div className="w-full h-20 bg-white relative" />
      {/* Hero Section */}
      <section
        className="relative pt-40 pb-24 md:pb-32 px-6 md:px-20 bg-cover bg-center"
        style={{
          backgroundImage: `url('/image.png')`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-[#fcf9f8] to-transparent z-0 pointer-events-none" />

        <motion.div
          className="max-w-[1280px] mx-auto relative z-10"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-10">
              <motion.h1
                className="text-[44px] sm:text-[60px] md:text-[72px] font-bold leading-[1.1] tracking-[-0.04em] mb-12 text-[#1c1b1b]"
                variants={itemVariants}
              >
                Build with confidence <br />
                and deliver on time
              </motion.h1>

              <motion.div
                className="grid grid-cols-1 md:grid-cols-3 gap-12 items-start mt-16"
                variants={itemVariants}
              >
                <div className="space-y-4">
                  <p className="text-[#484456] text-[18px] leading-relaxed">
                    Unlock development capacity, remove biggest delivery
                    blockers and see your key metrics improve
                  </p>
                </div>
                <div className="hidden md:flex items-center justify-center pt-2 text-[#3300a3]">
                  <motion.div
                    animate={{ x: [0, 8, 0] }}
                    transition={{
                      repeat: Infinity,
                      duration: 1.5,
                      ease: "easeInOut",
                    }}
                  >
                    <ArrowRight className="w-12 h-12" />
                  </motion.div>
                </div>
                <div className="space-y-4">
                  <p className="text-[#484456] text-[18px] leading-relaxed">
                    All without refocusing your core team
                  </p>
                  <div className="flex items-center gap-3 mt-6">
                    <div className="bg-[#f0eded] px-3 py-1.5 rounded-lg font-bold text-[18px] text-[#1c1b1b]">
                      Clutch
                    </div>
                    <div>
                      <div className="text-[#1c1b1b] font-bold text-[16px]">
                        4.8 / 5
                      </div>
                      <div className="flex text-[#904d00] gap-0.5 mt-0.5">
                        <Star className="w-4 h-4 fill-current" />
                        <Star className="w-4 h-4 fill-current" />
                        <Star className="w-4 h-4 fill-current" />
                        <Star className="w-4 h-4 fill-current" />
                        <Star className="w-4 h-4 fill-current opacity-50" />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Client Logos */}
      <section
        id="about"
        className="py-16 px-6 md:px-20 bg-white border-y border-[#c9c3d9]/30"
      >
        <div className="max-w-[1280px] mx-auto text-center">
          <h2 className="text-[14px] font-bold text-[#797488] mb-10 tracking-[0.15em] uppercase">
            TRUSTED BY 160+ PRODUCT DEVELOPMENT TEAMS
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 items-center justify-items-center opacity-40">
            {Array.from({ length: 5 }).map((_, idx) => (
              <div
                key={idx}
                className="h-8 w-32 bg-[#797488]/30 rounded-md animate-pulse"
              />
            ))}
          </div>
        </div>
      </section>

      {/* Value Proposition */}
      <section
        id="services"
        className="py-24 px-6 md:px-20 overflow-hidden bg-white/50"
      >
        <div className="max-w-[1280px] mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-[28px] sm:text-[36px] md:text-[48px] font-semibold text-[#1c1b1b] leading-tight tracking-[-0.02em]">
              <ArrowRight className="inline-block w-8 h-8 md:w-10 md:h-10 text-[#3300a3] mr-2 align-middle -mt-1" />
              We help CTOs and product teams speed up{" "}
              <span className="inline-flex items-center text-[#4a00e0] px-2 py-0.5 rounded-lg bg-[#e6deff] mx-1 font-bold whitespace-nowrap">
                development <Bolt className="w-5 h-5 ml-1 fill-current" />
              </span>{" "}
              modernize{" "}
              <span className="inline-flex items-center text-[#904d00] px-2 py-0.5 rounded-lg bg-[#ffdcc3] mx-1 font-bold whitespace-nowrap">
                existing products <FolderOpen className="w-5 h-5 ml-1" />
              </span>{" "}
              and adopt{" "}
              <span className="inline-flex items-center text-[#3300a3] px-2 py-0.5 rounded-lg bg-[#e6deff] mx-1 font-bold whitespace-nowrap">
                AI <Bot className="w-5 h-5 ml-1" />
              </span>{" "}
              so they can{" "}
              <span className="inline-flex items-center text-[#6900b3] px-2 py-0.5 rounded-lg bg-[#f0dbff] mx-1 font-bold whitespace-nowrap">
                ship faster <Rocket className="w-5 h-5 ml-1" />
              </span>{" "}
              without compromising on quality. That’s our promise.
            </h3>
          </div>
        </div>
      </section>

      {/* Outcomes Section (Accordion) */}
      <section id="how-we-deliver" className="py-24 px-6 md:px-20 bg-[#f6f3f2]">
        <div className="max-w-[1280px] mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-16 gap-4">
            <div>
              <h2 className="text-[36px] md:text-[48px] font-bold tracking-tight">
                See tangible outcomes
              </h2>
            </div>
            <span className="text-[14px] font-bold text-[#797488] uppercase tracking-[0.15em]">
              WHAT WE DO
            </span>
          </div>

          <div className="space-y-4">
            {outcomesData.map((item) => {
              const isOpen = activeAccordion === item.id;
              return (
                <motion.div
                  key={item.id}
                  layout
                  onClick={() => setActiveAccordion(isOpen ? "" : item.id)}
                  className={`rounded-2xl p-6 md:p-8 overflow-hidden relative cursor-pointer border transition-all duration-300 ${
                    isOpen
                      ? `${item.colorClass} border-transparent shadow-lg`
                      : "bg-[#eae7e7]/60 hover:bg-[#eae7e7]/90 border-transparent"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4 md:gap-6 z-10">
                      <span
                        className={`text-[20px] md:text-[24px] font-bold ${isOpen ? "text-current" : "text-[#797488]"}`}
                      >
                        {item.id}
                      </span>
                      <h3
                        className={`text-[20px] md:text-[24px] font-bold uppercase tracking-tight ${isOpen ? "text-current" : "text-[#1c1b1b]"}`}
                      >
                        {item.title}
                      </h3>
                    </div>
                    <div className="z-10 text-current p-1">
                      {isOpen ? (
                        <Minus className="w-6 h-6" />
                      ) : (
                        <Plus className="w-6 h-6 text-[#797488]" />
                      )}
                    </div>
                  </div>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0, marginTop: 0 }}
                        animate={{ height: "auto", opacity: 1, marginTop: 24 }}
                        exit={{ height: 0, opacity: 0, marginTop: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="max-w-2xl z-10 relative"
                      >
                        <p className="text-[16px] md:text-[18px] leading-relaxed opacity-90">
                          {item.description}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Decorative Background Glow Layer */}
                  {isOpen && (
                    <motion.div
                      layoutId="glow"
                      className={`absolute -right-20 -bottom-20 w-80 h-80 ${item.accentBg} opacity-30 blur-3xl rounded-full pointer-events-none`}
                    />
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Case Studies Section */}
      <section id="case-studies" className="py-24 px-6 md:px-20 bg-white">
        <div className="max-w-[1280px] mx-auto">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 mb-20">
            <h2 className="text-[36px] md:text-[48px] font-bold tracking-tight max-w-xl">
              Effective software development
            </h2>
            <div className="flex flex-col items-start lg:items-end gap-6 w-full lg:w-auto">
              <p className="text-[#484456] text-[16px] lg:text-right max-w-sm">
                160+ product development teams made their product competitive
                with our help
              </p>
              <button className="bg-[#313030] text-white px-8 py-4 rounded-lg text-[14px] font-bold uppercase tracking-wider hover:bg-[#1c1b1b] transition-all">
                Go to cases
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Left Column Cluster */}
            <div className="lg:col-span-5 flex flex-col gap-10">
              {/* Case 1 */}
              <div className="group cursor-pointer">
                <div className="bg-[#f6f3f2] rounded-3xl mb-6 overflow-hidden relative min-h-[320px] flex items-end border border-[#f0eded]">
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105 bg-slate-200"
                    style={{
                      backgroundImage: `url('https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=600&auto=format&fit=crop')`,
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-[#3300a3] font-bold text-[16px]">
                    <ArrowRight className="w-4 h-4 shrink-0" />
                    <span>
                      SEPA certification enabled one bank to reach 36+ countries
                    </span>
                  </div>
                  <div className="text-[12px] font-bold text-[#797488] tracking-widest uppercase pl-6">
                    UNDER NDA
                  </div>
                </div>
              </div>

              {/* Case 2 */}
              <div className="group cursor-pointer">
                <div className="bg-[#f6f3f2] rounded-3xl p-10 mb-6 overflow-hidden relative min-h-[320px] flex items-center justify-center border border-[#f0eded]">
                  <motion.div
                    whileHover={{ rotate: -3, scale: 1.02 }}
                    className="bg-white/70 backdrop-blur-md p-6 rounded-2xl shadow-xl w-64 z-10 border border-white/40 transform -rotate-6 transition-transform"
                  >
                    <div className="w-full h-28 bg-[#3300a3]/10 rounded mb-4" />
                    <div className="h-4 w-3/4 bg-[#1c1b1b]/10 rounded mb-2" />
                    <div className="h-4 w-1/2 bg-[#1c1b1b]/5 rounded" />
                  </motion.div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-[#3300a3] font-bold text-[16px]">
                    <ArrowRight className="w-4 h-4 shrink-0" />
                    <span>
                      A remade backend cut eSky's time to market by 75%
                    </span>
                  </div>
                  <div className="text-[12px] font-bold text-[#797488] tracking-widest uppercase pl-6">
                    ESKY.PL
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column Featured Cluster */}
            <div className="lg:col-span-7">
              <div className="group cursor-pointer h-full">
                <div className="bg-[#ffdcc3] rounded-3xl p-8 md:p-16 relative overflow-hidden h-full flex flex-col justify-between border border-transparent hover:border-[#ffa454]/30 transition-all">
                  <div className="z-10">
                    <div className="flex items-center gap-4 text-[#904d00] mb-12">
                      <ArrowRight className="w-8 h-8 shrink-0 group-hover:translate-x-1.5 transition-transform" />
                      <h3 className="text-[24px] md:text-[32px] font-bold tracking-tight leading-tight">
                        Marketplace consolidation contributed to 4x revenue
                      </h3>
                    </div>
                    <span className="text-[12px] font-bold text-[#904d00] uppercase tracking-widest bg-[#2f1500]/5 px-4 py-2 rounded-full">
                      PETS4HOMES
                    </span>
                  </div>

                  <div className="relative mt-16 md:mt-12 flex justify-center">
                    <div className="w-full max-w-sm h-64 bg-amber-600/10 rounded-2xl border border-amber-600/20 shadow-inner flex items-center justify-center text-amber-900/40 text-sm font-mono p-4 text-center">
                      Marketplace Mobile Application Integration Mockup
                    </div>
                  </div>

                  {/* Floating Context Card Inside */}
                  <div className="absolute bottom-8 right-8 w-64 bg-white/50 backdrop-blur-xl p-5 rounded-2xl border border-white/30 hidden xl:block shadow-sm">
                    <div className="flex items-center gap-2 mb-2 text-[#3300a3] font-bold text-[14px]">
                      <ArrowRight className="w-4 h-4" />
                      <span>AI Processing</span>
                    </div>
                    <p className="text-[12px] text-[#484456] leading-relaxed">
                      Pension Lab slashed document processing time by 95% with
                      an AI app
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges Extra Section */}
      <section
        id="expertise"
        className="py-12 px-6 md:px-20 bg-[#fcf9f8] opacity-75"
      >
        <div className="max-w-[1280px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl border border-[#c9c3d9] border-dashed flex items-start gap-4">
            <div className="p-3 bg-[#3300a3]/5 rounded-xl text-[#3300a3]">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-[16px] font-bold text-[#1c1b1b]">
                Secure Enterprise Operations
              </h4>
              <p className="text-[14px] text-[#484456] mt-1">
                Full NDA compliance, secure access parameters, and encrypted
                source structures.
              </p>
            </div>
          </div>
          <div className="p-6 rounded-2xl border border-[#c9c3d9] border-dashed flex items-start gap-4">
            <div className="p-3 bg-[#3300a3]/5 rounded-xl text-[#3300a3]">
              <Network className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-[16px] font-bold text-[#1c1b1b]">
                Native Pipeline Integration
              </h4>
              <p className="text-[14px] text-[#484456] mt-1">
                Direct sync with internal architectures, GitHub deployment
                tracks, and tracking platforms.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#f0eded] border-t border-[#c9c3d9]/50 w-full py-16">
        <div className="max-w-[1280px] mx-auto px-6 md:px-20 flex flex-col sm:flex-row justify-between items-center gap-8">
          <div className="text-[24px] font-bold text-[#1c1b1b]">
            DevProgress
          </div>
          <div className="flex flex-col sm:flex-row gap-6 items-center text-[14px]">
            <div className="flex gap-6">
              <a
                className="text-[#484456] hover:text-[#3300a3] transition-colors"
                href="#"
              >
                Privacy Policy
              </a>
              <a
                className="text-[#484456] hover:text-[#3300a3] transition-colors"
                href="#"
              >
                Terms of Service
              </a>
              <a
                className="text-[#484456] hover:text-[#3300a3] transition-colors"
                href="#"
              >
                Contact
              </a>
            </div>
            <div className="text-[#484456] font-medium sm:border-l sm:border-[#c9c3d9] sm:pl-6">
              © {new Date().getFullYear()} DevProgress. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
