"use client";

import React, { useState } from "react";
import { Skill } from "@/types";
import {
  Server,
  Code2,
  Layers,
  ShieldCheck,
  Cpu,
  Database,
  Globe,
  Palette,
  GitBranch,
  Box,
  CheckCircle2,
  Terminal,
  Network,
  Workflow,
  Search,
  X,
} from "lucide-react";
import { useDesktop } from "@/context/DesktopContext";

interface SkillsProps {
  skills: Skill[];
}

const skillDescriptions: Record<string, string> = {
  "php & laravel (filament)":
    "Robust MVC web systems, Eloquent ORM, and enterprise Filament admin dashboards.",
  "golang & gin framework":
    "High-throughput microservices, concurrent goroutines, channels, and low-latency REST APIs.",
  "node.js & express / baileys":
    "Event-driven backends, RESTful microservices, and automated WhatsApp messaging engines.",
  "python & java":
    "Object-oriented programming, data parsing scripts, and athletic algorithm benchmarking.",
  "database architecture (mysql/postgres)":
    "Complex relational schemas, indexing, query optimization, and ACID transactions.",
  "rest api & microservices":
    "Stateless API contracts, JWT authentication, rate limiting, and webhook dispatchers.",
  "react.js & inertia.js":
    "Reactive single-page user interfaces, modern hooks, and Inertia state bridge.",
  "next.js & typescript":
    "Production-ready SSR/SSG web applications, strict type safety, and modern App Router.",
  "tailwind css":
    "Modern responsive design systems, bespoke UI components, and fluid layout styling.",
  "ui/ux & graphic design":
    "User journey mapping, wireframing, Figma design tokens, and digital branding assets.",
  "git & version control":
    "Gitflow workflows, feature branching, code reviews, and Git repository management.",
  "docker & server deployment":
    "Multi-stage Docker containers, VPS server provisioning, and Nginx reverse proxy.",
  "seo optimization & qa testing":
    "Technical search optimization, performance audits, and rigorous cross-device testing.",
  "midtrans gateway & integrations":
    "Seamless payment gateway integration, secure snap token flows, and webhook verification.",
};

