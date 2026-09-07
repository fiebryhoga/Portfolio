"use client";

import React, { useState, useEffect } from "react";
import { Terminal, Shield, Menu, X, ArrowUpRight } from "lucide-react";

interface NavbarProps {
  onOpenAdmin: () => void;
  availableForWork?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAdmin, availableForWork = true }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "About", href: "#about" },
    { name: "Skills", href: "#skills" },
    { name: "Projects", href: "#projects" },
    { name: "Experience", href: "#experience" },
    { name: "Contact", href: "#contact" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-[#090d16]/80 backdrop-blur-md border-b border-white/10 py-3 shadow-lg shadow-black/20"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <a href="#" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-400 flex items-center justify-center text-white font-bold shadow-md shadow-indigo-500/25 group-hover:scale-105 transition-transform">
            <Terminal className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg text-white tracking-tight group-hover:text-cyan-400 transition-colors">
                Alex.dev
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-mono">
                Go + React
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">Full-Stack Engineer</p>
          </div>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 rounded-full px-4 py-1.5 glass-card">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="px-3.5 py-1.5 text-sm text-slate-300 hover:text-white hover:bg-white/5 rounded-full transition-all"
            >
              {link.name}
            </a>
          ))}
        </nav>

        {/* Right CTA / Status */}
        <div className="hidden sm:flex items-center gap-3">
          {availableForWork && (
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
              Available for work
            </div>
          )}

          <button
            onClick={onOpenAdmin}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors title='Admin Portal'"
            title="Admin & API Status"
          >
            <Shield className="w-4 h-4" />
          </button>

          <a
            href="#contact"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-indigo-500 to-cyan-500 text-white shadow-md shadow-indigo-500/20 hover:opacity-95 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            Let&apos;s Talk
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Mobile menu button */}
        <div className="flex sm:hidden items-center gap-2">
          <button
            onClick={onOpenAdmin}
            className="p-2 text-slate-400 hover:text-white"
          >
            <Shield className="w-4 h-4" />
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-300 hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-card border-t border-white/10 px-6 py-4 mt-3 flex flex-col gap-3">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="text-slate-300 hover:text-white py-1.5 text-sm"
            >
              {link.name}
            </a>
          ))}
          <a
            href="#contact"
            onClick={() => setMobileMenuOpen(false)}
            className="text-center py-2.5 rounded-xl text-xs font-semibold bg-indigo-600 text-white mt-2"
          >
            Let&apos;s Connect
          </a>
        </div>
      )}
    </header>
  );
};
