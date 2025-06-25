export interface GachaItem {
  id: string;
  name: string;
  collection:"ippy";
  emoji: string;
  description: string;
  version: "standard" | "hidden";
}

export const GACHA_ITEMS: GachaItem[] = [
  // Toys Collection
  {
    id: "1",
    name: "Rubber Duck",
    collection: "ippy",
    emoji: "🦆",
    description: "A squeaky companion",
    version: "standard",
  },
  {
    id: "1h",
    name: "Rubber Duck",
    collection: "ippy",
    emoji: "🦆",
    description: "A squeaky companion",
    version: "hidden",
  },
  {
    id: "2",
    name: "Teddy Bear",
    collection: "ippy",
    emoji: "🧸",
    description: "Soft and cuddly",
    version: "standard",
  }
];

export const VERSION_CHANCES = {
  standard: 0.8,
  hidden: 0.2,
};

export const COLLECTION_CHANCES = {
  ippy: 1,
};

export const COLLECTION_COLORS = {
  ippy: "bg-blue-50 border-blue-200 text-blue-700",
};

export const VERSION_STYLES = {
  standard: "",
  hidden:
    "bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white border-white/30 shadow-lg",
};
