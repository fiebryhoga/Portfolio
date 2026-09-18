"use client";

import React, { useState, useMemo } from "react";
import { Article } from "@/types";
import { createArticle } from "@/lib/api";
import {
  BookOpen,
  PenLine,
  Calendar,
  Clock,
  Search,
  X,
  ArrowLeft,
  Copy,
  Check,
  Share2,
  Send,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Eye,
  FileText,
} from "lucide-react";
import { useDesktop } from "@/context/DesktopContext";

interface ArticlesProps {
  articles: Article[];
  onArticleCreated?: (newArticle: Article) => void;
}

export const Articles: React.FC<ArticlesProps> = ({
  articles: initialArticles,
  onArticleCreated,
}) => {
  const { theme } = useDesktop();
  const isDark = theme === "dark";

  const [articles, setArticles] = useState<Article[]>(initialArticles);
  const [selectedSlug, setSelectedSlug] = useState<string>(
    initialArticles[0]?.slug || ""
  );

  React.useEffect(() => {
    setArticles(initialArticles);
    if (!selectedSlug && initialArticles.length > 0) {
      setSelectedSlug(initialArticles[0].slug);
    }
  }, [initialArticles]);
  const [activeTab, setActiveTab] = useState<"read" | "publish">("read");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  // Mobile detail view toggle
  const [mobileReading, setMobileReading] = useState<boolean>(false);

  // Publishing Form State
  const [formTitle, setFormTitle] = useState("");
  const [formCategory, setFormCategory] = useState("Engineering");
  const [formReadingTime, setFormReadingTime] = useState("5 min read");
  const [formExcerpt, setFormExcerpt] = useState("");
  const [formContent, setFormContent] = useState("");
  const [publishStatus, setPublishStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [publishMessage, setPublishMessage] = useState("");
  const [showPreview, setShowPreview] = useState(false);

  // Extract unique categories
  const categories = useMemo(() => {
    const cats = new Set<string>();
    cats.add("All");
    articles.forEach((a) => {
      if (a.category) cats.add(a.category);
    });
    return Array.from(cats);
  }, [articles]);

  const filteredArticles = useMemo(() => {
    return articles.filter((a) => {
      const matchCat =
        selectedCategory === "All" ||
        a.category.toLowerCase() === selectedCategory.toLowerCase();
      const matchSearch =
        searchQuery.trim() === "" ||
        a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [articles, selectedCategory, searchQuery]);

  const selectedArticle = useMemo(() => {
    return (
      articles.find((a) => a.slug === selectedSlug) ||
      filteredArticles[0] ||
      articles[0]
    );
  }, [articles, selectedSlug, filteredArticles]);

  const handleCopyLink = () => {
    if (typeof window !== "undefined" && selectedArticle) {
      navigator.clipboard.writeText(
        `${window.location.origin}/#articles-${selectedArticle.slug}`
      );
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formContent.trim()) {
      setPublishStatus("error");
      setPublishMessage("Title and Content are required.");
      return;
    }

    setPublishStatus("loading");
    setPublishMessage("");

    const newArticlePayload: Partial<Article> = {
      title: formTitle.trim(),
      category: formCategory.trim() || "Engineering",
      reading_time: formReadingTime.trim() || "5 min read",
      excerpt:
        formExcerpt.trim() ||
        formContent.slice(0, 160).replace(/[#*`_]/g, "") + "...",
      content: formContent,
      is_published: true,
      published_at: new Date().toISOString(),
    };

    try {
      const created = await createArticle(newArticlePayload);
      setArticles((prev) => [created, ...prev]);
      if (onArticleCreated) onArticleCreated(created);

      setSelectedSlug(created.slug);
      setPublishStatus("success");
      setPublishMessage("Article published successfully!");

      // Reset form
      setFormTitle("");
      setFormExcerpt("");
      setFormContent("");

      // Switch to reading mode
      setTimeout(() => {
        setActiveTab("read");
        setMobileReading(true);
      }, 700);
    } catch (err: unknown) {
      setPublishStatus("error");
      const msg =
        err instanceof Error
          ? err.message
          : "Failed to publish article. Please check backend.";
      setPublishMessage(msg);
    }
  };

  // Simple Markdown-style parser for rendering content cleanly
  const renderMarkdownContent = (raw: string) => {
    const lines = raw.split("\n");
    const elements: React.ReactNode[] = [];
    let inCodeBlock = false;
    let codeBuffer: string[] = [];

    lines.forEach((line, idx) => {
      // Code Block toggle
      if (line.trim().startsWith("```")) {
        if (inCodeBlock) {
          elements.push(
            <pre
              key={`code-${idx}`}
              className={`p-3.5 rounded-lg font-mono text-xs overflow-x-auto my-3 border leading-relaxed ${
                isDark
                  ? "bg-zinc-950/80 border-white/10 text-emerald-300"
                  : "bg-zinc-900 border-black/10 text-emerald-300"
              }`}
            >
              <code>{codeBuffer.join("\n")}</code>
            </pre>
          );
          codeBuffer = [];
          inCodeBlock = false;
        } else {
          inCodeBlock = true;
        }
        return;
      }

      if (inCodeBlock) {
        codeBuffer.push(line);
        return;
      }

      // Headings
      if (line.startsWith("### ")) {
        elements.push(
          <h3
            key={`h3-${idx}`}
            className={`text-base sm:text-lg font-bold tracking-tight mt-5 mb-2 ${
              isDark ? "text-white" : "text-zinc-950"
            }`}
          >
            {line.replace("### ", "")}
          </h3>
        );
        return;
      }
      if (line.startsWith("## ")) {
        elements.push(
          <h2
            key={`h2-${idx}`}
            className={`text-lg sm:text-xl font-bold tracking-tight mt-6 mb-2 ${
              isDark ? "text-white" : "text-zinc-950"
            }`}
          >
            {line.replace("## ", "")}
          </h2>
        );
        return;
      }

      // Horizontal Divider
      if (line.trim() === "---") {
        elements.push(
          <hr
            key={`hr-${idx}`}
            className={`my-4 border-t ${
              isDark ? "border-white/10" : "border-black/10"
            }`}
          />
        );
        return;
      }

      // List Item
      if (line.trim().startsWith("- ") || line.trim().startsWith("• ")) {
        const text = line.trim().replace(/^[-•]\s+/, "");
        elements.push(
          <div
            key={`li-${idx}`}
            className={`flex items-start gap-2 text-xs sm:text-sm my-1 leading-relaxed ${
              isDark ? "text-zinc-300" : "text-zinc-700"
            }`}
          >
            <span className="text-zinc-400 font-mono mt-0.5 select-none">•</span>
            <span>{text}</span>
          </div>
        );
        return;
      }

      // Empty Line
      if (line.trim() === "") {
        elements.push(<div key={`sp-${idx}`} className="h-2" />);
        return;
      }

      // Regular Paragraph
      elements.push(
        <p
          key={`p-${idx}`}
          className={`text-xs sm:text-sm leading-relaxed my-1.5 font-normal ${
            isDark ? "text-zinc-300" : "text-zinc-700"
          }`}
        >
          {line}
        </p>
      );
    });

    return elements;
  };

  return (
    <div className="@container max-w-5xl mx-auto py-5 sm:py-7 px-3 sm:px-6 select-text space-y-5">
      {/* 1. Header (macOS App Style, Zero Background Badges) */}
      <div
        className={`pb-4 border-b transition-colors ${
          isDark ? "border-white/10" : "border-black/10"
        }`}
      >
        <div className="flex flex-col @[620px]:flex-row @[620px]:items-center justify-between gap-3 mb-2">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1
                className={`text-xl sm:text-2xl font-bold tracking-tight ${
                  isDark ? "text-white" : "text-zinc-950"
                }`}
              >
                Writing &amp; Publications
              </h1>
              <span
                className={`text-xs font-mono font-medium ${
                  isDark ? "text-zinc-400" : "text-zinc-500"
                }`}
              >
                / {articles.length} Articles
              </span>
            </div>
            <p
              className={`text-xs sm:text-sm font-normal max-w-2xl ${
                isDark ? "text-zinc-400" : "text-zinc-600"
              }`}
            >
              Technical articles, system architectures, and sports analytics research by Dimas Fiebry.
            </p>
          </div>

          {/* Clean Text Tabs (Zero BG Badges) */}
          <div className="flex items-center gap-5 text-xs font-medium shrink-0">
            <button
              onClick={() => {
                setActiveTab("read");
                setMobileReading(false);
              }}
              className={`flex items-center gap-1.5 pb-1.5 transition-colors cursor-pointer border-b-2 ${
                activeTab === "read"
                  ? isDark
                    ? "text-white border-white font-semibold"
                    : "text-zinc-950 border-zinc-950 font-semibold"
                  : isDark
                  ? "text-zinc-400 hover:text-zinc-200 border-transparent"
                  : "text-zinc-500 hover:text-zinc-800 border-transparent"
              }`}
            >
              <BookOpen size={13} />
              <span>Library</span>
            </button>

            <button
              onClick={() => setActiveTab("publish")}
              className={`flex items-center gap-1.5 pb-1.5 transition-colors cursor-pointer border-b-2 ${
                activeTab === "publish"
                  ? isDark
                    ? "text-white border-white font-semibold"
                    : "text-zinc-950 border-zinc-950 font-semibold"
                  : isDark
                  ? "text-zinc-400 hover:text-zinc-200 border-transparent"
                  : "text-zinc-500 hover:text-zinc-800 border-transparent"
              }`}
            >
              <PenLine size={13} />
              <span>Write &amp; Publish</span>
            </button>
          </div>
        </div>

        {/* Category Underline Filters & Search (Only shown in Reader tab) */}
        {activeTab === "read" && (
          <div className="flex flex-col @[580px]:flex-row @[580px]:items-center justify-between gap-3 mt-4">
            <div className="flex items-center gap-5 text-xs font-medium overflow-x-auto">
              {categories.map((cat) => {
                const isActive = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => {
                      setSelectedCategory(cat);
                      setMobileReading(false);
                    }}
                    className={`pb-1.5 -mb-px transition-colors cursor-pointer shrink-0 border-b-2 ${
                      isActive
                        ? isDark
                          ? "text-white border-white font-semibold"
                          : "text-zinc-950 border-zinc-950 font-semibold"
                        : isDark
                        ? "text-zinc-400 hover:text-zinc-200 border-transparent"
                        : "text-zinc-500 hover:text-zinc-800 border-transparent"
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>

            {/* Minimalist Search */}
            <div className="relative w-full @[580px]:w-52 shrink-0">
              <Search
                size={12}
                className={`absolute left-2.5 top-1/2 -translate-y-1/2 ${
                  isDark ? "text-zinc-500" : "text-zinc-400"
                }`}
              />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-8 pr-7 py-1 rounded-lg text-xs outline-none border transition-colors ${
                  isDark
                    ? "bg-transparent border-white/15 text-white placeholder-zinc-500 focus:border-white/40"
                    : "bg-transparent border-black/15 text-zinc-950 placeholder-zinc-400 focus:border-black/40"
                }`}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-200"
                >
                  <X size={12} />
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 2. Main Content Area */}
      {activeTab === "read" ? (
        <div className="grid grid-cols-1 @[740px]:grid-cols-12 gap-5 items-start">
          {/* Master List (Left Column) */}
          <div
            className={`@[740px]:col-span-5 space-y-2.5 ${
              mobileReading ? "hidden @[740px]:block" : "block"
            }`}
          >
            {filteredArticles.length === 0 ? (
              <div
                className={`p-8 text-center rounded-xl border border-dashed text-xs ${
                  isDark
                    ? "border-white/15 text-zinc-400"
                    : "border-black/15 text-zinc-500"
                }`}
              >
                No articles found matching your criteria.
              </div>
            ) : (
              filteredArticles.map((article) => {
                const isSelected = selectedArticle?.id === article.id;
                return (
                  <button
                    key={article.id}
                    onClick={() => {
                      setSelectedSlug(article.slug);
                      setMobileReading(true);
                    }}
                    className={`w-full text-left p-3.5 rounded-xl border transition-all cursor-pointer block ${
                      isSelected
                        ? isDark
                          ? "bg-zinc-800/80 border-white/20 shadow-xs"
                          : "bg-zinc-100 border-black/20 shadow-xs"
                        : isDark
                        ? "bg-zinc-900/40 border-white/10 hover:border-white/20 hover:bg-zinc-900/70"
                        : "bg-white border-black/10 hover:border-black/20 hover:bg-zinc-50/80"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1 text-[11px] font-mono">
                      <span
                        className={isDark ? "text-zinc-400" : "text-zinc-500"}
                      >
                        {article.category}
                      </span>
                      <span
                        className={isDark ? "text-zinc-500" : "text-zinc-400"}
                      >
                        {article.reading_time}
                      </span>
                    </div>

                    <h2
                      className={`text-xs sm:text-sm font-bold tracking-tight leading-snug ${
                        isDark ? "text-white" : "text-zinc-950"
                      }`}
                    >
                      {article.title}
                    </h2>

                    <p
                      className={`text-[11.5px] line-clamp-2 mt-1 leading-relaxed ${
                        isDark ? "text-zinc-400" : "text-zinc-600"
                      }`}
                    >
                      {article.excerpt}
                    </p>
                  </button>
                );
              })
            )}
          </div>

          {/* Reader Detail (Right Column) */}
          <div
            className={`@[740px]:col-span-7 ${
              mobileReading ? "block" : "hidden @[740px]:block"
            }`}
          >
            {selectedArticle ? (
              <div
                className={`rounded-xl p-5 sm:p-7 border transition-colors ${
                  isDark
                    ? "bg-zinc-900/40 border-white/10"
                    : "bg-white border-black/10 shadow-xs"
                }`}
              >
                {/* Mobile Back Button */}
                <button
                  onClick={() => setMobileReading(false)}
                  className={`@[740px]:hidden inline-flex items-center gap-1 text-xs mb-3 font-medium cursor-pointer ${
                    isDark
                      ? "text-zinc-400 hover:text-white"
                      : "text-zinc-600 hover:text-black"
                  }`}
                >
                  <ArrowLeft size={13} />
                  <span>Back to Articles</span>
                </button>

                {/* Article Header */}
                <div className="pb-4 border-b border-black/10 dark:border-white/10 mb-5">
                  <div className="flex items-center gap-3 text-xs font-mono mb-2 flex-wrap text-zinc-500 dark:text-zinc-400">
                    <span>{selectedArticle.category}</span>
                    <span>•</span>
                    <span className="inline-flex items-center gap-1">
                      <Clock size={11} className="opacity-70" />
                      {selectedArticle.reading_time}
                    </span>
                    <span>•</span>
                    <span className="inline-flex items-center gap-1">
                      <Calendar size={11} className="opacity-70" />
                      {new Date(selectedArticle.published_at).toLocaleDateString(
                        "en-US",
                        {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        }
                      )}
                    </span>
                  </div>

                  <h1
                    className={`text-lg sm:text-2xl font-bold tracking-tight leading-snug mb-3 ${
                      isDark ? "text-white" : "text-zinc-950"
                    }`}
                  >
                    {selectedArticle.title}
                  </h1>

                  <div className="flex items-center justify-between gap-3 flex-wrap text-xs pt-1">
                    <span
                      className={`font-medium ${
                        isDark ? "text-zinc-300" : "text-zinc-700"
                      }`}
                    >
                      By Dimas Fiebry Prayhoga Putra
                    </span>

                    <button
                      onClick={handleCopyLink}
                      className={`inline-flex items-center gap-1 text-xs cursor-pointer font-medium ${
                        isDark
                          ? "text-zinc-400 hover:text-white"
                          : "text-zinc-600 hover:text-black"
                      }`}
                    >
                      {copiedLink ? (
                        <>
                          <Check size={12} className="text-emerald-500" />
                          <span className="text-emerald-500">Link Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy size={12} />
                          <span>Copy Link</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Article Body Content */}
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  {renderMarkdownContent(selectedArticle.content)}
                </div>

                {/* Author Footer Sign-off */}
                <div
                  className={`mt-8 pt-5 border-t text-xs flex items-center justify-between gap-3 flex-wrap ${
                    isDark
                      ? "border-white/10 text-zinc-400"
                      : "border-black/10 text-zinc-600"
                  }`}
                >
                  <p>
                    Published in <strong>{selectedArticle.category}</strong>.
                    Feedback? Reach out through the Contact app.
                  </p>
                  <span className="font-mono text-[11px] opacity-60">
                    ID: #{selectedArticle.id}
                  </span>
                </div>
              </div>
            ) : (
              <div
                className={`p-12 text-center rounded-xl border border-dashed text-xs ${
                  isDark
                    ? "border-white/15 text-zinc-400"
                    : "border-black/15 text-zinc-500"
                }`}
              >
                Select an article from the list to read.
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Publisher Mode: Write & Publish Form */
        <div
          className={`rounded-xl p-5 sm:p-7 border transition-colors max-w-3xl mx-auto ${
            isDark
              ? "bg-zinc-900/40 border-white/10"
              : "bg-white border-black/10 shadow-xs"
          }`}
        >
          <div className="flex items-center justify-between pb-3 border-b border-black/10 dark:border-white/10 mb-4">
            <div>
              <h2
                className={`text-base font-bold tracking-tight ${
                  isDark ? "text-white" : "text-zinc-950"
                }`}
              >
                Publish New Article
              </h2>
              <p
                className={`text-xs mt-0.5 ${
                  isDark ? "text-zinc-400" : "text-zinc-600"
                }`}
              >
                Draft technical essays or notes. Once published, anyone visiting your portfolio can read it.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowPreview((p) => !p)}
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium border cursor-pointer ${
                showPreview
                  ? isDark
                    ? "bg-white text-black border-white"
                    : "bg-black text-white border-black"
                  : isDark
                  ? "border-white/20 text-zinc-300 hover:text-white"
                  : "border-black/20 text-zinc-700 hover:text-black"
              }`}
            >
              <Eye size={12} />
              <span>{showPreview ? "Edit Mode" : "Preview"}</span>
            </button>
          </div>

          {publishStatus === "success" && (
            <div className="mb-4 p-3 rounded-lg border text-xs flex items-center gap-2 bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20 text-emerald-800 dark:text-emerald-300">
              <CheckCircle2 size={14} className="shrink-0" />
              <span>{publishMessage}</span>
            </div>
          )}

          {publishStatus === "error" && (
            <div className="mb-4 p-3 rounded-lg border text-xs flex items-center gap-2 bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/20 text-red-800 dark:text-red-300">
              <AlertCircle size={14} className="shrink-0" />
              <span>{publishMessage}</span>
            </div>
          )}

          {showPreview ? (
            /* Live Preview Pane */
            <div className="space-y-4 py-2">
              <div className="pb-3 border-b border-black/10 dark:border-white/10">
                <div className="text-xs font-mono text-zinc-500 mb-1">
                  {formCategory} • {formReadingTime}
                </div>
                <h1
                  className={`text-xl font-bold ${
                    isDark ? "text-white" : "text-zinc-950"
                  }`}
                >
                  {formTitle || "Untitled Article"}
                </h1>
                {formExcerpt && (
                  <p
                    className={`text-xs italic mt-1.5 ${
                      isDark ? "text-zinc-400" : "text-zinc-600"
                    }`}
                  >
                    {formExcerpt}
                  </p>
                )}
              </div>
              <div>{renderMarkdownContent(formContent || "*No content entered yet.*")}</div>
            </div>
          ) : (
            /* Edit Form */
            <form onSubmit={handlePublish} className="space-y-4">
              <div>
                <label
                  className={`block text-xs font-medium mb-1 ${
                    isDark ? "text-zinc-300" : "text-zinc-700"
                  }`}
                >
                  Article Title <span className="opacity-60">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Architecting Distributed Systems with Go"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className={`w-full px-3 py-2 rounded-lg text-xs border outline-none transition-colors ${
                    isDark
                      ? "bg-white/5 border-white/15 text-white placeholder-zinc-500 focus:border-white/40"
                      : "bg-black/[0.02] border-black/15 text-zinc-950 placeholder-zinc-400 focus:border-black/40 focus:bg-white"
                  }`}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label
                    className={`block text-xs font-medium mb-1 ${
                      isDark ? "text-zinc-300" : "text-zinc-700"
                    }`}
                  >
                    Category
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Sports Analytics, Backend, Fullstack"
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className={`w-full px-3 py-2 rounded-lg text-xs border outline-none transition-colors ${
                      isDark
                        ? "bg-white/5 border-white/15 text-white placeholder-zinc-500 focus:border-white/40"
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
                    Estimated Reading Time
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 5 min read"
                    value={formReadingTime}
                    onChange={(e) => setFormReadingTime(e.target.value)}
                    className={`w-full px-3 py-2 rounded-lg text-xs border outline-none transition-colors ${
                      isDark
                        ? "bg-white/5 border-white/15 text-white placeholder-zinc-500 focus:border-white/40"
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
                  Short Excerpt / Summary
                </label>
                <input
                  type="text"
                  placeholder="Brief 1-2 sentence overview shown in the article card..."
                  value={formExcerpt}
                  onChange={(e) => setFormExcerpt(e.target.value)}
                  className={`w-full px-3 py-2 rounded-lg text-xs border outline-none transition-colors ${
                    isDark
                      ? "bg-white/5 border-white/15 text-white placeholder-zinc-500 focus:border-white/40"
                      : "bg-black/[0.02] border-black/15 text-zinc-950 placeholder-zinc-400 focus:border-black/40 focus:bg-white"
                  }`}
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label
                    className={`text-xs font-medium ${
                      isDark ? "text-zinc-300" : "text-zinc-700"
                    }`}
                  >
                    Article Content (Markdown supported) <span className="opacity-60">*</span>
                  </label>
                  <span className="text-[11px] font-mono text-zinc-400">
                    ### Headings, ```code, - lists
                  </span>
                </div>
                <textarea
                  required
                  rows={10}
                  placeholder="Write your article here... You can use Markdown like ### Headers, - bullet points, and ```code blocks."
                  value={formContent}
                  onChange={(e) => setFormContent(e.target.value)}
                  className={`w-full px-3 py-2.5 rounded-lg text-xs font-mono border outline-none resize-y transition-colors leading-relaxed ${
                    isDark
                      ? "bg-white/5 border-white/15 text-white placeholder-zinc-500 focus:border-white/40"
                      : "bg-black/[0.02] border-black/15 text-zinc-950 placeholder-zinc-400 focus:border-black/40 focus:bg-white"
                  }`}
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={publishStatus === "loading"}
                  className={`w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg font-semibold text-xs transition-all cursor-pointer disabled:opacity-50 ${
                    isDark
                      ? "bg-white text-black hover:bg-zinc-200"
                      : "bg-black text-white hover:bg-zinc-800"
                  }`}
                >
                  {publishStatus === "loading" ? (
                    <>
                      <Loader2 size={13} className="animate-spin" />
                      <span>Publishing to Portfolio...</span>
                    </>
                  ) : (
                    <>
                      <Send size={13} />
                      <span>Publish Article Now</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
};
