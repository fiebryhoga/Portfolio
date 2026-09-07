"use client";

import React, { useState } from "react";
import { loginAdmin, fetchContactMessages } from "@/lib/api";
import { ContactMessage } from "@/types";
import { Shield, X, Key, CheckCircle, AlertCircle, Loader2, MailCheck, Terminal } from "lucide-react";

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminModal: React.FC<AdminModalProps> = ({ isOpen, onClose }) => {
  const [identifier, setIdentifier] = useState("admin@portfolio.dev");
  const [password, setPassword] = useState("Admin@123456");
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [fetchingMsgs, setFetchingMsgs] = useState(false);

  if (!isOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await loginAdmin(identifier, password);
      setToken(res.token);
      loadMessages(res.token);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to authenticate with Go Gin API.");
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (jwtToken: string) => {
    setFetchingMsgs(true);
    try {
      const msgs = await fetchContactMessages(jwtToken);
      setMessages(msgs);
    } catch {
      // ignore
    } finally {
      setFetchingMsgs(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-xl glass-card rounded-2xl p-6 sm:p-8 border border-white/20 shadow-2xl shadow-black/60 max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Full-Stack Admin & API Portal</h3>
            <p className="text-xs text-slate-400">
              JWT Authentication against Golang Gin API
            </p>
          </div>
        </div>

        {!token ? (
          /* Login Form */
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="p-3.5 rounded-xl bg-indigo-950/40 border border-indigo-500/20 text-xs text-slate-300">
              <span className="font-semibold text-cyan-300">Default Credentials Seeded:</span>
              <br />
              Email: <code className="text-white font-mono">admin@portfolio.dev</code> | Password:{" "}
              <code className="text-white font-mono">Admin@123456</code>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Admin Username / Email
              </label>
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-[#090d16] border border-white/10 text-white text-sm focus:outline-none focus:border-indigo-400"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-[#090d16] border border-white/10 text-white text-sm focus:outline-none focus:border-indigo-400"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl font-medium text-sm bg-gradient-to-r from-indigo-600 to-cyan-500 text-white shadow-lg shadow-indigo-600/30 hover:opacity-95 transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Verifying with Go Gin API...
                </>
              ) : (
                <>
                  <Key className="w-4 h-4" />
                  Authenticate & Issue JWT
                </>
              )}
            </button>
          </form>
        ) : (
          /* Authenticated Dashboard */
          <div className="space-y-6">
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-center gap-2.5">
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>JWT Session Active. You have authenticated against Go Gin API.</span>
            </div>

            {/* Token details */}
            <div className="glass-card p-3 rounded-xl border border-white/10">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                <span className="flex items-center gap-1 font-mono">
                  <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                  JWT Token (HS256)
                </span>
                <span className="text-[10px] text-emerald-400">Valid 24h</span>
              </div>
              <p className="font-mono text-[10px] text-slate-300 break-all bg-black/40 p-2 rounded border border-white/5 max-h-16 overflow-y-auto">
                {token}
              </p>
            </div>

            {/* Contact Messages Inbox */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <MailCheck className="w-4 h-4 text-cyan-400" />
                  Live Contact Inquiries ({messages.length})
                </h4>
                <button
                  onClick={() => loadMessages(token)}
                  disabled={fetchingMsgs}
                  className="text-xs text-cyan-400 hover:text-cyan-300 underline"
                >
                  Refresh
                </button>
              </div>

              {fetchingMsgs ? (
                <div className="flex items-center justify-center p-6 text-xs text-slate-400 gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Loading messages from Go backend...
                </div>
              ) : messages.length === 0 ? (
                <p className="text-xs text-slate-400 p-4 rounded-xl bg-white/5 text-center">
                  No contact submissions yet. Test submitting a message from the Contact section!
                </p>
              ) : (
                <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                  {messages.map((m) => (
                    <div key={m.id} className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs">
                      <div className="flex items-center justify-between text-slate-300 font-semibold mb-1">
                        <span>{m.name} ({m.email})</span>
                        <span className="text-[10px] text-slate-500 font-mono">
                          {new Date(m.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="text-cyan-300 text-[11px] mb-1">{m.subject || "No Subject"}</div>
                      <p className="text-slate-300 text-xs font-light">{m.message}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={() => setToken(null)}
              className="w-full py-2.5 rounded-xl border border-white/10 text-xs text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
            >
              Sign Out
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
