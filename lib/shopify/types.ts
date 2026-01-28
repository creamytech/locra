/**
 * Shopify Storefront API Types
 * Clean, app-friendly interfaces derived from GraphQL responses
 */

// ============================================================================
// Core Product Types
// ============================================================================

export interface ProductImage {
  id: string;
  url: string;
  altText: string | null;
  width: number;
  height: number;
}

export interface ProductPrice {
  amount: string;
  currencyCode: string;
}

export interface ProductVariant {
  id: string;
  title: string;
  availableForSale: boolean;
  price: ProductPrice;
  compareAtPrice: ProductPrice | null;
  selectedOptions: {
    name: string;
    value: string;
  }[];
}

export interface Product {
  id: string;
  handle: string;
  title: string;
  description: string;
  descriptionHtml: string;
  featuredImage: ProductImage | null;
  images: ProductImage[];
  priceRange: {
    minVariantPrice: ProductPrice;
    maxVariantPrice: ProductPrice;
  };
  variants: ProductVariant[];
  availableForSale: boolean;
  tags: string[];
  productType: string;
  vendor: string;
  createdAt: string;
  updatedAt: string;
  seo: {
    title: string | null;
    description: string | null;
  };
}

// ============================================================================
// Collection Types
// ============================================================================

export interface Collection {
  id: string;
  handle: string;
  title: string;
  description: string;
  descriptionHtml: string;
  image: ProductImage | null;
  products: Product[];
  seo: {
    title: string | null;
    description: string | null;
  };
}

// ============================================================================
// Cart Types
// ============================================================================

export interface CartLine {
  id: string;
  quantity: number;
  merchandise: {
    id: string;
    title: string;
    selectedOptions: {
      name: string;
      value: string;
    }[];
    product: {
      id: string;
      handle: string;
      title: string;
      featuredImage: ProductImage | null;
    };
    price: ProductPrice;
  };
  cost: {
    totalAmount: ProductPrice;
    amountPerQuantity: ProductPrice;
  };
}

export interface Cart {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  lines: CartLine[];
  cost: {
    subtotalAmount: ProductPrice;
    totalAmount: ProductPrice;
    totalTaxAmount: ProductPrice | null;
  };
  note: string | null;
}

// ============================================================================
// GraphQL Response Types (raw API responses)
// ============================================================================

export interface ShopifyGraphQLResponse<T> {
  data: T;
  errors?: Array<{
    message: string;
    locations?: Array<{
      line: number;
      column: number;
    }>;
    path?: string[];
  }>;
}

// Connection types from Shopify's GraphQL schema
export interface Connection<T> {
  edges: Array<{
    node: T;
    cursor: string;
  }>;
  pageInfo: {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    startCursor: string | null;
    endCursor: string | null;
  };
}

// Raw GraphQL response structures
export interface ShopifyProduct {
  id: string;
  handle: string;
  title: string;
  description: string;
  descriptionHtml: string;
  featuredImage: {
    id: string;
    url: string;
    altText: string | null;
    width: number;
    height: number;
  } | null;
  images: Connection<{
    id: string;
    url: string;
    altText: string | null;
    width: number;
    height: number;
  }>;
  priceRange: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
    maxVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
  variants: Connection<{
    id: string;
    title: string;
    availableForSale: boolean;
    price: {
      amount: string;
      currencyCode: string;
    };
    compareAtPrice: {
      amount: string;
      currencyCode: string;
    } | null;
    selectedOptions: Array<{
      name: string;
      value: string;
    }>;
  }>;
  availableForSale: boolean;
  tags: string[];
  productType: string;
  vendor: string;
  createdAt: string;
  updatedAt: string;
  seo: {
    title: string | null;
    description: string | null;
  };
}

export interface ShopifyCollection {
  id: string;
  handle: string;
  title: string;
  description: string;
  descriptionHtml: string;
  image: {
    id: string;
    url: string;
    altText: string | null;
    width: number;
    height: number;
  } | null;
  products: Connection<ShopifyProduct>;
  seo: {
    title: string | null;
    description: string | null;
  };
}
