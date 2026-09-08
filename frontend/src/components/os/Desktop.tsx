"use client";

import React from "react";
import { useDesktop, STAGE_APPS } from "@/context/DesktopContext";
import { AnimatePresence } from "framer-motion";
import MenuBar from "./MenuBar";
import Dock from "./Dock";
import StageManagerRail from "./StageManagerRail";
import WindowFrame from "./WindowFrame";
import SpotlightSearch from "./SpotlightSearch";
import DesktopWallpaper from "./DesktopWallpaper";

// Apps Content
import { Hero } from "@/components/Hero";
import { Projects } from "@/components/Projects";
import { Experience } from "@/components/Experience";
import { Skills } from "@/components/Skills";
import { Articles } from "@/components/Articles";
import { Contact } from "@/components/Contact";
import AdminPortal from "@/components/AdminPortal";

import { Profile, Project, Skill, Experience as ExperienceType, Article } from "@/types";

type DesktopProps = {
  profile: Profile;
  projects: Project[];
  skills: Skill[];
  experiences: ExperienceType[];
  articles: Article[];
};

export default function Desktop({ profile, projects, skills, experiences, articles }: DesktopProps) {
  const { openAppIds, activeAppId, stageManagerOpen, theme } = useDesktop();

  const activeApp =
    activeAppId && openAppIds.includes(activeAppId)
      ? STAGE_APPS.find((a) => a.id === activeAppId) || null
      : null;

  const hasInactiveApps = openAppIds.filter((id) => id !== activeAppId).length > 0;
  const isRailVisible = stageManagerOpen && activeApp !== null && hasInactiveApps;

  const isDark = theme === "dark";

  return (
    <div
      className={`h-screen w-screen overflow-hidden relative select-none transform-gpu transition-colors duration-250 ${
        isDark ? "bg-[#09090b] text-zinc-100" : "bg-[#e5e5ea] text-zinc-900"
      }`}
    >
      {/* Background Wallpaper: Topographic Silhouette & Apple Watermark */}
      <DesktopWallpaper />

      {/* Top MenuBar */}
      <MenuBar />

      {/* Left Stage Manager Rail (Only shows remaining open apps) */}
      <AnimatePresence>
        {isRailVisible && <StageManagerRail key="stage-manager-rail" />}
      </AnimatePresence>

      {/* Center Stage: Active Application Window */}
      <main className="relative w-full h-full pointer-events-none">
        <div className="pointer-events-auto">
          <AnimatePresence mode="popLayout">
            {activeApp && activeApp.id === "about" && (
              <WindowFrame key="about" id="about" title="About Me — Dimas Fiebry">
                <Hero profile={profile} />
              </WindowFrame>
            )}

            {activeApp && activeApp.id === "projects" && (
              <WindowFrame key="projects" id="projects" title="Featured Engineering Projects">
                <Projects projects={projects} />
              </WindowFrame>
            )}

            {activeApp && activeApp.id === "experience" && (
              <WindowFrame key="experience" id="experience" title="Work Experience & Milestones">
                <Experience experiences={experiences} />
              </WindowFrame>
            )}

            {activeApp && activeApp.id === "skills" && (
              <WindowFrame key="skills" id="skills" title="Technical Proficiencies & Arsenal">
                <Skills skills={skills} />
              </WindowFrame>
            )}

            {activeApp && activeApp.id === "writing" && (
              <WindowFrame key="writing" id="writing" title="Writing & Notes — Dimas Fiebry">
                <Articles articles={articles} />
              </WindowFrame>
            )}

            {activeApp && activeApp.id === "contact" && (
              <WindowFrame key="contact" id="contact" title="Contact & Terminal — Dimas Fiebry">
                <Contact profile={profile} />
              </WindowFrame>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Bottom Dock */}
      <Dock />

      {/* macOS Spotlight Search Modal */}
      <SpotlightSearch />

      {/* macOS Admin Portal & Content Manager */}
      <AdminPortal />
    </div>
  );
}
