"use client";

import React from "react";
import { Experience as ExperienceType } from "@/types";
import {
  Briefcase,
  Calendar,
  MapPin,
  Building2,
  Sparkles,
} from "lucide-react";
import { useDesktop } from "@/context/DesktopContext";

interface ExperienceProps {
  experiences: ExperienceType[];
}

export const Experience: React.FC<ExperienceProps> = ({ experiences }) => {
  const { theme } = useDesktop();
  const isDark = theme === "dark";

  return (
    <div className="@container max-w-4xl mx-auto py-5 sm:py-7 px-3 sm:px-6 select-text space-y-6">
      {/* 1. Header (macOS App Style, Left-Aligned) */}
      <div
        className={`pb-5 border-b transition-colors ${
          isDark ? "border-white/10" : "border-black/10"
        }`}
      >
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <h1
            className={`text-xl sm:text-2xl font-bold tracking-tight ${
              isDark ? "text-white" : "text-zinc-950"
            }`}
          >
            Work Experience &amp; Milestones
          </h1>
          <span
            className={`text-xs font-mono font-medium ${
              isDark ? "text-zinc-400" : "text-zinc-500"
            }`}
          >
            / {experiences.length} Positions
          </span>
        </div>
        <p
          className={`text-xs sm:text-sm font-normal ${
            isDark ? "text-zinc-400" : "text-zinc-600"
          }`}
        >
          Track record of engineering mission-critical systems, sports performance engines, and fullstack cloud applications.
        </p>
      </div>

      {/* 2. Timeline List */}
      <div
        className={`relative border-l ml-3 sm:ml-4 space-y-6 sm:space-y-7 transition-colors ${
          isDark ? "border-white/15" : "border-black/15"
        }`}
      >
        {experiences.map((exp) => {
          const bullets = exp.bullet_points
            ? exp.bullet_points.split("|").map((b) => b.trim()).filter(Boolean)
            : [];

          return (
            <div key={exp.id} className="relative pl-6 sm:pl-7 group">
              {/* Timeline Node Marker */}
              <div
                className={`absolute -left-[7px] top-4 w-3.5 h-3.5 rounded-full border-2 transition-transform duration-200 group-hover:scale-125 ${
                  exp.is_current
                    ? isDark
                      ? "bg-black border-emerald-400"
                      : "bg-white border-emerald-600"
                    : isDark
                    ? "bg-black border-zinc-500 group-hover:border-white"
                    : "bg-white border-zinc-400 group-hover:border-black"
                }`}
              >
                {exp.is_current && (
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 m-auto mt-0.5 animate-pulse" />
                )}
              </div>

              {/* Experience Card */}
              <div
                className={`rounded-xl p-4 sm:p-5 border transition-all duration-200 ${
                  isDark
                    ? "bg-zinc-900/40 border-white/10 hover:border-white/20"
                    : "bg-white border-black/10 hover:border-black/20"
                }`}
              >
                {/* Header: Role + Company + (No background badges) */}
                <div className="flex flex-col @[580px]:flex-row @[580px]:items-start justify-between gap-2.5 mb-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <h2
                        className={`text-sm sm:text-base font-bold tracking-tight leading-snug ${
                          isDark ? "text-white" : "text-zinc-950"
                        }`}
                      >
                        {exp.role}
                      </h2>
                      {exp.is_current && (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          Current Role
                        </span>
                      )}
                    </div>
                    <div
                      className={`flex items-center gap-1.5 text-xs font-medium mt-0.5 ${
                        isDark ? "text-zinc-400" : "text-zinc-600"
                      }`}
                    >
                      <Building2 size={13} className="shrink-0 opacity-70" />
                      <span>{exp.company}</span>
                    </div>
                  </div>

                  {/* Metadata Chips: Date & Location (Clean Text, No Badges) */}
                  <div
                    className={`flex flex-wrap items-center gap-3 text-xs shrink-0 @[580px]:text-right ${
                      isDark ? "text-zinc-400" : "text-zinc-600"
                    }`}
                  >
                    <span className="inline-flex items-center gap-1 text-xs font-mono">
                      <Calendar size={11} className="opacity-70" />
                      <span>
                        {exp.start_date} — {exp.end_date}
                      </span>
                    </span>
                    {exp.location && (
                      <span className="inline-flex items-center gap-1 text-xs">
                        <MapPin size={11} className="opacity-70" />
                        <span>{exp.location}</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Role Description */}
                <p
                  className={`text-xs sm:text-sm leading-relaxed mb-3 font-normal ${
                    isDark ? "text-zinc-300" : "text-zinc-700"
                  }`}
                >
                  {exp.description}
                </p>

                {/* Key Accomplishments / Bullet Points */}
                {bullets.length > 0 && (
                  <div
                    className={`pt-3 border-t space-y-1.5 ${
                      isDark ? "border-white/10" : "border-black/10"
                    }`}
                  >
                    {bullets.map((bullet, idx) => (
                      <div
                        key={idx}
                        className={`flex items-start gap-2 text-xs leading-relaxed ${
                          isDark ? "text-zinc-300" : "text-zinc-700"
                        }`}
                      >
                        <span
                          className={`font-mono mt-0.5 select-none shrink-0 ${
                            isDark ? "text-zinc-500" : "text-zinc-400"
                          }`}
                        >
                          •
                        </span>
                        <span>{bullet}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
