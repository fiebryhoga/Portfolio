"use client";

import React, { useState, useRef, useEffect } from "react";
import { Profile } from "@/types";
import { sendContactMessage } from "@/lib/api";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Terminal as TerminalIcon,
  Copy,
  Check,
  Clock,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import { useDesktop } from "@/context/DesktopContext";

interface ContactProps {
  profile: Profile;
}

type TerminalHistoryItem = {
  command: string;
  output: React.ReactNode;
};

export const Contact: React.FC<ContactProps> = ({ profile }) => {
  const { theme } = useDesktop();
  const isDark = theme === "dark";

  const [activeTab, setActiveTab] = useState<"message" | "terminal">("message");
  const [copiedEmail, setCopiedEmail] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle"
  );
  const [feedbackMessage, setFeedbackMessage] = useState<string>("");

  // Terminal State
  const [terminalInput, setTerminalInput] = useState<string>("");
  const [terminalHistory, setTerminalHistory] = useState<TerminalHistoryItem[]>([
    {
      command: "welcome",
      output: (
        <div className="space-y-1 text-xs">
          <p className="text-emerald-400 font-bold">
            Dimas Fiebry — macOS Developer Terminal (zsh)
          </p>
          <p className="text-zinc-400">
            Type <span className="text-white font-semibold">&apos;help&apos;</span> to
            see available commands or <span className="text-white font-semibold">&apos;contact&apos;</span> for quick details.
          </p>
        </div>
      ),
    },
  ]);
  const terminalEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (activeTab === "terminal") {
      terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
      inputRef.current?.focus();
    }
  }, [terminalHistory, activeTab]);

  const copyEmailToClipboard = () => {
    navigator.clipboard.writeText(profile.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setStatus("error");
      setFeedbackMessage("Please fill in your name, email, and message.");
      return;
    }

    setStatus("loading");
    setFeedbackMessage("");

    try {
      const res = await sendContactMessage(formData);
      setStatus("success");
      setFeedbackMessage(res.message || "Message sent successfully! I will respond promptly.");
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (err: unknown) {
      setStatus("error");
      const message =
        err instanceof Error
          ? err.message
          : "Failed to send message. Please try again or email directly.";
      setFeedbackMessage(message);
    }
  };

  const executeTerminalCommand = (rawCommand: string) => {
    const cmd = rawCommand.trim().toLowerCase();
    if (!cmd) return;

    let output: React.ReactNode = null;

    switch (cmd) {
      case "help":
        output = (
          <div className="space-y-1 text-zinc-300">
            <p className="text-white font-semibold">Available Commands:</p>
            <p><span className="text-emerald-400 w-24 inline-block">about</span> Learn about Dimas Fiebry</p>
            <p><span className="text-emerald-400 w-24 inline-block">skills</span> List core technical proficiencies</p>
            <p><span className="text-emerald-400 w-24 inline-block">projects</span> Summary of engineering projects</p>
            <p><span className="text-emerald-400 w-24 inline-block">contact</span> Display direct email &amp; phone</p>
            <p><span className="text-emerald-400 w-24 inline-block">whoami</span> Print current session identity</p>
            <p><span className="text-emerald-400 w-24 inline-block">date</span> Print system timestamp</p>
            <p><span className="text-emerald-400 w-24 inline-block">clear</span> Clear terminal screen</p>
            <p><span className="text-emerald-400 w-24 inline-block">gui</span> Switch back to Direct Message form</p>
          </div>
        );
        break;

      case "about":
      case "bio":
        output = (
          <div className="space-y-1 text-zinc-300">
            <p className="text-white font-semibold">Dimas Fiebry — Fullstack Developer &amp; Systems Engineer</p>
            <p>• Graduate in Information Systems from Universitas Brawijaya (GPA: 3.60).</p>
            <p>• Lead engineer of the Integrated Soccer Monitoring System (ISMS) for Persebaya Surabaya.</p>
            <p>• Specialized in high-concurrency Go microservices, modern React/Next.js, and cloud containerization.</p>
          </div>
        );
        break;

      case "skills":
        output = (
          <div className="space-y-1 text-zinc-300">
            <p><span className="text-white font-semibold">Backend:</span> Go (Gin), PHP (Laravel, Filament), Node.js, Python, PostgreSQL, MySQL</p>
            <p><span className="text-white font-semibold">Frontend:</span> React.js, Next.js, TypeScript, Tailwind CSS, Inertia.js</p>
            <p><span className="text-white font-semibold">DevOps:</span> Docker, Nginx, Linux VPS, Gitflow, REST APIs &amp; Microservices</p>
          </div>
        );
        break;

      case "projects":
        output = (
          <div className="space-y-1 text-zinc-300">
            <p className="text-white font-semibold">Key Featured Projects:</p>
            <p>1. <span className="text-emerald-400">ISMS</span> - Persebaya Surabaya Sports Analytics Platform</p>
            <p>2. <span className="text-emerald-400">Siakad LPK</span> - Academic Management System (Laravel + Filament)</p>
            <p>3. <span className="text-emerald-400">E-Archive</span> - Digital Archiving Platform (Next.js + TypeScript)</p>
            <p>4. <span className="text-emerald-400">WhatsApp Automation Bot</span> - Node.js + Baileys messaging engine</p>
            <p className="text-zinc-500 text-[11px] mt-1">Tip: Click the &apos;Projects&apos; icon in the dock to view the full gallery.</p>
          </div>
        );
        break;

      case "contact":
      case "email":
        output = (
          <div className="space-y-1 text-zinc-300">
            <p><span className="text-white font-semibold">Email:</span> {profile.email}</p>
            <p><span className="text-white font-semibold">Location:</span> {profile.location}</p>
            <p><span className="text-white font-semibold">Phone:</span> {profile.phone || "+62 857-3097-9537"}</p>
            <p><span className="text-white font-semibold">GitHub:</span> https://github.com/fiebryhoga</p>
          </div>
        );
        break;

      case "whoami":
        output = <p className="text-zinc-300">guest@antigravity-client (authorized visitor)</p>;
        break;

      case "date":
        output = <p className="text-zinc-300">{new Date().toString()}</p>;
        break;

      case "clear":
        setTerminalHistory([]);
        setTerminalInput("");
        return;

      case "gui":
      case "form":
        setActiveTab("message");
        return;

      case "sudo":
        output = (
          <p className="text-amber-400">
            Permission granted: You already have guest root privileges on dimas@macbook.
          </p>
        );
        break;

      default:
        output = (
          <p className="text-red-400">
            zsh: command not found: {rawCommand}. Type <span className="text-white font-semibold">&apos;help&apos;</span> for a list of commands.
          </p>
        );
        break;
    }

    setTerminalHistory((prev) => [...prev, { command: rawCommand, output }]);
    setTerminalInput("");
  };

  return (
    <div className="@container max-w-5xl mx-auto py-5 sm:py-7 px-3 sm:px-6 select-text space-y-6">
      {/* 1. Header (Clean, Minimalist, No Background Badges) */}
      <div
        className={`pb-4 border-b transition-colors ${
          isDark ? "border-white/10" : "border-black/10"
        }`}
      >
        <div className="flex flex-col @[600px]:flex-row @[600px]:items-center justify-between gap-3 mb-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1
                className={`text-xl sm:text-2xl font-bold tracking-tight ${
                  isDark ? "text-white" : "text-zinc-950"
                }`}
              >
                Get in Touch &amp; Terminal
              </h1>
              <span
                className={`text-xs font-mono font-medium ${
                  isDark ? "text-zinc-400" : "text-zinc-500"
                }`}
              >
                / Dimas Fiebry
              </span>
            </div>
            <p
              className={`text-xs sm:text-sm font-normal max-w-2xl ${
                isDark ? "text-zinc-400" : "text-zinc-600"
              }`}
            >
              Have an opportunity, engineering challenge, or collaboration proposal? Send a direct message or explore via CLI.
            </p>
          </div>

          {/* Minimalist Tab Navigation (No Pill Badges) */}
          <div className="flex items-center gap-4 text-xs font-medium shrink-0">
            <button
              onClick={() => setActiveTab("message")}
              className={`flex items-center gap-1.5 pb-1.5 transition-colors cursor-pointer border-b-2 ${
                activeTab === "message"
                  ? isDark
                    ? "text-white border-white font-semibold"
                    : "text-zinc-950 border-zinc-950 font-semibold"
                  : isDark
                  ? "text-zinc-400 hover:text-zinc-200 border-transparent"
                  : "text-zinc-500 hover:text-zinc-800 border-transparent"
              }`}
            >
              <Mail size={13} />
              <span>Direct Message</span>
            </button>
            <button
              onClick={() => setActiveTab("terminal")}
              className={`flex items-center gap-1.5 pb-1.5 transition-colors cursor-pointer border-b-2 ${
                activeTab === "terminal"
                  ? isDark
                    ? "text-white border-white font-semibold"
                    : "text-zinc-950 border-zinc-950 font-semibold"
                  : isDark
                  ? "text-zinc-400 hover:text-zinc-200 border-transparent"
                  : "text-zinc-500 hover:text-zinc-800 border-transparent"
              }`}
            >
              <TerminalIcon size={13} />
              <span>Terminal CLI</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Content Views */}
      {activeTab === "message" ? (
        /* GUI View: Container-Responsive 2-Column Layout */
        <div className="grid grid-cols-1 @[680px]:grid-cols-12 gap-5 sm:gap-7 items-start">
          {/* Left Column: Contact Channels */}
          <div className="@[680px]:col-span-5 space-y-4">
            <div
              className={`rounded-xl p-4 sm:p-5 border transition-colors space-y-4 ${
                isDark
                  ? "bg-zinc-900/40 border-white/10"
                  : "bg-white border-black/10 shadow-xs"
              }`}
            >
              <h2
                className={`text-sm font-semibold tracking-tight ${
                  isDark ? "text-white" : "text-zinc-950"
                }`}
              >
                Contact Channels
              </h2>

              {/* Email */}
              <div className="flex items-start gap-3">
                <Mail
                  size={16}
                  className={`mt-0.5 shrink-0 ${
                    isDark ? "text-zinc-300" : "text-zinc-700"
                  }`}
                />
                <div className="min-w-0 flex-1">
                  <div
                    className={`text-[11px] ${
                      isDark ? "text-zinc-400" : "text-zinc-500"
                    }`}
                  >
                    Email Address
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <a
                      href={`mailto:${profile.email}`}
                      className={`text-xs sm:text-sm font-medium hover:underline truncate ${
                        isDark ? "text-white" : "text-zinc-950"
                      }`}
                    >
                      {profile.email}
                    </a>
                    <button
                      onClick={copyEmailToClipboard}
                      title="Copy email"
                      className={`p-1 rounded transition-colors ${
                        isDark
                          ? "hover:bg-white/10 text-zinc-400 hover:text-white"
                          : "hover:bg-black/5 text-zinc-500 hover:text-black"
                      }`}
                    >
                      {copiedEmail ? (
                        <Check size={12} className="text-emerald-500" />
                      ) : (
                        <Copy size={12} />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-start gap-3">
                <MapPin
                  size={16}
                  className={`mt-0.5 shrink-0 ${
                    isDark ? "text-zinc-300" : "text-zinc-700"
                  }`}
                />
                <div className="min-w-0">
                  <div
                    className={`text-[11px] ${
                      isDark ? "text-zinc-400" : "text-zinc-500"
                    }`}
                  >
                    Location
                  </div>
                  <div
                    className={`text-xs sm:text-sm font-medium mt-0.5 ${
                      isDark ? "text-white" : "text-zinc-950"
                    }`}
                  >
                    {profile.location}
                  </div>
                </div>
              </div>

              {/* Phone / WhatsApp */}
              {profile.phone && (
                <div className="flex items-start gap-3">
                  <Phone
                    size={16}
                    className={`mt-0.5 shrink-0 ${
                      isDark ? "text-zinc-300" : "text-zinc-700"
                    }`}
                  />
                  <div className="min-w-0">
                    <div
                      className={`text-[11px] ${
                        isDark ? "text-zinc-400" : "text-zinc-500"
                      }`}
                    >
                      Phone / WhatsApp
                    </div>
                    <a
                      href={`https://wa.me/${profile.phone.replace(/[^0-9]/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`text-xs sm:text-sm font-medium hover:underline inline-flex items-center gap-1 mt-0.5 ${
                        isDark ? "text-white" : "text-zinc-950"
                      }`}
                    >
                      <span>{profile.phone}</span>
                      <ExternalLink size={10} className="opacity-60" />
                    </a>
                  </div>
                </div>
              )}

              {/* Divider & Status (No BG Badges) */}
              <div
                className={`pt-3 border-t space-y-2 text-xs ${
                  isDark ? "border-white/10" : "border-black/10"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                  <span
                    className={`font-medium ${
                      isDark ? "text-zinc-200" : "text-zinc-800"
                    }`}
                  >
                    Available for full-time &amp; contracts
                  </span>
                </div>
                <div
                  className={`flex items-center gap-1.5 ${
                    isDark ? "text-zinc-400" : "text-zinc-500"
                  }`}
                >
                  <Clock size={12} className="opacity-70" />
                  <span>Typically responds within 24 hours</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Direct Message Form */}
          <div className="@[680px]:col-span-7">
            <div
              className={`rounded-xl p-5 sm:p-6 border transition-colors ${
                isDark
                  ? "bg-zinc-900/40 border-white/10"
                  : "bg-white border-black/10 shadow-xs"
              }`}
            >
              <h2
                className={`text-sm font-semibold tracking-tight mb-1 ${
                  isDark ? "text-white" : "text-zinc-950"
                }`}
              >
                Send a Message
              </h2>
              <p
                className={`text-xs mb-4 ${
                  isDark ? "text-zinc-400" : "text-zinc-600"
                }`}
              >
                Fill out the form below. Messages are delivered directly to Dimas.
              </p>

              {/* Status Alert (Clean, No Bloated Styling) */}
              {status === "success" && (
                <div
                  className={`mb-4 p-3 rounded-lg border text-xs flex items-start gap-2.5 ${
                    isDark
                      ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-300"
                      : "bg-emerald-50 border-emerald-200 text-emerald-800 font-medium"
                  }`}
                >
                  <CheckCircle2 size={14} className="shrink-0 mt-0.5" />
                  <div>{feedbackMessage}</div>
                </div>
              )}

              {status === "error" && (
                <div
                  className={`mb-4 p-3 rounded-lg border text-xs flex items-start gap-2.5 ${
                    isDark
                      ? "bg-red-500/10 border-red-500/20 text-red-300"
                      : "bg-red-50 border-red-200 text-red-800 font-medium"
                  }`}
                >
                  <AlertCircle size={14} className="shrink-0 mt-0.5" />
                  <div>{feedbackMessage}</div>
                </div>
              )}

              <form onSubmit={handleFormSubmit} className="space-y-3.5">
                <div className="grid grid-cols-1 @[450px]:grid-cols-2 gap-3">
                  <div>
                    <label
                      className={`block text-xs font-medium mb-1 ${
                        isDark ? "text-zinc-300" : "text-zinc-700"
                      }`}
                    >
                      Your Name <span className="opacity-60">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Alex Johnson"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className={`w-full px-3 py-2 rounded-lg text-xs border transition-colors outline-none ${
                        isDark
                          ? "bg-white/5 border-white/10 text-white placeholder-zinc-500 focus:border-white/30"
                          : "bg-black/[0.02] border-black/15 text-zinc-950 placeholder-zinc-400 focus:border-black/40 focus:bg-white"
                      }`}
                    />
                  </div>

                  <div>
                    <label
                      className={`block text-xs font-medium mb-1 ${
                        isDark ? "text-zinc-300" : "text-zinc-700"
                      }`}
                    >
                      Email Address <span className="opacity-60">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="alex@company.com"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className={`w-full px-3 py-2 rounded-lg text-xs border transition-colors outline-none ${
                        isDark
                          ? "bg-white/5 border-white/10 text-white placeholder-zinc-500 focus:border-white/30"
                          : "bg-black/[0.02] border-black/15 text-zinc-950 placeholder-zinc-400 focus:border-black/40 focus:bg-white"
                      }`}
                    />
                  </div>
                </div>

                <div>
                  <label
                    className={`block text-xs font-medium mb-1 ${
                      isDark ? "text-zinc-300" : "text-zinc-700"
                    }`}
                  >
                    Subject / Project Topic
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Fullstack Project or Senior Role"
                    value={formData.subject}
                    onChange={(e) =>
                      setFormData({ ...formData, subject: e.target.value })
                    }
                    className={`w-full px-3 py-2 rounded-lg text-xs border transition-colors outline-none ${
                      isDark
                        ? "bg-white/5 border-white/10 text-white placeholder-zinc-500 focus:border-white/30"
                        : "bg-black/[0.02] border-black/15 text-zinc-950 placeholder-zinc-400 focus:border-black/40 focus:bg-white"
                    }`}
                  />
                </div>

                <div>
                  <label
                    className={`block text-xs font-medium mb-1 ${
                      isDark ? "text-zinc-300" : "text-zinc-700"
                    }`}
                  >
                    Message <span className="opacity-60">*</span>
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Describe your project, timeline, or inquiry..."
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    className={`w-full px-3 py-2 rounded-lg text-xs border transition-colors resize-none outline-none ${
                      isDark
                        ? "bg-white/5 border-white/10 text-white placeholder-zinc-500 focus:border-white/30"
                        : "bg-black/[0.02] border-black/15 text-zinc-950 placeholder-zinc-400 focus:border-black/40 focus:bg-white"
                    }`}
                  />
                </div>

                <button
                  type="submit"
                  disabled={status === "loading"}
                  className={`w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg font-semibold text-xs transition-all cursor-pointer disabled:opacity-50 ${
                    isDark
                      ? "bg-white text-black hover:bg-zinc-200"
                      : "bg-black text-white hover:bg-zinc-800"
                  }`}
                >
                  {status === "loading" ? (
                    <>
                      <Loader2 size={13} className="animate-spin" />
                      <span>Sending message...</span>
                    </>
                  ) : (
                    <>
                      <Send size={13} />
                      <span>Send Message</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      ) : (
        /* Terminal CLI View: Authentic macOS Developer CLI */
        <div
          className={`rounded-xl border p-4 font-mono text-xs transition-colors overflow-hidden ${
            isDark
              ? "bg-zinc-950 border-white/10 text-zinc-200"
              : "bg-zinc-900 border-black/20 text-zinc-100"
          }`}
          onClick={() => inputRef.current?.focus()}
        >
          {/* Terminal Title Bar */}
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10 text-[11px] text-zinc-400 select-none">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
              <span>dimas@macbook: ~</span>
            </div>
            <span className="opacity-60">zsh — 80x24</span>
          </div>

          {/* Quick command suggestion chips (Clean text, no bg badge) */}
          <div className="flex items-center gap-2 mb-3 text-[11px] flex-wrap select-none text-zinc-400">
            <span className="opacity-60">Suggestions:</span>
            {["help", "about", "skills", "projects", "contact", "clear"].map(
              (s) => (
                <button
                  key={s}
                  onClick={(e) => {
                    e.stopPropagation();
                    executeTerminalCommand(s);
                  }}
                  className="hover:text-emerald-400 underline decoration-zinc-600 underline-offset-2 transition-colors cursor-pointer"
                >
                  {s}
                </button>
              )
            )}
          </div>

          {/* Output log */}
          <div className="space-y-3 min-h-[220px] max-h-[380px] overflow-y-auto pr-1">
            {terminalHistory.map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center gap-2 text-zinc-400">
                  <span className="text-emerald-400">dimas@macbook ~ %</span>
                  <span className="text-white font-semibold">{item.command}</span>
                </div>
                <div className="pl-4">{item.output}</div>
              </div>
            ))}
            <div ref={terminalEndRef} />
          </div>

          {/* Prompt line */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              executeTerminalCommand(terminalInput);
            }}
            className="flex items-center gap-2 pt-3 mt-2 border-t border-white/10"
          >
            <span className="text-emerald-400 shrink-0 select-none">
              dimas@macbook ~ %
            </span>
            <input
              ref={inputRef}
              type="text"
              value={terminalInput}
              onChange={(e) => setTerminalInput(e.target.value)}
              placeholder="type 'help' or any command..."
              className="flex-1 bg-transparent text-white outline-none border-none placeholder:text-zinc-600 text-xs font-mono"
              autoFocus
            />
          </form>
        </div>
      )}
    </div>
  );
};
