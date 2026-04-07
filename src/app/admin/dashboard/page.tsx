"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";
import { Briefcase, MessageSquare, Newspaper, TrendingUp, Users } from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    projects: 0,
    posts: 0,
    contacts: 0,
    portfolio: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      const [
        { count: projectsCount },
        { count: postsCount },
        { count: contactsCount },
        { count: portfolioCount }
      ] = await Promise.all([
        supabase.from('projects').select('*', { count: 'exact', head: true }),
        supabase.from('posts').select('*', { count: 'exact', head: true }),
        supabase.from('contacts').select('*', { count: 'exact', head: true }),
        supabase.from('portfolio').select('*', { count: 'exact', head: true }),
      ]);

      setStats({
        projects: projectsCount || 0,
        posts: postsCount || 0,
        contacts: contactsCount || 0,
        portfolio: portfolioCount || 0,
      });
      setLoading(false);
    };

    fetchStats();
  }, []);

  const cards = [
    { name: "Active Projects", value: stats.projects, icon: Briefcase, color: "text-primary" },
    { name: "Published Insights", value: stats.posts, icon: Newspaper, color: "text-blue-500" },
    { name: "Global Leads", value: stats.contacts, icon: MessageSquare, color: "text-purple-500" },
    { name: "Portfolio Assets", value: stats.portfolio, icon: TrendingUp, color: "text-green-500" },
  ];

  return (
    <div className="space-y-12">
      <header>
        <h1 className="text-4xl font-black uppercase italic tracking-tighter mb-2">
          Dashboard <span className="text-primary tracking-widest text-xs italic">Overview.</span>
        </h1>
        <p className="text-white/20 text-xs font-black uppercase tracking-[4px]">
          Operational Status: Authorized
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, index) => (
          <motion.div
            key={card.name}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-white/[0.02] border border-white/5 p-8 rounded-[40px] group hover:border-primary/20 transition-all relative overflow-hidden"
          >
            <div className={`absolute top-0 right-0 w-32 h-32 opacity-5 translate-x-10 -translate-y-10 group-hover:opacity-10 transition-all duration-700`}>
                <card.icon className="w-full h-full" />
            </div>
            <div className="flex flex-col space-y-4">
              <div className={`w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-primary/20 transition-colors`}>
                <card.icon className={`w-6 h-6 ${card.color}`} />
              </div>
              <div>
                <p className="text-white/20 text-[10px] font-black uppercase tracking-[3px] mb-1 italic">{card.name}</p>
                <p className="text-3xl font-black italic tracking-tighter">
                  {loading ? "..." : card.value.toString().padStart(2, '0')}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <section className="bg-white/[0.02] border border-white/5 p-10 rounded-[48px] h-[400px] flex flex-col justify-center items-center text-center space-y-4 border-dashed opacity-50">
           <TrendingUp className="w-12 h-12 text-primary/20" />
           <p className="text-xs uppercase tracking-widest font-black text-white/20 italic">Analytics Protocol Initializing...</p>
        </section>
        <section className="bg-white/[0.02] border border-white/5 p-10 rounded-[48px] h-[400px] flex flex-col justify-center items-center text-center space-y-4 border-dashed opacity-50">
           <Users className="w-12 h-12 text-primary/20" />
           <p className="text-xs uppercase tracking-widest font-black text-white/20 italic">User Engagement Data Loading...</p>
        </section>
      </div>
    </div>
  );
}
