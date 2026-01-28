import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, Clock } from "lucide-react";

export const metadata = {
  title: "The Journal — LOCRA Expeditions",
  description: "Stories from the field. Documentation of our global archival journeys.",
};

// Simulated data - in reality this would come from Shopify Blogs or a CMS
const JOURNAL_ENTRIES = [
  {
    handle: "golden-hour-in-oia",
    title: "The Golden Hour in Oia",
    excerpt: "Documenting the specific spectrum of light that inspired our Santorini Linen collection.",
    category: "Expedition",
    date: "July 12, 2026",
    readingTime: "5 min read",
    imageUrl: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&q=80&w=800"
  },
  {
    handle: "weaving-traditions-kyoto",
    title: "Weaving Traditions: A Day in Kyoto",
    excerpt: "Behind the loom with the master weavers of the Gion district.",
    category: "Craftsmanship",
    date: "August 04, 2026",
    readingTime: "8 min read",
    imageUrl: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&q=80&w=800"
  },
  {
    handle: "mediterranean-verticality",
    title: "Mediterranean Verticality",
    excerpt: "How the cliffside architecture of Amalfi defined our structured silhouettes.",
    category: "Design Story",
    date: "June 28, 2026",
    readingTime: "4 min read",
    imageUrl: "https://images.unsplash.com/photo-1533104816931-20fa691ff6ca?auto=format&fit=crop&q=80&w=800"
  },
  {
    handle: "the-atlas-philosophy",
    title: "The Atlas Philosophy",
    excerpt: "Why we believe travel is more than movement; it is a pursuit of perspective.",
    category: "Manifesto",
    date: "May 15, 2026",
    readingTime: "12 min read",
    imageUrl: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80&w=800"
  }
];

export default function JournalPage() {
  return (
    <div className="flex flex-col bg-white min-h-screen">
      {/* 1. EDITORIAL HEADER */}
      <section className="py-24 bg-[#F9F8F6] border-b border-stone-100">
        <div className="container-wide text-center max-w-3xl mx-auto">
          <BookOpen className="w-8 h-8 text-gold mx-auto mb-8" />
          <h1 className="font-serif text-5xl md:text-7xl mb-8 italic">The Journal</h1>
          <p className="text-stone-500 font-light leading-relaxed text-lg italic">
            &ldquo;Inscriptions from the field. Chronicling the stories that shape our archival collections.&rdquo;
          </p>
        </div>
      </section>

      {/* 2. JOURNAL FEED */}
      <section className="section-spacing">
        <div className="container-wide">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-24">
            {JOURNAL_ENTRIES.map((entry, index) => (
              <Link 
                key={entry.handle} 
                href={`/journal/${entry.handle}`}
                className="group flex flex-col h-full"
              >
                <div className="relative aspect-[16/10] mb-8 overflow-hidden bg-stone-50">
                   <Image 
                    src={entry.imageUrl}
                    alt={entry.title}
                    fill
                    className="object-cover transition-transform duration-[2s] group-hover:scale-110"
                   />
                   <div className="absolute inset-0 bg-stone-900/10 group-hover:bg-transparent transition-colors duration-[1s]" />
                   <div className="absolute top-6 left-6">
                     <Badge variant="outline" className="bg-white/80 backdrop-blur-sm border-none text-[9px] uppercase tracking-[0.2em] font-bold px-3">
                       {entry.category}
                     </Badge>
                   </div>
                </div>
                
                <div className="flex-1 space-y-4">
                  <div className="flex items-center gap-6 text-[10px] uppercase tracking-[0.2em] font-bold text-stone-400">
                    <span className="flex items-center gap-2">
                       <Clock className="w-3 h-3 text-gold" /> {entry.readingTime}
                    </span>
                    <span className="w-8 h-px bg-stone-100" />
                    <span>Archive: {entry.date}</span>
                  </div>
                  
                  <h2 className="font-serif text-3xl md:text-4xl group-hover:text-gold transition-colors duration-500 italic">
                    {entry.title}
                  </h2>
                  
                  <p className="text-stone-500 font-light leading-relaxed line-clamp-2">
                    {entry.excerpt}
                  </p>
                  
                  <div className="pt-4 flex items-center gap-4 text-[10px] uppercase tracking-widest font-bold text-stone-900">
                    Read Entry <ArrowRight className="w-4 h-4 text-gold group-hover:translate-x-2 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 3. NEWSLETTER TIE-IN */}
      <section className="section-spacing bg-[#F9F8F6] border-t border-stone-100">
        <div className="container-narrow text-center">
           <h3 className="font-serif text-3xl mb-8 italic">The Field Notes</h3>
           <p className="text-stone-500 mb-12 font-light">
             Receive the Journal directly in your inbox. No marketing fluff, just pure editorial from our archival expeditions.
           </p>
           <div className="flex w-full max-w-sm mx-auto shadow-sm">
             <input type="email" placeholder="Email coordinates" className="flex-1 bg-white border border-stone-200 border-r-0 text-stone-900 px-6 py-4 outline-none" />
             <Button className="bg-stone-900 text-white px-8 rounded-none uppercase tracking-widest font-bold text-[10px] hover:bg-gold transition-colors">Subscribe</Button>
           </div>
        </div>
      </section>
    </div>
  );
}
