"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDesktop, STAGE_APPS } from "@/context/DesktopContext";
import {
  Search,
  FolderGit2,
  Terminal,
  FileText,
  Settings,
  User,
  FileDown,
  Sun,
  Moon,
  Sparkles,
  ArrowRight,
  CornerDownLeft,
} from "lucide-react";

type SearchItem = {
  id: string;
  title: string;
  subtitle: string;
  category: "Applications" | "Projects" | "Skills" | "Quick Actions";
  icon: React.ReactNode;
  action: () => void;
};

export default function SpotlightSearch() {
  const {
    spotlightOpen,
    setSpotlightOpen,
    openWindow,
    theme,
    toggleTheme,
  } = useDesktop();

  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const isDark = theme === "dark";

  // Focus input when opened
  useEffect(() => {
    if (spotlightOpen) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [spotlightOpen]);

  const allItems: SearchItem[] = useMemo(() => [
    // Applications
    {
      id: "app-about",
      title: "About Me",
      subtitle: "Dimas Fiebry — Fullstack & Systems Engineer",
      category: "Applications",
      icon: <User className="w-4 h-4" />,
      action: () => openWindow("about"),
    },
    {
      id: "app-projects",
      title: "Projects",
      subtitle: "Selected Engineering Works & Production Platforms",
      category: "Applications",
      icon: <FolderGit2 className="w-4 h-4" />,
      action: () => openWindow("projects"),
    },
    {
      id: "app-experience",
      title: "Experience",
      subtitle: "Career Milestones & Persebaya ISMS Experience",
      category: "Applications",
      icon: <FileText className="w-4 h-4" />,
      action: () => openWindow("experience"),
    },
    {
      id: "app-skills",
      title: "Skills & Arsenal",
      subtitle: "Golang, Gin, React, Next.js, Docker, PostgreSQL",
      category: "Applications",
      icon: <Settings className="w-4 h-4" />,
      action: () => openWindow("skills"),
    },
    {
      id: "app-contact",
      title: "Terminal & Contact",
      subtitle: "Interactive Bash Console & Direct Messaging",
      category: "Applications",
      icon: <Terminal className="w-4 h-4" />,
      action: () => openWindow("contact"),
    },

    // Projects
    {
      id: "proj-isms",
      title: "ISMS — Persebaya Surabaya",
      subtitle: "Integrated Soccer Monitoring Platform & Athletic Intelligence",
      category: "Projects",
      icon: <Sparkles className="w-4 h-4" />,
      action: () => openWindow("projects"),
    },
    {
      id: "proj-elearning",
      title: "E-Learning SMAN 1 Gondang",
      subtitle: "Fullstack School Academic & Quiz Management System",
      category: "Projects",
      icon: <FolderGit2 className="w-4 h-4" />,
      action: () => openWindow("projects"),
    },
    {
      id: "proj-pos",
      title: "Modern POS & Inventory Management",
      subtitle: "High-throughput cloud retail engine built with Go Gin & Next.js",
      category: "Projects",
      icon: <FolderGit2 className="w-4 h-4" />,
      action: () => openWindow("projects"),
    },
    {
      id: "proj-wa",
      title: "WhatsApp Dispatch Microservice",
      subtitle: "Automated event alerts relay powered by Node.js & Baileys",
      category: "Projects",
      icon: <FolderGit2 className="w-4 h-4" />,
      action: () => openWindow("projects"),
    },

    // Skills
    {
      id: "skill-go",
      title: "Golang & Gin Microservices",
      subtitle: "High concurrency, goroutines, RESTful APIs, JWT authentication",
      category: "Skills",
      icon: <Settings className="w-4 h-4" />,
      action: () => openWindow("skills"),
    },
    {
      id: "skill-react",
      title: "React 19 & Next.js 15",
      subtitle: "Server Components, modern TypeScript, Tailwind CSS",
      category: "Skills",
      icon: <Settings className="w-4 h-4" />,
      action: () => openWindow("skills"),
    },
    {
      id: "skill-laravel",
      title: "Laravel 11 & Filament 3",
      subtitle: "Enterprise admin architecture, Livewire, Alpine.js",
      category: "Skills",
      icon: <Settings className="w-4 h-4" />,
      action: () => openWindow("skills"),
    },
    {
      id: "skill-docker",
      title: "Docker & PostgreSQL",
      subtitle: "Container orchestration, multi-stage builds, GORM ORM",
      category: "Skills",
      icon: <Settings className="w-4 h-4" />,
      action: () => openWindow("skills"),
    },

    // Quick Actions
    {
      id: "act-cv",
      title: "Download Dimas's CV / Resume",
      subtitle: "Direct download of complete verified professional CV (TXT)",
      category: "Quick Actions",
      icon: <FileDown className="w-4 h-4" />,
      action: () => {
        const link = document.createElement("a");
        link.href = "/dimas_fiebry_cv.txt";
        link.download = "Dimas_Fiebry_CV.txt";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      },
    },
    {
      id: "act-theme",
      title: `Toggle Theme (Switch to ${isDark ? "Light" : "Dark"} Mode)`,
      subtitle: "Instant switch between Obsidian Dark and Apple Silver",
      category: "Quick Actions",
      icon: isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />,
      action: () => toggleTheme(),
    },
    {
      id: "act-contact",
      title: "Send Direct Message to Dimas",
      subtitle: "Dispatches directly to Go Gin backend endpoint",
      category: "Quick Actions",
      icon: <ArrowRight className="w-4 h-4" />,
      action: () => openWindow("contact"),
    },
  ], [isDark, openWindow, toggleTheme]);

  const filteredItems = useMemo(() => {
    if (!query.trim()) return allItems;
    const q = query.toLowerCase().trim();
    return allItems.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.subtitle.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)
    );
  }, [allItems, query]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredItems.length));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % Math.max(1, filteredItems.length));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const target = filteredItems[selectedIndex];
      if (target) {
        target.action();
        setSpotlightOpen(false);
      }
    } else if (e.key === "Escape") {
      e.preventDefault();
      setSpotlightOpen(false);
    }
  };

  if (!spotlightOpen) return null;

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-start justify-center pt-[14vh] px-4 bg-black/40 backdrop-blur-xs select-none"
        onClick={() => setSpotlightOpen(false)}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: -10 }}
          transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
          onClick={(e) => e.stopPropagation()}
          className={`w-full max-w-xl rounded-2xl overflow-hidden backdrop-blur-2xl border shadow-2xl flex flex-col transition-colors ${
            isDark
              ? "bg-[#0f1117]/95 border-white/20 text-zinc-100 shadow-black/90"
              : "bg-white/95 border-black/15 text-zinc-900 shadow-black/20"
          }`}
        >
          {/* Search Input Bar */}
          <div
            className={`h-14 px-4 flex items-center gap-3 border-b ${
              isDark ? "border-white/10" : "border-black/10"
            }`}
          >
            <Search
              className={`w-5 h-5 shrink-0 ${isDark ? "text-zinc-400" : "text-zinc-500"}`}
            />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setSelectedIndex(0);
              }}
              onKeyDown={handleKeyDown}
              placeholder="Search apps, projects, skills, or actions (⌘K)..."
              className="w-full bg-transparent border-none outline-none text-base placeholder:opacity-40"
            />
            <div className="flex items-center gap-1.5 shrink-0">
              <kbd
                className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${
                  isDark
                    ? "bg-white/5 border-white/15 text-zinc-400"
                    : "bg-black/5 border-black/10 text-zinc-600"
                }`}
              >
                ESC
              </kbd>
            </div>
          </div>

          {/* Results List */}
          <div className="max-h-84 overflow-y-auto p-2 space-y-1 custom-window-scrollbar">
            {filteredItems.length === 0 ? (
              <div className={`p-8 text-center text-xs ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>
                No results found for &ldquo;{query}&rdquo;
              </div>
            ) : (
              filteredItems.map((item, idx) => {
                const isSelected = idx === selectedIndex;
                return (
                  <div
                    key={item.id}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    onClick={() => {
                      item.action();
                      setSpotlightOpen(false);
                    }}
                    className={`px-3 py-2 rounded-xl flex items-center justify-between cursor-pointer transition-colors ${
                      isSelected
                        ? isDark
                          ? "bg-white/15 text-white"
                          : "bg-black/10 text-black font-medium"
                        : isDark
                        ? "text-zinc-300 hover:bg-white/5"
                        : "text-zinc-700 hover:bg-black/5"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`p-2 rounded-lg border shrink-0 ${
                          isDark
                            ? "bg-white/5 border-white/10"
                            : "bg-black/5 border-black/10"
                        }`}
                      >
                        {item.icon}
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-semibold truncate flex items-center gap-2">
                          <span>{item.title}</span>
                          <span
                            className={`text-[10px] font-normal px-1.5 py-0.2 rounded border ${
                              isDark
                                ? "bg-white/5 border-white/10 text-zinc-400"
                                : "bg-black/5 border-black/10 text-zinc-500"
                            }`}
                          >
                            {item.category}
                          </span>
                        </div>
                        <div
                          className={`text-[11px] truncate font-light ${
                            isDark ? "text-zinc-400" : "text-zinc-500"
                          }`}
                        >
                          {item.subtitle}
                        </div>
                      </div>
                    </div>

                    {isSelected && (
                      <CornerDownLeft className="w-3.5 h-3.5 shrink-0 opacity-60 ml-2" />
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Bar */}
          <div
            className={`h-8 px-4 border-t flex items-center justify-between text-[10px] font-mono ${
              isDark
                ? "bg-white/[0.02] border-white/10 text-zinc-500"
                : "bg-black/[0.02] border-black/10 text-zinc-400"
            }`}
          >
            <span>Navigate: ↑ ↓</span>
            <span>Select: ↵</span>
            <span>Dimas.dev Spotlight</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
