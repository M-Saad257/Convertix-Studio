"use client";

import React, { useEffect, useState } from "react";
import { supabase, uploadImage } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, Edit, Save, X, ExternalLink, Github, Image as ImageIcon, Upload } from "lucide-react";
import { Project } from "@/types/database.types";

export default function AdminProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState<Partial<Project>>({
    name: "",
    description: "",
    category: "Development",
    image_url: "",
    project_url: "",
    github_url: ""
  });

  const fetchProjects = async () => {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setProjects(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setUploading(true);
    try {
      const url = await uploadImage(e.target.files[0], 'projects');
      setFormData({ ...formData, image_url: url });
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Failed to upload image intelligence to matrix.");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (id?: string) => {
    if (id) {
       // Update
       const { error } = await supabase.from('projects').update(formData).eq('id', id);
       if (!error) {
         setProjects(projects.map(p => p.id === id ? { ...p, ...formData } : p));
         setEditingId(null);
       }
    } else {
       // Create
       const { data, error } = await supabase.from('projects').insert([formData]).select();
       if (!error && data) {
         setProjects([data[0], ...projects]);
         setShowAddForm(false);
         setFormData({ name: "", description: "", category: "Development", image_url: "", project_url: "", github_url: "" });
       }
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to terminate this project from the matrix?")) return;
    const { error } = await supabase.from('projects').delete().eq('id', id);
    if (!error) {
      setProjects(projects.filter(p => p.id !== id));
    }
  };

  const handleEdit = (project: Project) => {
    setFormData(project);
    setEditingId(project.id);
    setShowAddForm(false);
  };

  return (
    <div className="space-y-12">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black uppercase italic tracking-tighter mb-2">
            Project <span className="text-primary tracking-widest text-xs italic">Registry.</span>
          </h1>
          <p className="text-white/20 text-xs font-black uppercase tracking-[4px]">
            Operational Capacity: {projects.length} Entries
          </p>
        </div>
        <button
          onClick={() => { setShowAddForm(!showAddForm); setEditingId(null); setFormData({ name: "", description: "", category: "Development", image_url: "", project_url: "", github_url: "" }); }}
          className="bg-primary hover:bg-primary/80 text-black px-6 py-4 rounded-2xl flex items-center space-x-2 font-black uppercase tracking-widest text-xs italic transition-all shadow-lg"
        >
          {showAddForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          <span>{showAddForm ? "Abort Protocol" : "Initialize New Execution"}</span>
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
                <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-2 italic">Entity Designation</label>
                <input
                  type="text"
                  placeholder="e.g. KITCHLIANCE"
                  className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-sm focus:border-primary/50 focus:outline-none transition-all placeholder:opacity-20"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-2 italic">Operational Category</label>
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
                <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-2 italic">Mission Parameters (Description)</label>
                <textarea
                  placeholder="Mission brief..."
                  className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-sm focus:border-primary/50 focus:outline-none transition-all h-24 placeholder:opacity-20"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-2 italic">Intelligence Asset (Image)</label>
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
                        onChange={handleFileUpload}
                        accept="image/*"
                     />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-2 italic">Broadcast Link (URL)</label>
                <div className="relative">
                  <ExternalLink className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                  <input
                    type="text"
                    placeholder="https://kitchliance.com"
                    className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 pl-12 text-sm focus:border-primary/50 focus:outline-none transition-all"
                    value={formData.project_url}
                    onChange={(e) => setFormData({ ...formData, project_url: e.target.value })}
                  />
                </div>
              </div>

              <div className="md:col-span-2 flex justify-end space-x-4 pt-4">
                <button
                  onClick={() => handleSave(editingId || undefined)}
                  className="bg-primary hover:bg-primary/80 text-black px-8 py-4 rounded-2xl flex items-center space-x-2 font-black uppercase tracking-widest text-xs italic transition-all shadow-glow"
                >
                  <Save className="w-4 h-4" />
                  <span>Execute {editingId ? "Modification" : "Registry"}</span>
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
        ) : projects.map((project) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="group bg-white/[0.02] border border-white/5 rounded-[48px] overflow-hidden hover:border-primary/20 transition-all flex flex-col h-full"
          >
            <div className="relative aspect-[16/10] overflow-hidden">
                <img src={project.image_url} className="w-full h-full object-cover grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700" alt={project.name} />
                <div className="absolute top-6 right-6 px-4 py-2 bg-black/60 backdrop-blur-md border border-white/10 rounded-full text-[8px] font-black uppercase tracking-widest italic text-primary">
                    {project.category}
                </div>
            </div>
            
            <div className="p-10 flex flex-col flex-grow space-y-4">
                <h3 className="text-2xl font-black uppercase italic tracking-tighter group-hover:text-primary transition-colors">{project.name}</h3>
                <p className="text-xs text-white/20 font-bold uppercase tracking-widest italic line-clamp-2 leading-relaxed">
                    "{project.description}"
                </p>
                <div className="pt-6 mt-auto flex items-center justify-between border-t border-white/5">
                    <div className="flex space-x-2">
                        {project.project_url && (
                             <a href={project.project_url} target="_blank" className="p-3 bg-white/5 rounded-xl text-white/40 hover:text-primary hover:bg-primary/10 transition-all border border-transparent hover:border-primary/20 shadow-lg">
                                <ExternalLink className="w-4 h-4" />
                             </a>
                        )}
                        {project.github_url && (
                             <a href={project.github_url} target="_blank" className="p-3 bg-white/5 rounded-xl text-white/40 hover:text-primary hover:bg-primary/10 transition-all border border-transparent hover:border-primary/20 shadow-lg">
                                <Github className="w-4 h-4" />
                             </a>
                        )}
                    </div>
                    <div className="flex space-x-2">
                        <button onClick={() => handleEdit(project)} className="p-3 bg-white/5 rounded-xl text-white/20 hover:text-white transition-all">
                            <Edit className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(project.id)} className="p-3 bg-white/5 rounded-xl text-white/20 hover:text-red-500 transition-all">
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
