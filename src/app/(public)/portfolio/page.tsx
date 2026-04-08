"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { Project } from "@/types/database.types";

export default function PortfolioPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        setProjects(data);
      }
      setLoading(false);
    };

    fetchProjects();
  }, []);

  return (
    <main className="min-h-screen pt-32 pb-24 bg-background px-4">
      <div className="max-w-7xl mx-auto">
        <Link href="/#portfolio" className="inline-flex items-center space-x-2 text-white/40 hover:text-primary transition-colors mb-12 text-xs font-black uppercase tracking-widest italic">
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Featured</span>
        </Link>

        <div className="text-center mb-20">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-8xl font-black mb-6 uppercase tracking-tighter italic"
          >
            Digital <span className="text-primary italic">Archive.</span>
          </motion.h1>
          <p className="text-white/40 text-lg max-w-2xl mx-auto font-bold uppercase tracking-widest text-[10px]">
            The full catalog of our technical engineering and creative vision.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 px-4 text-center items-center">
          {loading ? (
             [...Array(6)].map((_, i) => (
                <div key={i} className="aspect-[4/3] rounded-[48px] bg-white/5 border border-white/10 animate-pulse" />
             ))
          ) : projects.length > 0 ? (
            projects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="group cursor-pointer relative"
              >
                <div className="relative aspect-[4/3] rounded-[48px] overflow-hidden mb-8 bg-white/5 border border-white/10 group-hover:border-primary/50 transition-all shadow-3xl">
                  <img
                    src={project.image_url}
                    alt={project.name}
                    className="object-cover w-full h-full grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />

                  <div className="absolute top-6 right-6 px-4 py-2 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-[10px] font-black text-white uppercase tracking-widest italic">
                    {project.category}
                  </div>
                </div>

                <div className="space-y-4">
                  <h2 className="text-2xl font-black group-hover:text-primary transition-colors uppercase italic tracking-tighter">
                    {project.name}
                  </h2>
                  <p className="text-white/20 text-sm font-bold leading-relaxed px-4">
                    {project.description}
                  </p>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full py-20">
               <p className="text-white/20 font-black uppercase tracking-widest italic text-xs">No entries found in archive.</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

