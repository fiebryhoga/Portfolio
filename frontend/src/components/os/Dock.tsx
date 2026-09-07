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
        return <User size={22} />;
      case "projects":
        return <FolderGit2 size={22} />;
      case "experience":
        return <FileText size={22} />;
      case "skills":
        return <Settings size={22} />;
      case "contact":
        return <Terminal size={22} />;
      default:
        return <User size={22} />;
    }
  };

  return (
    <footer className="fixed bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 z-50 select-none">
      <div
        className={`backdrop-blur-2xl p-2 sm:p-2.5 rounded-2xl flex items-center space-x-2 sm:space-x-3 transition-colors duration-200 border ${
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
              whileHover={{ scale: 1.25, y: -10 }}
              whileTap={{ scale: 0.92 }}
              onClick={() => openWindow(app.id)}
              className="relative group cursor-pointer focus:outline-none"
            >
              {/* App Icon Tile */}
              <div
                className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center shadow-lg transition-all duration-200 border ${
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
                className={`absolute -top-9 left-1/2 -translate-x-1/2 backdrop-blur-md text-xs px-2.5 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-lg border ${
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
                  className={`absolute -bottom-1.5 left-1/2 -translate-x-1/2 rounded-full transition-all ${
                    isDark
                      ? isActive
                        ? "w-2 h-2 bg-white shadow-xs shadow-white"
                        : "w-1.5 h-1.5 bg-zinc-400"
                      : isActive
                      ? "w-2 h-2 bg-black shadow-xs shadow-black/40"
                      : "w-1.5 h-1.5 bg-zinc-500"
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
