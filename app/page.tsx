import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { HeroVideo } from "@/components/portal/HeroVideo";
import { TravelClubSignup } from "@/components/portal/TravelClubSignup";
import { ArtifactCard } from "@/components/product/ArtifactCard";
import { getFeaturedProducts } from "@/lib/shopify";
import { DESTINATIONS } from "@/lib/data/atlas";
import { ArrowRight, Compass } from "lucide-react";

export default async function HomePage() {
  const featuredProducts = await getFeaturedProducts(6);

  return (
    <div className="flex flex-col">
      {/* 1. CINEMATIC PORTAL HERO - negative margin pulls it under transparent nav */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden -mt-20">
        <div className="absolute inset-0">
          <HeroVideo 
            src="https://5kynenqtmmcueqop.public.blob.vercel-storage.com/LocraHero.mp4" 
            className="w-full h-full"
          />
          {/* Gradient overlay - stronger at top for nav readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-stone-900/60 via-stone-900/30 to-stone-900/70" />
        </div>

        <div className="container-narrow relative z-10 text-center py-20">
          <p className="text-[10px] items-center gap-3 inline-flex font-medium tracking-[0.3em] text-white/80 uppercase mb-6 animate-fade-in drop-shadow-md">
            <span className="w-8 h-px bg-white/40" />
            The Pursuit of Horizon
            <span className="w-8 h-px bg-white/40" />
          </p>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-light tracking-tight mb-8 text-balance animate-slide-up text-white drop-shadow-2xl [text-wrap:balance]">
            Entering the <br /> 
            <span className="italic">Atlas</span>
          </h1>

          <p className="text-lg md:text-2xl text-white/90 max-w-2xl mx-auto mb-12 animate-fade-in font-serif italic drop-shadow-md leading-relaxed">
            Curated artifacts inspired by the world&apos;s most iconic destinations. 
            Enter through our gateway portals.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 animate-fade-in">
            <Button asChild size="xl" className="rounded-none px-12 bg-white text-stone-900 hover:bg-gold hover:text-white transition-all duration-500 border-none">
              <Link href="#atlas">Discover the Atlas</Link>
            </Button>
            <Button asChild variant="outline" size="xl" className="rounded-none px-12 border-white/40 text-white backdrop-blur-sm hover:bg-white/10">
              <Link href="/artifacts">The Archive</Link>
            </Button>
          </div>
        </div>

        {/* Scroll Waypoint */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 animate-fade-in">
          <div className="w-px h-24 bg-gradient-to-b from-white/0 via-white/40 to-white/0" />
          <span className="text-[10px] text-white/40 tracking-[0.2em] uppercase">Scale to Explore</span>
        </div>
      </section>

      {/* 2. THE ATLAS GATEWAY GRID */}
      <section id="atlas" className="section-spacing bg-[#F9F8F6]">
        <div className="container-wide">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div className="max-w-xl">
              <Badge variant="outline" className="mb-4 border-stone-200 text-stone-400 px-3 py-1 text-[10px] uppercase tracking-widest">
                Gateway Index 01-04
              </Badge>
              <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl mb-6 leading-tight">
                Select Your <br /> Destination
              </h2>
              <p className="text-stone-500 leading-relaxed font-light">
                Each destination is a world unto itself. Explore artifacts woven from the spirit, heritage, and atmosphere of these specific regions.
              </p>
            </div>
            <Link href="/atlas" className="group flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] text-stone-400 hover:text-gold transition-colors">
              View Full Atlas <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-2" aria-hidden="true" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {DESTINATIONS.map((dest, index) => (
              <Link
                key={dest.handle}
                href={`/destinations/${dest.handle}`}
                className="group relative flex flex-col"
              >
                <div className="relative aspect-[3/4] mb-6 overflow-hidden rounded-sm">
                  <Image
                    src={dest.thumbnailUrl}
                    alt={dest.name}
                    fill
                    className="object-cover transition-transform duration-1000 group-hover:scale-110"
                  />
                  {/* Subtle Arch Mask / Overlay */}
                  <div className="absolute inset-0 bg-stone-900/10 group-hover:bg-stone-900/0 transition-colors duration-500" />
                  
                  {/* Coordinates Overlay */}
                  <div className="absolute top-4 left-4">
                    <span className="text-[10px] font-mono text-white/80 tracking-tighter drop-shadow-sm">
                      {dest.coordinates}
                    </span>
                  </div>
                </div>

                <div className="space-y-2 px-2">
                  <p className="text-[10px] font-medium tracking-widest text-gold uppercase">
                    {dest.region}
                  </p>
                  <h3 className="font-serif text-2xl group-hover:text-gold transition-colors duration-300">
                    {dest.name}
                  </h3>
                  <p className="text-sm text-stone-500 font-light italic opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    {dest.poeticDescription}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 3. FEATURED ARTIFACTS - ARCHIVE PREVIEW */}
      <section className="section-spacing bg-white">
        <div className="container-wide">
          <div className="text-center mb-20">
            <h2 className="font-serif text-4xl md:text-5xl mb-6 [text-wrap:balance]">Latest from the Archive</h2>
            <div className="w-16 h-px bg-gold mx-auto" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-20">
            {featuredProducts.map((product) => (
              <ArtifactCard key={product.id} product={product} />
            ))}
          </div>

          <div className="mt-24 text-center">
            <Button asChild variant="outline" size="xl" className="rounded-none border-stone-200 text-stone-600 hover:border-gold hover:text-gold min-w-[240px]">
              <Link href="/artifacts">Explore All Artifacts</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* 4. EXPANDING WORLD - MAP SECTION */}
      <section className="py-32 bg-stone-900 text-stone-100 overflow-hidden relative">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gold/20 via-transparent to-transparent" />
          {/* Stylized Grid Lines */}
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle, #D4A853 0.5px, transparent 0.5px)', backgroundSize: '40px 40px' }} />
        </div>

        <div className="container-narrow relative z-10 text-center">
          <Compass className="w-12 h-12 text-gold mx-auto mb-8 animate-pulse" aria-hidden="true" />
          <h2 className="font-serif text-4xl md:text-5xl mb-8 leading-tight [text-wrap:balance]">An Expanding <br /> Point of View</h2>
          <p className="text-stone-400 max-w-xl mx-auto mb-12 font-light leading-relaxed">
            Locra is growing. From the ivory streets of Santorini to the lush paths of Kyoto, our Atlas is an ever-evolving map of inspiration. New destinations are currently being scouted for our next archival drop.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-[10px] tracking-[0.3em] uppercase font-bold text-gold/60">
            <span>Marrakech</span>
            <span className="text-stone-700">•</span>
            <span>Copenhagen</span>
            <span className="text-stone-700">•</span>
            <span>Provence</span>
            <span className="text-stone-700">•</span>
            <span>Tulum</span>
          </div>
        </div>
      </section>

      {/* 5. TRAVEL CLUB MEMBERSHIP */}
      <section className="section-spacing bg-[#F9F8F6]">
        <div className="container-narrow">
          <TravelClubSignup />
        </div>
      </section>

      {/* 6. JOURNAL PREVIEW */}
      <section className="pb-32 bg-[#F9F8F6]">
        <div className="container-wide">
          <Separator className="mb-20 bg-stone-200" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="relative aspect-video rounded-sm overflow-hidden">
              <Image 
                src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80&w=1200"
                alt="Journal"
                fill
                className="object-cover"
              />
            </div>
            <div className="space-y-8">
              <Badge variant="outline" className="border-gold text-gold px-3 mb-2">The Journal</Badge>
              <h2 className="font-serif text-4xl md:text-5xl">Moments <br /> Between Places</h2>
              <p className="text-stone-500 font-light leading-relaxed">
                The Locra Journal is where we document the stories that don&apos;t fit on a label. Read about the morning light in Kyoto or the coastal secrets of Amalfi.
              </p>
              <Button asChild variant="link" className="p-0 h-auto text-gold uppercase tracking-[0.2em] text-xs font-bold hover:gap-4 transition-all">
                <Link href="/journal" className="inline-flex items-center gap-2">
                  Read the Journal <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
