import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { HeroVideo } from "@/components/portal/HeroVideo";
import { TravelClubSignup } from "@/components/portal/TravelClubSignup";
import { ArtifactCard } from "@/components/product/ArtifactCard";
import { getFeaturedProducts } from "@/lib/shopify";

// Destination data
const destinations = [
  {
    name: "Santorini",
    handle: "santorini",
    tagline: "Aegean blues and whitewashed dreams",
    coordinates: "36.3932° N",
  },
  {
    name: "Amalfi",
    handle: "amalfi",
    tagline: "Coastal elegance carved in stone",
    coordinates: "40.6340° N",
  },
  {
    name: "Kyoto",
    handle: "kyoto",
    tagline: "Where tradition breathes",
    coordinates: "35.0116° N",
  },
];

export default async function HomePage() {
  // Fetch featured products from Shopify
  const featuredProducts = await getFeaturedProducts(3);

  return (
    <div className="flex flex-col">
      {/* Hero Section with Video */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Video Background */}
        <div className="absolute inset-0">
          <HeroVideo 
            src="https://5kynenqtmmcueqop.public.blob.vercel-storage.com/LocraHero.mp4" 
            className="w-full h-full"
          />
          {/* Overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-stone-900/40 via-stone-900/20 to-stone-900/60" />
        </div>

        {/* Hero Content */}
        <div className="container-narrow relative z-10 text-center py-20">
          <p className="text-sm font-medium tracking-widest text-white/80 uppercase mb-4 animate-fade-in drop-shadow-md">
            Locra Travel Club
          </p>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-light tracking-tight mb-6 text-balance animate-slide-up text-white drop-shadow-lg">
            Three destinations.
            <br />
            One portal.
          </h1>

          <p className="text-lg md:text-xl text-white/90 max-w-xl mx-auto mb-12 animate-fade-in drop-shadow-md">
            Locra Travel Club curates wearable artifacts inspired by iconic
            places.
          </p>

          {/* Portal Arch Frame - Decorative */}
          <div className="flex justify-center mb-10">
            <div className="relative w-32 h-40 md:w-40 md:h-52">
              {/* Arch outline */}
              <div 
                className="absolute inset-0 border-2 border-white/30 backdrop-blur-sm"
                style={{ borderRadius: "999px 999px 0 0" }}
              />
              {/* Glow effect */}
              <div 
                className="absolute inset-0 animate-glow-pulse"
                style={{ 
                  borderRadius: "999px 999px 0 0",
                  boxShadow: "0 0 60px 20px rgba(212, 168, 83, 0.2)"
                }}
              />
              {/* Inner content */}
              <div className="absolute inset-4 flex items-center justify-center">
                <span className="font-serif text-lg md:text-xl text-white/70 tracking-[0.3em]">
                  ENTER
                </span>
              </div>
            </div>
          </div>

          <Button asChild size="xl" className="animate-fade-in bg-white/10 backdrop-blur-sm border border-white/30 text-white hover:bg-white/20">
            <Link href="#destinations">Enter the Atlas</Link>
          </Button>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
          <span className="text-xs text-white/60 tracking-widest uppercase">Scroll</span>
          <svg 
            className="w-5 h-5 text-white/60" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* Destinations Section */}
      <section id="destinations" className="section-spacing bg-background">
        <div className="container-wide">
          <div className="text-center mb-12">
            <Badge variant="coordinates" className="mb-4">
              41.9028° N, 12.4964° E
            </Badge>
            <h2 className="font-serif text-3xl md:text-4xl mb-4">
              Choose Your Destination
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Each portal leads to a curated collection of wearable artifacts.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {destinations.map((dest, index) => (
              <Link
                key={dest.handle}
                href={`/destinations/${dest.handle}`}
                className="group"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="relative p-8 border border-border/50 rounded-lg bg-card/50 backdrop-blur-sm transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:-translate-y-1">
                  {/* Subtle glow on hover */}
                  <div className="absolute inset-0 rounded-lg bg-gradient-to-b from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                  <div className="relative">
                    <Badge
                      variant="coordinates"
                      className="mb-4 text-[9px] tracking-wider"
                    >
                      {dest.coordinates}
                    </Badge>
                    <h3 className="font-serif text-2xl mb-2 group-hover:text-primary transition-colors">
                      {dest.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-6">
                      {dest.tagline}
                    </p>
                    <Button variant="outline" size="sm" className="w-full">
                      Enter {dest.name}
                    </Button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Separator className="divider-museum" />

      {/* Featured Artifacts Section */}
      <section className="section-spacing">
        <div className="container-wide">
          <div className="text-center mb-12">
            <p className="text-sm font-medium tracking-widest text-muted-foreground uppercase mb-4">
              The Collection
            </p>
            <h2 className="font-serif text-3xl md:text-4xl mb-4">
              Featured Artifacts
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Curated pieces from our most sought-after destinations.
            </p>
          </div>

          {featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {featuredProducts.map((product, index) => (
                <ArtifactCard
                  key={product.id}
                  product={product}
                  priority={index === 0}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                Featured artifacts coming soon.
              </p>
            </div>
          )}

          <div className="text-center mt-12">
            <Button asChild variant="outline" size="lg">
              <Link href="/destinations/santorini">View All Artifacts</Link>
            </Button>
          </div>
        </div>
      </section>

      <Separator className="divider-museum" />

      {/* Atlas Map Section */}
      <section className="section-spacing bg-stone-100/50">
        <div className="container-wide">
          <div className="text-center mb-12">
            <p className="text-sm font-medium tracking-widest text-muted-foreground uppercase mb-4">
              The Atlas
            </p>
            <h2 className="font-serif text-3xl md:text-4xl mb-4">
              Your Journey Map
            </h2>
          </div>

          {/* Stylized Map */}
          <div className="relative max-w-4xl mx-auto aspect-[16/9] rounded-xl border border-border/50 bg-gradient-to-br from-stone-200/50 via-background to-stone-100/50 overflow-hidden">
            {/* Map Grid Pattern */}
            <svg
              className="absolute inset-0 w-full h-full opacity-10"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <pattern
                  id="grid"
                  width="40"
                  height="40"
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d="M 40 0 L 0 0 0 40"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="0.5"
                  />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>

            {/* Decorative Lines */}
            <svg
              className="absolute inset-0 w-full h-full"
              viewBox="0 0 800 450"
              preserveAspectRatio="xMidYMid slice"
            >
              {/* Connection lines */}
              <path
                d="M 200,200 Q 400,150 500,250 T 650,180"
                fill="none"
                stroke="hsl(var(--primary))"
                strokeWidth="1"
                strokeDasharray="4 4"
                opacity="0.3"
              />
            </svg>

            {/* Portal Pins */}
            <div className="absolute inset-0 flex items-center justify-around px-16">
              {destinations.map((dest, i) => (
                <Link
                  key={dest.handle}
                  href={`/destinations/${dest.handle}`}
                  className="group flex flex-col items-center"
                  style={{ transform: `translateY(${(i - 1) * 20}px)` }}
                >
                  <div className="relative">
                    {/* Pin glow */}
                    <div className="absolute inset-0 w-8 h-8 bg-primary/20 rounded-full blur-md group-hover:bg-primary/40 transition-colors" />
                    {/* Pin */}
                    <div className="relative w-8 h-8 bg-primary rounded-full flex items-center justify-center border-2 border-background shadow-lg group-hover:scale-110 transition-transform">
                      <div className="w-2 h-2 bg-background rounded-full" />
                    </div>
                  </div>
                  <span className="mt-3 text-sm font-medium">{dest.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Separator className="divider-museum" />

      {/* Travel Club Signup Section */}
      <section className="section-spacing">
        <div className="container-narrow">
          <TravelClubSignup />
        </div>
      </section>
    </div>
  );
}
