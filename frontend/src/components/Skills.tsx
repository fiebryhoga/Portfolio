import React, { useState } from "react";
import { Skill } from "@/types";
import { Cpu, Server, Code2, Layers, Database, ShieldCheck } from "lucide-react";
import { useDesktop } from "@/context/DesktopContext";

interface SkillsProps {
  skills: Skill[];
}

export const Skills: React.FC<SkillsProps> = ({ skills }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const { theme } = useDesktop();
  const isDark = theme === "dark";

  const categories = ["All", "Backend", "Frontend", "DevOps & Cloud"];

  const filteredSkills =
    selectedCategory === "All"
      ? skills
      : skills.filter((s) => s.category.toLowerCase().includes(selectedCategory.toLowerCase()));

  const getCategoryIcon = (category: string) => {
    const iconClass = `w-4 h-4 ${isDark ? "text-zinc-300" : "text-zinc-700"}`;
    switch (category.toLowerCase()) {
      case "backend":
        return <Server className={iconClass} />;
      case "frontend":
        return <Code2 className={iconClass} />;
      case "devops & cloud":
        return <Layers className={iconClass} />;
      default:
        return <Cpu className={iconClass} />;
    }
  };

  return (
    <section id="skills" className="py-4 sm:py-6 px-2 sm:px-4 relative">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-8">
          <div
            className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border mb-3 ${
              isDark
                ? "bg-zinc-900/80 text-zinc-300 border-white/15"
                : "bg-zinc-100 text-zinc-800 border-black/10 shadow-xs"
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>Technical Proficiencies</span>
          </div>
          <h2 className={`text-3xl sm:text-4xl font-extrabold tracking-tight ${isDark ? "text-white" : "text-zinc-950"}`}>
            Skills &amp; Engineering Arsenal
          </h2>
          <p className={`text-sm sm:text-base mt-3 ${isDark ? "text-zinc-400" : "text-zinc-600"}`}>
            Specialized in backend concurrency, distributed architectures, and modern web application interfaces.
          </p>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? isDark
                      ? "bg-white text-black font-semibold shadow-xs"
                      : "bg-black text-white font-semibold shadow-xs"
                    : isDark
                    ? "bg-zinc-900/80 text-zinc-400 border border-white/10 hover:text-white"
                    : "bg-white text-zinc-600 border border-black/10 hover:text-black shadow-xs"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredSkills.map((skill) => (
            <div
              key={skill.id}
              className={`rounded-2xl p-5 border relative overflow-hidden group transition-all duration-200 ${
                isDark
                  ? "bg-zinc-950/70 border-white/15 hover:border-white/35 shadow-lg shadow-black/40"
                  : "bg-white border-black/10 hover:border-black/30 shadow-sm shadow-black/5"
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2.5 rounded-xl border transition-colors ${
                      isDark
                        ? "bg-white/5 border-white/10 group-hover:border-white/25"
                        : "bg-black/5 border-black/10 group-hover:border-black/25"
                    }`}
                  >
                    {getCategoryIcon(skill.category)}
                  </div>
                  <div>
                    <h3
                      className={`font-bold text-sm transition-colors ${
                        isDark ? "text-white group-hover:text-zinc-200" : "text-zinc-900 group-hover:text-black"
                      }`}
                    >
                      {skill.name}
                    </h3>
                    <span className={`text-[11px] ${isDark ? "text-zinc-400" : "text-zinc-500"}`}>
                      {skill.category}
                    </span>
                  </div>
                </div>
                <span className={`text-xs font-mono font-bold ${isDark ? "text-white" : "text-black"}`}>
                  {skill.proficiency}%
                </span>
              </div>

              {/* Progress Track */}
              <div
                className={`w-full h-1.5 rounded-full overflow-hidden mt-3 ${
                  isDark ? "bg-zinc-800" : "bg-zinc-200"
                }`}
              >
                <div
                  className={`h-full rounded-full transition-all duration-700 ease-out ${
                    isDark ? "bg-gradient-to-r from-zinc-400 to-white" : "bg-gradient-to-r from-zinc-600 to-black"
                  }`}
                  style={{ width: `${skill.proficiency}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Stack Highlight Card */}
        <div
          className={`mt-12 rounded-2xl p-6 sm:p-8 border grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left ${
            isDark ? "bg-zinc-950/70 border-white/15" : "bg-white border-black/10 shadow-sm"
          }`}
        >
          <div className="flex flex-col gap-2">
            <div className={`flex items-center justify-center md:justify-start gap-2 font-semibold text-sm ${isDark ? "text-white" : "text-black"}`}>
              <Server className="w-4 h-4" />
              <span>Golang &amp; Gin Microservices</span>
            </div>
            <p className={`text-xs leading-relaxed ${isDark ? "text-zinc-400" : "text-zinc-600"}`}>
              Clean architecture, concurrency with goroutines &amp; channels, low-latency REST endpoints, and JWT authorization.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <div className={`flex items-center justify-center md:justify-start gap-2 font-semibold text-sm ${isDark ? "text-white" : "text-black"}`}>
              <Code2 className="w-4 h-4" />
              <span>React 19 &amp; Next.js 15</span>
            </div>
            <p className={`text-xs leading-relaxed ${isDark ? "text-zinc-400" : "text-zinc-600"}`}>
              Server-side rendering, React Server Components, Tailwind CSS, TypeScript type safety, and fast UX.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <div className={`flex items-center justify-center md:justify-start gap-2 font-semibold text-sm ${isDark ? "text-white" : "text-black"}`}>
              <ShieldCheck className="w-4 h-4" />
              <span>Docker &amp; PostgreSQL</span>
            </div>
            <p className={`text-xs leading-relaxed ${isDark ? "text-zinc-400" : "text-zinc-600"}`}>
              Containerized multi-stage deployments, GORM ORM, automated migrations, and CI/CD pipelines.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
