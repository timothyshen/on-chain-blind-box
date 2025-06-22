import { useState, useEffect, useRef } from "react";
import {
  GachaItem,
  GACHA_ITEMS,
  COLLECTION_CHANCES,
  VERSION_CHANCES,
} from "@/types/gacha";
import { useSound } from "./useSound";
import { useInventory } from "./useInventory";
import { useBlindBox } from "./useBlindBox";
import { useNotifications } from "@/contexts/notification-context";

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
    addToInventory,
    unrevealedItems,
    addToUnrevealed,
    removeFromUnrevealed,
  } = useInventory();
  const { purchaseBoxes, openBoxes } = useBlindBox();
  const { addNotification } = useNotifications();
  const [coins, setCoins] = useState(10);
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
  const [collectionParticleType, setCollectionParticleType] = useState<
    "toys" | "magic" | "fantasy" | "tech" | "nature" | "space"
  >("toys");

  const getRandomItem = (): GachaItem => {
    const random = Math.random();
    let cumulativeChance = 0;
    let selectedCollection:
      | "toys"
      | "magic"
      | "fantasy"
      | "tech"
      | "nature"
      | "space" = "toys";

    for (const [collection, chance] of Object.entries(COLLECTION_CHANCES)) {
      cumulativeChance += chance;
      if (random <= cumulativeChance) {
        selectedCollection = collection as
          | "toys"
          | "magic"
          | "fantasy"
          | "tech"
          | "nature"
          | "space";
        break;
      }
    }

    const versionRandom = Math.random();
    let versionCumulativeChance = 0;
    let selectedVersion: "standard" | "hidden" = "standard";
    for (const [version, chance] of Object.entries(VERSION_CHANCES)) {
      versionCumulativeChance += chance;
      if (versionRandom <= versionCumulativeChance) {
        selectedVersion = version as "standard" | "hidden";
        break;
      }
    }

    const matchingItems = GACHA_ITEMS.filter(
      (item) =>
        item.collection === selectedCollection &&
        item.version === selectedVersion
    );

    if (matchingItems.length === 0) {
      const fallbackItems = GACHA_ITEMS.filter(
        (item) => item.collection === selectedCollection
      );
      return fallbackItems[Math.floor(Math.random() * fallbackItems.length)];
    }

    return matchingItems[Math.floor(Math.random() * matchingItems.length)];
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
    setShowBlindBoxModal(true);

    // try {
    //   const tx = await purchaseBoxes(1);
    //   console.log("tx", tx);
    // } catch (error) {
    //   console.error("Error purchasing boxes:", error);
    // } finally {
    //   setIsSpinning(false);

    //   const result = getRandomItem();
    //   console.log("result", result);
    //   console.log("inventory", inventory);
    //   const existingItem = inventory.find(
    //     (item) => item.id === result.id && item.version === result.version
    //   );
    //   setIsNewItem(!existingItem);
    //   addToInventory(result);
    //   addToUnrevealed(result);
    //   setCurrentBlindBox(result);

    //   setCollectionParticleType(result.collection);
    //   setShowRarityParticles(true);

    //   setEntranceItem(result);
    //   setShowItemEntrance(true);

    //   if (result.collection === "space") {
    //     setShowCelebration(true);
    //     setShowScreenShake(true);

    //     setTimeout(() => setShowCelebration(false), 4000);
    //     setTimeout(() => setShowScreenShake(false), 2000);
    //   }

    //   setTimeout(() => {
    //     setShowBlindBoxModal(true);
    //     setIsSpinning(false);
    //     setShowRarityParticles(false);
    //   }, 2500);
    // }
  };

  const revealBlindBox = () => {
    playBoxOpen();
    openBoxes(1);
    setIsItemRevealed(true);

    if (currentBlindBox) {
      playItemReveal(currentBlindBox.collection);
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
