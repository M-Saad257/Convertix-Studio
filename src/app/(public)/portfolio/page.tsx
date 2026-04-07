"use client";

import React from "react";
import { motion } from "framer-motion";
import { ExternalLink, Github, ChevronLeft } from "lucide-react";
import Link from "next/link";

const allProjects = [
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
    image: "/2.png",
  },
  {
    title: "Global Link SaaS",
    category: "Strategy",
    description: "Strategic SaaS platform scaled to 50k+ monthly active users.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800",
  },
  {
    title: "HealthCore Connect",
    category: "Development",
    description: "HIPAA-compliant healthcare portal for seamless patient management.",
    image: "/1.png",
  },
  {
    title: "Quantum Realty",
    category: "Design",
    description: "Immersive real estate platform with 3D virtual tours.",
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=800",
  },
  {
    title: "Swift Logistics",
    category: "Strategy",
    description: "Operational roadmap for a nationwide logistics network.",
    image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=800",
  },
];

export default function PortfolioPage() {
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
          {allProjects.map((project, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
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

                <div className="absolute top-6 right-6 px-4 py-2 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-[10px] font-black text-white uppercase tracking-widest italic">
                  {project.category}
                </div>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-black group-hover:text-primary transition-colors uppercase italic tracking-tighter">
                  {project.title}
                </h2>
                <p className="text-white/20 text-sm font-bold leading-relaxed px-4">
                  {project.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </main>
  );
}
