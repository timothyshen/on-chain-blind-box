import { NFTMetadata, BlindBoxMetadata } from "@/lib/metadata";

export interface GachaItem {
  id: string;
  name: string;
  collection: "ippy";
  emoji: string;
  description: string;
  version: "standard" | "hidden";

  // Enhanced metadata fields
  tokenId?: number;
  nftType?: number;
  tokenURI?: string;

  // Rich metadata from contracts/IPFS
  metadata?: NFTMetadata | BlindBoxMetadata;
  metadataLoading?: boolean;
  metadataError?: string;

  // Enhanced display data
  image?: string; // Direct image URL for display
  attributes?: Array<{
    trait_type: string;
    value: string | number;
  }>;
  rarity?: string;
  theme?: string;
  background_color?: string;
}

// Enhanced version with metadata support
export interface GachaItemWithMetadata extends GachaItem {
  metadata: NFTMetadata | BlindBoxMetadata;
  image: string; // Required when metadata is loaded
}

// For blind box items that haven't been opened yet
export interface BlindBoxItem extends GachaItem {
  isBlindBox: true;
  metadata?: BlindBoxMetadata;
  svg?: string; // Embedded SVG for display
}


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

// Enhanced metadata-based styling
export const getItemDisplayStyle = (item: GachaItem): string => {
  if (item.metadata?.background_color) {
    return `border-[#${item.metadata.background_color}] bg-[#${item.metadata.background_color}]/10`;
  }

  if (item.rarity === "hidden" || item.version === "hidden") {
    return VERSION_STYLES.hidden;
  }

  return COLLECTION_COLORS[item.collection] || "";
};

// Get display image with fallback
export const getItemDisplayImage = (item: GachaItem): string | null => {
  // Priority: metadata image > image field > null
  if (item.metadata?.image) {
    return item.metadata.image;
  }
  if (item.image) {
    return item.image;
  }
  return null;
};

// Get display name with fallback
export const getItemDisplayName = (item: GachaItem): string => {
  return item.metadata?.name || item.name;
};

// Get display description with fallback
export const getItemDisplayDescription = (item: GachaItem): string => {
  return item.metadata?.description || item.description;
};

// Check if item has rich metadata
export const hasRichMetadata = (
  item: GachaItem
): item is GachaItemWithMetadata => {
  return !!(item.metadata && !item.metadataLoading && !item.metadataError);
};

// Check if item is a blind box
export const isBlindBoxItem = (item: GachaItem): item is BlindBoxItem => {
  return !!(item as BlindBoxItem).isBlindBox;
};

// Get rarity display info
export const getRarityInfo = (item: GachaItem) => {
  const rarity = item.metadata?.rarity || item.rarity || item.version;

  const rarityConfig = {
    hidden: {
      label: "Hidden",
      color: "from-purple-500 to-pink-500",
      textColor: "text-purple-700",
      bgColor: "bg-purple-100",
    },
    legendary: {
      label: "Legendary",
      color: "from-yellow-400 to-orange-500",
      textColor: "text-orange-700",
      bgColor: "bg-orange-100",
    },
    epic: {
      label: "Epic",
      color: "from-purple-400 to-indigo-500",
      textColor: "text-indigo-700",
      bgColor: "bg-indigo-100",
    },
    rare: {
      label: "Rare",
      color: "from-blue-400 to-cyan-500",
      textColor: "text-blue-700",
      bgColor: "bg-blue-100",
    },
    standard: {
      label: "Standard",
      color: "from-gray-400 to-gray-500",
      textColor: "text-gray-700",
      bgColor: "bg-gray-100",
    },
  };

  return (
    rarityConfig[rarity as keyof typeof rarityConfig] || rarityConfig.standard
  );
};

// Helper to extract theme from metadata or NFT type
export const getItemTheme = (item: GachaItem): string => {
  if (item.metadata?.theme) return item.metadata.theme;
  if (item.theme) return item.theme;

  // Derive from NFT type
  if (item.nftType !== undefined) {
    const themes = {
      0: "Hidden",
      1: "Nature",
      2: "Tech",
      3: "Art",
      4: "Music",
      5: "Sports",
      6: "Gaming",
    };
    return themes[item.nftType as keyof typeof themes] || "Unknown";
  }

  return "Unknown";
};
