export const NFT_TYPE_MAPPING = {
  0: {
    name: "BLIPPY",
    emoji: "✨",
    rarity: "hidden",
    description: "Ultra rare hidden IPPY NFT",
  },
  1: {
    name: "IPPY",
    emoji: "🐣",
    rarity: "standard",
    description: "Classic IPPY NFT",
  },
  2: {
    name: "BIPPY",
    emoji: "🌟",
    rarity: "standard",
    description: "Tech-themed IPPY NFT",
  },
  3: {
    name: "THIPPY",
    emoji: "🎨",
    rarity: "standard",
    description: "Art-themed IPPY NFT",
  },
  4: {
    name: "STIPPY",
    emoji: "🎵",
    rarity: "standard",
    description: "Music-themed IPPY NFT",
  },
  5: {
    name: "RAIPPY",
    emoji: "⚽",
    rarity: "standard",
    description: "Sports-themed IPPY NFT",
  },
  6: {
    name: "MIPPY",
    emoji: "🎮",
    rarity: "standard",
    description: "Gaming-themed IPPY NFT",
  },
} as const;

export interface ContractInfo {
  boxPrice: bigint;
  totalSupply: bigint;
  currentSupply: bigint;
  remainingBoxes: bigint;
}
