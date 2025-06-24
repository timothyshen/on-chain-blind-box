import { useState, useEffect } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { GachaItem, GACHA_ITEMS } from "@/types/gacha";
import {
  getUserNFTs,
  getUserNFTTypeCounts,
  getUserBlindBoxBalance,
  getUserOwnsHiddenNFT,
} from "./contractRead";

export const useInventory = () => {
  const { user } = usePrivy();
  const address = user?.wallet?.address as `0x${string}` | undefined;
  const [inventory, setInventory] = useState<GachaItem[]>([]);
  const [unrevealedItems, setUnrevealedItems] = useState<GachaItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Map contract NFT types to our GachaItem format
  const mapContractNFTToGachaItem = (
    nftType: number,
    tokenId: number
  ): GachaItem => {
    // All NFTs belong to the single "IPPY NFT" collection
    // NFT type 0 = hidden version, types 1-6 = standard versions
    const isHidden = nftType === 0;

    // Create NFT names based on type
    const nftNames = {
      0: "Hidden IPPY",
      1: "Classic IPPY",
      2: "Rare IPPY",
      3: "Epic IPPY",
      4: "Legendary IPPY",
      5: "Mythic IPPY",
      6: "Divine IPPY",
    };

    const nftEmojis = {
      0: "✨",
      1: "🐣",
      2: "🌟",
      3: "🏆",
      4: "👑",
      5: "🔥",
      6: "⭐",
    };

    return {
      id: `ippy-${tokenId}`,
      name: nftNames[nftType as keyof typeof nftNames] || `IPPY #${tokenId}`,
      description: `IPPY NFT Token #${tokenId} - ${
        isHidden ? "Hidden" : "Standard"
      } Version`,
      emoji: nftEmojis[nftType as keyof typeof nftEmojis] || "🎁",
      collection: "ippy", // Single collection for all IPPYs
      version: isHidden ? "hidden" : "standard",
    } as GachaItem;
  };

  // Fetch inventory from contract
  const fetchInventory = async () => {
    if (!address) {
      setInventory([]);
      setUnrevealedItems([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Get user's NFTs and blind box balance
      const [nftsResult, blindBoxBalance] = await Promise.all([
        getUserNFTs(address),
        getUserBlindBoxBalance(address),
      ]);

      const [tokenIds, nftTypes, tokenURIs] = nftsResult as [
        bigint[],
        bigint[],
        string[]
      ];

      // Convert contract NFTs to GachaItems
      const contractInventory: GachaItem[] = tokenIds.map((tokenId, index) =>
        mapContractNFTToGachaItem(Number(nftTypes[index]), Number(tokenId))
      );

      // Create unrevealed items based on blind box balance
      const unrevealed: GachaItem[] = [];
      const unrevealedCount = Number(blindBoxBalance);

      for (let i = 0; i < unrevealedCount; i++) {
        unrevealed.push({
          id: `unrevealed-${i}`,
          name: "Mystery Box",
          description: "Unopened blind box - reveal to see contents!",
          emoji: "📦",
          collection: "ippy", // IPPY collection
          version: "standard",
        } as GachaItem);
      }

      setInventory(contractInventory);
      setUnrevealedItems(unrevealed);
    } catch (err) {
      console.error("Error fetching inventory:", err);
      setError("Failed to load inventory from contract");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch data when address changes
  useEffect(() => {
    fetchInventory();
  }, [address]);

  // Refresh function for external calls
  const refreshInventory = () => {
    fetchInventory();
  };

  // These functions are kept for compatibility but now trigger contract updates
  const addToInventory = (item: GachaItem) => {
    // This would typically happen through contract transactions
    // For now, just refresh the inventory
    refreshInventory();
  };

  const addToUnrevealed = (item: GachaItem) => {
    // This would typically happen through contract transactions
    refreshInventory();
  };

  const removeFromUnrevealed = (item: GachaItem) => {
    // This would typically happen through contract transactions
    refreshInventory();
  };

  return {
    inventory,
    unrevealedItems,
    isLoading,
    error,
    refreshInventory,
    addToInventory,
    addToUnrevealed,
    removeFromUnrevealed,
  };
};
