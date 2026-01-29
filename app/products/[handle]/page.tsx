import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { PortalArchFrame } from "@/components/portal/PortalArch";
import { AddToCartButton } from "@/components/product/AddToCartButton";
import { PieceCard } from "@/components/product/ArtifactCard";
import { ProductMilesBanner } from "@/components/loyalty";
import { getProductByHandle, getCollectionByHandle } from "@/lib/shopify";
import { formatPrice, cleanCopy } from "@/lib/utils";
import { DESTINATIONS } from "@/lib/data/atlas";
import { MapPin, Luggage, History, ArrowRight } from "lucide-react";

interface ProductPageProps {
  params: Promise<{ handle: string }>;
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { handle } = await params;
  const product = await getProductByHandle(handle);

  if (!product) return { title: "Artifact Not Found" };

  return {
    title: `${product.title} | LOCRA Archival`,
    description: product.description.substring(0, 160),
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { handle } = await params;
  const product = await getProductByHandle(handle);

  if (!product) notFound();

  const price = product.priceRange.minVariantPrice;
  const hasEditionTag = product.tags.some((tag) => tag.toLowerCase().includes("edition"));
  const cleanDescription = cleanCopy(product.description);

  // Find destination handle from tags or product type
  const destTag = product.tags.find(tag => DESTINATIONS.some(d => d.handle === tag.toLowerCase()));
  const destination = DESTINATIONS.find(d => d.handle === destTag?.toLowerCase());

  // Fetch related from destination if available
  const destinationCollection = destTag ? await getCollectionByHandle(destTag.toLowerCase(), 4) : null;
  const relatedProducts = destinationCollection?.products.filter(p => p.id !== product.id).slice(0, 3) || [];

  return (
    <div className="flex flex-col bg-white">
      {/* 1. ARCHIVAL HEADER (BREADCRUMB) */}
      <div className="container-wide py-6 border-b border-stone-100 flex justify-between items-center">
        <nav className="flex items-center gap-3 text-[10px] uppercase tracking-[0.2em] font-medium text-stone-400">
          <Link href="/pieces" className="hover:text-stone-900 transition-colors">The Collection</Link>
          <span className="text-stone-200">/</span>
          {destination && (
            <>
              <Link href={`/destinations/${destination.handle}`} className="hover:text-stone-900 transition-colors">{destination.name}</Link>
              <span className="text-stone-200">/</span>
            </>
          )}
          <span className="text-stone-900">{product.title}</span>
        </nav>
      </div>

      {/* 2. MAIN ARTIFACT DISPLAY */}
      <section className="section-spacing">
        <div className="container-wide">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 xl:gap-24">
            
            {/* Left: Gallery (Scale: 7 columns) */}
            <div className="lg:col-span-7 space-y-8">
              <PortalArchFrame glowEnabled className="w-full">
                <div className="relative aspect-[4/5] bg-stone-50">
                  {product.featuredImage ? (
                    <Image
                      src={product.featuredImage.url}
                      alt={product.featuredImage.altText || product.title}
                      fill
                      className="object-cover"
                      priority
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-stone-300 italic font-serif">Image Pending</div>
                  )}
                </div>
              </PortalArchFrame>

              {/* Detail Thumbnails */}
              {product.images.length > 1 && (
                <div className="grid grid-cols-3 gap-4">
                  {product.images.slice(1, 4).map((image) => (
                    <div key={image.id} className="relative aspect-square bg-stone-50 overflow-hidden rounded-sm">
                      <Image
                        src={image.url}
                        alt={image.altText || product.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Curated Details (Scale: 5 columns) */}
            <div className="lg:col-span-5">
              <div className="sticky top-32 space-y-8">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    {destination && (
                      <Badge variant="outline" className="border-stone-200 text-stone-500 font-medium px-3 flex items-center gap-1.5">
                        <MapPin className="w-3 h-3 text-gold" />
                        {destination.name}
                      </Badge>
                    )}
                    {hasEditionTag && <Badge variant="edition">Limited Edition</Badge>}
                  </div>

                  <h1 className="font-serif text-4xl md:text-5xl tracking-tight leading-tight">
                    {product.title}
                  </h1>
                  
                  <div className="flex items-center justify-between">
                    <p className="text-2xl font-light text-stone-900">
                      {formatPrice(price.amount, price.currencyCode)}
                    </p>
                    <span className="text-[10px] uppercase font-mono tracking-tighter text-stone-300">
                      Specimen no. {product.id.split('/').pop()?.slice(-8)}
                    </span>
                  </div>
                </div>

                <div className="prose prose-stone prose-sm">
                  <p className="text-stone-600 leading-relaxed font-light italic">
                    {cleanDescription}
                  </p>
                </div>

                <Separator className="bg-stone-100" />

                {/* ADD TO SUITCASE MODULE */}
                <div className="space-y-4">
                  <AddToCartButton variants={product.variants} />
                  
                  {/* Loyalty Miles Banner */}
                  <ProductMilesBanner
                    price={Math.floor(parseFloat(price.amount) * 100)}
                    destinationName={destination?.name}
                  />
                </div>

                <Separator className="bg-stone-100" />

                {/* ARCHIVAL ACCORDION */}
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="provenance" className="border-stone-100">
                    <AccordionTrigger className="text-[10px] uppercase tracking-[0.2em] font-bold hover:no-underline">
                      Provenance & Story
                    </AccordionTrigger>
                    <AccordionContent className="text-stone-500 font-light leading-relaxed">
                      This artifact was inspired by the specific atmospheric conditions of {destination?.name || "its origin"}. 
                      The materials were chosen to reflect the tactile heritage and timeless elegance of the {destination?.region || "region"}.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="packed" className="border-stone-100">
                    <AccordionTrigger className="text-[10px] uppercase tracking-[0.2em] font-bold hover:no-underline">
                      Packed For
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4 text-stone-500 font-light">
                      <div className="flex gap-4 items-start">
                        <Luggage className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                        <p>Evening strolls through the winding alleys of the old town.</p>
                      </div>
                      <div className="flex gap-4 items-start">
                        <History className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                        <p>Long expeditions into coastal landscapes and ancient ruins.</p>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="care" className="border-stone-100">
                    <AccordionTrigger className="text-[10px] uppercase tracking-[0.2em] font-bold hover:no-underline">
                      Archival Care
                    </AccordionTrigger>
                    <AccordionContent className="text-stone-500 font-light leading-relaxed">
                      Handle as you would any treasured specimen. Hand wash with cool water to preserve the integrity of the natural fibers.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. RELATED ARTIFACTS FROM DESTINATION */}
      {relatedProducts.length > 0 && (
        <section className="section-spacing border-t border-stone-100 bg-[#F9F8F6]">
          <div className="container-wide">
            <div className="text-center mb-16">
              <span className="text-[10px] tracking-[0.4em] font-medium text-stone-400 uppercase mb-4 block">
                The {destination?.name || "Archival"} Capsule
              </span>
              <h2 className="font-serif text-4xl">Complete the Suitcase</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 max-w-5xl mx-auto">
              {relatedProducts.map(p => (
                <PieceCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 4. TRAVEL CLUB CALLOUT */}
      <section className="py-24 bg-white border-t border-stone-100">
        <div className="container-narrow">
          <div className="text-center">
             <Link href="/travel-club" className="group">
               <span className="text-[10px] tracking-[0.4em] font-medium text-stone-400 uppercase mb-4 block">Membership</span>
               <h3 className="font-serif text-3xl italic group-hover:text-gold transition-colors">Join the Locra Travel Club</h3>
               <div className="mt-8 flex justify-center">
                 <div className="w-8 h-8 rounded-full border border-stone-200 flex items-center justify-center group-hover:border-gold transition-colors">
                   <ArrowRight className="w-4 h-4 text-stone-300 group-hover:text-gold group-hover:translate-x-1 transition-all" />
                 </div>
               </div>
             </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
