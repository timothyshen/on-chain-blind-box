"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Package, Coins, Home } from "lucide-react"
import Link from "next/link"
import { soundManager } from "@/utils/sounds"

export default function SuccessPage() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get("session_id")
  const productId = searchParams.get("product")
  const productType = searchParams.get("type")
  const [processed, setProcessed] = useState(false)

  useEffect(() => {
    if (sessionId && !processed) {
      processPurchase()
    }
  }, [sessionId, processed])

  const processPurchase = async () => {
    try {
      // Verify the session and process the purchase
      const response = await fetch("/api/verify-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, productId, productType }),
      })

      if (response.ok) {
        const data = await response.json()

        // Add coins or items to user's account
        if (productType === "coins") {
          const currentCoins = Number.parseInt(localStorage.getItem("gacha-coins") || "0")
          const newCoins = currentCoins + data.coinsReceived
          localStorage.setItem("gacha-coins", newCoins.toString())
        } else if (productType === "boxes") {
          // Add blind boxes to unrevealed items
          const currentUnrevealed = JSON.parse(localStorage.getItem("gacha-unrevealed") || "[]")
          localStorage.setItem("gacha-unrevealed", JSON.stringify([...currentUnrevealed, ...data.itemsReceived]))
        }

        soundManager.play("celebration")
        setProcessed(true)
      }
    } catch (error) {
      console.error("Error processing purchase:", error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 p-4 flex items-center justify-center">
      <Card className="max-w-md w-full bg-white/90 backdrop-blur-sm shadow-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-slate-800">🎉 Purchase Successful!</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <p className="text-slate-600">Thank you for your purchase! Your items have been added to your account.</p>

          {productType === "coins" && (
            <div className="p-4 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-lg border border-amber-200">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Coins className="w-5 h-5 text-amber-600" />
                <span className="font-bold text-lg text-amber-800">Coins Added!</span>
              </div>
              <p className="text-sm text-amber-700">Check your coin balance in the game</p>
            </div>
          )}

          {productType === "boxes" && (
            <div className="p-4 bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg border border-pink-200">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Package className="w-5 h-5 text-pink-600" />
                <span className="font-bold text-lg text-pink-800">Blind Boxes Added!</span>
              </div>
              <p className="text-sm text-pink-700">Your new blind boxes are waiting to be opened</p>
            </div>
          )}

          <div className="space-y-3">
            <Link href="/" className="block">
              <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold shadow-lg hover:shadow-xl transition-all duration-300">
                <Home className="w-4 h-4 mr-2" />
                Back to Collection
              </Button>
            </Link>

            <Link href="/inventory" className="block">
              <Button variant="outline" className="w-full border-slate-300 text-slate-700 hover:bg-slate-100">
                <Package className="w-4 h-4 mr-2" />
                View My Collection
              </Button>
            </Link>
          </div>

          <p className="text-xs text-slate-500">Session ID: {sessionId?.slice(0, 20)}...</p>
        </CardContent>
      </Card>
    </div>
  )
}
