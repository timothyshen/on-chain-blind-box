"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Coins, Package, Store, Sparkles, Zap, Palette, Share, Crown } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { soundManager } from "@/utils/sounds"
import { SoundToggle } from "@/components/sound-toggle"
import { shareToTwitter } from "@/utils/twitter-share"
import { NotificationProvider, useNotifications } from "@/contexts/notification-context"
import { NotificationContainer, AchievementNotification } from "@/components/notification-system"
import { ACHIEVEMENTS, checkAchievements, getGameStats, type Achievement } from "@/utils/achievements"
import {
  RarityParticles,
  MachineIdleEffects,
  CoinAnimation,
  ItemEntranceEffect,
} from "@/components/enhanced-animations"
import { PremiumStoreButton } from "@/components/premium-store-button"

export interface GachaItem {
  id: string
  name: string
  collection: "toys" | "magic" | "fantasy" | "tech" | "nature" | "space"
  emoji: string
  description: string
  version: "standard" | "hidden"
}

const GACHA_ITEMS: GachaItem[] = [
  // Toys Collection
  {
    id: "1",
    name: "Rubber Duck",
    collection: "toys",
    emoji: "🦆",
    description: "A squeaky companion",
    version: "standard",
  },
  {
    id: "1h",
    name: "Rubber Duck",
    collection: "toys",
    emoji: "🦆",
    description: "A squeaky companion",
    version: "hidden",
  },
  {
    id: "2",
    name: "Teddy Bear",
    collection: "toys",
    emoji: "🧸",
    description: "Soft and cuddly",
    version: "standard",
  },
  {
    id: "2h",
    name: "Teddy Bear",
    collection: "toys",
    emoji: "🧸",
    description: "Soft and cuddly",
    version: "hidden",
  },
  {
    id: "3",
    name: "Toy Robot",
    collection: "toys",
    emoji: "🤖",
    description: "Beeps and boops",
    version: "standard",
  },
  {
    id: "3h",
    name: "Toy Robot",
    collection: "toys",
    emoji: "🤖",
    description: "Beeps and boops",
    version: "hidden",
  },

  // Magic Collection
  {
    id: "4",
    name: "Magic Wand",
    collection: "magic",
    emoji: "🪄",
    description: "Sparkles with mystery",
    version: "standard",
  },
  {
    id: "4h",
    name: "Magic Wand",
    collection: "magic",
    emoji: "🪄",
    description: "Sparkles with mystery",
    version: "hidden",
  },
  {
    id: "5",
    name: "Crystal Ball",
    collection: "magic",
    emoji: "🔮",
    description: "Sees the future",
    version: "standard",
  },
  {
    id: "5h",
    name: "Crystal Ball",
    collection: "magic",
    emoji: "🔮",
    description: "Sees the future",
    version: "hidden",
  },
  {
    id: "6",
    name: "Spell Book",
    collection: "magic",
    emoji: "📚",
    description: "Ancient knowledge",
    version: "standard",
  },
  {
    id: "6h",
    name: "Spell Book",
    collection: "magic",
    emoji: "📚",
    description: "Ancient knowledge",
    version: "hidden",
  },

  // Fantasy Collection
  {
    id: "7",
    name: "Golden Crown",
    collection: "fantasy",
    emoji: "👑",
    description: "Fit for royalty",
    version: "standard",
  },
  {
    id: "7h",
    name: "Golden Crown",
    collection: "fantasy",
    emoji: "👑",
    description: "Fit for royalty",
    version: "hidden",
  },
  {
    id: "8",
    name: "Dragon Egg",
    collection: "fantasy",
    emoji: "🥚",
    description: "Ancient and powerful",
    version: "standard",
  },
  {
    id: "8h",
    name: "Dragon Egg",
    collection: "fantasy",
    emoji: "🥚",
    description: "Ancient and powerful",
    version: "hidden",
  },
  {
    id: "9",
    name: "Phoenix Feather",
    collection: "fantasy",
    emoji: "🪶",
    description: "Burns with eternal flame",
    version: "standard",
  },
  {
    id: "9h",
    name: "Phoenix Feather",
    collection: "fantasy",
    emoji: "🪶",
    description: "Burns with eternal flame",
    version: "hidden",
  },
  {
    id: "10",
    name: "Unicorn Horn",
    collection: "fantasy",
    emoji: "🦄",
    description: "Pure magic essence",
    version: "standard",
  },
  {
    id: "10h",
    name: "Unicorn Horn",
    collection: "fantasy",
    emoji: "🦄",
    description: "Pure magic essence",
    version: "hidden",
  },

  // Tech Collection
  {
    id: "11",
    name: "Laser Sword",
    collection: "tech",
    emoji: "⚡",
    description: "Futuristic weapon",
    version: "standard",
  },
  {
    id: "11h",
    name: "Laser Sword",
    collection: "tech",
    emoji: "⚡",
    description: "Futuristic weapon",
    version: "hidden",
  },
  {
    id: "12",
    name: "Hologram",
    collection: "tech",
    emoji: "🌐",
    description: "3D projection",
    version: "standard",
  },
  {
    id: "12h",
    name: "Hologram",
    collection: "tech",
    emoji: "🌐",
    description: "3D projection",
    version: "hidden",
  },

  // Nature Collection
  {
    id: "13",
    name: "Sacred Tree",
    collection: "nature",
    emoji: "🌳",
    description: "Ancient wisdom",
    version: "standard",
  },
  {
    id: "13h",
    name: "Sacred Tree",
    collection: "nature",
    emoji: "🌳",
    description: "Ancient wisdom",
    version: "hidden",
  },
  {
    id: "14",
    name: "Rainbow Flower",
    collection: "nature",
    emoji: "🌺",
    description: "Blooms in all colors",
    version: "standard",
  },
  {
    id: "14h",
    name: "Rainbow Flower",
    collection: "nature",
    emoji: "🌺",
    description: "Blooms in all colors",
    version: "hidden",
  },

  // Space Collection
  {
    id: "15",
    name: "Shooting Star",
    collection: "space",
    emoji: "⭐",
    description: "Make a wish",
    version: "standard",
  },
  {
    id: "15h",
    name: "Shooting Star",
    collection: "space",
    emoji: "⭐",
    description: "Make a wish",
    version: "hidden",
  },
  {
    id: "16",
    name: "Moon Crystal",
    collection: "space",
    emoji: "🌙",
    description: "Lunar energy",
    version: "standard",
  },
  {
    id: "16h",
    name: "Moon Crystal",
    collection: "space",
    emoji: "🌙",
    description: "Lunar energy",
    version: "hidden",
  },
]

const VERSION_CHANCES = {
  standard: 0.8,
  hidden: 0.2,
}

const COLLECTION_COLORS = {
  toys: "bg-pink-50 border-pink-200 text-pink-700",
  magic: "bg-purple-50 border-purple-200 text-purple-700",
  fantasy: "bg-amber-50 border-amber-200 text-amber-700",
  tech: "bg-cyan-50 border-cyan-200 text-cyan-700",
  nature: "bg-green-50 border-green-200 text-green-700",
  space: "bg-indigo-50 border-indigo-200 text-indigo-700",
}

const VERSION_STYLES = {
  standard: "",
  hidden: "bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white border-white/30 shadow-lg",
}

const COLLECTION_CHANCES = {
  toys: 0.25,
  magic: 0.2,
  fantasy: 0.2,
  tech: 0.15,
  nature: 0.15,
  space: 0.05,
}

