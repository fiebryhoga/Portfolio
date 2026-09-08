"use client";

import { useDesktop, STAGE_APPS } from "@/context/DesktopContext";
import { FolderGit2, Terminal, FileText, Settings, User } from "lucide-react";
import { motion } from "framer-motion";

export default function Dock() {
  const { openAppIds, activeAppId, openWindow, theme } = useDesktop();
  const isDark = theme === "dark";

  const getIcon = (id: string) => {
    switch (id) {
      case "about":
        return <User size={18} />;
      case "projects":
        return <FolderGit2 size={18} />;
      case "experience":
        return <FileText size={18} />;
      case "skills":
        return <Settings size={18} />;
      case "contact":
        return <Terminal size={18} />;
      default:
        return <User size={18} />;
    }
  };

  return (
    <footer className="fixed bottom-2.5 sm:bottom-3 left-1/2 -translate-x-1/2 z-50 select-none">
      <div
        className={`backdrop-blur-2xl p-1.5 sm:p-2 rounded-2xl flex items-center space-x-1.5 sm:space-x-2 transition-colors duration-200 border ${
          isDark
            ? "bg-zinc-950/70 border-white/15 shadow-2xl shadow-black/80"
            : "bg-white/75 border-black/10 shadow-xl shadow-black/15"
        }`}
      >
        {STAGE_APPS.map((app) => {
          const isOpen = openAppIds.includes(app.id);
          const isActive = app.id === activeAppId;

          return (
            <motion.button
              key={app.id}
              whileHover={{ scale: 1.18, y: -6 }}
              whileTap={{ scale: 0.92 }}
              onClick={() => openWindow(app.id)}
              className="relative group cursor-pointer focus:outline-none"
            >
              {/* App Icon Tile */}
              <div
                className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shadow-md transition-all duration-200 border ${
                  isDark
                    ? isActive
                      ? "bg-gradient-to-b from-zinc-800 to-zinc-900 text-white border-white ring-2 ring-white/30 shadow-white/10"
                      : "bg-gradient-to-b from-zinc-800 to-zinc-900 text-zinc-200 border-white/15 opacity-90 group-hover:opacity-100 group-hover:border-white/35"
                    : isActive
                    ? "bg-gradient-to-b from-white to-zinc-100 text-black border-black ring-2 ring-black/20 shadow-black/10"
                    : "bg-gradient-to-b from-white to-zinc-100 text-zinc-800 border-black/10 opacity-90 group-hover:opacity-100 group-hover:border-black/30"
                }`}
              >
                {getIcon(app.id)}
              </div>

              {/* Hover Tooltip */}
              <div
                className={`absolute -top-8 left-1/2 -translate-x-1/2 backdrop-blur-md text-[11px] px-2 py-0.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-lg border ${
                  isDark
                    ? "bg-black/90 text-white border-white/10"
                    : "bg-white/95 text-zinc-900 border-black/10"
                }`}
              >
                {app.title}
              </div>

              {/* Running / Open Indicator Dot */}
              {isOpen && (
                <div
                  className={`absolute -bottom-1 left-1/2 -translate-x-1/2 rounded-full transition-all ${
                    isDark
                      ? isActive
                        ? "w-1.5 h-1.5 bg-white shadow-xs shadow-white"
                        : "w-1 h-1 bg-zinc-400"
                      : isActive
                      ? "w-1.5 h-1.5 bg-black shadow-xs shadow-black/40"
                      : "w-1 h-1 bg-zinc-500"
                  }`}
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </footer>
  );
}
