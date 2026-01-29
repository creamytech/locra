import { getProductByHandle } from "@/lib/shopify";
import { DESTINATIONS } from "@/lib/data/atlas";
import { TopNav } from "./TopNav";
import type { Product } from "@/lib/shopify/types";

// Map of destination handle → featured product
export type FeaturedProductsMap = Record<string, Product | null>;

async function getFeaturedArtifacts(): Promise<FeaturedProductsMap> {
  const products: FeaturedProductsMap = {};
  
  // Fetch all featured artifacts in parallel
  await Promise.all(
    DESTINATIONS.map(async (dest) => {
      if (dest.featuredArtifactHandle) {
        const product = await getProductByHandle(dest.featuredArtifactHandle);
        products[dest.handle] = product;
      }
    })
  );
  
  return products;
}

export async function TopNavWrapper() {
  const featuredProducts = await getFeaturedArtifacts();
  
  return <TopNav featuredProducts={featuredProducts} />;
}
