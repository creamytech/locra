import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { PortalArchFrame } from "@/components/portal/PortalArch";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/lib/shopify/types";

interface ArtifactCardProps {
  product: Product;
  priority?: boolean;
}

export function ArtifactCard({ product, priority = false }: ArtifactCardProps) {
  const price = product.priceRange.minVariantPrice;
  const hasEditionTag = product.tags.some((tag) =>
    tag.toLowerCase().includes("edition")
  );

  return (
    <Link
      href={`/products/${product.handle}`}
      className="group block"
    >
      <article className="space-y-3">
        {/* Image in Arch Frame */}
        <PortalArchFrame className="w-full aspect-[3/4] overflow-hidden">
          {product.featuredImage ? (
            <Image
              src={product.featuredImage.url}
              alt={product.featuredImage.altText || product.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              priority={priority}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-b from-stone-100 to-stone-200 flex items-center justify-center">
              <span className="text-stone-400 text-sm">No image</span>
            </div>
          )}
        </PortalArchFrame>

        {/* Product Info */}
        <div className="space-y-1 px-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-medium text-sm leading-tight group-hover:text-primary transition-colors">
              {product.title}
            </h3>
            {hasEditionTag && (
              <Badge variant="edition" className="flex-shrink-0">
                Edition
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            {formatPrice(price.amount, price.currencyCode)}
          </p>
        </div>
      </article>
    </Link>
  );
}

/**
 * Mini variant for featured section - smaller, simpler
 */
export function ArtifactCardMini({ product }: { product: Product }) {
  const price = product.priceRange.minVariantPrice;

  return (
    <Link href={`/products/${product.handle}`} className="group block">
      <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
        {product.featuredImage ? (
          <Image
            src={product.featuredImage.url}
            alt={product.featuredImage.altText || product.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, 25vw"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-b from-stone-100 to-stone-200" />
        )}
      </div>
      <div className="mt-2">
        <h4 className="text-sm font-medium truncate group-hover:text-primary transition-colors">
          {product.title}
        </h4>
        <p className="text-xs text-muted-foreground">
          {formatPrice(price.amount, price.currencyCode)}
        </p>
      </div>
    </Link>
  );
}
