export interface Prize {
  id: number
  x: number
  y: number
  emoji: string
  name: string
  grabbed: boolean // Will be true for prizes in the collectedPrizes array
  color: string
  vx: number
  vy: number
  radius: number
  mass: number
  isResting: boolean
  weight: number
  rarity: "normal" | "rare"
}

export type GrabPhase = "idle" | "descending" | "grabbing" | "ascending" | "moving" | "dropping"

export type GameResult = {
  won: boolean
  prize?: Prize
  message: string
}

export type DroppedPrize = Prize & {
  isDropping: boolean
  dropStartTime?: number
  rotation?: number
  bouncing?: boolean
  dropPhase?: "entering" | "traveling" | "collected"
}
