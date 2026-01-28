import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { PortalArchFrame } from "@/components/portal/PortalArch";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/lib/shopify/types";
import { cn } from "@/lib/utils";

interface ArtifactCardProps {
  product: Product;
  priority?: boolean;
  className?: string;
}

export function ArtifactCard({ product, priority = false, className }: ArtifactCardProps) {
  const price = product.priceRange.minVariantPrice;
  const hasEditionTag = product.tags.some((tag) =>
    tag.toLowerCase().includes("edition")
  );

  return (
    <Link
      href={`/products/${product.handle}`}
      className={cn("group block", className)}
    >
      <article className="space-y-6">
        {/* Archival Specimen Display */}
        <div className="relative aspect-[3/4] overflow-hidden bg-stone-50 group-hover:bg-white transition-colors duration-500">
          {/* Subtle Arch Mask in Hover */}
          <div className="absolute inset-0 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none border-[12px] border-white" style={{ borderRadius: "50% 50% 0 0 / 20% 20% 0 0" }} />
          
          {product.featuredImage ? (
            <Image
              src={product.featuredImage.url}
              alt={product.featuredImage.altText || product.title}
              fill
              className="object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-110"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              priority={priority}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-stone-300 italic font-serif">
              Specimen Missing
            </div>
          )}
          
          {/* Artifact Tag (Overlay) */}
          <div className="absolute bottom-4 left-4 z-20 transition-transform duration-500 group-hover:-translate-y-2">
            {hasEditionTag && (
              <Badge variant="gold">
                Limited
              </Badge>
            )}
          </div>
        </div>

        {/* Archival Labeling */}
        <div className="space-y-2 text-center">
           <p className="text-[9px] uppercase tracking-[0.3em] text-stone-400 font-bold">
             {product.productType || "Artifact"}
           </p>
           <h3 className="font-serif text-xl text-stone-900 group-hover:text-gold transition-colors duration-500 italic">
             {product.title}
           </h3>
           <div className="flex items-center justify-center gap-4 pt-1">
             <span className="w-4 h-px bg-stone-100" />
             <p className="text-sm font-light text-stone-500">
               {formatPrice(price.amount, price.currencyCode)}
             </p>
             <span className="w-4 h-px bg-stone-100" />
           </div>
        </div>
      </article>
    </Link>
  );
}

/**
 * Mini variant for featured section / sidebars
 */
export function ArtifactCardMini({ product }: { product: Product }) {
  const price = product.priceRange.minVariantPrice;

  return (
    <Link href={`/products/${product.handle}`} className="group flex items-center gap-4">
      <div className="relative w-16 h-20 overflow-hidden bg-stone-50 flex-shrink-0" style={{ borderRadius: "20px 20px 0 0" }}>
        {product.featuredImage ? (
          <Image
            src={product.featuredImage.url}
            alt={product.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            sizes="64px"
          />
        ) : (
          <div className="w-full h-full bg-stone-100" />
        )}
      </div>
      <div className="space-y-0.5">
        <h4 className="text-xs font-serif italic text-stone-900 group-hover:text-gold transition-colors">
          {product.title}
        </h4>
        <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest">
          {formatPrice(price.amount, price.currencyCode)}
        </p>
      </div>
    </Link>
  );
}
