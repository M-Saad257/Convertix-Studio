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
  const [isCustom, setIsCustom] = useState(false);
  const categories = ["Development", "Design", "Strategy", "Marketing"];

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

    const channel = supabase
      .channel('admin_projects')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'projects' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setProjects(current => [payload.new as Project, ...current]);
          } else if (payload.eventType === 'UPDATE') {
            setProjects(current => current.map(p => p.id === payload.new.id ? { ...p, ...payload.new } : p));
          } else if (payload.eventType === 'DELETE') {
            setProjects(current => current.filter(p => p.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setUploading(true);
    try {
      const url = await uploadImage(e.target.files[0], 'projects');
      setFormData({ ...formData, image_url: url });
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Failed to upload project image.");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (id?: string) => {
    if (id) {
       await supabase.from('projects').update(formData).eq('id', id);
       setEditingId(null);
    } else {
       await supabase.from('projects').insert([formData]);
       setShowAddForm(false);
       setFormData({ name: "", description: "", category: "Development", image_url: "", project_url: "", github_url: "" });
       setIsCustom(false);
    }
    // State will be updated via realtime subscription
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    await supabase.from('projects').delete().eq('id', id);
    // State will be updated via realtime subscription
  };

  const handleEdit = (project: Project) => {
    setFormData(project);
    setEditingId(project.id);
    setShowAddForm(false);
    setIsCustom(!categories.includes(project.category));
  };

  return (
    <div className="space-y-12">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black uppercase italic tracking-tighter mb-2">
            Project <span className="text-primary tracking-widest text-xs italic">Management.</span>
          </h1>
          <p className="text-white/20 text-xs font-black uppercase tracking-[4px]">
            Total Entries: {projects.length}
          </p>
        </div>
        <button
          onClick={() => { 
            setShowAddForm(!showAddForm); 
            setEditingId(null); 
            setFormData({ name: "", description: "", category: "Development", image_url: "", project_url: "", github_url: "" });
            setIsCustom(false);
          }}
          className="bg-primary hover:bg-primary/80 text-black px-6 py-4 rounded-2xl flex items-center space-x-2 font-black uppercase tracking-widest text-xs italic transition-all shadow-lg"
        >
          {showAddForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          <span>{showAddForm ? "Cancel" : "Add New Project"}</span>
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
                <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-2 italic">Project Name</label>
                <input
                  type="text"
                  placeholder="e.g. Kitchliance"
                  className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-sm focus:border-primary/50 focus:outline-none transition-all placeholder:opacity-20"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-2 italic">Project Category</label>
                <div className="space-y-4">
                  <div className="relative group/select">
                    <select
                      className="w-full bg-black/60 border border-white/10 rounded-2xl p-4 pr-12 text-sm focus:border-primary/50 focus:outline-none transition-all appearance-none cursor-pointer group-hover/select:border-white/20 select-custom"
                      value={isCustom ? "Custom" : formData.category}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === "Custom") {
                          setIsCustom(true);
                          setFormData({ ...formData, category: "" });
                        } else {
                          setIsCustom(false);
                          setFormData({ ...formData, category: val });
                        }
                      }}
                    >
                      {categories.map(cat => (
                        <option key={cat} value={cat} className="bg-black text-white">{cat.toUpperCase()}</option>
                      ))}
                      <option value="Custom" className="bg-black text-white">CUSTOM / OTHER</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-white/20 group-hover/select:text-primary transition-colors">
                      <Plus className={`w-4 h-4 transition-transform duration-300 ${isCustom ? 'rotate-45' : ''}`} />
                    </div>
                  </div>

                  <AnimatePresence>
                    {isCustom && (
                      <motion.div
                        initial={{ opacity: 0, height: 0, y: -10 }}
                        animate={{ opacity: 1, height: 'auto', y: 0 }}
                        exit={{ opacity: 0, height: 0, y: -10 }}
                        className="overflow-hidden"
                      >
                        <input
                          type="text"
                          placeholder="Enter custom category..."
                          className="w-full bg-primary/5 border border-primary/20 rounded-2xl p-4 text-sm focus:border-primary focus:outline-none transition-all placeholder:opacity-20 text-primary font-bold italic"
                          value={formData.category}
                          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                          autoFocus
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              <div className="md:col-span-2 space-y-4">
                <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-2 italic">Project Description</label>
                <textarea
                  placeholder="Describe the project..."
                  className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-sm focus:border-primary/50 focus:outline-none transition-all h-24 placeholder:opacity-20"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-2 italic">Project Image</label>
                <div className="relative group/upload">
                  <div className="aspect-video relative rounded-2xl bg-black/40 border border-white/10 overflow-hidden flex flex-col items-center justify-center p-4">
                     {uploading ? (
                         <div className="w-8 h-8 border-2 border-primary border-t-transparent animate-spin rounded-full" />
                     ) : formData.image_url ? (
                         <img src={formData.image_url} className="w-full h-full object-cover rounded-xl" alt="Preview" />
                     ) : (
                         <>
                            <Upload className="w-8 h-8 text-white/10 group-hover/upload:text-primary transition-colors" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-white/20 mt-2">Upload Project Image</span>
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
                <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-2 italic">Website Link (URL)</label>
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
                  <span>{editingId ? "Update Project" : "Save Project"}</span>
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
