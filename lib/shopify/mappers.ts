/**
 * Shopify Data Mappers
 * Transform raw GraphQL responses into clean, app-friendly models
 */

import type {
  Product,
  ProductImage,
  ProductVariant,
  Collection,
  Cart,
  CartLine,
  ShopifyProduct,
  ShopifyCollection,
  Connection,
} from "./types";

/**
 * Extract nodes from a Shopify connection/edges structure
 * Accepts both full Connection<T> and simpler { edges: Array<{ node: T }> } types
 */
export function extractNodes<T>(
  connection: { edges: Array<{ node: T }> } | undefined | null
): T[] {
  if (!connection?.edges) return [];
  return connection.edges.map((edge) => edge.node);
}

/**
 * Map raw Shopify product to app-friendly Product type
 */
export function mapProduct(shopifyProduct: ShopifyProduct | null): Product | null {
  if (!shopifyProduct) return null;

  const images: ProductImage[] = extractNodes(shopifyProduct.images).map(
    (img) => ({
      id: img.id,
      url: img.url,
      altText: img.altText,
      width: img.width,
      height: img.height,
    })
  );

  const variants: ProductVariant[] = extractNodes(shopifyProduct.variants).map(
    (variant) => ({
      id: variant.id,
      title: variant.title,
      availableForSale: variant.availableForSale,
      price: {
        amount: variant.price.amount,
        currencyCode: variant.price.currencyCode,
      },
      compareAtPrice: variant.compareAtPrice
        ? {
            amount: variant.compareAtPrice.amount,
            currencyCode: variant.compareAtPrice.currencyCode,
          }
        : null,
      selectedOptions: variant.selectedOptions,
    })
  );

  return {
    id: shopifyProduct.id,
    handle: shopifyProduct.handle,
    title: shopifyProduct.title,
    description: shopifyProduct.description,
    descriptionHtml: shopifyProduct.descriptionHtml,
    featuredImage: shopifyProduct.featuredImage
      ? {
          id: shopifyProduct.featuredImage.id,
          url: shopifyProduct.featuredImage.url,
          altText: shopifyProduct.featuredImage.altText,
          width: shopifyProduct.featuredImage.width,
          height: shopifyProduct.featuredImage.height,
        }
      : null,
    images,
    priceRange: shopifyProduct.priceRange,
    variants,
    availableForSale: shopifyProduct.availableForSale,
    tags: shopifyProduct.tags || [],
    productType: shopifyProduct.productType || "",
    vendor: shopifyProduct.vendor || "",
    createdAt: shopifyProduct.createdAt,
    updatedAt: shopifyProduct.updatedAt,
    seo: shopifyProduct.seo,
  };
}

/**
 * Map raw Shopify collection to app-friendly Collection type
 */
export function mapCollection(
  shopifyCollection: ShopifyCollection | null
): Collection | null {
  if (!shopifyCollection) return null;

  const products: Product[] = extractNodes(shopifyCollection.products)
    .map(mapProduct)
    .filter((p): p is Product => p !== null);

  return {
    id: shopifyCollection.id,
    handle: shopifyCollection.handle,
    title: shopifyCollection.title,
    description: shopifyCollection.description,
    descriptionHtml: shopifyCollection.descriptionHtml,
    image: shopifyCollection.image
      ? {
          id: shopifyCollection.image.id,
          url: shopifyCollection.image.url,
          altText: shopifyCollection.image.altText,
          width: shopifyCollection.image.width,
          height: shopifyCollection.image.height,
        }
      : null,
    products,
    seo: shopifyCollection.seo,
  };
}

/**
 * Map raw cart response to app-friendly Cart type
 */
export function mapCart(shopifyCart: Record<string, unknown> | null): Cart | null {
  if (!shopifyCart) return null;

  const cart = shopifyCart as {
    id: string;
    checkoutUrl: string;
    totalQuantity: number;
    note: string | null;
    cost: {
      subtotalAmount: { amount: string; currencyCode: string };
      totalAmount: { amount: string; currencyCode: string };
      totalTaxAmount: { amount: string; currencyCode: string } | null;
    };
    lines: {
      edges: Array<{
        node: {
          id: string;
          quantity: number;
          cost: {
            totalAmount: { amount: string; currencyCode: string };
            amountPerQuantity: { amount: string; currencyCode: string };
          };
          merchandise: {
            id: string;
            title: string;
            selectedOptions: Array<{ name: string; value: string }>;
            price: { amount: string; currencyCode: string };
            product: {
              id: string;
              handle: string;
              title: string;
              featuredImage: {
                id: string;
                url: string;
                altText: string | null;
                width: number;
                height: number;
              } | null;
            };
          };
        };
      }>;
    };
  };

  const lines: CartLine[] = cart.lines.edges.map((edge) => ({
    id: edge.node.id,
    quantity: edge.node.quantity,
    merchandise: {
      id: edge.node.merchandise.id,
      title: edge.node.merchandise.title,
      selectedOptions: edge.node.merchandise.selectedOptions,
      product: {
        id: edge.node.merchandise.product.id,
        handle: edge.node.merchandise.product.handle,
        title: edge.node.merchandise.product.title,
        featuredImage: edge.node.merchandise.product.featuredImage,
      },
      price: edge.node.merchandise.price,
    },
    cost: {
      totalAmount: edge.node.cost.totalAmount,
      amountPerQuantity: edge.node.cost.amountPerQuantity,
    },
  }));

  return {
    id: cart.id,
    checkoutUrl: cart.checkoutUrl,
    totalQuantity: cart.totalQuantity,
    lines,
    cost: {
      subtotalAmount: cart.cost.subtotalAmount,
      totalAmount: cart.cost.totalAmount,
      totalTaxAmount: cart.cost.totalTaxAmount,
    },
    note: cart.note,
  };
}
