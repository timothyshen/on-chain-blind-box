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
  const { inventory, unrevealedItems, removeFromUnrevealed } = useInventory();

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
      toys: getUniqueItems.filter((item) => item.collection === "toys").length,
      magic: getUniqueItems.filter((item) => item.collection === "magic")
        .length,
      fantasy: getUniqueItems.filter((item) => item.collection === "fantasy")
        .length,
      tech: getUniqueItems.filter((item) => item.collection === "tech").length,
      nature: getUniqueItems.filter((item) => item.collection === "nature")
        .length,
      space: getUniqueItems.filter((item) => item.collection === "space")
        .length,
    }),
    [getUniqueItems]
  );

  const collectionCompletionPercentage: CollectionStats = useMemo(
    () => ({
      toys: Math.round(
        (collectionStats.toys / (COLLECTION_TOTALS.toys * 2)) * 100
      ),
      magic: Math.round(
        (collectionStats.magic / (COLLECTION_TOTALS.magic * 2)) * 100
      ),
      fantasy: Math.round(
        (collectionStats.fantasy / (COLLECTION_TOTALS.fantasy * 2)) * 100
      ),
      tech: Math.round(
        (collectionStats.tech / (COLLECTION_TOTALS.tech * 2)) * 100
      ),
      nature: Math.round(
        (collectionStats.nature / (COLLECTION_TOTALS.nature * 2)) * 100
      ),
      space: Math.round(
        (collectionStats.space / (COLLECTION_TOTALS.space * 2)) * 100
      ),
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
      const itemToRemove = unrevealedItems[index];
      const tx = await openBoxes(1);
      console.log(tx);
      removeFromUnrevealed(itemToRemove);
    }
  };

  const revealAllFromInventory = () => {
    // Remove all unrevealed items
    unrevealedItems.forEach((item) => removeFromUnrevealed(item));
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
