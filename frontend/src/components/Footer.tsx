"use client";

import React from "react";
import { Terminal, Heart } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/Icons";

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-white/10 py-12 relative bg-[#060910]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-cyan-400 flex items-center justify-center text-white">
            <Terminal className="w-4 h-4" />
          </div>
          <span className="font-bold text-white text-base">Dimas.dev</span>
          <span className="text-slate-500 text-xs hidden sm:inline">|</span>
          <span className="text-slate-400 text-xs hidden sm:inline">
            Fullstack Developer & Performance Systems Engineer
          </span>
        </div>

        {/* Tech Stack Info */}
        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          <span>Crafted with</span>
          <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
          <span>using Golang Gin, React, Next.js & TypeScript</span>
        </div>

        {/* Socials & Copyright */}
        <div className="flex items-center gap-4 text-xs text-slate-400">
          <a
            href="https://github.com/fiebryhoga"
            target="_blank"
            rel="noreferrer"
            className="hover:text-white transition-colors"
            aria-label="GitHub Link"
          >
            <GithubIcon className="w-4 h-4" />
          </a>
          <a
            href="https://linkedin.com/in/dimas-fiebry-prayhoga-putra/"
            target="_blank"
            rel="noreferrer"
            className="hover:text-white transition-colors"
            aria-label="LinkedIn Link"
          >
            <LinkedinIcon className="w-4 h-4" />
          </a>
          <span>&copy; {new Date().getFullYear()} Dimas Fiebry Prayhoga Putra. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
};
