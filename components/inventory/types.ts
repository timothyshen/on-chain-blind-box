// Re-export from the main types file
import type { GachaItem } from "@/types/gacha";
export type { GachaItem } from "@/types/gacha";

export interface GachaItemWithCount extends GachaItem {
  count: number;
}

export type ViewMode = "grid" | "list" | "collection";
export type SortBy = "name" | "collection" | "count" | "recent";

// Enhanced version styles with better gradients
export const VERSION_STYLES = {
  standard: "",
  hidden:
    "bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white border-white/30 shadow-xl",
};

export const COLLECTION_COLORS = {
  toys: "bg-pink-50 border-pink-200 text-pink-700 hover:bg-pink-100",
  magic: "bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100",
  fantasy: "bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100",
  tech: "bg-cyan-50 border-cyan-200 text-cyan-700 hover:bg-cyan-100",
  nature: "bg-green-50 border-green-200 text-green-700 hover:bg-green-100",
  space: "bg-indigo-50 border-indigo-200 text-indigo-700 hover:bg-indigo-100",
};

export const COLLECTION_GLOW = {
  toys: "hover:shadow-pink-200/50",
  magic: "hover:shadow-purple-200/50",
  fantasy: "hover:shadow-amber-200/50",
  tech: "hover:shadow-cyan-200/50",
  nature: "hover:shadow-green-200/50",
  space: "hover:shadow-indigo-200/50",
};

// Collection display names and icons
export const COLLECTION_INFO = {
  toys: {
    name: "Toys Collection",
    icon: "🧸",
    description: "Playful and fun collectibles",
  },
  magic: {
    name: "Magic Collection",
    icon: "🔮",
    description: "Mystical and enchanted items",
  },
  fantasy: {
    name: "Fantasy Collection",
    icon: "👑",
    description: "Legendary fantasy treasures",
  },
  tech: {
    name: "Tech Collection",
    icon: "⚡",
    description: "Futuristic technological wonders",
  },
  nature: {
    name: "Nature Collection",
    icon: "🌿",
    description: "Natural world collectibles",
  },
  space: {
    name: "Space Collection",
    icon: "🚀",
    description: "Rare cosmic discoveries",
  },
};

export const COLLECTION_TOTALS = {
  toys: 3, // Number of unique items in toys collection
  magic: 3,
  fantasy: 4,
  tech: 2,
  nature: 2,
  space: 2,
};

export interface CollectionStats {
  toys: number;
  magic: number;
  fantasy: number;
  tech: number;
  nature: number;
  space: number;
}
