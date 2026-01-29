import { getProducts, getCollectionByHandle } from "@/lib/shopify";
import { PieceCard } from "@/components/product/ArtifactCard";
import { Badge } from "@/components/ui/badge";
import { DESTINATIONS } from "@/lib/data/atlas";
import Link from "next/link";
import { Layers, SlidersHorizontal, MapPin, ArrowRight, BookOpen, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata = {
  title: "The Collection — LOCRA",
  description: "Explore the complete collection of wearable artifacts from our global expeditions.",
};

export default async function ArtifactsPage({
  searchParams,
}: {
  searchParams: Promise<{ world?: string; type?: string }>;
}) {
  const { world, type } = await searchParams;
  
  // Fetch products - if world is provided, fetch specifically from that collection
  let products = world 
    ? (await getCollectionByHandle(world, 100))?.products || []
    : await getProducts(100);

  // Filter by type if provided
  if (type) {
    products = products.filter(p => p.productType.toLowerCase() === type.toLowerCase());
  }

  // Get unique types from products for filtering
  const allProducts = await getProducts(250);
  const specimenTypes = Array.from(new Set(allProducts.map(p => p.productType))).filter(Boolean);

  return (
    <div className="flex flex-col bg-white min-h-screen">
      {/* 1. ARCHIVAL HEADER */}
      <section className="py-24 bg-[#F9F8F6] border-b border-stone-100">
        <div className="container-wide">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-12">
            <div className="max-w-2xl">
              <div className="flex items-center gap-3 mb-6">
                <Layers className="w-5 h-5 text-gold" />
                <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-stone-400">Archival Index</span>
              </div>
              <h1 className="font-serif text-5xl md:text-7xl mb-8 italic">The Collection</h1>
              <p className="text-stone-500 font-light leading-relaxed text-lg">
                Explore our curated collection of destination-inspired apparel. Each piece is tied to a specific location in the Locra Atlas.
              </p>
            </div>
            
            <div className="flex flex-col items-end text-right">
              <span className="text-[10px] uppercase tracking-widest text-stone-300 mb-2 font-mono">Catalog Count</span>
              <span className="text-4xl font-light font-serif text-stone-900 leading-none">
                {products.length.toString().padStart(2, '0')}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. FILTERING & WAYFINDING */}
      <section className="sticky top-20 z-40 bg-white/80 backdrop-blur-md border-b border-stone-100 py-6">
        <div className="container-wide">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            
            {/* World Filters (Destinations) */}
            <div className="flex flex-wrap items-center gap-4">
               <span className="text-[9px] uppercase tracking-[0.2em] font-bold text-stone-400 mr-2 flex items-center gap-2">
                 <MapPin className="w-3 h-3" /> Filter By World:
               </span>
               <Link 
                 href="/artifacts"
                 className={cn(
                   "text-[10px] uppercase tracking-widest px-4 py-2 border transition-all duration-300",
                   !world ? "bg-stone-900 text-white border-stone-900" : "border-stone-100 text-stone-400 hover:border-gold hover:text-gold"
                 )}
               >
                 All Origins
               </Link>
               {DESTINATIONS.map(dest => (
                 <Link 
                   key={dest.handle}
                   href={`/artifacts?world=${dest.handle}${type ? `&type=${type}` : ""}`}
                   className={cn(
                     "text-[10px] uppercase tracking-widest px-4 py-2 border transition-all duration-300",
                     world === dest.handle ? "bg-stone-900 text-white border-stone-900" : "border-stone-100 text-stone-400 hover:border-gold hover:text-gold"
                   )}
                 >
                   {dest.name}
                 </Link>
               ))}
            </div>

            {/* Specimen Type Filters */}
            <div className="flex flex-wrap items-center gap-3">
               <SlidersHorizontal className="w-3 h-3 text-stone-400 mr-2" />
               <div className="flex gap-2">
                 {specimenTypes.map(st => (
                   <Link 
                     key={st}
                     href={`/artifacts?type=${st}${world ? `&world=${world}` : ""}`}
                     className={cn(
                       "text-[10px] uppercase tracking-widest py-1 border-b transition-all duration-300",
                       type === st ? "border-gold text-stone-900 font-bold" : "border-transparent text-stone-400 hover:text-stone-600"
                     )}
                   >
                     {st}
                   </Link>
                 ))}
               </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. ARTIFACT GRID */}
      <section className="section-spacing">
        <div className="container-wide">
          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12 lg:gap-16">
              {products.map((product) => (
                <PieceCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="py-40 text-center border-2 border-dashed border-stone-100 rounded-sm">
               <p className="font-serif text-2xl text-stone-300 italic">No artifacts found in this specific sector.</p>
               <Button asChild variant="link" className="mt-8 text-gold uppercase tracking-[0.2em] text-[10px] font-bold">
                 <Link href="/artifacts">Reset Filters</Link>
               </Button>
            </div>
          )}
        </div>
      </section>

      {/* 4. EXPEDITION CTA */}
      <section className="py-32 bg-stone-900 text-white">
        <div className="container-narrow text-center">
          <h2 className="font-serif text-3xl md:text-5xl mb-8 leading-tight italic">Missing a piece of the world?</h2>
          <p className="text-stone-400 mb-12 font-light max-w-md mx-auto">
            Our curators are currently in the field. Join the Travel Club for insider updates on new archival drops from the Arctic and beyond.
          </p>
          <div className="flex w-full max-w-sm mx-auto shadow-2xl">
             <input type="email" placeholder="Your entry email" className="flex-1 bg-stone-800 border-none text-white px-6 py-4 outline-none" />
             <Button className="bg-gold text-stone-950 px-8 rounded-none uppercase tracking-widest font-bold text-[10px] hover:bg-white transition-colors">Join</Button>
          </div>
        </div>
      </section>
    </div>
  );
}
