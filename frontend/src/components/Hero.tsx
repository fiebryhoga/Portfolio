"use client";

import React from "react";
import { Profile } from "@/types";
import { useDesktop } from "@/context/DesktopContext";
import { GithubIcon, LinkedinIcon } from "@/components/Icons";
import {
  Mail,
  ArrowRight,
  FileDown,
  Code2,
  Server,
  Database,
  Box,
  Layers,
  Cpu,
} from "lucide-react";

interface HeroProps {
  profile: Profile;
}

export const Hero: React.FC<HeroProps> = ({ profile }) => {
  const { openWindow, theme } = useDesktop();
  const isDark = theme === "dark";

  const techStack = [
    { name: "Golang (Gin)", icon: <Server size={14} /> },
    { name: "React.js & Next.js", icon: <Layers size={14} /> },
    { name: "TypeScript", icon: <Code2 size={14} /> },
    { name: "Laravel (Filament)", icon: <Cpu size={14} /> },
    { name: "Docker", icon: <Box size={14} /> },
    { name: "PostgreSQL & MySQL", icon: <Database size={14} /> },
    { name: "Inertia.js & Tailwind CSS", icon: <Layers size={14} /> },
    { name: "REST APIs & Microservices", icon: <Server size={14} /> },
  ];

  return (
    <div className="max-w-2xl mx-auto py-5 sm:py-8 px-4 sm:px-6 space-y-7 select-text">
      {/* 1. Header: Avatar + Identity */}
      <div
        className={`flex items-center gap-4 sm:gap-5 pb-6 border-b transition-colors ${
          isDark ? "border-white/10" : "border-black/10"
        }`}
      >
        <div
          className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border shrink-0 shadow-sm ${
            isDark
              ? "border-white/20 bg-zinc-800"
              : "border-black/15 bg-zinc-200"
          }`}
        >
          <img
            src={
              profile.avatar_url ||
              "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80"
            }
            alt={profile.name}
            className="w-full h-full object-cover grayscale contrast-105"
          />
        </div>
        <div className="flex-1 min-w-0">
          <h1
            className={`text-xl sm:text-2xl font-bold tracking-tight truncate ${
              isDark ? "text-white" : "text-zinc-950"
            }`}
          >
            {profile.name}
          </h1>
          <p
            className={`text-sm font-medium mt-0.5 ${
              isDark ? "text-zinc-400" : "text-zinc-600"
            }`}
          >
            {profile.headline || "Versatile Fullstack Developer & Performance Systems Engineer"}
          </p>
          <div
            className={`flex items-center gap-3 mt-2 text-xs font-medium ${
              isDark ? "text-zinc-400" : "text-zinc-600"
            }`}
          >
            <span className="flex items-center gap-1.5">
              <span
                className={`w-2 h-2 rounded-full ${
                  profile.available_for_work !== false
                    ? "bg-emerald-500 animate-pulse"
                    : "bg-zinc-500"
                }`}
              />
              {profile.available_for_work !== false
                ? "Available for work"
                : "Not available"}
            </span>
            {profile.location && (
              <>
                <span>•</span>
                <span>{profile.location}</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Metrics Row (Experience, Projects, Clients from Database) */}
      {(profile.years_experience || profile.completed_projects) && (
        <div className="grid grid-cols-3 gap-2.5 pt-1">
          <div
            className={`p-3 rounded-xl border text-center transition-colors ${
              isDark
                ? "bg-white/[0.03] border-white/15"
                : "bg-black/[0.02] border-black/10"
            }`}
          >
            <div
              className={`text-base font-bold font-mono ${
                isDark ? "text-white" : "text-zinc-950"
              }`}
            >
              {profile.years_experience}+
            </div>
            <div
              className={`text-[10px] uppercase tracking-wider font-medium mt-0.5 ${
                isDark ? "text-zinc-400" : "text-zinc-500"
              }`}
            >
              Years Exp
            </div>
          </div>
          <div
            className={`p-3 rounded-xl border text-center transition-colors ${
              isDark
                ? "bg-white/[0.03] border-white/15"
                : "bg-black/[0.02] border-black/10"
            }`}
          >
            <div
              className={`text-base font-bold font-mono ${
                isDark ? "text-white" : "text-zinc-950"
              }`}
            >
              {profile.completed_projects}+
            </div>
            <div
              className={`text-[10px] uppercase tracking-wider font-medium mt-0.5 ${
                isDark ? "text-zinc-400" : "text-zinc-500"
              }`}
            >
              Projects Done
            </div>
          </div>
          <div
            className={`p-3 rounded-xl border text-center transition-colors ${
              isDark
                ? "bg-white/[0.03] border-white/15"
                : "bg-black/[0.02] border-black/10"
            }`}
          >
            <div
              className={`text-base font-bold font-mono ${
                isDark ? "text-white" : "text-zinc-950"
              }`}
            >
              {profile.satisfied_clients}+
            </div>
            <div
              className={`text-[10px] uppercase tracking-wider font-medium mt-0.5 ${
                isDark ? "text-zinc-400" : "text-zinc-500"
              }`}
            >
              Satisfied Clients
            </div>
          </div>
        </div>
      )}

      {/* 2. Section: About Me */}
      <div className="space-y-2.5">
        <h2
          className={`text-sm font-bold uppercase tracking-wider ${
            isDark ? "text-white" : "text-zinc-950"
          }`}
        >
          About Me
        </h2>
        {profile.bio ? (
          profile.bio.split("\n\n").map((paragraph, idx) => (
            <p
              key={idx}
              className={`text-sm leading-relaxed font-normal ${
                isDark ? "text-zinc-300" : "text-zinc-700"
              }`}
            >
              {paragraph}
            </p>
          ))
        ) : (
          <>
            <p
              className={`text-sm leading-relaxed font-normal ${
                isDark ? "text-zinc-300" : "text-zinc-700"
              }`}
            >
              Hey there! 👋 I&apos;m Dimas, a Fullstack Developer and Information Systems graduate
              from Universitas Brawijaya (GPA 3.60). I specialize in engineering high-performance
              web applications, robust backend microservices, and reactive user interfaces.
            </p>
            <p
              className={`text-sm leading-relaxed font-normal ${
                isDark ? "text-zinc-300" : "text-zinc-700"
              }`}
            >
              Most notably, I architected and engineered the{" "}
              <strong
                className={`font-semibold ${
                  isDark ? "text-white" : "text-zinc-950"
                }`}
              >
                Integrated Soccer Monitoring System (ISMS) for Persebaya Surabaya
              </strong>
              , a data analytics platform calculating athlete ACWR physical loads, GPS metrics, and
              medical diagnostics to empower data-driven tactical decisions for elite coaching staff.
            </p>
          </>
        )}
      </div>

      {/* 3. Section: Background & Philosophy */}
      <div className="space-y-2.5">
        <h2
          className={`text-sm font-bold uppercase tracking-wider ${
            isDark ? "text-white" : "text-zinc-950"
          }`}
        >
          Background &amp; Philosophy
        </h2>
        <p
          className={`text-sm leading-relaxed font-normal ${
            isDark ? "text-zinc-300" : "text-zinc-700"
          }`}
        >
          I bring a wide range of skills across systems architecture, database design, and modern frontend
          frameworks. Whether architecting concurrent Go Gin services, building fullstack Laravel applications,
          or crafting fluid interfaces with React, Next.js, and TypeScript, I prioritize clean code, reliability,
          and exceptional user experiences.
        </p>
      </div>

      {/* 4. Section: Core Technologies */}
      <div className="space-y-3">
        <h2
          className={`text-sm font-bold uppercase tracking-wider ${
            isDark ? "text-white" : "text-zinc-950"
          }`}
        >
          Technologies &amp; Tools
        </h2>
        <div className="flex flex-wrap gap-2">
          {techStack.map((tech) => (
            <div
              key={tech.name}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
                isDark
                  ? "bg-white/[0.05] border-white/15 text-zinc-200"
                  : "bg-black/[0.04] border-black/10 text-zinc-900"
              }`}
            >
              {tech.icon}
              <span>{tech.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Section: Education */}
      <div className="space-y-2.5">
        <h2
          className={`text-sm font-bold uppercase tracking-wider ${
            isDark ? "text-white" : "text-zinc-950"
          }`}
        >
          Education
        </h2>
        <div
          className={`p-3.5 rounded-xl border flex items-center justify-between transition-colors ${
            isDark
              ? "bg-white/[0.03] border-white/15"
              : "bg-black/[0.02] border-black/10"
          }`}
        >
          <div>
            <h3
              className={`text-sm font-semibold ${
                isDark ? "text-white" : "text-zinc-950"
              }`}
            >
              Universitas Brawijaya
            </h3>
            <p
              className={`text-xs mt-0.5 ${
                isDark ? "text-zinc-400" : "text-zinc-600"
              }`}
            >
              Bachelor of Information Systems • 2022 — 2026
            </p>
          </div>
          <span
            className={`text-xs font-mono font-medium px-2.5 py-1 rounded-md border shadow-xs ${
              isDark
                ? "bg-zinc-800 border-white/20 text-zinc-100"
                : "bg-white border-black/15 text-zinc-900 font-bold"
            }`}
          >
            GPA 3.60 / 4.00
          </span>
        </div>
      </div>

      {/* 6. Footer Actions & Social Links */}
      <div
        className={`pt-4 border-t flex flex-wrap items-center justify-between gap-4 transition-colors ${
          isDark ? "border-white/10" : "border-black/10"
        }`}
      >
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => openWindow("projects")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer shadow-sm active:scale-95 ${
              isDark
                ? "bg-white text-black hover:bg-zinc-200 shadow-white/5"
                : "bg-black text-white hover:bg-zinc-800 shadow-black/15"
            }`}
          >
            <span>View Projects</span>
            <ArrowRight size={13} />
          </button>
          <button
            onClick={() => openWindow("contact")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium border transition-colors cursor-pointer active:scale-95 ${
              isDark
                ? "bg-zinc-900/90 border-white/15 text-zinc-200 hover:bg-zinc-800 hover:text-white"
                : "bg-white border-black/15 text-zinc-800 hover:bg-zinc-100 hover:text-black shadow-xs"
            }`}
          >
            <Mail size={13} />
            <span>Contact Me</span>
          </button>
        </div>

        {/* Social Links & Resume */}
        <div className="flex items-center gap-2">
          <a
            href={profile.github_url}
            target="_blank"
            rel="noreferrer"
            className={`p-2 rounded-lg border transition-colors ${
              isDark
                ? "border-white/15 text-zinc-400 hover:text-white hover:border-white/30"
                : "border-black/15 text-zinc-600 hover:text-black hover:border-black/30"
            }`}
            title="GitHub"
          >
            <GithubIcon className="w-4 h-4" />
          </a>
          <a
            href={profile.linkedin_url}
            target="_blank"
            rel="noreferrer"
            className={`p-2 rounded-lg border transition-colors ${
              isDark
                ? "border-white/15 text-zinc-400 hover:text-white hover:border-white/30"
                : "border-black/15 text-zinc-600 hover:text-black hover:border-black/30"
            }`}
            title="LinkedIn"
          >
            <LinkedinIcon className="w-4 h-4" />
          </a>
          <a
            href="/dimas_fiebry_cv.txt"
            download="Dimas_Fiebry_CV.txt"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors cursor-pointer ${
              isDark
                ? "border-white/15 text-zinc-300 hover:bg-white/10 hover:text-white"
                : "border-black/15 text-zinc-800 hover:bg-black/5 hover:text-black"
            }`}
            title="Download Resume"
          >
            <FileDown size={13} />
            <span>Resume</span>
          </a>
        </div>
      </div>
    </div>
  );
};
