import React, { useState } from "react";
import { Profile } from "@/types";
import { sendContactMessage } from "@/lib/api";
import { Mail, Phone, MapPin, Send, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { useDesktop } from "@/context/DesktopContext";

interface ContactProps {
  profile: Profile;
}

export const Contact: React.FC<ContactProps> = ({ profile }) => {
  const { theme } = useDesktop();
  const isDark = theme === "dark";

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [feedbackMessage, setFeedbackMessage] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
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
      setFeedbackMessage(res.message || "Message sent successfully!");
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (err: unknown) {
      setStatus("error");
      const message = err instanceof Error ? err.message : "Failed to send message. Please try again later.";
      setFeedbackMessage(message);
    }
  };

  return (
    <section id="contact" className="py-4 sm:py-6 px-2 sm:px-4 relative">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left Column: Contact Info */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              <div
                className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border mb-3 ${
                  isDark
                    ? "bg-zinc-900/80 text-zinc-300 border-white/15"
                    : "bg-zinc-100 text-zinc-800 border-black/10 shadow-xs"
                }`}
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Get In Touch</span>
              </div>
              <h2 className={`text-3xl sm:text-4xl font-extrabold tracking-tight ${isDark ? "text-white" : "text-zinc-950"}`}>
                Let&apos;s Build Something Impactful Together
              </h2>
              <p className={`text-sm sm:text-base mt-4 leading-relaxed font-light ${isDark ? "text-zinc-300" : "text-zinc-600"}`}>
                Whether you need a scalable Go Gin microservice architecture, a high-converting Next.js React frontend, or technical consultation, my inbox is open.
              </p>

              {/* Direct Info list */}
              <div className="space-y-4 mt-8">
                <div
                  className={`flex items-center gap-3.5 p-3.5 rounded-xl border ${
                    isDark ? "bg-zinc-900/70 border-white/10" : "bg-white border-black/10 shadow-xs"
                  }`}
                >
                  <div
                    className={`p-2.5 rounded-lg border ${
                      isDark ? "bg-white/5 border-white/10 text-zinc-300" : "bg-black/5 border-black/10 text-zinc-700"
                    }`}
                  >
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <div className={`text-xs ${isDark ? "text-zinc-400" : "text-zinc-500"}`}>Email Address</div>
                    <a
                      href={`mailto:${profile.email}`}
                      className={`text-sm font-semibold transition-colors ${
                        isDark ? "text-white hover:text-zinc-300" : "text-zinc-900 hover:text-black"
                      }`}
                    >
                      {profile.email}
                    </a>
                  </div>
                </div>

                <div
                  className={`flex items-center gap-3.5 p-3.5 rounded-xl border ${
                    isDark ? "bg-zinc-900/70 border-white/10" : "bg-white border-black/10 shadow-xs"
                  }`}
                >
                  <div
                    className={`p-2.5 rounded-lg border ${
                      isDark ? "bg-white/5 border-white/10 text-zinc-300" : "bg-black/5 border-black/10 text-zinc-700"
                    }`}
                  >
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <div className={`text-xs ${isDark ? "text-zinc-400" : "text-zinc-500"}`}>Location</div>
                    <div className={`text-sm font-semibold ${isDark ? "text-white" : "text-zinc-900"}`}>
                      {profile.location}
                    </div>
                  </div>
                </div>

                {profile.phone && (
                  <div
                    className={`flex items-center gap-3.5 p-3.5 rounded-xl border ${
                      isDark ? "bg-zinc-900/70 border-white/10" : "bg-white border-black/10 shadow-xs"
                    }`}
                  >
                    <div
                      className={`p-2.5 rounded-lg border ${
                        isDark ? "bg-white/5 border-white/10 text-zinc-300" : "bg-black/5 border-black/10 text-zinc-700"
                      }`}
                    >
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <div className={`text-xs ${isDark ? "text-zinc-400" : "text-zinc-500"}`}>Phone / WhatsApp</div>
                      <div className={`text-sm font-semibold ${isDark ? "text-white" : "text-zinc-900"}`}>
                        {profile.phone}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Availability Callout */}
            <div
              className={`mt-8 p-5 rounded-2xl border ${
                isDark ? "bg-zinc-900/80 border-white/15" : "bg-zinc-100 border-black/10"
              }`}
            >
              <div className={`flex items-center gap-2 text-xs font-semibold mb-1 ${isDark ? "text-white" : "text-black"}`}>
                <span className={`w-2 h-2 rounded-full inline-block animate-pulse ${isDark ? "bg-white" : "bg-black"}`} />
                Immediate Availability
              </div>
              <p className={`text-xs leading-relaxed ${isDark ? "text-zinc-400" : "text-zinc-600"}`}>
                Open for senior full-stack roles, distributed systems consulting, and select contract projects.
              </p>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7">
            <div
              className={`rounded-2xl p-6 sm:p-9 border shadow-xl ${
                isDark ? "bg-zinc-950/70 border-white/15 shadow-black/60" : "bg-white border-black/10 shadow-black/5"
              }`}
            >
              <h3 className={`text-xl font-bold mb-2 ${isDark ? "text-white" : "text-zinc-900"}`}>
                Send a Direct Message
              </h3>
              <p className={`text-xs sm:text-sm mb-6 ${isDark ? "text-zinc-400" : "text-zinc-500"}`}>
                Connected directly to the Go Gin backend API endpoint (`POST /api/v1/contact`).
              </p>

              {status === "success" && (
                <div
                  className={`mb-6 p-4 rounded-xl border text-sm flex items-start gap-3 ${
                    isDark
                      ? "bg-zinc-900 text-zinc-200 border-white/20"
                      : "bg-zinc-100 text-zinc-900 border-black/20"
                  }`}
                >
                  <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold">Message Dispatched!</div>
                    <div className={`text-xs mt-0.5 opacity-80`}>{feedbackMessage}</div>
                  </div>
                </div>
              )}

              {status === "error" && (
                <div
                  className={`mb-6 p-4 rounded-xl border text-sm flex items-start gap-3 ${
                    isDark
                      ? "bg-zinc-900 text-zinc-300 border-zinc-700"
                      : "bg-zinc-100 text-zinc-800 border-zinc-300"
                  }`}
                >
                  <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold">Could not send</div>
                    <div className={`text-xs mt-0.5 opacity-80`}>{feedbackMessage}</div>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-xs font-medium mb-1.5 ${isDark ? "text-zinc-300" : "text-zinc-700"}`}>
                      Your Name <span className="opacity-60">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Sarah Connor"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className={`w-full px-4 py-3 rounded-xl border text-sm transition-colors focus:outline-none ${
                        isDark
                          ? "bg-black/70 border-white/15 text-white placeholder:text-zinc-500 focus:border-white"
                          : "bg-zinc-50 border-black/10 text-zinc-900 placeholder:text-zinc-400 focus:border-black"
                      }`}
                    />
                  </div>

                  <div>
                    <label className={`block text-xs font-medium mb-1.5 ${isDark ? "text-zinc-300" : "text-zinc-700"}`}>
                      Email Address <span className="opacity-60">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="sarah@company.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className={`w-full px-4 py-3 rounded-xl border text-sm transition-colors focus:outline-none ${
                        isDark
                          ? "bg-black/70 border-white/15 text-white placeholder:text-zinc-500 focus:border-white"
                          : "bg-zinc-50 border-black/10 text-zinc-900 placeholder:text-zinc-400 focus:border-black"
                      }`}
                    />
                  </div>
                </div>

                <div>
                  <label className={`block text-xs font-medium mb-1.5 ${isDark ? "text-zinc-300" : "text-zinc-700"}`}>
                    Subject / Project Topic
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. New Backend Microservices Project"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className={`w-full px-4 py-3 rounded-xl border text-sm transition-colors focus:outline-none ${
                      isDark
                        ? "bg-black/70 border-white/15 text-white placeholder:text-zinc-500 focus:border-white"
                        : "bg-zinc-50 border-black/10 text-zinc-900 placeholder:text-zinc-400 focus:border-black"
                    }`}
                  />
                </div>

                <div>
                  <label className={`block text-xs font-medium mb-1.5 ${isDark ? "text-zinc-300" : "text-zinc-700"}`}>
                    Message <span className="opacity-60">*</span>
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Tell me about your project scope, timeline, and goals..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className={`w-full px-4 py-3 rounded-xl border text-sm transition-colors resize-none focus:outline-none ${
                      isDark
                        ? "bg-black/70 border-white/15 text-white placeholder:text-zinc-500 focus:border-white"
                        : "bg-zinc-50 border-black/10 text-zinc-900 placeholder:text-zinc-400 focus:border-black"
                    }`}
                  />
                </div>

                <button
                  type="submit"
                  disabled={status === "loading"}
                  className={`w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-semibold text-sm transition-all cursor-pointer shadow-md disabled:opacity-50 disabled:pointer-events-none ${
                    isDark
                      ? "bg-white text-black hover:bg-zinc-200 shadow-white/5 active:scale-[0.99]"
                      : "bg-black text-white hover:bg-zinc-800 shadow-black/15 active:scale-[0.99]"
                  }`}
                >
                  {status === "loading" ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Sending to Go Gin API...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
