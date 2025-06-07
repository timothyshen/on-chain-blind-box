export interface PityState {
  pullsSinceEpic: number
  pullsSinceLegendary: number
  totalPulls: number
}

export const DEFAULT_PITY_STATE: PityState = {
  pullsSinceEpic: 0,
  pullsSinceLegendary: 0,
  totalPulls: 0,
}

export interface PityRates {
  commonRate: number
  rareRate: number
  epicRate: number
  legendaryRate: number
  isEpicPity: boolean
  isLegendaryPity: boolean
}

const BASE_RATES = {
  common: 0.5,
  rare: 0.3,
  epic: 0.15,
  legendary: 0.05,
}

const EPIC_PITY_THRESHOLD = 20 // Guaranteed epic+ after 20 pulls without epic+
const LEGENDARY_PITY_THRESHOLD = 50 // Guaranteed legendary after 50 pulls without legendary

export function calculatePityRates(pityState: PityState): PityRates {
  const { pullsSinceEpic, pullsSinceLegendary } = pityState

  // Check for hard pity
  const isEpicPity = pullsSinceEpic >= EPIC_PITY_THRESHOLD
  const isLegendaryPity = pullsSinceLegendary >= LEGENDARY_PITY_THRESHOLD

  // If legendary pity, guarantee legendary
  if (isLegendaryPity) {
    return {
      commonRate: 0,
      rareRate: 0,
      epicRate: 0,
      legendaryRate: 1,
      isEpicPity: false,
      isLegendaryPity: true,
    }
  }

  // If epic pity, guarantee epic+ (but not legendary if not at legendary pity)
  if (isEpicPity) {
    return {
      commonRate: 0,
      rareRate: 0,
      epicRate: 0.75, // Higher chance for epic
      legendaryRate: 0.25, // Some chance for legendary
      isEpicPity: true,
      isLegendaryPity: false,
    }
  }

  // Soft pity - gradually increase rates as approaching pity
  const epicSoftPityStart = EPIC_PITY_THRESHOLD - 5
  const legendarySoftPityStart = LEGENDARY_PITY_THRESHOLD - 10

  let epicBonus = 0
  let legendaryBonus = 0

  // Epic soft pity
  if (pullsSinceEpic >= epicSoftPityStart) {
    const progress = (pullsSinceEpic - epicSoftPityStart) / 5
    epicBonus = progress * 0.1 // Up to 10% bonus
  }

  // Legendary soft pity
  if (pullsSinceLegendary >= legendarySoftPityStart) {
    const progress = (pullsSinceLegendary - legendarySoftPityStart) / 10
    legendaryBonus = progress * 0.05 // Up to 5% bonus
  }

  // Calculate adjusted rates
  const adjustedEpicRate = Math.min(BASE_RATES.epic + epicBonus, 0.4)
  const adjustedLegendaryRate = Math.min(BASE_RATES.legendary + legendaryBonus, 0.15)

  // Redistribute remaining probability
  const totalBonusUsed = adjustedEpicRate - BASE_RATES.epic + (adjustedLegendaryRate - BASE_RATES.legendary)
  const remainingRate = 1 - adjustedEpicRate - adjustedLegendaryRate

  const commonRate = Math.max(0, BASE_RATES.common - totalBonusUsed * 0.7)
  const rareRate = remainingRate - commonRate

  return {
    commonRate: Math.max(0, commonRate),
    rareRate: Math.max(0, rareRate),
    epicRate: adjustedEpicRate,
    legendaryRate: adjustedLegendaryRate,
    isEpicPity: false,
    isLegendaryPity: false,
  }
}

export function updatePityState(
  currentState: PityState,
  pulledRarity: "common" | "rare" | "epic" | "legendary",
): PityState {
  const newState = {
    ...currentState,
    totalPulls: currentState.totalPulls + 1,
    pullsSinceEpic: currentState.pullsSinceEpic + 1,
    pullsSinceLegendary: currentState.pullsSinceLegendary + 1,
  }

  // Reset epic counter if we got epic or legendary
  if (pulledRarity === "epic" || pulledRarity === "legendary") {
    newState.pullsSinceEpic = 0
  }

  // Reset legendary counter if we got legendary
  if (pulledRarity === "legendary") {
    newState.pullsSinceLegendary = 0
  }

  return newState
}

export function getPityProgress(pityState: PityState) {
  const epicProgress = Math.min(pityState.pullsSinceEpic / EPIC_PITY_THRESHOLD, 1)
  const legendaryProgress = Math.min(pityState.pullsSinceLegendary / LEGENDARY_PITY_THRESHOLD, 1)

  return {
    epic: {
      current: pityState.pullsSinceEpic,
      max: EPIC_PITY_THRESHOLD,
      progress: epicProgress,
      remaining: Math.max(0, EPIC_PITY_THRESHOLD - pityState.pullsSinceEpic),
    },
    legendary: {
      current: pityState.pullsSinceLegendary,
      max: LEGENDARY_PITY_THRESHOLD,
      progress: legendaryProgress,
      remaining: Math.max(0, LEGENDARY_PITY_THRESHOLD - pityState.pullsSinceLegendary),
    },
  }
}
