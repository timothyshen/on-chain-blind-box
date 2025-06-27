"use client"

import { useState } from "react"
import useSound from "use-sound"

export const useSoundEffects = (initialMuted = false) => {
  const [isMuted, setIsMuted] = useState(initialMuted)

  const commonOptions = {
    soundEnabled: !isMuted,
  }

  const [playCoin] = useSound("/sounds/coin.mp3", { ...commonOptions, volume: 0.7 })
  const [playMove] = useSound("/sounds/move.mp3", { ...commonOptions, volume: 0.4, interrupt: true })
  const [playGrab] = useSound("/sounds/grab.mp3", { ...commonOptions, volume: 0.6 })
  const [playWin] = useSound("/sounds/win.mp3", { ...commonOptions, volume: 0.8 })
  const [playLose] = useSound("/sounds/lose.mp3", { ...commonOptions, volume: 0.8 })

  const toggleMute = () => setIsMuted(!isMuted)

  return { isMuted, toggleMute, playMove, playGrab, playWin, playLose, playCoin }
}
