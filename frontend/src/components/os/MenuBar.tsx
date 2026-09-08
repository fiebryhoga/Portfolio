"use client";

import { useState, useEffect } from "react";
import { Search, LayoutTemplate, Sun, Moon, FileDown } from "lucide-react";
import { useDesktop, STAGE_APPS } from "@/context/DesktopContext";

export default function MenuBar() {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [time, setTime] = useState<Date | null>(null);

  const {
    openAppIds,
    activeAppId,
    openWindow,
    closeWindow,
    closeApp,
    maximizeWindow,
    isMaximized,
    stageManagerOpen,
    setStageManagerOpen,
    theme,
    toggleTheme,
    setTheme,
    setSpotlightOpen,
    setAdminPortalOpen,
  } = useDesktop();

  useEffect(() => {
    setTime(new Date());
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Close menus when clicking outside
  useEffect(() => {
    const handlePointerDown = (e: PointerEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest("[data-menu-root]")) {
        setActiveMenu(null);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActiveMenu(null);
      }
    };
    window.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 2200);
  };

  const copyToClipboard = (text: string, label: string) => {
    try {
      navigator.clipboard.writeText(text);
      showToast(`${label} copied to clipboard!`);
    } catch {
      showToast(`Failed to copy ${label}`);
    }
  };

  const downloadCV = () => {
    const link = document.createElement("a");
    link.href = "/dimas_fiebry_cv.txt";
    link.download = "Dimas_Fiebry_CV.txt";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("CV download initiated!");
  };

  const activeApp = STAGE_APPS.find((a) => a.id === activeAppId);
  const activeAppName = activeApp ? activeApp.title : "Dimas.dev";
  const isDark = theme === "dark";

  const toggleMenu = (menuName: string) => {
    setActiveMenu((prev) => (prev === menuName ? null : menuName));
  };

  const handleMenuHover = (menuName: string) => {
    if (activeMenu !== null) {
      setActiveMenu(menuName);
    }
  };

  const closeMenus = () => setActiveMenu(null);

  const menuDropdownBaseClass = `absolute top-9 left-0 min-w-[220px] rounded-xl backdrop-blur-2xl border shadow-2xl p-1 z-50 transition-all ${
    isDark
      ? "bg-[#14161f]/95 border-white/15 text-zinc-200 shadow-black/90"
      : "bg-white/95 border-black/10 text-zinc-800 shadow-black/20"
  }`;

  const menuItemClass = `w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs transition-colors cursor-pointer select-none ${
    isDark
      ? "hover:bg-white/15 hover:text-white"
      : "hover:bg-black/10 hover:text-black font-medium"
  }`;

  const separatorClass = `my-1 border-t ${isDark ? "border-white/10" : "border-black/10"}`;

  return (
    <>
      <header
        className={`h-9 w-full backdrop-blur-xl text-sm flex items-center justify-between px-4 sm:px-6 fixed top-0 left-0 z-50 select-none transition-colors duration-200 border-b ${
          isDark
            ? "bg-black/50 text-white/90 border-white/10"
            : "bg-white/80 text-zinc-900 border-black/10 shadow-xs"
        }`}
      >
        {/* Left Side: Apple Logo & Interactive Menus */}
        <div data-menu-root className="flex items-center space-x-2 sm:space-x-3">
          {/* Apple Logo Menu */}
          <div className="relative">
            <button
              onClick={() => toggleMenu("apple")}
              onMouseEnter={() => handleMenuHover("apple")}
              className={`px-2 py-1 rounded-md font-bold text-base cursor-pointer transition-colors ${
                activeMenu === "apple"
                  ? isDark
                    ? "bg-white/20 text-white"
                    : "bg-black/15 text-black"
                  : isDark
                  ? "hover:bg-white/10 text-white"
                  : "hover:bg-black/5 text-zinc-900"
              }`}
            >
              
            </button>

            {activeMenu === "apple" && (
              <div className={menuDropdownBaseClass}>
                <button
                  onClick={() => {
                    openWindow("about");
                    closeMenus();
                  }}
                  className={menuItemClass}
                >
                  <span>About Dimas Fiebry</span>
                </button>
                <button
                  onClick={() => {
                    openWindow("skills");
                    closeMenus();
                  }}
                  className={menuItemClass}
                >
                  <span>System Preferences / Tech Stack</span>
                </button>
                <button
                  onClick={() => {
                    setAdminPortalOpen(true);
                    closeMenus();
                  }}
                  className={menuItemClass}
                >
                  <span className="font-semibold">Admin Portal & Content Manager...</span>
                  <span className="opacity-60 font-mono text-[10px]">⌘⇧A</span>
                </button>
                <div className={separatorClass} />
                <a
                  href="https://github.com/fiebryhoga"
                  target="_blank"
                  rel="noreferrer"
                  onClick={closeMenus}
                  className={menuItemClass}
                >
                  <span>GitHub Profile</span>
                  <span className="opacity-50">↗</span>
                </a>
                <a
                  href="https://linkedin.com/in/dimas-fiebry-prayhoga-putra/"
                  target="_blank"
                  rel="noreferrer"
                  onClick={closeMenus}
                  className={menuItemClass}
                >
                  <span>LinkedIn Profile</span>
                  <span className="opacity-50">↗</span>
                </a>
                <div className={separatorClass} />
                <button
                  onClick={() => {
                    downloadCV();
                    closeMenus();
                  }}
                  className={menuItemClass}
                >
                  <span>Download CV / Resume</span>
                  <span className="opacity-50 font-mono text-[10px]">⌘D</span>
                </button>
                <div className={separatorClass} />
                <button
                  onClick={() => {
                    STAGE_APPS.forEach((app) => closeApp(app.id));
                    closeMenus();
                  }}
                  className={menuItemClass}
                >
                  <span>Close All Windows</span>
                </button>
              </div>
            )}
          </div>

          {/* Active App Title */}
          <div className="font-bold text-xs tracking-wide mr-1.5">{activeAppName}</div>

          {/* File Menu */}
          <div className="relative hidden md:block">
            <button
              onClick={() => toggleMenu("file")}
              onMouseEnter={() => handleMenuHover("file")}
              className={`px-2 py-1 rounded-md text-xs transition-colors cursor-pointer ${
                activeMenu === "file"
                  ? isDark
                    ? "bg-white/20 text-white"
                    : "bg-black/15 text-black"
                  : isDark
                  ? "hover:bg-white/10 text-white/80"
                  : "hover:bg-black/5 text-zinc-700"
              }`}
            >
              File
            </button>
            {activeMenu === "file" && (
              <div className={menuDropdownBaseClass}>
                <button
                  onClick={() => {
                    setSpotlightOpen(true);
                    closeMenus();
                  }}
                  className={menuItemClass}
                >
                  <span>Spotlight Search...</span>
                  <span className="opacity-50 font-mono text-[10px]">⌘K</span>
                </button>
                <button
                  onClick={() => {
                    downloadCV();
                    closeMenus();
                  }}
                  className={menuItemClass}
                >
                  <span>Download Resume / CV</span>
                  <span className="opacity-50 font-mono text-[10px]">⌘D</span>
                </button>
                <div className={separatorClass} />
                <button
                  onClick={() => {
                    if (activeAppId) closeWindow(activeAppId);
                    closeMenus();
                  }}
                  className={menuItemClass}
                >
                  <span>Close Window</span>
                  <span className="opacity-50 font-mono text-[10px]">⌘W</span>
                </button>
                <button
                  onClick={() => {
                    STAGE_APPS.forEach((app) => closeApp(app.id));
                    closeMenus();
                  }}
                  className={menuItemClass}
                >
                  <span>Close All</span>
                </button>
              </div>
            )}
          </div>

          {/* Edit Menu */}
          <div className="relative hidden md:block">
            <button
              onClick={() => toggleMenu("edit")}
              onMouseEnter={() => handleMenuHover("edit")}
              className={`px-2 py-1 rounded-md text-xs transition-colors cursor-pointer ${
                activeMenu === "edit"
                  ? isDark
                    ? "bg-white/20 text-white"
                    : "bg-black/15 text-black"
                  : isDark
                  ? "hover:bg-white/10 text-white/80"
                  : "hover:bg-black/5 text-zinc-700"
              }`}
            >
              Edit
            </button>
            {activeMenu === "edit" && (
              <div className={menuDropdownBaseClass}>
                <button
                  onClick={() => {
                    copyToClipboard("dimasfiebry@gmail.com", "Email");
                    closeMenus();
                  }}
                  className={menuItemClass}
                >
                  <span>Copy Email</span>
                  <span className="opacity-50 text-[10px]">dimasfiebry@gmail.com</span>
                </button>
                <button
                  onClick={() => {
                    copyToClipboard("+6285730979537", "Phone");
                    closeMenus();
                  }}
                  className={menuItemClass}
                >
                  <span>Copy Phone / WhatsApp</span>
                  <span className="opacity-50 text-[10px]">+6285730979537</span>
                </button>
                <button
                  onClick={() => {
                    copyToClipboard(window.location.href, "Portfolio Link");
                    closeMenus();
                  }}
                  className={menuItemClass}
                >
                  <span>Copy Portfolio URL</span>
                </button>
              </div>
            )}
          </div>

          {/* View Menu */}
          <div className="relative hidden md:block">
            <button
              onClick={() => toggleMenu("view")}
              onMouseEnter={() => handleMenuHover("view")}
              className={`px-2 py-1 rounded-md text-xs transition-colors cursor-pointer ${
                activeMenu === "view"
                  ? isDark
                    ? "bg-white/20 text-white"
                    : "bg-black/15 text-black"
                  : isDark
                  ? "hover:bg-white/10 text-white/80"
                  : "hover:bg-black/5 text-zinc-700"
              }`}
            >
              View
            </button>
            {activeMenu === "view" && (
              <div className={menuDropdownBaseClass}>
                <button
                  onClick={() => {
                    setTheme("dark");
                    closeMenus();
                  }}
                  className={menuItemClass}
                >
                  <span className="flex items-center gap-2">
                    {theme === "dark" ? <span>✓</span> : <span className="w-2.5" />}
                    Dark Mode (Obsidian)
                  </span>
                  <span className="opacity-50 text-[10px]">🌙</span>
                </button>
                <button
                  onClick={() => {
                    setTheme("light");
                    closeMenus();
                  }}
                  className={menuItemClass}
                >
                  <span className="flex items-center gap-2">
                    {theme === "light" ? <span>✓</span> : <span className="w-2.5" />}
                    Light Mode (Silver)
                  </span>
                  <span className="opacity-50 text-[10px]">☀️</span>
                </button>
                <div className={separatorClass} />
                <button
                  onClick={() => {
                    setStageManagerOpen((prev: boolean) => !prev);
                    closeMenus();
                  }}
                  className={menuItemClass}
                >
                  <span className="flex items-center gap-2">
                    {stageManagerOpen ? <span>✓</span> : <span className="w-2.5" />}
                    Stage Manager Rail
                  </span>
                </button>
                <button
                  onClick={() => {
                    maximizeWindow();
                    closeMenus();
                  }}
                  className={menuItemClass}
                >
                  <span>{isMaximized ? "Restore Window Size" : "Maximize Window"}</span>
                </button>
              </div>
            )}
          </div>

          {/* Window Menu */}
          <div className="relative hidden md:block">
            <button
              onClick={() => toggleMenu("window")}
              onMouseEnter={() => handleMenuHover("window")}
              className={`px-2 py-1 rounded-md text-xs transition-colors cursor-pointer ${
                activeMenu === "window"
                  ? isDark
                    ? "bg-white/20 text-white"
                    : "bg-black/15 text-black"
                  : isDark
                  ? "hover:bg-white/10 text-white/80"
                  : "hover:bg-black/5 text-zinc-700"
              }`}
            >
              Window
            </button>
            {activeMenu === "window" && (
              <div className={menuDropdownBaseClass}>
                <button
                  onClick={() => {
                    if (activeAppId) closeWindow(activeAppId);
                    closeMenus();
                  }}
                  className={menuItemClass}
                >
                  <span>Minimize Window</span>
                  <span className="opacity-50 font-mono text-[10px]">⌘M</span>
                </button>
                <button
                  onClick={() => {
                    maximizeWindow();
                    closeMenus();
                  }}
                  className={menuItemClass}
                >
                  <span>Zoom / Maximize</span>
                </button>
                <div className={separatorClass} />
                <div className="px-3 py-1 text-[10px] font-semibold opacity-40 uppercase tracking-wider">
                  Open Windows
                </div>
                {STAGE_APPS.map((app) => {
                  const isOpen = openAppIds.includes(app.id);
                  const isActive = app.id === activeAppId;
                  return (
                    <button
                      key={app.id}
                      onClick={() => {
                        openWindow(app.id);
                        closeMenus();
                      }}
                      className={menuItemClass}
                    >
                      <span className="flex items-center gap-2">
                        {isActive ? <span>✓</span> : <span className="w-2.5" />}
                        {app.title}
                      </span>
                      <span className="opacity-40 text-[10px]">{isOpen ? "Running" : ""}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Help Menu */}
          <div className="relative hidden md:block">
            <button
              onClick={() => toggleMenu("help")}
              onMouseEnter={() => handleMenuHover("help")}
              className={`px-2 py-1 rounded-md text-xs transition-colors cursor-pointer ${
                activeMenu === "help"
                  ? isDark
                    ? "bg-white/20 text-white"
                    : "bg-black/15 text-black"
                  : isDark
                  ? "hover:bg-white/10 text-white/80"
                  : "hover:bg-black/5 text-zinc-700"
              }`}
            >
              Help
            </button>
            {activeMenu === "help" && (
              <div className={menuDropdownBaseClass}>
                <button
                  onClick={() => {
                    setSpotlightOpen(true);
                    closeMenus();
                  }}
                  className={menuItemClass}
                >
                  <span>Keyboard Shortcuts</span>
                  <span className="opacity-50 font-mono text-[10px]">⌘K</span>
                </button>
                <button
                  onClick={() => {
                    openWindow("contact");
                    closeMenus();
                  }}
                  className={menuItemClass}
                >
                  <span>Contact Developer</span>
                </button>
                <div className={separatorClass} />
                <a
                  href="https://github.com/fiebryhoga"
                  target="_blank"
                  rel="noreferrer"
                  onClick={closeMenus}
                  className={menuItemClass}
                >
                  <span>GitHub Repository</span>
                  <span className="opacity-50">↗</span>
                </a>
              </div>
            )}
          </div>
        </div>

      <div className="flex items-center space-x-2.5 sm:space-x-3.5">
        {/* Spotlight Search (⌘K) — Elongated macOS Capsule */}
        <button
          onClick={() => setSpotlightOpen(true)}
          title="Spotlight Search (⌘K)"
          className={`flex items-center justify-between w-32 sm:w-44 px-2.5 py-1 rounded-md text-xs transition-all cursor-pointer border ${
            isDark
              ? "bg-white/[0.04] border-white/10 hover:bg-white/10 text-zinc-300 hover:text-white"
              : "bg-black/[0.03] border-black/10 hover:bg-black/[0.07] text-zinc-700 hover:text-black"
          }`}
        >
          <div className="flex items-center gap-2">
            <Search size={13} className="opacity-70" />
            <span className="text-xs">Search...</span>
          </div>
          <kbd
            className={`text-[9px] font-mono px-1.5 py-0.5 rounded border ${
              isDark
                ? "bg-white/10 border-white/15 text-zinc-300"
                : "bg-black/5 border-black/10 text-zinc-600"
            }`}
          >
            ⌘K
          </kbd>
        </button>

        {/* Download CV Button (Clean macOS style, no bg badge) */}
        <a
          href="/dimas_fiebry_cv.txt"
          download="Dimas_Fiebry_CV.txt"
          title="Download Professional CV / Resume"
          className={`flex items-center gap-1.5 px-2 py-1 rounded-md text-xs transition-colors cursor-pointer ${
            isDark
              ? "text-zinc-300 hover:text-white hover:bg-white/10"
              : "text-zinc-700 hover:text-black hover:bg-black/10"
          }`}
        >
          <FileDown size={13} />
          <span className="text-xs">Resume</span>
        </a>

        {/* Dark / Light Mode Toggle Button */}
        <button
          onClick={toggleTheme}
          title={`Switch to ${isDark ? "Light" : "Dark"} Mode`}
          className={`p-1.5 rounded-md transition-all cursor-pointer ${
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
          className={`p-1.5 rounded-md transition-colors hidden sm:block cursor-pointer ${
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

        {/* Local Clock */}
        <span className={`text-xs font-mono pl-1 font-medium ${isDark ? "text-zinc-300" : "text-zinc-700"}`}>
          {time
            ? time.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })
            : "00:00"}
        </span>
      </div>
    </header>

    {/* Toast notification */}
    {toast && (
      <div className="fixed top-12 left-1/2 -translate-x-1/2 z-[60] px-4 py-1.5 rounded-full shadow-2xl border text-xs font-medium backdrop-blur-xl animate-in fade-in slide-in-from-top-2 duration-200 transition-all flex items-center gap-2 select-none pointer-events-none bg-black/85 text-white border-white/20">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        {toast}
      </div>
    )}
    </>
  );
}
