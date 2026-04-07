"use client";

import React, { useEffect, useState } from "react";
import { supabase, uploadImage } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, Edit, Save, X, ImageIcon, Upload } from "lucide-react";
import { PortfolioItem } from "@/types/database.types";

export default function AdminPortfolio() {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState<Partial<PortfolioItem>>({
    title: "",
    description: "",
    category: "Development",
    image_url: ""
  });

  const fetchItems = async () => {
    const { data, error } = await supabase
      .from('portfolio')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setItems(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleSave = async (id?: string) => {
    if (id) {
       const { error } = await supabase.from('portfolio').update(formData).eq('id', id);
       if (!error) {
         setItems(items.map(item => item.id === id ? { ...item, ...formData } : item));
         setEditingId(null);
       }
    } else {
       const { data, error } = await supabase.from('portfolio').insert([formData]).select();
       if (!error && data) {
         setItems([data[0], ...items]);
         setShowAddForm(false);
         setFormData({ title: "", description: "", category: "Development", image_url: "" });
       }
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to purge this work from the gallery?")) return;
    const { error } = await supabase.from('portfolio').delete().eq('id', id);
    if (!error) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const handleEdit = (item: PortfolioItem) => {
    setFormData(item);
    setEditingId(item.id);
    setShowAddForm(false);
  };

  return (
    <div className="space-y-12">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black uppercase italic tracking-tighter mb-2">
            Portfolio <span className="text-primary tracking-widest text-xs italic">Curation.</span>
          </h1>
          <p className="text-white/20 text-xs font-black uppercase tracking-[4px]">
            Selected Works: {items.length} Elements
          </p>
        </div>
        <button
          onClick={() => { setShowAddForm(!showAddForm); setEditingId(null); setFormData({ title: "", description: "", category: "Development", image_url: "" }); }}
          className="bg-primary hover:bg-primary/80 text-black px-6 py-4 rounded-2xl flex items-center space-x-2 font-black uppercase tracking-widest text-xs italic transition-all shadow-lg"
        >
          {showAddForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          <span>{showAddForm ? "Abort Modification" : "Add Portfolio Asset"}</span>
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
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-2 italic">Asset Title</label>
                <input
                  type="text"
                  placeholder="e.g. Aura AI"
                  className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-sm focus:border-primary/50 focus:outline-none transition-all placeholder:opacity-20"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-2 italic">Execution Category</label>
                <select
                  className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-sm focus:border-primary/50 focus:outline-none transition-all"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  <option value="Development" className="bg-black">DEVELOPMENT</option>
                  <option value="Design" className="bg-black">DESIGN</option>
                  <option value="Strategy" className="bg-black">STRATEGY</option>
                  <option value="Marketing" className="bg-black">MARKETING</option>
                </select>
              </div>

              <div className="md:col-span-2 space-y-4">
                <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-2 italic">Execution Summary (Description)</label>
                <textarea
                  placeholder="Brief..."
                  className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-sm focus:border-primary/50 focus:outline-none transition-all h-24 placeholder:opacity-20"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div className="md:col-span-2 space-y-4">
                <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-2 italic">Asset Visual (Image)</label>
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
                            const url = await uploadImage(e.target.files[0], 'portfolio');
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

              <div className="md:col-span-2 flex justify-end space-x-4 pt-4">
                <button
                  onClick={() => handleSave(editingId || undefined)}
                  className="bg-primary hover:bg-primary/80 text-black px-8 py-4 rounded-2xl flex items-center space-x-2 font-black uppercase tracking-widest text-xs italic transition-all shadow-glow"
                >
                  <Save className="w-4 h-4" />
                  <span>Execute {editingId ? "Modification" : "Curation"}</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {loading ? (
            [...Array(3)].map((_, i) => (
                <div key={i} className="aspect-[4/3] bg-white/5 border border-white/5 rounded-[48px] animate-pulse" />
            ))
        ) : items.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="group bg-white/[0.02] border border-white/5 rounded-[48px] overflow-hidden hover:border-primary/20 transition-all flex flex-col h-full"
          >
            <div className="relative aspect-[4/3] overflow-hidden">
                <img src={item.image_url} className="w-full h-full object-cover grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700" alt={item.title} />
                <div className="absolute top-6 right-6 px-4 py-2 bg-black/60 backdrop-blur-md border border-white/10 rounded-full text-[8px] font-black uppercase tracking-widest italic text-primary">
                    {item.category}
                </div>
            </div>
            
            <div className="p-10 flex flex-col flex-grow space-y-4">
                <h3 className="text-2xl font-black uppercase italic tracking-tighter group-hover:text-primary transition-colors">{item.title}</h3>
                <p className="text-xs text-white/20 font-bold uppercase tracking-widest italic line-clamp-2 leading-relaxed">
                    "{item.description}"
                </p>
                <div className="pt-6 mt-auto flex items-center justify-end border-t border-white/5 space-x-2">
                    <button onClick={() => handleEdit(item)} className="p-3 bg-white/5 rounded-xl text-white/20 hover:text-white transition-all">
                        <Edit className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(item.id)} className="p-3 bg-white/5 rounded-xl text-white/20 hover:text-red-500 transition-all">
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