export const Skills: React.FC<SkillsProps> = ({ skills }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const { theme } = useDesktop();
  const isDark = theme === "dark";

  const categories = ["All", "Backend", "Frontend", "DevOps & Cloud"];

  const getCategoryCount = (category: string) => {
    if (category === "All") return skills.length;
    return skills.filter((s) =>
      s.category.toLowerCase().includes(category.toLowerCase())
    ).length;
  };

  const filteredSkills = skills.filter((skill) => {
    const matchesCategory =
      selectedCategory === "All" ||
      skill.category.toLowerCase().includes(selectedCategory.toLowerCase());
    const matchesSearch =
      searchQuery.trim() === "" ||
      skill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      skill.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getSkillIcon = (skill: Skill) => {
    const name = skill.name.toLowerCase();
    const icon = skill.icon_name?.toLowerCase();
    const iconClass = `shrink-0 ${isDark ? "text-zinc-200" : "text-zinc-800"}`;

    if (name.includes("database") || icon === "database")
      return <Database size={17} className={iconClass} />;
    if (name.includes("golang") || name.includes("gin"))
      return <Cpu size={17} className={iconClass} />;
    if (name.includes("laravel") || name.includes("php"))
      return <Server size={17} className={iconClass} />;
    if (name.includes("node") || name.includes("baileys"))
      return <Network size={17} className={iconClass} />;
    if (
      name.includes("python") ||
      name.includes("java") ||
      icon === "terminal"
    )
      return <Terminal size={17} className={iconClass} />;
    if (name.includes("rest api") || name.includes("microservice"))
      return <Workflow size={17} className={iconClass} />;
    if (name.includes("react") || name.includes("inertia"))
      return <Code2 size={17} className={iconClass} />;
    if (name.includes("next.js") || name.includes("typescript"))
      return <Globe size={17} className={iconClass} />;
    if (name.includes("tailwind"))
      return <Palette size={17} className={iconClass} />;
    if (name.includes("ui/ux") || name.includes("graphic"))
      return <Layers size={17} className={iconClass} />;
    if (name.includes("git"))
      return <GitBranch size={17} className={iconClass} />;
    if (name.includes("docker") || name.includes("deployment"))
      return <Box size={17} className={iconClass} />;
    if (name.includes("seo") || name.includes("qa") || icon === "shieldcheck")
      return <ShieldCheck size={17} className={iconClass} />;
    if (name.includes("midtrans") || name.includes("gateway"))
      return <CheckCircle2 size={17} className={iconClass} />;
    return <Cpu size={17} className={iconClass} />;
  };

  return (
    <div className="@container max-w-5xl mx-auto py-5 sm:py-7 px-3 sm:px-6 select-text space-y-6">
      {/* 1. Header (Clean, Minimalist, No Background Badges) */}
      <div
        className={`pb-4 border-b transition-colors ${
          isDark ? "border-white/10" : "border-black/10"
        }`}
      >
        <div className="flex flex-col @[600px]:flex-row @[600px]:items-center justify-between gap-3 mb-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1
                className={`text-xl sm:text-2xl font-bold tracking-tight ${
                  isDark ? "text-white" : "text-zinc-950"
                }`}
              >
                Technical Proficiencies &amp; Arsenal
              </h1>
              <span
                className={`text-xs font-mono font-medium ${
                  isDark ? "text-zinc-400" : "text-zinc-500"
                }`}
              >
                / {skills.length} Skills
              </span>
            </div>
            <p
              className={`text-xs sm:text-sm font-normal max-w-2xl ${
                isDark ? "text-zinc-400" : "text-zinc-600"
              }`}
            >
              Specialized in high-concurrency backend services, distributed architectures, and modern reactive interfaces.
            </p>
          </div>

          {/* Minimalist Search Input (No heavy badge box) */}
          <div className="relative w-full @[600px]:w-52 shrink-0">
            <Search
              size={13}
              className={`absolute left-2.5 top-1/2 -translate-y-1/2 ${
                isDark ? "text-zinc-500" : "text-zinc-400"
              }`}
            />
            <input
              type="text"
              placeholder="Search skill..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-8 pr-7 py-1.5 rounded-lg text-xs transition-colors outline-none border ${
                isDark
                  ? "bg-transparent border-white/15 text-white placeholder-zinc-500 focus:border-white/40"
                  : "bg-transparent border-black/15 text-zinc-950 placeholder-zinc-400 focus:border-black/40"
              }`}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className={`absolute right-2 top-1/2 -translate-y-1/2 p-0.5 rounded ${
                  isDark
                    ? "text-zinc-400 hover:text-white"
                    : "text-zinc-400 hover:text-black"
                }`}
              >
                <X size={12} />
              </button>
            )}
          </div>
        </div>

        {/* Clean Text-Tab Navigation (Zero Background Badges) */}
        <div className="flex items-center gap-6 mt-4 text-xs font-medium overflow-x-auto">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat;
            const count = getCategoryCount(cat);
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`pb-2 -mb-px transition-colors cursor-pointer flex items-center gap-1.5 shrink-0 border-b-2 ${
                  isActive
                    ? isDark
                      ? "text-white border-white font-semibold"
                      : "text-zinc-950 border-zinc-950 font-semibold"
                    : isDark
                    ? "text-zinc-400 hover:text-zinc-200 border-transparent"
                    : "text-zinc-500 hover:text-zinc-800 border-transparent"
                }`}
              >
                <span>{cat}</span>
                <span className="text-[11px] font-mono opacity-60">
                  ({count})
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Skills Grid (Clean Minimalist Cards, No Background Badges) */}
      {filteredSkills.length === 0 ? (
        <div
          className={`text-center py-12 rounded-xl border border-dashed ${
            isDark
              ? "border-white/15 text-zinc-400"
              : "border-black/15 text-zinc-500"
          }`}
        >
          <p className="text-sm font-medium">No technologies found</p>
          <p className="text-xs mt-1 opacity-75">
            Try adjusting your search query or category filter.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 @[640px]:grid-cols-2 gap-3.5 sm:gap-4">
          {filteredSkills.map((skill) => {
            const desc =
              skillDescriptions[skill.name.toLowerCase()] ||
              "Engineering proficiency with production architecture and modern frameworks.";

            return (
              <div
                key={skill.id}
                className={`rounded-xl p-4 border transition-colors ${
                  isDark
                    ? "bg-zinc-900/40 border-white/10 hover:border-white/20"
                    : "bg-white border-black/10 hover:border-black/20"
                }`}
              >
                {/* Header: Naked Icon + Name + Category + Mono Score */}
                <div className="flex items-start justify-between gap-3 mb-1.5">
                  <div className="flex items-center gap-2.5 min-w-0">
                    {getSkillIcon(skill)}
                    <div className="min-w-0">
                      <h3
                        className={`font-semibold text-xs sm:text-sm leading-snug tracking-tight ${
                          isDark ? "text-white" : "text-zinc-950"
                        }`}
                      >
                        {skill.name}
                      </h3>
                      <span
                        className={`text-[11px] block mt-0.5 ${
                          isDark ? "text-zinc-400" : "text-zinc-500"
                        }`}
                      >
                        {skill.category}
                      </span>
                    </div>
                  </div>

                  {/* Clean Percentage (No Pill Badge) */}
                  <span
                    className={`text-xs font-mono font-medium shrink-0 ml-2 ${
                      isDark ? "text-zinc-400" : "text-zinc-600"
                    }`}
                  >
                    {skill.proficiency}%
                  </span>
                </div>

                {/* Real-world Context */}
                <p
                  className={`text-xs leading-relaxed mt-2 ${
                    isDark ? "text-zinc-400" : "text-zinc-600"
                  }`}
                >
                  {desc}
                </p>

                {/* Minimal Hairline Progress Track */}
                <div
                  className={`w-full h-1 rounded-full overflow-hidden mt-3 ${
                    isDark ? "bg-white/10" : "bg-black/5"
                  }`}
                >
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      isDark ? "bg-zinc-300" : "bg-zinc-800"
                    }`}
                    style={{ width: `${skill.proficiency}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 3. Core Architecture Pillars (Pure Minimalist, No Badges) */}
      <div
        className={`rounded-xl p-5 border grid grid-cols-1 @[640px]:grid-cols-3 gap-5 transition-colors ${
          isDark
            ? "bg-zinc-900/20 border-white/10"
            : "bg-transparent border-black/10"
        }`}
      >
        <div className="flex flex-col gap-1">
          <div
            className={`flex items-center gap-2 font-semibold text-xs sm:text-sm ${
              isDark ? "text-white" : "text-zinc-950"
            }`}
          >
            <Server size={15} className="opacity-80 shrink-0" />
            <span>Golang &amp; Gin Framework</span>
          </div>
          <p
            className={`text-xs leading-relaxed ${
              isDark ? "text-zinc-400" : "text-zinc-600"
            }`}
          >
            Engineered for high-concurrency microservices with goroutines, channels, and low-latency REST endpoints.
          </p>
        </div>

        <div className="flex flex-col gap-1">
          <div
            className={`flex items-center gap-2 font-semibold text-xs sm:text-sm ${
              isDark ? "text-white" : "text-zinc-950"
            }`}
          >
            <Code2 size={15} className="opacity-80 shrink-0" />
            <span>React.js &amp; Next.js</span>
          </div>
          <p
            className={`text-xs leading-relaxed ${
              isDark ? "text-zinc-400" : "text-zinc-600"
            }`}
          >
            Server components, reactive client state, Inertia.js bridges, and strict type-safe TypeScript interfaces.
          </p>
        </div>

        <div className="flex flex-col gap-1">
          <div
            className={`flex items-center gap-2 font-semibold text-xs sm:text-sm ${
              isDark ? "text-white" : "text-zinc-950"
            }`}
          >
            <ShieldCheck size={15} className="opacity-80 shrink-0" />
            <span>Docker &amp; Cloud Systems</span>
          </div>
          <p
            className={`text-xs leading-relaxed ${
              isDark ? "text-zinc-400" : "text-zinc-600"
            }`}
          >
            Multi-stage containerized deployments, relational schema optimizations (MySQL/Postgres), and CI/CD pipelines.
          </p>
        </div>
      </div>
    </div>
  );
};
