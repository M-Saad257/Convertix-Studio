import React from "react";
import { notFound } from "next/navigation";
import { Calendar, Clock, ChevronLeft, Share2, CornerUpRight } from "lucide-react";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import blogsData from "@/data/blogs.json";

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = blogsData.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="min-h-screen pt-32 pb-24 bg-background px-4">
      <div className="max-w-4xl mx-auto">
        <Link href="/blog" className="inline-flex items-center space-x-2 text-white/40 hover:text-primary transition-colors mb-10 text-xs font-black uppercase tracking-widest italic">
            <ChevronLeft className="w-4 h-4" />
            <span>Back to Insights</span>
        </Link>
        
        <header className="mb-16">
            <div className="flex items-center space-x-3 text-[10px] font-black uppercase tracking-[3px] text-primary mb-6">
                <Calendar className="w-3 h-3" />
                <span>{formatDate(post.createdAt)}</span>
                <span>•</span>
                <Clock className="w-3 h-3" />
                <span>8 MIN READ</span>
            </div>
            <h1 className="text-4xl md:text-7xl font-black mb-8 leading-none tracking-tighter uppercase italic drop-shadow-2xl">
                {post.title}
            </h1>
            <div className="flex items-center justify-between pt-8 border-t border-white/5 px-2">
                <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary">CS</div>
                    <div>
                        <p className="text-xs font-black text-white tracking-widest uppercase italic">Convertix Studio</p>
                        <p className="text-[10px] text-white/40 uppercase font-black tracking-widest">Growth Intelligence</p>
                    </div>
                </div>
                <div className="flex items-center space-x-3">
                   <span className="text-[10px] font-black uppercase tracking-widest text-white/20">Transmit:</span>
                   <button className="p-3 rounded-full bg-white/5 border border-white/10 text-white/40 hover:text-primary transition-all">
                        <Share2 className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </header>

        <div 
          className="prose prose-invert prose-lg max-w-none prose-headings:font-black prose-headings:uppercase prose-headings:italic prose-headings:tracking-tighter prose-p:text-white/60 prose-strong:text-primary prose-strong:font-black prose-a:text-primary prose-a:no-underline hover:prose-a:underline font-bold"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        <footer className="mt-24 pt-16 border-t border-white/5 px-4 text-center items-center flex flex-col justify-center">
            <div className="glass p-12 md:p-20 rounded-[64px] text-center border border-white/5 relative overflow-hidden group shadow-3xl max-w-3xl">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[100px] rounded-full group-hover:scale-150 transition-transform duration-700" />
                <h3 className="text-4xl md:text-6xl font-black mb-8 uppercase tracking-tighter italic leading-none">Ready to Scale?</h3>
                <p className="text-white/40 mb-12 max-w-xl mx-auto font-bold text-lg leading-relaxed uppercase tracking-widest text-[10px]">
                    Our team merges technical precision with creative vision. Let's discuss your next digital move.
                </p>
                <Link href="/contact" className="btn-primary inline-flex items-center space-x-3 px-12 py-5 text-lg uppercase tracking-widest font-black">
                    <span>Contact Strategy Lead</span>
                    <CornerUpRight className="w-6 h-6" />
                </Link>
            </div>
        </footer>
      </div>
    </article>
  );
}
