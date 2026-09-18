"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  X,
  Minus,
  Maximize2,
  Shield,
  User,
  FolderGit2,
  FileText,
  Settings,
  BookOpen,
  Mail,
  LogOut,
  RefreshCw,
  Plus,
  Trash2,
  Edit2,
  Check,
  AlertCircle,
  KeyRound,
  Save,
  CheckCircle2,
  Database,
  Camera,
  UploadCloud,
  ImageIcon,
} from "lucide-react";
import { useDesktop } from "@/context/DesktopContext";
import {
  loginAdmin,
  fetchProfile,
  fetchProjects,
  fetchSkills,
  fetchExperiences,
  fetchArticles,
  fetchContactMessages,
  updateAdminProfile,
  createAdminProject,
  updateAdminProject,
  deleteAdminProject,
  createAdminSkill,
  updateAdminSkill,
  deleteAdminSkill,
  createAdminExperience,
  updateAdminExperience,
  deleteAdminExperience,
  createArticle,
  updateAdminArticle,
  deleteAdminArticle,
  markContactMessageRead,
  deleteContactMessage,
  uploadAdminFile,
} from "@/lib/api";
import {
  Profile,
  Project,
  Skill,
  Experience,
  Article,
  ContactMessage,
} from "@/types";

type AdminTab =
  | "profile"
  | "projects"
  | "experience"
  | "skills"
  | "writing"
  | "messages"
  | "system";

