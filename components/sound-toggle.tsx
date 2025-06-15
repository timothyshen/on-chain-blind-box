"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Volume2, VolumeX } from "lucide-react"
import { soundManager } from "@/utils/sounds"
import { cn } from "@/lib/utils"

interface SoundToggleProps {
  className?: string
}

export function SoundToggle({ className }: SoundToggleProps) {
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
        "bg-white/80 border-slate-200 text-slate-700 hover:bg-white backdrop-blur-sm",
        className,
      )}
      title={isMuted ? "Unmute sounds" : "Mute sounds"}
    >
      {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
    </Button>
  )
}
