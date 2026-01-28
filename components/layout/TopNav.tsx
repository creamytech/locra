"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PortalMenu } from "@/components/portal/PortalMenu";
import { SuitcaseButton } from "@/components/cart/SuitcaseButton";

export function TopNav() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
      <nav
        className="container-wide flex h-16 items-center justify-between"
        aria-label="Main navigation"
      >
        {/* Left: Mobile Menu Button (hidden on desktop) */}
        <div className="flex items-center gap-4 lg:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
            className="lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>

        {/* Left: LOCRA Wordmark */}
        <Link
          href="/"
          className="flex items-center gap-2 font-serif text-2xl tracking-widest text-foreground transition-opacity hover:opacity-70"
          aria-label="LOCRA Home"
        >
          LOCRA
        </Link>

        {/* Center: Portal Button */}
        <div className="hidden lg:flex lg:items-center lg:justify-center lg:flex-1">
          <PortalMenu />
        </div>

        {/* Right: Suitcase Icon */}
        <div className="flex items-center gap-4">
          <div className="lg:hidden">
            <PortalMenu />
          </div>
          <SuitcaseButton />
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-border/40 bg-background/95 backdrop-blur-md">
          <div className="container-wide py-4 space-y-2">
            <Link
              href="/destinations/santorini"
              className="block py-2 text-sm font-medium transition-colors hover:text-primary"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Santorini
            </Link>
            <Link
              href="/destinations/amalfi"
              className="block py-2 text-sm font-medium transition-colors hover:text-primary"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Amalfi
            </Link>
            <Link
              href="/destinations/kyoto"
              className="block py-2 text-sm font-medium transition-colors hover:text-primary"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Kyoto
            </Link>
            <div className="h-px bg-border my-2" />
            <Link
              href="/travel-club"
              className="block py-2 text-sm font-medium transition-colors hover:text-primary"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Travel Club
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
