"use client";

import Link from "next/link";
import { useFavorites } from "@/lib/context/FavoritesContext";
import { Button } from "@/components/ui/button";
import { Heart, ArrowRight, ShoppingBag } from "lucide-react";
import { useEffect, useState } from "react";
import { getProductByHandle } from "@/lib/shopify";
import type { Product } from "@/lib/shopify/types";
import { PieceCard } from "@/components/product/ArtifactCard";

export default function FavoritesPage() {
  const { favorites, favoriteCount } = useFavorites();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchFavoriteProducts() {
      if (favorites.length === 0) {
        setProducts([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const productPromises = favorites.map(handle => getProductByHandle(handle));
        const fetchedProducts = await Promise.all(productPromises);
        setProducts(fetchedProducts.filter((p): p is Product => p !== null));
      } catch (error) {
        console.error('Error fetching favorite products:', error);
      }
      setIsLoading(false);
    }

    fetchFavoriteProducts();
  }, [favorites]);

  return (
    <div className="flex flex-col bg-white min-h-screen">
      {/* Header */}
      <section className="py-24 bg-[#F9F8F6] border-b border-stone-100">
        <div className="container-wide">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="max-w-2xl">
              <div className="flex items-center gap-3 mb-6">
                <Heart className="w-5 h-5 text-gold" />
                <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-stone-400">
                  Your Collection
                </span>
              </div>
              <h1 className="font-serif text-5xl md:text-7xl mb-8 italic">
                Favorites
              </h1>
              <p className="text-stone-500 font-light leading-relaxed text-lg">
                Pieces you&apos;ve saved for later. Your wishlist is stored locally and will persist across visits.
              </p>
            </div>
            
            <div className="flex flex-col items-end text-right">
              <span className="text-[10px] uppercase tracking-widest text-stone-300 mb-2 font-mono">
                Saved Pieces
              </span>
              <span className="text-4xl font-light font-serif text-stone-900 leading-none">
                {favoriteCount.toString().padStart(2, '0')}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Favorites Grid */}
      <section className="section-spacing">
        <div className="container-wide">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10 lg:gap-12">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div 
                    className="aspect-[3/4] bg-stone-200 mb-4"
                    style={{ borderRadius: "50% 50% 16px 16px / 35% 35% 0 0" }}
                  />
                  <div className="bg-white rounded-b-xl pt-5 pb-4 px-4 -mt-4">
                    <div className="h-3 bg-stone-200 rounded w-16 mx-auto mb-3" />
                    <div className="h-5 bg-stone-200 rounded w-32 mx-auto mb-4" />
                    <div className="h-4 bg-stone-200 rounded w-20 mx-auto" />
                  </div>
                </div>
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10 lg:gap-12">
              {products.map((product) => (
                <PieceCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="py-32 text-center">
              <Heart className="w-16 h-16 text-stone-200 mx-auto mb-8" />
              <h2 className="font-serif text-3xl text-stone-400 italic mb-6">
                No favorites yet
              </h2>
              <p className="text-stone-400 mb-10 max-w-md mx-auto">
                Browse our collection and tap the heart icon on pieces you love to save them here.
              </p>
              <Button asChild variant="outline" className="rounded-none border-stone-300 text-stone-700 hover:border-gold hover:text-gold h-12 px-8">
                <Link href="/pieces" className="inline-flex items-center gap-3">
                  <ShoppingBag className="w-4 h-4" />
                  Browse the Collection
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Continue Shopping CTA */}
      {products.length > 0 && (
        <section className="pb-24">
          <div className="container-wide text-center">
            <Button asChild variant="outline" className="rounded-none border-stone-300 text-stone-700 hover:border-gold hover:text-gold h-12 px-8">
              <Link href="/pieces" className="inline-flex items-center gap-3">
                Continue Shopping
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>
        </section>
      )}
    </div>
  );
}
