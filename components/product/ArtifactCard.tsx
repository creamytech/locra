"use client";

import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/lib/shopify/types";
import { cn } from "@/lib/utils";
import { Heart, MapPin } from "lucide-react";
import { useFavorites } from "@/lib/context/FavoritesContext";

interface PieceCardProps {
  product: Product;
  priority?: boolean;
  className?: string;
  destination?: string;
}

export function PieceCard({ product, priority = false, className, destination }: PieceCardProps) {
  const price = product.priceRange.minVariantPrice;
  const hasEditionTag = product.tags.some((tag) =>
    tag.toLowerCase().includes("edition")
  );
  const { isFavorite, toggleFavorite } = useFavorites();

  // Extract destination from tags if not provided
  const productDestination = destination || product.tags.find(tag => 
    ['santorini', 'kyoto', 'amalfi', 'marrakech'].includes(tag.toLowerCase())
  );

  return (
    <article className={cn("group relative", className)}>
      <Link href={`/products/${product.handle}`} className="block">
        {/* Portal Arch Image Container - Full rounded top */}
        <div 
          className="relative aspect-[3/4] overflow-hidden bg-gradient-to-b from-stone-100 to-stone-200"
          style={{ 
            borderRadius: "50% 50% 16px 16px / 35% 35% 0 0",
          }}
        >
          {product.featuredImage ? (
            <Image
              src={product.featuredImage.url}
              alt={product.featuredImage.altText || product.title}
              fill
              className="object-cover transition-all duration-700 ease-out group-hover:scale-105"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              priority={priority}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-stone-300 italic font-serif">
              Specimen Missing
            </div>
          )}
          
          {/* Inner shadow for depth */}
          <div className="absolute inset-0 shadow-[inset_0_2px_20px_rgba(0,0,0,0.08)] pointer-events-none" />
          
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>
      </Link>

      {/* Curved Destination Badge - Positioned at arch edge */}
      {productDestination && (
        <div className="absolute top-[15%] left-3 z-20">
          <Badge 
            variant="secondary" 
            className="bg-white/95 backdrop-blur-sm text-stone-700 border-0 shadow-sm text-[10px] uppercase tracking-wider px-3 py-1.5 rounded-full"
          >
            <MapPin className="w-2.5 h-2.5 mr-1.5" />
            {productDestination}
          </Badge>
        </div>
      )}
      
      {/* Edition Badge */}
      {hasEditionTag && !productDestination && (
        <div className="absolute top-[15%] left-3 z-20">
          <Badge variant="gold" className="shadow-sm text-[10px]">
            Limited
          </Badge>
        </div>
      )}

      {/* Favorite Button - White circle on right */}
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          toggleFavorite(product.handle);
        }}
        className="absolute top-[15%] right-3 z-30 w-9 h-9 rounded-full bg-white/95 backdrop-blur-sm flex items-center justify-center shadow-sm hover:scale-110 transition-transform"
        aria-label={isFavorite(product.handle) ? "Remove from favorites" : "Add to favorites"}
      >
        <Heart 
          className={cn(
            "w-4 h-4 transition-colors",
            isFavorite(product.handle) ? "fill-red-500 text-red-500" : "text-stone-400"
          )} 
        />
      </button>

      {/* Product Info Section - White background below image */}
      <div className="bg-white rounded-b-xl pt-5 pb-4 px-4 text-center -mt-4 relative z-10">
        {/* Product Type */}
        <p className="text-[10px] uppercase tracking-[0.2em] text-stone-400 font-medium mb-2">
          {product.productType || "Piece"}
        </p>
        
        {/* Product Name */}
        <Link href={`/products/${product.handle}`}>
          <h3 className="font-serif text-base text-stone-900 group-hover:text-gold transition-colors duration-300 leading-tight mb-4">
            {product.title}
          </h3>
        </Link>
        
        {/* Price with decorative dividers */}
        <div className="flex items-center justify-center gap-3">
          <span className="flex-1 h-px bg-gradient-to-r from-transparent to-stone-200" />
          <p className="text-sm font-semibold text-stone-700">
            {formatPrice(price.amount, price.currencyCode)}
          </p>
          <span className="flex-1 h-px bg-gradient-to-l from-transparent to-stone-200" />
        </div>
      </div>
    </article>
  );
}

/**
 * Mini variant for featured section / sidebars
 */
export function PieceCardMini({ product }: { product: Product }) {
  const price = product.priceRange.minVariantPrice;

  return (
    <Link href={`/products/${product.handle}`} className="group flex items-center gap-5 p-3 -m-3 rounded-lg hover:bg-stone-50 transition-colors duration-300">
      <div 
        className="relative w-14 h-[72px] overflow-hidden bg-stone-100 flex-shrink-0"
        style={{ borderRadius: "50% 50% 8px 8px / 40% 40% 0 0" }}
      >
        {product.featuredImage ? (
          <Image
            src={product.featuredImage.url}
            alt={product.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="56px"
          />
        ) : (
          <div className="w-full h-full bg-stone-100" />
        )}
      </div>
      <div className="space-y-1 min-w-0">
        <p className="text-[9px] uppercase tracking-[0.15em] text-stone-400 font-medium truncate">
          {product.productType || "Piece"}
        </p>
        <h4 className="text-sm font-serif text-stone-900 group-hover:text-gold transition-colors truncate">
          {product.title}
        </h4>
        <p className="text-xs font-semibold text-stone-600">
          {formatPrice(price.amount, price.currencyCode)}
        </p>
      </div>
    </Link>
  );
}

/**
 * Horizontal card for cart/checkout contexts
 */
export function PieceCardHorizontal({ 
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
    <div className="flex gap-5 p-4 bg-white border border-stone-100 rounded-xl">
      <div 
        className="relative w-20 h-24 overflow-hidden bg-stone-50 flex-shrink-0"
        style={{ borderRadius: "50% 50% 8px 8px / 30% 30% 0 0" }}
      >
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
          <p className="text-[9px] uppercase tracking-[0.15em] text-stone-400 font-medium">
            {product.productType || "Piece"}
          </p>
          <h4 className="font-serif text-stone-900 truncate">
            {product.title}
          </h4>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-stone-700">
            {formatPrice(price.amount, price.currencyCode)}
            {quantity && quantity > 1 && <span className="text-stone-400 font-normal ml-2">× {quantity}</span>}
          </p>
          {onRemove && (
            <button 
              onClick={onRemove}
              className="text-[10px] text-stone-400 hover:text-stone-600 uppercase tracking-wider"
            >
              Remove
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
