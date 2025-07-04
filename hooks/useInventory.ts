import { useState, useEffect, useCallback } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { GachaItem } from "@/types/gacha";
import {
  getUserNFTs,
  getUserNFTTypeCounts,
  getUserBlindBoxBalance,
  getContractInfo,
} from "./contractRead";
import { useWalletClient } from "@/lib/contract";
import { blindBoxABI, blindBoxAddress } from "@/lib/contract";

// NFT Type mapping from contracts
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

export interface InventoryData {
  inventory: GachaItem[];
  unrevealedItems: GachaItem[];
  isLoading: boolean;
  error: string | null;
  stats: {
    totalNFTs: number;
    unrevealedBoxes: number;
    hiddenNFTs: number;
    nftTypeCounts: Record<string, number>;
  };
}

export interface ContractInfo {
  boxPrice: bigint;
  totalSupply: bigint;
  currentSupply: bigint;
  remainingBoxes: bigint;
}

export const useInventory = () => {
  const { user } = usePrivy();
  const { getWalletClient } = useWalletClient();
  const address = user?.wallet?.address as `0x${string}` | undefined;

  // State management
  const [inventory, setInventory] = useState<GachaItem[]>([]);
  const [unrevealedItems, setUnrevealedItems] = useState<GachaItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [contractInfo, setContractInfo] = useState<ContractInfo | null>(null);
  const [stats, setStats] = useState({
    totalNFTs: 0,
    unrevealedBoxes: 0,
    hiddenNFTs: 0,
    nftTypeCounts: {} as Record<string, number>,
  });

  // Convert contract NFT data to GachaItem format
  const mapContractNFTToGachaItem = useCallback(
    (
      tokenId: number,
      nftType: number,
      tokenURI: string,
      typeName?: string
    ): GachaItem => {
      const typeInfo =
        NFT_TYPE_MAPPING[nftType as keyof typeof NFT_TYPE_MAPPING];
      const isHidden = nftType === 0;

      return {
        id: `nft-${tokenId}`,
        name: typeInfo?.name || typeName || `IPPY #${tokenId}`,
        description: typeInfo?.description || `IPPY NFT Token #${tokenId}`,
        emoji: typeInfo?.emoji || "🎁",
        collection: "ippy" as const,
        version: isHidden ? "hidden" : "standard",
        // Additional metadata from contract
        tokenId,
        nftType,
        tokenURI,
      } as GachaItem & { tokenId: number; nftType: number; tokenURI: string };
    },
    []
  );

  // Create unrevealed box items
  const createUnrevealedItems = useCallback((count: number): GachaItem[] => {
    return Array.from({ length: count }, (_, index) => ({
      id: `unrevealed-${index}`,
      name: "IPPY Mystery Box",
      description:
        "Unopened blind box containing a mystery IPPY NFT. Open to reveal your prize!",
      emoji: "📦",
      collection: "ippy" as const,
      version: "standard" as const,
    }));
  }, []);

  // Fetch all inventory data from contracts
  const fetchInventory = useCallback(async () => {
    if (!address) {
      setInventory([]);
      setUnrevealedItems([]);
      setStats({
        totalNFTs: 0,
        unrevealedBoxes: 0,
        hiddenNFTs: 0,
        nftTypeCounts: {},
      });
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Fetch all contract data in parallel
      const [nftsResult, blindBoxBalance, nftTypeCounts, contractInfoResult] =
        await Promise.all([
          getUserNFTs(address),
          getUserBlindBoxBalance(address),
          getUserNFTTypeCounts(address),
          getContractInfo(),
        ]);
      console.log(nftsResult);

      // Process NFT data
      const [tokenIds, nftTypes, tokenURIs, typeNames] = nftsResult as [
        bigint[],
        bigint[],
        string[],
        string[]
      ];

      // Convert to GachaItems
      const contractInventory: GachaItem[] = tokenIds.map((tokenId, index) =>
        mapContractNFTToGachaItem(
          Number(tokenId),
          Number(nftTypes[index]),
          tokenURIs[index],
          typeNames[index]
        )
      );

      // Process type counts
      const [types, counts, typeNamesFromCounts] = nftTypeCounts as [
        bigint[],
        bigint[],
        string[]
      ];

      const nftTypeCountsObj: Record<string, number> = {};
      let hiddenCount = 0;

      types.forEach((type, index) => {
        const typeName = typeNamesFromCounts[index];
        const count = Number(counts[index]);
        nftTypeCountsObj[typeName] = count;

        if (Number(type) === 0) {
          // Hidden NFT type
          hiddenCount = count;
        }
      });

      // Create unrevealed items
      const unrevealedCount = Number(blindBoxBalance);
      const unrevealed = createUnrevealedItems(unrevealedCount);

      // Update contract info
      const [price, totalSupply, currentSupply, remainingBoxes] =
        contractInfoResult as [bigint, bigint, bigint, bigint];

      setContractInfo({
        boxPrice: price,
        totalSupply,
        currentSupply,
        remainingBoxes,
      });

      // Update state
      setInventory(contractInventory);
      setUnrevealedItems(unrevealed);
      setStats({
        totalNFTs: contractInventory.length,
        unrevealedBoxes: unrevealedCount,
        hiddenNFTs: hiddenCount,
        nftTypeCounts: nftTypeCountsObj,
      });
    } catch (err) {
      console.error("Error fetching inventory:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load inventory from contract"
      );
    } finally {
      setIsLoading(false);
    }
  }, [address, mapContractNFTToGachaItem, createUnrevealedItems]);

  // Fetch data when address changes
  useEffect(() => {
    fetchInventory();
  }, [fetchInventory]);

  const addToUnrevealed = useCallback(
    (item: GachaItem) => {
      // This should now happen through contract transactions
      fetchInventory();
    },
    [fetchInventory]
  );

  const removeFromUnrevealed = useCallback(
    (item: GachaItem) => {
      // This should now happen through contract transactions
      fetchInventory();
    },
    [fetchInventory]
  );

  return {
    // Core inventory data
    inventory,
    unrevealedItems,
    isLoading,
    error,
    stats,
    contractInfo,

    // Actions
    refreshInventory: fetchInventory,

    // Legacy compatibility
    addToUnrevealed,
    removeFromUnrevealed,

    // Utility functions
    mapContractNFTToGachaItem,
    createUnrevealedItems,
  };
};
