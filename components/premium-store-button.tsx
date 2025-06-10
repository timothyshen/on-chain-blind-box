"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { CreditCard } from "lucide-react"
import { cn } from "@/lib/utils"
import { soundManager } from "@/utils/sounds"
import { StripeCheckout } from "./stripe-checkout"

interface PremiumStoreButtonProps {
  theme: any
}

export function PremiumStoreButton({ theme }: PremiumStoreButtonProps) {
  const [showStore, setShowStore] = useState(false)

  return (
    <>
      <Button
        onClick={() => {
          setShowStore(true)
          soundManager.play("buttonClick")
        }}
        size="lg"
        className={cn(
          "font-bold shadow-lg hover:shadow-xl transition-all duration-300",
          "bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500",
          "hover:from-pink-600 hover:via-purple-600 hover:to-indigo-600",
          "text-white border-0 relative overflow-hidden group",
        )}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
        <CreditCard className="w-4 h-4 md:w-5 md:h-5 mr-2 relative z-10" />
        <span className="relative z-10">🎨 Premium Store</span>
        <div className="ml-2 relative z-10">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
        </div>
      </Button>

      {showStore && <StripeCheckout onClose={() => setShowStore(false)} theme={theme} />}
    </>
  )
}
