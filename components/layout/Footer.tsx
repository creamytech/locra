import Link from "next/link";
import { Separator } from "@/components/ui/separator";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border/40 bg-background">
      <div className="container-wide py-12 md:py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand Column */}
          <div className="md:col-span-2">
            <Link
              href="/"
              className="font-serif text-2xl tracking-widest text-foreground"
            >
              LOCRA
            </Link>
            <p className="mt-4 text-sm text-muted-foreground max-w-sm leading-relaxed">
              Curating wearable artifacts inspired by iconic destinations.
              Three portals. Infinite journeys.
            </p>
          </div>

          {/* Destinations */}
          <div>
            <h4 className="font-serif text-sm font-medium tracking-wide uppercase text-foreground mb-4">
              Destinations
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/destinations/santorini"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  Santorini
                </Link>
              </li>
              <li>
                <Link
                  href="/destinations/amalfi"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  Amalfi
                </Link>
              </li>
              <li>
                <Link
                  href="/destinations/kyoto"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  Kyoto
                </Link>
              </li>
            </ul>
          </div>

          {/* Club */}
          <div>
            <h4 className="font-serif text-sm font-medium tracking-wide uppercase text-foreground mb-4">
              Club
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/travel-club"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  Travel Club
                </Link>
              </li>
              <li>
                <Link
                  href="/journal"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  Journal
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-8 bg-border/50" />

        {/* Bottom Bar */}
        <div className="flex flex-col items-center justify-between gap-4 text-center md:flex-row md:text-left">
          <p className="text-xs text-muted-foreground">
            &copy; {currentYear} LOCRA. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link
              href="/privacy"
              className="text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              Terms
            </Link>
            <Link
              href="/shipping"
              className="text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              Shipping
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