interface Theme {
  id: string
  name: string
  machineBg: string
  machineBorder: string
  topBezelBg: string
  topBezelText: string
  topBezelBorder: string
  displayWindowBg: string
  coinSlotBg: string
  coinSlotText: string
  leverArmBg: string
  leverArmBorder: string
  leverHandleBg: string
  leverHandleBorder: string
  leverHandleIconColor: string
  pageBg: string
  controlPanelBg: string
  controlPanelBorder: string
  controlPanelText: string
  modalBg: string
  modalBorder: string
  isDark: boolean
  blinkingCellBg?: string
  blinkingCellRing?: string
  blinkingCellIconColor?: string
  accent: string
}

const themes: Theme[] = [
  {
    id: "classicRed",
    name: "Classic",
    machineBg: "bg-gradient-to-b from-red-500 via-red-600 to-red-700",
    machineBorder: "border-amber-300",
    topBezelBg: "bg-gradient-to-b from-red-400 to-red-600",
    topBezelText: "text-amber-100",
    topBezelBorder: "border-b border-amber-400/50",
    displayWindowBg: "bg-black/40 backdrop-blur-sm",
    coinSlotBg: "bg-black/20 backdrop-blur-sm",
    coinSlotText: "text-amber-200",
    leverArmBg: "bg-gradient-to-b from-slate-300 to-slate-500",
    leverArmBorder: "border-slate-200",
    leverHandleBg: "bg-gradient-to-b from-red-400 to-red-600",
    leverHandleBorder: "border-red-300",
    leverHandleIconColor: "text-amber-200",
    pageBg: "bg-gradient-to-br from-slate-900 via-red-950 to-slate-900",
    controlPanelBg: "bg-slate-800/80 backdrop-blur-md",
    controlPanelBorder: "border-slate-700/50",
    controlPanelText: "text-slate-100",
    modalBg: "bg-slate-800/95 backdrop-blur-md",
    modalBorder: "border-slate-700",
    isDark: true,
    blinkingCellBg: "bg-amber-400/60",
    blinkingCellRing: "ring-amber-400",
    blinkingCellIconColor: "text-amber-100",
    accent: "amber",
  },
  {
    id: "cyberpunkNeon",
    name: "Neon",
    machineBg: "bg-gradient-to-b from-purple-600 via-indigo-700 to-slate-900",
    machineBorder: "border-pink-400",
    topBezelBg: "bg-gradient-to-b from-slate-900 to-indigo-800",
    topBezelText: "text-cyan-300",
    topBezelBorder: "border-b border-pink-500/50",
    displayWindowBg: "bg-black/50 backdrop-blur-sm",
    coinSlotBg: "bg-black/30 backdrop-blur-sm",
    coinSlotText: "text-pink-300",
    leverArmBg: "bg-gradient-to-b from-slate-600 to-slate-800",
    leverArmBorder: "border-cyan-400",
    leverHandleBg: "bg-gradient-to-b from-pink-500 to-pink-700",
    leverHandleBorder: "border-pink-400",
    leverHandleIconColor: "text-cyan-200",
    pageBg: "bg-gradient-to-br from-black via-indigo-950 to-purple-950",
    controlPanelBg: "bg-black/80 backdrop-blur-md",
    controlPanelBorder: "border-pink-500/30",
    controlPanelText: "text-slate-100",
    modalBg: "bg-black/95 backdrop-blur-md",
    modalBorder: "border-pink-500",
    isDark: true,
    blinkingCellBg: "bg-pink-500/60",
    blinkingCellRing: "ring-pink-500",
    blinkingCellIconColor: "text-pink-200",
    accent: "pink",
  },
  {
    id: "pastelDream",
    name: "Pastel",
    machineBg: "bg-gradient-to-b from-pink-200 via-purple-200 to-blue-200",
    machineBorder: "border-white/80",
    topBezelBg: "bg-gradient-to-b from-pink-100 to-purple-100",
    topBezelText: "text-purple-700",
    topBezelBorder: "border-b border-white/60",
    displayWindowBg: "bg-white/40 backdrop-blur-sm",
    coinSlotBg: "bg-white/50 backdrop-blur-sm",
    coinSlotText: "text-purple-600",
    leverArmBg: "bg-gradient-to-b from-slate-100 to-slate-200",
    leverArmBorder: "border-white",
    leverHandleBg: "bg-gradient-to-b from-yellow-200 to-yellow-300",
    leverHandleBorder: "border-yellow-100",
    leverHandleIconColor: "text-orange-600",
    pageBg: "bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50",
    controlPanelBg: "bg-white/80 backdrop-blur-md",
    controlPanelBorder: "border-purple-200/50",
    controlPanelText: "text-purple-800",
    modalBg: "bg-white/95 backdrop-blur-md",
    modalBorder: "border-purple-200",
    isDark: false,
    blinkingCellBg: "bg-yellow-300/60",
    blinkingCellRing: "ring-yellow-400",
    blinkingCellIconColor: "text-yellow-700",
    accent: "purple",
  },
]

// Enhanced particle component for celebrations
const CelebrationParticles = ({ theme, show }: { theme: Theme; show: boolean }) => {
  if (!show) return null

  const particles = Array.from({ length: 30 }, (_, i) => {
    const particleEmojis = ["✨", "🌟", "💫", "⭐", "🎉", "🎊", "💎", "👑"]
    const emoji = particleEmojis[Math.floor(Math.random() * particleEmojis.length)]
    const delay = Math.random() * 3
    const duration = 4 + Math.random() * 3
    const xOffset = (Math.random() - 0.5) * 600
    const rotation = Math.random() * 360

    return (
      <div
        key={i}
        className="absolute pointer-events-none text-2xl drop-shadow-lg"
        style={{
          left: "50%",
          bottom: "20%",
          transform: `translateX(${xOffset}px) rotate(${rotation}deg)`,
          animation: `float-up-${i} ${duration}s ease-out ${delay}s forwards`,
          filter: "drop-shadow(0 0 8px rgba(255, 215, 0, 0.6))",
        }}
      >
        {emoji}
      </div>
    )
  })

  return (
    <>
      <style jsx>{`
        ${Array.from({ length: 30 }, (_, i) => {
          const yOffset = -300 - Math.random() * 150
          const xDrift = (Math.random() - 0.5) * 200
          return `
            @keyframes float-up-${i} {
              0% {
                opacity: 0;
                transform: translateX(${(Math.random() - 0.5) * 600}px) translateY(0px) rotate(0deg) scale(0.3);
              }
              20% {
                opacity: 1;
                transform: translateX(${(Math.random() - 0.5) * 600 + xDrift * 0.3}px) translateY(${yOffset * 0.2}px) rotate(90deg) scale(1.2);
              }
              80% {
                opacity: 1;
                transform: translateX(${(Math.random() - 0.5) * 600 + xDrift * 0.8}px) translateY(${yOffset * 0.8}px) rotate(270deg) scale(1);
              }
              100% {
                opacity: 0;
                transform: translateX(${(Math.random() - 0.5) * 600 + xDrift}px) translateY(${yOffset}px) rotate(360deg) scale(0.1);
              }
            }
          `
        }).join("")}
      `}</style>
      <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden">{particles}</div>
    </>
  )
}