export default function AdminPortal() {
  const { adminPortalOpen, setAdminPortalOpen, theme } = useDesktop();
  const isDark = theme === "dark";

  // Auth State
  const [token, setToken] = useState<string | null>(null);
  const [email, setEmail] = useState("admin@portfolio.dev");
  const [password, setPassword] = useState("Admin@123456");
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Active Tab
  const [activeTab, setActiveTab] = useState<AdminTab>("profile");
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Data States
  const [profile, setProfile] = useState<Profile | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);

  // Avatar Upload State
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  // Project Image Upload State
  const [uploadingProjectImg, setUploadingProjectImg] = useState(false);
  const projectImgInputRef = useRef<HTMLInputElement>(null);

  // Editing Modals / Inline form states
  const [editingProject, setEditingProject] = useState<Partial<Project> | null>(null);
  const [isNewProject, setIsNewProject] = useState(false);

  const [editingSkill, setEditingSkill] = useState<Partial<Skill> | null>(null);
  const [isNewSkill, setIsNewSkill] = useState(false);

  const [editingExp, setEditingExp] = useState<Partial<Experience> | null>(null);
  const [isNewExp, setIsNewExp] = useState(false);

  const [editingArticle, setEditingArticle] = useState<Partial<Article> | null>(null);
  const [isNewArticle, setIsNewArticle] = useState(false);

  // Profile Form Data
  const [profileForm, setProfileForm] = useState<Partial<Profile>>({});

  // Check saved session on mount
  useEffect(() => {
    try {
      const savedToken = localStorage.getItem("portfolio_admin_jwt");
      if (savedToken) {
        setToken(savedToken);
      }
    } catch {
      // ignore
    }
  }, []);

  // Load all content when token is active
  const loadAllData = async (jwtToken: string) => {
    setIsLoading(true);
    try {
      const [profData, projData, skillData, expData, artData, msgData] =
        await Promise.all([
          fetchProfile().catch(() => null),
          fetchProjects().catch(() => []),
          fetchSkills().catch(() => []),
          fetchExperiences().catch(() => []),
          fetchArticles().catch(() => []),
          fetchContactMessages(jwtToken).catch(() => []),
        ]);

      if (profData) {
        setProfile(profData);
        setProfileForm(profData);
      }
      setProjects(projData);
      setSkills(skillData);
      setExperiences(expData);
      setArticles(artData);
      setMessages(msgData);
    } catch (err: unknown) {
      notify("error", err instanceof Error ? err.message : "Failed to load data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      loadAllData(token);
    }
  }, [token]);

  const handleLogout = (showNotification = true) => {
    setToken(null);
    try {
      localStorage.removeItem("portfolio_admin_jwt");
    } catch {
      // ignore
    }
    if (showNotification) {
      notify("success", "Signed out successfully.");
    }
  };

  const notify = (type: "success" | "error", text: string) => {
    if (
      text.toLowerCase().includes("unauthorized") ||
      text.toLowerCase().includes("invalid or expired") ||
      text.toLowerCase().includes("expired authorization token")
    ) {
      handleLogout(false);
      setAuthError(
        "Sesi login Anda telah berakhir (database baru saja dialihkan ke PostgreSQL). Silakan klik 'Quick Fill Credentials' lalu Sign In."
      );
      return;
    }
    setFeedback({ type, text });
    setTimeout(() => setFeedback(null), 3500);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError(null);
    try {
      const res = await loginAdmin(email, password);
      setToken(res.token);
      try {
        localStorage.setItem("portfolio_admin_jwt", res.token);
      } catch {
        // ignore
      }
      notify("success", "Successfully authenticated with Go Gin API & PostgreSQL!");
    } catch (err: unknown) {
      setAuthError(
        err instanceof Error
          ? err.message
          : "Authentication failed. Check Go Gin API connection."
      );
    } finally {
      setAuthLoading(false);
    }
  };

  // --- Profile Operations ---
  const handleSaveProfile = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!token) return;
    setIsLoading(true);
    try {
      const updated = await updateAdminProfile(token, profileForm);
      setProfile(updated);
      setProfileForm(updated);
      notify("success", "Profil berhasil disimpan ke PostgreSQL Database!");
      try {
        window.dispatchEvent(new CustomEvent("portfolio-content-updated"));
      } catch {}
    } catch (err: unknown) {
      notify("error", err instanceof Error ? err.message : "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  // --- Avatar File Upload Handler ---
  const handleAvatarFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !token) return;

    setUploadingAvatar(true);
    try {
      const uploaded = await uploadAdminFile(token, file);
      const newForm = { ...profileForm, avatar_url: uploaded.url };
      setProfileForm(newForm);
      
      // Auto-save immediately to database
      const updated = await updateAdminProfile(token, newForm);
      setProfile(updated);
      notify("success", "Foto profil berhasil diupload dan disimpan ke PostgreSQL!");
      try {
        window.dispatchEvent(new CustomEvent("portfolio-content-updated"));
      } catch {}
    } catch (err: unknown) {
      notify("error", err instanceof Error ? err.message : "Gagal mengupload foto profil");
    } finally {
      setUploadingAvatar(false);
      if (avatarInputRef.current) {
        avatarInputRef.current.value = "";
      }
    }
  };

  // --- Project Image File Upload Handler ---
  const handleProjectImgFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !token || !editingProject) return;

    setUploadingProjectImg(true);
    try {
      const uploaded = await uploadAdminFile(token, file);
      setEditingProject({
        ...editingProject,
        image_url: uploaded.url,
      });
      notify("success", "Foto project berhasil diupload!");
    } catch (err: unknown) {
      notify("error", err instanceof Error ? err.message : "Gagal mengupload gambar project");
    } finally {
      setUploadingProjectImg(false);
      if (projectImgInputRef.current) {
        projectImgInputRef.current.value = "";
      }
    }
  };

  // --- Projects Operations ---
  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !editingProject) return;
    setIsLoading(true);
    try {
      if (isNewProject) {
        const created = await createAdminProject(token, editingProject);
        setProjects((prev) => [...prev, created]);
        notify("success", `Project "${created.title}" created successfully!`);
      } else if (editingProject.id) {
        const updated = await updateAdminProject(token, editingProject.id, editingProject);
        setProjects((prev) =>
          prev.map((p) => (p.id === updated.id ? updated : p))
        );
        notify("success", `Project "${updated.title}" updated successfully!`);
      }
      try { window.dispatchEvent(new CustomEvent("portfolio-content-updated")); } catch {}
      setEditingProject(null);
      setIsNewProject(false);
    } catch (err: unknown) {
      notify("error", err instanceof Error ? err.message : "Failed to save project");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProject = async (id: number, title: string) => {
    if (!token) return;
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;
    setIsLoading(true);
    try {
      await deleteAdminProject(token, id);
      setProjects((prev) => prev.filter((p) => p.id !== id));
      try { window.dispatchEvent(new CustomEvent("portfolio-content-updated")); } catch {}
      notify("success", `Project "${title}" deleted.`);
    } catch (err: unknown) {
      notify("error", err instanceof Error ? err.message : "Failed to delete project");
    } finally {
      setIsLoading(false);
    }
  };

  // --- Skills Operations ---
  const handleSaveSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !editingSkill) return;
    setIsLoading(true);
    try {
      if (isNewSkill) {
        const created = await createAdminSkill(token, editingSkill);
        setSkills((prev) => [...prev, created]);
        notify("success", `Skill "${created.name}" created!`);
      } else if (editingSkill.id) {
        const updated = await updateAdminSkill(token, editingSkill.id, editingSkill);
        setSkills((prev) =>
          prev.map((s) => (s.id === updated.id ? updated : s))
        );
        notify("success", `Skill "${updated.name}" updated!`);
      }
      try { window.dispatchEvent(new CustomEvent("portfolio-content-updated")); } catch {}
      setEditingSkill(null);
      setIsNewSkill(false);
    } catch (err: unknown) {
      notify("error", err instanceof Error ? err.message : "Failed to save skill");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteSkill = async (id: number, name: string) => {
    if (!token) return;
    if (!confirm(`Delete skill "${name}"?`)) return;
    setIsLoading(true);
    try {
      await deleteAdminSkill(token, id);
      setSkills((prev) => prev.filter((s) => s.id !== id));
      try { window.dispatchEvent(new CustomEvent("portfolio-content-updated")); } catch {}
      notify("success", `Skill "${name}" removed.`);
    } catch (err: unknown) {
      notify("error", err instanceof Error ? err.message : "Failed to delete skill");
    } finally {
      setIsLoading(false);
    }
  };

  // --- Experience Operations ---
  const handleSaveExperience = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !editingExp) return;
    setIsLoading(true);
    try {
      if (isNewExp) {
        const created = await createAdminExperience(token, editingExp);
        setExperiences((prev) => [...prev, created]);
        notify("success", `Experience at "${created.company}" created!`);
      } else if (editingExp.id) {
        const updated = await updateAdminExperience(token, editingExp.id, editingExp);
        setExperiences((prev) =>
          prev.map((exp) => (exp.id === updated.id ? updated : exp))
        );
        notify("success", `Experience at "${updated.company}" updated!`);
      }
      try { window.dispatchEvent(new CustomEvent("portfolio-content-updated")); } catch {}
      setEditingExp(null);
      setIsNewExp(false);
    } catch (err: unknown) {
      notify("error", err instanceof Error ? err.message : "Failed to save experience");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteExperience = async (id: number, company: string) => {
    if (!token) return;
    if (!confirm(`Delete experience at "${company}"?`)) return;
    setIsLoading(true);
    try {
      await deleteAdminExperience(token, id);
      setExperiences((prev) => prev.filter((e) => e.id !== id));
      try { window.dispatchEvent(new CustomEvent("portfolio-content-updated")); } catch {}
      notify("success", `Experience at "${company}" removed.`);
    } catch (err: unknown) {
      notify("error", err instanceof Error ? err.message : "Failed to delete experience");
    } finally {
      setIsLoading(false);
    }
  };

  // --- Writing / Articles Operations ---
  const handleSaveArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !editingArticle) return;
    setIsLoading(true);
    try {
      if (isNewArticle) {
        const created = await createArticle(editingArticle);
        setArticles((prev) => [created, ...prev]);
        notify("success", `Article "${created.title}" published!`);
      } else if (editingArticle.id) {
        const updated = await updateAdminArticle(token, editingArticle.id, editingArticle);
        setArticles((prev) =>
          prev.map((a) => (a.id === updated.id ? updated : a))
        );
        notify("success", `Article "${updated.title}" updated!`);
      }
      try { window.dispatchEvent(new CustomEvent("portfolio-content-updated")); } catch {}
      setEditingArticle(null);
      setIsNewArticle(false);
    } catch (err: unknown) {
      notify("error", err instanceof Error ? err.message : "Failed to save article");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteArticle = async (id: number, title: string) => {
    if (!token) return;
    if (!confirm(`Delete article "${title}"?`)) return;
    setIsLoading(true);
    try {
      await deleteAdminArticle(token, id);
      setArticles((prev) => prev.filter((a) => a.id !== id));
      try { window.dispatchEvent(new CustomEvent("portfolio-content-updated")); } catch {}
      notify("success", `Article "${title}" deleted.`);
    } catch (err: unknown) {
      notify("error", err instanceof Error ? err.message : "Failed to delete article");
    } finally {
      setIsLoading(false);
    }
  };

  // --- Messages Operations ---
  const handleMarkMessageRead = async (id: number) => {
    if (!token) return;
    try {
      await markContactMessageRead(token, id);
      setMessages((prev) =>
        prev.map((m) => (m.id === id ? { ...m, is_read: true } : m))
      );
      notify("success", "Message marked as read.");
    } catch (err: unknown) {
      notify("error", err instanceof Error ? err.message : "Failed to update message");
    }
  };

  const handleDeleteMessage = async (id: number) => {
    if (!token) return;
    if (!confirm("Permanently delete this message?")) return;
    try {
      await deleteContactMessage(token, id);
      setMessages((prev) => prev.filter((m) => m.id !== id));
      notify("success", "Message deleted.");
    } catch (err: unknown) {
      notify("error", err instanceof Error ? err.message : "Failed to delete message");
    }
  };

  if (!adminPortalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-md animate-in fade-in select-none">
      <div
        className={`w-full max-w-5xl h-[88vh] rounded-2xl shadow-2xl flex flex-col border overflow-hidden transition-colors ${
          isDark
            ? "bg-[#111218] border-white/15 text-zinc-100 shadow-black/90"
            : "bg-white border-black/10 text-zinc-900 shadow-zinc-900/20"
        }`}
      >
        {/* Top Window Titlebar */}
        <div
          className={`h-11 px-4 flex items-center justify-between border-b shrink-0 ${
            isDark
              ? "bg-[#161722] border-white/10 text-zinc-300"
              : "bg-zinc-100/90 border-black/10 text-zinc-800"
          }`}
        >
          {/* Traffic Lights */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setAdminPortalOpen(false)}
              className="w-3 h-3 rounded-full bg-[#ff5f56] border border-[#e0443e] hover:brightness-90 transition-all flex items-center justify-center group"
              title="Close"
            >
              <X className="w-2 h-2 text-black/70 opacity-0 group-hover:opacity-100" />
            </button>
            <button
              onClick={() => setAdminPortalOpen(false)}
              className="w-3 h-3 rounded-full bg-[#ffbd2e] border border-[#dea123] hover:brightness-90 transition-all flex items-center justify-center group"
              title="Minimize"
            >
              <Minus className="w-2 h-2 text-black/70 opacity-0 group-hover:opacity-100" />
            </button>
            <button
              className="w-3 h-3 rounded-full bg-[#27c93f] border border-[#1aab29] hover:brightness-90 transition-all flex items-center justify-center group"
              title="Zoom"
            >
              <Maximize2 className="w-2 h-2 text-black/70 opacity-0 group-hover:opacity-100" />
            </button>
          </div>

          {/* Title */}
          <div className="flex items-center space-x-2 text-xs font-semibold tracking-wide">
            <Shield className="w-3.5 h-3.5 text-zinc-400" />
            <span>macOS System Settings — Content Management & Administration</span>
          </div>

          {/* Status / Quick Action */}
          <div className="flex items-center space-x-2">
            {token && (
              <>
                <button
                  onClick={() => loadAllData(token)}
                  disabled={isLoading}
                  className={`p-1.5 rounded-md text-xs hover:bg-black/5 dark:hover:bg-white/10 transition-colors flex items-center gap-1.5 font-medium ${
                    isLoading ? "animate-spin" : ""
                  }`}
                  title="Reload Content"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleLogout(true)}
                  className="px-2.5 py-1 rounded-md text-xs font-medium text-red-500 hover:bg-red-500/10 transition-colors flex items-center gap-1"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Global Toast Feedback */}
        {feedback && (
          <div
            className={`px-4 py-2 text-xs font-medium flex items-center justify-between border-b ${
              feedback.type === "success"
                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                : "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20"
            }`}
          >
            <div className="flex items-center gap-2">
              {feedback.type === "success" ? (
                <CheckCircle2 className="w-4 h-4 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0" />
              )}
              <span>{feedback.text}</span>
            </div>
            <button
              onClick={() => setFeedback(null)}
              className="text-xs opacity-60 hover:opacity-100"
            >
              ✕
            </button>
          </div>
        )}

        {/* Main Content Area */}
        {!token ? (
          /* ================= LOGIN VIEW ================= */
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center max-w-md mx-auto w-full">
            <div
              className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 border shadow-sm ${
                isDark
                  ? "bg-white/5 border-white/15 text-white"
                  : "bg-zinc-100 border-black/10 text-zinc-900"
              }`}
            >
              <KeyRound className="w-7 h-7" />
            </div>
            <h2 className="text-xl font-bold mb-1">Portfolio CMS Login</h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-6 max-w-sm">
              Authenticate against the Go Gin REST API to edit Profile, Projects,
              Experience, Skills, and Articles in real time.
            </p>

            <div
              className={`w-full p-3 rounded-xl mb-6 text-left border text-xs ${
                isDark
                  ? "bg-white/5 border-white/10 text-zinc-300"
                  : "bg-zinc-50 border-black/10 text-zinc-700"
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-semibold text-zinc-900 dark:text-white">
                  Seeded Admin Credentials:
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setEmail("admin@portfolio.dev");
                    setPassword("Admin@123456");
                  }}
                  className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Quick Fill Credentials
                </button>
              </div>
              <div className="font-mono text-[11px] space-y-0.5 opacity-90">
                <div>Email: admin@portfolio.dev</div>
                <div>Password: Admin@123456</div>
              </div>
            </div>

            {authError && (
              <div className="w-full p-3 rounded-xl mb-4 text-xs font-medium text-left border bg-red-500/10 border-red-500/20 text-red-600 dark:text-red-400 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="w-full space-y-3.5 text-left">
              <div>
                <label className="block text-xs font-medium mb-1 text-zinc-700 dark:text-zinc-300">
                  Email / Username
                </label>
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className={`w-full px-3 py-2 rounded-lg text-xs font-mono border focus:outline-hidden transition-colors ${
                    isDark
                      ? "bg-black/40 border-white/15 text-white focus:border-blue-500"
                      : "bg-zinc-50 border-black/15 text-zinc-900 focus:border-blue-500"
                  }`}
                  placeholder="admin@portfolio.dev"
                />
              </div>

              <div>
                <label className="block text-xs font-medium mb-1 text-zinc-700 dark:text-zinc-300">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className={`w-full px-3 py-2 rounded-lg text-xs font-mono border focus:outline-hidden transition-colors ${
                    isDark
                      ? "bg-black/40 border-white/15 text-white focus:border-blue-500"
                      : "bg-zinc-50 border-black/15 text-zinc-900 focus:border-blue-500"
                  }`}
                  placeholder="••••••••••••"
                />
              </div>

              <button
                type="submit"
                disabled={authLoading}
                className="w-full mt-2 py-2.5 px-4 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
              >
                {authLoading ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Signing In...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Sign In to Admin Portal</span>
                  </>
                )}
              </button>
            </form>
          </div>
        ) : (
          /* ================= AUTHENTICATED SYSTEM SETTINGS VIEW ================= */
          <div className="flex-1 flex overflow-hidden">
            {/* Left Sidebar Tabs */}
            <aside
              className={`w-52 sm:w-60 border-r flex flex-col shrink-0 p-2 overflow-y-auto ${
                isDark
                  ? "bg-[#14151e]/80 border-white/10"
                  : "bg-zinc-50/90 border-black/10"
              }`}
            >
              {/* Dimas Profile Micro Card with Real Avatar Photo */}
              <div
                className={`p-3 rounded-xl mb-2 flex items-center gap-3 border ${
                  isDark
                    ? "bg-white/5 border-white/10"
                    : "bg-white border-black/10 shadow-xs"
                }`}
              >
                <div className="relative w-9 h-9 rounded-full overflow-hidden border border-black/10 dark:border-white/15 bg-zinc-200 dark:bg-zinc-800 shrink-0">
                  {profile?.avatar_url ? (
                    <img
                      src={profile.avatar_url}
                      alt={profile.name}
                      className="w-full h-full object-cover grayscale"
                    />
                  ) : (
                    <div className="w-full h-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                      DF
                    </div>
                  )}
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold truncate">
                    {profile?.name || "Dimas Fiebry"}
                  </div>
                  <div className="text-[10px] text-zinc-500 dark:text-zinc-400 truncate">
                    Administrator
                  </div>
                </div>
              </div>

              {/* Navigation Items */}
              <nav className="space-y-0.5 flex-1">
                <SidebarItem
                  icon={<User className="w-4 h-4" />}
                  label="Profile & Bio"
                  active={activeTab === "profile"}
                  onClick={() => setActiveTab("profile")}
                  isDark={isDark}
                />
                <SidebarItem
                  icon={<FolderGit2 className="w-4 h-4" />}
                  label="Projects"
                  count={projects.length}
                  active={activeTab === "projects"}
                  onClick={() => setActiveTab("projects")}
                  isDark={isDark}
                />
                <SidebarItem
                  icon={<FileText className="w-4 h-4" />}
                  label="Experience"
                  count={experiences.length}
                  active={activeTab === "experience"}
                  onClick={() => setActiveTab("experience")}
                  isDark={isDark}
                />
                <SidebarItem
                  icon={<Settings className="w-4 h-4" />}
                  label="Skills"
                  count={skills.length}
                  active={activeTab === "skills"}
                  onClick={() => setActiveTab("skills")}
                  isDark={isDark}
                />
                <SidebarItem
                  icon={<BookOpen className="w-4 h-4" />}
                  label="Writing & Notes"
                  count={articles.length}
                  active={activeTab === "writing"}
                  onClick={() => setActiveTab("writing")}
                  isDark={isDark}
                />
                <SidebarItem
                  icon={<Mail className="w-4 h-4" />}
                  label="Messages"
                  count={messages.filter((m) => !m.is_read).length}
                  unreadCount={messages.filter((m) => !m.is_read).length}
                  active={activeTab === "messages"}
                  onClick={() => setActiveTab("messages")}
                  isDark={isDark}
                />
                <SidebarItem
                  icon={<Database className="w-4 h-4" />}
                  label="System Info"
                  active={activeTab === "system"}
                  onClick={() => setActiveTab("system")}
                  isDark={isDark}
                />
              </nav>

              {/* Footer Info */}
              <div className="p-2 border-t border-black/5 dark:border-white/5 text-[10px] text-zinc-500 space-y-0.5">
                <div>Go Gin + PostgreSQL 15</div>
                <div>JWT Token Active</div>
              </div>
            </aside>

            {/* Right Tab Content View */}
            <main
              className={`flex-1 overflow-y-auto p-4 sm:p-6 ${
                isDark ? "bg-[#111218]" : "bg-white"
              }`}
            >
              {/* ================= TAB 1: PROFILE & PHOTO UPLOAD ================= */}
              {activeTab === "profile" && (
                <div className="max-w-3xl space-y-6">
                  <div className="flex items-center justify-between border-b pb-3 border-black/10 dark:border-white/10">
                    <div>
                      <h3 className="text-base font-bold text-zinc-900 dark:text-white">
                        Profile & Bio Configuration
                      </h3>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400">
                        Upload your profile photo, update your live About Me window, and contact info.
                      </p>
                    </div>
                    <button
                      onClick={handleSaveProfile}
                      disabled={isLoading}
                      className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 text-white hover:bg-blue-500 transition-colors flex items-center gap-1.5"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>Save Changes</span>
                    </button>
                  </div>

                  {/* PROFILE PHOTO UPLOAD COMPONENT */}
                  <div
                    className={`p-4 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center gap-4 transition-colors ${
                      isDark ? "bg-white/5 border-white/10" : "bg-zinc-50 border-black/10"
                    }`}
                  >
                    {/* Circular Photo Preview */}
                    <div className="relative group shrink-0">
                      <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-black/15 dark:border-white/20 bg-zinc-200 dark:bg-zinc-800 shadow-sm">
                        <img
                          src={
                            profileForm.avatar_url ||
                            profile?.avatar_url ||
                            "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80"
                          }
                          alt={profileForm.name || "Avatar"}
                          className="w-full h-full object-cover grayscale contrast-105"
                        />
                      </div>

                      {/* Click overlay */}
                      <button
                        type="button"
                        onClick={() => avatarInputRef.current?.click()}
                        disabled={uploadingAvatar}
                        className="absolute inset-0 rounded-full bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-[10px] font-medium cursor-pointer"
                        title="Change Photo"
                      >
                        <Camera className="w-4 h-4 mb-0.5" />
                        <span>Change</span>
                      </button>
                    </div>

                    {/* Photo Controls */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-xs text-zinc-900 dark:text-white">
                          Profile Photo / Avatar
                        </span>
                        {uploadingAvatar && (
                          <span className="text-[10px] text-blue-500 font-semibold animate-pulse flex items-center gap-1">
                            <RefreshCw className="w-3 h-3 animate-spin" /> Uploading to server...
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mb-3">
                        Format didukung: JPG, PNG, WEBP, SVG (maks 10MB). Foto langsung disimpan ke backend dan diupdate di window About Me.
                      </p>

                      <div className="flex flex-wrap items-center gap-2">
                        {/* Hidden file input */}
                        <input
                          type="file"
                          ref={avatarInputRef}
                          onChange={handleAvatarFileChange}
                          accept="image/png,image/jpeg,image/webp,image/svg+xml"
                          className="hidden"
                        />

                        <button
                          type="button"
                          onClick={() => avatarInputRef.current?.click()}
                          disabled={uploadingAvatar}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 hover:opacity-90 transition-opacity flex items-center gap-1.5 cursor-pointer shadow-xs disabled:opacity-50"
                        >
                          <UploadCloud className="w-3.5 h-3.5" />
                          <span>{uploadingAvatar ? "Mengunggah..." : "Upload Foto Profil"}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            const defaultUrl = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80";
                            setProfileForm({ ...profileForm, avatar_url: defaultUrl });
                          }}
                          className="px-2.5 py-1.5 rounded-lg text-xs font-medium border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                        >
                          Reset ke Default
                        </button>
                      </div>

                      {/* URL input field */}
                      <div className="mt-2.5 flex items-center gap-2">
                        <span className="text-[10px] font-mono text-zinc-400 shrink-0">Atau URL:</span>
                        <input
                          type="text"
                          value={profileForm.avatar_url || ""}
                          onChange={(e) =>
                            setProfileForm({ ...profileForm, avatar_url: e.target.value })
                          }
                          placeholder="https://..."
                          className="w-full px-2 py-1 rounded-md text-[11px] font-mono border bg-transparent border-black/15 dark:border-white/15 focus:outline-hidden"
                        />
                      </div>
                    </div>
                  </div>

                  <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="font-semibold block mb-1">Full Name</label>
                        <input
                          type="text"
                          value={profileForm.name || ""}
                          onChange={(e) =>
                            setProfileForm({ ...profileForm, name: e.target.value })
                          }
                          className="w-full px-3 py-2 rounded-lg border bg-transparent border-black/15 dark:border-white/15 focus:outline-hidden"
                        />
                      </div>
                      <div>
                        <label className="font-semibold block mb-1">Location</label>
                        <input
                          type="text"
                          value={profileForm.location || ""}
                          onChange={(e) =>
                            setProfileForm({ ...profileForm, location: e.target.value })
                          }
                          className="w-full px-3 py-2 rounded-lg border bg-transparent border-black/15 dark:border-white/15 focus:outline-hidden"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="font-semibold block mb-1">Headline / Subtitle</label>
                      <input
                        type="text"
                        value={profileForm.headline || ""}
                        onChange={(e) =>
                          setProfileForm({ ...profileForm, headline: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-lg border bg-transparent border-black/15 dark:border-white/15 focus:outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="font-semibold block mb-1">Bio / Overview</label>
                      <textarea
                        rows={4}
                        value={profileForm.bio || ""}
                        onChange={(e) =>
                          setProfileForm({ ...profileForm, bio: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-lg border bg-transparent border-black/15 dark:border-white/15 focus:outline-hidden leading-relaxed"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="font-semibold block mb-1">Email</label>
                        <input
                          type="email"
                          value={profileForm.email || ""}
                          onChange={(e) =>
                            setProfileForm({ ...profileForm, email: e.target.value })
                          }
                          className="w-full px-3 py-2 rounded-lg border bg-transparent border-black/15 dark:border-white/15 focus:outline-hidden font-mono text-[11px]"
                        />
                      </div>
                      <div>
                        <label className="font-semibold block mb-1">Phone / WhatsApp</label>
                        <input
                          type="text"
                          value={profileForm.phone || ""}
                          onChange={(e) =>
                            setProfileForm({ ...profileForm, phone: e.target.value })
                          }
                          className="w-full px-3 py-2 rounded-lg border bg-transparent border-black/15 dark:border-white/15 focus:outline-hidden font-mono text-[11px]"
                        />
                      </div>
                      <div>
                        <label className="font-semibold block mb-1">Availability Status</label>
                        <select
                          value={profileForm.available_for_work ? "true" : "false"}
                          onChange={(e) =>
                            setProfileForm({
                              ...profileForm,
                              available_for_work: e.target.value === "true",
                            })
                          }
                          className="w-full px-3 py-2 rounded-lg border bg-transparent border-black/15 dark:border-white/15 focus:outline-hidden"
                        >
                          <option value="true" className="dark:bg-zinc-900">
                            Available for Opportunities
                          </option>
                          <option value="false" className="dark:bg-zinc-900">
                            Busy / Unavailable
                          </option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="font-semibold block mb-1">GitHub URL</label>
                        <input
                          type="text"
                          value={profileForm.github_url || ""}
                          onChange={(e) =>
                            setProfileForm({ ...profileForm, github_url: e.target.value })
                          }
                          className="w-full px-3 py-2 rounded-lg border bg-transparent border-black/15 dark:border-white/15 focus:outline-hidden font-mono text-[11px]"
                        />
                      </div>
                      <div>
                        <label className="font-semibold block mb-1">LinkedIn URL</label>
                        <input
                          type="text"
                          value={profileForm.linkedin_url || ""}
                          onChange={(e) =>
                            setProfileForm({ ...profileForm, linkedin_url: e.target.value })
                          }
                          className="w-full px-3 py-2 rounded-lg border bg-transparent border-black/15 dark:border-white/15 focus:outline-hidden font-mono text-[11px]"
                        />
                      </div>
                    </div>
                  </form>
                </div>
              )}

              {/* ================= TAB 2: PROJECTS ================= */}
              {activeTab === "projects" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b pb-3 border-black/10 dark:border-white/10">
                    <div>
                      <h3 className="text-base font-bold text-zinc-900 dark:text-white">
                        Projects Manager ({projects.length})
                      </h3>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400">
                        Create, edit, reorder, or delete engineering projects and upload screenshots.
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setEditingProject({
                          title: "",
                          slug: "",
                          short_description: "",
                          full_description: "",
                          image_url: "",
                          demo_url: "https://fiebryhoga.my.id/",
                          github_url: "https://github.com/fiebryhoga",
                          tech_stack: "React, Next.js, Go",
                          featured: false,
                          order_index: projects.length + 1,
                        });
                        setIsNewProject(true);
                      }}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 text-white hover:bg-blue-500 transition-colors flex items-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add New Project</span>
                    </button>
                  </div>

                  {/* Inline Form / Modal for Project */}
                  {editingProject && (
                    <div
                      className={`p-4 rounded-xl border mb-4 space-y-3 ${
                        isDark ? "bg-white/5 border-white/15" : "bg-zinc-50 border-black/15"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs">
                          {isNewProject ? "Create Project" : `Edit Project #${editingProject.id}`}
                        </span>
                        <button
                          onClick={() => setEditingProject(null)}
                          className="text-xs text-zinc-400 hover:text-zinc-700 dark:hover:text-white"
                        >
                          Cancel
                        </button>
                      </div>

                      <form onSubmit={handleSaveProject} className="space-y-3 text-xs">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="font-semibold block mb-1">Title</label>
                            <input
                              type="text"
                              required
                              value={editingProject.title || ""}
                              onChange={(e) =>
                                setEditingProject({
                                  ...editingProject,
                                  title: e.target.value,
                                  slug:
                                    isNewProject
                                      ? e.target.value
                                          .toLowerCase()
                                          .replace(/[^a-z0-9]+/g, "-")
                                          .replace(/(^-|-$)/g, "")
                                      : editingProject.slug,
                                })
                              }
                              className="w-full px-2.5 py-1.5 rounded-lg border bg-transparent border-black/15 dark:border-white/15 focus:outline-hidden"
                            />
                          </div>
                          <div>
                            <label className="font-semibold block mb-1">Slug</label>
                            <input
                              type="text"
                              required
                              value={editingProject.slug || ""}
                              onChange={(e) =>
                                setEditingProject({
                                  ...editingProject,
                                  slug: e.target.value,
                                })
                              }
                              className="w-full px-2.5 py-1.5 rounded-lg border bg-transparent border-black/15 dark:border-white/15 focus:outline-hidden font-mono"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="font-semibold block mb-1">Short Description</label>
                          <input
                            type="text"
                            required
                            value={editingProject.short_description || ""}
                            onChange={(e) =>
                              setEditingProject({
                                ...editingProject,
                                short_description: e.target.value,
                              })
                            }
                            className="w-full px-2.5 py-1.5 rounded-lg border bg-transparent border-black/15 dark:border-white/15 focus:outline-hidden"
                          />
                        </div>

                        <div>
                          <label className="font-semibold block mb-1">Full Description</label>
                          <textarea
                            rows={3}
                            value={editingProject.full_description || ""}
                            onChange={(e) =>
                              setEditingProject({
                                ...editingProject,
                                full_description: e.target.value,
                              })
                            }
                            className="w-full px-2.5 py-1.5 rounded-lg border bg-transparent border-black/15 dark:border-white/15 focus:outline-hidden"
                          />
                        </div>

                        {/* Project Image & Upload */}
                        <div>
                          <label className="font-semibold block mb-1">Project Screenshot / Cover Image</label>
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={editingProject.image_url || ""}
                              onChange={(e) =>
                                setEditingProject({
                                  ...editingProject,
                                  image_url: e.target.value,
                                })
                              }
                              placeholder="https://... or upload below"
                              className="flex-1 px-2.5 py-1.5 rounded-lg border bg-transparent border-black/15 dark:border-white/15 focus:outline-hidden font-mono text-[11px]"
                            />
                            <input
                              type="file"
                              ref={projectImgInputRef}
                              onChange={handleProjectImgFileChange}
                              accept="image/*"
                              className="hidden"
                            />
                            <button
                              type="button"
                              onClick={() => projectImgInputRef.current?.click()}
                              disabled={uploadingProjectImg}
                              className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-zinc-800 text-white dark:bg-white dark:text-zinc-900 flex items-center gap-1 shrink-0"
                            >
                              <UploadCloud className="w-3.5 h-3.5" />
                              <span>{uploadingProjectImg ? "Uploading..." : "Upload Image"}</span>
                            </button>
                          </div>
                          {editingProject.image_url && (
                            <div className="mt-2 w-32 h-20 rounded-lg overflow-hidden border border-black/10 dark:border-white/10 bg-black/5">
                              <img
                                src={editingProject.image_url}
                                alt="Preview"
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div>
                            <label className="font-semibold block mb-1">Tech Stack (comma separated)</label>
                            <input
                              type="text"
                              value={editingProject.tech_stack || ""}
                              onChange={(e) =>
                                setEditingProject({
                                  ...editingProject,
                                  tech_stack: e.target.value,
                                })
                              }
                              className="w-full px-2.5 py-1.5 rounded-lg border bg-transparent border-black/15 dark:border-white/15 focus:outline-hidden"
                            />
                          </div>
                          <div>
                            <label className="font-semibold block mb-1">Demo URL</label>
                            <input
                              type="text"
                              value={editingProject.demo_url || ""}
                              onChange={(e) =>
                                setEditingProject({
                                  ...editingProject,
                                  demo_url: e.target.value,
                                })
                              }
                              className="w-full px-2.5 py-1.5 rounded-lg border bg-transparent border-black/15 dark:border-white/15 focus:outline-hidden font-mono"
                            />
                          </div>
                          <div>
                            <label className="font-semibold block mb-1">GitHub URL</label>
                            <input
                              type="text"
                              value={editingProject.github_url || ""}
                              onChange={(e) =>
                                setEditingProject({
                                  ...editingProject,
                                  github_url: e.target.value,
                                })
                              }
                              className="w-full px-2.5 py-1.5 rounded-lg border bg-transparent border-black/15 dark:border-white/15 focus:outline-hidden font-mono"
                            />
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-2">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={!!editingProject.featured}
                              onChange={(e) =>
                                setEditingProject({
                                  ...editingProject,
                                  featured: e.target.checked,
                                })
                              }
                            />
                            <span>Featured Project</span>
                          </label>

                          <button
                            type="submit"
                            disabled={isLoading}
                            className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 text-white hover:bg-blue-500 transition-colors"
                          >
                            {isNewProject ? "Create Project" : "Save Changes"}
                          </button>
                        </div>
                      </form>
                    </div>
                  )}

                  {/* Projects List */}
                  <div className="space-y-2">
                    {projects.map((proj) => (
                      <div
                        key={proj.id}
                        className={`p-3.5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors ${
                          isDark
                            ? "bg-white/5 border-white/10 hover:border-white/20"
                            : "bg-white border-black/10 hover:border-black/20 shadow-xs"
                        }`}
                      >
                        <div className="min-w-0 flex-1 flex items-start gap-3">
                          {proj.image_url && (
                            <div className="w-12 h-12 rounded-lg overflow-hidden border border-black/10 dark:border-white/10 shrink-0 bg-black/10">
                              <img
                                src={proj.image_url}
                                alt={proj.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-bold text-xs text-zinc-900 dark:text-white">
                                {proj.title}
                              </span>
                              {proj.featured && (
                                <span className="text-[10px] font-semibold text-amber-500 uppercase tracking-wider">
                                  Featured
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-1 mb-1">
                              {proj.short_description}
                            </p>
                            <div className="text-[11px] font-mono text-zinc-400 dark:text-zinc-500">
                              {proj.tech_stack}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={() => {
                              setEditingProject(proj);
                              setIsNewProject(false);
                            }}
                            className="px-2.5 py-1 rounded-md text-xs font-medium border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/10 flex items-center gap-1"
                          >
                            <Edit2 className="w-3 h-3" />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => handleDeleteProject(proj.id, proj.title)}
                            className="p-1.5 rounded-md text-xs text-red-500 hover:bg-red-500/10 transition-colors"
                            title="Delete project"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ================= TAB 3: EXPERIENCE ================= */}
              {activeTab === "experience" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b pb-3 border-black/10 dark:border-white/10">
                    <div>
                      <h3 className="text-base font-bold text-zinc-900 dark:text-white">
                        Career Experience & Milestones ({experiences.length})
                      </h3>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400">
                        Manage roles at Persebaya ISMS, Karangwungu, and internships.
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setEditingExp({
                          role: "",
                          company: "",
                          company_url: "https://fiebryhoga.my.id/",
                          location: "Surabaya, Indonesia",
                          start_date: "Jan 2026",
                          end_date: "Present",
                          is_current: true,
                          description: "",
                          bullet_points: "",
                          order_index: experiences.length + 1,
                        });
                        setIsNewExp(true);
                      }}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 text-white hover:bg-blue-500 transition-colors flex items-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Experience</span>
                    </button>
                  </div>

                  {editingExp && (
                    <div
                      className={`p-4 rounded-xl border mb-4 space-y-3 ${
                        isDark ? "bg-white/5 border-white/15" : "bg-zinc-50 border-black/15"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs">
                          {isNewExp ? "New Experience" : `Edit Role at ${editingExp.company}`}
                        </span>
                        <button
                          onClick={() => setEditingExp(null)}
                          className="text-xs text-zinc-400 hover:text-zinc-700 dark:hover:text-white"
                        >
                          Cancel
                        </button>
                      </div>

                      <form onSubmit={handleSaveExperience} className="space-y-3 text-xs">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="font-semibold block mb-1">Role Title</label>
                            <input
                              type="text"
                              required
                              value={editingExp.role || ""}
                              onChange={(e) =>
                                setEditingExp({ ...editingExp, role: e.target.value })
                              }
                              className="w-full px-2.5 py-1.5 rounded-lg border bg-transparent border-black/15 dark:border-white/15 focus:outline-hidden"
                            />
                          </div>
                          <div>
                            <label className="font-semibold block mb-1">Company / Organization</label>
                            <input
                              type="text"
                              required
                              value={editingExp.company || ""}
                              onChange={(e) =>
                                setEditingExp({ ...editingExp, company: e.target.value })
                              }
                              className="w-full px-2.5 py-1.5 rounded-lg border bg-transparent border-black/15 dark:border-white/15 focus:outline-hidden"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div>
                            <label className="font-semibold block mb-1">Period (Start - End)</label>
                            <input
                              type="text"
                              value={editingExp.start_date || ""}
                              onChange={(e) =>
                                setEditingExp({ ...editingExp, start_date: e.target.value })
                              }
                              placeholder="Feb 2026"
                              className="w-full px-2.5 py-1.5 rounded-lg border bg-transparent border-black/15 dark:border-white/15 focus:outline-hidden"
                            />
                          </div>
                          <div>
                            <label className="font-semibold block mb-1">End Date</label>
                            <input
                              type="text"
                              value={editingExp.end_date || ""}
                              onChange={(e) =>
                                setEditingExp({ ...editingExp, end_date: e.target.value })
                              }
                              placeholder="Aug 2026 or Present"
                              className="w-full px-2.5 py-1.5 rounded-lg border bg-transparent border-black/15 dark:border-white/15 focus:outline-hidden"
                            />
                          </div>
                          <div>
                            <label className="font-semibold block mb-1">Location</label>
                            <input
                              type="text"
                              value={editingExp.location || ""}
                              onChange={(e) =>
                                setEditingExp({ ...editingExp, location: e.target.value })
                              }
                              className="w-full px-2.5 py-1.5 rounded-lg border bg-transparent border-black/15 dark:border-white/15 focus:outline-hidden"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="font-semibold block mb-1">Role Description</label>
                          <textarea
                            rows={2}
                            value={editingExp.description || ""}
                            onChange={(e) =>
                              setEditingExp({ ...editingExp, description: e.target.value })
                            }
                            className="w-full px-2.5 py-1.5 rounded-lg border bg-transparent border-black/15 dark:border-white/15 focus:outline-hidden"
                          />
                        </div>

                        <div>
                          <label className="font-semibold block mb-1">
                            Key Achievements (separate by | character)
                          </label>
                          <textarea
                            rows={3}
                            value={editingExp.bullet_points || ""}
                            onChange={(e) =>
                              setEditingExp({ ...editingExp, bullet_points: e.target.value })
                            }
                            className="w-full px-2.5 py-1.5 rounded-lg border bg-transparent border-black/15 dark:border-white/15 focus:outline-hidden font-mono text-[11px]"
                          />
                        </div>

                        <div className="flex items-center justify-between pt-2">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={!!editingExp.is_current}
                              onChange={(e) =>
                                setEditingExp({
                                  ...editingExp,
                                  is_current: e.target.checked,
                                })
                              }
                            />
                            <span>Currently Working Here</span>
                          </label>

                          <button
                            type="submit"
                            disabled={isLoading}
                            className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 text-white hover:bg-blue-500 transition-colors"
                          >
                            {isNewExp ? "Create Experience" : "Save Changes"}
                          </button>
                        </div>
                      </form>
                    </div>
                  )}

                  {/* Experiences List */}
                  <div className="space-y-2">
                    {experiences.map((exp) => (
                      <div
                        key={exp.id}
                        className={`p-3.5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors ${
                          isDark
                            ? "bg-white/5 border-white/10"
                            : "bg-white border-black/10 shadow-xs"
                        }`}
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-bold text-xs text-zinc-900 dark:text-white">
                              {exp.role}
                            </span>
                            <span className="text-zinc-400">@</span>
                            <span className="font-semibold text-xs text-zinc-700 dark:text-zinc-300">
                              {exp.company}
                            </span>
                          </div>
                          <div className="text-[11px] text-zinc-500 mb-1 font-mono">
                            {exp.start_date} – {exp.end_date} · {exp.location}
                          </div>
                          <p className="text-xs text-zinc-600 dark:text-zinc-400 line-clamp-2">
                            {exp.description}
                          </p>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={() => {
                              setEditingExp(exp);
                              setIsNewExp(false);
                            }}
                            className="px-2.5 py-1 rounded-md text-xs font-medium border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/10 flex items-center gap-1"
                          >
                            <Edit2 className="w-3 h-3" />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => handleDeleteExperience(exp.id, exp.company)}
                            className="p-1.5 rounded-md text-xs text-red-500 hover:bg-red-500/10 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ================= TAB 4: SKILLS ================= */}
              {activeTab === "skills" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b pb-3 border-black/10 dark:border-white/10">
                    <div>
                      <h3 className="text-base font-bold text-zinc-900 dark:text-white">
                        Skills & Proficiencies ({skills.length})
                      </h3>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400">
                        Technical arsenal displayed across Skills app and Spotlight.
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setEditingSkill({
                          name: "",
                          category: "Backend",
                          proficiency: 90,
                          icon_name: "Server",
                          order_index: skills.length + 1,
                        });
                        setIsNewSkill(true);
                      }}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 text-white hover:bg-blue-500 transition-colors flex items-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Skill</span>
                    </button>
                  </div>

                  {editingSkill && (
                    <div
                      className={`p-4 rounded-xl border mb-4 space-y-3 ${
                        isDark ? "bg-white/5 border-white/15" : "bg-zinc-50 border-black/15"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs">
                          {isNewSkill ? "Add Skill" : `Edit ${editingSkill.name}`}
                        </span>
                        <button
                          onClick={() => setEditingSkill(null)}
                          className="text-xs text-zinc-400 hover:text-zinc-700 dark:hover:text-white"
                        >
                          Cancel
                        </button>
                      </div>

                      <form onSubmit={handleSaveSkill} className="space-y-3 text-xs">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div>
                            <label className="font-semibold block mb-1">Skill Name</label>
                            <input
                              type="text"
                              required
                              value={editingSkill.name || ""}
                              onChange={(e) =>
                                setEditingSkill({ ...editingSkill, name: e.target.value })
                              }
                              className="w-full px-2.5 py-1.5 rounded-lg border bg-transparent border-black/15 dark:border-white/15 focus:outline-hidden"
                            />
                          </div>
                          <div>
                            <label className="font-semibold block mb-1">Category</label>
                            <select
                              value={editingSkill.category || "Backend"}
                              onChange={(e) =>
                                setEditingSkill({ ...editingSkill, category: e.target.value })
                              }
                              className="w-full px-2.5 py-1.5 rounded-lg border bg-transparent border-black/15 dark:border-white/15 focus:outline-hidden"
                            >
                              <option value="Backend" className="dark:bg-zinc-900">
                                Backend
                              </option>
                              <option value="Frontend" className="dark:bg-zinc-900">
                                Frontend
                              </option>
                              <option value="DevOps & Cloud" className="dark:bg-zinc-900">
                                DevOps & Cloud
                              </option>
                              <option value="Database & Tools" className="dark:bg-zinc-900">
                                Database & Tools
                              </option>
                            </select>
                          </div>
                          <div>
                            <label className="font-semibold block mb-1">
                              Proficiency ({editingSkill.proficiency}%)
                            </label>
                            <input
                              type="number"
                              min={1}
                              max={100}
                              value={editingSkill.proficiency || 80}
                              onChange={(e) =>
                                setEditingSkill({
                                  ...editingSkill,
                                  proficiency: parseInt(e.target.value) || 50,
                                })
                              }
                              className="w-full px-2.5 py-1.5 rounded-lg border bg-transparent border-black/15 dark:border-white/15 focus:outline-hidden font-mono"
                            />
                          </div>
                        </div>

                        <div className="flex justify-end pt-2">
                          <button
                            type="submit"
                            disabled={isLoading}
                            className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 text-white hover:bg-blue-500 transition-colors"
                          >
                            {isNewSkill ? "Create Skill" : "Save Changes"}
                          </button>
                        </div>
                      </form>
                    </div>
                  )}

                  {/* Skills Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {skills.map((skill) => (
                      <div
                        key={skill.id}
                        className={`p-3 rounded-xl border flex items-center justify-between gap-3 ${
                          isDark
                            ? "bg-white/5 border-white/10"
                            : "bg-white border-black/10 shadow-xs"
                        }`}
                      >
                        <div className="min-w-0 flex-1">
                          <div className="font-bold text-xs text-zinc-900 dark:text-white truncate">
                            {skill.name}
                          </div>
                          <div className="text-[11px] text-zinc-500 flex items-center gap-2">
                            <span>{skill.category}</span>
                            <span>·</span>
                            <span className="font-mono">{skill.proficiency}%</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            onClick={() => {
                              setEditingSkill(skill);
                              setIsNewSkill(false);
                            }}
                            className="p-1 rounded-md text-xs text-zinc-500 hover:text-zinc-800 dark:hover:text-white"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteSkill(skill.id, skill.name)}
                            className="p-1 rounded-md text-xs text-red-500 hover:bg-red-500/10"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ================= TAB 5: WRITING & ARTICLES ================= */}
              {activeTab === "writing" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b pb-3 border-black/10 dark:border-white/10">
                    <div>
                      <h3 className="text-base font-bold text-zinc-900 dark:text-white">
                        Writing & Published Articles ({articles.length})
                      </h3>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400">
                        Manage technical articles, case studies, and engineering essays.
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setEditingArticle({
                          title: "",
                          slug: "",
                          category: "Engineering",
                          reading_time: "5 min read",
                          excerpt: "",
                          content: "# Title\n\nWrite your article here...",
                          is_published: true,
                        });
                        setIsNewArticle(true);
                      }}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 text-white hover:bg-blue-500 transition-colors flex items-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Write New Article</span>
                    </button>
                  </div>

                  {editingArticle && (
                    <div
                      className={`p-4 rounded-xl border mb-4 space-y-3 ${
                        isDark ? "bg-white/5 border-white/15" : "bg-zinc-50 border-black/15"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs">
                          {isNewArticle ? "Write Article" : `Edit ${editingArticle.title}`}
                        </span>
                        <button
                          onClick={() => setEditingArticle(null)}
                          className="text-xs text-zinc-400 hover:text-zinc-700 dark:hover:text-white"
                        >
                          Cancel
                        </button>
                      </div>

                      <form onSubmit={handleSaveArticle} className="space-y-3 text-xs">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="font-semibold block mb-1">Title</label>
                            <input
                              type="text"
                              required
                              value={editingArticle.title || ""}
                              onChange={(e) =>
                                setEditingArticle({
                                  ...editingArticle,
                                  title: e.target.value,
                                  slug:
                                    isNewArticle
                                      ? e.target.value
                                          .toLowerCase()
                                          .replace(/[^a-z0-9]+/g, "-")
                                          .replace(/(^-|-$)/g, "")
                                      : editingArticle.slug,
                                })
                              }
                              className="w-full px-2.5 py-1.5 rounded-lg border bg-transparent border-black/15 dark:border-white/15 focus:outline-hidden"
                            />
                          </div>
                          <div>
                            <label className="font-semibold block mb-1">Slug</label>
                            <input
                              type="text"
                              required
                              value={editingArticle.slug || ""}
                              onChange={(e) =>
                                setEditingArticle({
                                  ...editingArticle,
                                  slug: e.target.value,
                                })
                              }
                              className="w-full px-2.5 py-1.5 rounded-lg border bg-transparent border-black/15 dark:border-white/15 focus:outline-hidden font-mono"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="font-semibold block mb-1">Category</label>
                            <input
                              type="text"
                              value={editingArticle.category || "Engineering"}
                              onChange={(e) =>
                                setEditingArticle({
                                  ...editingArticle,
                                  category: e.target.value,
                                })
                              }
                              className="w-full px-2.5 py-1.5 rounded-lg border bg-transparent border-black/15 dark:border-white/15 focus:outline-hidden"
                            />
                          </div>
                          <div>
                            <label className="font-semibold block mb-1">Reading Time</label>
                            <input
                              type="text"
                              value={editingArticle.reading_time || "5 min read"}
                              onChange={(e) =>
                                setEditingArticle({
                                  ...editingArticle,
                                  reading_time: e.target.value,
                                })
                              }
                              className="w-full px-2.5 py-1.5 rounded-lg border bg-transparent border-black/15 dark:border-white/15 focus:outline-hidden font-mono"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="font-semibold block mb-1">Excerpt / Summary</label>
                          <input
                            type="text"
                            required
                            value={editingArticle.excerpt || ""}
                            onChange={(e) =>
                              setEditingArticle({
                                ...editingArticle,
                                excerpt: e.target.value,
                              })
                            }
                            className="w-full px-2.5 py-1.5 rounded-lg border bg-transparent border-black/15 dark:border-white/15 focus:outline-hidden"
                          />
                        </div>

                        <div>
                          <label className="font-semibold block mb-1">
                            Article Markdown Content
                          </label>
                          <textarea
                            rows={8}
                            value={editingArticle.content || ""}
                            onChange={(e) =>
                              setEditingArticle({
                                ...editingArticle,
                                content: e.target.value,
                              })
                            }
                            className="w-full px-2.5 py-1.5 rounded-lg border bg-transparent border-black/15 dark:border-white/15 focus:outline-hidden font-mono text-[11px] leading-relaxed"
                          />
                        </div>

                        <div className="flex justify-end pt-2">
                          <button
                            type="submit"
                            disabled={isLoading}
                            className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 text-white hover:bg-blue-500 transition-colors"
                          >
                            {isNewArticle ? "Publish Article" : "Save Changes"}
                          </button>
                        </div>
                      </form>
                    </div>
                  )}

                  {/* Articles List */}
                  <div className="space-y-2">
                    {articles.map((art) => (
                      <div
                        key={art.id}
                        className={`p-3.5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors ${
                          isDark
                            ? "bg-white/5 border-white/10"
                            : "bg-white border-black/10 shadow-xs"
                        }`}
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-bold text-xs text-zinc-900 dark:text-white">
                              {art.title}
                            </span>
                            <span className="text-[10px] text-zinc-400 font-mono">
                              ({art.reading_time})
                            </span>
                          </div>
                          <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-1 mb-1">
                            {art.excerpt}
                          </p>
                          <div className="text-[11px] text-zinc-400 font-mono">
                            Category: {art.category} · Slug: /{art.slug}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={() => {
                              setEditingArticle(art);
                              setIsNewArticle(false);
                            }}
                            className="px-2.5 py-1 rounded-md text-xs font-medium border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/10 flex items-center gap-1"
                          >
                            <Edit2 className="w-3 h-3" />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => handleDeleteArticle(art.id, art.title)}
                            className="p-1.5 rounded-md text-xs text-red-500 hover:bg-red-500/10"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ================= TAB 6: CONTACT MESSAGES ================= */}
              {activeTab === "messages" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b pb-3 border-black/10 dark:border-white/10">
                    <div>
                      <h3 className="text-base font-bold text-zinc-900 dark:text-white">
                        Contact Inquiries & Terminal Messages ({messages.length})
                      </h3>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400">
                        Live inquiries received from visitors via the website or terminal bash.
                      </p>
                    </div>
                  </div>

                  {messages.length === 0 ? (
                    <div className="py-12 text-center text-xs text-zinc-400">
                      Belum ada pesan masuk di database PostgreSQL.
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      {messages.map((msg) => (
                        <div
                          key={msg.id}
                          className={`p-4 rounded-xl border transition-colors ${
                            !msg.is_read
                              ? isDark
                                ? "bg-blue-500/5 border-blue-500/30"
                                : "bg-blue-50/50 border-blue-500/20"
                              : isDark
                              ? "bg-white/5 border-white/10"
                              : "bg-white border-black/10"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3 mb-2">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-xs text-zinc-900 dark:text-white">
                                  {msg.name}
                                </span>
                                <span className="text-xs text-zinc-400 font-mono">
                                  &lt;{msg.email}&gt;
                                </span>
                                {!msg.is_read && (
                                  <span className="text-[10px] font-semibold text-blue-500">
                                    ● Unread
                                  </span>
                                )}
                              </div>
                              <div className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 mt-0.5">
                                {msg.subject}
                              </div>
                            </div>
                            <span className="text-[10px] text-zinc-400 font-mono shrink-0">
                              {new Date(msg.created_at).toLocaleDateString()}
                            </span>
                          </div>

                          <p className="text-xs text-zinc-600 dark:text-zinc-300 whitespace-pre-wrap leading-relaxed mb-3">
                            {msg.message}
                          </p>

                          <div className="flex items-center justify-end gap-2 border-t pt-2 border-black/5 dark:border-white/5">
                            {!msg.is_read && (
                              <button
                                onClick={() => handleMarkMessageRead(msg.id)}
                                className="px-2.5 py-1 rounded-md text-xs font-medium border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/10 flex items-center gap-1"
                              >
                                <Check className="w-3 h-3" />
                                <span>Mark Read</span>
                              </button>
                            )}
                            <button
                              onClick={() => handleDeleteMessage(msg.id)}
                              className="px-2 py-1 rounded-md text-xs font-medium text-red-500 hover:bg-red-500/10 flex items-center gap-1"
                            >
                              <Trash2 className="w-3 h-3" />
                              <span>Delete</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* ================= TAB 7: SYSTEM INFO ================= */}
              {activeTab === "system" && (
                <div className="max-w-2xl space-y-4 text-xs">
                  <div className="border-b pb-3 border-black/10 dark:border-white/10">
                    <h3 className="text-base font-bold text-zinc-900 dark:text-white">
                      System & Architecture Diagnostics
                    </h3>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                      Live status of microservices, database, uploads, and authentication tokens.
                    </p>
                  </div>

                  <div
                    className={`p-4 rounded-xl border space-y-2.5 ${
                      isDark ? "bg-white/5 border-white/10" : "bg-zinc-50 border-black/10"
                    }`}
                  >
                    <div className="flex justify-between py-1 border-b border-black/5 dark:border-white/5">
                      <span className="text-zinc-500">Backend Server</span>
                      <span className="font-mono text-emerald-500 font-semibold">
                        Go 1.24 + Gin Engine (Port 8080)
                      </span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-black/5 dark:border-white/5">
                      <span className="text-zinc-500">File Upload Server</span>
                      <span className="font-mono text-emerald-500 font-semibold">
                        POST /api/v1/admin/upload (Static /uploads)
                      </span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-black/5 dark:border-white/5">
                      <span className="text-zinc-500">Database</span>
                      <span className="font-mono text-emerald-500 font-semibold">
                        PostgreSQL 15 (portfolio_dev) via GORM
                      </span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-black/5 dark:border-white/5">
                      <span className="text-zinc-500">Frontend Framework</span>
                      <span className="font-mono text-zinc-700 dark:text-zinc-300">
                        Next.js 16 + React 19 + TypeScript
                      </span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-black/5 dark:border-white/5">
                      <span className="text-zinc-500">Session JWT Token</span>
                      <span className="font-mono text-zinc-500 truncate max-w-[200px]">
                        {token}
                      </span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-zinc-500">Default Credentials</span>
                      <span className="font-mono text-zinc-700 dark:text-zinc-300">
                        admin@portfolio.dev / Admin@123456
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 text-zinc-400 text-[11px] leading-relaxed">
                    Keyboard Shortcut: Press <kbd className="px-1.5 py-0.5 rounded border border-black/20 dark:border-white/20 font-mono">⌘ + Shift + A</kbd> or click  &gt; <strong>Admin Portal & Content Manager...</strong> from anywhere on the desktop to instantly access this panel.
                  </div>
                </div>
              )}
            </main>
          </div>
        )}
      </div>
    </div>
  );
}

function SidebarItem({
  icon,
  label,
  count,
  unreadCount,
  active,
  onClick,
  isDark,
}: {
  icon: React.ReactNode;
  label: string;
  count?: number;
  unreadCount?: number;
  active: boolean;
  onClick: () => void;
  isDark: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
        active
          ? "bg-blue-600 text-white"
          : isDark
          ? "text-zinc-300 hover:bg-white/10 hover:text-white"
          : "text-zinc-700 hover:bg-black/5 hover:text-zinc-950"
      }`}
    >
      <div className="flex items-center gap-2.5 truncate">
        <span className={active ? "text-white" : "opacity-70"}>{icon}</span>
        <span className="truncate">{label}</span>
      </div>
      {count !== undefined && (
        <span
          className={`text-[10px] font-mono ${
            active
              ? "text-white/90"
              : unreadCount && unreadCount > 0
              ? "text-blue-500 font-bold"
              : "opacity-50"
          }`}
        >
          {count}
        </span>
      )}
    </button>
  );
}
