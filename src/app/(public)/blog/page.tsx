import React from "react";
import Link from "next/link";
import { ArrowRight, Calendar, Clock } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import { BlogPost } from "@/types/database.types";

export default async function BlogListPage() {
  const { data: posts, error } = await supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching blogs:", error);
  }

  return (
    <div className="min-h-screen pt-32 pb-24 px-4 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20 px-4">
            <h1 className="text-5xl md:text-8xl font-black mb-6 uppercase tracking-tighter italic">Insights & <span className="text-primary italic">Updates.</span></h1>
            <p className="text-white/40 text-lg max-w-2xl mx-auto font-bold uppercase tracking-widest text-[10px]">
                Technical execution, strategic vision, and brand scaling intelligence.
            </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 px-4">
          {posts && posts.length > 0 ? (
            posts.map((post: BlogPost) => (
              <Link key={post.id} href={`/blog/${post.slug}`} className="group">
                <article className="glass rounded-[64px] border border-white/5 overflow-hidden flex flex-col h-full hover:border-primary/50 transition-all shadow-3xl hover:-translate-y-2 relative">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 blur-[100px] rounded-full group-hover:scale-150 transition-transform duration-700" />
                  
                  <div className="p-12 md:p-16 flex flex-col flex-grow space-y-6 relative z-10">
                    <div className="flex items-center space-x-3 text-[10px] font-black uppercase tracking-[3px] text-primary">
                        <Calendar className="w-3 h-3" />
                        <span>{formatDate(post.created_at)}</span>
                        <span>•</span>
                        <Clock className="w-3 h-3" />
                        <span>5 MIN READ</span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-black group-hover:text-primary transition-colors line-clamp-2 leading-none uppercase italic tracking-tighter">
                        {post.title}
                    </h2>
                    <p className="text-white/40 text-sm md:text-base line-clamp-3 leading-relaxed flex-grow font-bold tracking-widest uppercase text-[10px]">
                        {post.content.replace(/<[^>]*>/g, '').substring(0, 150)}...
                    </p>
                    <div className="pt-8 flex items-center space-x-3 text-[10px] font-black uppercase tracking-[4px] text-white opacity-40 group-hover:opacity-100 transition-all">
                        <span>Examine Intelligence</span>
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                    </div>
                  </div>
                </article>
              </Link>
            ))
          ) : (
            <div className="col-span-full py-20 text-center opacity-40">
              <p className="text-sm font-black uppercase tracking-[4px] italic">No active intelligence found in the grid.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
