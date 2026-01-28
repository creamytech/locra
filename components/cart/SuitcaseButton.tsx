"use client";

import { Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "./CartProvider";
import { CartDrawer } from "./CartDrawer";

export function SuitcaseButton() {
  const { cart, isOpen, setIsOpen } = useCart();
  const itemCount = cart?.totalQuantity || 0;

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="relative"
        onClick={() => setIsOpen(true)}
        aria-label={`Open suitcase. ${itemCount} items in cart.`}
      >
        <Briefcase className="h-5 w-5" />
        {itemCount > 0 && (
          <span
            className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground"
            aria-hidden="true"
          >
            {itemCount > 99 ? "99+" : itemCount}
          </span>
        )}
      </Button>

      <CartDrawer open={isOpen} onOpenChange={setIsOpen} />
    </>
  );
}
