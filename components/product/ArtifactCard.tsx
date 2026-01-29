"use client";

import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/lib/shopify/types";
import { cn } from "@/lib/utils";
import { Heart, MapPin } from "lucide-react";
import { useState } from "react";

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
  const [isFavorite, setIsFavorite] = useState(false);

  // Extract destination from tags if not provided
  const productDestination = destination || product.tags.find(tag => 
    ['santorini', 'kyoto', 'amalfi', 'marrakech'].includes(tag.toLowerCase())
  );

  return (
    <article className={cn("group relative", className)}>
      <Link href={`/products/${product.handle}`} className="block">
        {/* Portal Arch Image Container */}
        <div 
          className="relative aspect-[3/4] overflow-hidden bg-gradient-to-b from-stone-100 to-stone-200"
          style={{ 
            borderRadius: "50% 50% 0 0 / 30% 30% 0 0",
          }}
        >
          {/* Inner shadow for depth */}
          <div className="absolute inset-0 z-10 pointer-events-none shadow-[inset_0_0_60px_rgba(0,0,0,0.08)]" />
          
          {product.featuredImage ? (
            <Image
              src={product.featuredImage.url}
              alt={product.featuredImage.altText || product.title}
              fill
              className="object-cover transition-all duration-1000 ease-out group-hover:scale-110 opacity-90 group-hover:opacity-100"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              priority={priority}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-stone-300 italic font-serif">
              Specimen Missing
            </div>
          )}
          
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          
          {/* Top Badges Row */}
          <div className="absolute top-4 left-4 right-4 z-20 flex justify-between items-start">
            {/* Destination Badge */}
            {productDestination && (
              <Badge variant="secondary" className="bg-white/90 backdrop-blur-sm text-stone-700 border-0 shadow-sm">
                <MapPin className="w-3 h-3 mr-1" />
                {productDestination}
              </Badge>
            )}
            
            {/* Edition Badge */}
            {hasEditionTag && !productDestination && (
              <Badge variant="gold" className="shadow-luxury-sm">
                Limited
              </Badge>
            )}
          </div>
          
          {/* Quick View indicator on hover */}
          <div className="absolute bottom-5 left-0 right-0 z-20 flex justify-center opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
            <span className="px-4 py-2 bg-white/95 backdrop-blur-sm text-micro uppercase tracking-[0.2em] text-stone-700 rounded-full">
              View Piece
            </span>
          </div>
        </div>
      </Link>

      {/* Favorite Button - Outside Link for separate click handling */}
      <button
        onClick={(e) => {
          e.preventDefault();
          setIsFavorite(!isFavorite);
        }}
        className="absolute top-4 right-4 z-30 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm hover:scale-110 transition-transform"
        aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
      >
        <Heart 
          className={cn(
            "w-4 h-4 transition-colors",
            isFavorite ? "fill-red-500 text-red-500" : "text-stone-400"
          )} 
        />
      </button>

      {/* Product Details */}
      <div className="space-y-3 text-center px-2 pt-6">
        {/* Product Type */}
        <p className="text-micro uppercase tracking-[0.3em] text-stone-400 font-medium">
          {product.productType || "Piece"}
        </p>
        
        {/* Product Name */}
        <Link href={`/products/${product.handle}`}>
          <h3 className="font-serif text-lg text-stone-900 group-hover:text-gold transition-colors duration-400">
            {product.title}
          </h3>
        </Link>
        
        {/* Price */}
        <p className="text-sm font-medium text-gold">
          {formatPrice(price.amount, price.currencyCode)}
        </p>
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
        className="relative w-16 h-20 overflow-hidden bg-stone-100 flex-shrink-0"
        style={{ borderRadius: "50% 50% 0 0 / 40% 40% 0 0" }}
      >
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
          {product.productType || "Piece"}
        </p>
        <h4 className="text-sm font-serif text-stone-900 group-hover:text-gold transition-colors truncate">
          {product.title}
        </h4>
        <p className="text-xs text-gold font-medium">
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
    <div className="flex gap-5 p-4 bg-white border border-stone-100 rounded-lg">
      <div 
        className="relative w-20 h-24 overflow-hidden bg-stone-50 flex-shrink-0"
        style={{ borderRadius: "50% 50% 0 0 / 30% 30% 0 0" }}
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
          <p className="text-micro uppercase tracking-[0.15em] text-stone-400 font-medium">
            {product.productType || "Piece"}
          </p>
          <h4 className="font-serif text-stone-900 truncate">
            {product.title}
          </h4>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-sm text-gold font-medium">
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
