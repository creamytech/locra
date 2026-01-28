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
  colorPalette?: {
    primary: string;
    secondary: string;
  };
}

export const REGIONS = [
  "Cyclades",
  "Mediterranean",
  "East Asia",
  "North Africa",
  "Highlands",
  "Nordics",
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
    story: "A volcanic majesty where the wind carries the scent of salt and ancient history. Our Santorini artifacts are woven with the lightness of the Cycladic breeze.",
    thumbnailUrl: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&q=80&w=400",
    heroImageUrl: "https://images.unsplash.com/photo-1518173835740-f5d14111d76a?auto=format&fit=crop&q=80&w=1600",
    featuredArtifactHandle: "santorini-linen-crewneck",
  },
  {
    id: "amalfi",
    handle: "amalfi",
    name: "Amalfi Coast",
    region: "Mediterranean",
    coordinates: "40.6340° N, 14.6027° E",
    tagline: "Vertical Stone & Citrus",
    poeticDescription: "Coastal elegance carved into emerald cliffs.",
    story: "Where the mountains dive into the Tyrrhenian sea. The Amalfi collection captures the vibrant sophistication of the Italian summer.",
    thumbnailUrl: "https://images.unsplash.com/photo-1533104816931-20fa691ff6ca?auto=format&fit=crop&q=80&w=400",
    heroImageUrl: "https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?auto=format&fit=crop&q=80&w=1600",
    featuredArtifactHandle: "amalfi-citrus-tote",
  },
  {
    id: "kyoto",
    handle: "kyoto",
    name: "Kyoto",
    region: "East Asia",
    coordinates: "35.0116° N, 135.7681° E",
    tagline: "The Bamboo Path",
    poeticDescription: "Tradition breathing through zen gardens.",
    story: "Centuries of quiet craftsmanship. artifacts from Kyoto reflect the wabi-sabi philosophy—perfection in imperfection.",
    thumbnailUrl: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&q=80&w=400",
    heroImageUrl: "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?auto=format&fit=crop&q=80&w=1600",
    featuredArtifactHandle: "kyoto-indigo-kimono-shirt",
  },
  {
    id: "marrakech",
    handle: "marrakech",
    name: "Marrakech",
    region: "North Africa",
    coordinates: "31.6295° N, 7.9811° W",
    tagline: "Ochre Walls & Shadows",
    poeticDescription: "The rhythmic pulse of the Medina.",
    story: "A sensory immersion in the Red City. Our Marrakech artifacts are inspired by the geometric shadows of the Jardin Majorelle.",
    thumbnailUrl: "https://images.unsplash.com/photo-1597212618440-806262de4fa6?auto=format&fit=crop&q=80&w=400",
    heroImageUrl: "https://images.unsplash.com/photo-1489493585363-d69421e0ede3?auto=format&fit=crop&q=80&w=1600",
    featuredArtifactHandle: "medina-dye-scarf",
  },
];
