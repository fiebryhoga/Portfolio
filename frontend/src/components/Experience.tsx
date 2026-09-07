import React from "react";
import { Experience as ExperienceType } from "@/types";
import { Briefcase, Calendar, MapPin, CheckCircle } from "lucide-react";
import { useDesktop } from "@/context/DesktopContext";

interface ExperienceProps {
  experiences: ExperienceType[];
}

export const Experience: React.FC<ExperienceProps> = ({ experiences }) => {
  const { theme } = useDesktop();
  const isDark = theme === "dark";

  return (
    <section id="experience" className="py-4 sm:py-6 px-2 sm:px-4 relative">
      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-8">
          <div
            className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border mb-3 ${
              isDark
                ? "bg-zinc-900/80 text-zinc-300 border-white/15"
                : "bg-zinc-100 text-zinc-800 border-black/10 shadow-xs"
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>Career Journey</span>
          </div>
          <h2 className={`text-3xl sm:text-4xl font-extrabold tracking-tight ${isDark ? "text-white" : "text-zinc-950"}`}>
            Work Experience &amp; Milestones
          </h2>
          <p className={`text-sm sm:text-base mt-2 ${isDark ? "text-zinc-400" : "text-zinc-600"}`}>
            Track record of shipping mission-critical systems and scaling cloud applications.
          </p>
        </div>

        {/* Timeline Container */}
        <div
          className={`relative border-l ml-4 sm:ml-8 space-y-12 transition-colors ${
            isDark ? "border-white/15" : "border-black/15"
          }`}
        >
          {experiences.map((exp) => {
            const bullets = exp.bullet_points
              ? exp.bullet_points.split("|").map((b) => b.trim())
              : [];

            return (
              <div key={exp.id} className="relative pl-8 group">
                {/* Node Marker */}
                <div
                  className={`absolute -left-[9px] top-1.5 w-4 h-4 rounded-full border-2 transition-all duration-200 group-hover:scale-125 ${
                    isDark
                      ? "bg-black border-zinc-400 group-hover:border-white"
                      : "bg-white border-zinc-600 group-hover:border-black"
                  }`}
                >
                  <div className={`w-1.5 h-1.5 rounded-full m-auto mt-0.5 ${isDark ? "bg-white" : "bg-black"}`} />
                </div>

                {/* Experience Card */}
                <div
                  className={`rounded-2xl p-6 sm:p-7 border transition-all duration-200 ${
                    isDark
                      ? "bg-zinc-950/70 border-white/15 hover:border-white/35 shadow-xl shadow-black/60"
                      : "bg-white border-black/10 hover:border-black/30 shadow-md shadow-black/5"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                    <div>
                      <h3
                        className={`text-lg font-bold transition-colors ${
                          isDark ? "text-white group-hover:text-zinc-200" : "text-zinc-900 group-hover:text-black"
                        }`}
                      >
                        {exp.role}
                      </h3>
                      <div className={`text-sm font-medium ${isDark ? "text-zinc-400" : "text-zinc-600"}`}>
                        {exp.company}
                      </div>
                    </div>

                    <div className={`flex flex-wrap items-center gap-3 text-xs ${isDark ? "text-zinc-400" : "text-zinc-500"}`}>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 opacity-70" />
                        {exp.start_date} — {exp.end_date}
                      </span>
                      {exp.location && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 opacity-70" />
                          {exp.location}
                        </span>
                      )}
                      {exp.is_current && (
                        <span
                          className={`px-2 py-0.5 rounded-full border text-[10px] font-semibold ${
                            isDark
                              ? "bg-white/10 text-white border-white/20"
                              : "bg-black/5 text-black border-black/15 font-bold"
                          }`}
                        >
                          Current Role
                        </span>
                      )}
                    </div>
                  </div>

                  <p className={`text-sm leading-relaxed mb-4 font-light ${isDark ? "text-zinc-300" : "text-zinc-600"}`}>
                    {exp.description}
                  </p>

                  {/* Bullet Points */}
                  {bullets.length > 0 && (
                    <ul className={`space-y-2 pt-3 border-t ${isDark ? "border-white/10" : "border-black/10"}`}>
                      {bullets.map((bullet, idx) => (
                        <li
                          key={idx}
                          className={`flex items-start gap-2.5 text-xs sm:text-sm font-light ${
                            isDark ? "text-zinc-300" : "text-zinc-700"
                          }`}
                        >
                          <CheckCircle className={`w-4 h-4 shrink-0 mt-0.5 ${isDark ? "text-zinc-400" : "text-zinc-600"}`} />
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
