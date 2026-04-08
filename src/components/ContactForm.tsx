"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, CheckCircle2, Loader2, ShieldCheck, MailWarning, ArrowRight } from "lucide-react";
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
  const [step, setStep] = useState<'form' | 'otp'>('form');
  const [otpCode, setOtpCode] = useState("");
  const searchParams = useSearchParams();
  const [message, setMessage] = useState("");
  const [contactData, setContactData] = useState({ name: "", email: "", message: "" });

  useEffect(() => {
    const plan = searchParams.get("plan");
    if (plan) {
      setMessage(`I am interested in the ${plan} Strategy. Let's discuss how we can scale my digital presence.`);
    }
  }, [searchParams]);

  async function handleRequestOTP(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      message: formData.get("message") as string,
    };

    setContactData(data);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        body: JSON.stringify({ action: "REQUEST_OTP", email: data.email }),
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        setStep('otp');
        toast.success("Security code sent to your email!");
      } else {
        const err = await response.json();
        toast.error(err.error || "Failed to send code.");
      }
    } catch (err) {
      toast.error("Technical error connecting to security server.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleVerifyOTP(e: React.FormEvent) {
    e.preventDefault();
    if (otpCode.length !== 4) {
      toast.error("Please enter a 4-digit code.");
      return;
    }
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        body: JSON.stringify({ 
          action: "VERIFY_AND_SUBMIT", 
          ...contactData, 
          code: otpCode 
        }),
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        setIsSuccess(true);
        toast.success("Identity verified! Message sent.");
      } else {
        const err = await response.json();
        toast.error(err.error || "Invalid code. Please retry.");
      }
    } catch (err) {
      toast.error("Verification failed due to technical error.");
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
              Establish your growth pipeline. Identity verification required for all new transmissions.
            </motion.p>

            <div className="space-y-6">
              {[
                "100% Secure communication tunnel",
                "Advanced identity verification",
                "Direct lead prioritization",
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                  className="flex items-center space-x-3 text-sm font-black uppercase tracking-[3px] text-white/80"
                >
                  <ShieldCheck className="w-5 h-5 text-primary" />
                  <span>{item}</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Form UI */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="glass p-12 rounded-[64px] border border-white/10 shadow-3xl relative overflow-hidden"
          >
            <AnimatePresence mode="wait">
              {isSuccess ? (
                <motion.div 
                  key="success"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-20"
                >
                  <CheckCircle2 className="w-24 h-24 text-primary mx-auto mb-10 shadow-glow" />
                  <h3 className="text-3xl font-black mb-4 uppercase italic tracking-tighter">Transmission Secured</h3>
                  <p className="text-white/40 font-bold uppercase tracking-widest text-xs">
                    Your identity is verified. Response within 24 hours.
                  </p>
                  <button
                    onClick={() => {
                        setIsSuccess(false);
                        setStep('form');
                    }}
                    className="mt-8 text-primary font-black uppercase tracking-widest text-[10px] hover:underline"
                  >
                    Send Another Transmission
                  </button>
                </motion.div>
              ) : step === 'otp' ? (
                <motion.form 
                  key="otp"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  onSubmit={handleVerifyOTP} 
                  className="space-y-8"
                >
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="p-3 bg-primary/10 rounded-2xl border border-primary/20">
                        <MailWarning className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                        <h3 className="text-sm font-black uppercase italic tracking-widest">Verify Identity</h3>
                        <p className="text-[10px] text-white/40 uppercase font-black">Code sent to {contactData.email}</p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-[4px] text-white/20 mb-6 ml-2 italic">
                      4-Digit Verification Code
                    </label>
                    <div className="flex justify-center">
                        <input
                            type="text"
                            maxLength={4}
                            value={otpCode}
                            onChange={(e) => setOtpCode(e.target.value.replace(/[^0-9]/g, ''))}
                            placeholder="0000"
                            className="w-full max-w-[280px] bg-white/5 border-2 border-primary/20 rounded-3xl px-6 py-8 text-center text-4xl font-black tracking-[20px] focus:outline-none focus:border-primary transition-all text-white placeholder:text-white/5"
                            required
                        />
                    </div>
                    <p className="text-center mt-6 text-[9px] font-black uppercase tracking-widest text-white/20 italic">
                        Check your digital mail for the security code.
                    </p>
                  </div>

                  <div className="flex flex-col space-y-4 pt-4">
                    <button
                        type="submit"
                        disabled={isSubmitting || otpCode.length !== 4}
                        className="w-full bg-primary hover:bg-accent text-white py-6 rounded-2xl font-black text-xs uppercase tracking-[4px] shadow-glow flex items-center justify-center space-x-3 transition-all active:scale-95 disabled:opacity-50"
                    >
                        <span>{isSubmitting ? "VERIFYING..." : "VERIFY & TRANSMIT"}</span>
                        {!isSubmitting && <ArrowRight className="w-5 h-5" />}
                    </button>
                    <button 
                        type="button"
                        onClick={() => setStep('form')}
                        className="text-[9px] font-black uppercase tracking-widest text-white/20 hover:text-white transition-colors"
                    >
                        Back to Edit Information
                    </button>
                  </div>
                </motion.form>
              ) : (
                <motion.form 
                  key="form"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  onSubmit={handleRequestOTP} 
                  className="space-y-8"
                >
                  <div className="flex items-center space-x-3 mb-2 px-2">
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-[3px] text-white/40 italic">New Strategy Request</span>
                  </div>
                  <div>
                    <label htmlFor="name" className="block text-[10px] font-black uppercase tracking-[4px] text-white/20 mb-3 ml-2 italic">
                      Identity
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      defaultValue={contactData.name}
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
                      defaultValue={contactData.email}
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
                    className="w-full bg-white/5 border border-white/10 hover:border-primary/40 text-white py-6 rounded-2xl font-black text-xs uppercase tracking-[4px] flex items-center justify-center space-x-3 transition-all active:scale-95 disabled:opacity-50"
                  >
                    <span>{isSubmitting ? "INITIATING..." : "REQUEST SECURITY CODE"}</span>
                    {!isSubmitting && <Send className="w-5 h-5" />}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
