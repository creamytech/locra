"use client";

import { useState } from "react";
import { Loader2, Luggage } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/components/cart/CartProvider";
import type { ProductVariant } from "@/lib/shopify/types";
import { cn } from "@/lib/utils";

interface AddToCartButtonProps {
  variants: ProductVariant[];
  selectedVariantId?: string;
  disabled?: boolean;
}

export function AddToCartButton({
  variants,
  selectedVariantId,
  disabled,
}: AddToCartButtonProps) {
  const { addItem, isLoading } = useCart();
  const [isAdding, setIsAdding] = useState(false);

  // Use selected variant or first available
  const variant =
    variants.find((v) => v.id === selectedVariantId) ||
    variants.find((v) => v.availableForSale) ||
    variants[0];

  const isAvailable = variant?.availableForSale;

  const handleAdd = async () => {
    if (!variant || !isAvailable) return;

    setIsAdding(true);
    try {
      await addItem(variant.id);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <Button
      size="xl"
      className={cn(
        "w-full rounded-none h-14 uppercase tracking-[0.2em] text-[10px] font-bold transition-all duration-500",
        isAvailable 
          ? "bg-stone-900 text-white hover:bg-gold" 
          : "bg-stone-100 text-stone-400 border-stone-200"
      )}
      onClick={handleAdd}
      disabled={disabled || !isAvailable || isLoading || isAdding}
    >
      {isAdding || isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Packing...
        </>
      ) : !isAvailable ? (
        "Out of Collection"
      ) : (
        <span className="flex items-center gap-3">
          <Luggage className="w-4 h-4" />
          Add to Suitcase
        </span>
      )}
    </Button>
  );
}
