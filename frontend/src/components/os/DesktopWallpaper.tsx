"use client";

import React, { useState, useEffect } from "react";
import { useDesktop } from "@/context/DesktopContext";
import { FolderGit2, FileText, Terminal, BookOpen } from "lucide-react";

export default function DesktopWallpaper() {
  const { openWindow, theme } = useDesktop();
  const isDark = theme === "dark";

  // Optional subtle mouse glow tracking for interactive developer feel
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = Math.round((e.clientX / window.innerWidth) * 100);
      const y = Math.round((e.clientY / window.innerHeight) * 100);
      setMousePos({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
      {/* 1. LAYER 1: Base Background */}
      <div
        className={`absolute inset-0 transition-colors duration-300 ${
          isDark ? "bg-[#09090b]" : "bg-[#e5e5ea]"
        }`}
      />

      {/* 2. LAYER 2: Interactive Ambient Glow (Follows cursor smoothly) */}
      <div
        className="absolute inset-0 transition-opacity duration-500 pointer-events-none"
        style={{
          background: isDark
            ? `radial-gradient(650px circle at ${mousePos.x}% ${mousePos.y}%, rgba(255, 255, 255, 0.05), transparent 75%)`
            : `radial-gradient(650px circle at ${mousePos.x}% ${mousePos.y}%, rgba(255, 255, 255, 0.45), transparent 70%)`,
        }}
      />

      {/* Center Static Subtle Lighting Bloom */}
      <div
        className={`absolute inset-0 transition-opacity duration-700 pointer-events-none ${
          isDark
            ? "bg-[radial-gradient(ellipse_at_50%_40%,rgba(255,255,255,0.035)_0%,transparent_65%)]"
            : "bg-[radial-gradient(ellipse_at_50%_40%,rgba(255,255,255,0.35)_0%,transparent_65%)]"
        }`}
      />

      {/* 3. LAYER 3: Developer Dot-Grid Pattern with Crisp Contrast in Both Modes */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: isDark
            ? "radial-gradient(circle, rgba(255, 255, 255, 0.16) 1.2px, transparent 1.2px)"
            : "radial-gradient(circle, rgba(0, 0, 0, 0.22) 1.2px, transparent 1.2px)",
          backgroundSize: "28px 28px",
          backgroundPosition: "center center",
          maskImage:
            "radial-gradient(ellipse 90% 85% at 50% 50%, black 50%, rgba(0, 0, 0, 0.6) 80%, transparent 100%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 90% 85% at 50% 50%, black 50%, rgba(0, 0, 0, 0.6) 80%, transparent 100%)",
        }}
      />

      {/* 4. LAYER 4: Tech Alignment Crosshair Markers (Linear / Vercel style) */}
      <div
        className={`absolute inset-0 pointer-events-none transition-opacity duration-300 ${
          isDark ? "text-white/20" : "text-black/30"
        }`}
      >
        {/* Top-Left Crosshair */}
        <div className="absolute top-[22%] left-[16%] font-mono text-[11px] leading-none select-none font-bold">
          +
        </div>
        {/* Top-Right Crosshair */}
        <div className="absolute top-[22%] right-[16%] font-mono text-[11px] leading-none select-none font-bold">
          +
        </div>
        {/* Bottom-Left Crosshair */}
        <div className="absolute bottom-[24%] left-[16%] font-mono text-[11px] leading-none select-none font-bold">
          +
        </div>
        {/* Bottom-Right Crosshair */}
        <div className="absolute bottom-[24%] right-[16%] font-mono text-[11px] leading-none select-none font-bold">
          +
        </div>

        {/* Center Grid Frame Coordinate Badge */}
        <div className={`absolute bottom-7 left-1/2 -translate-x-1/2 text-[9px] font-mono tracking-widest uppercase font-medium ${
          isDark ? "text-white/35" : "text-black/45"
        }`}>
          SURABAYA, ID • 7.2575° S, 112.7521° E
        </div>
      </div>

      {/* 5. LAYER 5: Classic macOS Desktop Icons (Top-Right) */}
      <div className="absolute top-12 right-4 sm:right-6 hidden sm:flex flex-col items-center gap-3 pointer-events-auto">
        <button
          onClick={() => openWindow("projects")}
          className={`group flex flex-col items-center gap-1 p-2 rounded-xl transition-colors cursor-pointer w-20 text-center ${
            isDark ? "hover:bg-white/10" : "hover:bg-black/5"
          }`}
        >
          <div
            className={`w-11 h-11 rounded-xl shadow-md flex items-center justify-center border group-hover:scale-105 transition-transform ${
              isDark
                ? "bg-gradient-to-b from-zinc-700 to-zinc-800 border-white/20"
                : "bg-gradient-to-b from-white to-zinc-200 border-black/10"
            }`}
          >
            <FolderGit2
              size={20}
              className={isDark ? "text-zinc-200" : "text-zinc-800"}
            />
          </div>
          <span
            className={`text-[11px] font-medium tracking-tight truncate max-w-[76px] ${
              isDark ? "text-zinc-300" : "text-zinc-800"
            }`}
          >
            Projects
          </span>
        </button>

        <button
          onClick={() => openWindow("writing")}
          className={`group flex flex-col items-center gap-1 p-2 rounded-xl transition-colors cursor-pointer w-20 text-center ${
            isDark ? "hover:bg-white/10" : "hover:bg-black/5"
          }`}
        >
          <div
            className={`w-11 h-11 rounded-xl shadow-md flex items-center justify-center border group-hover:scale-105 transition-transform ${
              isDark
                ? "bg-gradient-to-b from-zinc-700 to-zinc-800 border-white/20"
                : "bg-gradient-to-b from-white to-zinc-200 border-black/10"
            }`}
          >
            <BookOpen
              size={20}
              className={isDark ? "text-zinc-200" : "text-zinc-800"}
            />
          </div>
          <span
            className={`text-[11px] font-medium tracking-tight truncate max-w-[76px] ${
              isDark ? "text-zinc-300" : "text-zinc-800"
            }`}
          >
            Writing
          </span>
        </button>

        <a
          href="/dimas_fiebry_cv.txt"
          download="Dimas_Fiebry_CV.txt"
          className={`group flex flex-col items-center gap-1 p-2 rounded-xl transition-colors cursor-pointer w-20 text-center ${
            isDark ? "hover:bg-white/10" : "hover:bg-black/5"
          }`}
        >
          <div
            className={`w-11 h-11 rounded-xl shadow-md flex items-center justify-center border group-hover:scale-105 transition-transform ${
              isDark
                ? "bg-gradient-to-b from-zinc-700 to-zinc-800 border-white/20"
                : "bg-gradient-to-b from-white to-zinc-200 border-black/10"
            }`}
          >
            <FileText
              size={20}
              className={isDark ? "text-zinc-200" : "text-zinc-800"}
            />
          </div>
          <span
            className={`text-[11px] font-medium tracking-tight truncate max-w-[76px] ${
              isDark ? "text-zinc-300" : "text-zinc-800"
            }`}
          >
            Resume.txt
          </span>
        </a>

        <button
          onClick={() => openWindow("contact")}
          className={`group flex flex-col items-center gap-1 p-2 rounded-xl transition-colors cursor-pointer w-20 text-center ${
            isDark ? "hover:bg-white/10" : "hover:bg-black/5"
          }`}
        >
          <div
            className={`w-11 h-11 rounded-xl shadow-md flex items-center justify-center border group-hover:scale-105 transition-transform ${
              isDark
                ? "bg-gradient-to-b from-zinc-700 to-zinc-800 border-white/20"
                : "bg-gradient-to-b from-white to-zinc-200 border-black/10"
            }`}
          >
            <Terminal
              size={20}
              className={isDark ? "text-zinc-200" : "text-zinc-800"}
            />
          </div>
          <span
            className={`text-[11px] font-medium tracking-tight truncate max-w-[76px] ${
              isDark ? "text-zinc-300" : "text-zinc-800"
            }`}
          >
            Terminal
          </span>
        </button>
      </div>
    </div>
  );
}
