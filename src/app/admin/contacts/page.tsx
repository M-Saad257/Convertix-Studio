"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";
import { Mail, MessageCircle, Phone, User, Trash2, CheckCircle } from "lucide-react";
import { ContactMessage } from "@/types/database.types";
import { formatDate } from "@/lib/utils";

export default function AdminContacts() {
  const [contacts, setContacts] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchContacts = async () => {
    const { data, error } = await supabase
      .from('contacts')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setContacts(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const markAsRead = async (id: string) => {
    const { error } = await supabase
      .from('contacts')
      .update({ is_read: true })
      .eq('id', id);
    
    if (!error) {
      setContacts(contacts.map(c => c.id === id ? { ...c, is_read: true } : c));
    }
  };

  const deleteContact = async (id: string) => {
    if (!confirm("Are you sure you want to purge this transmission data?")) return;
    const { error } = await supabase
      .from('contacts')
      .delete()
      .eq('id', id);
    
    if (!error) {
      setContacts(contacts.filter(c => c.id !== id));
    }
  };

  return (
    <div className="space-y-12">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black uppercase italic tracking-tighter mb-2">
            Incoming <span className="text-primary tracking-widest text-xs italic">Leads.</span>
          </h1>
          <p className="text-white/20 text-xs font-black uppercase tracking-[4px]">
            Total Transmissions Received: {contacts.length}
          </p>
        </div>
      </header>

      <div className="grid gap-6">
        {loading ? (
            [...Array(3)].map((_, i) => (
                <div key={i} className="h-48 bg-white/5 border border-white/5 rounded-[40px] animate-pulse" />
            ))
        ) : contacts.length > 0 ? (
          contacts.map((contact) => (
            <motion.div
              key={contact.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className={`bg-white/[0.02] border ${contact.is_read ? 'border-white/5 opacity-60' : 'border-primary/20 shadow-[0_0_30px_rgba(var(--primary-rgb),0.05)]'} p-8 rounded-[40px] transition-all relative overflow-hidden`}
            >
              {!contact.is_read && (
                <div className="absolute top-0 right-0 px-6 py-2 bg-primary text-black text-[8px] font-black uppercase tracking-widest italic rounded-bl-3xl">
                  New Encryption Received
                </div>
              )}
              
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-8">
                <div className="space-y-6 flex-1">
                  <div className="flex flex-wrap gap-6 items-center">
                    <div className="flex items-center space-x-2 text-white/60">
                      <User className="w-4 h-4 text-primary" />
                      <span className="text-xs font-black uppercase tracking-widest italic">{contact.name}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-white/60">
                      <Mail className="w-4 h-4 text-primary" />
                      <span className="text-xs font-black uppercase tracking-widest italic">{contact.email}</span>
                    </div>
                    {contact.phone && (
                        <div className="flex items-center space-x-2 text-white/60">
                        <Phone className="w-4 h-4 text-primary" />
                        <span className="text-xs font-black uppercase tracking-widest italic">{contact.phone}</span>
                      </div>
                    )}
                    <div className="text-[10px] text-white/20 font-black uppercase tracking-[2px]">
                      {formatDate(contact.created_at)}
                    </div>
                  </div>

                  <div className="bg-black/40 border border-white/5 p-6 rounded-3xl relative">
                    <MessageCircle className="absolute -top-3 -left-3 w-6 h-6 text-primary/20" />
                    <p className="text-sm font-bold text-white/60 leading-relaxed italic">
                      "{contact.message}"
                    </p>
                  </div>
                </div>

                <div className="flex lg:flex-col gap-3">
                  {!contact.is_read && (
                    <button
                      onClick={() => markAsRead(contact.id)}
                      className="p-4 rounded-2xl bg-primary/10 border border-primary/20 text-primary hover:bg-primary transition-all hover:text-black group shadow-lg"
                      title="Mark as Read"
                    >
                      <CheckCircle className="w-5 h-5" />
                    </button>
                  )}
                  <button
                    onClick={() => deleteContact(contact.id)}
                    className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500 transition-all hover:text-white group"
                    title="Purge Intelligence"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="py-20 text-center opacity-20">
            <MessageCircle className="w-16 h-16 mx-auto mb-4" />
            <p className="text-xs font-black uppercase tracking-[4px] italic">Zero Lead Transmissions in the Grid.</p>
          </div>
        )}
      </div>
    </div>
  );
}
