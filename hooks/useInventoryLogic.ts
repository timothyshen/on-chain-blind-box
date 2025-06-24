import { useMemo } from "react";
import { useInventory } from "./useInventory";
import {
  GachaItem,
  GachaItemWithCount,
  CollectionStats,
  COLLECTION_TOTALS,
} from "@/components/inventory/types";
import { useBlindBox } from "./useBlindBox";

export const useInventoryLogic = () => {
  const {
    inventory,
    unrevealedItems,
    removeFromUnrevealed,
    refreshInventory,
    isLoading,
    error,
  } = useInventory();

  const { openBoxes } = useBlindBox();
  // Create a proper grouping that treats each version as a separate item
  const getUniqueItems = useMemo((): GachaItemWithCount[] => {
    const itemMap = new Map<string, GachaItemWithCount>();

    inventory.forEach((item) => {
      // Create a unique key that includes both id and version
      const key = `${item.id}-${item.version}`;

      if (itemMap.has(key)) {
        itemMap.get(key)!.count += 1;
      } else {
        itemMap.set(key, { ...item, count: 1 });
      }
    });

    return Array.from(itemMap.values());
  }, [inventory]);

  // Statistics calculations
  const totalItems = inventory.length;
  const uniqueItems = getUniqueItems.length;
  const hiddenCount = getUniqueItems.filter(
    (item) => item.version === "hidden"
  ).length;

  const collectionStats: CollectionStats = useMemo(
    () => ({
      ippy: getUniqueItems.filter((item) => item.collection === "ippy").length,
    }),
    [getUniqueItems]
  );

  const collectionCompletionPercentage: CollectionStats = useMemo(
    () => ({
      ippy: Math.round((collectionStats.ippy / COLLECTION_TOTALS.ippy) * 100),
    }),
    [collectionStats]
  );

  // Get items for a specific collection
  const getCollectionItems = (collection: string): GachaItemWithCount[] => {
    return getUniqueItems.filter((item) => item.collection === collection);
  };

  // Reveal functions using the hook's removeFromUnrevealed
  const revealItemFromInventory = async (index: number) => {
    if (index >= 0 && index < unrevealedItems.length) {
      try {
        const tx = await openBoxes(1);
        console.log("Box opened:", tx);
        // Refresh inventory to get latest data from contract
        refreshInventory();
      } catch (error) {
        console.error("Error opening box:", error);
      }
    }
  };

  const revealAllFromInventory = async () => {
    if (unrevealedItems.length === 0) return;

    try {
      const tx = await openBoxes(unrevealedItems.length);
      console.log("All boxes opened:", tx);
      // Refresh inventory to get latest data from contract
      refreshInventory();
    } catch (error) {
      console.error("Error opening all boxes:", error);
    }
  };

  // Filter and sort function
  const getFilteredItems = (
    searchTerm: string,
    selectedCollection: string,
    selectedVersion: string,
    sortBy: "name" | "collection" | "count" | "recent"
  ): GachaItemWithCount[] => {
    return getUniqueItems
      .filter((item) => {
        const matchesSearch = item.name
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
        const matchesCollection =
          selectedCollection === "all" ||
          item.collection === selectedCollection;
        const matchesVersion =
          selectedVersion === "all" || item.version === selectedVersion;
        return matchesSearch && matchesCollection && matchesVersion;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case "name":
            return a.name.localeCompare(b.name);
          case "collection":
            return a.collection.localeCompare(b.collection);
          case "count":
            return b.count - a.count;
          case "recent":
          default:
            return 0;
        }
      });
  };

  return {
    // From useInventory hook
    inventory,
    unrevealedItems,
    isLoading,
    error,
    refreshInventory,

    // Statistics
    totalItems,
    uniqueItems,
    hiddenCount,
    collectionStats,
    collectionCompletionPercentage,

    // Helper functions
    getUniqueItems,
    getCollectionItems,
    getFilteredItems,
    revealItemFromInventory,
    revealAllFromInventory,
  };
};
