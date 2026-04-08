"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, User, Mail, ShieldAlert, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

interface DirectMessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipient: {
    name: string;
    email: string;
    id: string;
  };
}

export default function DirectMessageModal({ isOpen, onClose, recipient }: DirectMessageModalProps) {
  const [content, setContent] = useState("");
  const [isSending, setIsSending] = useState(false);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsSending(true);
    try {
      const response = await fetch("/api/admin/broadcast", {
        method: "POST",
        body: JSON.stringify({
          email: recipient.email,
          name: recipient.name,
          content: content,
        }),
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        toast.success("Transmission Dispatched!");
        setContent("");
        onClose();
      } else {
        toast.error("Security tunnel failure. Retry.");
      }
    } catch (err) {
      toast.error("Technical dispatch error.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[110]"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-x-4 top-1/2 -translate-y-1/2 md:left-1/2 md:-translate-x-1/2 md:max-w-2xl bg-[#0b0b0b] border border-white/10 rounded-[48px] p-8 md:p-12 z-[120] shadow-[0_0_50px_rgba(var(--primary-rgb),0.1)] overflow-hidden"
          >
            {/* Background Accent */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] -z-10" />

            {/* Header */}
            <div className="flex justify-between items-start mb-10">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20">
                    <Send className="w-6 h-6 text-primary" />
                </div>
                <div>
                   <h2 className="text-2xl font-black uppercase italic tracking-tighter">Compose <span className="text-primary italic">Transmission.</span></h2>
                   <p className="text-[10px] text-white/20 font-black uppercase tracking-[3px] italic">Official Protocol v1.0</p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="p-3 bg-white/5 border border-white/10 rounded-2xl text-white/40 hover:text-white transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSend} className="space-y-8">
                {/* Recipient Card */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white/5 border border-white/10 p-4 rounded-2xl flex items-center space-x-3">
                        <User className="w-4 h-4 text-primary/40" />
                        <span className="text-[10px] font-black uppercase tracking-widest truncate">{recipient.name}</span>
                    </div>
                    <div className="bg-white/5 border border-white/10 p-4 rounded-2xl flex items-center space-x-3">
                        <Mail className="w-4 h-4 text-primary/40" />
                        <span className="text-[10px] font-black uppercase tracking-widest truncate">{recipient.email}</span>
                    </div>
                </div>

                {/* Content Input */}
                <div className="relative">
                    <textarea
                        required
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="INPUT STRATEGIC INTEL..."
                        rows={6}
                        className="w-full bg-black/40 border border-white/10 rounded-3xl p-6 text-sm text-white/80 placeholder:text-white/10 focus:outline-none focus:border-primary/40 transition-all font-bold italic resize-none leading-relaxed"
                    />
                    <div className="absolute bottom-4 right-6 flex items-center space-x-2 text-[8px] font-black uppercase tracking-[3px] text-white/10 italic">
                        <ShieldAlert className="w-3 h-3" />
                        <span>Fixed Subject: Update from Convertix Studio</span>
                    </div>
                </div>

                {/* Actions */}
                <button
                    type="submit"
                    disabled={isSending || !content.trim()}
                    className="w-full bg-primary hover:bg-black hover:text-primary border-2 border-primary text-black py-6 rounded-2xl font-black text-xs uppercase tracking-[5px] flex items-center justify-center space-x-3 transition-all active:scale-[0.98] disabled:opacity-50 shadow-glow"
                >
                    {isSending ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            <span>Dispatching...</span>
                        </>
                    ) : (
                        <>
                            <span>Transmit Message</span>
                            <Send className="w-5 h-5" />
                        </>
                    )}
                </button>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
