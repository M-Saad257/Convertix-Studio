"use client";

import React, { useEffect, useState } from "react";
import { supabase, uploadImage } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, Edit, Save, X, Eye, Newspaper, Upload } from "lucide-react";
import { BlogPost } from "@/types/database.types";
import { formatDate } from "@/lib/utils";
import Link from "next/link";

export default function AdminPosts() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState<Partial<BlogPost>>({
    title: "",
    slug: "",
    content: "",
    category: "STRATEGY",
    author_name: "Convertix Team"
  });

  const fetchPosts = async () => {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setPosts(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleSave = async (id?: string) => {
    // Basic slug generation if empty
    const finalData = {
        ...formData,
        slug: formData.slug || formData.title?.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '') || 'untitled'
    };

    if (id) {
       const { error } = await supabase.from('posts').update(finalData).eq('id', id);
       if (!error) {
         setPosts(posts.map(p => p.id === id ? { ...p, ...finalData } : p));
         setEditingId(null);
       }
    } else {
       const { data, error } = await supabase.from('posts').insert([finalData]).select();
       if (!error && data) {
         setPosts([data[0], ...posts]);
         setShowAddForm(false);
         setFormData({ title: "", slug: "", content: "", category: "STRATEGY", author_name: "Convertix Team" });
       }
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this transmission from history?")) return;
    const { error } = await supabase.from('posts').delete().eq('id', id);
    if (!error) {
      setPosts(posts.filter(p => p.id !== id));
    }
  };

  const handleEdit = (post: BlogPost) => {
    setFormData(post);
    setEditingId(post.id);
    setShowAddForm(false);
  };

  return (
    <div className="space-y-12">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black uppercase italic tracking-tighter mb-2">
            Insight <span className="text-primary tracking-widest text-xs italic">Terminal.</span>
          </h1>
          <p className="text-white/20 text-xs font-black uppercase tracking-[4px]">
            Intelligence Logs: {posts.length} Transmissions
          </p>
        </div>
        <button
          onClick={() => { setShowAddForm(!showAddForm); setEditingId(null); setFormData({ title: "", slug: "", content: "", category: "STRATEGY", author_name: "Convertix Team" }); }}
          className="bg-primary hover:bg-primary/80 text-black px-6 py-4 rounded-2xl flex items-center space-x-2 font-black uppercase tracking-widest text-xs italic transition-all shadow-lg"
        >
          {showAddForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          <span>{showAddForm ? "Abort Uplink" : "New Transmission"}</span>
        </button>
      </header>

      <AnimatePresence>
        {(showAddForm || editingId) && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white/[0.02] border border-primary/20 p-10 rounded-[48px] relative overflow-hidden group shadow-2xl"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] rounded-full" />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
              <div className="space-y-4 md:col-span-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-2 italic">Transmission Title</label>
                <input
                  type="text"
                  placeholder="e.g. Scaling Digital Velocity"
                  className="w-full bg-black/40 border border-white/10 rounded-2xl p-6 text-xl font-black uppercase italic tracking-tighter focus:border-primary/50 focus:outline-none transition-all placeholder:opacity-10"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-2 italic">Slug Identity (Auto-generated if empty)</label>
                <input
                  type="text"
                  placeholder="scaling-digital-velocity"
                  className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-sm focus:border-primary/50 focus:outline-none transition-all placeholder:opacity-20"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                />
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-2 italic">Intelligence Asset (Featured Image)</label>
                <div className="relative group/upload">
                  <div className="aspect-video relative rounded-2xl bg-black/40 border border-white/10 overflow-hidden flex flex-col items-center justify-center p-4">
                     {uploading ? (
                         <div className="w-8 h-8 border-2 border-primary border-t-transparent animate-spin rounded-full" />
                     ) : formData.image_url ? (
                         <img src={formData.image_url} className="w-full h-full object-cover rounded-xl" alt="Preview" />
                     ) : (
                         <>
                            <Upload className="w-8 h-8 text-white/10 group-hover/upload:text-primary transition-colors" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-white/20 mt-2">Transmit Image Data</span>
                         </>
                     )}
                     <input
                        type="file"
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        onChange={async (e) => {
                          if (!e.target.files || e.target.files.length === 0) return;
                          setUploading(true);
                          try {
                            const url = await uploadImage(e.target.files[0], 'blogs');
                            setFormData({ ...formData, image_url: url });
                          } finally {
                            setUploading(false);
                          }
                        }}
                        accept="image/*"
                     />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-2 italic">Intel Category</label>
                <select
                  className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-sm focus:border-primary/50 focus:outline-none transition-all"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  <option value="STRATEGY" className="bg-black">STRATEGY</option>
                  <option value="DESIGN" className="bg-black">DESIGN</option>
                  <option value="TECH" className="bg-black">TECH</option>
                  <option value="GROWTH" className="bg-black">GROWTH</option>
                </select>
              </div>

              <div className="md:col-span-2 space-y-4">
                <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-2 italic">Core Intelligence (HTML Content)</label>
                <textarea
                  placeholder="Enter HTML content..."
                  className="w-full bg-black/40 border border-white/10 rounded-2xl p-6 text-sm focus:border-primary/50 focus:outline-none transition-all h-64 font-mono placeholder:opacity-10"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                />
              </div>

              <div className="md:col-span-2 flex justify-end space-x-4 pt-4">
                <button
                  onClick={() => handleSave(editingId || undefined)}
                  className="bg-primary hover:bg-primary/80 text-black px-12 py-5 rounded-2xl flex items-center space-x-3 font-black uppercase tracking-widest text-sm italic transition-all shadow-glow"
                >
                  <Save className="w-5 h-5" />
                  <span>Transmit {editingId ? "Update" : "Data"}</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid gap-6">
        {loading ? (
            [...Array(3)].map((_, i) => (
                <div key={i} className="h-32 bg-white/5 border border-white/5 rounded-[40px] animate-pulse" />
            ))
        ) : posts.length > 0 ? (
          posts.map((post) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="group bg-white/[0.02] border border-white/5 p-8 rounded-[40px] hover:border-primary/20 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
              <div className="flex items-center space-x-6">
                 <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                    <Newspaper className="w-8 h-8 text-primary/40 group-hover:text-primary transition-colors" />
                 </div>
                 <div>
                    <div className="flex items-center space-x-3 mb-1">
                        <span className="text-[10px] font-black uppercase tracking-widest text-primary italic">{post.category}</span>
                        <span className="text-white/20">•</span>
                        <span className="text-[10px] font-black uppercase tracking-widest text-white/20 italic">{formatDate(post.created_at)}</span>
                    </div>
                    <h3 className="text-xl font-black uppercase italic tracking-tighter group-hover:text-primary transition-colors">{post.title}</h3>
                    <p className="text-[10px] text-white/20 font-black uppercase tracking-widest mt-1">/{post.slug}</p>
                 </div>
              </div>

              <div className="flex space-x-3">
                 <Link href={`/blog/${post.slug}`} target="_blank" className="p-4 bg-white/5 border border-white/5 rounded-2xl text-white/40 hover:text-white transition-all">
                    <Eye className="w-5 h-5" />
                 </Link>
                 <button onClick={() => handleEdit(post)} className="p-4 bg-white/5 border border-white/5 rounded-2xl text-white/40 hover:text-white transition-all">
                    <Edit className="w-5 h-5" />
                 </button>
                 <button onClick={() => handleDelete(post.id)} className="p-4 bg-white/5 border border-white/5 rounded-2xl text-white/40 hover:text-red-500 transition-all">
                    <Trash2 className="w-5 h-5" />
                 </button>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="py-20 text-center opacity-20">
            <Newspaper className="w-16 h-16 mx-auto mb-4" />
            <p className="text-xs font-black uppercase tracking-[4px] italic">No active intelligence logs detected.</p>
          </div>
        )}
      </div>
    </div>
  );
}
