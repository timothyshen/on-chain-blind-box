import { useState, useEffect } from "react";
import { GachaItem } from "@/types/gacha";

export const useInventory = () => {
  const [inventory, setInventory] = useState<GachaItem[]>([]);
  const [unrevealedItems, setUnrevealedItems] = useState<GachaItem[]>([]);

  useEffect(() => {
    const savedInventory = localStorage.getItem("gacha-inventory");
    if (savedInventory) setInventory(JSON.parse(savedInventory));
    const savedUnrevealed = localStorage.getItem("gacha-unrevealed");
    if (savedUnrevealed) setUnrevealedItems(JSON.parse(savedUnrevealed));
  }, []);

  useEffect(() => {
    localStorage.setItem("gacha-inventory", JSON.stringify(inventory));
    localStorage.setItem("gacha-unrevealed", JSON.stringify(unrevealedItems));
  }, [inventory, unrevealedItems]);

  const addToInventory = (item: GachaItem) => {
    setInventory((prev) => [...prev, item]);
  };

  const addToUnrevealed = (item: GachaItem) => {
    setUnrevealedItems((prev) => [...prev, item]);
  };

  const removeFromUnrevealed = (item: GachaItem) => {
    setUnrevealedItems((prev) => {
      const indexToRemove = prev.findIndex(
        (i) =>
          i.id === item.id &&
          i.name === item.name &&
          i.collection === item.collection &&
          i.version === item.version
      );
      if (indexToRemove > -1) {
        const newUnrevealed = [...prev];
        newUnrevealed.splice(indexToRemove, 1);
        return newUnrevealed;
      }
      return prev;
    });
  };

  return {
    inventory,
    unrevealedItems,
    addToInventory,
    addToUnrevealed,
    removeFromUnrevealed,
  };
};
