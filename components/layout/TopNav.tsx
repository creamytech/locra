"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { Menu, X, ChevronDown, Plane, BookOpen, Crown, Gift, Map, Compass, Target, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MegaMenu } from "@/components/layout/MegaMenu";
import { SuitcaseButton } from "@/components/cart/SuitcaseButton";
import { LogoWordmark } from "@/components/brand/Logo";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import type { Product } from "@/lib/shopify/types";

interface TopNavProps {
  featuredProducts?: Record<string, Product | null>;
}

type MenuType = 'destinations' | 'travel-club' | 'journal' | null;

// Content for each mega menu
const menuContent = {
  'travel-club': {
    title: 'Atlas Travel Club',
    description: 'Earn miles, collect stamps, unlock rewards',
    links: [
      { name: 'How It Works', href: '/travel-club', icon: Compass, description: 'Discover the journey' },
      { name: 'Your Passport', href: '/passport', icon: Map, description: 'View your stamps & miles' },
      { name: 'Rewards', href: '/passport?tab=rewards', icon: Gift, description: 'Redeem your miles' },
      { name: 'Quests', href: '/passport?tab=quests', icon: Target, description: 'Earn bonus miles' },
      { name: 'Refer Friends', href: '/passport?tab=overview', icon: Users, description: 'Share & earn 1,000 miles' },
    ],
    highlight: {
      title: 'Join the Club',
      description: 'Earn 1 mile for every $1 spent. Collect passport stamps. Unlock exclusive rewards.',
      cta: 'Start Earning',
      href: '/travel-club',
    }
  },
  'journal': {
    title: 'The Journal',
    description: 'Stories from destinations around the world',
    links: [
      { name: 'All Stories', href: '/journal', icon: BookOpen, description: 'Browse the archive' },
      { name: 'Destination Guides', href: '/journal?category=guides', icon: Map, description: 'Travel inspiration' },
      { name: 'Behind the Scenes', href: '/journal?category=behind-the-scenes', icon: Compass, description: 'How we source' },
    ],
    highlight: {
      title: 'Latest Story',
      description: 'Discover the artisans and traditions behind our carefully curated artifacts.',
      cta: 'Read Now',
      href: '/journal',
    }
  },
};

