"use client";

import React from "react";
import { useDesktop, STAGE_APPS } from "@/context/DesktopContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  FolderGit2,
  FileText,
  Settings,
  Terminal as TerminalIcon,
  BookOpen,
  Sparkles,
  Layers,
  X,
} from "lucide-react";

export default function StageManagerRail() {
  const { openAppIds, activeAppId, setActiveAppId, closeApp, isMaximized, theme } = useDesktop();

  if (isMaximized || activeAppId === null) return null;

  const isDark = theme === "dark";

  // Show only apps that are currently open and NOT on Center Stage
  const inactiveApps = STAGE_APPS.filter(
    (app) => openAppIds.includes(app.id) && app.id !== activeAppId
  );

  if (inactiveApps.length === 0) return null;

  const getAppIcon = (id: string, className = "w-3.5 h-3.5") => {
    switch (id) {
      case "about":
        return <User className={className} />;
      case "projects":
        return <FolderGit2 className={className} />;
      case "experience":
        return <FileText className={className} />;
      case "skills":
        return <Settings className={className} />;
      case "writing":
        return <BookOpen className={className} />;
      case "contact":
        return <TerminalIcon className={className} />;
      default:
        return <Sparkles className={className} />;
    }
  };

  return (
    <motion.aside
      key="stage-manager-rail"
      initial={{ opacity: 0, x: -35 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -35 }}
      transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
      aria-label="Stage Manager Strip"
      className="hidden md:flex fixed left-3 top-12 bottom-24 w-32 lg:w-36 z-30 flex-col justify-center space-y-4 select-none pointer-events-none"
    >
      <AnimatePresence mode="popLayout">
        {inactiveApps.map((app) => (
          <motion.div
            key={app.id}
            initial={{ opacity: 0, scale: 0.85, x: -20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.8, x: -30 }}
            transition={{ duration: 0.15 }}
            whileHover={{ scale: 1.06, x: 5 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveAppId(app.id)}
            className="relative group cursor-pointer pointer-events-auto transform-gpu"
          >
            {/* Miniature App Window Thumbnail */}
            <div
              className={`w-full h-20 lg:h-22 rounded-xl backdrop-blur-md overflow-hidden flex flex-col transition-all duration-150 border ${
                isDark
                  ? "bg-zinc-900/90 border-white/15 shadow-xl shadow-black/60 group-hover:border-white/40 group-hover:shadow-white/5"
                  : "bg-white/90 border-black/10 shadow-lg shadow-black/10 group-hover:border-black/35 group-hover:shadow-black/15"
              }`}
            >
              {/* Mini Window Titlebar with Close Button */}
              <div
                className={`h-4 border-b flex items-center justify-between px-1.5 shrink-0 ${
                  isDark
                    ? "bg-white/[0.04] border-white/10 text-white/50"
                    : "bg-black/[0.03] border-black/10 text-zinc-500"
                }`}
              >
                <div className="flex items-center space-x-1">
                  {/* Close ONLY this thumbnail app */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      closeApp(app.id);
                    }}
                    title={`Close ${app.title}`}
                    className="w-2 h-2 rounded-full bg-[#ff5f56] hover:bg-[#ff4338] hover:scale-125 transition-transform flex items-center justify-center text-[7px] text-white focus:outline-none"
                  >
                    <span className="opacity-0 group-hover:opacity-100 font-bold leading-none">✕</span>
                  </button>
                  <div className="w-1.5 h-1.5 rounded-full bg-[#ffbd2e]/80" />
                  <div className="w-1.5 h-1.5 rounded-full bg-[#27c93f]/80" />
                </div>
                <span className="text-[8px] truncate font-mono">{app.title}</span>
              </div>

              {/* Mini Content Mockup based on app type */}
              <div
                className={`flex-1 p-2 flex flex-col justify-center overflow-hidden ${
                  isDark ? "bg-gradient-to-b from-transparent to-black/30" : "bg-gradient-to-b from-transparent to-black/5"
                }`}
              >
                {app.id === "about" && (
                  <div className="space-y-1">
                    <div className="flex items-center space-x-1.5">
                      <div className={`w-3.5 h-3.5 rounded-full border ${isDark ? "bg-white/10 border-white/30" : "bg-black/10 border-black/20"}`} />
                      <div className={`h-1.5 w-14 rounded-full ${isDark ? "bg-white/40" : "bg-black/30"}`} />
                    </div>
                    <div className={`h-1 w-full rounded-full ${isDark ? "bg-white/20" : "bg-black/15"}`} />
                    <div className={`h-1 w-4/5 rounded-full ${isDark ? "bg-white/15" : "bg-black/10"}`} />
                  </div>
                )}

                {app.id === "projects" && (
                  <div className="grid grid-cols-2 gap-1 h-full items-center">
                    <div className={`h-9 border rounded flex items-center justify-center ${isDark ? "bg-white/5 border-white/15" : "bg-black/5 border-black/10"}`}>
                      <Layers className={`w-2.5 h-2.5 ${isDark ? "text-zinc-300" : "text-zinc-600"}`} />
                    </div>
                    <div className={`h-9 border rounded flex items-center justify-center ${isDark ? "bg-white/5 border-white/15" : "bg-black/5 border-black/10"}`}>
                      <Sparkles className={`w-2.5 h-2.5 ${isDark ? "text-zinc-300" : "text-zinc-600"}`} />
                    </div>
                  </div>
                )}

                {app.id === "experience" && (
                  <div className="flex items-center space-x-2 pl-1">
                    <div className={`w-1 h-8 rounded-full flex flex-col justify-between py-0.5 ${isDark ? "bg-white/20" : "bg-black/20"}`}>
                      <div className={`w-1.5 h-1.5 -ml-0.5 rounded-full ${isDark ? "bg-white" : "bg-black"}`} />
                      <div className={`w-1.5 h-1.5 -ml-0.5 rounded-full ${isDark ? "bg-white/60" : "bg-black/60"}`} />
                    </div>
                    <div className="space-y-1 flex-1">
                      <div className={`h-1.5 w-14 rounded ${isDark ? "bg-white/40" : "bg-black/40"}`} />
                      <div className={`h-1 w-10 rounded ${isDark ? "bg-white/20" : "bg-black/20"}`} />
                    </div>
                  </div>
                )}

                {app.id === "skills" && (
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <div className={`h-1 w-10 rounded ${isDark ? "bg-white/60" : "bg-black/60"}`} />
                      <span className={`text-[7px] font-mono ${isDark ? "text-white" : "text-black"}`}>95%</span>
                    </div>
                    <div className={`h-1 w-full rounded-full overflow-hidden ${isDark ? "bg-zinc-800" : "bg-zinc-200"}`}>
                      <div className={`h-full w-4/5 rounded-full ${isDark ? "bg-white" : "bg-black"}`} />
                    </div>
                    <div className={`h-1 w-full rounded-full overflow-hidden ${isDark ? "bg-zinc-800" : "bg-zinc-200"}`}>
                      <div className={`h-full w-3/5 rounded-full ${isDark ? "bg-zinc-400" : "bg-zinc-500"}`} />
                    </div>
                  </div>
                )}

                {app.id === "contact" && (
                  <div className={`font-mono text-[7px] space-y-0.5 ${isDark ? "text-zinc-200" : "text-zinc-800"}`}>
                    <div className="flex items-center space-x-1">
                      <span className="font-semibold">dimas@mac</span>
                      <span className="opacity-50">%</span>
                    </div>
                    <div className="truncate opacity-75">contact --send</div>
                    <div className={`w-1.5 h-2 animate-pulse ${isDark ? "bg-white" : "bg-black"}`} />
                  </div>
                )}
              </div>
            </div>

            {/* App Icon Badge */}
            <div
              className={`absolute -bottom-2 -left-2 w-6 h-6 rounded-lg border shadow-lg flex items-center justify-center z-20 transition-transform group-hover:scale-110 ${
                isDark
                  ? "bg-zinc-800 border-white/25 text-white"
                  : "bg-white border-black/15 text-black shadow-md"
              }`}
            >
              {getAppIcon(app.id, "w-3.5 h-3.5")}
            </div>

            {/* Tooltip on Hover */}
            <div
              className={`absolute left-full ml-3 top-1/2 -translate-y-1/2 text-xs px-2.5 py-1 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none backdrop-blur-md z-30 border ${
                isDark
                  ? "bg-black/90 text-white border-white/10"
                  : "bg-white/95 text-zinc-900 border-black/10 shadow-lg"
              }`}
            >
              <span className="font-semibold">{app.title}</span>
              <span className={`ml-1.5 text-[11px] ${isDark ? "text-zinc-400" : "text-zinc-500"}`}>— {app.subtitle}</span>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.aside>
  );
}
