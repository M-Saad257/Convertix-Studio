"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Session } from "@supabase/supabase-js";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Briefcase, LayoutDashboard, LogOut, MessageSquare, Newspaper, Settings } from "lucide-react";
import Link from "next/link";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
      if (!session && pathname !== "/admin") {
        router.push("/admin");
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (!session && pathname !== "/admin") {
        router.push("/admin");
      }
    });

    return () => subscription.unsubscribe();
  }, [pathname, router]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/admin");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-12 h-12 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!session && pathname === "/admin") {
    return <>{children}</>;
  }

  if (!session) return null;

  const menuItems = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/admin/dashboard" },
    { name: "Projects", icon: Briefcase, path: "/admin/projects" },
    { name: "Portfolio", icon: Settings, path: "/admin/portfolio" },
    { name: "Blog Posts", icon: Newspaper, path: "/admin/posts" },
    { name: "Contacts", icon: MessageSquare, path: "/admin/contacts" },
  ];

  return (
    <div className="min-h-screen bg-black text-white flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/5 bg-white/[0.02] backdrop-blur-xl hidden md:flex flex-col p-6 fixed h-full z-50">
        <div className="mb-12 px-2">
          <h2 className="text-xl font-black uppercase italic tracking-tighter">
            Convertix <span className="text-primary italic tracking-widest text-xs">Admin.</span>
          </h2>
        </div>

        <nav className="flex-1 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={`flex items-center space-x-3 px-4 py-3 rounded-2xl transition-all group ${
                pathname === item.path
                  ? "bg-primary text-black font-black italic shadow-[0_0_20px_rgba(var(--primary-rgb),0.3)]"
                  : "text-white/40 hover:bg-white/5 hover:text-white"
              }`}
            >
              <item.icon className={`w-5 h-5 ${pathname === item.path ? "text-black" : "text-white/20 group-hover:text-primary transition-colors"}`} />
              <span className="text-xs uppercase tracking-widest font-black italic">{item.name}</span>
            </Link>
          ))}
        </nav>

        <button
          onClick={handleSignOut}
          className="mt-auto flex items-center space-x-3 px-4 py-3 rounded-2xl text-red-500/50 hover:text-red-500 hover:bg-red-500/10 transition-all font-black uppercase tracking-widest text-[10px] italic border border-transparent hover:border-red-500/20"
        >
          <LogOut className="w-4 h-4" />
          <span>Terminate Session</span>
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-6 md:p-12 min-h-screen">
        <AnimatePresence mode="wait">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
