export interface Destination {
  id: string;
  handle: string;
  name: string;
  region: string;
  coordinates: string;
  tagline: string;
  poeticDescription: string;
  story: string;
  thumbnailUrl: string; // Portal thumbnail
  heroImageUrl: string; // Cinematic scene
  featuredArtifactHandle: string;
  colorPalette: {
    primary: string;
    secondary: string;
    accent: string;
  };
  // Collection handle in Shopify (may differ from destination handle)
  collectionHandle: string;
}

export const REGIONS = [
  "Cyclades",
  "Mediterranean",
  "East Asia",
  "North Africa",
  "Southwest USA",
  "California Coast",
];

export const DESTINATIONS: Destination[] = [
  {
    id: "santorini",
    handle: "santorini",
    name: "Santorini",
    region: "Cyclades",
    coordinates: "36.3932° N, 25.4615° E",
    tagline: "The Caldera's Silence",
    poeticDescription: "Aegean blues meet sun-bleached stone.",
    story: "A volcanic majesty where the wind carries the scent of salt and ancient history. Our Santorini pieces are woven with the lightness of the Cycladic breeze—linen that flows like the sea, whites as pure as the cliff-side villas.",
    thumbnailUrl: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&q=80&w=400",
    heroImageUrl: "https://images.unsplash.com/photo-1518173835740-f5d14111d76a?auto=format&fit=crop&q=80&w=1600",
    featuredArtifactHandle: "santorini-linen-crewneck",
    colorPalette: {
      primary: "#1e3a5f", // Deep Aegean blue
      secondary: "#f5f5f0", // Whitewash
      accent: "#c4a052", // Gold
    },
    collectionHandle: "santorini",
  },
  {
    id: "amalfi",
    handle: "amalfi",
    name: "Amalfi Coast",
    region: "Mediterranean",
    coordinates: "40.6340° N, 14.6027° E",
    tagline: "Vertical Stone & Citrus",
    poeticDescription: "Coastal elegance carved into emerald cliffs.",
    story: "Where the mountains dive into the Tyrrhenian sea. The Amalfi collection captures the vibrant sophistication of the Italian summer—citrus yellows, coastal blues, and the timeless ease of la dolce vita.",
    thumbnailUrl: "https://images.unsplash.com/photo-1533104816931-20fa691ff6ca?auto=format&fit=crop&q=80&w=400",
    heroImageUrl: "https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?auto=format&fit=crop&q=80&w=1600",
    featuredArtifactHandle: "amalfi-citrus-tote",
    colorPalette: {
      primary: "#2d5a4a", // Mediterranean green
      secondary: "#fef3c7", // Lemon cream
      accent: "#f97316", // Citrus orange
    },
    collectionHandle: "amalfi",
  },
  {
    id: "kyoto",
    handle: "kyoto",
    name: "Kyoto",
    region: "East Asia",
    coordinates: "35.0116° N, 135.7681° E",
    tagline: "The Bamboo Path",
    poeticDescription: "Tradition breathing through zen gardens.",
    story: "Centuries of quiet craftsmanship. Pieces from Kyoto reflect the wabi-sabi philosophy—perfection in imperfection. Natural indigos, organic textures, and the meditative calm of temple gardens.",
    thumbnailUrl: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&q=80&w=400",
    heroImageUrl: "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?auto=format&fit=crop&q=80&w=1600",
    featuredArtifactHandle: "kyoto-indigo-kimono-shirt",
    colorPalette: {
      primary: "#1a1a2e", // Deep indigo
      secondary: "#f5f0e1", // Rice paper
      accent: "#d4a574", // Bamboo gold
    },
    collectionHandle: "kyoto",
  },
  {
    id: "marrakech",
    handle: "marrakech",
    name: "Marrakech",
    region: "North Africa",
    coordinates: "31.6295° N, 7.9811° W",
    tagline: "Ochre Walls & Shadows",
    poeticDescription: "The rhythmic pulse of the Medina.",
    story: "A sensory immersion in the Red City. Our Marrakech pieces are inspired by the geometric shadows of the Jardin Majorelle and the warm terracotta of the ancient walls.",
    thumbnailUrl: "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?auto=format&fit=crop&q=80&w=400",
    heroImageUrl: "https://images.unsplash.com/photo-1489493585363-d69421e0ede3?auto=format&fit=crop&q=80&w=1600",
    featuredArtifactHandle: "medina-dye-scarf",
    colorPalette: {
      primary: "#8b4513", // Terracotta
      secondary: "#fef7ed", // Sand
      accent: "#1e3a5f", // Majorelle blue
    },
    collectionHandle: "marrakech",
  },
  {
    id: "las-vegas",
    handle: "las-vegas",
    name: "Las Vegas",
    region: "Southwest USA",
    coordinates: "36.1699° N, 115.1398° W",
    tagline: "Desert Neon & Starlight",
    poeticDescription: "Where the desert meets endless possibility.",
    story: "The Mojave's heat gives way to neon nights. Our Las Vegas collection captures the duality of the desert—sun-faded pastels by day, electric glamour by night. Statement pieces for those who live boldly.",
    thumbnailUrl: "https://images.unsplash.com/photo-1605833556294-ea5c7a74f57d?auto=format&fit=crop&q=80&w=400",
    heroImageUrl: "https://images.unsplash.com/photo-1581351721010-8cf859cb14a4?auto=format&fit=crop&q=80&w=1600",
    featuredArtifactHandle: "vegas-sunset-tee",
    colorPalette: {
      primary: "#1f1f1f", // Night black
      secondary: "#fbbf24", // Electric gold
      accent: "#ec4899", // Neon pink
    },
    collectionHandle: "las-vegas",
  },
  {
    id: "santa-monica",
    handle: "santa-monica",
    name: "Santa Monica",
    region: "California Coast",
    coordinates: "34.0195° N, 118.4912° W",
    tagline: "Pacific Breeze & Golden Hour",
    poeticDescription: "Endless summer on the California coast.",
    story: "The Pacific whispers of laid-back luxury. Our Santa Monica collection embodies California cool—soft cotton, faded denim, and colors borrowed from sunsets over the pier. Easy wearables for the perpetual weekend.",
    thumbnailUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=400",
    heroImageUrl: "https://images.unsplash.com/photo-1534430480872-3498386e7856?auto=format&fit=crop&q=80&w=1600",
    featuredArtifactHandle: "santa-monica-beach-tee",
    colorPalette: {
      primary: "#0ea5e9", // Pacific blue
      secondary: "#fef3c7", // Sand
      accent: "#f97316", // Sunset orange
    },
    collectionHandle: "santa-monica",
  },
];

// Helper to get destination by handle
export function getDestinationByHandle(handle: string): Destination | undefined {
  return DESTINATIONS.find(d => d.handle === handle || d.collectionHandle === handle);
}

