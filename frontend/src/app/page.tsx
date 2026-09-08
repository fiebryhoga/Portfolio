"use client";

import React, { useState, useEffect } from "react";
import Desktop from "@/components/os/Desktop";
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

export default function Home() {
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
        console.warn("Using fallback portfolio data:", err);
      }
    }
    loadData();
  }, []);

  return (
    <Desktop 
      profile={profile}
      projects={projects}
      skills={skills}
      experiences={experiences}
      articles={articles}
    />
  );
}
