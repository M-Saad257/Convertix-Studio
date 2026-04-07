"use client";

import React from "react";
import { motion } from "framer-motion";
import { ExternalLink, Github } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const projects = [
  {
    title: "EcoDrive E-Commerce",
    category: "Development",
    description: "Next.js 14-powered store with real-time inventory management.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800",
  },
  {
    title: "Aura AI Dashboard",
    category: "Design",
    description: "Complex data visualization platform with glassmorphic aesthetics.",
    image: "https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?auto=format&fit=crop&q=80&w=800",
  },
  {
    title: "Global Link SaaS",
    category: "Strategy",
    description: "Strategic SaaS platform scaled to 50k+ monthly active users.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800",
  },
];

export default function Portfolio() {
  return (
    <section id="portfolio" className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 space-y-4 md:space-y-0 px-4">
          <div className="max-w-xl">
            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-black mb-4 uppercase italic tracking-tighter"
            >
              Selected <span className="text-primary italic tracking-widest">Works.</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-white/40 text-lg uppercase font-black tracking-widest text-xs"
            >
              A showcase of our most impactful digital transformations.
            </motion.p>
          </div>
          <Link
            href="/portfolio"
            className="text-primary font-black uppercase tracking-[3px] text-xs flex items-center space-x-2 group"
          >
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              View All Projects
            </motion.span>
            <ExternalLink className="w-4 h-4 group-hover:translate-y-[-2px] group-hover:translate-x-[2px] transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 px-4 text-center items-center">
          {projects.map((project, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group cursor-pointer relative"
            >
              <div className="relative aspect-[4/3] rounded-[48px] overflow-hidden mb-8 bg-white/5 border border-white/10 group-hover:border-primary/50 transition-all shadow-3xl">
                <img
                  src={project.image}
                  alt={project.title}
                  className="object-cover w-full h-full grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
                
                {/* Float Badge */}
                <div className="absolute top-6 right-6 px-4 py-2 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-[10px] font-black text-white uppercase tracking-widest italic">
                  {project.category}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-2xl font-black group-hover:text-primary transition-colors uppercase italic tracking-tighter">
                  {project.title}
                </h3>
                <p className="text-white/20 text-sm font-bold leading-relaxed px-4">
                  {project.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
