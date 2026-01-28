/**
 * Shopify API Functions
 * High-level API functions for fetching products, collections, and managing cart
 */

import { shopifyFetch, shopifyMutate } from "./client";
import {
  GET_COLLECTION_BY_HANDLE,
  GET_FEATURED_COLLECTION,
  GET_PRODUCT_BY_HANDLE,
  GET_PRODUCTS,
  CREATE_CART,
  ADD_TO_CART,
  UPDATE_CART_LINES,
  REMOVE_FROM_CART,
  GET_CART,
} from "./queries";
import { mapProduct, mapCollection, mapCart, extractNodes } from "./mappers";
import type { Product, Collection, Cart, ShopifyProduct } from "./types";

// ============================================================================
// Product Functions
// ============================================================================

export async function getProductByHandle(
  handle: string
): Promise<Product | null> {
  try {
    const data = await shopifyFetch<{ product: ShopifyProduct | null }>({
      query: GET_PRODUCT_BY_HANDLE,
      variables: { handle },
      tags: [`product-${handle}`],
    });

    return mapProduct(data.product);
  } catch (error) {
    console.error(`Failed to fetch product: ${handle}`, error);
    return null;
  }
}

export async function getProducts(
  first: number = 20,
  sortKey: string = "CREATED_AT",
  reverse: boolean = true
): Promise<Product[]> {
  try {
    const data = await shopifyFetch<{
      products: { edges: Array<{ node: ShopifyProduct }> };
    }>({
      query: GET_PRODUCTS,
      variables: { first, sortKey, reverse },
      tags: ["products"],
    });

    return extractNodes(data.products)
      .map(mapProduct)
      .filter((p): p is Product => p !== null);
  } catch (error) {
    console.error("Failed to fetch products", error);
    return [];
  }
}

// ============================================================================
// Collection Functions
// ============================================================================

export async function getCollectionByHandle(
  handle: string,
  first: number = 20
): Promise<Collection | null> {
  try {
    const data = await shopifyFetch<{
      collection: Parameters<typeof mapCollection>[0];
    }>({
      query: GET_COLLECTION_BY_HANDLE,
      variables: { handle, first },
      tags: [`collection-${handle}`],
    });

    return mapCollection(data.collection);
  } catch (error) {
    console.error(`Failed to fetch collection: ${handle}`, error);
    return null;
  }
}

export async function getFeaturedProducts(first: number = 6): Promise<Product[]> {
  try {
    // Try to get the "featured" collection first
    const data = await shopifyFetch<{
      collection: Parameters<typeof mapCollection>[0];
    }>({
      query: GET_FEATURED_COLLECTION,
      tags: ["featured-products"],
    });

    const collection = mapCollection(data.collection);
    if (collection && collection.products.length > 0) {
      return collection.products.slice(0, first);
    }

    // Fallback to latest products
    return getProducts(first);
  } catch {
    // Fallback to latest products if featured collection doesn't exist
    return getProducts(first);
  }
}

// ============================================================================
// Cart Functions
// ============================================================================

export async function createCart(
  lines: Array<{ merchandiseId: string; quantity: number }> = []
): Promise<Cart | null> {
  try {
    const data = await shopifyMutate<{
      cartCreate: {
        cart: Record<string, unknown>;
        userErrors: Array<{ field: string[]; message: string }>;
      };
    }>(CREATE_CART, {
      input: { lines },
    });

    if (data.cartCreate.userErrors.length > 0) {
      console.error("Cart creation errors:", data.cartCreate.userErrors);
      return null;
    }

    return mapCart(data.cartCreate.cart);
  } catch (error) {
    console.error("Failed to create cart", error);
    return null;
  }
}

export async function getCart(cartId: string): Promise<Cart | null> {
  try {
    const data = await shopifyMutate<{ cart: Record<string, unknown> | null }>(
      GET_CART,
      { cartId }
    );

    return mapCart(data.cart);
  } catch (error) {
    console.error("Failed to fetch cart", error);
    return null;
  }
}

export async function addToCart(
  cartId: string,
  lines: Array<{ merchandiseId: string; quantity: number }>
): Promise<Cart | null> {
  try {
    const data = await shopifyMutate<{
      cartLinesAdd: {
        cart: Record<string, unknown>;
        userErrors: Array<{ field: string[]; message: string }>;
      };
    }>(ADD_TO_CART, { cartId, lines });

    if (data.cartLinesAdd.userErrors.length > 0) {
      console.error("Add to cart errors:", data.cartLinesAdd.userErrors);
      return null;
    }

    return mapCart(data.cartLinesAdd.cart);
  } catch (error) {
    console.error("Failed to add to cart", error);
    return null;
  }
}

export async function updateCartLines(
  cartId: string,
  lines: Array<{ id: string; quantity: number }>
): Promise<Cart | null> {
  try {
    const data = await shopifyMutate<{
      cartLinesUpdate: {
        cart: Record<string, unknown>;
        userErrors: Array<{ field: string[]; message: string }>;
      };
    }>(UPDATE_CART_LINES, { cartId, lines });

    if (data.cartLinesUpdate.userErrors.length > 0) {
      console.error("Update cart errors:", data.cartLinesUpdate.userErrors);
      return null;
    }

    return mapCart(data.cartLinesUpdate.cart);
  } catch (error) {
    console.error("Failed to update cart", error);
    return null;
  }
}

export async function removeFromCart(
  cartId: string,
  lineIds: string[]
): Promise<Cart | null> {
  try {
    const data = await shopifyMutate<{
      cartLinesRemove: {
        cart: Record<string, unknown>;
        userErrors: Array<{ field: string[]; message: string }>;
      };
    }>(REMOVE_FROM_CART, { cartId, lineIds });

    if (data.cartLinesRemove.userErrors.length > 0) {
      console.error("Remove from cart errors:", data.cartLinesRemove.userErrors);
      return null;
    }

    return mapCart(data.cartLinesRemove.cart);
  } catch (error) {
    console.error("Failed to remove from cart", error);
    return null;
  }
}
