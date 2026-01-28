"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/components/cart/CartProvider";
import type { ProductVariant } from "@/lib/shopify/types";

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
      size="lg"
      className="w-full"
      onClick={handleAdd}
      disabled={disabled || !isAvailable || isLoading || isAdding}
    >
      {isAdding || isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Adding...
        </>
      ) : !isAvailable ? (
        "Sold Out"
      ) : (
        "Reserve Piece"
      )}
    </Button>
  );
}
