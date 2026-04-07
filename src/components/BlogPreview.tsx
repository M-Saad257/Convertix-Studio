"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Calendar, Clock } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { BlogPost } from "@/types/database.types";
import { formatDate } from "@/lib/utils";

export default function BlogPreview() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLatestPosts = async () => {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(2);

      if (!error && data) {
        setPosts(data);
      }
      setLoading(false);
    };

    fetchLatestPosts();
  }, []);

  return (
    <section className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4 px-4">
          <div className="max-w-xl">
            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-black mb-4 uppercase italic tracking-tighter"
            >
              Latest <span className="text-primary italic tracking-widest font-black">Insights.</span>
            </motion.h2>
            <motion.p
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-white/40 text-[10px] font-black uppercase tracking-[4px]"
            >
                Deep dives into digital strategy and tactical execution.
            </motion.p>
          </div>
          <Link href="/blog" className="text-primary font-black uppercase tracking-[3px] text-xs flex items-center space-x-2 group">
            <span>View All Insights</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-4">
          {loading ? (
            [...Array(2)].map((_, i) => (
              <div key={i} className="animate-pulse space-y-8 glass p-10 rounded-[48px] border border-white/5">
                <div className="h-4 bg-white/5 rounded-full w-1/4" />
                <div className="h-8 bg-white/5 rounded-full w-3/4" />
                <div className="h-4 bg-white/5 rounded-full w-1/2" />
              </div>
            ))
          ) : posts.length > 0 ? (
            posts.map((post, index) => (
              <Link key={post.id} href={`/blog/${post.slug}`} className="group">
                <article className="glass p-10 rounded-[48px] border border-white/5 overflow-hidden flex flex-col h-full hover:border-primary/50 transition-all shadow-3xl hover:-translate-y-2 relative">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-[80px] rounded-full group-hover:scale-150 transition-transform duration-700" />
                  
                  <div className="flex items-center space-x-3 text-[10px] font-black uppercase tracking-widest text-primary mb-6 relative z-10">
                      <Calendar className="w-3 h-3" />
                      <span>{formatDate(post.created_at)}</span>
                      <span>•</span>
                      <Clock className="w-3 h-3" />
                      <span>5 MIN READ</span>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-black group-hover:text-primary transition-colors line-clamp-2 uppercase italic tracking-tighter relative z-10">
                      {post.title}
                  </h3>
                  <div className="pt-8 flex items-center space-x-3 text-[10px] font-black uppercase tracking-[3px] text-white opacity-40 group-hover:opacity-100 transition-all relative z-10">
                      <span>Read Intelligence</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                  </div>
                </article>
              </Link>
            ))
          ) : (
            <div className="col-span-full py-10 text-center opacity-40">
              <p className="text-[10px] font-black uppercase tracking-[4px] italic">Awaiting Transmission...</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
