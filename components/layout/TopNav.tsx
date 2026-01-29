"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MegaMenu } from "@/components/layout/MegaMenu";
import { SuitcaseButton } from "@/components/cart/SuitcaseButton";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { AnimatePresence } from "framer-motion";

export function TopNav() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menus on path change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsMegaMenuOpen(false);
  }, [pathname]);

  const navLinks = [
    { name: "Artifacts", href: "/artifacts" },
    { name: "Travel Club", href: "/travel-club" },
    { name: "Journal", href: "/journal" },
  ];

  return (
    <header 
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-500",
        isScrolled || isMegaMenuOpen
          ? "border-b border-stone-200 bg-white"
          : "bg-transparent border-transparent"
      )}
    >
      <nav
        className="container-wide flex h-20 items-center justify-between"
        aria-label="Main navigation"
      >
        {/* Left: Branding */}
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="flex items-center gap-2 font-serif text-2xl tracking-[0.2em] text-foreground transition-opacity hover:opacity-70"
            aria-label="LOCRA Home"
          >
            LOCRA
          </Link>

          {/* Desktop Primary Nav Highlights */}
          <div className="hidden lg:flex items-center gap-8">
            <button
              onClick={() => setIsMegaMenuOpen(!isMegaMenuOpen)}
              onMouseEnter={() => setIsMegaMenuOpen(true)}
              className={cn(
                "group flex items-center gap-1.5 text-[10px] font-medium tracking-[0.2em] uppercase transition-colors outline-none",
                isMegaMenuOpen ? "text-gold" : "text-stone-500 hover:text-stone-900",
                !isScrolled && !isMegaMenuOpen && pathname === "/" ? "text-white/80 hover:text-white" : ""
              )}
            >
              Destinations
              <ChevronDown className={cn("w-3 h-3 transition-transform duration-300", isMegaMenuOpen ? "rotate-180" : "")} />
            </button>
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={cn(
                  "text-[10px] font-medium tracking-[0.2em] uppercase transition-colors",
                  pathname === link.href ? "text-gold" : "text-stone-500 hover:text-stone-900",
                  !isScrolled && !isMegaMenuOpen && pathname === "/" ? "text-white/80 hover:text-white" : ""
                )}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-4">
          <Link 
            href="/about" 
            className={cn(
              "hidden md:block text-[10px] font-medium tracking-[0.2em] uppercase transition-colors",
              !isScrolled && !isMegaMenuOpen && pathname === "/" ? "text-white/80 hover:text-white" : "text-stone-500 hover:text-stone-900"
            )}
          >
            About
          </Link>
          
          <SuitcaseButton 
            variant={!isScrolled && !isMegaMenuOpen && pathname === "/" ? "white" : "dark"} 
          />

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden"
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </Button>
        </div>
      </nav>

      {/* Mega Menu Overlay */}
      <MegaMenu 
        isOpen={isMegaMenuOpen} 
        onClose={() => setIsMegaMenuOpen(false)} 
      />

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-stone-100 bg-white shadow-xl">
            <div className="container-wide py-12 space-y-8">
              <div className="space-y-4">
                <p className="text-[10px] tracking-[0.2em] font-medium text-stone-400 uppercase">
                  Discover
                </p>
                <Link
                  href="/atlas"
                  className="block text-2xl font-serif text-stone-900"
                >
                  The Atlas
                </Link>
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="block text-2xl font-serif text-stone-900"
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
              
              <div className="h-px bg-stone-100" />
              
              <div className="space-y-4">
                <p className="text-[10px] tracking-[0.2em] font-medium text-stone-400 uppercase">
                  Regions
                </p>
                <Link href="/destinations?region=Cyclades" className="block text-lg font-serif text-stone-600">Cyclades</Link>
                <Link href="/destinations?region=Mediterranean" className="block text-lg font-serif text-stone-600">Mediterranean</Link>
                <Link href="/destinations?region=East-Asia" className="block text-lg font-serif text-stone-600">East Asia</Link>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </header>
  );
}