export function TopNav({ featuredProducts }: TopNavProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<MenuType>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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
    setActiveMenu(null);
  }, [pathname]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
    };
  }, []);

  const handleNavEnter = (menuId: MenuType) => {
    // Clear any pending close timeout
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setActiveMenu(menuId);
  };

  const handleNavLeave = () => {
    // Delay closing to allow moving to dropdown
    closeTimeoutRef.current = setTimeout(() => {
      setActiveMenu(null);
    }, 150);
  };

  const handleDropdownEnter = () => {
    // Cancel the close timeout when entering dropdown
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
  };

  const handleDropdownLeave = () => {
    // Close immediately when leaving dropdown
    setActiveMenu(null);
  };

  const navItems = [
    { name: "Destinations", id: 'destinations' as MenuType },
    { name: "Travel Club", id: 'travel-club' as MenuType, href: "/travel-club" },
    { name: "Journal", id: 'journal' as MenuType, href: "/journal" },
  ];

  const isLightMode = !isScrolled && !activeMenu && !isMobileMenuOpen && pathname === "/";

  return (
    <header 
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        isScrolled || activeMenu || isMobileMenuOpen
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
            className="flex items-center transition-opacity hover:opacity-70"
            aria-label="LOCRA Home"
          >
            <LogoWordmark 
              color={isLightMode ? "light" : "dark"} 
              className="h-5 w-auto"
            />
          </Link>

          {/* Desktop Primary Nav */}
          <div className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => (
              <button
                key={item.name}
                onMouseEnter={() => handleNavEnter(item.id)}
                onMouseLeave={handleNavLeave}
                onClick={() => setActiveMenu(activeMenu === item.id ? null : item.id)}
                className={cn(
                  "group flex items-center gap-1.5 text-[10px] font-medium tracking-[0.2em] uppercase transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 rounded py-2",
                  activeMenu === item.id ? "text-gold" : "",
                  isLightMode ? "text-white/90 hover:text-white" : "text-stone-500 hover:text-stone-900"
                )}
              >
                {item.name}
                <ChevronDown className={cn(
                  "w-3 h-3 transition-transform duration-200",
                  activeMenu === item.id ? "rotate-180" : ""
                )} />
              </button>
            ))}
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-4">
          <Link 
            href="/about" 
            className={cn(
              "hidden md:block text-[10px] font-medium tracking-[0.2em] uppercase transition-colors",
              isLightMode ? "text-white/90 hover:text-white" : "text-stone-500 hover:text-stone-900"
            )}
          >
            About
          </Link>
          
          <SuitcaseButton 
            variant={isLightMode ? "white" : "dark"} 
          />

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden"
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </Button>
        </div>
      </nav>

      {/* Destinations Mega Menu */}
      <MegaMenu 
        isOpen={activeMenu === 'destinations'} 
        onClose={() => setActiveMenu(null)}
        onMouseEnter={handleDropdownEnter}
        onMouseLeave={handleDropdownLeave}
        featuredProducts={featuredProducts}
      />

      {/* Travel Club & Journal Mega Menus */}
      <AnimatePresence>
        {(activeMenu === 'travel-club' || activeMenu === 'journal') && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="absolute left-0 right-0 top-full bg-white border-b border-stone-200 shadow-xl overflow-hidden"
            onMouseEnter={handleDropdownEnter}
            onMouseLeave={handleDropdownLeave}
          >
            <div className="container-wide py-10">
              <div className="grid grid-cols-12 gap-12">
                {/* Left: Links */}
                <div className="col-span-7">
                  <p className="text-[10px] tracking-[0.3em] font-medium text-stone-400 uppercase mb-6">
                    {menuContent[activeMenu].title}
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    {menuContent[activeMenu].links.map((link, idx) => (
                      <motion.div
                        key={link.name}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                      >
                        <Link
                          href={link.href}
                          className="group flex items-start gap-4 p-4 rounded-xl hover:bg-stone-50 transition-colors"
                          onClick={() => setActiveMenu(null)}
                        >
                          <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center shrink-0 group-hover:bg-gold/20 transition-colors">
                            <link.icon className="w-5 h-5 text-gold" />
                          </div>
                          <div>
                            <p className="font-medium text-stone-900 group-hover:text-gold transition-colors">
                              {link.name}
                            </p>
                            <p className="text-sm text-stone-500">{link.description}</p>
                          </div>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Right: Highlight Card */}
                <div className="col-span-5">
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15 }}
                    className="relative h-full rounded-2xl bg-gradient-to-br from-stone-900 via-stone-900 to-stone-800 p-8 text-white overflow-hidden"
                  >
                    {/* Background glow */}
                    <div className="absolute top-0 right-0 w-40 h-40 bg-gold/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                    
                    <div className="relative">
                      <div className="w-12 h-12 rounded-xl bg-gold/20 flex items-center justify-center mb-6">
                        {activeMenu === 'travel-club' ? (
                          <Plane className="w-6 h-6 text-gold" />
                        ) : (
                          <BookOpen className="w-6 h-6 text-gold" />
                        )}
                      </div>
                      
                      <h3 className="font-serif text-2xl mb-3">
                        {menuContent[activeMenu].highlight.title}
                      </h3>
                      <p className="text-stone-400 text-sm leading-relaxed mb-6">
                        {menuContent[activeMenu].highlight.description}
                      </p>
                      
                      <Button
                        asChild
                        className="bg-gold hover:bg-gold/90 text-stone-950"
                      >
                        <Link href={menuContent[activeMenu].highlight.href}>
                          {menuContent[activeMenu].highlight.cta}
                        </Link>
                      </Button>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden border-t border-stone-100 bg-white shadow-xl overflow-hidden"
          >
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
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href || `/${item.id}`}
                    className="block text-2xl font-serif text-stone-900"
                  >
                    {item.name}
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

              <div className="h-px bg-stone-100" />
              
              <div className="space-y-4">
                <p className="text-[10px] tracking-[0.2em] font-medium text-stone-400 uppercase">
                  Account
                </p>
                <Link href="/passport" className="block text-lg font-serif text-stone-600">Your Passport</Link>
                <Link href="/account" className="block text-lg font-serif text-stone-600">Account Settings</Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
