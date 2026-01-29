import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { LogoIcon } from "@/components/brand/Logo";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-stone-200 bg-white">
      <div className="container-wide py-12 md:py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand Column */}
          <div className="md:col-span-2">
            <Link href="/" aria-label="LOCRA Home">
              <LogoIcon className="h-10 w-auto" />
            </Link>
            <p className="mt-6 text-sm text-stone-500 max-w-sm leading-relaxed font-light">
              Curating wearable artifacts inspired by iconic destinations.
              Three portals. Infinite journeys.
            </p>
          </div>

          {/* Destinations */}
          <div>
            <h4 className="font-serif text-sm font-medium tracking-wide uppercase text-stone-900 mb-4">
              Destinations
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/destinations/santorini"
                  className="text-sm text-stone-500 transition-colors hover:text-gold"
                >
                  Santorini
                </Link>
              </li>
              <li>
                <Link
                  href="/destinations/amalfi"
                  className="text-sm text-stone-500 transition-colors hover:text-gold"
                >
                  Amalfi
                </Link>
              </li>
              <li>
                <Link
                  href="/destinations/kyoto"
                  className="text-sm text-stone-500 transition-colors hover:text-gold"
                >
                  Kyoto
                </Link>
              </li>
            </ul>
          </div>

          {/* Club */}
          <div>
            <h4 className="font-serif text-sm font-medium tracking-wide uppercase text-stone-900 mb-4">
              Club
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/travel-club"
                  className="text-sm text-stone-500 transition-colors hover:text-gold"
                >
                  Travel Club
                </Link>
              </li>
              <li>
                <Link
                  href="/journal"
                  className="text-sm text-stone-500 transition-colors hover:text-gold"
                >
                  Journal
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-sm text-stone-500 transition-colors hover:text-gold"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-8" />

        {/* Bottom Bar */}
        <div className="flex flex-col items-center justify-between gap-4 text-center md:flex-row md:text-left">
          <p className="text-xs text-stone-400">
            &copy; {currentYear} LOCRA. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link
              href="/privacy"
              className="text-xs text-stone-400 transition-colors hover:text-stone-600"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="text-xs text-stone-400 transition-colors hover:text-stone-600"
            >
              Terms
            </Link>
            <Link
              href="/shipping"
              className="text-xs text-stone-400 transition-colors hover:text-stone-600"
            >
              Shipping
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
