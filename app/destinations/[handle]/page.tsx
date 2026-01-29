import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { PieceCard } from "@/components/product/ArtifactCard";
import { getCollectionByHandle, getFeaturedProducts } from "@/lib/shopify";
import { DESTINATIONS } from "@/lib/data/atlas";
import { ArrowRight, Globe, Camera, BookOpen } from "lucide-react";

interface DestinationPageProps {
  params: Promise<{ handle: string }>;
}

export async function generateMetadata({
  params,
}: DestinationPageProps): Promise<Metadata> {
  const { handle } = await params;
  const dest = DESTINATIONS.find((d) => d.handle === handle);
  const collection = await getCollectionByHandle(handle);

  if (!dest && !collection) {
    return { title: "Portal Not Found" };
  }

  return {
    title: `${dest?.name || collection?.title} — The Atlas`,
    description: dest?.story || collection?.description,
  };
}

export default async function DestinationPage({ params }: DestinationPageProps) {
  const { handle } = await params;
  const dest = DESTINATIONS.find((d) => d.handle === handle);
  const collection = await getCollectionByHandle(handle, 24);

  // Fallback if destination isn't in our hardcoded atlas data yet but exists in Shopify
  if (!collection && !dest) {
    notFound();
  }

  const name = dest?.name || collection?.title || "Destination";
  const coordinates = dest?.coordinates || "Coordinates Pending";
  const story = dest?.story || collection?.description || "";
  const tagline = dest?.tagline || "";
  const heroImage = dest?.heroImageUrl || collection?.image?.url || "";

  return (
    <div className="flex flex-col bg-white">
      {/* 1. CINEMATIC HERO PORTAL */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          {heroImage ? (
            <Image
              src={heroImage}
              alt={name}
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="w-full h-full bg-stone-100" />
          )}
          <div className="absolute inset-0 bg-stone-900/40" />
        </div>
        
        <div className="container-narrow relative z-10 text-center text-white">
          <Badge variant="outline" className="mb-6 border-white/40 text-white px-4 py-1 text-[10px] uppercase tracking-[0.3em] backdrop-blur-sm">
            {coordinates}
          </Badge>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif mb-6 leading-tight drop-shadow-xl italic">
            {name}
          </h1>
          <p className="text-lg md:text-xl font-serif italic text-white/80 drop-shadow-md">
            {tagline}
          </p>
        </div>

        {/* Arch Frame Overlay */}
        <div className="absolute inset-x-0 bottom-0 flex justify-center translate-y-1/2 opacity-20 pointer-events-none">
          <div className="w-[60vw] h-[60vw] border-2 border-white rounded-full" />
        </div>
      </section>

      {/* 2. CURATOR'S STORY */}
      <section className="py-32 bg-[#F9F8F6]">
        <div className="container-narrow text-center">
          <Globe className="w-8 h-8 text-gold mx-auto mb-10" />
          <h2 className="text-[10px] tracking-[0.4em] font-medium text-stone-400 uppercase mb-8">
            The Descent
          </h2>
          <div className="prose prose-stone prose-lg mx-auto">
            <p className="font-serif text-2xl md:text-3xl text-stone-800 leading-relaxed italic">
              &ldquo;{story}&rdquo;
            </p>
          </div>
          <div className="mt-16 w-16 h-px bg-stone-200 mx-auto" />
        </div>
      </section>

      {/* 3. CAPSULE COLLECTION (THE PIECES) */}
      <section className="section-spacing">
        <div className="container-wide">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
            <div>
              <p className="text-[10px] tracking-[0.2em] font-medium text-stone-400 uppercase mb-4">
                Available Pieces
              </p>
              <h3 className="font-serif text-4xl md:text-5xl">The {name} Capsule</h3>
            </div>
            <div className="text-sm text-stone-400 font-serif italic">
              Showing {collection?.products.length || 0} curated pieces
            </div>
          </div>

          {collection && collection.products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10 lg:gap-12">
              {collection.products.map((product) => (
                <PieceCard key={product.id} product={product} destination={name} />
              ))}
            </div>
          ) : (
            <div className="bg-stone-50 border border-dashed border-stone-200 rounded-lg p-20 text-center">
              <p className="font-serif text-xl text-stone-400 italic">
                The vault for {name} is currently being restored. 
                <br />
                Re-entry expected soon.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* 4. POSTCARDS FROM ___ (VISUAL STORYTELLING) */}
      <section className="py-32 bg-stone-900 text-white overflow-hidden">
        <div className="container-wide">
          <div className="flex items-center gap-4 mb-16">
            <Camera className="w-5 h-5 text-gold" />
            <h4 className="text-[10px] tracking-[0.3em] font-bold uppercase">
              Postcards from {name}
            </h4>
          </div>
          
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 md:col-span-8 relative aspect-[16/9] bg-stone-800 rounded-sm overflow-hidden">
               <Image 
                src={heroImage} 
                alt="Postcard 1" 
                fill 
                className="object-cover opacity-80"
              />
            </div>
            <div className="col-span-12 md:col-span-4 relative aspect-[4/5] bg-stone-800 rounded-sm overflow-hidden">
               <Image 
                src={dest?.thumbnailUrl || ""} 
                alt="Postcard 2" 
                fill 
                className="object-cover opacity-80"
              />
            </div>
            <div className="col-span-12 md:col-span-4 relative aspect-square bg-stone-800 rounded-sm overflow-hidden hidden md:block">
               <div className="absolute inset-0 flex items-center justify-center p-12 text-center">
                 <p className="font-serif text-xl italic text-stone-400 leading-relaxed">
                   The light at 5:00 PM over the caldera remains the primary inspiration for our linen textures.
                 </p>
               </div>
            </div>
            <div className="col-span-12 md:col-span-8 relative aspect-[21/9] bg-stone-800 rounded-sm overflow-hidden hidden md:block">
               <Image 
                src="https://images.unsplash.com/photo-1542640244-7e672d6cef21?auto=format&fit=crop&q=80&w=1200" 
                alt="Postcard 3" 
                fill 
                className="object-cover opacity-80"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 5. JOURNAL TIE-IN */}
      <section className="section-spacing bg-[#F9F8F6]">
        <div className="container-narrow">
          <div className="border border-stone-200 p-12 md:p-20 text-center relative overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-12 bg-gold" />
            <BookOpen className="w-6 h-6 text-gold mx-auto mb-8" />
            <h3 className="font-serif text-3xl mb-6 italic">Deep Dive: The {name} Log</h3>
            <p className="text-stone-500 font-light leading-relaxed mb-10 max-w-md mx-auto">
              Read the full expedition details, local secrets, and artisanal stories behind the {name} collection on the LOCRA Journal.
            </p>
            <Button asChild variant="outline" className="rounded-none border-stone-200 text-stone-600 hover:border-gold hover:text-gold uppercase tracking-[0.2em] text-[10px] h-12 px-8">
              <Link href="/journal">Read the Entry</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* 6. TRAVEL CLUB DROPS */}
      <section className="pb-32 bg-[#F9F8F6]">
        <div className="container-wide">
          <div className="bg-stone-900 rounded-2xl p-12 md:p-20 text-white flex flex-col items-center text-center relative">
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')]" />
            <Badge variant="gold" className="mb-6 px-4 py-1">
              Exclusive Access
            </Badge>
            <h2 className="font-serif text-4xl md:text-5xl mb-6">Join the {name} Waitlist</h2>
            <p className="text-stone-400 max-w-lg mb-12 font-light leading-relaxed italic">
              Members of the Travel Club receive first notification when limited edition pieces are released from our collections. 
              Secure your place for the next {name} expedition.
            </p>
            <div className="flex w-full max-w-md gap-2">
              <input 
                type="email" 
                placeholder="Entry your email" 
                className="flex-1 bg-stone-800 border-none text-white px-6 py-4 outline-none focus:ring-1 focus:ring-gold"
              />
              <Button variant="gold" className="px-8">
                Request Entry
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* NEXT DESTINATION FOOTER */}
      <section className="py-24 border-t border-stone-100 flex justify-center">
        <Link 
          href={`/destinations/${DESTINATIONS[(DESTINATIONS.findIndex(d => d.handle === handle) + 1) % DESTINATIONS.length].handle}`}
          className="group text-center"
        >
          <span className="text-[10px] tracking-[0.4em] font-medium text-stone-400 uppercase mb-4 block">
            Next Expedition
          </span>
          <span className="font-serif text-5xl md:text-7xl group-hover:text-gold transition-colors duration-500 italic">
            {DESTINATIONS[(DESTINATIONS.findIndex(d => d.handle === handle) + 1) % DESTINATIONS.length].name}
          </span>
          <ArrowRight className="w-8 h-8 mx-auto mt-8 text-stone-300 group-hover:text-gold group-hover:translate-x-4 transition-all" />
        </Link>
      </section>
    </div>
  );
}
