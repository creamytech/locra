"use client";

import React, { useEffect, useId, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useOutsideClick } from "@/hooks/use-outside-click";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatPrice, cn } from "@/lib/utils";
import { ShoppingBag, X, MapPin, ArrowRight, ZoomIn, Check } from "lucide-react";
import type { Product, ProductVariant } from "@/lib/shopify/types";
import { useCart } from "@/components/cart/CartProvider";

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
      setJustAdded(true);
      setTimeout(() => {
        setJustAdded(false);
      }, 2000);
    } catch (error) {
      console.error("Failed to add to cart:", error);
    } finally {
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

      {/* Expanded Card Modal */}
      <AnimatePresence>
        {active && (
          <div className="fixed inset-0 grid place-items-center z-[110] p-4 overflow-y-auto">
            {/* Close Button */}
            <motion.button
              key={`button-${active.id}-${id}`}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute top-4 right-4 flex items-center justify-center bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full h-10 w-10 transition-colors z-[120]"
              onClick={() => setActive(null)}
            >
              <X className="w-5 h-5 text-white" />
            </motion.button>

            <motion.div
              layoutId={`card-${active.id}-${id}`}
              ref={ref}
              className="w-full max-w-[1000px] max-h-[90vh] flex flex-col md:flex-row bg-white rounded-2xl overflow-hidden shadow-2xl my-8"
            >
              {/* Image - Clickable for Zoom */}
              <motion.div 
                layoutId={`image-${active.id}-${id}`}
                className="relative w-full md:w-1/2 h-80 md:h-auto min-h-[450px] cursor-zoom-in group"
                onClick={() => setIsImageZoomed(true)}
              >
                <Image
                  src={active.images[0]?.url || "https://images.unsplash.com/photo-1618354691373-d851c5c3a990"}
                  alt={active.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {/* Zoom indicator */}
                <div className="absolute inset-0 flex items-center justify-center bg-stone-900/0 group-hover:bg-stone-900/20 transition-colors">
                  <span className="flex items-center gap-2 px-4 py-2 bg-white/90 rounded-full text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    <ZoomIn className="w-4 h-4" />
                    Click to zoom
                  </span>
                </div>
              </motion.div>

              {/* Content */}
              <div className="flex-1 p-8 md:p-10 flex flex-col overflow-y-auto max-h-[90vh] md:max-h-none">
                <div className="flex-1">
                  {/* Category Badge */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <Badge variant="outline" className="border-gold/40 text-gold mb-4">
                      <MapPin className="w-3 h-3 mr-1.5" />
                      {active.productType || "Artifact"}
                    </Badge>
                  </motion.div>

                  {/* Title */}
                  <motion.h3
                    layoutId={`title-${active.id}-${id}`}
                    className="font-serif text-2xl md:text-3xl text-stone-900 mb-3"
                  >
                    {active.title}
                  </motion.h3>

                  {/* Price */}
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.15 }}
                    className="text-2xl font-serif text-gold mb-6"
                  >
                    {selectedVariant ? getVariantPrice(selectedVariant) : getPrice(active)}
                  </motion.p>

                  {/* Description - Truncated */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="mb-6"
                  >
                    <p className="text-stone-600 leading-relaxed text-sm line-clamp-3">
                      {active.description || "A carefully curated artifact from our global collection."}
                    </p>
                    <Link 
                      href={`/products/${active.handle}`}
                      className="text-gold text-sm font-medium hover:underline mt-2 inline-block"
                    >
                      Read full description →
                    </Link>
                  </motion.div>

                  {/* Color Selection */}
                  {getColorOptions(active).length > 0 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.25 }}
                      className="mb-6"
                    >
                      <p className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-3">
                        Color: <span className="text-stone-900">{selectedColor}</span>
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {getColorOptions(active).map((color) => (
                          <button
                            key={color}
                            onClick={() => {
                              const variant = findVariant(active, selectedSize || '', color);
                              if (variant) setSelectedVariant(variant);
                            }}
                            className={cn(
                              "px-4 py-2 text-sm border rounded-lg transition-all",
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
                      className="mb-6"
                    >
                      <p className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-3">
                        Size: <span className="text-stone-900">{selectedSize}</span>
                      </p>
                      <div className="flex flex-wrap gap-2">
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
                                "w-12 h-12 text-sm border rounded-lg transition-all font-medium",
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
                  className="flex flex-col gap-3 pt-4 border-t border-stone-100"
                >
                  <Button 
                    onClick={handleAddToCart}
                    disabled={!selectedVariant?.availableForSale || isAdding}
                    className={cn(
                      "h-14 text-base font-medium transition-all",
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
                    asChild
                    className="h-12 border-stone-200 hover:border-gold hover:text-gold"
                  >
                    <Link href={`/products/${active.handle}`} className="flex items-center justify-center gap-2">
                      View Full Product Page
                      <ArrowRight className="w-4 h-4" />
                    </Link>
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

      {/* Grid of Cards */}
      <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-20 ${className || ''}`}>
        {products.map((product) => (
          <motion.div
            layoutId={`card-${product.id}-${id}`}
            key={product.id}
            onClick={() => setActive(product)}
            className="group cursor-pointer"
          >
            {/* Image Container */}
            <motion.div 
              layoutId={`image-${product.id}-${id}`}
              className="relative aspect-[3/4] mb-6 overflow-hidden bg-stone-100"
            >
              <Image
                src={product.images[0]?.url || "https://images.unsplash.com/photo-1618354691373-d851c5c3a990"}
                alt={product.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-stone-900/0 group-hover:bg-stone-900/20 transition-colors duration-300 flex items-center justify-center">
                <span className="text-white text-sm font-medium tracking-wide uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-stone-900/80 px-4 py-2 rounded-full">
                  Quick View
                </span>
              </div>
            </motion.div>

            {/* Text Content */}
            <div className="space-y-2">
              <p className="text-[10px] tracking-[0.2em] uppercase text-gold font-medium">
                {product.productType || "Artifact"}
              </p>
              <motion.h3
                layoutId={`title-${product.id}-${id}`}
                className="font-serif text-xl text-stone-900 group-hover:text-gold transition-colors duration-300"
              >
                {product.title}
              </motion.h3>
              <p className="font-serif text-lg text-stone-600">
                {getPrice(product)}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </>
  );
}
