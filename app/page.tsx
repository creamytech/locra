import { getFeaturedProducts } from "@/lib/shopify";
import { HomePageClient } from "./HomePageClient";

export default async function HomePage() {
  const featuredProducts = await getFeaturedProducts(6);

  return <HomePageClient featuredProducts={featuredProducts} />;
}
