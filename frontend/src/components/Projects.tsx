"use client";

import React, { useState } from "react";
import { Project } from "@/types";
import {
  ExternalLink,
  Sparkles,
  ArrowUpRight,
  Activity,
  MessageSquare,
  BarChart3,
  Package,
  Calendar,
  FileCheck,
  GraduationCap,
  Archive,
  Globe,
  Layers,
  Search,
} from "lucide-react";
import { GithubIcon } from "@/components/Icons";
import { useDesktop } from "@/context/DesktopContext";

interface ProjectsProps {
  projects: Project[];
}

export const Projects: React.FC<ProjectsProps> = ({ projects }) => {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const { theme } = useDesktop();
  const isDark = theme === "dark";

  const getProjectIcon = (title: string) => {
    const t = title.toLowerCase();
    if (t.includes("soccer") || t.includes("isms")) return <Activity size={18} />;
    if (t.includes("simadis") || t.includes("whatsapp")) return <MessageSquare size={18} />;
    if (t.includes("zk") || t.includes("performance")) return <BarChart3 size={18} />;
    if (t.includes("erp") || t.includes("inventory")) return <Package size={18} />;
    if (t.includes("barber") || t.includes("booking")) return <Calendar size={18} />;
    if (t.includes("metro") || t.includes("qr")) return <FileCheck size={18} />;
    if (t.includes("siakad") || t.includes("academic")) return <GraduationCap size={18} />;
    if (t.includes("archive")) return <Archive size={18} />;
    if (t.includes("learning") || t.includes("vocational")) return <Globe size={18} />;
    return <Layers size={18} />;
  };

  const categories = [
    { id: "all", label: "All Projects", count: projects.length },
    { id: "featured", label: "Featured Only", count: projects.filter((p) => p.featured).length },
    { id: "sports", label: "Sports Analytics", count: 2 },
    { id: "enterprise", label: "Enterprise & ERP", count: 3 },
  ];

  const filteredProjects = projects.filter((project) => {
    const matchesCategory =
      activeCategory === "all"
        ? true
        : activeCategory === "featured"
        ? project.featured
        : activeCategory === "sports"
        ? project.title.toLowerCase().includes("soccer") ||
          project.title.toLowerCase().includes("isms") ||
          project.title.toLowerCase().includes("performance")
        : activeCategory === "enterprise"
        ? project.title.toLowerCase().includes("erp") ||
          project.title.toLowerCase().includes("inventory") ||
          project.title.toLowerCase().includes("archive") ||
          project.title.toLowerCase().includes("metro")
        : true;

    const matchesSearch =
      searchQuery.trim() === ""
        ? true
        : project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (project.tech_stack && project.tech_stack.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (project.short_description &&
            project.short_description.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="@container max-w-5xl mx-auto py-5 sm:py-7 px-3 sm:px-6 select-text space-y-6">
      {/* 1. Header & Search Bar */}
      <div
        className={`pb-5 border-b flex flex-col @[620px]:flex-row @[620px]:items-center justify-between gap-4 transition-colors ${
          isDark ? "border-white/10" : "border-black/10"
        }`}
      >
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <h1
              className={`text-xl sm:text-2xl font-bold tracking-tight ${
                isDark ? "text-white" : "text-zinc-950"
              }`}
            >
              Featured Engineering Projects
            </h1>
            <span
              className={`px-2 py-0.5 rounded-full text-[11px] font-mono font-medium border shrink-0 ${
                isDark
                  ? "bg-white/10 text-zinc-300 border-white/15"
                  : "bg-black/5 text-zinc-700 border-black/10"
              }`}
            >
              {projects.length} Systems
            </span>
          </div>
          <p
            className={`text-xs sm:text-sm font-normal ${
              isDark ? "text-zinc-400" : "text-zinc-600"
            }`}
          >
            Scalable backend architectures, sports performance engines, and modern reactive interfaces.
          </p>
        </div>

        {/* Live Search Input */}
        <div className="relative w-full @[620px]:w-64 shrink-0">
          <Search
            size={14}
            className={`absolute left-3 top-1/2 -translate-y-1/2 ${
              isDark ? "text-zinc-400" : "text-zinc-500"
            }`}
          />
          <input
            type="text"
            placeholder="Search stack or title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pl-9 pr-3 py-1.5 rounded-xl text-xs transition-colors border focus:outline-none ${
              isDark
                ? "bg-white/[0.05] border-white/15 text-zinc-100 placeholder-zinc-500 focus:border-white/30"
                : "bg-black/[0.03] border-black/15 text-zinc-900 placeholder-zinc-400 focus:border-black/30 shadow-xs"
            }`}
          />
        </div>
      </div>

      {/* 2. Category Filter Pills */}
      <div className="flex flex-wrap items-center gap-1.5">
        {categories.map((cat) => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all ${
                isActive
                  ? isDark
                    ? "bg-white text-black font-semibold shadow-xs"
                    : "bg-black text-white font-semibold shadow-xs"
                  : isDark
                  ? "bg-white/[0.04] text-zinc-400 hover:text-white hover:bg-white/[0.08] border border-white/10"
                  : "bg-black/[0.03] text-zinc-600 hover:text-black hover:bg-black/[0.06] border border-black/10"
              }`}
            >
              <span>{cat.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  isActive
                    ? isDark
                      ? "bg-black/20 text-black font-mono font-bold"
                      : "bg-white/20 text-white font-mono font-bold"
                    : isDark
                    ? "bg-white/10 text-zinc-400 font-mono"
                    : "bg-black/10 text-zinc-600 font-mono"
                }`}
              >
                {cat.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* 3. Projects Grid — Clean, Dynamically Responsive to Container Width */}
      <div className="grid grid-cols-1 @[640px]:grid-cols-2 gap-4 sm:gap-5">
        {filteredProjects.map((project) => {
          const tags = project.tech_stack
            ? project.tech_stack.split(",").map((t) => t.trim())
            : [];

          return (
            <div
              key={project.id}
              className={`rounded-xl p-5 border flex flex-col justify-between transition-all duration-200 group ${
                isDark
                  ? "bg-zinc-900/60 border-white/12 hover:border-white/30 hover:bg-zinc-900/90 shadow-md shadow-black/40"
                  : "bg-white border-black/12 hover:border-black/30 hover:bg-zinc-50/70 shadow-sm"
              }`}
            >
              <div>
                {/* Header: Icon + Title + Featured Tag */}
                <div className="flex items-start gap-3 mb-2.5">
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 border transition-transform group-hover:scale-105 ${
                      isDark
                        ? "bg-white/[0.07] border-white/15 text-zinc-200"
                        : "bg-black/[0.05] border-black/10 text-zinc-800"
                    }`}
                  >
                    {getProjectIcon(project.title)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                      {project.featured && (
                        <span
                          className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold border ${
                            isDark
                              ? "bg-white/10 text-zinc-200 border-white/20"
                              : "bg-black/5 text-zinc-900 border-black/15 font-bold"
                          }`}
                        >
                          <Sparkles size={9} />
                          Featured
                        </span>
                      )}
                    </div>
                    <h2
                      className={`text-sm sm:text-base font-bold tracking-tight leading-snug break-words ${
                        isDark
                          ? "text-white group-hover:text-zinc-100"
                          : "text-zinc-950 group-hover:text-black"
                      }`}
                    >
                      {project.title}
                    </h2>
                  </div>
                </div>

                {/* Description */}
                <p
                  className={`text-xs sm:text-sm leading-relaxed mb-4 font-normal ${
                    isDark ? "text-zinc-300" : "text-zinc-700"
                  }`}
                >
                  {project.short_description || project.full_description}
                </p>

                {/* Tech Stack Pills */}
                <div className="flex flex-wrap gap-1.5 mb-5">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className={`px-2 py-0.5 rounded-md text-[10.5px] font-mono border ${
                        isDark
                          ? "bg-white/[0.04] text-zinc-300 border-white/10"
                          : "bg-black/[0.03] text-zinc-800 border-black/10 font-medium"
                      }`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Links Footer */}
              <div
                className={`flex items-center justify-between pt-3 border-t text-xs ${
                  isDark ? "border-white/10" : "border-black/10"
                }`}
              >
                <div className="flex items-center gap-3">
                  {project.github_url && (
                    <a
                      href={project.github_url}
                      target="_blank"
                      rel="noreferrer"
                      className={`flex items-center gap-1.5 font-medium transition-colors ${
                        isDark
                          ? "text-zinc-400 hover:text-white"
                          : "text-zinc-600 hover:text-black"
                      }`}
                    >
                      <GithubIcon className="w-3.5 h-3.5" />
                      <span>Source Code</span>
                    </a>
                  )}
                </div>

                {project.demo_url && (
                  <a
                    href={project.demo_url}
                    target="_blank"
                    rel="noreferrer"
                    className={`flex items-center gap-1 font-semibold transition-colors ${
                      isDark
                        ? "text-zinc-100 hover:text-white"
                        : "text-zinc-950 hover:text-black"
                    }`}
                  >
                    <span>View Project</span>
                    <ArrowUpRight size={13} />
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filteredProjects.length === 0 && (
        <div
          className={`py-12 text-center rounded-xl border ${
            isDark
              ? "bg-white/[0.02] border-white/10 text-zinc-400"
              : "bg-black/[0.02] border-black/10 text-zinc-600"
          }`}
        >
          <p className="text-sm">No projects found matching &ldquo;{searchQuery}&rdquo;</p>
          <button
            onClick={() => {
              setSearchQuery("");
              setActiveCategory("all");
            }}
            className={`mt-3 text-xs underline cursor-pointer font-medium ${
              isDark ? "text-white" : "text-black"
            }`}
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
};
