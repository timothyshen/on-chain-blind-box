import { useState, useEffect, useRef } from "react";
import { GachaItem } from "@/types/gacha";
import { useSound } from "./useSound";
import { useInventory } from "./useInventory";
import { useBlindBox } from "./useBlindBox";
import { useNotifications } from "@/contexts/notification-context";
import { usePrivy } from "@privy-io/react-auth";
import { getUserBlindBoxBalance } from "./contractRead";

export const useGachaMachine = () => {
  const {
    playLeverPull,
    playBoxOpen,
    playItemReveal,
    playCoinInsert,
    playButtonClick,
  } = useSound();
  const {
    inventory,
    unrevealedItems,
    addToUnrevealed,
    removeFromUnrevealed,
    refreshInventory,
  } = useInventory();
  const { purchaseBoxes, openBoxes } = useBlindBox();
  const { addNotification } = useNotifications();
  const { user } = usePrivy();
  const [coins, setCoins] = useState(10);

  // Add fetchContractBalance function
  const fetchContractBalance = async () => {
    if (!user?.wallet?.address) return;
    try {
      const balance = await getUserBlindBoxBalance(
        user.wallet.address as `0x${string}`
      );
      console.log("Contract balance:", Number(balance));
    } catch (error) {
      console.error("Error fetching contract balance:", error);
    }
  };

  const [isSpinning, setIsSpinning] = useState(false);
  const [leverPulled, setLeverPulled] = useState(false);
  const [currentResults, setCurrentResults] = useState<GachaItem[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [showBlindBoxModal, setShowBlindBoxModal] = useState(false);
  const [currentBlindBox, setCurrentBlindBox] = useState<GachaItem | null>(
    null
  );

  const [isNewItem, setIsNewItem] = useState(false);
  const [isItemRevealed, setIsItemRevealed] = useState(false);
  const [blinkingCell, setBlinkingCell] = useState<number | null>(null);
  const animationIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [animationPhase, setAnimationPhase] = useState<
    "fast" | "slowing" | "landing" | "none"
  >("none");
  const [animationTimeoutId, setAnimationTimeoutId] =
    useState<NodeJS.Timeout | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const [showScreenShake, setShowScreenShake] = useState(false);
  const [showCoinAnimation, setShowCoinAnimation] = useState(false);
  const [showItemEntrance, setShowItemEntrance] = useState(false);
  const [entranceItem, setEntranceItem] = useState<GachaItem | null>(null);
  const [showRarityParticles, setShowRarityParticles] = useState(false);
  const [collectionParticleType, setCollectionParticleType] =
    useState<"ippy">("ippy");

  // Contract handles randomness - this is just a placeholder for the UI
  const getPlaceholderItem = (): GachaItem => {
    return {
      id: "placeholder",
      name: "IPPY NFT",
      description: "IPPY NFT from contract",
      emoji: "🎁",
      collection: "ippy",
      version: "standard",
    };
  };

  const pullGacha = async () => {
    if (coins < 1 || isSpinning || showBlindBoxModal) return;

    playLeverPull();
    setShowCoinAnimation(true);
    setCoins((prev) => prev - 1);
    setIsSpinning(true);
    setLeverPulled(true);
    setShowResults(false);
    setCurrentResults([]);
    setAnimationPhase("fast");
    setShowCelebration(false);
    setShowScreenShake(false);
    setIsItemRevealed(false);
    setShowRarityParticles(false);

    await new Promise((resolve) => setTimeout(resolve, 500));
    setLeverPulled(false);

    if (animationIntervalRef.current)
      clearInterval(animationIntervalRef.current);
    if (animationTimeoutId) clearTimeout(animationTimeoutId);

    startBlinkingAnimation();

    addNotification({
      type: "success",
      title: "Starting Gacha!",
      message: `Pulling a box...`,
      icon: "🎰",
      duration: 4000,
    });
  };

  const startBlinkingAnimation = () => {
    const fastPhaseDuration = 1000;
    const slowingPhaseDuration = 1000;
    const landingPhaseDuration = 500;
    const initialBlinkInterval = 80;
    const maxBlinkInterval = 300;

    const startTime = Date.now();
    let currentInterval = initialBlinkInterval;

    const scheduleNextBlink = () => {
      const elapsedTime = Date.now() - startTime;
      const totalAnimationTime =
        fastPhaseDuration + slowingPhaseDuration + landingPhaseDuration;

      if (elapsedTime < fastPhaseDuration) {
        setAnimationPhase("fast");
        setBlinkingCell(Math.floor(Math.random() * 9));
        currentInterval = initialBlinkInterval;
      } else if (elapsedTime < fastPhaseDuration + slowingPhaseDuration) {
        if (animationPhase !== "slowing") {
          setAnimationPhase("slowing");
        }

        setBlinkingCell(Math.floor(Math.random() * 9));
        const slowingProgress =
          (elapsedTime - fastPhaseDuration) / slowingPhaseDuration;
        currentInterval =
          initialBlinkInterval +
          (maxBlinkInterval - initialBlinkInterval) * slowingProgress;
      } else if (elapsedTime < totalAnimationTime) {
        if (animationPhase !== "landing") {
          setAnimationPhase("landing");
        }

        const remainingTime = totalAnimationTime - elapsedTime;
        const remainingBlinks = Math.max(
          1,
          Math.floor(remainingTime / maxBlinkInterval)
        );

        if (remainingBlinks <= 1) {
          setBlinkingCell(4);
        } else {
          const possibleCells = [0, 1, 2, 3, 4, 5, 6, 7, 8];
          const landingProgress =
            (elapsedTime - fastPhaseDuration - slowingPhaseDuration) /
            landingPhaseDuration;

          if (landingProgress > 0.5) {
            const adjacentCells = [1, 3, 4, 5, 7];
            setBlinkingCell(
              adjacentCells[Math.floor(Math.random() * adjacentCells.length)]
            );
          } else {
            setBlinkingCell(
              possibleCells[Math.floor(Math.random() * possibleCells.length)]
            );
          }
        }

        currentInterval = maxBlinkInterval;
      } else {
        finishAnimation();
        return;
      }

      const timeoutId = setTimeout(scheduleNextBlink, currentInterval);
      setAnimationTimeoutId(timeoutId);
    };

    scheduleNextBlink();
  };

  const finishAnimation = async () => {
    setAnimationPhase("none");
    setBlinkingCell(null);
    try {
      const tx = await purchaseBoxes(1);
      console.log("Purchased box:", tx);

      // Refresh balances after purchase
      fetchContractBalance();
      refreshInventory();
    } catch (error) {
      console.error("Error purchasing boxes:", error);
    } finally {
      setIsSpinning(false);

      // Use placeholder item for UI - actual item comes from contract
      const result = getPlaceholderItem();
      console.log("Using placeholder for UI:", result);

      const existingItem = inventory.find(
        (item) => item.id === result.id && item.version === result.version
      );
      setIsNewItem(!existingItem);

      // Since we're using contract data, these functions now trigger refreshes
      addToUnrevealed(result);
      setCurrentBlindBox(result);

      setCollectionParticleType(result.collection);
      setShowRarityParticles(true);
      setEntranceItem(result);
      setShowItemEntrance(true);

      // No collection-specific celebration since we only have IPPY
      setShowCelebration(true);
      setShowScreenShake(true);
      setTimeout(() => setShowCelebration(false), 4000);
      setTimeout(() => setShowScreenShake(false), 2000);

      setShowBlindBoxModal(true);
      setIsSpinning(false);
      setShowRarityParticles(false);
    }
  };

  const revealBlindBox = async () => {
    playBoxOpen();
    try {
      const tx = await openBoxes(1);
      console.log("Opened box:", tx);

      // Refresh balances after opening
      fetchContractBalance();
      refreshInventory();

      setIsItemRevealed(true);

      if (currentBlindBox) {
        playItemReveal("ippy");
      }
    } catch (error) {
      console.error("Error opening box:", error);
    }
  };

  const closeModalAndReset = () => {
    playButtonClick();
    setShowResults(false);
    setCurrentResults([]);
    setShowBlindBoxModal(false);
    setCurrentBlindBox(null);
    setIsItemRevealed(false);
    setIsSpinning(false);
  };

  const revealAllItems = () => {
    if (unrevealedItems.length === 0) return;

    playButtonClick();
    setCurrentResults((prev) =>
      [...unrevealedItems.reverse(), ...prev].slice(0, 9)
    );
    unrevealedItems.forEach((item) => {
      removeFromUnrevealed(item);
    });
    setShowResults(true);
  };

  const addCoin = () => {
    playCoinInsert();
    setShowCoinAnimation(true);
    setCoins((prev) => prev + 5);

    addNotification({
      type: "success",
      title: "Free Coins!",
      message: "Added 5 coins to your balance",
      icon: "🪙",
      duration: 3000,
    });
  };

  return {
    // State
    coins,
    isSpinning,
    leverPulled,
    currentResults,
    showResults,
    showBlindBoxModal,
    currentBlindBox,
    isNewItem,
    isItemRevealed,
    blinkingCell,
    animationPhase,
    showCelebration,
    showScreenShake,
    showCoinAnimation,
    showItemEntrance,
    entranceItem,
    showRarityParticles,
    collectionParticleType,
    inventory,
    unrevealedItems,

    // Actions
    pullGacha,
    revealBlindBox,
    closeModalAndReset,
    revealAllItems,
    addCoin,
  };
};
