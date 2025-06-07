export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  unlocked: boolean
  unlockedAt?: Date
}

export interface GameStats {
  totalPulls: number
  totalCoins: number
  itemsCollected: number
  uniqueItems: number
  toysItems: number
  magicItems: number
  fantasyItems: number
  techItems: number
  natureItems: number
  spaceItems: number
  hiddenItems: number
  consecutiveCommon: number
  maxConsecutiveRare: number
  pityBreaks: number
  themesUnlocked: number
  boxesOpened: number
}

// Define achievement conditions as a separate object that won't be serialized
const ACHIEVEMENT_CONDITIONS: Record<string, (stats: GameStats) => boolean> = {
  first_pull: (stats) => stats.totalPulls >= 1,
  ten_pulls: (stats) => stats.totalPulls >= 10,
  hundred_pulls: (stats) => stats.totalPulls >= 100,
  toys_collector: (stats) => stats.toysItems >= 5,
  magic_master: (stats) => stats.magicItems >= 5,
  fantasy_lord: (stats) => stats.fantasyItems >= 5,
  tech_pioneer: (stats) => stats.techItems >= 3,
  nature_guardian: (stats) => stats.natureItems >= 3,
  space_explorer: (stats) => stats.spaceItems >= 1,
  first_hidden: (stats) => stats.hiddenItems >= 1,
  collector: (stats) => stats.uniqueItems >= 50,
  hoarder: (stats) => stats.itemsCollected >= 100,
  pity_breaker: (stats) => stats.pityBreaks >= 5,
  theme_explorer: (stats) => stats.themesUnlocked >= 3,
  box_opener: (stats) => stats.boxesOpened >= 50,
  lucky_streak: (stats) => stats.maxConsecutiveRare >= 3,
  collection_master: (stats) =>
    stats.toysItems >= 1 &&
    stats.magicItems >= 1 &&
    stats.fantasyItems >= 1 &&
    stats.techItems >= 1 &&
    stats.natureItems >= 1 &&
    stats.spaceItems >= 1,
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: "first_pull",
    title: "First Steps",
    description: "Make your first gacha pull",
    icon: "🎰",
    unlocked: false,
  },
  {
    id: "ten_pulls",
    title: "Getting Started",
    description: "Make 10 gacha pulls",
    icon: "🎯",
    unlocked: false,
  },
  {
    id: "hundred_pulls",
    title: "Gacha Veteran",
    description: "Make 100 gacha pulls",
    icon: "🏆",
    unlocked: false,
  },
  {
    id: "toys_collector",
    title: "Toy Collector",
    description: "Collect 5 items from the Toys collection",
    icon: "🧸",
    unlocked: false,
  },
  {
    id: "magic_master",
    title: "Magic Master",
    description: "Collect 5 items from the Magic collection",
    icon: "🪄",
    unlocked: false,
  },
  {
    id: "fantasy_lord",
    title: "Fantasy Lord",
    description: "Collect 5 items from the Fantasy collection",
    icon: "👑",
    unlocked: false,
  },
  {
    id: "tech_pioneer",
    title: "Tech Pioneer",
    description: "Collect 3 items from the Tech collection",
    icon: "⚡",
    unlocked: false,
  },
  {
    id: "nature_guardian",
    title: "Nature Guardian",
    description: "Collect 3 items from the Nature collection",
    icon: "🌳",
    unlocked: false,
  },
  {
    id: "space_explorer",
    title: "Space Explorer",
    description: "Find your first item from the Space collection",
    icon: "🚀",
    unlocked: false,
  },
  {
    id: "first_hidden",
    title: "Hidden Treasure",
    description: "Find your first hidden variant",
    icon: "🌟",
    unlocked: false,
  },
  {
    id: "collector",
    title: "Master Collector",
    description: "Collect 50 unique items",
    icon: "📚",
    unlocked: false,
  },
  {
    id: "hoarder",
    title: "Item Hoarder",
    description: "Collect 100 total items",
    icon: "📦",
    unlocked: false,
  },
  {
    id: "collection_master",
    title: "Collection Master",
    description: "Collect at least one item from every collection",
    icon: "🎯",
    unlocked: false,
  },
  {
    id: "theme_explorer",
    title: "Style Explorer",
    description: "Try all machine themes",
    icon: "🎨",
    unlocked: false,
  },
  {
    id: "box_opener",
    title: "Box Opener",
    description: "Open 50 blind boxes",
    icon: "📦",
    unlocked: false,
  },
  {
    id: "lucky_streak",
    title: "Lucky Streak",
    description: "Get 3 rare+ items in a row",
    icon: "🍀",
    unlocked: false,
  },
]

export function checkAchievements(stats: GameStats, currentAchievements: Achievement[]): Achievement[] {
  const newUnlocks: Achievement[] = []

  const updatedAchievements = currentAchievements.map((achievement) => {
    const condition = ACHIEVEMENT_CONDITIONS[achievement.id]
    if (!achievement.unlocked && condition && condition(stats)) {
      const unlockedAchievement = {
        ...achievement,
        unlocked: true,
        unlockedAt: new Date(),
      }
      newUnlocks.push(unlockedAchievement)
      return unlockedAchievement
    }
    return achievement
  })

  return newUnlocks
}

export function getGameStats(
  inventory: any[],
  totalPulls: number,
  totalCoins: number,
  pityBreaks: number,
  themesUsed: string[],
  boxesOpened: number,
  consecutiveCommon: number,
  maxConsecutiveRare: number,
): GameStats {
  const itemsCollected = inventory.length
  const uniqueItems = new Set(inventory.map((item) => `${item.id}-${item.version}`)).size

  const collectionCount = inventory.reduce(
    (acc, item) => {
      acc[item.collection] = (acc[item.collection] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const hiddenItems = inventory.filter((item) => item.version === "hidden").length

  return {
    totalPulls,
    totalCoins,
    itemsCollected,
    uniqueItems,
    toysItems: collectionCount.toys || 0,
    magicItems: collectionCount.magic || 0,
    fantasyItems: collectionCount.fantasy || 0,
    techItems: collectionCount.tech || 0,
    natureItems: collectionCount.nature || 0,
    spaceItems: collectionCount.space || 0,
    hiddenItems,
    consecutiveCommon,
    maxConsecutiveRare,
    pityBreaks,
    themesUnlocked: themesUsed.length,
    boxesOpened,
  }
}
