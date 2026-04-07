"use client";

import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Zap, Headphones, Target, Layers, BarChart } from "lucide-react";

const features = [
  { title: "Strategic Growth", description: "Aligning digital objectives with core business metrics for ROI.", icon: Target },
  { title: "High Velocity", description: "Technical stack ensuring sub-second load times and reliability.", icon: Zap },
  { title: "Design Precision", description: "Pixel-perfect interfaces resonating with your brand identity.", icon: Layers },
  { title: "Data-Driven", description: "Real-time analytics keeping you informed about every conversion.", icon: BarChart },
  { title: "Uncompromising Security", description: "Advanced protocols protecting your data and user trust.", icon: ShieldCheck },
  { title: "Direct Support", description: "Immediate access to the experts managing your presence.", icon: Headphones },
];

export default function WhyChooseUs() {
  return (
    <section className="py-24 bg-white/5 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4 px-4">
          <div className="max-w-xl">
            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-black mb-4 uppercase italic tracking-tighter"
            >
              Why <span className="text-primary tracking-tighter">Convertix?</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-white/40 text-[10px] uppercase font-black tracking-[4px]"
            >
                Merging creative vision with technical execution.
            </motion.p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="p-10 rounded-[48px] border border-white/5 hover:border-primary/50 transition-all group bg-black/50 shadow-2xl relative overflow-hidden"
            >
              <div className="w-14 h-14 rounded-2xl bg-primary/20 text-primary flex items-center justify-center mb-8 group-hover:bg-primary group-hover:text-white transition-all shadow-inner">
                <feature.icon className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-black mb-4 uppercase tracking-tighter italic">{feature.title}</h3>
              <p className="text-white/40 text-xs leading-relaxed font-bold tracking-widest leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
