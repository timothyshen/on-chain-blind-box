"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Volume2, VolumeX } from "lucide-react"
import { soundManager } from "@/utils/sounds"
import { cn } from "@/lib/utils"

interface SoundToggleProps {
  isDark?: boolean
  className?: string
}

export function SoundToggle({ isDark = true, className }: SoundToggleProps) {
  const [isMuted, setIsMuted] = useState(true)

  // Initialize on mount
  useEffect(() => {
    // Initialize sound manager
    soundManager.initialize()
    // Get initial mute state
    setIsMuted(soundManager.getMuted())
  }, [])

  const toggleMute = () => {
    const newMutedState = soundManager.toggleMute()
    setIsMuted(newMutedState)

    // Play a sound when unmuting to give feedback
    if (!newMutedState) {
      soundManager.play("buttonClick")
    }
  }

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleMute}
      className={cn(
        "w-8 h-8 rounded-full",
        isDark
          ? "bg-white/10 border-white/20 text-white hover:bg-white/20"
          : "bg-black/5 border-black/10 text-black/70 hover:bg-black/10",
        className,
      )}
      title={isMuted ? "Unmute sounds" : "Mute sounds"}
    >
      {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
    </Button>
  )
}
