"use client";

import React from "react";
import { motion } from "framer-motion";
import { Code, Globe, Palette, Search, ShoppingCart, Zap } from "lucide-react";

const services = [
  {
    title: "Web Development",
    description: "High-precision technical execution with Next.js and Tailwind CSS.",
    icon: Code,
    color: "text-blue-500",
  },
  {
    title: "UI/UX Design",
    description: "Seamless user experiences crafted with creative vision and precision.",
    icon: Palette,
    color: "text-purple-500",
  },
  {
    title: "SEO Optimization",
    description: "Data-driven organic growth strategy targeting high conversions.",
    icon: Search,
    color: "text-green-500",
  },
  {
    title: "E-Commerce",
    description: "Full-scale commerce engines designed for velocity and security.",
    icon: ShoppingCart,
    color: "text-orange-500",
  },
  {
    title: "Digital Strategy",
    description: "Transformative roadmaps to scale your brand across the digital landscape.",
    icon: Globe,
    color: "text-yellow-500",
  },
  {
    title: "High Performance",
    description: "Optimized delivery ensuring sub-second load times and reliability.",
    icon: Zap,
    color: "text-red-500",
  },
];

export default function Services() {
  return (
    <section id="services" className="py-24 bg-black/50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-20 px-4">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-black mb-4 uppercase tracking-[5px] italic"
          >
            Digital <span className="text-primary italic font-black">Expertise.</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-white/60 text-lg max-w-2xl mx-auto font-bold uppercase tracking-widest text-xs"
          >
            We don't just build, we engineer digital growth.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="glass p-8 rounded-[40px] hover:border-primary/50 transition-all group relative overflow-hidden shadow-2xl"
            >
              <div className={`w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform shadow-inner`}>
                <service.icon className={`w-7 h-7 ${service.color}`} />
              </div>
              <h3 className="text-2xl font-black mb-4 uppercase tracking-tighter italic">{service.title}</h3>
              <p className="text-white/40 leading-relaxed font-bold text-sm tracking-tight">
                {service.description}
              </p>
              
              <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
