"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Send, CheckCircle2, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";

export default function ContactForm() {
  return (
    <Suspense fallback={<div className="min-h-[400px] flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>}>
      <ContactFormContent />
    </Suspense>
  );
}

function ContactFormContent() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const searchParams = useSearchParams();
  const [message, setMessage] = useState("");

  useEffect(() => {
    const plan = searchParams.get("plan");
    if (plan) {
      setMessage(`I am interested in the ${plan} Strategy. Let's discuss how we can scale my digital presence.`);
    }
  }, [searchParams]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      message: formData.get("message"),
    };

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        setIsSuccess(true);
        toast.success("Strategy message sent!");
        (e.target as HTMLFormElement).reset();
      } else {
        toast.error("Process failed. Retry strategy.");
      }
    } catch (err) {
      toast.error("Technical error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section id="contact" className="py-24 bg-white/5 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center px-4">
          {/* Text Content */}
          <div>
            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl lg:text-7xl font-black mb-8 leading-tight tracking-tighter uppercase italic"
            >
              Ready to <br />
              <span className="text-primary italic font-black">Transform?</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-xl text-white/40 mb-10 leading-relaxed font-bold uppercase tracking-widest text-xs"
            >
              Establish your growth pipeline. Our strategy leads respond within 24 hours.
            </motion.p>

            <div className="space-y-6">
              {[
                "High-performance digital scaling",
                "Advanced technical implementation",
                "Direct expert communication",
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                  className="flex items-center space-x-3 text-sm font-black uppercase tracking-[3px] text-white/80"
                >
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                  <span>{item}</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="glass p-12 rounded-[64px] border border-white/10 shadow-3xl relative"
          >
            {isSuccess ? (
              <div className="text-center py-20">
                <CheckCircle2 className="w-24 h-24 text-primary mx-auto mb-10" />
                <h3 className="text-3xl font-black mb-4 uppercase italic tracking-tighter">Transmission Successful</h3>
                <p className="text-white/40 font-bold uppercase tracking-widest text-xs">
                  Strategy lead will be in contact shortly.
                </p>
                <button
                  onClick={() => setIsSuccess(false)}
                  className="mt-8 text-primary font-black uppercase tracking-widest text-[10px] hover:underline"
                >
                  New Strategy Request
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                <div>
                  <label htmlFor="name" className="block text-[10px] font-black uppercase tracking-[4px] text-white/20 mb-3 ml-2 italic">
                    Identity
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    placeholder="JOHN DOE"
                    disabled={isSubmitting}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 focus:outline-none focus:border-primary transition-all text-white placeholder:text-white/10 font-bold tracking-widest"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-[10px] font-black uppercase tracking-[4px] text-white/20 mb-3 ml-2 italic">
                    Digital Mail
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    placeholder="EX@TECH.CO"
                    disabled={isSubmitting}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 focus:outline-none focus:border-primary transition-all text-white placeholder:text-white/10 font-bold tracking-widest"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-[10px] font-black uppercase tracking-[4px] text-white/20 mb-3 ml-2 italic">
                    Strategy Intent
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="HOW CAN WE SCALE YOUR BRAND?"
                    disabled={isSubmitting}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 focus:outline-none focus:border-primary transition-all text-white placeholder:text-white/10 font-bold tracking-widest resize-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-primary hover:bg-accent text-white py-6 rounded-2xl font-black text-xs uppercase tracking-[4px] shadow-glow flex items-center justify-center space-x-3 transition-all active:scale-95 disabled:opacity-50 shadow-3xl"
                >
                  <span>{isSubmitting ? "TRANSMITTING..." : "SUBMIT STRATEGY"}</span>
                  {!isSubmitting && <Send className="w-5 h-5" />}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
