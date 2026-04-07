"use client";

import React, { useState } from "react";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";
import { Lock, Mail, ShieldAlert } from "lucide-react";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      window.location.href = "/admin/dashboard";
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white/[0.02] backdrop-blur-3xl border border-white/10 rounded-[32px] p-8 md:p-12 relative overflow-hidden shadow-2xl"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />
        
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-primary/10 border border-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Lock className="text-primary w-8 h-8" />
          </div>
          <h1 className="text-3xl font-black uppercase italic tracking-tighter mb-2">
            System <span className="text-primary">Access.</span>
          </h1>
          <p className="text-white/40 text-xs font-black uppercase tracking-[3px]">
            Restricted Management Protocol
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-white/40 ml-1">
              Command Email
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm focus:border-primary/50 focus:outline-none transition-all placeholder:text-white/10"
                placeholder="identity@convertix.studio"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-white/40 ml-1">
              Secure Cipher
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm focus:border-primary/50 focus:outline-none transition-all placeholder:text-white/10"
                placeholder="••••••••"
              />
            </div>
          </div>

          {error && (
            <div className="flex items-center space-x-2 text-red-500 bg-red-500/10 p-4 rounded-xl border border-red-500/20 text-xs font-bold animate-pulse">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-primary/80 text-black font-black uppercase italic tracking-widest py-4 rounded-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            {loading ? "Decrypting..." : "Initialize Dashboard"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
