"use client";

import React from "react";
import { motion } from "framer-motion";
import { Check, X, Zap } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const plans = [
  {
    name: "Basic",
    price: "120",
    description: "Startup essentials to establish your digital presence.",
    features: ["5-Page Responsive Website", "Basic SEO Setup", "Contact Form", "Standard Support"],
    notIncluded: ["E-commerce", "Advanced Analytics"],
  },
  {
    name: "Standard",
    price: "400",
    description: "Growth-focused solutions for expanding brands.",
    features: ["10-Page Dynamic Website", "Advanced SEO", "CMS Implementation", "Speed Optimization"],
    notIncluded: ["White Label"],
    recommended: true,
  },
  {
    name: "Premium",
    price: "1000",
    description: "Enterprise scalability with full-cycle technical support.",
    features: ["Unlimited Pages", "Full E-commerce", "Priority Support", "Custom API Integration"],
    notIncluded: [],
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 px-4">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-black mb-4 uppercase italic tracking-tighter"
          >
            Digital <span className="text-primary italic font-black">Investment.</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-white/40 text-lg uppercase font-black tracking-widest text-xs"
          >
            Transparent pricing models tailored for high-impact results.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-center px-4">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={cn(
                "glass rounded-[48px] p-10 border transition-all relative group text-center",
                plan.recommended
                  ? "border-primary/50 shadow-glow scale-105 z-10 bg-white/5"
                  : "border-white/10 hover:border-white/20"
              )}
            >
              {plan.recommended && (
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-primary text-white text-[10px] font-black px-6 py-2 rounded-full uppercase tracking-tighter flex items-center space-x-2">
                  <Zap className="w-3 h-3 fill-white" />
                  <span>Growth Choice</span>
                </div>
              )}

              <div className="mb-10">
                <h3 className="text-2xl font-black mb-2 uppercase italic tracking-tighter">{plan.name}</h3>
                <div className="flex items-baseline justify-center space-x-1">
                  <span className="text-4xl font-black">$</span>
                  <span className="text-7xl font-black tracking-tighter italic">{plan.price}</span>
                </div>
                <p className="mt-4 text-white/40 text-[10px] font-black uppercase tracking-widest leading-relaxed">
                  {plan.description}
                </p>
              </div>

              <ul className="space-y-4 mb-10 text-left">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center space-x-4 text-xs font-black uppercase tracking-widest text-white/80">
                    <Check className="w-4 h-4 text-primary" />
                    <span>{feature}</span>
                  </li>
                ))}
                {plan.notIncluded.map((feature) => (
                  <li key={feature} className="flex items-center space-x-4 text-xs font-black uppercase tracking-widest text-white/10 line-through">
                    <X className="w-4 h-4" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                href={`/contact?plan=${plan.name}`}
                className={cn(
                  "block text-center py-5 rounded-2xl font-black transition-all shadow-lg active:scale-95 uppercase tracking-widest text-xs",
                  plan.recommended
                    ? "bg-primary text-white shadow-glow"
                    : "bg-white/5 text-white hover:bg-white/10"
                )}
              >
                Start Strategy
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
