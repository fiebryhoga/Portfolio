"use client";

import { ReactNode, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useDesktop } from "@/context/DesktopContext";

type WindowFrameProps = {
  id: string;
  title: string;
  children: ReactNode;
};

type ResizeDirection = "n" | "s" | "e" | "w" | "ne" | "nw" | "se" | "sw";

export default function WindowFrame({ id, title, children }: WindowFrameProps) {
  const {
    isMaximized,
    setIsMaximized,
    stageManagerOpen,
    closeWindow,
    minimizeWindow,
    theme,
  } = useDesktop();

  const isDark = theme === "dark";

  const [position, setPosition] = useState({ x: 180, y: 44 });
  const [size, setSize] = useState({ width: 960, height: 640 });
  const [isResizing, setIsResizing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isHoveringControls, setIsHoveringControls] = useState(false);
  const [hasCustomPosition, setHasCustomPosition] = useState(false);

  // Auto-center in Stage Manager mode on mount or window resize
  useEffect(() => {
    if (typeof window !== "undefined" && !hasCustomPosition) {
      const screenW = window.innerWidth;
      const screenH = window.innerHeight;

      // On screens with Stage Manager rail (> 768px), leave room on the left
      const isDesktopScreen = screenW >= 768 && stageManagerOpen;
      const leftOffset = isDesktopScreen ? 160 : 16;
      const availableW = screenW - leftOffset - 24;
      const availableH = screenH - 44 - 96;

      const targetW = Math.min(1080, Math.max(500, availableW));
      const targetH = Math.min(760, Math.max(400, availableH));

      const posX = leftOffset + Math.max(0, Math.floor((availableW - targetW) / 2));
      const posY = 40 + Math.max(0, Math.floor((availableH - targetH) / 2));

      setSize({ width: targetW, height: targetH });
      setPosition({ x: posX, y: posY });
    }
  }, [hasCustomPosition, stageManagerOpen]);

  // Drag Titlebar
  const handleTitlePointerDown = (e: React.PointerEvent) => {
    if (isMaximized) return;
    if ((e.target as HTMLElement).closest("button")) return;

    e.preventDefault();
    setIsDragging(true);
    setHasCustomPosition(true);

    const startX = e.clientX;
    const startY = e.clientY;
    const startPosX = position.x;
    const startPosY = position.y;

    const onPointerMove = (moveEvent: PointerEvent) => {
      const dx = moveEvent.clientX - startX;
      const dy = moveEvent.clientY - startY;

      setPosition({
        x: startPosX + dx,
        y: Math.max(28, startPosY + dy),
      });
    };

    const onPointerUp = () => {
      setIsDragging(false);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
    };

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
  };

  // Resize Borders & Corners
  const handleResizePointerDown = (e: React.PointerEvent, direction: ResizeDirection) => {
    if (isMaximized) return;
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
    setHasCustomPosition(true);

    const startX = e.clientX;
    const startY = e.clientY;
    const startW = size.width;
    const startH = size.height;
    const startPosX = position.x;
    const startPosY = position.y;

    const minW = 400;
    const minH = 280;

    const onPointerMove = (moveEvent: PointerEvent) => {
      const dx = moveEvent.clientX - startX;
      const dy = moveEvent.clientY - startY;

      let newWidth = startW;
      let newHeight = startH;
      let newX = startPosX;
      let newY = startPosY;

      if (direction.includes("e")) {
        newWidth = Math.max(minW, startW + dx);
      } else if (direction.includes("w")) {
        const calculatedWidth = startW - dx;
        if (calculatedWidth >= minW) {
          newWidth = calculatedWidth;
          newX = startPosX + dx;
        } else {
          newWidth = minW;
          newX = startPosX + (startW - minW);
        }
      }

      if (direction.includes("s")) {
        newHeight = Math.max(minH, startH + dy);
      } else if (direction.includes("n")) {
        const calculatedHeight = startH - dy;
        if (calculatedHeight >= minH) {
          newHeight = calculatedHeight;
          newY = Math.max(28, startPosY + dy);
        } else {
          newHeight = minH;
          newY = startPosY + (startH - minH);
        }
      }

      setSize({ width: newWidth, height: newHeight });
      setPosition({ x: newX, y: newY });
    };

    const onPointerUp = () => {
      setIsResizing(false);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
    };

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
  };

  return (
    <motion.div
      key={id}
      initial={{ opacity: 0, scale: 0.97, y: 8 }}
      animate={{
        opacity: 1,
        scale: 1,
        y: 0,
        left: isMaximized ? 0 : position.x,
        top: isMaximized ? 28 : position.y,
        width: isMaximized ? "100vw" : size.width,
        height: isMaximized ? "calc(100vh - 28px - 80px)" : size.height,
      }}
      exit={{ opacity: 0, scale: 0.97, y: -8 }}
      transition={
        isDragging || isResizing
          ? { duration: 0 }
          : { duration: 0.18, ease: [0.16, 1, 0.3, 1] }
      }
      style={{
        zIndex: 25,
        position: "absolute",
        willChange: isDragging || isResizing ? "left, top, width, height" : "opacity, transform",
      }}
      className={`backdrop-blur-xl border flex flex-col overflow-hidden select-none transform-gpu transition-colors duration-200 ${
        isMaximized ? "rounded-none" : "rounded-2xl"
      } ${
        isDark
          ? "bg-[#0d0e12]/92 border-white/15 text-zinc-100 shadow-2xl shadow-black/85"
          : "bg-[#fcfcfd]/95 border-black/10 text-zinc-900 shadow-2xl shadow-black/20"
      }`}
    >
      {/* Title Bar */}
      <div
        className={`h-11 border-b flex items-center px-4 cursor-grab active:cursor-grabbing shrink-0 relative select-none transition-colors duration-200 ${
          isDark ? "bg-white/[0.03] border-white/10" : "bg-black/[0.02] border-black/10"
        }`}
        onPointerDown={handleTitlePointerDown}
        onDoubleClick={() => setIsMaximized((prev) => !prev)}
      >
        {/* macOS Traffic Lights */}
        <div
          className="flex items-center space-x-2 mr-4 z-10"
          onMouseEnter={() => setIsHoveringControls(true)}
          onMouseLeave={() => setIsHoveringControls(false)}
        >
          {/* Close Window (Red Button) */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              closeWindow();
            }}
            title="Close Window"
            className="w-3.5 h-3.5 rounded-full bg-[#ff5f56] hover:bg-[#ff4338] border border-[#e0443e] flex items-center justify-center text-[9px] font-bold text-black/70 focus:outline-none transition-all active:scale-90"
          >
            {isHoveringControls && <span>✕</span>}
          </button>

          {/* Minimize Window (Yellow Button) */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              minimizeWindow();
            }}
            title="Minimize to Dock"
            className="w-3.5 h-3.5 rounded-full bg-[#ffbd2e] hover:bg-[#ffaa1d] border border-[#dea123] flex items-center justify-center text-[9px] font-bold text-black/70 focus:outline-none transition-all active:scale-90"
          >
            {isHoveringControls && <span>−</span>}
          </button>

          {/* Maximize / Zoom (Green Button) */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsMaximized((prev) => !prev);
            }}
            title={isMaximized ? "Restore Window" : "Zoom / Maximize"}
            className="w-3.5 h-3.5 rounded-full bg-[#27c93f] hover:bg-[#1db833] border border-[#1aab29] flex items-center justify-center text-[8px] font-bold text-black/70 focus:outline-none transition-all active:scale-90"
          >
            {isHoveringControls && <span>{isMaximized ? "⤡" : "⤢"}</span>}
          </button>
        </div>

        {/* Window Title */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className={`text-xs font-semibold tracking-wide ${isDark ? "text-zinc-200" : "text-zinc-800"}`}>
            {title}
          </span>
        </div>
      </div>

      {/* Content Area with custom smooth scrollbar */}
      <div className={`flex-1 overflow-y-auto overflow-x-hidden p-2 sm:p-4 custom-window-scrollbar select-text ${isDark ? "text-zinc-100" : "text-zinc-900"}`}>
        {children}
      </div>

      {/* 8-Directional macOS Resize Borders & Corners */}
      {!isMaximized && (
        <>
          <div
            onPointerDown={(e) => handleResizePointerDown(e, "n")}
            className="absolute top-0 left-3 right-3 h-2 cursor-ns-resize z-20"
          />
          <div
            onPointerDown={(e) => handleResizePointerDown(e, "s")}
            className="absolute bottom-0 left-3 right-3 h-2 cursor-ns-resize z-20"
          />
          <div
            onPointerDown={(e) => handleResizePointerDown(e, "w")}
            className="absolute left-0 top-3 bottom-3 w-2 cursor-ew-resize z-20"
          />
          <div
            onPointerDown={(e) => handleResizePointerDown(e, "e")}
            className="absolute right-0 top-3 bottom-3 w-2 cursor-ew-resize z-20"
          />
          <div
            onPointerDown={(e) => handleResizePointerDown(e, "nw")}
            className="absolute top-0 left-0 w-3 h-3 cursor-nwse-resize z-20"
          />
          <div
            onPointerDown={(e) => handleResizePointerDown(e, "ne")}
            className="absolute top-0 right-0 w-3 h-3 cursor-nesw-resize z-20"
          />
          <div
            onPointerDown={(e) => handleResizePointerDown(e, "sw")}
            className="absolute bottom-0 left-0 w-3 h-3 cursor-nesw-resize z-20"
          />
          <div
            onPointerDown={(e) => handleResizePointerDown(e, "se")}
            className="absolute bottom-0 right-0 w-4 h-4 cursor-nwse-resize z-20 flex items-center justify-center group"
          >
            <svg
              className={`w-2.5 h-2.5 transition-colors pointer-events-none ${
                isDark ? "text-white/30 group-hover:text-white/70" : "text-black/30 group-hover:text-black/70"
              }`}
              viewBox="0 0 10 10"
              fill="currentColor"
            >
              <circle cx="8" cy="8" r="1" />
              <circle cx="5" cy="8" r="1" />
              <circle cx="8" cy="5" r="1" />
              <circle cx="2" cy="8" r="1" />
              <circle cx="5" cy="5" r="1" />
              <circle cx="8" cy="2" r="1" />
            </svg>
          </div>
        </>
      )}
    </motion.div>
  );
}
