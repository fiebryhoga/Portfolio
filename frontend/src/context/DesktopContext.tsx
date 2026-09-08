"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

export type AppMeta = {
  id: string;
  title: string;
  subtitle: string;
  badgeColor: string;
  iconName: string;
};

export const STAGE_APPS: AppMeta[] = [
  { id: "about", title: "About Me", subtitle: "Dimas Fiebry", badgeColor: "bg-zinc-800", iconName: "User" },
  { id: "projects", title: "Projects", subtitle: "Featured Works", badgeColor: "bg-zinc-800", iconName: "FolderGit2" },
  { id: "experience", title: "Experience", subtitle: "Career Journey", badgeColor: "bg-zinc-800", iconName: "FileText" },
  { id: "skills", title: "Skills", subtitle: "Tech Arsenal", badgeColor: "bg-zinc-800", iconName: "Settings" },
  { id: "writing", title: "Writing", subtitle: "Articles & Notes", badgeColor: "bg-zinc-800", iconName: "BookOpen" },
  { id: "contact", title: "Terminal", subtitle: "bash - 80x24", badgeColor: "bg-zinc-800", iconName: "Terminal" },
];

type DesktopContextType = {
  openAppIds: string[];
  activeAppId: string | null;
  setActiveAppId: (id: string | null) => void;
  openWindow: (id: string, title?: string) => void;
  closeWindow: (id?: string) => void;
  closeApp: (id: string) => void;
  minimizeWindow: (id?: string) => void;
  maximizeWindow: () => void;
  isMaximized: boolean;
  setIsMaximized: (val: boolean | ((prev: boolean) => boolean)) => void;
  stageManagerOpen: boolean;
  setStageManagerOpen: (val: boolean | ((prev: boolean) => boolean)) => void;
  theme: "dark" | "light";
  toggleTheme: () => void;
  setTheme: (theme: "dark" | "light") => void;
  spotlightOpen: boolean;
  setSpotlightOpen: (val: boolean | ((prev: boolean) => boolean)) => void;
  adminPortalOpen: boolean;
  setAdminPortalOpen: (val: boolean | ((prev: boolean) => boolean)) => void;
  windows: { id: string; title: string; isOpen: boolean; isMinimized: boolean; isMaximized: boolean; zIndex: number }[];
};

const DesktopContext = createContext<DesktopContextType | undefined>(undefined);

export function DesktopProvider({ children }: { children: ReactNode }) {
  // Theme state: dark by default, synced with localStorage and html class
  const [theme, setThemeState] = useState<"dark" | "light">("dark");
  const [spotlightOpen, setSpotlightOpen] = useState<boolean>(false);
  const [adminPortalOpen, setAdminPortalOpen] = useState<boolean>(false);

  // Global keyboard shortcut for Spotlight Search (Cmd+K) & Admin Portal (Cmd+Shift+A)
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd + Shift + A or Ctrl + Shift + A => Toggle Admin Portal
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key.toLowerCase() === "a") {
        e.preventDefault();
        setAdminPortalOpen((prev) => !prev);
        return;
      }
      // Cmd + K or Ctrl + K => Toggle Spotlight
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSpotlightOpen((prev) => !prev);
        return;
      }
      if (e.key === "Escape") {
        setSpotlightOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  React.useEffect(() => {
    try {
      const savedTheme = localStorage.getItem("portfolio_theme") as "dark" | "light" | null;
      if (savedTheme === "dark" || savedTheme === "light") {
        setThemeState(savedTheme);
        if (savedTheme === "dark") {
          document.documentElement.classList.add("dark");
          document.documentElement.classList.remove("light");
        } else {
          document.documentElement.classList.remove("dark");
          document.documentElement.classList.add("light");
        }
      } else {
        document.documentElement.classList.add("dark");
        document.documentElement.classList.remove("light");
      }
    } catch {
      // ignore SSR or storage errors
    }
  }, []);

  const setTheme = (newTheme: "dark" | "light") => {
    setThemeState(newTheme);
    try {
      localStorage.setItem("portfolio_theme", newTheme);
      if (newTheme === "dark") {
        document.documentElement.classList.add("dark");
        document.documentElement.classList.remove("light");
      } else {
        document.documentElement.classList.remove("dark");
        document.documentElement.classList.add("light");
      }
    } catch {
      // ignore
    }
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  // All 5 apps are open initially in Stage Manager
  const [openAppIds, setOpenAppIds] = useState<string[]>([
    "about",
    "projects",
    "experience",
    "skills",
    "contact",
  ]);
  const [activeAppId, setActiveAppIdState] = useState<string | null>("projects");
  const [isMaximized, setIsMaximized] = useState<boolean>(false);
  const [stageManagerOpen, setStageManagerOpen] = useState<boolean>(true);

  const setActiveAppId = (id: string | null) => {
    if (id && !openAppIds.includes(id)) {
      setOpenAppIds((prev) => [...prev, id]);
    }
    setActiveAppIdState(id);
  };

  const openWindow = (id: string, _title?: string) => {
    setOpenAppIds((prev) => {
      if (!prev.includes(id)) {
        return [...prev, id];
      }
      return prev;
    });
    setActiveAppIdState(id);
    setIsMaximized(false);
  };

  // Close ONLY the specified app (or current active app)
  const closeApp = (idToClose: string) => {
    setOpenAppIds((prev) => {
      const nextOpen = prev.filter((appId) => appId !== idToClose);

      // If the app being closed is currently active on Center Stage:
      if (activeAppId === idToClose) {
        if (nextOpen.length > 0) {
          // Promote the next remaining app to Center Stage
          setActiveAppIdState(nextOpen[0]);
        } else {
          // If no open apps remain, clear Center Stage
          setActiveAppIdState(null);
        }
      }
      return nextOpen;
    });
  };

  const closeWindow = (id?: string) => {
    const targetId = id || activeAppId;
    if (targetId) {
      closeApp(targetId);
    }
  };

  const minimizeWindow = (id?: string) => {
    closeWindow(id);
  };

  const maximizeWindow = () => {
    setIsMaximized((prev) => !prev);
  };

  const windows = STAGE_APPS.map((a) => ({
    id: a.id,
    title: a.title,
    isOpen: openAppIds.includes(a.id),
    isMinimized: !openAppIds.includes(a.id),
    isMaximized: a.id === activeAppId ? isMaximized : false,
    zIndex: a.id === activeAppId ? 20 : 1,
  }));

  return (
    <DesktopContext.Provider
      value={{
        openAppIds,
        activeAppId,
        setActiveAppId,
        openWindow,
        closeWindow,
        closeApp,
        minimizeWindow,
        maximizeWindow,
        isMaximized,
        setIsMaximized,
        stageManagerOpen,
        setStageManagerOpen,
        theme,
        toggleTheme,
        setTheme,
        spotlightOpen,
        setSpotlightOpen,
        adminPortalOpen,
        setAdminPortalOpen,
        windows,
      }}
    >
      {children}
    </DesktopContext.Provider>
  );
}

export function useDesktop() {
  const context = useContext(DesktopContext);
  if (!context) {
    throw new Error("useDesktop must be used within a DesktopProvider");
  }
  return context;
}
