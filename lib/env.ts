import { z } from "zod";

/**
 * Environment variable schema with Zod validation
 * Validates all required Shopify Storefront API credentials
 */
const envSchema = z.object({
  NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN: z
    .string()
    .min(1, "Shopify store domain is required")
    .regex(
      /^[a-zA-Z0-9-]+\.myshopify\.com$/,
      "Invalid Shopify store domain format. Expected: your-store.myshopify.com"
    ),
  NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN: z
    .string()
    .min(1, "Shopify Storefront Access Token is required"),
  NEXT_PUBLIC_SHOPIFY_API_VERSION: z
    .string()
    .default("2024-01")
    .refine(
      (val) => /^\d{4}-\d{2}$/.test(val),
      "API version should be in format YYYY-MM"
    ),
});

export type Env = z.infer<typeof envSchema>;

/**
 * Validated environment variables
 * Throws detailed error if validation fails
 */
function getEnv(): Env {
  const parsed = envSchema.safeParse({
    NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN:
      process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN,
    NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN:
      process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN,
    NEXT_PUBLIC_SHOPIFY_API_VERSION:
      process.env.NEXT_PUBLIC_SHOPIFY_API_VERSION || "2024-01",
  });

  if (!parsed.success) {
    if (process.env.NODE_ENV === "development") {
      console.error("❌ Invalid environment variables:");
      parsed.error.issues.forEach((issue) => {
        console.error(`  - ${issue.path.join(".")}: ${issue.message}`);
      });
      // In development, return a placeholder instead of crashing the entire build process
      // This helps developers see the UI even if the API isn't ready
      return {
        NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN: "example.myshopify.com",
        NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN: "placeholder",
        NEXT_PUBLIC_SHOPIFY_API_VERSION: "2024-01",
      } as Env;
    }
    throw new Error("Invalid environment variables. Check console for details.");
  }

  return parsed.data;
}

export const env = getEnv();

/**
 * Shopify Storefront API endpoint
 */
export const SHOPIFY_GRAPHQL_API_ENDPOINT = `https://${env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN}/api/${env.NEXT_PUBLIC_SHOPIFY_API_VERSION}/graphql.json`;
