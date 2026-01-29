"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LogoIcon } from "@/components/brand/Logo";
import { DESTINATIONS } from "@/lib/data/atlas";
import { 
  MapPin, 
  Plane, 
  ArrowRight, 
  Instagram, 
  Mail,
  Send
} from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setEmail("");
    }
  };

  return (
    <footer className="bg-stone-50 border-t border-stone-200">
      
      {/* Upper Section - Newsletter Banner */}
      <div className="bg-gradient-to-r from-stone-100 via-white to-stone-100 border-b border-stone-200">
        <div className="container-wide py-16 md:py-20">
          <div className="max-w-2xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 mb-6">
              <Mail className="w-4 h-4 text-gold" />
              <p className="text-[10px] tracking-[0.3em] uppercase text-gold font-bold">
                The Atlas Newsletter
              </p>
            </div>
            
            <h3 className="font-serif text-2xl md:text-3xl text-stone-900 mb-4">
              Discover New Horizons First
            </h3>
            
            <p className="text-stone-500 mb-8 max-w-md mx-auto">
              Early access to new destinations, travel stories, and exclusive member rewards delivered to your inbox.
            </p>

            {/* Newsletter Form */}
            <form onSubmit={handleSubscribe} className="max-w-md mx-auto">
              {isSubscribed ? (
                <div className="flex items-center justify-center gap-3 p-4 bg-gold/10 border border-gold/30 rounded-sm">
                  <Plane className="w-5 h-5 text-gold" />
                  <p className="text-gold font-medium">Welcome aboard. Your journey begins now.</p>
                </div>
              ) : (
                <div className="flex gap-0">
                  <Input
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 h-14 bg-white border-stone-300 text-stone-900 placeholder:text-stone-400 focus:border-gold focus:ring-gold/20 rounded-none rounded-l-sm text-base"
                    required
                  />
                  <Button 
                    type="submit"
                    className="h-14 px-8 bg-stone-900 hover:bg-gold text-white font-medium rounded-none rounded-r-sm transition-all duration-300"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Subscribe
                  </Button>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container-wide py-16 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8">
          
          {/* Brand Column */}
          <div className="lg:col-span-4 space-y-6">
            <Link href="/" aria-label="LOCRA Home" className="inline-block group">
              <LogoIcon className="h-10 w-auto text-stone-900 transition-all duration-300 group-hover:text-gold" />
            </Link>
            
            <p className="text-stone-500 leading-relaxed max-w-xs">
              Curating wearable artifacts inspired by the world's most iconic destinations. 
              Every piece tells a story.
            </p>

            {/* Social */}
            <div className="flex items-center gap-4 pt-2">
              <a 
                href="https://instagram.com/locra" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-center w-10 h-10 rounded-full border border-stone-300 text-stone-500 hover:border-gold hover:text-gold hover:bg-gold/5 transition-all duration-300"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a 
                href="mailto:hello@locra.com"
                className="flex items-center justify-center w-10 h-10 rounded-full border border-stone-300 text-stone-500 hover:border-gold hover:text-gold hover:bg-gold/5 transition-all duration-300"
                aria-label="Email"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Navigation Columns */}
          <div className="lg:col-span-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              
              {/* Destinations */}
              <div>
                <h4 className="text-[11px] tracking-[0.2em] uppercase text-stone-400 font-bold mb-5 flex items-center gap-2">
                  <MapPin className="w-3 h-3 text-gold" />
                  Destinations
                </h4>
                <ul className="space-y-3">
                  {DESTINATIONS.slice(0, 4).map((dest) => (
                    <li key={dest.handle}>
                      <Link
                        href={`/destinations/${dest.handle}`}
                        className="text-sm text-stone-600 hover:text-gold transition-colors duration-200"
                      >
                        {dest.name}
                      </Link>
                    </li>
                  ))}
                  <li>
                    <Link
                      href="/atlas"
                      className="text-sm text-gold hover:text-gold/80 transition-colors inline-flex items-center gap-1 font-medium"
                    >
                      View All
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Shop */}
              <div>
                <h4 className="text-[11px] tracking-[0.2em] uppercase text-stone-400 font-bold mb-5">
                  Shop
                </h4>
                <ul className="space-y-3">
                  <li>
                    <Link href="/artifacts" className="text-sm text-stone-600 hover:text-gold transition-colors">
                      All Artifacts
                    </Link>
                  </li>
                  <li>
                    <Link href="/artifacts?type=t-shirt" className="text-sm text-stone-600 hover:text-gold transition-colors">
                      T-Shirts
                    </Link>
                  </li>
                  <li>
                    <Link href="/artifacts?new=true" className="text-sm text-stone-600 hover:text-gold transition-colors">
                      New Arrivals
                    </Link>
                  </li>
                  <li>
                    <Link href="/gift-cards" className="text-sm text-stone-600 hover:text-gold transition-colors">
                      Gift Cards
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Travel Club */}
              <div>
                <h4 className="text-[11px] tracking-[0.2em] uppercase text-stone-400 font-bold mb-5 flex items-center gap-2">
                  <Plane className="w-3 h-3 text-gold" />
                  Travel Club
                </h4>
                <ul className="space-y-3">
                  <li>
                    <Link href="/travel-club" className="text-sm text-stone-600 hover:text-gold transition-colors">
                      Join Free
                    </Link>
                  </li>
                  <li>
                    <Link href="/travel-club#benefits" className="text-sm text-stone-600 hover:text-gold transition-colors">
                      Member Benefits
                    </Link>
                  </li>
                  <li>
                    <Link href="/passport" className="text-sm text-stone-600 hover:text-gold transition-colors">
                      My Passport
                    </Link>
                  </li>
                  <li>
                    <Link href="/referrals" className="text-sm text-stone-600 hover:text-gold transition-colors">
                      Refer Friends
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Info */}
              <div>
                <h4 className="text-[11px] tracking-[0.2em] uppercase text-stone-400 font-bold mb-5">
                  Info
                </h4>
                <ul className="space-y-3">
                  <li>
                    <Link href="/about" className="text-sm text-stone-600 hover:text-gold transition-colors">
                      About LOCRA
                    </Link>
                  </li>
                  <li>
                    <Link href="/journal" className="text-sm text-stone-600 hover:text-gold transition-colors">
                      The Journal
                    </Link>
                  </li>
                  <li>
                    <Link href="/contact" className="text-sm text-stone-600 hover:text-gold transition-colors">
                      Contact
                    </Link>
                  </li>
                  <li>
                    <Link href="/faq" className="text-sm text-stone-600 hover:text-gold transition-colors">
                      FAQ
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-stone-200 bg-white">
        <div className="container-wide py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            
            {/* Copyright */}
            <p className="text-xs text-stone-400">
              © {currentYear} LOCRA. All rights reserved.
            </p>

            {/* Tagline */}
            <p className="hidden md:block text-xs text-stone-400 italic">
              Artifacts of Destination
            </p>

            {/* Legal Links */}
            <div className="flex items-center gap-6">
              <Link href="/privacy" className="text-xs text-stone-400 hover:text-stone-600 transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-xs text-stone-400 hover:text-stone-600 transition-colors">
                Terms of Service
              </Link>
              <Link href="/shipping" className="text-xs text-stone-400 hover:text-stone-600 transition-colors">
                Shipping & Returns
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
