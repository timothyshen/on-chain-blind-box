import { useState, useEffect } from "react";
import {
  ACHIEVEMENTS,
  checkAchievements,
  getGameStats,
  type Achievement,
} from "@/utils/achievements";
import { GachaItem } from "@/types/gacha";
import { useNotifications } from "@/contexts/notification-context";

export const useAchievements = () => {
  const { addNotification } = useNotifications();
  const [achievements, setAchievements] = useState<Achievement[]>(ACHIEVEMENTS);
  const [totalPulls, setTotalPulls] = useState(0);
  const [totalCoinsEarned, setTotalCoinsEarned] = useState(0);
  const [themesUsed, setThemesUsed] = useState<string[]>(["classicRed"]);
  const [boxesOpened, setBoxesOpened] = useState(0);
  const [consecutiveCommon, setConsecutiveCommon] = useState(0);
  const [maxConsecutiveRare, setMaxConsecutiveRare] = useState(0);
  const [currentConsecutiveRare, setCurrentConsecutiveRare] = useState(0);
  const [showAchievementModal, setShowAchievementModal] = useState(false);
  const [currentAchievement, setCurrentAchievement] =
    useState<Achievement | null>(null);

  useEffect(() => {
    const savedAchievements = localStorage.getItem("gacha-achievements");
    if (savedAchievements) setAchievements(JSON.parse(savedAchievements));
    const savedTotalPulls = localStorage.getItem("gacha-total-pulls");
    if (savedTotalPulls) setTotalPulls(Number.parseInt(savedTotalPulls));
    const savedTotalCoins = localStorage.getItem("gacha-total-coins");
    if (savedTotalCoins) setTotalCoinsEarned(Number.parseInt(savedTotalCoins));
    const savedThemesUsed = localStorage.getItem("gacha-themes-used");
    if (savedThemesUsed) setThemesUsed(JSON.parse(savedThemesUsed));
    const savedBoxesOpened = localStorage.getItem("gacha-boxes-opened");
    if (savedBoxesOpened) setBoxesOpened(Number.parseInt(savedBoxesOpened));
  }, []);

  useEffect(() => {
    localStorage.setItem("gacha-achievements", JSON.stringify(achievements));
    localStorage.setItem("gacha-total-pulls", totalPulls.toString());
    localStorage.setItem("gacha-total-coins", totalCoinsEarned.toString());
    localStorage.setItem("gacha-themes-used", JSON.stringify(themesUsed));
    localStorage.setItem("gacha-boxes-opened", boxesOpened.toString());
  }, [achievements, totalPulls, totalCoinsEarned, themesUsed, boxesOpened]);

  const checkForAchievements = (
    inventory: GachaItem[],
    newThemesUsed: string[],
    newBoxesOpened: number,
    newConsecutiveCommon: number,
    newMaxConsecutiveRare: number
  ) => {
    const stats = getGameStats(
      inventory,
      totalPulls,
      totalCoinsEarned,
      0,
      newThemesUsed,
      newBoxesOpened,
      newConsecutiveCommon,
      newMaxConsecutiveRare
    );

    const newAchievements = checkAchievements(stats, achievements);

    if (newAchievements.length > 0) {
      setAchievements((prev) =>
        prev.map((achievement) => {
          const updated = newAchievements.find(
            (newAch) => newAch.id === achievement.id
          );
          return updated || achievement;
        })
      );

      newAchievements.forEach((achievement, index) => {
        setTimeout(() => {
          setCurrentAchievement(achievement);
          setShowAchievementModal(true);

          addNotification({
            type: "achievement",
            title: achievement.title,
            message: achievement.description,
            icon: achievement.icon,
            duration: 6000,
          });
        }, index * 1000);
      });
    }
  };

  const updateStats = (
    newTotalPulls: number,
    newTotalCoins: number,
    newThemesUsed: string[],
    newBoxesOpened: number,
    newConsecutiveCommon: number,
    newMaxConsecutiveRare: number
  ) => {
    setTotalPulls(newTotalPulls);
    setTotalCoinsEarned(newTotalCoins);
    setThemesUsed(newThemesUsed);
    setBoxesOpened(newBoxesOpened);
    setConsecutiveCommon(newConsecutiveCommon);
    setMaxConsecutiveRare(newMaxConsecutiveRare);
  };

  return {
    achievements,
    totalPulls,
    totalCoinsEarned,
    themesUsed,
    boxesOpened,
    consecutiveCommon,
    maxConsecutiveRare,
    currentConsecutiveRare,
    showAchievementModal,
    currentAchievement,
    addNotification,
    checkForAchievements,
    updateStats,
    setShowAchievementModal,
    setCurrentAchievement,
    setCurrentConsecutiveRare,
  };
};
