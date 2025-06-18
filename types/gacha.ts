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
  {
    id: "2",
    name: "Teddy Bear",
    collection: "toys",
    emoji: "🧸",
    description: "Soft and cuddly",
    version: "standard",
  },
  {
    id: "2h",
    name: "Teddy Bear",
    collection: "toys",
    emoji: "🧸",
    description: "Soft and cuddly",
    version: "hidden",
  },
  {
    id: "3",
    name: "Toy Robot",
    collection: "toys",
    emoji: "🤖",
    description: "Beeps and boops",
    version: "standard",
  },
  {
    id: "3h",
    name: "Toy Robot",
    collection: "toys",
    emoji: "🤖",
    description: "Beeps and boops",
    version: "hidden",
  },

  // Magic Collection
  {
    id: "4",
    name: "Magic Wand",
    collection: "magic",
    emoji: "🪄",
    description: "Sparkles with mystery",
    version: "standard",
  },
  {
    id: "4h",
    name: "Magic Wand",
    collection: "magic",
    emoji: "🪄",
    description: "Sparkles with mystery",
    version: "hidden",
  },
  {
    id: "5",
    name: "Crystal Ball",
    collection: "magic",
    emoji: "🔮",
    description: "Sees the future",
    version: "standard",
  },
  {
    id: "5h",
    name: "Crystal Ball",
    collection: "magic",
    emoji: "🔮",
    description: "Sees the future",
    version: "hidden",
  },
  {
    id: "6",
    name: "Spell Book",
    collection: "magic",
    emoji: "📚",
    description: "Ancient knowledge",
    version: "standard",
  },
  {
    id: "6h",
    name: "Spell Book",
    collection: "magic",
    emoji: "📚",
    description: "Ancient knowledge",
    version: "hidden",
  },

  // Fantasy Collection
  {
    id: "7",
    name: "Golden Crown",
    collection: "fantasy",
    emoji: "👑",
    description: "Fit for royalty",
    version: "standard",
  },
  {
    id: "7h",
    name: "Golden Crown",
    collection: "fantasy",
    emoji: "👑",
    description: "Fit for royalty",
    version: "hidden",
  },
  {
    id: "8",
    name: "Dragon Egg",
    collection: "fantasy",
    emoji: "🥚",
    description: "Ancient and powerful",
    version: "standard",
  },
  {
    id: "8h",
    name: "Dragon Egg",
    collection: "fantasy",
    emoji: "🥚",
    description: "Ancient and powerful",
    version: "hidden",
  },
  {
    id: "9",
    name: "Phoenix Feather",
    collection: "fantasy",
    emoji: "🪶",
    description: "Burns with eternal flame",
    version: "standard",
  },
  {
    id: "9h",
    name: "Phoenix Feather",
    collection: "fantasy",
    emoji: "🪶",
    description: "Burns with eternal flame",
    version: "hidden",
  },
  {
    id: "10",
    name: "Unicorn Horn",
    collection: "fantasy",
    emoji: "🦄",
    description: "Pure magic essence",
    version: "standard",
  },
  {
    id: "10h",
    name: "Unicorn Horn",
    collection: "fantasy",
    emoji: "🦄",
    description: "Pure magic essence",
    version: "hidden",
  },

  // Tech Collection
  {
    id: "11",
    name: "Laser Sword",
    collection: "tech",
    emoji: "⚡",
    description: "Futuristic weapon",
    version: "standard",
  },
  {
    id: "11h",
    name: "Laser Sword",
    collection: "tech",
    emoji: "⚡",
    description: "Futuristic weapon",
    version: "hidden",
  },
  {
    id: "12",
    name: "Hologram",
    collection: "tech",
    emoji: "🌐",
    description: "3D projection",
    version: "standard",
  },
  {
    id: "12h",
    name: "Hologram",
    collection: "tech",
    emoji: "🌐",
    description: "3D projection",
    version: "hidden",
  },

  // Nature Collection
  {
    id: "13",
    name: "Sacred Tree",
    collection: "nature",
    emoji: "🌳",
    description: "Ancient wisdom",
    version: "standard",
  },
  {
    id: "13h",
    name: "Sacred Tree",
    collection: "nature",
    emoji: "🌳",
    description: "Ancient wisdom",
    version: "hidden",
  },
  {
    id: "14",
    name: "Rainbow Flower",
    collection: "nature",
    emoji: "🌺",
    description: "Blooms in all colors",
    version: "standard",
  },
  {
    id: "14h",
    name: "Rainbow Flower",
    collection: "nature",
    emoji: "🌺",
    description: "Blooms in all colors",
    version: "hidden",
  },

  // Space Collection
  {
    id: "15",
    name: "Shooting Star",
    collection: "space",
    emoji: "⭐",
    description: "Make a wish",
    version: "standard",
  },
  {
    id: "15h",
    name: "Shooting Star",
    collection: "space",
    emoji: "⭐",
    description: "Make a wish",
    version: "hidden",
  },
  {
    id: "16",
    name: "Moon Crystal",
    collection: "space",
    emoji: "🌙",
    description: "Lunar energy",
    version: "standard",
  },
  {
    id: "16h",
    name: "Moon Crystal",
    collection: "space",
    emoji: "🌙",
    description: "Lunar energy",
    version: "hidden",
  },
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
