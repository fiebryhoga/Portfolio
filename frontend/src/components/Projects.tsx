"use client";

import React, { useState } from "react";
import { Project } from "@/types";
import { ExternalLink, Sparkles, Layers, ArrowUpRight } from "lucide-react";
import { GithubIcon } from "@/components/Icons";
import { useDesktop } from "@/context/DesktopContext";

interface ProjectsProps {
  projects: Project[];
}

export const Projects: React.FC<ProjectsProps> = ({ projects }) => {
  const [filter, setFilter] = useState<"all" | "featured">("all");
  const { theme } = useDesktop();
  const isDark = theme === "dark";

  const displayProjects =
    filter === "featured" ? projects.filter((p) => p.featured) : projects;

  return (
    <section id="projects" className="py-4 sm:py-6 px-2 sm:px-4 relative">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div
              className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border mb-3 ${
                isDark
                  ? "bg-zinc-900/80 text-zinc-300 border-white/15"
                  : "bg-zinc-100 text-zinc-800 border-black/10 shadow-xs"
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Selected Works</span>
            </div>
            <h2 className={`text-3xl sm:text-4xl font-extrabold tracking-tight ${isDark ? "text-white" : "text-zinc-950"}`}>
              Featured Engineering Projects
            </h2>
            <p className={`text-sm sm:text-base mt-2 max-w-xl ${isDark ? "text-zinc-400" : "text-zinc-600"}`}>
              Real-world systems, cloud-native services, and interactive web applications designed for scale and developer experience.
            </p>
          </div>

          {/* Filter toggle */}
          <div
            className={`flex items-center gap-1.5 p-1 rounded-xl border self-start md:self-auto ${
              isDark ? "bg-zinc-900/80 border-white/10" : "bg-zinc-100 border-black/10 shadow-xs"
            }`}
          >
            <button
              onClick={() => setFilter("all")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                filter === "all"
                  ? isDark
                    ? "bg-white text-black font-semibold shadow-xs"
                    : "bg-black text-white font-semibold shadow-xs"
                  : isDark
                  ? "text-zinc-400 hover:text-white"
                  : "text-zinc-600 hover:text-black"
              }`}
            >
              All Projects ({projects.length})
            </button>
            <button
              onClick={() => setFilter("featured")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                filter === "featured"
                  ? isDark
                    ? "bg-white text-black font-semibold shadow-xs"
                    : "bg-black text-white font-semibold shadow-xs"
                  : isDark
                  ? "text-zinc-400 hover:text-white"
                  : "text-zinc-600 hover:text-black"
              }`}
            >
              Featured Only
            </button>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {displayProjects.map((project) => {
            const tags = project.tech_stack
              ? project.tech_stack.split(",").map((t) => t.trim())
              : [];

            return (
              <div
                key={project.id}
                className={`rounded-2xl overflow-hidden border flex flex-col group transition-all duration-250 ${
                  isDark
                    ? "bg-zinc-950/70 border-white/15 hover:border-white/35 shadow-xl shadow-black/60"
                    : "bg-white border-black/10 hover:border-black/30 shadow-md shadow-black/5"
                }`}
              >
                {/* Project Image Preview */}
                <div className="relative h-56 w-full overflow-hidden bg-zinc-900">
                  <img
                    src={project.image_url}
                    alt={project.title}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                    loading="lazy"
                  />
                  <div
                    className={`absolute inset-0 bg-gradient-to-t via-transparent to-transparent opacity-90 ${
                      isDark ? "from-[#0d0e12]" : "from-white"
                    }`}
                  />

                  {project.featured && (
                    <div
                      className={`absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold backdrop-blur-md shadow-sm border ${
                        isDark
                          ? "bg-white/95 text-black border-white/30"
                          : "bg-black/90 text-white border-black/20"
                      }`}
                    >
                      <Sparkles className="w-3 h-3" />
                      Featured
                    </div>
                  )}
                </div>

                {/* Project Content */}
                <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between">
                  <div>
                    <h3
                      className={`text-xl font-bold mb-2 transition-colors ${
                        isDark ? "text-white group-hover:text-zinc-200" : "text-zinc-900 group-hover:text-black"
                      }`}
                    >
                      {project.title}
                    </h3>
                    <p
                      className={`text-sm leading-relaxed line-clamp-3 mb-6 font-light ${
                        isDark ? "text-zinc-300" : "text-zinc-600"
                      }`}
                    >
                      {project.short_description || project.full_description}
                    </p>

                    {/* Tech Stack Pills */}
                    <div className="flex flex-wrap gap-1.5 mb-6">
                      {tags.map((tag) => (
                        <span
                          key={tag}
                          className={`px-2.5 py-0.5 rounded-md text-[11px] font-mono border ${
                            isDark
                              ? "bg-zinc-900 text-zinc-300 border-white/10"
                              : "bg-zinc-100 text-zinc-700 border-black/10"
                          }`}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Links and Actions */}
                  <div
                    className={`flex items-center justify-between pt-4 border-t mt-auto ${
                      isDark ? "border-white/10" : "border-black/10"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {project.github_url && (
                        <a
                          href={project.github_url}
                          target="_blank"
                          rel="noreferrer"
                          className={`flex items-center gap-1.5 text-xs transition-colors ${
                            isDark ? "text-zinc-400 hover:text-white" : "text-zinc-600 hover:text-black"
                          }`}
                        >
                          <GithubIcon className="w-4 h-4" />
                          <span>Source Code</span>
                        </a>
                      )}
                    </div>

                    {project.demo_url && (
                      <a
                        href={project.demo_url}
                        target="_blank"
                        rel="noreferrer"
                        className={`flex items-center gap-1 text-xs font-semibold transition-colors underline underline-offset-4 ${
                          isDark
                            ? "text-zinc-200 hover:text-white decoration-zinc-600"
                            : "text-zinc-800 hover:text-black decoration-zinc-400"
                        }`}
                      >
                        <span>Live Preview</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
