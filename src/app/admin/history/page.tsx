"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, User, Mail, ChevronDown, ChevronUp, Search, RefreshCw, MessageCircle, Trash2 } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface SentMessage {
  id: string;
  recipient_email: string;
  recipient_name: string;
  subject: string;
  content: string;
  created_at: string;
}

export default function AdminHistory() {
  const [messages, setMessages] = useState<SentMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const fetchHistory = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('sent_messages')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setMessages(data);
    }
    setLoading(false);
  };

  const deleteMessage = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this log entry?")) return;
    await supabase.from('sent_messages').delete().eq('id', id);
    fetchHistory();
  };

  useEffect(() => {
    fetchHistory();
    
    const channel = supabase
      .channel('history_sync')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'sent_messages' }, () => fetchHistory())
      .subscribe();

    return () => {
        supabase.removeChannel(channel);
    };
  }, []);

  const filteredMessages = messages.filter(m => 
    m.recipient_email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.recipient_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-12">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black uppercase italic tracking-tighter mb-2">
            Message <span className="text-primary tracking-widest text-xs italic">History.</span>
          </h1>
          <p className="text-white/20 text-xs font-black uppercase tracking-[4px]">
            Total Transmissions: {messages.length}
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-primary transition-colors" />
                <input 
                    type="text" 
                    placeholder="Search Archives..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-white/[0.03] border border-white/10 rounded-2xl pl-12 pr-6 py-4 text-xs font-black uppercase tracking-widest focus:outline-none focus:border-primary/40 transition-all w-full md:w-64 italic"
                />
            </div>
            <button 
                onClick={fetchHistory}
                className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 text-white/40 hover:text-white hover:bg-white/5 transition-all"
            >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-primary' : ''}`} />
            </button>
        </div>
      </header>

      <div className="grid gap-4">
        {loading && messages.length === 0 ? (
          [...Array(3)].map((_, i) => (
            <div key={i} className="h-20 bg-white/5 border border-white/5 rounded-3xl animate-pulse" />
          ))
        ) : filteredMessages.length > 0 ? (
          filteredMessages.map((msg) => (
            <div 
                key={msg.id}
                className={`bg-white/[0.02] border transition-all rounded-[32px] overflow-hidden ${expandedId === msg.id ? 'border-primary/40' : 'border-white/5 hover:border-white/10'}`}
            >
              <button 
                onClick={() => setExpandedId(expandedId === msg.id ? null : msg.id)}
                className="w-full p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 text-left"
              >
                <div className="flex items-center space-x-6 flex-1">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
                    <Mail className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3 mb-1">
                        <span className="text-xs font-black uppercase tracking-widest italic">{msg.recipient_name}</span>
                        <span className="text-[10px] text-white/20">/</span>
                        <span className="text-[10px] text-white/40 font-bold">{msg.recipient_email}</span>
                    </div>
                    <p className="text-[9px] font-black uppercase tracking-[3px] text-white/20 truncate italic">
                        {msg.subject}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-6">
                    <div className="text-right hidden md:block">
                        <p className="text-[8px] font-black uppercase tracking-widest text-white/10 italic">Timestamp</p>
                        <p className="text-[10px] text-white/40 font-bold">{formatDate(msg.created_at)}</p>
                    </div>
                    <div className="p-2 rounded-xl bg-white/5 border border-white/10 text-white/40">
                        {expandedId === msg.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                </div>
              </button>

              <AnimatePresence>
                {expandedId === msg.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-t border-white/5 bg-black/40"
                  >
                    <div className="p-8 space-y-6">
                        <div className="flex items-start space-x-4">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5" />
                            <div className="flex-1">
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-primary mb-2 italic">Transmission Content:</h4>
                                <div className="p-6 rounded-2xl bg-white/[0.01] border border-white/5 text-sm text-white/60 leading-relaxed italic whitespace-pre-wrap">
                                    {msg.content}
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-between items-center pt-4 border-t border-white/5 gap-4">
                            <p className="text-[8px] font-black uppercase tracking-[4px] text-white/10 italic">Transmission Signature: contact.convertix@gmail.com</p>
                            <div className="flex items-center space-x-4">
                                <span className="text-[10px] font-black text-primary italic">Status: Delivered</span>
                                <button
                                    onClick={(e) => deleteMessage(e, msg.id)}
                                    className="p-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white transition-all flex items-center space-x-2 group-hover:scale-105"
                                    title="Purge Log Entry"
                                >
                                    <Trash2 className="w-3.5 h-3.5" />
                                    <span className="text-[8px] font-black uppercase tracking-widest">Purge Log</span>
                                </button>
                            </div>
                        </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))
        ) : (
          <div className="py-20 text-center opacity-20">
            <MessageCircle className="w-16 h-16 mx-auto mb-4" />
            <p className="text-xs font-black uppercase tracking-[4px] italic">No archived transmissions found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
