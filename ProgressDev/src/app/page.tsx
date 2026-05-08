"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Terminal,
  ShieldCheck,
  Activity,
  ArrowUpRight,
  Globe,
  Monitor,
} from "lucide-react";

// --- Animation Variants ---
const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

// --- Sub-Components ---

const MetricCard = ({ value, label }: { value: string; label: string }) => (
  <motion.div variants={fadeIn} className="text-center text-white">
    <h4 className="text-[32px] md:text-[40px] font-bold">{value}</h4>
    <p className="text-blue-100/70 text-sm md:text-base font-medium">{label}</p>
  </motion.div>
);

const CapabilityItem = ({
  icon: Icon,
  title,
  description,
}: {
  icon: any;
  title: string;
  description: string;
}) => (
  <motion.div variants={fadeIn} className="flex gap-6 group cursor-default">
    <div className="shrink-0 w-14 h-14 rounded-full border border-slate-200 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 ease-out shadow-sm">
      <Icon size={24} />
    </div>
    <div>
      <h3 className="text-xl font-bold mb-2 text-slate-900">{title}</h3>
      <p className="text-slate-600 text-sm leading-relaxed max-w-md">
        {description}
      </p>
      <button className="inline-flex items-center gap-1 text-blue-600 font-semibold text-sm mt-4 hover:gap-2 transition-all">
        Learn more <ArrowRight size={14} />
      </button>
    </div>
  </motion.div>
);

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-blue-100 selection:text-blue-700">
      {/* Top Navigation */}
      <nav className="sticky top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="flex justify-between items-center max-w-7xl mx-auto px-6 h-20">
          <div className="flex items-center gap-12">
            <span className="text-2xl font-extrabold tracking-tighter text-slate-900">
              DevProgress
            </span>
            <div className="hidden md:flex gap-8">
              {["Solutions", "Integrations", "Testimonials", "Pricing"].map(
                (item) => (
                  <a
                    key={item}
                    href="#"
                    className="text-slate-500 font-medium text-sm hover:text-blue-600 transition-colors"
                  >
                    {item}
                  </a>
                ),
              )}
            </div>
          </div>
          <div className="flex items-center gap-6">
            <button className="text-sm font-semibold text-slate-700 hover:text-blue-600">
              Log In
            </button>
            <button className="px-6 py-2.5 bg-blue-600 text-white rounded-full text-sm font-bold hover:shadow-lg hover:shadow-blue-200 transition-all active:scale-95 flex items-center gap-2">
              Get Started <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        {/* Background Decorative Blur */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-blue-50/50 blur-[120px] -z-10 rounded-full" />

        <div className="max-w-7xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-[11px] font-bold uppercase tracking-widest mb-8 border border-blue-100"
          >
            <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
            Bondly for Technical Execution
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 max-w-5xl mx-auto mb-8 leading-[1.1]"
          >
            Streamline Technical Execution with{" "}
            <span className="text-blue-600">DevProgress</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto mb-12 leading-relaxed"
          >
            The all-in-one platform for admins, developers, and stakeholders to
            track progress, manage tasks, and deliver faster.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row justify-center gap-4 mb-20"
          >
            <button className="px-10 py-4 bg-slate-900 text-white rounded-full font-bold shadow-2xl shadow-slate-200 hover:bg-blue-600 hover:shadow-blue-100 transition-all">
              Start Free Trial
            </button>
            <button className="px-10 py-4 bg-white text-slate-900 border border-slate-200 rounded-full font-bold hover:bg-slate-50 transition-all">
              View Demo
            </button>
          </motion.div>

          {/* Hero Image Mockup */}
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 1, ease: "circOut" }}
            className="relative max-w-5xl mx-auto"
          >
            <div className="absolute inset-0 bg-blue-600/5 blur-[100px] rounded-full" />
            <div className="relative z-10 bg-white rounded-2xl shadow-2xl border border-slate-100 p-2">
              <img
                alt="Dashboard Preview"
                className="w-full rounded-xl shadow-inner"
                src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=2426"
              />
              {/* Floating Badge */}
              <div className="absolute -left-10 top-1/4 bg-white p-5 rounded-2xl shadow-2xl border border-slate-100 hidden lg:block">
                <p className="text-blue-600 font-black text-2xl">95% Faster</p>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">
                  Deployment Speed
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Metrics Strip */}
      <section className="py-16 bg-blue-600">
        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-12"
        >
          <MetricCard value="42+" label="Active Initiatives" />
          <MetricCard value="6.5M+" label="Commits Tracked" />
          <MetricCard value="12k+" label="Monthly Users" />
          <MetricCard value="2.4x" label="Velocity Increase" />
        </motion.div>
      </section>

      {/* Capabilities Section */}
      <section className="py-32 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-24 items-start">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.h2
              variants={fadeIn}
              className="text-4xl md:text-5xl font-bold text-slate-900 mb-6"
            >
              Our Capabilities
            </motion.h2>
            <motion.p
              variants={fadeIn}
              className="text-lg text-slate-500 mb-16 leading-relaxed"
            >
              Focus on what matters most. Our tailored views ensure every
              stakeholder has the context they need without the noise.
            </motion.p>

            <div className="space-y-12">
              <CapabilityItem
                icon={ShieldCheck}
                title="For Admins"
                description="Global project overview and user management. Control permissions, track organization-wide velocity, and manage resource allocation at scale."
              />
              <CapabilityItem
                icon={Terminal}
                title="For Developers"
                description="Interactive Kanban boards and task automation. Focus on code with seamless CI/CD integration and automated status updates."
              />
              <CapabilityItem
                icon={Activity}
                title="For Stakeholders"
                description="Real-time progress tracking and direct feedback loops. Stay informed with high-level summaries and provide input without leaving the platform."
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="sticky top-32 lg:mt-0 mt-12"
          >
            <div className="rounded-3xl overflow-hidden shadow-2xl border border-slate-200 bg-white p-3">
              <img
                alt="Kanban board feature"
                className="w-full rounded-2xl"
                src="https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&q=80&w=2340"
              />
            </div>
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-600/10 rounded-full blur-3xl -z-10" />
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-7xl mx-auto bg-slate-900 rounded-[3rem] p-12 md:p-24 text-center relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-600/20 blur-[120px]" />
          <div className="relative z-10">
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-8 tracking-tight">
              Ready to accelerate your team?
            </h2>
            <p className="text-slate-400 text-lg mb-12 max-w-2xl mx-auto">
              Join over 1,500 organizations using DevProgress to deliver
              technical excellence every single day.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <button className="px-12 py-4 bg-blue-600 text-white rounded-full font-bold text-lg hover:shadow-2xl hover:shadow-blue-500/40 transition-all active:scale-95">
                Create Account
              </button>
              <button className="px-12 py-4 bg-transparent text-white border border-slate-700 rounded-full font-bold text-lg hover:bg-white/5 transition-all">
                Talk to Sales
              </button>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-100 pt-24 pb-12 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-20">
            <div className="col-span-2 md:col-span-1">
              <span className="text-2xl font-black tracking-tighter text-slate-900 mb-6 block">
                DevProgress
              </span>
              <p className="text-slate-500 text-sm leading-relaxed mb-6">
                Empowering teams to move faster and build better together.
              </p>
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-blue-600 cursor-pointer transition-colors">
                  <Globe size={18} />
                </div>
                <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-blue-600 cursor-pointer transition-colors">
                  <Monitor size={18} />
                </div>
              </div>
            </div>
            {["Product", "Support", "Company"].map((title) => (
              <div key={title}>
                <h5 className="font-bold text-slate-900 mb-6">{title}</h5>
                <ul className="space-y-4 text-sm text-slate-500">
                  <li>
                    <a href="#" className="hover:text-blue-600">
                      Feature Link
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-blue-600">
                      Platform Overview
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-blue-600">
                      Documentation
                    </a>
                  </li>
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-slate-50 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[12px] text-slate-400 font-medium">
            <p>© 2024 DevProgress Inc. All rights reserved.</p>
            <div className="flex gap-8">
              <a href="#" className="hover:text-slate-900">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-slate-900">
                Terms of Service
              </a>
              <a href="#" className="hover:text-slate-900">
                Cookie Settings
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
