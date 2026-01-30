import { DESTINATIONS, REGIONS } from "@/lib/data/atlas";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { Compass, ArrowRight, Map, Globe2 } from "lucide-react";
import { AtlasGlobe } from "@/components/atlas/AtlasGlobe";

export const metadata = {
  title: "The Atlas — Explore World Destinations | LOCRA",
  description: "Navigate our interactive globe. Discover apparel collections inspired by iconic destinations around the world.",
};

export default function AtlasPage() {
  return (
    <div className="flex flex-col bg-stone-900 min-h-screen text-stone-100">
      {/* 1. GLOBE HERO SECTION */}
      <section className="relative py-20 md:py-32 border-b border-white/5 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle, #D4A853 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
          <div className="absolute inset-0 bg-gradient-to-b from-stone-900 via-transparent to-stone-900" />
        </div>
        
        <div className="container-wide relative z-10">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-4 text-gold mb-6">
              <Globe2 className="w-6 h-6" />
              <span className="text-[10px] uppercase tracking-[0.6em] font-bold">World Scanner Active</span>
            </div>
            <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl italic leading-none mb-6">
              The Atlas
            </h1>
            <p className="text-stone-400 font-light text-lg italic leading-relaxed max-w-2xl mx-auto">
              &ldquo;Discovering the architecture of atmosphere. Navigate the globe to explore archival collections tied to iconic coordinates.&rdquo;
            </p>
          </div>

          {/* Interactive Globe Section */}
          <AtlasGlobe />
        </div>
      </section>

      {/* 2. REGION QUICK NAV */}
      <section className="bg-stone-950/50 py-6 border-b border-white/5 sticky top-20 z-40 backdrop-blur-xl">
        <div className="container-wide overflow-x-auto">
          <div className="flex items-center gap-8 lg:gap-12 whitespace-nowrap min-w-max px-4">
            <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-stone-500">Jump To:</span>
            {REGIONS.map(region => (
              <Link 
                key={region}
                href={`#${region.toLowerCase().replace(/\s+/g, '-')}`}
                className="text-[11px] uppercase tracking-[0.2em] font-medium text-stone-300 hover:text-gold transition-colors"
              >
                {region}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 3. DESTINATION GRID BY REGION */}
      <section className="py-24">
        <div className="container-wide space-y-32">
          {REGIONS.map(region => {
            const regionDestinations = DESTINATIONS.filter(d => d.region === region);
            if (regionDestinations.length === 0) return null;
            
            return (
              <div key={region} id={region.toLowerCase().replace(/\s+/g, '-')} className="space-y-16">
                {/* Region Header */}
                <div className="flex items-center gap-8">
                  <h2 className="font-serif text-3xl md:text-5xl italic">{region}</h2>
                  <div className="flex-1 h-px bg-gradient-to-r from-gold/40 to-transparent" />
                  <span className="text-[11px] text-stone-500 uppercase tracking-wider">
                    {regionDestinations.length} {regionDestinations.length === 1 ? 'Destination' : 'Destinations'}
                  </span>
                </div>
                
                {/* Destination Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16">
                  {regionDestinations.map((dest) => (
                    <Link 
                      key={dest.handle}
                      href={`/destinations/${dest.handle}`}
                      className="group relative"
                    >
                      <article className="space-y-6">
                        {/* Portal Visual */}
                        <div 
                          className="relative aspect-[3/4] overflow-hidden bg-stone-800"
                          style={{ borderRadius: "50% 50% 16px 16px / 30% 30% 0 0" }}
                        >
                          <Image 
                            src={dest.heroImageUrl} 
                            alt={dest.name}
                            fill
                            className="object-cover transition-all duration-700 group-hover:scale-110 opacity-70 group-hover:opacity-100"
                          />
                          {/* Overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 via-stone-900/20 to-transparent" />
                          
                          {/* Hover Content */}
                          <div className="absolute inset-0 flex items-end p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                            <div className="text-white">
                              <p className="text-[10px] uppercase tracking-wider text-gold mb-2">Explore</p>
                              <p className="font-serif text-2xl italic">{dest.name}</p>
                            </div>
                          </div>
                          
                          {/* Color accent bar */}
                          <div 
                            className="absolute bottom-0 left-0 right-0 h-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            style={{ backgroundColor: dest.colorPalette.accent }}
                          />
                        </div>
                        
                        {/* Details */}
                        <div className="space-y-3 px-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-mono tracking-tight text-gold/60">
                              {dest.coordinates}
                            </span>
                            <Badge variant="outline" className="border-white/10 text-stone-500 py-0 px-2 text-[8px]">
                              {dest.handle.toUpperCase()}
                            </Badge>
                          </div>
                          <h3 className="font-serif text-2xl md:text-3xl group-hover:text-gold transition-colors italic">
                            {dest.name}
                          </h3>
                          <p className="text-stone-400 font-light leading-relaxed italic text-sm line-clamp-2">
                            {dest.poeticDescription}
                          </p>
                          <div className="pt-2 flex items-center gap-3 text-[10px] uppercase font-bold tracking-[0.2em] text-white group-hover:text-gold transition-colors">
                            Explore Collection 
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
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

      {/* 4. COMING SOON / EXPANSION */}
      <section className="py-32 md:py-48 bg-stone-950 border-t border-white/5 relative overflow-hidden">
        {/* Giant compass background */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5">
          <Compass className="w-[800px] h-[800px] text-gold" />
        </div>
        
        <div className="container-narrow text-center relative z-10">
          <Compass className="w-12 h-12 text-gold mx-auto mb-12 animate-spin-slow" />
          <h2 className="font-serif text-4xl md:text-6xl mb-8 italic">New Worlds Pending</h2>
          <p className="text-stone-400 font-light max-w-lg mx-auto leading-relaxed mb-12">
            The Atlas is ever-expanding. We are constantly scouting new atmospheric coordinates. 
            Copenhagen, Tulum, and the Scottish Highlands are currently under observation.
          </p>
          <Button asChild className="bg-white text-stone-950 hover:bg-gold hover:text-white rounded-full px-8 uppercase tracking-widest font-bold text-xs py-6 h-auto">
            <Link href="/travel-club">Request Sector Notification</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
