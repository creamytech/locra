import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
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
        {/* Premium Product Image Container */}
        <div className="relative aspect-[3/4] overflow-hidden bg-gradient-to-b from-stone-50 to-stone-100">
          {/* Inner shadow for depth */}
          <div className="absolute inset-0 z-10 pointer-events-none shadow-[inset_0_0_60px_rgba(0,0,0,0.03)]" />
          
          {/* Hover reveal border */}
          <div className="absolute inset-4 z-10 border border-gold/0 group-hover:border-gold/20 transition-all duration-700 pointer-events-none" />
          
          {product.featuredImage ? (
            <Image
              src={product.featuredImage.url}
              alt={product.featuredImage.altText || product.title}
              fill
              className="object-cover transition-all duration-1000 ease-out group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              priority={priority}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-stone-300 italic font-serif">
              Specimen Missing
            </div>
          )}
          
          {/* Gradient overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-stone-900/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          {/* Edition Badge */}
          {hasEditionTag && (
            <div className="absolute top-5 left-5 z-20">
              <Badge variant="gold" className="shadow-luxury-sm">
                Limited
              </Badge>
            </div>
          )}
          
          {/* Quick View indicator on hover */}
          <div className="absolute bottom-5 left-0 right-0 z-20 flex justify-center opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
            <span className="px-4 py-2 bg-white/95 backdrop-blur-sm text-micro uppercase tracking-[0.2em] text-stone-700">
              View Artifact
            </span>
          </div>
        </div>

        {/* Product Details */}
        <div className="space-y-3 text-center px-2">
          {/* Product Type */}
          <p className="text-micro uppercase tracking-[0.3em] text-stone-400 font-medium">
            {product.productType || "Artifact"}
          </p>
          
          {/* Product Name */}
          <h3 className="font-serif text-title text-stone-900 group-hover:text-gold transition-colors duration-400">
            {product.title}
          </h3>
          
          {/* Price */}
          <div className="flex items-center justify-center gap-4 pt-1">
            <span className="w-8 h-px bg-gradient-to-r from-transparent to-stone-200" />
            <p className="text-body font-light text-stone-600">
              {formatPrice(price.amount, price.currencyCode)}
            </p>
            <span className="w-8 h-px bg-gradient-to-l from-transparent to-stone-200" />
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
    <Link href={`/products/${product.handle}`} className="group flex items-center gap-5 p-3 -m-3 rounded-lg hover:bg-stone-50 transition-colors duration-300">
      <div className="relative w-16 h-20 overflow-hidden bg-stone-100 flex-shrink-0">
        {product.featuredImage ? (
          <Image
            src={product.featuredImage.url}
            alt={product.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="64px"
          />
        ) : (
          <div className="w-full h-full bg-stone-100" />
        )}
      </div>
      <div className="space-y-1 min-w-0">
        <p className="text-micro uppercase tracking-[0.15em] text-stone-400 font-medium truncate">
          {product.productType || "Artifact"}
        </p>
        <h4 className="text-sm font-serif text-stone-900 group-hover:text-gold transition-colors truncate">
          {product.title}
        </h4>
        <p className="text-xs text-stone-500">
          {formatPrice(price.amount, price.currencyCode)}
        </p>
      </div>
    </Link>
  );
}

/**
 * Horizontal card for cart/checkout contexts
 */
export function ArtifactCardHorizontal({ 
  product,
  quantity,
  onRemove,
}: { 
  product: Product;
  quantity?: number;
  onRemove?: () => void;
}) {
  const price = product.priceRange.minVariantPrice;

  return (
    <div className="flex gap-5 p-4 bg-white border border-stone-100 rounded-sm">
      <div className="relative w-20 h-24 overflow-hidden bg-stone-50 flex-shrink-0">
        {product.featuredImage && (
          <Image
            src={product.featuredImage.url}
            alt={product.title}
            fill
            className="object-cover"
            sizes="80px"
          />
        )}
      </div>
      <div className="flex-1 flex flex-col justify-between min-w-0">
        <div>
          <p className="text-micro uppercase tracking-[0.15em] text-stone-400 font-medium">
            {product.productType || "Artifact"}
          </p>
          <h4 className="font-serif text-stone-900 truncate">
            {product.title}
          </h4>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-sm text-stone-600">
            {formatPrice(price.amount, price.currencyCode)}
            {quantity && quantity > 1 && <span className="text-stone-400 ml-2">× {quantity}</span>}
          </p>
          {onRemove && (
            <button 
              onClick={onRemove}
              className="text-micro text-stone-400 hover:text-stone-600 uppercase tracking-wider"
            >
              Remove
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
