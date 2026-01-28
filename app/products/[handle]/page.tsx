import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { PortalArchFrame } from "@/components/portal/PortalArch";
import { AddToCartButton } from "@/components/product/AddToCartButton";
import { getProductByHandle } from "@/lib/shopify";
import { formatPrice, cleanCopy } from "@/lib/utils";

interface ProductPageProps {
  params: Promise<{ handle: string }>;
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { handle } = await params;
  const product = await getProductByHandle(handle);

  if (!product) {
    return {
      title: "Artifact Not Found",
    };
  }

  return {
    title: product.seo?.title || product.title,
    description:
      product.seo?.description || product.description.substring(0, 160),
    openGraph: {
      title: `${product.title} | LOCRA`,
      description: product.description.substring(0, 200),
      images: product.featuredImage
        ? [
            {
              url: product.featuredImage.url,
              width: product.featuredImage.width,
              height: product.featuredImage.height,
              alt: product.featuredImage.altText || product.title,
            },
          ]
        : [],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { handle } = await params;
  const product = await getProductByHandle(handle);

  if (!product) {
    notFound();
  }

  const price = product.priceRange.minVariantPrice;
  const hasEditionTag = product.tags.some((tag) =>
    tag.toLowerCase().includes("edition")
  );

  // Clean description copy (remove em dashes per brand guidelines)
  const cleanDescription = cleanCopy(product.description);

  return (
    <div className="flex flex-col">
      {/* Breadcrumb */}
      <div className="container-wide py-4 border-b border-border/50">
        <nav className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="text-foreground">{product.title}</span>
        </nav>
      </div>

      {/* Main Product Section */}
      <section className="section-spacing">
        <div className="container-wide">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Left: Product Images */}
            <div className="space-y-4">
              {/* Main Image */}
              <PortalArchFrame glowEnabled className="w-full">
                <div className="relative aspect-[3/4]">
                  {product.featuredImage ? (
                    <Image
                      src={product.featuredImage.url}
                      alt={product.featuredImage.altText || product.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      priority
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-b from-stone-100 to-stone-200 flex items-center justify-center">
                      <span className="text-stone-400">No image available</span>
                    </div>
                  )}
                </div>
              </PortalArchFrame>

              {/* Thumbnail Gallery */}
              {product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {product.images.slice(0, 4).map((image, index) => (
                    <div
                      key={image.id}
                      className="relative aspect-square rounded-lg overflow-hidden border border-border/50 bg-muted"
                    >
                      <Image
                        src={image.url}
                        alt={image.altText || `${product.title} - Image ${index + 1}`}
                        fill
                        className="object-cover"
                        sizes="100px"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Product Details */}
            <div className="lg:py-8">
              <div className="sticky top-24 space-y-6">
                {/* Badges */}
                <div className="flex items-center gap-2">
                  {hasEditionTag && <Badge variant="edition">Edition</Badge>}
                  {product.productType && (
                    <Badge variant="outline">{product.productType}</Badge>
                  )}
                </div>

                {/* Title */}
                <h1 className="font-serif text-3xl md:text-4xl tracking-tight">
                  {product.title}
                </h1>

                {/* Price */}
                <p className="text-2xl font-light">
                  {formatPrice(price.amount, price.currencyCode)}
                </p>

                {/* Short Description */}
                <p className="text-muted-foreground leading-relaxed">
                  {cleanDescription.substring(0, 200)}
                  {cleanDescription.length > 200 ? "..." : ""}
                </p>

                <Separator />

                {/* Add to Cart */}
                <AddToCartButton variants={product.variants} />

                <Separator />

                {/* Accordion Details */}
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="details">
                    <AccordionTrigger className="text-base font-medium">
                      Details
                    </AccordionTrigger>
                    <AccordionContent>
                      <div
                        className="prose prose-stone prose-sm max-w-none"
                        dangerouslySetInnerHTML={{
                          __html: cleanCopy(product.descriptionHtml),
                        }}
                      />
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="shipping">
                    <AccordionTrigger className="text-base font-medium">
                      Shipping
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2 text-sm text-muted-foreground">
                        <p>Free shipping on orders over $150.</p>
                        <p>Standard delivery: 5-7 business days.</p>
                        <p>Express delivery: 2-3 business days.</p>
                        <p>
                          International shipping available to select
                          destinations.
                        </p>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="care">
                    <AccordionTrigger className="text-base font-medium">
                      Care
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2 text-sm text-muted-foreground">
                        <p>Handle with care as you would any treasured artifact.</p>
                        <p>Store in a cool, dry place away from direct sunlight.</p>
                        <p>Follow specific care instructions included with your piece.</p>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
