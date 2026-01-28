"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { useCart } from "./CartProvider";
import { formatPrice } from "@/lib/utils";

interface CartDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CartDrawer({ open, onOpenChange }: CartDrawerProps) {
  const { cart, isLoading, updateItem, removeItem, checkout } = useCart();

  const isEmpty = !cart || cart.lines.length === 0;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex flex-col w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="font-serif text-xl tracking-wide">
            Your Suitcase
          </SheetTitle>
          <SheetDescription>
            {isEmpty
              ? "Your journey awaits"
              : `${cart.totalQuantity} ${cart.totalQuantity === 1 ? "artifact" : "artifacts"} ready for departure`}
          </SheetDescription>
        </SheetHeader>

        <Separator className="my-4" />

        {/* Cart Contents */}
        <div className="flex-1 overflow-y-auto">
          {isEmpty ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <div className="w-24 h-24 rounded-full bg-muted/50 flex items-center justify-center mb-6">
                <svg
                  className="w-10 h-10 text-muted-foreground"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                  />
                </svg>
              </div>
              <p className="text-muted-foreground mb-2">
                Your suitcase is empty.
              </p>
              <p className="text-sm text-muted-foreground mb-6">
                Enter a destination to begin your journey.
              </p>
              <Button asChild onClick={() => onOpenChange(false)}>
                <Link href="/">Explore Destinations</Link>
              </Button>
            </div>
          ) : (
            <ul className="space-y-4">
              {cart.lines.map((line) => (
                <li key={line.id} className="flex gap-4">
                  {/* Product Image */}
                  <Link
                    href={`/products/${line.merchandise.product.handle}`}
                    className="relative h-24 w-20 flex-shrink-0 overflow-hidden rounded-md bg-muted"
                    onClick={() => onOpenChange(false)}
                  >
                    {line.merchandise.product.featuredImage ? (
                      <Image
                        src={line.merchandise.product.featuredImage.url}
                        alt={
                          line.merchandise.product.featuredImage.altText ||
                          line.merchandise.product.title
                        }
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    ) : (
                      <div className="w-full h-full bg-stone-200" />
                    )}
                  </Link>

                  {/* Product Details */}
                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <Link
                        href={`/products/${line.merchandise.product.handle}`}
                        className="font-medium text-sm hover:text-primary transition-colors"
                        onClick={() => onOpenChange(false)}
                      >
                        {line.merchandise.product.title}
                      </Link>
                      {line.merchandise.title !== "Default Title" && (
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {line.merchandise.title}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() =>
                            line.quantity === 1
                              ? removeItem(line.id)
                              : updateItem(line.id, line.quantity - 1)
                          }
                          disabled={isLoading}
                          aria-label="Decrease quantity"
                        >
                          {line.quantity === 1 ? (
                            <Trash2 className="h-3 w-3" />
                          ) : (
                            <Minus className="h-3 w-3" />
                          )}
                        </Button>
                        <span className="w-8 text-center text-sm font-medium">
                          {line.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => updateItem(line.id, line.quantity + 1)}
                          disabled={isLoading}
                          aria-label="Increase quantity"
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>

                      {/* Line Total */}
                      <p className="text-sm font-medium">
                        {formatPrice(
                          line.cost.totalAmount.amount,
                          line.cost.totalAmount.currencyCode
                        )}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer with Total and Checkout */}
        {!isEmpty && (
          <div className="border-t pt-4 mt-4 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Subtotal</span>
              <span className="font-medium">
                {formatPrice(
                  cart.cost.subtotalAmount.amount,
                  cart.cost.subtotalAmount.currencyCode
                )}
              </span>
            </div>
            <p className="text-xs text-muted-foreground text-center">
              Shipping and taxes calculated at checkout
            </p>
            <Button
              className="w-full"
              size="lg"
              onClick={checkout}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading...
                </>
              ) : (
                "Proceed to Departure"
              )}
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
