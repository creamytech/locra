import { DESTINATIONS, REGIONS } from "@/lib/data/atlas";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { Compass, ArrowRight, Map } from "lucide-react";

export const metadata = {
  title: "The Atlas — Discover Destinations",
  description: "Navigate our global Digital Atlas. Explore the gateway portals to our archival collections.",
};

export default function AtlasPage() {
  return (
    <div className="flex flex-col bg-stone-900 min-h-screen text-stone-100">
      {/* 1. ATLAS SCANNER HERO */}
      <section className="relative py-32 border-b border-white/5 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
           {/* Grid Pattern Overlay */}
           <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle, #D4A853 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
           <div className="absolute inset-0 bg-gradient-to-b from-stone-900 via-transparent to-stone-900" />
        </div>
        
        <div className="container-wide relative z-10">
          <div className="flex flex-col items-center text-center space-y-8 max-w-3xl mx-auto">
            <div className="flex items-center gap-4 text-gold mb-4 animate-pulse">
               <Map className="w-6 h-6" />
               <span className="text-[10px] uppercase tracking-[0.6em] font-bold">World Scanner active</span>
            </div>
            <h1 className="font-serif text-5xl md:text-8xl italic leading-none">The Atlas</h1>
            <p className="text-stone-400 font-light text-lg italic leading-relaxed">
              &ldquo;Discovering the architecture of atmosphere. Navigate the gateway portals to explore archival collections tied to iconic coordinates.&rdquo;
            </p>
          </div>
        </div>
      </section>

      {/* 2. REGION SELECTORS */}
      <section className="bg-stone-950/50 py-8 border-b border-white/5 sticky top-20 z-40 backdrop-blur-xl">
        <div className="container-wide overflow-x-auto">
          <div className="flex items-center gap-12 whitespace-nowrap min-w-max px-4">
             <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-stone-500">Jump To Sector:</span>
             {REGIONS.map(region => (
               <Link 
                 key={region}
                 href={`#${region.toLowerCase()}`}
                 className="text-[11px] uppercase tracking-[0.2em] font-medium text-stone-300 hover:text-gold transition-colors"
               >
                 {region}
               </Link>
             ))}
          </div>
        </div>
      </section>

      {/* 3. PORTAL INDEX */}
      <section className="py-24">
        <div className="container-wide space-y-32">
           {REGIONS.map(region => {
             const regionDestinations = DESTINATIONS.filter(d => d.region === region);
             if (regionDestinations.length === 0) return null;
             
             return (
               <div key={region} id={region.toLowerCase()} className="space-y-16">
                 <div className="flex items-center gap-8">
                   <h2 className="font-serif text-3xl md:text-5xl italic">{region}</h2>
                   <div className="flex-1 h-px bg-gradient-to-r from-gold/40 to-transparent" />
                 </div>
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
                   {regionDestinations.map((dest) => (
                     <Link 
                       key={dest.handle}
                       href={`/destinations/${dest.handle}`}
                       className="group relative"
                     >
                       <article className="space-y-8">
                         {/* Portal Visual */}
                         <div 
                           className="relative aspect-[3/4] overflow-hidden bg-stone-800"
                           style={{ borderRadius: "50% 50% 0 0 / 25% 25% 0 0" }}
                         >
                           <Image 
                            src={dest.heroImageUrl} 
                            alt={dest.name}
                            fill
                            className="object-cover transition-transform duration-[2s] group-hover:scale-110 opacity-70 group-hover:opacity-100"
                           />
                           {/* Coordinate Overlay Overlay */}
                           <div className="absolute inset-0 bg-stone-900/40 group-hover:bg-transparent transition-colors duration-700" />
                           
                           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none transition-all duration-700 group-hover:opacity-0">
                              <span className="font-serif text-3xl italic opacity-80">{dest.name}</span>
                              <div className="h-px w-12 bg-gold/50 mx-auto mt-4" />
                           </div>
                         </div>
                         
                         {/* Details */}
                         <div className="space-y-4 px-4">
                           <div className="flex items-center justify-between">
                             <span className="text-[10px] font-mono tracking-tighter text-gold/60">{dest.coordinates}</span>
                             <Badge variant="outline" className="border-white/10 text-stone-500 py-0 px-2 text-[8px]">{dest.handle.toUpperCase()}-v1</Badge>
                           </div>
                           <h3 className="font-serif text-3xl group-hover:text-gold transition-colors italic">{dest.name}</h3>
                           <p className="text-stone-400 font-light leading-relaxed italic line-clamp-2">
                             {dest.poeticDescription}
                           </p>
                           <div className="pt-4 flex items-center gap-4 text-[10px] uppercase font-bold tracking-[0.2em] text-white">
                             Explore Collections <ArrowRight className="w-4 h-4 text-gold group-hover:translate-x-2 transition-transform" />
                           </div>
                         </div>
                       </article>
                     </Link>
                   ))}
                 </div>
               </div>
             );
           })}
        </div>
      </section>

      {/* 4. EXPANSION NOTE */}
      <section className="py-48 bg-stone-950 border-t border-white/5 relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5">
           <Compass className="w-[800px] h-[800px] text-gold" />
        </div>
        
        <div className="container-narrow text-center relative z-10">
           <Compass className="w-12 h-12 text-gold mx-auto mb-12 animate-spin-slow" />
           <h2 className="font-serif text-4xl md:text-6xl mb-8 italic">New Worlds Pending</h2>
           <p className="text-stone-400 font-light max-w-lg mx-auto leading-relaxed">
             The Atlas is not finite. We are constantly scouting new atmospheric coordinates. Marrakech, Copenhagen, and the Nordic Highlands are currently under scouting observation.
           </p>
           <Button asChild className="mt-16 bg-white text-stone-950 hover:bg-gold hover:text-white rounded-none px-12 uppercase tracking-widest font-bold text-xs py-8 h-auto">
             <Link href="/travel-club">Request Sector Notification</Link>
           </Button>
        </div>
      </section>
    </div>
  );
}
