import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { Compass, Landmark, Wind, Sun } from "lucide-react";

export const metadata = {
  title: "Our Story — LOCRA Manifesto",
  description: "The philosophy behind LOCRA. We create wearable artifacts inspired by the world's most atmospheric coordinates.",
};

export default function AboutPage() {
  const principles = [
    {
      icon: <Wind className="w-6 h-6 text-gold" />,
      title: "Atmospheric Precision",
      description: "We don't design for seasons; we design for specific coordinates. Every thread captures the light, scent, and spirit of a unique place."
    },
    {
      icon: <Landmark className="w-6 h-6 text-gold" />,
      title: "Archival Quality",
      description: "Our artifacts are made to last as long as the memories of the journey. We use natural fibers and heritage techniques that age with grace."
    },
    {
      icon: <Sun className="w-6 h-6 text-gold" />,
      title: "Curated Presence",
      description: "In an age of fast consumption, we advocate for slow exploration. We release collections only when the story is fully lived."
    }
  ];

  return (
    <div className="flex flex-col bg-white">
      {/* 1. MANIFESTO HERO */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image 
            src="https://images.unsplash.com/photo-1518173835740-f5d14111d76a?auto=format&fit=crop&q=80&w=1600" 
            alt="Horizon"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-stone-900/40" />
        </div>
        
        <div className="container-narrow relative z-10 text-center text-white">
          <h1 className="text-6xl md:text-8xl font-serif mb-8 italic drop-shadow-2xl">The Manifesto</h1>
          <p className="text-xl md:text-2xl text-white/90 font-serif italic max-w-2xl mx-auto leading-relaxed">
            &ldquo;We do not sell clothing. We preserve the spirit of a destination in a wearable object.&rdquo;
          </p>
        </div>
      </section>

      {/* 2. OUR MISSION */}
      <section className="py-32 bg-white">
        <div className="container-narrow">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-8">
              <Badge variant="outline" className="border-gold text-gold px-4 py-1">Origin Story</Badge>
              <h2 className="font-serif text-4xl md:text-6xl leading-tight">Beyond the <br /> Horizon</h2>
              <p className="text-stone-500 font-light text-lg leading-relaxed">
                LOCRA was born from a simple observation: the most profound souvenirs are the ones that carry the silence and the light of the places we leave behind. 
              </p>
              <p className="text-stone-500 font-light leading-relaxed">
                Founded in 2026, we began as a small archive of objects collected during a single expedition through the Cyclades. Since then, our mission has expanded into a global Digital Atlas—a portal connecting people back to the pulse of the world.
              </p>
            </div>
            <div className="relative aspect-[4/5] bg-stone-50 rounded-sm overflow-hidden">
               <Image 
                src="https://images.unsplash.com/photo-1471623432079-b009d30b6729?auto=format&fit=crop&q=80&w=800"
                alt="Process"
                fill
                className="object-cover"
               />
            </div>
          </div>
        </div>
      </section>

      {/* 3. THE GRID PRINCIPLES */}
      <section className="py-32 bg-stone-900 text-white relative">
        <div className="absolute top-0 right-0 w-1/3 h-full opacity-10 pointer-events-none">
           <Compass className="w-[500px] h-[500px] text-gold absolute -top-20 -right-20 rotate-12" />
        </div>
        
        <div className="container-wide relative z-10">
           <div className="text-center mb-24 max-w-2xl mx-auto">
             <span className="text-[10px] tracking-[0.4em] font-medium text-gold uppercase mb-6 block">Our Foundation</span>
             <h2 className="font-serif text-4xl md:text-6xl mb-8 italic">Archival Principles</h2>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
             {principles.map((p, idx) => (
               <div key={idx} className="space-y-6 group">
                  <div className="w-16 h-16 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-gold group-hover:border-gold transition-all duration-500">
                    {p.icon}
                  </div>
                  <h3 className="font-serif text-2xl italic">{p.title}</h3>
                  <p className="text-stone-400 font-light leading-relaxed">
                    {p.description}
                  </p>
               </div>
             ))}
           </div>
        </div>
      </section>

      {/* 4. THE CRAFT */}
      <section className="py-32 bg-[#F9F8F6]">
        <div className="container-wide">
          <div className="flex flex-col items-center text-center space-y-12">
            <h2 className="font-serif text-4xl md:text-6xl max-w-3xl leading-tight">Everything is documented. <br /> Everything is intentional.</h2>
            <Separator className="w-24 bg-gold" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-12 w-full mt-12">
               <div className="space-y-4">
                 <span className="text-4xl font-serif italic text-stone-900">100%</span>
                 <p className="text-[10px] uppercase font-bold tracking-widest text-stone-400">Natural Fibers</p>
               </div>
               <div className="space-y-4">
                 <span className="text-4xl font-serif italic text-stone-900">01</span>
                 <p className="text-[10px] uppercase font-bold tracking-widest text-stone-400">Archival Portal</p>
               </div>
               <div className="space-y-4">
                 <span className="text-4xl font-serif italic text-stone-900">04</span>
                 <p className="text-[10px] uppercase font-bold tracking-widest text-stone-400">Live Expeditions</p>
               </div>
               <div className="space-y-4">
                 <span className="text-4xl font-serif italic text-stone-900">∞</span>
                 <p className="text-[10px] uppercase font-bold tracking-widest text-stone-400">Memories Preserved</p>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FINALE CTA */}
      <section className="py-40 bg-white border-t border-stone-100">
        <div className="container-narrow text-center space-y-12">
           <h2 className="font-serif text-4xl md:text-5xl italic">Join the Expedition.</h2>
           <p className="text-stone-500 max-w-md mx-auto font-light leading-relaxed">
             Become a resident of the Atlas. Follow our journeys and secure artifacts from the next destination.
           </p>
           <div className="flex justify-center gap-6">
              <Button asChild size="xl" className="rounded-none bg-stone-900 text-white hover:bg-gold transition-all px-12">
                <Link href="/travel-club">Enter Travel Club</Link>
              </Button>
           </div>
        </div>
      </section>
    </div>
  );
}
