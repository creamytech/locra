import { env, SHOPIFY_GRAPHQL_API_ENDPOINT } from "@/lib/env";
import type { ShopifyGraphQLResponse } from "./types";

export interface ShopifyFetchOptions {
  query: string;
  variables?: Record<string, unknown>;
  cache?: RequestCache;
  tags?: string[];
}

/**
 * Core Shopify Storefront API client
 * Handles all GraphQL requests with proper headers and error handling
 */
export async function shopifyFetch<T>({
  query,
  variables = {},
  cache = "force-cache",
  tags = [],
}: ShopifyFetchOptions): Promise<T> {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    "X-Shopify-Storefront-Access-Token":
      env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN,
  };

  try {
    const response = await fetch(SHOPIFY_GRAPHQL_API_ENDPOINT, {
      method: "POST",
      headers,
      body: JSON.stringify({ query, variables }),
      cache,
      ...(tags.length > 0 && { next: { tags } }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Shopify API error: ${response.status} ${response.statusText}\n${errorText}`
      );
    }

    const json: ShopifyGraphQLResponse<T> = await response.json();

    if (json.errors) {
      const errorMessages = json.errors.map((e) => e.message).join(", ");
      if (process.env.NODE_ENV === "development") {
        console.error("GraphQL Errors:", json.errors);
      }
      throw new Error(`GraphQL Error: ${errorMessages}`);
    }

    return json.data;
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Shopify Fetch Error:", error);
    }
    throw error;
  }
}

/**
 * Non-cached fetch for cart mutations
 */
export async function shopifyMutate<T>(
  query: string,
  variables?: Record<string, unknown>
): Promise<T> {
  return shopifyFetch<T>({
    query,
    variables,
    cache: "no-store",
  });
}
