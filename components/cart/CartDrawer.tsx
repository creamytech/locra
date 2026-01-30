"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, Loader2, Luggage, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetClose,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { useCart } from "./CartProvider";
import { CartLoyaltyBanner } from "./CartLoyaltyBanner";
import { formatPrice } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface CartDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CartDrawer({ open, onOpenChange }: CartDrawerProps) {
  const { cart, isLoading, updateItem, removeItem, checkout } = useCart();

  const isEmpty = !cart || cart.lines.length === 0;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent hideDefaultClose className="flex flex-col w-full sm:max-w-md bg-[#F9F8F6] border-l border-stone-200 p-0 overflow-hidden">
        {/* Custom Header */}
        <div className="p-8 pb-4 flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="font-serif text-3xl italic text-stone-900">Your Suitcase</h2>
            <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-stone-400">
              {isEmpty ? "Journey Pending" : "Manifest for Departure"}
            </p>
          </div>
          <SheetClose asChild>
            <Button variant="ghost" size="icon" className="hover:bg-stone-100 rounded-full">
              <X className="w-5 h-5 text-stone-400" />
            </Button>
          </SheetClose>
        </div>

        <Separator className="bg-stone-100 mx-8 w-auto" />

        {/* Contents */}
        <div className="flex-1 overflow-y-auto px-8 py-8 custom-scrollbar">
          {isEmpty ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-8">
              <div className="relative">
                <Luggage className="w-16 h-16 text-stone-200" strokeWidth={1} />
                <div className="absolute inset-0 animate-ping opacity-20">
                  <Luggage className="w-16 h-16 text-gold" strokeWidth={1} />
                </div>
              </div>
              <div className="space-y-4">
                <p className="font-serif text-xl italic text-stone-400">
                  Your suitcase is empty.
                </p>
                <p className="text-xs text-stone-400 max-w-[200px] leading-relaxed">
                  Explore the collection and discover your first piece.
                </p>
              </div>
              <Button asChild onClick={() => onOpenChange(false)} className="rounded-none bg-stone-900 text-white hover:bg-gold px-8">
                <Link href="/">Explore Destinations</Link>
              </Button>
            </div>
          ) : (
            <ul className="space-y-8">
              {cart.lines.map((line) => (
                <li key={line.id} className="group flex gap-6 animate-fade-in">
                  {/* Image with Portal Arch Style - matching product page */}
                  <Link
                    href={`/products/${line.merchandise.product.handle}`}
                    className="relative h-28 w-20 flex-shrink-0 overflow-hidden bg-stone-50"
                    style={{ borderRadius: "50% 50% 8px 8px / 35% 35% 0 0" }}
                    onClick={() => onOpenChange(false)}
                  >
                    {line.merchandise.product.featuredImage ? (
                      <Image
                        src={line.merchandise.product.featuredImage.url}
                        alt={line.merchandise.product.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                        sizes="80px"
                      />
                    ) : (
                      <div className="w-full h-full bg-stone-100" />
                    )}
                  </Link>

                  {/* Details */}
                  <div className="flex flex-1 flex-col justify-between py-1">
                    <div className="space-y-1">
                      <Link
                        href={`/products/${line.merchandise.product.handle}`}
                        className="font-serif text-base text-stone-900 hover:text-gold transition-colors"
                        onClick={() => onOpenChange(false)}
                      >
                        {line.merchandise.product.title}
                      </Link>
                      {line.merchandise.title !== "Default Title" && (
                        <p className="text-[10px] uppercase tracking-widest text-stone-400">
                          {line.merchandise.title}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-4">
                      {/* Premium Quantity Controls */}
                      <div className="flex items-center border border-stone-200 bg-white">
                        <button
                          className="p-2 hover:bg-stone-50 disabled:opacity-30"
                          onClick={() => line.quantity === 1 ? removeItem(line.id) : updateItem(line.id, line.quantity - 1)}
                          disabled={isLoading}
                        >
                          {line.quantity === 1 ? <Trash2 className="w-3 h-3 text-stone-400" /> : <Minus className="w-3 h-3 text-stone-400" />}
                        </button>
                        <span className="w-8 text-center text-[10px] font-bold text-stone-900">{line.quantity}</span>
                        <button
                          className="p-2 hover:bg-stone-50 disabled:opacity-30"
                          onClick={() => updateItem(line.id, line.quantity + 1)}
                          disabled={isLoading}
                        >
                          <Plus className="w-3 h-3 text-stone-400" />
                        </button>
                      </div>

                      <p className="text-sm font-light text-stone-900">
                        {formatPrice(line.cost.totalAmount.amount, line.cost.totalAmount.currencyCode)}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {!isEmpty && (
          <div className="p-8 bg-white border-t border-stone-200 space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-[0.2em] font-medium text-stone-400">Subtotal</span>
                <span className="text-xl font-light text-stone-900">
                  {formatPrice(cart.cost.subtotalAmount.amount, cart.cost.subtotalAmount.currencyCode)}
                </span>
              </div>
              <p className="text-[9px] text-stone-400 italic">
                Customs, duties, and logistics calculated at departure.
              </p>
            </div>

            {/* Loyalty Banner */}
            <CartLoyaltyBanner
              cartTotal={Math.floor(parseFloat(cart.cost.subtotalAmount.amount) * 100)}
              isLoggedIn={false} // TODO: Connect to auth state
            />
            
            <Button
              className="w-full h-14 rounded-none bg-stone-900 text-white hover:bg-gold uppercase tracking-[0.2em] text-[10px] font-bold transition-all duration-500 shadow-xl"
              onClick={checkout}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <span className="flex items-center gap-3">
                  Proceed to Departure
                  <X className="w-4 h-4 rotate-45" />
                </span>
              )}
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
