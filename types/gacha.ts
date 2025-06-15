export interface GachaItem {
  id: string;
  name: string;
  collection: "toys" | "magic" | "fantasy" | "tech" | "nature" | "space";
  emoji: string;
  description: string;
  version: "standard" | "hidden";
}

export const GACHA_ITEMS: GachaItem[] = [
  // Toys Collection
  {
    id: "1",
    name: "Rubber Duck",
    collection: "toys",
    emoji: "🦆",
    description: "A squeaky companion",
    version: "standard",
  },
  {
    id: "1h",
    name: "Rubber Duck",
    collection: "toys",
    emoji: "🦆",
    description: "A squeaky companion",
    version: "hidden",
  },
  // ... Add all other items here
];

export const VERSION_CHANCES = {
  standard: 0.8,
  hidden: 0.2,
};

export const COLLECTION_CHANCES = {
  toys: 0.25,
  magic: 0.2,
  fantasy: 0.2,
  tech: 0.15,
  nature: 0.15,
  space: 0.05,
};

export const COLLECTION_COLORS = {
  toys: "bg-pink-50 border-pink-200 text-pink-700",
  magic: "bg-purple-50 border-purple-200 text-purple-700",
  fantasy: "bg-amber-50 border-amber-200 text-amber-700",
  tech: "bg-cyan-50 border-cyan-200 text-cyan-700",
  nature: "bg-green-50 border-green-200 text-green-700",
  space: "bg-indigo-50 border-indigo-200 text-indigo-700",
};

export const VERSION_STYLES = {
  standard: "",
  hidden:
    "bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white border-white/30 shadow-lg",
};
