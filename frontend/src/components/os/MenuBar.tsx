"use client";

import { useState, useEffect } from "react";
import { Wifi, Battery, Search, LayoutTemplate, Sun, Moon } from "lucide-react";
import { useDesktop, STAGE_APPS } from "@/context/DesktopContext";

export default function MenuBar() {
  const [time, setTime] = useState<Date | null>(null);
  const { activeAppId, stageManagerOpen, setStageManagerOpen, theme, toggleTheme } = useDesktop();

  useEffect(() => {
    setTime(new Date());
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const activeApp = STAGE_APPS.find((a) => a.id === activeAppId);
  const activeAppName = activeApp ? activeApp.title : "Dimas.dev";

  const isDark = theme === "dark";

  return (
    <header
      className={`h-7 w-full backdrop-blur-xl text-sm flex items-center justify-between px-3 sm:px-4 fixed top-0 left-0 z-50 select-none transition-colors duration-200 border-b ${
        isDark
          ? "bg-black/45 text-white/90 border-white/10"
          : "bg-white/75 text-zinc-900 border-black/10 shadow-xs"
      }`}
    >
      <div className="flex items-center space-x-3 sm:space-x-4">
        <div className="font-bold text-base cursor-default hover:opacity-75 transition-opacity"></div>
        <div className="font-bold text-xs tracking-wide">{activeAppName}</div>
        <div className={`text-xs hidden md:flex space-x-4 ${isDark ? "text-white/60" : "text-zinc-600"}`}>
          <span className={`cursor-default transition-colors ${isDark ? "hover:text-white" : "hover:text-black"}`}>File</span>
          <span className={`cursor-default transition-colors ${isDark ? "hover:text-white" : "hover:text-black"}`}>Edit</span>
          <span className={`cursor-default transition-colors ${isDark ? "hover:text-white" : "hover:text-black"}`}>View</span>
          <span className={`cursor-default transition-colors ${isDark ? "hover:text-white" : "hover:text-black"}`}>Window</span>
          <span className={`cursor-default transition-colors ${isDark ? "hover:text-white" : "hover:text-black"}`}>Help</span>
        </div>
      </div>

      <div className="flex items-center space-x-2.5 sm:space-x-3.5">
        {/* Dark / Light Mode Toggle Button */}
        <button
          onClick={toggleTheme}
          title={`Switch to ${isDark ? "Light" : "Dark"} Mode`}
          className={`p-1 rounded transition-all cursor-pointer ${
            isDark
              ? "hover:bg-white/15 text-zinc-300 hover:text-white"
              : "hover:bg-black/10 text-zinc-700 hover:text-black"
          }`}
          aria-label="Toggle theme"
        >
          {isDark ? <Sun size={13} /> : <Moon size={13} />}
        </button>

        {/* Stage Manager Toggle Icon */}
        <button
          onClick={() => setStageManagerOpen((prev) => !prev)}
          title="Toggle Stage Manager"
          className={`p-1 rounded transition-colors hidden sm:block cursor-pointer ${
            stageManagerOpen
              ? isDark
                ? "text-white bg-white/15"
                : "text-black bg-black/10 font-bold"
              : isDark
              ? "text-white/50 hover:bg-white/10"
              : "text-zinc-500 hover:bg-black/5"
          }`}
        >
          <LayoutTemplate size={13} />
        </button>

        <Wifi size={13} className={isDark ? "text-white/80" : "text-zinc-700"} />
        <Battery size={13} className={isDark ? "text-white/80" : "text-zinc-700"} />
        <Search size={13} className={`${isDark ? "text-white/80" : "text-zinc-700"} cursor-default`} />
        <span className="text-xs font-mono">
          {time
            ? time.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })
            : "00:00"}
        </span>
      </div>
    </header>
  );
}
