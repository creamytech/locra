import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ArtifactCard } from "@/components/product/ArtifactCard";
import { getCollectionByHandle } from "@/lib/shopify";

// Destination metadata
const destinationMeta: Record<
  string,
  { tagline: string; coordinates: string; curatorNote: string }
> = {
  santorini: {
    tagline: "Aegean blues and whitewashed dreams",
    coordinates: "36.3932° N, 25.4615° E",
    curatorNote:
      "The Santorini collection draws from the volcanic majesty and legendary sunsets of this Greek island. Each piece captures the essence of caldera views and ancient Cycladic architecture.",
  },
  amalfi: {
    tagline: "Coastal elegance carved in stone",
    coordinates: "40.6340° N, 14.6027° E",
    curatorNote:
      "From the winding cliffside roads to the vibrant ceramics of Vietri, the Amalfi collection embodies la dolce vita. Mediterranean sophistication meets artisanal craftsmanship.",
  },
  kyoto: {
    tagline: "Where tradition breathes",
    coordinates: "35.0116° N, 135.7681° E",
    curatorNote:
      "The Kyoto collection honors centuries of Japanese craftsmanship. From the bamboo groves of Arashiyama to the golden pavilions, each artifact reflects wabi-sabi philosophy.",
  },
};

interface DestinationPageProps {
  params: Promise<{ handle: string }>;
}

export async function generateMetadata({
  params,
}: DestinationPageProps): Promise<Metadata> {
  const { handle } = await params;
  const collection = await getCollectionByHandle(handle);

  if (!collection) {
    return {
      title: "Destination Not Found",
    };
  }

  const meta = destinationMeta[handle];

  return {
    title: `${collection.title} - The ${collection.title} Wing`,
    description:
      collection.seo?.description ||
      meta?.curatorNote ||
      collection.description,
    openGraph: {
      title: `${collection.title} Collection | LOCRA`,
      description: meta?.tagline || collection.description,
      images: collection.image
        ? [{ url: collection.image.url, alt: collection.title }]
        : [],
    },
  };
}

export default async function DestinationPage({ params }: DestinationPageProps) {
  const { handle } = await params;
  const collection = await getCollectionByHandle(handle, 24);

  if (!collection) {
    notFound();
  }

  const meta = destinationMeta[handle] || {
    tagline: "",
    coordinates: "",
    curatorNote: collection.description,
  };

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 bg-gradient-to-b from-stone-100 to-background">
        <div className="container-wide">
          <div className="max-w-3xl">
            <Badge variant="coordinates" className="mb-4">
              {meta.coordinates}
            </Badge>

            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl mb-4">
              The {collection.title} Wing
            </h1>

            <p className="text-xl text-muted-foreground mb-6">{meta.tagline}</p>

            <div className="prose prose-stone max-w-none">
              <p className="text-muted-foreground leading-relaxed">
                {meta.curatorNote}
              </p>
            </div>
          </div>
        </div>
      </section>

      <Separator className="divider-museum" />

      {/* Products Grid */}
      <section className="section-spacing">
        <div className="container-wide">
          {collection.products.length > 0 ? (
            <>
              <div className="flex items-center justify-between mb-8">
                <p className="text-sm text-muted-foreground">
                  {collection.products.length}{" "}
                  {collection.products.length === 1 ? "artifact" : "artifacts"}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {collection.products.map((product, index) => (
                  <ArtifactCard
                    key={product.id}
                    product={product}
                    priority={index < 4}
                  />
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-16">
              <p className="text-xl text-muted-foreground mb-4">
                Artifacts arriving soon.
              </p>
              <p className="text-sm text-muted-foreground mb-8">
                Join the Travel Club to be notified when new pieces are
                released.
              </p>
              <Button asChild variant="outline">
                <Link href="/#travel-club">Join Travel Club</Link>
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Other Destinations */}
      <section className="py-16 bg-stone-100/50 border-t border-border/50">
        <div className="container-wide">
          <h2 className="font-serif text-2xl mb-8 text-center">
            Explore Other Destinations
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            {Object.entries(destinationMeta)
              .filter(([h]) => h !== handle)
              .map(([h, data]) => (
                <Button key={h} asChild variant="outline">
                  <Link href={`/destinations/${h}`}>
                    Enter {h.charAt(0).toUpperCase() + h.slice(1)}
                  </Link>
                </Button>
              ))}
          </div>
        </div>
      </section>
    </div>
  );
}
