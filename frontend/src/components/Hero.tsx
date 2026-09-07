"use client";

import React from "react";
import { Profile } from "@/types";
import {
  Mail,
  ArrowRight,
  Sparkles,
  Server,
  Code,
  CheckCircle2,
  GraduationCap,
  Award,
  BookOpen,
  Activity,
} from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/Icons";

import { useDesktop } from "@/context/DesktopContext";

interface HeroProps {
  profile: Profile;
}

export const Hero: React.FC<HeroProps> = ({ profile }) => {
  const { openWindow, theme } = useDesktop();
  const isDark = theme === "dark";

  return (
    <section id="about" className="relative py-4 sm:py-6 px-3 sm:px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10 space-y-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Bio & Intro */}
          <div className="lg:col-span-7 flex flex-col items-start">
            {/* Status Pill */}
            <div
              className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium mb-5 border transition-colors ${
                isDark
                  ? "bg-zinc-900/80 text-zinc-300 border-white/15"
                  : "bg-zinc-100 text-zinc-800 border-black/10 shadow-xs"
              }`}
            >
              <Sparkles className={`w-3.5 h-3.5 ${isDark ? "text-zinc-200" : "text-zinc-700"}`} />
              <span>Fullstack Developer &amp; Performance Systems Engineer</span>
            </div>

            {/* Main Headline */}
            <h1
              className={`text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-[1.15] mb-5 transition-colors ${
                isDark ? "text-white" : "text-zinc-950"
              }`}
            >
              Building Scalable{" "}
              <span className="underline decoration-zinc-500/40 decoration-2 underline-offset-6 font-bold">
                Web Applications
              </span>{" "}
              &amp; Elite{" "}
              <span className={isDark ? "text-zinc-400 font-bold" : "text-zinc-600 font-bold"}>
                Sports Analytics
              </span>
            </h1>

            {/* Subtitle / Bio */}
            <p
              className={`text-sm sm:text-base leading-relaxed mb-6 max-w-2xl font-light transition-colors ${
                isDark ? "text-zinc-300" : "text-zinc-600"
              }`}
            >
              Hi, I&apos;m{" "}
              <span className={`font-semibold ${isDark ? "text-white" : "text-black"}`}>
                {profile.name}
              </span>
              . {profile.bio}
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 mb-8 w-full sm:w-auto">
              <button
                onClick={() => openWindow("projects", "Projects")}
                className={`flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm transition-all cursor-pointer shadow-md ${
                  isDark
                    ? "bg-white text-black hover:bg-zinc-200 shadow-white/5 active:scale-[0.98]"
                    : "bg-black text-white hover:bg-zinc-800 shadow-black/15 active:scale-[0.98]"
                }`}
              >
                View Selected Works
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => openWindow("contact", "Terminal")}
                className={`flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-medium text-sm transition-all cursor-pointer border ${
                  isDark
                    ? "bg-zinc-900/80 text-zinc-200 border-white/15 hover:bg-zinc-800 hover:text-white"
                    : "bg-white text-zinc-800 border-black/10 hover:bg-zinc-100 hover:text-black shadow-xs"
                }`}
              >
                <Mail className={`w-4 h-4 ${isDark ? "text-zinc-300" : "text-zinc-700"}`} />
                Contact Me
              </button>

              <div className="flex items-center gap-2 ml-0 sm:ml-2">
                <a
                  href={profile.github_url}
                  target="_blank"
                  rel="noreferrer"
                  className={`p-3 rounded-xl border transition-all ${
                    isDark
                      ? "bg-zinc-900/80 text-zinc-400 border-white/15 hover:text-white hover:border-white/30"
                      : "bg-white text-zinc-600 border-black/10 hover:text-black hover:border-black/30 shadow-xs"
                  }`}
                  aria-label="GitHub Profile"
                >
                  <GithubIcon className="w-5 h-5" />
                </a>
                <a
                  href={profile.linkedin_url}
                  target="_blank"
                  rel="noreferrer"
                  className={`p-3 rounded-xl border transition-all ${
                    isDark
                      ? "bg-zinc-900/80 text-zinc-400 border-white/15 hover:text-white hover:border-white/30"
                      : "bg-white text-zinc-600 border-black/10 hover:text-black hover:border-black/30 shadow-xs"
                  }`}
                  aria-label="LinkedIn Profile"
                >
                  <LinkedinIcon className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Key Metrics */}
            <div
              className={`grid grid-cols-3 gap-6 sm:gap-10 pt-6 border-t w-full max-w-lg transition-colors ${
                isDark ? "border-white/10" : "border-black/10"
              }`}
            >
              <div>
                <div className={`text-2xl sm:text-3xl font-extrabold ${isDark ? "text-white" : "text-black"}`}>
                  3.60<span className={`text-xs font-normal ${isDark ? "text-zinc-400" : "text-zinc-500"}`}>/4.0</span>
                </div>
                <div className={`text-xs mt-1 ${isDark ? "text-zinc-400" : "text-zinc-500"}`}>GPA (Brawijaya Univ)</div>
              </div>
              <div>
                <div className={`text-2xl sm:text-3xl font-extrabold ${isDark ? "text-white" : "text-black"}`}>
                  15+
                </div>
                <div className={`text-xs mt-1 ${isDark ? "text-zinc-400" : "text-zinc-500"}`}>Shipped Projects</div>
              </div>
              <div>
                <div className={`text-2xl sm:text-3xl font-extrabold ${isDark ? "text-white" : "text-black"}`}>
                  ISMS
                </div>
                <div className={`text-xs mt-1 ${isDark ? "text-zinc-400" : "text-zinc-500"}`}>Persebaya Surabaya</div>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Terminal Preview Card */}
          <div className="lg:col-span-5 relative">
            <div
              className={`relative rounded-2xl p-6 border overflow-hidden shadow-2xl transition-colors ${
                isDark
                  ? "bg-zinc-950/80 border-white/15 shadow-black/80"
                  : "bg-white border-black/10 shadow-black/10"
              }`}
            >
              {/* Terminal Header */}
              <div
                className={`flex items-center justify-between pb-4 border-b mb-4 ${
                  isDark ? "border-white/10" : "border-black/10"
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                  <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                  <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
                  <span className={`text-xs font-mono ml-2 ${isDark ? "text-zinc-400" : "text-zinc-500"}`}>
                    performance-engine.go
                  </span>
                </div>
                <div
                  className={`flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-mono border ${
                    isDark
                      ? "bg-white/10 text-zinc-200 border-white/15"
                      : "bg-black/5 text-zinc-800 border-black/10"
                  }`}
                >
                  <Activity className="w-3 h-3 animate-pulse" />
                  ISMS Live
                </div>
              </div>

              {/* Terminal Code Preview */}
              <pre
                className={`text-xs font-mono leading-relaxed overflow-x-auto p-3 rounded-lg border ${
                  isDark
                    ? "bg-black/80 text-zinc-300 border-white/10"
                    : "bg-zinc-100 text-zinc-800 border-black/10"
                }`}
              >
                <code>
                  <span className="font-bold">package</span> analytics
                  {"\n\n"}
                  <span className={isDark ? "text-zinc-500 italic" : "text-zinc-400 italic"}>
                    // ISMS - Persebaya Athletic Intelligence
                  </span>
                  {"\n"}
                  <span className="font-bold">func</span> ComputeReadiness(athlete Athlete) *Report {"{"}
                  {"\n"}  acwr := athlete.GetACWR(&quot;EWMA&quot;)
                  {"\n"}  wellness := athlete.DailyWellnessRPE()
                  {"\n"}  readiness := formula.CalculatePPRI(acwr, wellness)
                  {"\n"}  <span className="font-bold">return</span> &amp;Report{"{"}
                  {"\n"}    SquadID: athlete.SquadID,
                  {"\n"}    PPRI: readiness,
                  {"\n"}    ReadyForMatch: readiness &gt; 85.0,
                  {"\n"}  {"}"}
                  {"\n"}{"}"}
                </code>
              </pre>

              {/* Stack Badges below terminal */}
              <div
                className={`mt-5 pt-4 border-t flex flex-wrap gap-2 ${
                  isDark ? "border-white/10" : "border-black/10"
                }`}
              >
                <div
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg border text-xs font-mono ${
                    isDark
                      ? "bg-white/5 text-zinc-300 border-white/10"
                      : "bg-black/5 text-zinc-700 border-black/10"
                  }`}
                >
                  <Server className="w-3.5 h-3.5" />
                  <span>Laravel (Filament) &amp; Go Gin</span>
                </div>
                <div
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg border text-xs font-mono ${
                    isDark
                      ? "bg-white/5 text-zinc-300 border-white/10"
                      : "bg-black/5 text-zinc-700 border-black/10"
                  }`}
                >
                  <Code className="w-3.5 h-3.5" />
                  <span>React.js, Next.js &amp; Inertia.js</span>
                </div>
                <div
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg border text-xs font-mono ${
                    isDark
                      ? "bg-white/5 text-zinc-300 border-white/10"
                      : "bg-black/5 text-zinc-700 border-black/10"
                  }`}
                >
                  <span>Node.js, Baileys &amp; Python</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Education & Academic Excellence Section */}
        <div className={`pt-8 border-t ${isDark ? "border-white/10" : "border-black/10"}`}>
          <div
            className={`flex items-center gap-2 text-xs font-semibold uppercase tracking-wider mb-4 ${
              isDark ? "text-zinc-300" : "text-zinc-800"
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Education &amp; Academic Honors</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Universitas Brawijaya */}
            <div
              className={`p-5 rounded-xl border flex flex-col justify-between transition-colors ${
                isDark
                  ? "bg-zinc-900/70 border-white/15 text-zinc-100"
                  : "bg-white border-black/10 text-zinc-900 shadow-sm"
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h4 className="font-bold text-sm">Universitas Brawijaya</h4>
                  <span
                    className={`text-[11px] px-2 py-0.5 rounded-full font-mono border ${
                      isDark
                        ? "bg-white/10 text-zinc-200 border-white/20"
                        : "bg-black/5 text-zinc-800 border-black/10 font-bold"
                    }`}
                  >
                    GPA 3.60 / 4.00
                  </span>
                </div>
                <p className={`text-xs mb-3 ${isDark ? "text-zinc-400" : "text-zinc-500"}`}>
                  Bachelor of Information Systems (Aug 2022 - Aug 2026)
                </p>
                <ul className="space-y-1.5 text-xs font-light">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className={`w-3.5 h-3.5 shrink-0 ${isDark ? "text-zinc-300" : "text-zinc-700"}`} />
                    <span>Laboratory Assistant: User Interface Programming course</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className={`w-3.5 h-3.5 shrink-0 ${isDark ? "text-zinc-300" : "text-zinc-700"}`} />
                    <span>Informatics Instructor: Taught coding at SMAN 1 Malang</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className={`w-3.5 h-3.5 shrink-0 ${isDark ? "text-zinc-300" : "text-zinc-700"}`} />
                    <span>Capstone: E-Learning for SMAN 1 Gondang Tulungagung</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* MA Matholi'ul Anwar */}
            <div
              className={`p-5 rounded-xl border flex flex-col justify-between transition-colors ${
                isDark
                  ? "bg-zinc-900/70 border-white/15 text-zinc-100"
                  : "bg-white border-black/10 text-zinc-900 shadow-sm"
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h4 className="font-bold text-sm">MA Matholi’ul Anwar</h4>
                  <span
                    className={`text-[11px] px-2 py-0.5 rounded-full font-mono border ${
                      isDark
                        ? "bg-white/10 text-zinc-200 border-white/20"
                        : "bg-black/5 text-zinc-800 border-black/10 font-bold"
                    }`}
                  >
                    Rank 1st
                  </span>
                </div>
                <p className={`text-xs mb-3 ${isDark ? "text-zinc-400" : "text-zinc-500"}`}>
                  Natural Sciences &amp; IT (July 2019 - June 2022)
                </p>
                <ul className="space-y-1.5 text-xs font-light">
                  <li className="flex items-center gap-2">
                    <Award className={`w-3.5 h-3.5 shrink-0 ${isDark ? "text-zinc-300" : "text-zinc-700"}`} />
                    <span>Ranked 1st place as Most Outstanding Student</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Award className={`w-3.5 h-3.5 shrink-0 ${isDark ? "text-zinc-300" : "text-zinc-700"}`} />
                    <span>3rd Place National Science Olympiad (OSN) Informatics</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