function GachaMachineContent() {
  const { addNotification } = useNotifications()

  const [coins, setCoins] = useState(10)
  const [isSpinning, setIsSpinning] = useState(false)
  const [leverPulled, setLeverPulled] = useState(false)
  const [currentResults, setCurrentResults] = useState<GachaItem[]>([])
  const [inventory, setInventory] = useState<GachaItem[]>([])
  const [showResults, setShowResults] = useState(false)

  const [showBlindBoxModal, setShowBlindBoxModal] = useState(false)
  const [currentBlindBox, setCurrentBlindBox] = useState<GachaItem | null>(null)
  const [unrevealedItems, setUnrevealedItems] = useState<GachaItem[]>([])
  const [isNewItem, setIsNewItem] = useState(false)
  const [isItemRevealed, setIsItemRevealed] = useState(false)

  const [currentTheme, setCurrentTheme] = useState<Theme>(themes[0])
  const [blinkingCell, setBlinkingCell] = useState<number | null>(null)
  const animationIntervalRef = useRef<NodeJS.Timeout | null>(null)

  const [animationPhase, setAnimationPhase] = useState<"fast" | "slowing" | "landing" | "none">("none")
  const [animationTimeoutId, setAnimationTimeoutId] = useState<NodeJS.Timeout | null>(null)
  const [showCelebration, setShowCelebration] = useState(false)
  const [showScreenShake, setShowScreenShake] = useState(false)

  const [showCoinAnimation, setShowCoinAnimation] = useState(false)
  const [showItemEntrance, setShowItemEntrance] = useState(false)
  const [entranceItem, setEntranceItem] = useState<GachaItem | null>(null)
  const [showRarityParticles, setShowRarityParticles] = useState(false)
  const [collectionParticleType, setCollectionParticleType] = useState<
    "toys" | "magic" | "fantasy" | "tech" | "nature" | "space"
  >("toys")

  // Achievement system state
  const [achievements, setAchievements] = useState<Achievement[]>(ACHIEVEMENTS)
  const [totalPulls, setTotalPulls] = useState(0)
  const [totalCoinsEarned, setTotalCoinsEarned] = useState(0)
  const [themesUsed, setThemesUsed] = useState<string[]>(["classicRed"])
  const [boxesOpened, setBoxesOpened] = useState(0)
  const [consecutiveCommon, setConsecutiveCommon] = useState(0)
  const [maxConsecutiveRare, setMaxConsecutiveRare] = useState(0)
  const [currentConsecutiveRare, setCurrentConsecutiveRare] = useState(0)
  const [showAchievementModal, setShowAchievementModal] = useState(false)
  const [currentAchievement, setCurrentAchievement] = useState<Achievement | null>(null)

  // Initialize sound manager on first render
  useEffect(() => {
    const initializeOnInteraction = () => {
      soundManager.initialize()
      window.removeEventListener("click", initializeOnInteraction)
      window.removeEventListener("touchstart", initializeOnInteraction)
    }

    window.addEventListener("click", initializeOnInteraction)
    window.addEventListener("touchstart", initializeOnInteraction)

    return () => {
      window.removeEventListener("click", initializeOnInteraction)
      window.removeEventListener("touchstart", initializeOnInteraction)
    }
  }, [])

  useEffect(() => {
    const savedThemeId = localStorage.getItem("gacha-theme")
    const savedTheme = themes.find((t) => t.id === savedThemeId)
    if (savedTheme) {
      setCurrentTheme(savedTheme)
    }

    const savedInventory = localStorage.getItem("gacha-inventory")
    if (savedInventory) setInventory(JSON.parse(savedInventory))
    const savedCoins = localStorage.getItem("gacha-coins")
    if (savedCoins) setCoins(Number.parseInt(savedCoins))
    const savedUnrevealed = localStorage.getItem("gacha-unrevealed")
    if (savedUnrevealed) setUnrevealedItems(JSON.parse(savedUnrevealed))

    // Load achievement data
    const savedAchievements = localStorage.getItem("gacha-achievements")
    if (savedAchievements) setAchievements(JSON.parse(savedAchievements))
    const savedTotalPulls = localStorage.getItem("gacha-total-pulls")
    if (savedTotalPulls) setTotalPulls(Number.parseInt(savedTotalPulls))
    const savedTotalCoins = localStorage.getItem("gacha-total-coins")
    if (savedTotalCoins) setTotalCoinsEarned(Number.parseInt(savedTotalCoins))
    const savedThemesUsed = localStorage.getItem("gacha-themes-used")
    if (savedThemesUsed) setThemesUsed(JSON.parse(savedThemesUsed))
    const savedBoxesOpened = localStorage.getItem("gacha-boxes-opened")
    if (savedBoxesOpened) setBoxesOpened(Number.parseInt(savedBoxesOpened))

    return () => {
      if (animationIntervalRef.current) clearInterval(animationIntervalRef.current)
      if (animationTimeoutId) clearTimeout(animationTimeoutId)
      soundManager.stopBlinkSounds()
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("gacha-theme", currentTheme.id)
    localStorage.setItem("gacha-inventory", JSON.stringify(inventory))
    localStorage.setItem("gacha-coins", coins.toString())
    localStorage.setItem("gacha-unrevealed", JSON.stringify(unrevealedItems))
    localStorage.setItem("gacha-achievements", JSON.stringify(achievements))
    localStorage.setItem("gacha-total-pulls", totalPulls.toString())
    localStorage.setItem("gacha-total-coins", totalCoinsEarned.toString())
    localStorage.setItem("gacha-themes-used", JSON.stringify(themesUsed))
    localStorage.setItem("gacha-boxes-opened", boxesOpened.toString())
  }, [
    currentTheme,
    inventory,
    coins,
    unrevealedItems,
    achievements,
    totalPulls,
    totalCoinsEarned,
    themesUsed,
    boxesOpened,
  ])

  // Check for achievements whenever stats change
  useEffect(() => {
    const stats = getGameStats(
      inventory,
      totalPulls,
      totalCoinsEarned,
      0, // pityBreaks removed
      themesUsed,
      boxesOpened,
      consecutiveCommon,
      maxConsecutiveRare,
    )

    const newAchievements = checkAchievements(stats, achievements)

    if (newAchievements.length > 0) {
      setAchievements((prev) =>
        prev.map((achievement) => {
          const updated = newAchievements.find((newAch) => newAch.id === achievement.id)
          return updated || achievement
        }),
      )

      // Show achievement notifications
      newAchievements.forEach((achievement, index) => {
        setTimeout(() => {
          setCurrentAchievement(achievement)
          setShowAchievementModal(true)

          addNotification({
            type: "achievement",
            title: achievement.title,
            message: achievement.description,
            icon: achievement.icon,
            duration: 6000,
          })
        }, index * 1000)
      })
    }
  }, [
    inventory,
    totalPulls,
    totalCoinsEarned,
    themesUsed,
    boxesOpened,
    consecutiveCommon,
    maxConsecutiveRare,
    achievements,
    addNotification,
  ])

  const getRandomItem = (): GachaItem => {
    const random = Math.random()
    let cumulativeChance = 0
    let selectedCollection: "toys" | "magic" | "fantasy" | "tech" | "nature" | "space" = "toys"

    for (const [collection, chance] of Object.entries(COLLECTION_CHANCES)) {
      cumulativeChance += chance
      if (random <= cumulativeChance) {
        selectedCollection = collection as "toys" | "magic" | "fantasy" | "tech" | "nature" | "space"
        break
      }
    }

    const versionRandom = Math.random()
    let versionCumulativeChance = 0
    let selectedVersion: "standard" | "hidden" = "standard"
    for (const [version, chance] of Object.entries(VERSION_CHANCES)) {
      versionCumulativeChance += chance
      if (versionRandom <= versionCumulativeChance) {
        selectedVersion = version as "standard" | "hidden"
        break
      }
    }

    const matchingItems = GACHA_ITEMS.filter(
      (item) => item.collection === selectedCollection && item.version === selectedVersion,
    )

    if (matchingItems.length === 0) {
      const fallbackItems = GACHA_ITEMS.filter((item) => item.collection === selectedCollection)
      return fallbackItems[Math.floor(Math.random() * fallbackItems.length)]
    }

    return matchingItems[Math.floor(Math.random() * matchingItems.length)]
  }

  const pullGacha = async () => {
    if (coins < 1 || isSpinning || showBlindBoxModal) return

    // Play enhanced lever pull sound
    soundManager.playLeverPull()

    // Show coin animation
    setShowCoinAnimation(true)

    setCoins((prev) => prev - 1)
    setTotalPulls((prev) => prev + 1)
    setIsSpinning(true)
    setLeverPulled(true)
    setShowResults(false)
    setCurrentResults([])
    setAnimationPhase("fast")
    setShowCelebration(false)
    setShowScreenShake(false)
    setIsItemRevealed(false)
    setShowRarityParticles(false)

    await new Promise((resolve) => setTimeout(resolve, 500))
    setLeverPulled(false)

    // Clear any existing animation
    if (animationIntervalRef.current) clearInterval(animationIntervalRef.current)
    if (animationTimeoutId) clearTimeout(animationTimeoutId)
    soundManager.stopBlinkSounds()

    // Start the blinking animation sequence
    startBlinkingAnimation()
  }

  // Function to handle the blinking animation with slowing down effect
  const startBlinkingAnimation = () => {
    // Animation configuration
    const fastPhaseDuration = 1000 // Fast blinking phase (ms)
    const slowingPhaseDuration = 1000 // Slowing down phase (ms)
    const landingPhaseDuration = 500 // Final landing phase (ms)
    const initialBlinkInterval = 80 // Initial time between blinks (ms)
    const maxBlinkInterval = 300 // Maximum time between blinks (ms)

    const startTime = Date.now()
    let currentInterval = initialBlinkInterval

    // Start the blinking sounds
    soundManager.startBlinkSounds("fast")

    // Function to schedule the next blink
    const scheduleNextBlink = () => {
      const elapsedTime = Date.now() - startTime
      const totalAnimationTime = fastPhaseDuration + slowingPhaseDuration + landingPhaseDuration

      // Determine which phase we're in
      if (elapsedTime < fastPhaseDuration) {
        // Fast phase - random cells at constant speed
        setAnimationPhase("fast")
        setBlinkingCell(Math.floor(Math.random() * 9))
        currentInterval = initialBlinkInterval

        // Make sure we're playing the right sounds
        if (elapsedTime % 200 === 0) {
          soundManager.stopBlinkSounds()
          soundManager.startBlinkSounds("fast")
        }
      } else if (elapsedTime < fastPhaseDuration + slowingPhaseDuration) {
        // Slowing phase - random cells with increasing intervals
        if (animationPhase !== "slowing") {
          setAnimationPhase("slowing")
          soundManager.stopBlinkSounds()
          soundManager.startBlinkSounds("slowing")
        }

        setBlinkingCell(Math.floor(Math.random() * 9))

        // Calculate how far we are through the slowing phase (0 to 1)
        const slowingProgress = (elapsedTime - fastPhaseDuration) / slowingPhaseDuration
        // Gradually increase the interval
        currentInterval = initialBlinkInterval + (maxBlinkInterval - initialBlinkInterval) * slowingProgress
      } else if (elapsedTime < totalAnimationTime) {
        // Landing phase - move toward center cell
        if (animationPhase !== "landing") {
          setAnimationPhase("landing")
          soundManager.stopBlinkSounds()
          soundManager.startBlinkSounds("landing")
        }

        // Calculate remaining blinks in landing phase
        const remainingTime = totalAnimationTime - elapsedTime
        const remainingBlinks = Math.max(1, Math.floor(remainingTime / maxBlinkInterval))

        if (remainingBlinks <= 1) {
          // Final blink - land on center cell (index 4)
          setBlinkingCell(4)
        } else {
          // Get closer to center with each blink
          const possibleCells = [0, 1, 2, 3, 4, 5, 6, 7, 8]
          // Weight the selection toward the center as we get closer to the end
          const landingProgress = (elapsedTime - fastPhaseDuration - slowingPhaseDuration) / landingPhaseDuration

          if (landingProgress > 0.5) {
            // In the second half of landing, only use cells adjacent to center
            const adjacentCells = [1, 3, 4, 5, 7] // Center and adjacent cells
            setBlinkingCell(adjacentCells[Math.floor(Math.random() * adjacentCells.length)])
          } else {
            // In the first half of landing, use any cell but with higher chance for middle area
            setBlinkingCell(possibleCells[Math.floor(Math.random() * possibleCells.length)])
          }
        }

        // Keep interval at maximum during landing
        currentInterval = maxBlinkInterval
      } else {
        // Animation complete
        finishAnimation()
        return
      }

      // Schedule the next blink
      const timeoutId = setTimeout(scheduleNextBlink, currentInterval)
      setAnimationTimeoutId(timeoutId)
    }

    // Start the animation sequence
    scheduleNextBlink()
  }

  const finishAnimation = () => {
    setAnimationPhase("none")
    setBlinkingCell(null)
    soundManager.stopBlinkSounds()

    // Get the gacha result
    const result = getRandomItem()

    // Update consecutive rare tracking
    if (result.collection === "magic" || result.collection === "fantasy" || result.collection === "space") {
      setCurrentConsecutiveRare((prev) => {
        const newCount = prev + 1
        setMaxConsecutiveRare((current) => Math.max(current, newCount))
        return newCount
      })
      setConsecutiveCommon(0)
    } else {
      setCurrentConsecutiveRare(0)
      setConsecutiveCommon((prev) => prev + 1)
    }

    const existingItem = inventory.find((item) => item.id === result.id && item.version === result.version)
    setIsNewItem(!existingItem)
    setInventory((prev) => [...prev, result])
    setUnrevealedItems((prev) => [...prev, result])
    setCurrentBlindBox(result)

    // Remove this entire section that spoils the blind box:
    // Show notifications for special items
    // if (result.collection === "space") {
    //   addNotification({
    //     type: "legendary",
    //     title: "SPACE ITEM!",
    //     message: `You pulled ${result.name}! ${result.emoji}`,
    //     icon: result.emoji,
    //     duration: 8000,
    //   })
    // } else if (result.version === "hidden") {
    //   addNotification({
    //     type: "collection",
    //     title: "Hidden Variant!",
    //     message: `Found hidden ${result.name}! ${result.emoji}`,
    //     icon: "🌟",
    //     duration: 6000,
    //   })
    // } else if (!existingItem) {
    //   addNotification({
    //     type: "success",
    //     title: "New Item!",
    //     message: `Added ${result.name} to collection`,
    //     icon: result.emoji,
    //     duration: 4000,
    //   })
    // }

    // Show collection-specific particles
    setCollectionParticleType(result.collection)
    setShowRarityParticles(true)

    // Show item entrance effect
    setEntranceItem(result)
    setShowItemEntrance(true)

    // Check if it's a space item and trigger celebration + screen shake
    if (result.collection === "space") {
      setShowCelebration(true)
      setShowScreenShake(true)

      // Hide celebration after 4 seconds
      setTimeout(() => setShowCelebration(false), 4000)
      // Hide screen shake after 2 seconds
      setTimeout(() => setShowScreenShake(false), 2000)
    }

    // Brief pause before showing the modal
    setTimeout(() => {
      setShowBlindBoxModal(true)
      setIsSpinning(false)
      setShowRarityParticles(false)
    }, 2500)
  }

  const revealBlindBox = () => {
    // Play enhanced box opening sound
    soundManager.playBoxOpen()

    setIsItemRevealed(true)
    setBoxesOpened((prev) => prev + 1)

    // Remove the item from unrevealed items when actually revealed
    if (currentBlindBox) {
      setUnrevealedItems((prev) => {
        const indexToRemove = prev.findIndex(
          (item) =>
            item.id === currentBlindBox.id &&
            item.name === currentBlindBox.name &&
            item.collection === currentBlindBox.collection &&
            item.version === currentBlindBox.version,
        )
        if (indexToRemove > -1) {
          const newUnrevealed = [...prev]
          newUnrevealed.splice(indexToRemove, 1)
          return newUnrevealed
        }
        return prev
      })
    }

    // Play the appropriate reveal sound with music after a short delay
    setTimeout(() => {
      if (currentBlindBox) {
        soundManager.playItemReveal(currentBlindBox.collection)
      }
    }, 500)

    // Add notifications AFTER the reveal
    if (currentBlindBox) {
      const existingItem = inventory.find(
        (item) => item.id === currentBlindBox.id && item.version === currentBlindBox.version,
      )

      setTimeout(() => {
        if (currentBlindBox.collection === "space") {
          addNotification({
            type: "legendary",
            title: "SPACE ITEM!",
            message: `You revealed ${currentBlindBox.name}! ${currentBlindBox.emoji}`,
            icon: currentBlindBox.emoji,
            duration: 8000,
          })
        } else if (currentBlindBox.version === "hidden") {
          addNotification({
            type: "collection",
            title: "Hidden Variant!",
            message: `Found hidden ${currentBlindBox.name}! ${currentBlindBox.emoji}`,
            icon: "🌟",
            duration: 6000,
          })
        } else if (!existingItem) {
          addNotification({
            type: "success",
            title: "New Item!",
            message: `Added ${currentBlindBox.name} to collection`,
            icon: currentBlindBox.emoji,
            duration: 4000,
          })
        }
      }, 1000) // Delay to let the reveal animation play first
    }
  }

  const handleShare = () => {
    if (currentBlindBox) {
      // Play button click sound
      soundManager.play("buttonClick")
      shareToTwitter(currentBlindBox, isNewItem)

      addNotification({
        type: "info",
        title: "Shared to Twitter!",
        message: "Show off your amazing pull!",
        icon: "🐦",
        duration: 3000,
      })
    }
  }

  const closeModalAndReset = () => {
    // Play button click sound
    soundManager.play("buttonClick")

    // DON'T remove the item from unrevealed items when just continuing
    // The item should only be removed when explicitly revealed via revealBlindBox()

    // Reset the gacha display to empty state
    setShowResults(false)
    setCurrentResults([])

    // Close modal
    setShowBlindBoxModal(false)
    setCurrentBlindBox(null)
    setIsItemRevealed(false)
  }

  const revealAllItems = () => {
    if (unrevealedItems.length === 0) return

    // Play button click sound
    soundManager.play("buttonClick")

    setCurrentResults((prev) => [...unrevealedItems.reverse(), ...prev].slice(0, 9))
    setUnrevealedItems([])
    setShowResults(true)
    setBoxesOpened((prev) => prev + unrevealedItems.length)

    addNotification({
      type: "info",
      title: "All Boxes Revealed!",
      message: `Opened ${unrevealedItems.length} boxes at once`,
      icon: "📦",
      duration: 4000,
    })
  }

  const handleThemeChange = (theme: Theme) => {
    // Play theme change sound with transition
    soundManager.playThemeChange(theme.id)
    setCurrentTheme(theme)

    // Track theme usage
    if (!themesUsed.includes(theme.id)) {
      setThemesUsed((prev) => [...prev, theme.id])

      addNotification({
        type: "info",
        title: "New Theme!",
        message: `Switched to ${theme.name} theme`,
        icon: "🎨",
        duration: 3000,
      })
    }
  }

  const addCoin = () => {
    // Play coin sound and show animation
    soundManager.playCoinInsert()
    setShowCoinAnimation(true)
    setCoins((prev) => prev + 5)
    setTotalCoinsEarned((prev) => prev + 5)

    addNotification({
      type: "success",
      title: "Free Coins!",
      message: "Added 5 coins to your balance",
      icon: "🪙",
      duration: 3000,
    })
  }

  return (
    <>
      {/* Enhanced CSS Animations */}
      <style jsx>{`
        @keyframes screenShake {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          10% { transform: translate(-2px, -3px) rotate(-0.5deg); }
          20% { transform: translate(-4px, 0px) rotate(0.5deg); }
          30% { transform: translate(4px, 3px) rotate(0deg); }
          40% { transform: translate(2px, -2px) rotate(0.5deg); }
          50% { transform: translate(-2px, 3px) rotate(-0.5deg); }
          60% { transform: translate(-4px, 2px) rotate(0deg); }
          70% { transform: translate(4px, 2px) rotate(-0.5deg); }
          80% { transform: translate(-2px, -2px) rotate(0.5deg); }
          90% { transform: translate(2px, 3px) rotate(0deg); }
        }
        .screen-shake {
          animation: screenShake 0.6s ease-in-out infinite;
        }
        @keyframes boxOpen {
          0% { transform: scale(1) rotate(0deg); }
          25% { transform: scale(1.05) rotate(-2deg); }
          50% { transform: scale(1.1) rotate(2deg); }
          75% { transform: scale(1.05) rotate(-1deg); }
          100% { transform: scale(1) rotate(0deg); }
        }
        .box-opening {
          animation: boxOpen 0.8s ease-out;
        }
        @keyframes itemReveal {
          0% { 
            opacity: 0; 
            transform: scale(0.3) translateY(30px) rotate(-10deg); 
            filter: blur(4px);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.1) translateY(-5px) rotate(2deg);
            filter: blur(1px);
          }
          100% { 
            opacity: 1; 
            transform: scale(1) translateY(0px) rotate(0deg); 
            filter: blur(0px);
          }
        }
        .item-reveal {
          animation: itemReveal 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        @keyframes pulseGlow {
          0%, 100% { box-shadow: 0 0 20px rgba(255, 215, 0, 0.3); }
          50% { box-shadow: 0 0 40px rgba(255, 215, 0, 0.6), 0 0 60px rgba(255, 215, 0, 0.3); }
        }
        .legendary-glow {
          animation: pulseGlow 2s ease-in-out infinite;
        }
      `}</style>

      <div
        className={cn(
          "min-h-screen p-4 flex flex-col items-center justify-center overflow-hidden transition-all duration-700 ease-out",
          currentTheme.pageBg,
          showScreenShake && "screen-shake",
        )}
      >
        {/* Celebration Particles */}
        <CelebrationParticles theme={currentTheme} show={showCelebration} />

        {/* Elegant Header */}
        <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center w-full max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Crown className="w-8 h-8 md:w-10 md:h-10 text-amber-400 drop-shadow-lg" />
              <div className="absolute inset-0 w-8 h-8 md:w-10 md:h-10 text-amber-400 animate-ping opacity-20">
                <Crown className="w-full h-full" />
              </div>
            </div>
            <div>
              <h1
                className={cn(
                  "text-3xl md:text-5xl font-bold tracking-tight",
                  currentTheme.isDark ? "text-white" : "text-slate-800",
                  "drop-shadow-lg",
                )}
              >
                Gacha Zone
              </h1>
              <p
                className={cn(
                  "text-sm md:text-base font-medium tracking-wide",
                  currentTheme.isDark ? "text-slate-300" : "text-slate-600",
                )}
              >
                Premium Collection Experience
              </p>
            </div>
          </div>

          <div className="flex gap-3 md:gap-4 items-center">
            <SoundToggle isDark={currentTheme.isDark} className="shadow-lg" />

            <Link href="/inventory">
              <Button
                variant="outline"
                size="lg"
                className={cn(
                  "text-sm md:text-base font-medium transition-all duration-300 shadow-lg hover:shadow-xl",
                  currentTheme.isDark
                    ? "bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm"
                    : "bg-white/80 border-slate-200 text-slate-700 hover:bg-white backdrop-blur-sm",
                )}
                onClick={() => soundManager.play("buttonClick")}
              >
                <Package className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                Collection
              </Button>
            </Link>

            <Link href="/market">
              <Button
                variant="outline"
                size="lg"
                className={cn(
                  "text-sm md:text-base font-medium transition-all duration-300 shadow-lg hover:shadow-xl",
                  currentTheme.isDark
                    ? "bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm"
                    : "bg-white/80 border-slate-200 text-slate-700 hover:bg-white backdrop-blur-sm",
                )}
                onClick={() => soundManager.play("buttonClick")}
              >
                <Store className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                Market
              </Button>
            </Link>

            <PremiumStoreButton theme={currentTheme} />
          </div>
        </div>

        <div className="flex flex-col xl:flex-row items-center justify-center gap-12 w-full max-w-7xl mt-20 xl:mt-0">
          {/* Elegant Gacha Machine */}
          <div className="relative flex flex-col items-center">
            {/* Machine Stand/Base with elegant styling */}
            <div
              className={cn(
                "w-[300px] h-[90px] md:w-[360px] md:h-[110px] rounded-b-3xl border-4 shadow-2xl transition-all duration-700",
                currentTheme.machineBg,
                currentTheme.machineBorder,
                "border-t-0 relative overflow-hidden",
              )}
            >
              {/* Elegant base pattern */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
              <div className="w-full h-full flex items-center justify-center relative z-10">
                <div
                  className={cn(
                    "text-xl md:text-2xl font-bold tracking-[0.2em] transition-all duration-700",
                    currentTheme.topBezelText,
                    "drop-shadow-lg",
                  )}
                >
                  PREMIUM GACHA
                </div>
              </div>
            </div>

            {/* Main Machine Body with enhanced elegance */}
            <div
              className={cn(
                "relative w-[360px] h-[480px] md:w-[420px] md:h-[560px] rounded-t-3xl border-4 shadow-2xl transition-all duration-700 overflow-hidden",
                currentTheme.machineBg,
                currentTheme.machineBorder,
                "border-b-0",
                showCelebration && "legendary-glow",
              )}
            >
              {/* Elegant machine pattern overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-white/5 via-transparent to-black/10 pointer-events-none"></div>

              {/* Clear Dome Display - Enhanced */}
              <div className="relative w-full h-[65%] p-5 flex flex-col">
                <div
                  className={cn(
                    "w-full h-full rounded-2xl border-4 shadow-inner overflow-hidden transition-all duration-700 relative",
                    currentTheme.displayWindowBg,
                    "border-white/20",
                    showCelebration && "ring-4 ring-amber-400/50",
                  )}
                >
                  {/* Enhanced dome reflection */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent pointer-events-none"></div>

                  {/* Background capsules with better styling */}
                  <div className="absolute inset-0 opacity-20">
                    {Array.from({ length: 15 }).map((_, i) => (
                      <div
                        key={`bg-${i}`}
                        className="absolute w-6 h-6 md:w-8 md:h-8 rounded-full border-2 shadow-lg"
                        style={{
                          left: `${8 + (i % 5) * 18}%`,
                          top: `${8 + Math.floor(i / 5) * 22}%`,
                          backgroundColor: [
                            "#ff6b6b",
                            "#4ecdc4",
                            "#45b7d1",
                            "#96ceb4",
                            "#feca57",
                            "#ff9ff3",
                            "#a8e6cf",
                          ][i % 7],
                          borderColor: "rgba(255,255,255,0.4)",
                          transform: `rotate(${i * 24}deg)`,
                        }}
                      />
                    ))}
                  </div>

                  {/* Active Display Area with enhanced styling */}
                  <div className="relative z-10 grid grid-cols-3 gap-3 h-full p-4">
                    {isSpinning && !showBlindBoxModal
                      ? Array.from({ length: 9 }).map((_, i) => (
                          <div
                            key={i}
                            className={cn(
                              "rounded-2xl flex items-center justify-center transition-all duration-200 border-2 shadow-lg",
                              blinkingCell === i
                                ? cn(
                                    "bg-gradient-to-br from-amber-300 to-amber-500 border-amber-200",
                                    "ring-4 ring-amber-400/60 shadow-xl scale-105",
                                    animationPhase === "landing" && "scale-110",
                                    animationPhase === "landing" && i === 4 && "scale-125",
                                  )
                                : "bg-white/10 border-white/20 backdrop-blur-sm",
                            )}
                          >
                            {blinkingCell === i ? (
                              <Sparkles
                                className={cn(
                                  "w-5 h-5 md:w-6 md:h-6 text-amber-800 drop-shadow-lg",
                                  animationPhase === "fast" && "animate-ping",
                                  animationPhase === "landing" && i === 4 && "animate-pulse",
                                )}
                              />
                            ) : (
                              <div className="text-sm md:text-base text-white/40 font-medium">?</div>
                            )}
                          </div>
                        ))
                      : showResults && currentResults.length > 0
                        ? currentResults.slice(0, 9).map((item, i) => {
                            const isNewest = i === 0 && !showBlindBoxModal
                            return (
                              <div
                                key={`${item.id}-${item.name}-${i}`}
                                className={cn(
                                  "rounded-2xl border-2 p-2 flex flex-col items-center justify-center text-center transition-all duration-500 shadow-lg",
                                  COLLECTION_COLORS[item.collection],
                                  VERSION_STYLES[item.version],
                                  isNewest
                                    ? "ring-4 ring-amber-400/60 scale-105 shadow-xl z-10 border-amber-300"
                                    : "opacity-60 scale-90",
                                  item.version === "hidden" && isNewest && "shadow-purple-500/30",
                                  item.collection === "space" && isNewest && "animate-pulse shadow-amber-500/40",
                                )}
                              >
                                <div className="text-xl md:text-2xl mb-1 drop-shadow-sm">{item.emoji}</div>
                                {isNewest && (
                                  <div className="text-[8px] md:text-[9px] font-bold leading-none mt-1 opacity-80">
                                    {item.collection.charAt(0).toUpperCase()}
                                  </div>
                                )}
                              </div>
                            )
                          })
                        : Array.from({ length: 9 }).map((_, i) => (
                            <div
                              key={i}
                              className="rounded-2xl flex items-center justify-center bg-white/10 border-2 border-white/20 backdrop-blur-sm shadow-lg"
                            >
                              <div className="text-sm md:text-base text-white/40 font-medium">?</div>
                            </div>
                          ))}
                  </div>
                </div>
              </div>

              {/* Enhanced Control Panel Section */}
              <div className="w-full h-[35%] p-5 flex flex-col justify-between">
                {/* Elegant Coin Slot */}
                <div className="flex justify-center mb-4">
                  <div
                    className={cn(
                      "w-32 h-10 md:w-36 md:h-12 rounded-full border-2 flex items-center justify-center transition-all duration-700 shadow-inner",
                      currentTheme.coinSlotBg,
                      "border-white/30 backdrop-blur-sm",
                    )}
                  >
                    <div className={cn("font-semibold text-xs md:text-sm tracking-wide", currentTheme.coinSlotText)}>
                      <Coins className="inline w-3 h-3 md:w-4 md:h-4 mr-2" />
                      INSERT COIN
                    </div>
                  </div>
                </div>

                {/* Enhanced Turn Knob and Dispensing Area */}
                <div className="flex justify-between items-end">
                  {/* Elegant Turn Knob */}
                  <div className="flex flex-col items-center">
                    <div className="text-xs md:text-sm text-white/60 mb-3 font-medium tracking-wide">TURN</div>
                    <button
                      onClick={pullGacha}
                      disabled={coins < 1 || isSpinning || showBlindBoxModal}
                      className={cn(
                        "w-18 h-18 md:w-22 md:h-22 rounded-full border-4 shadow-xl transition-all duration-500 ease-out focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed relative group",
                        currentTheme.leverHandleBg,
                        currentTheme.leverHandleBorder,
                        leverPulled ? "rotate-90 scale-95" : "rotate-0 scale-100",
                        !(coins < 1 || isSpinning || showBlindBoxModal) &&
                          "hover:scale-105 hover:shadow-2xl active:scale-95",
                      )}
                      style={{ width: "72px", height: "72px" }}
                      aria-label="Turn Gacha Knob"
                    >
                      {/* Enhanced knob grip pattern */}
                      <div className="absolute inset-3 rounded-full border-2 border-black/20 bg-gradient-to-br from-white/20 to-transparent">
                        <div className="w-full h-full relative">
                          {Array.from({ length: 12 }).map((_, i) => (
                            <div
                              key={i}
                              className="absolute w-0.5 h-4 bg-black/30 rounded-full"
                              style={{
                                left: "50%",
                                top: "2px",
                                transformOrigin: "50% 28px",
                                transform: `translateX(-50%) rotate(${i * 30}deg)`,
                              }}
                            />
                          ))}
                        </div>
                      </div>
                      <Zap
                        className={cn(
                          "w-7 h-7 md:w-8 md:h-8 transition-all duration-500 drop-shadow-lg",
                          currentTheme.leverHandleIconColor,
                          "group-hover:scale-110",
                        )}
                      />
                    </button>
                  </div>

                  {/* Enhanced Dispensing Chute */}
                  <div className="flex flex-col items-center">
                    <div className="text-xs md:text-sm text-white/60 mb-3 font-medium tracking-wide">PRIZE</div>
                    <div
                      className={cn(
                        "w-24 h-14 md:w-28 md:h-16 rounded-xl border-2 transition-all duration-700 shadow-inner flex items-center justify-center",
                        currentTheme.coinSlotBg,
                        "border-white/30 backdrop-blur-sm",
                      )}
                    >
                      {showBlindBoxModal && currentBlindBox ? (
                        <div className="text-3xl md:text-4xl animate-bounce drop-shadow-lg">📦</div>
                      ) : (
                        <div className="text-xs md:text-sm text-white/40 font-medium">EMPTY</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Machine Idle Effects */}
              <MachineIdleEffects theme={currentTheme} isActive={isSpinning || showBlindBoxModal} />
            </div>
          </div>

          {/* Elegant Controls & Info Panel */}
          <div className="w-full max-w-sm xl:max-w-md space-y-6">
            {/* Theme Selection Card */}
            <Card
              className={cn(
                "shadow-2xl transition-all duration-700 border-0",
                currentTheme.controlPanelBg,
                "backdrop-blur-md",
              )}
            >
              <CardHeader className="pb-4">
                <CardTitle
                  className={cn("text-xl md:text-2xl flex items-center gap-3 font-bold", currentTheme.controlPanelText)}
                >
                  <Palette className="w-6 h-6 md:w-7 md:h-7" />
                  Machine Themes
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 grid grid-cols-3 gap-4">
                {themes.map((theme) => (
                  <Button
                    key={theme.id}
                    variant={currentTheme.id === theme.id ? "default" : "outline"}
                    size="lg"
                    onClick={() => handleThemeChange(theme)}
                    className={cn(
                      "text-sm w-full h-20 flex flex-col items-center justify-center transition-all duration-500 font-medium",
                      currentTheme.id === theme.id
                        ? "ring-4 ring-offset-2 ring-offset-transparent shadow-xl scale-105"
                        : theme.isDark
                          ? "border-slate-600/50 hover:bg-slate-700/30 text-slate-300 backdrop-blur-sm"
                          : "border-slate-300/50 hover:bg-slate-100/50 text-slate-700 backdrop-blur-sm",
                      currentTheme.id === theme.id &&
                        theme.id === "classicRed" &&
                        "bg-gradient-to-br from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 ring-red-400 text-white",
                      currentTheme.id === theme.id &&
                        theme.id === "cyberpunkNeon" &&
                        "bg-gradient-to-br from-purple-600 to-indigo-700 hover:from-purple-700 hover:to-indigo-800 ring-pink-400 text-white",
                      currentTheme.id === theme.id &&
                        theme.id === "pastelDream" &&
                        "bg-gradient-to-br from-pink-300 to-purple-400 hover:from-pink-400 hover:to-purple-500 ring-purple-300 text-white",
                    )}
                  >
                    <div
                      className={cn(
                        "w-6 h-6 rounded-full mb-2 border-2 shadow-lg",
                        theme.machineBg,
                        theme.machineBorder,
                      )}
                    ></div>
                    {theme.name}
                  </Button>
                ))}
              </CardContent>
            </Card>

            {/* Coin Balance Card */}
            <Card
              className={cn(
                "shadow-2xl transition-all duration-700 border-0",
                currentTheme.controlPanelBg,
                "backdrop-blur-md",
              )}
            >
              <CardContent className="p-8 text-center">
                <div className="flex items-center justify-center gap-3 mb-6">
                  <div className="relative">
                    <Coins className="w-10 h-10 md:w-12 md:h-12 text-amber-400 drop-shadow-lg" />
                    <div className="absolute inset-0 w-10 h-10 md:w-12 md:h-12 text-amber-400 animate-ping opacity-20">
                      <Coins className="w-full h-full" />
                    </div>
                  </div>
                  <span className={cn("text-4xl md:text-5xl font-bold tracking-tight", currentTheme.controlPanelText)}>
                    {coins}
                  </span>
                </div>
                <p
                  className={cn(
                    "mb-6 text-base md:text-lg font-medium",
                    currentTheme.isDark ? "text-slate-300/80" : "text-slate-600/80",
                  )}
                >
                  Premium Coins Available
                </p>

                {unrevealedItems.length > 0 && (
                  <div className="mb-6 p-4 bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-xl border border-amber-400/30 backdrop-blur-sm">
                    <div className="text-amber-300 font-bold text-base md:text-lg mb-3">
                      📦 {unrevealedItems.length} Unrevealed Prize{unrevealedItems.length !== 1 ? "s" : ""}
                    </div>
                    <Button
                      onClick={revealAllItems}
                      size="lg"
                      className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      🎁 Reveal All Prizes
                    </Button>
                  </div>
                )}

                <Button
                  onClick={addCoin}
                  size="lg"
                  className="w-full bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white font-bold text-base md:text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  ✨ Get 5 Premium Coins
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Enhanced Blind Box Modal */}
        {showBlindBoxModal && currentBlindBox && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-lg">
            <Card
              className={cn(
                "max-w-lg w-full shadow-2xl transition-all duration-700 border-0",
                currentTheme.modalBg,
                "backdrop-blur-md",
                isItemRevealed && currentBlindBox.collection === "space" && "legendary-glow",
              )}
            >
              <CardContent className="p-8 md:p-10 text-center">
                {!isItemRevealed ? (
                  // Enhanced Blind Box State
                  <div className="mb-8">
                    <div className="text-6xl md:text-7xl mb-6 animate-bounce drop-shadow-lg">📦</div>
                    <h2
                      className={cn(
                        "text-2xl md:text-3xl font-bold mb-3",
                        currentTheme.isDark ? "text-white" : "text-slate-900",
                      )}
                    >
                      Mystery Premium Box
                    </h2>
                    <p
                      className={cn(
                        "mb-6 text-base md:text-lg font-medium",
                        currentTheme.isDark ? "text-slate-300/80" : "text-slate-600",
                      )}
                    >
                      What treasures await inside? Open to discover your prize!
                    </p>
                    <Badge
                      className={cn(
                        "text-sm md:text-base px-4 py-2 font-bold",
                        !currentTheme.isDark
                          ? "bg-slate-100 text-slate-800 border-slate-300"
                          : "bg-slate-500/20 text-slate-300 border-slate-500/50",
                      )}
                    >
                      🎁 PREMIUM MYSTERY BOX
                    </Badge>
                  </div>
                ) : (
                  // Enhanced Revealed Item State
                  <div className="mb-8">
                    <div className="box-opening mb-6">
                      <div className="text-6xl md:text-7xl mb-4 drop-shadow-lg">📦</div>
                    </div>
                    <div className="item-reveal">
                      <div
                        className={cn(
                          "mx-auto w-32 h-32 md:w-40 md:h-40 rounded-2xl border-4 p-6 md:p-8 flex flex-col items-center justify-center mb-6 transition-all duration-500 shadow-xl",
                          COLLECTION_COLORS[currentBlindBox.collection],
                          VERSION_STYLES[currentBlindBox.version],
                          currentBlindBox.collection === "space" && "legendary-glow",
                        )}
                      >
                        <div className="text-4xl md:text-5xl mb-2 drop-shadow-lg">{currentBlindBox.emoji}</div>
                        <div className="text-xs md:text-sm font-bold text-center leading-tight">
                          {currentBlindBox.name}
                        </div>
                      </div>
                      <h2
                        className={cn(
                          "text-2xl md:text-3xl font-bold mb-3",
                          currentTheme.isDark ? "text-white" : "text-slate-900",
                          currentBlindBox.collection === "space" && "text-amber-400",
                        )}
                      >
                        {currentBlindBox.name}
                      </h2>
                      <p
                        className={cn(
                          "mb-4 text-base md:text-lg font-medium",
                          currentTheme.isDark ? "text-slate-300/80" : "text-slate-600",
                        )}
                      >
                        {currentBlindBox.description}
                      </p>
                      <div className="flex justify-center gap-3 mb-4">
                        <Badge variant="secondary" className="text-sm font-bold px-3 py-1">
                          {currentBlindBox.collection.toUpperCase()}
                        </Badge>
                        <Badge
                          variant={currentBlindBox.version === "hidden" ? "default" : "outline"}
                          className={`text-sm font-bold px-3 py-1 ${currentBlindBox.version === "hidden" ? "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white" : ""}`}
                        >
                          {currentBlindBox.version.toUpperCase()}
                        </Badge>
                      </div>
                      {isNewItem ? (
                        <Badge
                          className={cn(
                            "text-sm md:text-base px-4 py-2 font-bold",
                            !currentTheme.isDark
                              ? "bg-green-100 text-green-800 border-green-300"
                              : "bg-green-500/20 text-green-300 border-green-500/50",
                          )}
                        >
                          ✨ NEW DISCOVERY!
                        </Badge>
                      ) : (
                        <Badge
                          className={cn(
                            "text-sm md:text-base px-4 py-2 font-bold",
                            !currentTheme.isDark
                              ? "bg-blue-100 text-blue-800 border-blue-300"
                              : "bg-blue-500/20 text-blue-300 border-blue-500/50",
                          )}
                        >
                          📚 Already in Collection
                        </Badge>
                      )}
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  {!isItemRevealed ? (
                    <Button
                      onClick={revealBlindBox}
                      size="lg"
                      className="w-full bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      🎁 Open Premium Box
                    </Button>
                  ) : (
                    <>
                      {/* Enhanced Share Button */}
                      <Button
                        onClick={handleShare}
                        size="lg"
                        className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold text-lg flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        <Share className="w-5 h-5" />
                        Share Your Prize
                      </Button>

                      {/* Enhanced Continue Button */}
                      <Button
                        onClick={closeModalAndReset}
                        size="lg"
                        className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        ✨ Continue Playing
                      </Button>
                    </>
                  )}

                  {/* Enhanced Skip Button */}
                  <Button
                    onClick={closeModalAndReset}
                    variant="outline"
                    size="lg"
                    className={cn(
                      "w-full text-base font-medium transition-all duration-300",
                      !currentTheme.isDark
                        ? "border-slate-300 hover:bg-slate-100 text-slate-700 backdrop-blur-sm"
                        : "border-slate-600 hover:bg-slate-700/50 text-white backdrop-blur-sm",
                    )}
                  >
                    {isItemRevealed ? "Skip Sharing" : "🎰 Continue Gacha"}
                  </Button>
                </div>
                <p
                  className={cn(
                    "text-sm mt-6 font-medium",
                    currentTheme.isDark ? "text-slate-400/70" : "text-slate-500",
                  )}
                >
                  Unrevealed prizes: {unrevealedItems.length}
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Enhanced Animation Effects */}
        <CoinAnimation show={showCoinAnimation} onComplete={() => setShowCoinAnimation(false)} />

        <ItemEntranceEffect
          item={entranceItem}
          show={showItemEntrance}
          onComplete={() => {
            setShowItemEntrance(false)
            setEntranceItem(null)
          }}
        />

        <RarityParticles rarity={collectionParticleType} show={showRarityParticles} theme={currentTheme} />

        {/* Achievement Modal */}
        <AchievementNotification
          title={currentAchievement?.title || ""}
          description={currentAchievement?.description || ""}
          icon={currentAchievement?.icon || "🏆"}
          show={showAchievementModal}
          onClose={() => {
            setShowAchievementModal(false)
            setCurrentAchievement(null)
          }}
        />
      </div>
    </>
  )
}

export default function GachaMachine() {
  return (
    <NotificationProvider>
      <GachaMachineContent />
      <NotificationContainer />
    </NotificationProvider>
  )
}
