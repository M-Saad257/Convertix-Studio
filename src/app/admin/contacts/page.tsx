"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";
import { Mail, MessageCircle, Phone, User, Trash2, CheckCircle, RefreshCw, Send } from "lucide-react";
import { ContactMessage } from "@/types/database.types";
import { formatDate } from "@/lib/utils";
import DirectMessageModal from "@/components/admin/DirectMessageModal";

export default function AdminContacts() {
  const [contacts, setContacts] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncStatus, setSyncStatus] = useState<'connecting' | 'online' | 'offline'>('connecting');
  const [selectedRecipient, setSelectedRecipient] = useState<any>(null);

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

    // Set up realtime sub with status monitoring
    const channel = supabase
      .channel('admin_contacts_sync')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'contacts' },
        () => {
          // Whenever ANY change happens (Insert, Update, Delete)
          // We fetch fresh data. This is much more robust than handling payloads.
          fetchContacts();
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') setSyncStatus('online');
        if (status === 'CLOSED' || status === 'CHANNEL_ERROR') setSyncStatus('offline');
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const deleteContact = async (id: string) => {
    if (!confirm("Are you sure you want to delete this message?")) return;
    await supabase.from('contacts').delete().eq('id', id);
  };

  return (
    <div className="space-y-12">
      <DirectMessageModal 
        isOpen={!!selectedRecipient}
        onClose={() => setSelectedRecipient(null)}
        recipient={selectedRecipient || { name: '', email: '', id: '' }}
      />
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black uppercase italic tracking-tighter mb-2">
            Incoming <span className="text-primary tracking-widest text-xs italic">Leads.</span>
          </h1>
          <div className="flex items-center space-x-4">
            <p className="text-white/20 text-xs font-black uppercase tracking-[4px]">
              Total Messages: {contacts.length}
            </p>
            <div className="flex items-center space-x-2 bg-white/[0.03] px-3 py-1 rounded-full border border-white/5">
                <div className={`w-1.5 h-1.5 rounded-full ${syncStatus === 'online' ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                <span className="text-[8px] font-black uppercase tracking-widest text-white/40">
                    {syncStatus === 'online' ? 'Realtime Active' : 'Offline - Polling Only'}
                </span>
            </div>
          </div>
        </div>

        <button 
          onClick={fetchContacts}
          className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 text-white/40 hover:text-white hover:bg-white/5 transition-all flex items-center space-x-2 group"
          title="Manual Sync"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-primary' : 'group-hover:rotate-180 transition-transform duration-500'}`} />
          <span className="text-[10px] font-black uppercase tracking-widest italic">Sync Now</span>
        </button>
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
              className="bg-white/[0.02] border border-white/5 p-8 rounded-[40px] transition-all relative overflow-hidden group hover:border-white/10"
            >
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
                  <button
                    onClick={() => setSelectedRecipient({ name: contact.name, email: contact.email, id: contact.id })}
                    className="p-4 rounded-2xl bg-primary/10 border border-primary/20 text-primary hover:bg-primary transition-all hover:text-black group shadow-lg"
                    title="Send Response Transmission"
                  >
                    <Send className="w-5 h-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                  </button>
                  <button
                    onClick={() => deleteContact(contact.id)}
                    className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500 transition-all hover:text-white group"
                    title="Purge Intelligence"
                  >
                    <Trash2 className="w-5 h-5 transition-transform group-hover:scale-110" />
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
