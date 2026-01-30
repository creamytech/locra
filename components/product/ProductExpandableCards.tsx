"use client";

import React, { useEffect, useId, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useOutsideClick } from "@/hooks/use-outside-click";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatPrice, cn } from "@/lib/utils";
import { ShoppingBag, X, MapPin, ArrowRight, ZoomIn, Check } from "lucide-react";
import type { Product, ProductVariant } from "@/lib/shopify/types";
import { useCart } from "@/components/cart/CartProvider";
import { CurvedBadge } from "@/components/ui/CurvedBadge";

interface ProductExpandableCardsProps {
  products: Product[];
  className?: string;
}

export function ProductExpandableCards({ products, className }: ProductExpandableCardsProps) {
  const [active, setActive] = useState<Product | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [isImageZoomed, setIsImageZoomed] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const id = useId();
  const ref = useRef<HTMLDivElement>(null);
  const { addItem } = useCart();
  const router = useRouter();

  // Handle navigation to product page - restore scroll first
  const handleViewProductPage = (handle: string) => {
    document.body.style.overflow = "auto";
    setActive(null);
    router.push(`/products/${handle}`);
  };

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        if (isImageZoomed) {
          setIsImageZoomed(false);
        } else {
          setActive(null);
        }
      }
    }

    if (active) {
      document.body.style.overflow = "hidden";
      // Set default variant when product opens
      if (active.variants && active.variants.length > 0) {
        setSelectedVariant(active.variants[0]);
      }
    } else {
      document.body.style.overflow = "auto";
      setSelectedVariant(null);
      setIsImageZoomed(false);
      setJustAdded(false);
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [active, isImageZoomed]);

  useOutsideClick(ref, () => {
    if (isImageZoomed) {
      setIsImageZoomed(false);
    } else {
      setActive(null);
    }
  });

  const getPrice = (product: Product) => {
    const amount = parseFloat(product.priceRange.minVariantPrice.amount);
    const currency = product.priceRange.minVariantPrice.currencyCode;
    return formatPrice(amount, currency);
  };

  const getVariantPrice = (variant: ProductVariant) => {
    const amount = parseFloat(variant.price.amount);
    const currency = variant.price.currencyCode;
    return formatPrice(amount, currency);
  };

  const handleAddToCart = async () => {
    if (!active || !selectedVariant) return;
    
    setIsAdding(true);
    try {
      await addItem(selectedVariant.id, 1);
      // Close modal and restore scroll - cart drawer opens automatically via CartProvider
      document.body.style.overflow = "auto";
      setActive(null);
    } catch (error) {
      console.error("Failed to add to cart:", error);
      setIsAdding(false);
    }
  };

  // Extract unique size options from variants
  const getSizeOptions = (product: Product) => {
    const sizes = new Set<string>();
    product.variants?.forEach(v => {
      const sizeOption = v.selectedOptions?.find(opt => 
        opt.name.toLowerCase() === 'size'
      );
      if (sizeOption) sizes.add(sizeOption.value);
    });
    return Array.from(sizes);
  };

  // Extract unique color options from variants  
  const getColorOptions = (product: Product) => {
    const colors = new Set<string>();
    product.variants?.forEach(v => {
      const colorOption = v.selectedOptions?.find(opt => 
        opt.name.toLowerCase() === 'color'
      );
      if (colorOption) colors.add(colorOption.value);
    });
    return Array.from(colors);
  };

  // Find variant by selected options
  const findVariant = (product: Product, size: string, color: string) => {
    return product.variants?.find(v => {
      const variantSize = v.selectedOptions?.find(opt => opt.name.toLowerCase() === 'size')?.value;
      const variantColor = v.selectedOptions?.find(opt => opt.name.toLowerCase() === 'color')?.value;
      return variantSize === size && variantColor === color;
    });
  };

  const selectedSize = selectedVariant?.selectedOptions?.find(opt => opt.name.toLowerCase() === 'size')?.value;
  const selectedColor = selectedVariant?.selectedOptions?.find(opt => opt.name.toLowerCase() === 'color')?.value;

  return (
    <>
      {/* Overlay */}
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-stone-950/70 backdrop-blur-sm h-full w-full z-[100]"
          />
        )}
      </AnimatePresence>

      {/* Image Zoom Modal */}
      <AnimatePresence>
        {isImageZoomed && active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 z-[200] flex items-center justify-center p-4"
            onClick={() => setIsImageZoomed(false)}
          >
            <button
              className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
              onClick={() => setIsImageZoomed(false)}
            >
              <X className="w-6 h-6 text-white" />
            </button>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-4xl aspect-square"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={active.images[0]?.url || "https://images.unsplash.com/photo-1618354691373-d851c5c3a990"}
                alt={active.title}
                fill
                className="object-contain"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Expanded Card Modal - Full Portal Arch Shape */}
      <AnimatePresence>
        {active && (
          <div className="fixed inset-0 grid place-items-center z-[110] p-4 md:p-8">
            {/* Close Button - Positioned at top of arch */}
            <motion.button
              key={`button-${active.id}-${id}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute top-6 right-6 flex items-center justify-center bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full h-11 w-11 transition-colors z-[120] shadow-lg"
              onClick={() => setActive(null)}
            >
              <X className="w-5 h-5 text-white" />
            </motion.button>

            {/* Portal Arch Modal Container - Immediate arch shape */}
            <motion.div
              key={`modal-${active.id}`}
              ref={ref}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="w-full max-w-[420px] max-h-[85vh] bg-white shadow-2xl overflow-hidden flex flex-col"
              style={{
                borderRadius: "50% 50% 20px 20px / 18% 18% 0 0",
              }}
            >
              {/* Portal Arch Image - Compact Top Section */}
              <div 
                className="relative w-full aspect-square cursor-zoom-in group overflow-hidden flex-shrink-0"
                style={{
                  borderRadius: "50% 50% 0 0 / 30% 30% 0 0",
                }}
                onClick={() => setIsImageZoomed(true)}
              >
                <Image
                  src={active.images[0]?.url || "https://images.unsplash.com/photo-1618354691373-d851c5c3a990"}
                  alt={active.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {/* Inner shadow for depth */}
                <div className="absolute inset-0 shadow-[inset_0_2px_40px_rgba(0,0,0,0.1)] pointer-events-none" />
                {/* Zoom indicator */}
                <div className="absolute inset-0 flex items-center justify-center bg-stone-900/0 group-hover:bg-stone-900/20 transition-colors">
                  <span className="flex items-center gap-2 px-4 py-2 bg-white/90 rounded-full text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                    <ZoomIn className="w-4 h-4" />
                    Click to zoom
                  </span>
                </div>
              </div>

              {/* Content Section - Centered */}
              <div className="p-6 flex flex-col flex-1 overflow-y-auto text-center">
                <div className="flex-1">
                  {/* Category Badge */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="flex justify-center"
                  >
                    <Badge variant="outline" className="border-gold/40 text-gold mb-4">
                      <MapPin className="w-3 h-3 mr-1.5" />
                      {active.productType || "Piece"}
                    </Badge>
                  </motion.div>

                  {/* Title */}
                  <motion.h3
                    layoutId={`title-${active.id}-${id}`}
                    className="font-serif text-xl md:text-2xl text-stone-900 mb-2"
                  >
                    {active.title}
                  </motion.h3>

                  {/* Price */}
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.15 }}
                    className="text-xl font-serif text-gold mb-5"
                  >
                    {selectedVariant ? getVariantPrice(selectedVariant) : getPrice(active)}
                  </motion.p>

                  {/* Color Selection */}
                  {getColorOptions(active).length > 0 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.25 }}
                      className="mb-5"
                    >
                      <p className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
                        Color: <span className="text-stone-900">{selectedColor}</span>
                      </p>
                      <div className="flex flex-wrap justify-center gap-2">
                        {getColorOptions(active).map((color) => (
                          <button
                            key={color}
                            onClick={() => {
                              const variant = findVariant(active, selectedSize || '', color);
                              if (variant) setSelectedVariant(variant);
                            }}
                            className={cn(
                              "px-3 py-1.5 text-sm border rounded-lg transition-all",
                              selectedColor === color
                                ? "border-gold bg-gold/10 text-gold font-medium"
                                : "border-stone-200 text-stone-600 hover:border-stone-400"
                            )}
                          >
                            {color}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* Size Selection */}
                  {getSizeOptions(active).length > 0 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className="mb-5"
                    >
                      <p className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
                        Size: <span className="text-stone-900">{selectedSize}</span>
                      </p>
                      <div className="flex flex-wrap justify-center gap-2">
                        {getSizeOptions(active).map((size) => {
                          const variant = findVariant(active, size, selectedColor || '');
                          const isAvailable = variant?.availableForSale !== false;
                          
                          return (
                            <button
                              key={size}
                              onClick={() => {
                                if (variant && isAvailable) setSelectedVariant(variant);
                              }}
                              disabled={!isAvailable}
                              className={cn(
                                "w-10 h-10 text-sm border rounded-lg transition-all font-medium",
                                selectedSize === size
                                  ? "border-gold bg-gold text-white"
                                  : isAvailable
                                    ? "border-stone-200 text-stone-700 hover:border-gold hover:text-gold"
                                    : "border-stone-100 text-stone-300 cursor-not-allowed line-through"
                              )}
                            >
                              {size}
                            </button>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}

                  {/* Stock indicator */}
                  {selectedVariant && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className={cn(
                        "text-sm mb-4",
                        selectedVariant.availableForSale ? "text-green-600" : "text-red-500"
                      )}
                    >
                      {selectedVariant.availableForSale ? "✓ In Stock" : "Out of Stock"}
                    </motion.p>
                  )}
                </div>

                {/* Actions */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 }}
                  className="flex flex-col gap-2 pt-4 border-t border-stone-100"
                >
                  <Button 
                    onClick={handleAddToCart}
                    disabled={!selectedVariant?.availableForSale || isAdding}
                    className={cn(
                      "h-12 text-base font-medium transition-all",
                      justAdded 
                        ? "bg-green-600 hover:bg-green-600" 
                        : "bg-gold hover:bg-gold/90 text-white"
                    )}
                  >
                    {justAdded ? (
                      <span className="flex items-center gap-2">
                        <Check className="w-5 h-5" />
                        Added to Suitcase!
                      </span>
                    ) : isAdding ? (
                      "Adding..."
                    ) : (
                      <span className="flex items-center gap-2">
                        <ShoppingBag className="w-5 h-5" />
                        Add to Suitcase — {selectedVariant ? getVariantPrice(selectedVariant) : getPrice(active)}
                      </span>
                    )}
                  </Button>
                  
                  <Button 
                    variant="outline"
                    onClick={() => handleViewProductPage(active.handle)}
                    className="h-10 border-stone-200 hover:border-gold hover:text-gold flex items-center justify-center gap-2 text-sm"
                  >
                    View Full Product Page
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </motion.div>

                {/* Miles earned info */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-center text-sm text-stone-400 mt-4"
                >
                  Earn <span className="text-gold font-medium">{Math.floor(parseFloat(selectedVariant?.price.amount || active.priceRange.minVariantPrice.amount))} miles</span> with this purchase
                </motion.p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Grid of Cards - Portal Arch Styling like PieceCard */}
      <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-16 ${className || ''}`}>
        {products.map((product) => {
          // Get destination from metafield or tags
          const destination = product.destination?.value || product.tags.find(tag => 
            ['santorini', 'kyoto', 'amalfi', 'marrakech', 'las vegas', 'santa monica'].some(d => 
              tag.toLowerCase().includes(d)
            )
          );
          
          // Get style label from metafield first, then tags, then fallback
          const styleLabel = product.badge?.value || product.tags.find(tag => 
            ['beach vibes', 'casual style', 'artistic tee', 'beach getaway', 'adventure', 'classic', 'vintage'].some(s => 
              tag.toLowerCase().includes(s)
            )
          ) || destination || product.productType || "Piece";

          return (
            <div
              key={product.id}
              onClick={() => setActive(product)}
              className="group cursor-pointer relative">

              {/* Portal Arch Image Container */}
              <div 
                className="relative aspect-[3/4] mb-0 overflow-hidden bg-stone-100"
                style={{ 
                  borderRadius: "50% 50% 16px 16px / 40% 40% 0 0",
                }}
              >
                <Image
                  src={product.images[0]?.url || "https://images.unsplash.com/photo-1618354691373-d851c5c3a990"}
                  alt={product.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                
                {/* Inner shadow for depth */}
                <div className="absolute inset-0 shadow-[inset_0_2px_20px_rgba(0,0,0,0.06)] pointer-events-none" />
                
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-stone-900/0 group-hover:bg-stone-900/20 transition-colors duration-300 flex items-center justify-center">
                  <span className="text-white text-sm font-medium tracking-wide uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-stone-900/80 px-4 py-2 rounded-full">
                    Quick View
                  </span>
                </div>
              </div>

              {/* Curved Style Label - SVG following arch outline on left */}
              <CurvedBadge 
                text={styleLabel} 
                width={280} 
                position="left" 
                color="#a8a29e"
              />

              {/* Product Info Section - White background below */}
              <div className="bg-white rounded-b-2xl pt-5 pb-4 px-3 text-center -mt-3 relative z-10 shadow-sm">
                {/* Product Type */}
                <p className="text-[10px] uppercase tracking-[0.2em] text-stone-400 font-medium mb-2">
                  {product.productType || "Piece"}
                </p>
                
                {/* Product Name */}
                <h3
                  className="font-serif text-sm text-stone-900 group-hover:text-gold transition-colors duration-300 leading-tight mb-3 line-clamp-2"
                >
                  {product.title}
                </h3>
                
                {/* Price with decorative dividers */}
                <div className="flex items-center justify-center gap-3">
                  <span className="flex-1 h-px bg-gradient-to-r from-transparent to-stone-200 max-w-8" />
                  <p className="text-sm font-semibold text-stone-700">
                    {getPrice(product)}
                  </p>
                  <span className="flex-1 h-px bg-gradient-to-l from-transparent to-stone-200 max-w-8" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
