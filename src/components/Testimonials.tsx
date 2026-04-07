"use client";

import React from "react";
import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";

const testimonials = [
  { name: "Alex Thompson", role: "TECHFLOW CEO", content: "Convertix Studio transformed our digital presence within weeks. World-class precision." },
  { name: "Sarah Chen", role: "AURA AI FOUNDER", content: "Co-partnering with this agency increased our conversions by 40% using their high-performance design." },
  { name: "Marcus Aurelius", role: "VELOCITY DIRECTOR", content: "Rare blend of high-end design and robust engineering. They don't just build, they solve." },
];

export default function Testimonials() {
  return (
    <section className="py-24 bg-black relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="flex items-center justify-center space-x-1 mb-6">
            {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 text-primary fill-primary" />)}
          </motion.div>
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter">
            Digital <span className="text-primary italic font-black">Resonance.</span>
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="glass p-12 rounded-[64px] border border-white/5 hover:border-primary/30 transition-all flex flex-col justify-between shadow-3xl text-center items-center"
            >
              <div className="mb-10">
                <div className="w-12 h-12 rounded-full bg-primary/20 text-primary flex items-center justify-center mb-8 mx-auto shadow-inner">
                  <Quote className="w-6 h-6 fill-primary/20" />
                </div>
                <p className="text-white/40 leading-relaxed font-bold italic text-lg px-2">
                  "{testimonial.content}"
                </p>
              </div>
              <div>
                <h4 className="text-sm font-black uppercase tracking-[4px] mb-1">{testimonial.name}</h4>
                <p className="text-[10px] text-white/10 uppercase font-black tracking-widest">{testimonial.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
