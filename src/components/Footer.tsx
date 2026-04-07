"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Mail, MapPin, Phone, Rocket, Facebook, Twitter, Instagram, Linkedin, Check, Loader2, Globe, MailIcon } from "lucide-react";
import toast from "react-hot-toast";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submission started for email:", email);
    if (!email) {
      console.warn("Email is empty, skipping submission.");
      return;
    }

    setIsSubmitting(true);
    try {
      console.log("Triggering API call to /api/subscribe...");
      const response = await fetch("/api/subscribe", {
        method: "POST",
        body: JSON.stringify({ email }),
        headers: { "Content-Type": "application/json" },
      });

      console.log("API response received. Status:", response.status);

      if (response.ok) {
        setIsSubscribed(true);
        toast.success("Strategic intelligence pipeline active!");
        setEmail("");
        setTimeout(() => setIsSubscribed(false), 5000);
      } else {
        const errorData = await response.json();
        console.error("API error data:", errorData);
        toast.error(`Subscription Failed: ${errorData.error || "Retry later"}`);
      }
    } catch (err: any) {
      console.error("Technical transmission failure:", err);
      toast.error(`Technical failure: ${err.message || "Unknown error"}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer className="pt-24 pb-12 bg-black border-t border-white/10 relative z-10 overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[100px] rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16 px-4">
          {/* Logo & About */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center space-x-2 text-2xl font-bold text-white group">
              <div className="p-2 rounded-lg bg-primary group-hover:shadow-glow transition-all">
                <Rocket className="w-6 h-6 text-white" />
              </div>
              <span className="tracking-tight uppercase italic">Convertix<span className="text-primary italic"> Studio</span></span>
            </Link>
            <p className="text-white/40 text-sm leading-relaxed font-semibold">
              Transforming digital visions into high-performance business machines.
              We blend creative vision with technical precision.
            </p>
            <div className="flex items-center space-x-4">
              {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                <Link key={i} href="#" className="p-2 rounded-full border border-white/10 hover:border-primary text-white/40 hover:text-primary transition-all">
                  <Icon className="w-4 h-4" />
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="px-4">
            <h4 className="text-white font-black mb-6 text-xs uppercase tracking-[4px]">Navigation</h4>
            <ul className="space-y-4">
              {["Home", "Services", "Portfolio", "Pricing", "Blog", "Contact"].map((item) => (
                <li key={item}>
                  <Link href={`/${item.toLowerCase() === 'home' ? '' : item.toLowerCase()}`} className="text-white/40 hover:text-primary transition-colors text-xs font-bold uppercase tracking-widest">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details */}
          <div className="px-4">
            <h4 className="text-white font-black mb-6 text-xs uppercase tracking-[4px]">Connect</h4>
            <ul className="space-y-4">
              <li className="flex items-center space-x-3 text-white/40 text-sm group">
                <Mail className="w-6 h-6 group-hover:text-primary transition-colors" />
                <span className="font-bold">contact.convertix@gmail.com</span>
              </li>
              <li className="flex items-center space-x-3 text-white/40 text-sm group">
                <MapPin className="w-6 h-6 group-hover:text-primary transition-colors" />
                <span className="font-bold">Islamabad, Pakistan</span>
              </li>
              <li className="flex items-center space-x-3 text-white/40 text-sm group">
                <Globe className="w-6 h-6 group-hover:text-primary transition-colors" />
                <span className="font-bold">Serving Clients Worldwide</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="px-4">
            <h4 className="text-white font-black mb-6 text-xs uppercase tracking-[4px]">Direct Updates</h4>
            <p className="text-white/40 text-sm mb-6 leading-relaxed font-bold">
              Stay ahead with our latest digital growth strategies.
            </p>
            <div className="flex items-center p-1 bg-white/5 border border-white/10 rounded-2xl relative z-20">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value.toLowerCase())}
                placeholder="DIGITAL MAIL"
                className="bg-transparent border-none focus:ring-0 text-xs px-4 py-2 w-full text-white placeholder:text-white/20 font-bold uppercase"
              />
              <button
                type="button"
                onClick={(e: any) => handleSubscribe(e)}
                className="bg-primary text-white p-3 rounded-xl hover:bg-accent transition-colors shadow-glow disabled:opacity-50 relative z-30"
                disabled={isSubscribed || !email || isSubmitting}
              >
                {isSubscribed ? (
                  <Check className="w-4 h-4 text-white" />
                ) : isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                ) : (
                  <Rocket className="w-4 h-4 text-white" />
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between space-y-6 md:space-y-0 px-4">
          <p className="text-white/20 text-[10px] font-black uppercase tracking-[5px]">
            © {new Date().getFullYear()} Convertix Studio. All Rights Reserved.
          </p>
          <div className="flex items-center space-x-8 text-white/20 text-[10px] font-black uppercase tracking-widest">
            <Link href="#" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-white transition-colors">Term of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
