# LOCRA - Luxury Travel Club Storefront

A production-ready headless Shopify storefront built with Next.js 16, TypeScript, Tailwind CSS, and shadcn/ui. Features a "portal arch" luxury museum aesthetic for the LOCRA Travel Club brand.

## Features

- **Next.js 16 App Router** - Latest React Server Components architecture
- **TypeScript** - Full type safety throughout
- **Tailwind CSS** - Utility-first styling with custom design system
- **shadcn/ui** - Accessible, customizable component library
- **Shopify Storefront API** - GraphQL-powered product data
- **Cart Functionality** - Persistent cart with localStorage
- **Responsive Design** - Mobile-first, accessible
- **SEO Ready** - Metadata, OpenGraph, JSON-LD ready

## Project Structure

```
├── app/                      # Next.js App Router pages
│   ├── destinations/         # Collection pages by handle
│   │   └── [handle]/
│   ├── products/             # Product detail pages
│   │   └── [handle]/
│   ├── globals.css           # Global styles & design tokens
│   ├── layout.tsx            # Root layout with providers
│   └── page.tsx              # Home page
├── components/
│   ├── cart/                 # Cart drawer & provider
│   ├── layout/               # TopNav, Footer
│   ├── portal/               # Portal menu & arch components
│   ├── product/              # Product cards & buttons
│   └── ui/                   # shadcn/ui components
├── lib/
│   ├── shopify/              # Shopify API client & queries
│   ├── env.ts                # Zod-validated environment
│   └── utils.ts              # Utility functions
└── public/                   # Static assets
```

## Quick Start

### Prerequisites

- Node.js 18+ or 20+
- pnpm (recommended) or npm
- Shopify store with Storefront API access

### 1. Clone & Install

```bash
git clone https://github.com/creamytech/locra.git
cd locra
pnpm install
```

### 2. Configure Environment

Copy the example environment file:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your Shopify credentials:

```env
NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN=your-storefront-token
NEXT_PUBLIC_SHOPIFY_API_VERSION=2024-01
```

### 3. Get Shopify Credentials

1. Go to your Shopify Admin
2. Navigate to **Apps** > **Develop apps** (or create a private app)
3. Create a new app or use existing headless commerce app
4. Under **API credentials**, find the **Storefront API access token**
5. Ensure the token has these permissions:
   - `unauthenticated_read_product_listings`
   - `unauthenticated_read_product_inventory`
   - `unauthenticated_write_checkouts`
   - `unauthenticated_read_checkouts`

### 4. Run Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000)

## Scripts

| Command      | Description                             |
| ------------ | --------------------------------------- |
| `pnpm dev`   | Start development server with Turbopack |
| `pnpm build` | Build for production                    |
| `pnpm start` | Start production server                 |
| `pnpm lint`  | Run ESLint                              |

## Environment Variables

| Variable                                      | Required | Description                                             |
| --------------------------------------------- | -------- | ------------------------------------------------------- |
| `NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN`            | Yes      | Your Shopify store domain (e.g., `store.myshopify.com`) |
| `NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN` | Yes      | Storefront API access token                             |
| `NEXT_PUBLIC_SHOPIFY_API_VERSION`             | No       | API version (default: `2024-01`)                        |

## Shopify Setup

### Collections

Create these collections in Shopify Admin for optimal experience:

- `featured` - Products shown on homepage
- `santorini` - Santorini destination products
- `amalfi` - Amalfi destination products
- `kyoto` - Kyoto destination products

### Product Tags

Use these tags for special styling:

- `edition` - Shows "Edition" badge on product cards

## Design System

The LOCRA design system features:

- **Colors**: Warm stone palette with gold accents
- **Typography**: Playfair Display (serif) + Inter (sans)
- **Components**: Museum-inspired minimal aesthetic
- **Portal Arch**: Distinctive rounded arch shape throughout

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import to Vercel
3. Add environment variables
4. Deploy

### Other Platforms

Build the production bundle:

```bash
pnpm build
pnpm start
```

## Architecture Notes

- **Server Components**: All data fetching happens server-side
- **Client Components**: Only cart and interactive elements
- **Caching**: Products/collections cached, cart mutations uncached
- **Error Handling**: Graceful fallbacks for missing data

## License

MIT
