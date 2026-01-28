"use client";

import { Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "./CartProvider";
import { CartDrawer } from "./CartDrawer";
import { cn } from "@/lib/utils";

interface SuitcaseButtonProps {
  variant?: "white" | "dark";
  className?: string;
}

export function SuitcaseButton({ variant = "dark", className }: SuitcaseButtonProps) {
  const { cart, isOpen, setIsOpen } = useCart();
  const itemCount = cart?.totalQuantity || 0;

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        className={cn(
          "relative group px-2 flex items-center gap-2 transition-all",
          variant === "white" 
            ? "text-white hover:bg-white/10" 
            : "text-stone-700 hover:bg-stone-100",
          className
        )}
        onClick={() => setIsOpen(true)}
        aria-label={`Open suitcase. ${itemCount} items.`}
      >
        <Briefcase className="h-4 w-4" />
        <span className="hidden sm:inline text-[10px] uppercase font-medium tracking-[0.2em]">
          Suitcase
        </span>
        {itemCount > 0 && (
          <span
            className={cn(
              "flex h-4 w-4 items-center justify-center rounded-full text-[9px] font-bold shadow-sm transition-transform group-hover:scale-110",
              variant === "white"
                ? "bg-white text-stone-900"
                : "bg-stone-900 text-white"
            )}
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
