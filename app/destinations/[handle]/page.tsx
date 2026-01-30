import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getCollectionByHandle } from "@/lib/shopify";
import { DESTINATIONS, getDestinationByHandle } from "@/lib/data/atlas";
import { DestinationPageClient } from "./DestinationPageClient";

interface DestinationPageProps {
  params: Promise<{ handle: string }>;
}

// Generate static params for all known destinations
export async function generateStaticParams() {
  return DESTINATIONS.map((dest) => ({
    handle: dest.handle,
  }));
}

export async function generateMetadata({
  params,
}: DestinationPageProps): Promise<Metadata> {
  const { handle } = await params;
  const dest = getDestinationByHandle(handle);
  const collection = await getCollectionByHandle(dest?.collectionHandle || handle);

  if (!dest && !collection) {
    return { title: "Destination Not Found — LOCRA" };
  }

  const name = dest?.name || collection?.title || "Destination";
  const description = dest?.story || collection?.description || `Explore the ${name} collection at LOCRA`;

  return {
    title: `${name} Collection — LOCRA`,
    description,
    openGraph: {
      title: `${name} Collection — LOCRA`,
      description,
      images: dest?.heroImageUrl ? [{ url: dest.heroImageUrl }] : undefined,
    },
  };
}

export default async function DestinationPage({ params }: DestinationPageProps) {
  const { handle } = await params;
  
  // Find destination in our data
  const dest = getDestinationByHandle(handle);
  
  // Fetch collection from Shopify
  const collection = await getCollectionByHandle(dest?.collectionHandle || handle, 24);

  // If neither destination data nor collection exists, 404
  if (!dest && !collection) {
    notFound();
  }

  // Create a fallback destination if we only have a collection
  const destination = dest || {
    id: handle,
    handle,
    name: collection?.title || "Collection",
    region: "Unknown",
    coordinates: "Coordinates Pending",
    tagline: collection?.description?.slice(0, 50) || "",
    poeticDescription: "",
    story: collection?.description || "",
    thumbnailUrl: collection?.image?.url || "",
    heroImageUrl: collection?.image?.url || "",
    featuredArtifactHandle: "",
    colorPalette: {
      primary: "#1a1a1a",
      secondary: "#f5f5f0",
      accent: "#c4a052",
    },
    collectionHandle: handle,
  };

  return (
    <DestinationPageClient 
      destination={destination} 
      collection={collection} 
      handle={handle} 
    />
  );
}
