"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Shield } from "lucide-react";
import Desktop from "@/components/os/Desktop";
import { DesktopProvider, useDesktop } from "@/context/DesktopContext";
import {
  fetchProfile,
  fetchProjects,
  fetchSkills,
  fetchExperiences,
  fetchArticles,
  fallbackProfile,
  fallbackProjects,
  fallbackSkills,
  fallbackExperiences,
  fallbackArticles,
} from "@/lib/api";
import { Profile, Project, Skill, Experience as ExperienceType, Article } from "@/types";

function AdminAutoOpener({
  profile,
  projects,
  skills,
  experiences,
  articles,
}: {
  profile: Profile;
  projects: Project[];
  skills: Skill[];
  experiences: ExperienceType[];
  articles: Article[];
}) {
  const { setAdminPortalOpen } = useDesktop();

  useEffect(() => {
    setAdminPortalOpen(true);
  }, [setAdminPortalOpen]);

  return (
    <>
      <div className="fixed top-12 left-4 z-40">
        <Link
          href="/"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-black/60 hover:bg-black/80 text-white backdrop-blur-md border border-white/10 transition-colors shadow-lg"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Exit to Portfolio Desktop</span>
        </Link>
      </div>

      <Desktop
        profile={profile}
        projects={projects}
        skills={skills}
        experiences={experiences}
        articles={articles}
      />
    </>
  );
}

export default function AdminPage() {
  const [profile, setProfile] = useState<Profile>(fallbackProfile);
  const [projects, setProjects] = useState<Project[]>(fallbackProjects);
  const [skills, setSkills] = useState<Skill[]>(fallbackSkills);
  const [experiences, setExperiences] = useState<ExperienceType[]>(fallbackExperiences);
  const [articles, setArticles] = useState<Article[]>(fallbackArticles);

  useEffect(() => {
    async function loadData() {
      try {
        const [profData, projData, skillData, expData, artData] = await Promise.all([
          fetchProfile(),
          fetchProjects(),
          fetchSkills(),
          fetchExperiences(),
          fetchArticles(),
        ]);
        setProfile(profData);
        setProjects(projData);
        setSkills(skillData);
        setExperiences(expData);
        setArticles(artData);
      } catch (err) {
        console.warn("Using fallback portfolio data in admin route:", err);
      }
    }
    loadData();
  }, []);

  return (
    <DesktopProvider>
      <AdminAutoOpener
        profile={profile}
        projects={projects}
        skills={skills}
        experiences={experiences}
        articles={articles}
      />
    </DesktopProvider>
  );
}
