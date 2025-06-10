"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Coins, CreditCard, Package } from "lucide-react"
import { cn } from "@/lib/utils"
import { soundManager } from "@/utils/sounds"

interface CoinPackage {
  id: string
  name: string
  coins: number
  price: number // in cents
  bonus: number
  popular?: boolean
  icon: string
  description: string
  stripePrice: string // Stripe price ID
}

interface BlindBoxPackage {
  id: string
  name: string
  description: string
  price: number // in cents
  guaranteedRarity?: "magic" | "fantasy" | "space"
  pullCount: number
  icon: string
  stripePrice: string
  popular?: boolean
  limited?: boolean
}

const COIN_PACKAGES: CoinPackage[] = [
  {
    id: "starter",
    name: "Starter Pack",
    coins: 100,
    price: 499, // $4.99
    bonus: 0,
    icon: "🪙",
    description: "Perfect for beginners",
    stripePrice: "price_starter_pack",
  },
  {
    id: "popular",
    name: "Popular Pack",
    coins: 250,
    price: 999, // $9.99
    bonus: 50,
    popular: true,
    icon: "💰",
    description: "Most popular choice",
    stripePrice: "price_popular_pack",
  },
  {
    id: "premium",
    name: "Premium Pack",
    coins: 550,
    price: 1999, // $19.99
    bonus: 150,
    icon: "💎",
    description: "Great value with bonus",
    stripePrice: "price_premium_pack",
  },
  {
    id: "collector",
    name: "Collector's Pack",
    coins: 1200,
    price: 3999, // $39.99
    bonus: 400,
    icon: "👑",
    description: "For serious collectors",
    stripePrice: "price_collector_pack",
  },
]

const BLIND_BOX_PACKAGES: BlindBoxPackage[] = [
  {
    id: "single_mystery",
    name: "Mystery Box",
    description: "One premium blind box with surprises inside",
    price: 299, // $2.99
    pullCount: 1,
    icon: "📦",
    stripePrice: "price_single_mystery",
  },
  {
    id: "triple_pack",
    name: "Triple Mystery Pack",
    description: "Three blind boxes - better chances!",
    price: 799, // $7.99
    pullCount: 3,
    icon: "🎁",
    popular: true,
    stripePrice: "price_triple_pack",
  },
  {
    id: "magic_guarantee",
    name: "Magic Collection Box",
    description: "Guaranteed Magic collection item + 2 random",
    price: 1299, // $12.99
    pullCount: 3,
    guaranteedRarity: "magic",
    icon: "🔮",
    stripePrice: "price_magic_guarantee",
  },
  {
    id: "fantasy_deluxe",
    name: "Fantasy Deluxe Box",
    description: "Guaranteed Fantasy collection item + 4 random",
    price: 1999, // $19.99
    pullCount: 5,
    guaranteedRarity: "fantasy",
    icon: "👑",
    stripePrice: "price_fantasy_deluxe",
  },
  {
    id: "space_legendary",
    name: "Space Legendary Box",
    description: "GUARANTEED Space collection item + 2 bonus",
    price: 4999, // $49.99
    pullCount: 3,
    guaranteedRarity: "space",
    icon: "🌟",
    limited: true,
    stripePrice: "price_space_legendary",
  },
]

interface StripeCheckoutProps {
  onClose: () => void
  theme: any
}

export function StripeCheckout({ onClose, theme }: StripeCheckoutProps) {
  const [activeTab, setActiveTab] = useState<"coins" | "boxes">("boxes")
  const [loading, setLoading] = useState<string | null>(null)

  const handlePurchase = async (item: CoinPackage | BlindBoxPackage) => {
    setLoading(item.id)
    soundManager.play("buttonClick")

    try {
      // Call your API to create Stripe checkout session
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          priceId: item.stripePrice,
          productType: activeTab,
          productId: item.id,
        }),
      })

      const { url } = await response.json()

      if (url) {
        // Redirect to Stripe Checkout
        window.location.href = url
      }
    } catch (error) {
      console.error("Error creating checkout session:", error)
      alert("Something went wrong. Please try again.")
    }

    setLoading(null)
  }

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-lg">
      <Card
        className={cn(
          "max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl transition-all duration-700 border-0",
          theme.modalBg,
          "backdrop-blur-md",
        )}
      >
        <CardHeader className="text-center pb-4">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle
                className={cn("text-2xl md:text-3xl font-bold mb-2", theme.isDark ? "text-white" : "text-slate-900")}
              >
                🎁 Premium Blind Box Store
              </CardTitle>
              <p className={cn("text-base font-medium", theme.isDark ? "text-slate-300/80" : "text-slate-600")}>
                Collect authentic designer figures like Labubu & Molly
              </p>
            </div>
            <Button
              onClick={onClose}
              variant="outline"
              className={cn(
                "text-sm",
                !theme.isDark
                  ? "border-slate-300 hover:bg-slate-100 text-slate-700"
                  : "border-slate-600 hover:bg-slate-700/50 text-white",
              )}
            >
              ✕ Close
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          {/* Tab Navigation */}
          <div className="flex mb-6 bg-slate-100/50 rounded-lg p-1">
            <Button
              variant={activeTab === "boxes" ? "default" : "ghost"}
              onClick={() => {
                setActiveTab("boxes")
                soundManager.play("buttonClick")
              }}
              className={cn(
                "flex-1 font-medium",
                activeTab === "boxes"
                  ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg"
                  : "text-slate-600 hover:text-slate-800",
              )}
            >
              <Package className="w-4 h-4 mr-2" />
              Blind Boxes
            </Button>
            <Button
              variant={activeTab === "coins" ? "default" : "ghost"}
              onClick={() => {
                setActiveTab("coins")
                soundManager.play("buttonClick")
              }}
              className={cn(
                "flex-1 font-medium",
                activeTab === "coins"
                  ? "bg-gradient-to-r from-amber-500 to-yellow-500 text-white shadow-lg"
                  : "text-slate-600 hover:text-slate-800",
              )}
            >
              <Coins className="w-4 h-4 mr-2" />
              Coin Packs
            </Button>
          </div>

          {/* Blind Boxes Tab */}
          {activeTab === "boxes" && (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-slate-800 mb-2">🎨 Designer Collectible Blind Boxes</h3>
                <p className="text-slate-600">
                  Premium blind boxes featuring exclusive designer figures from various collections
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {BLIND_BOX_PACKAGES.map((pkg) => (
                  <Card
                    key={pkg.id}
                    className={cn(
                      "relative border-2 shadow-lg hover:shadow-xl transition-all duration-300",
                      pkg.popular && "ring-2 ring-pink-400 ring-opacity-50",
                      pkg.limited && "ring-2 ring-purple-400 ring-opacity-50",
                      "bg-gradient-to-br from-white to-slate-50",
                    )}
                  >
                    {pkg.popular && (
                      <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-pink-500 to-purple-500 text-white">
                        🔥 POPULAR
                      </Badge>
                    )}
                    {pkg.limited && (
                      <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
                        ⭐ LIMITED
                      </Badge>
                    )}

                    <CardContent className="p-6 text-center">
                      <div className="text-4xl mb-4">{pkg.icon}</div>
                      <h4 className="text-lg font-bold text-slate-800 mb-2">{pkg.name}</h4>
                      <p className="text-sm text-slate-600 mb-4 min-h-[40px]">{pkg.description}</p>

                      <div className="space-y-3 mb-4">
                        <div className="flex justify-center items-center gap-2">
                          <span className="text-2xl font-bold text-slate-800">${(pkg.price / 100).toFixed(2)}</span>
                        </div>

                        <div className="flex justify-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {pkg.pullCount} Pull{pkg.pullCount > 1 ? "s" : ""}
                          </Badge>
                          {pkg.guaranteedRarity && (
                            <Badge
                              variant="secondary"
                              className={cn(
                                "text-xs font-bold",
                                pkg.guaranteedRarity === "magic" && "bg-purple-100 text-purple-800",
                                pkg.guaranteedRarity === "fantasy" && "bg-amber-100 text-amber-800",
                                pkg.guaranteedRarity === "space" && "bg-indigo-100 text-indigo-800",
                              )}
                            >
                              {pkg.guaranteedRarity.toUpperCase()} GUARANTEED
                            </Badge>
                          )}
                        </div>
                      </div>

                      <Button
                        onClick={() => handlePurchase(pkg)}
                        disabled={loading === pkg.id}
                        className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-bold shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        {loading === pkg.id ? (
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Processing...
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <CreditCard className="w-4 h-4" />
                            Buy Now
                          </div>
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Coin Packs Tab */}
          {activeTab === "coins" && (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-slate-800 mb-2">💰 Premium Coin Packages</h3>
                <p className="text-slate-600">Get coins to play the gacha machine and collect more figures</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {COIN_PACKAGES.map((pkg) => (
                  <Card
                    key={pkg.id}
                    className={cn(
                      "relative border-2 shadow-lg hover:shadow-xl transition-all duration-300",
                      pkg.popular && "ring-2 ring-amber-400 ring-opacity-50 scale-105",
                      "bg-gradient-to-br from-white to-amber-50",
                    )}
                  >
                    {pkg.popular && (
                      <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-amber-500 to-yellow-500 text-white">
                        ⭐ BEST VALUE
                      </Badge>
                    )}

                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="text-4xl">{pkg.icon}</div>
                        <div className="flex-1">
                          <h4 className="text-lg font-bold text-slate-800">{pkg.name}</h4>
                          <p className="text-sm text-slate-600 mb-2">{pkg.description}</p>

                          <div className="flex items-center gap-3 mb-3">
                            <div className="flex items-center gap-1">
                              <Coins className="w-4 h-4 text-amber-500" />
                              <span className="font-bold text-lg">{pkg.coins.toLocaleString()}</span>
                            </div>
                            {pkg.bonus > 0 && (
                              <Badge variant="secondary" className="bg-green-100 text-green-800 font-bold">
                                +{pkg.bonus} BONUS
                              </Badge>
                            )}
                          </div>

                          <div className="flex justify-between items-center">
                            <span className="text-2xl font-bold text-slate-800">${(pkg.price / 100).toFixed(2)}</span>
                            <Button
                              onClick={() => handlePurchase(pkg)}
                              disabled={loading === pkg.id}
                              className={cn(
                                "font-bold shadow-lg hover:shadow-xl transition-all duration-300",
                                pkg.popular
                                  ? "bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600"
                                  : "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700",
                                "text-white",
                              )}
                            >
                              {loading === pkg.id ? (
                                <div className="flex items-center gap-2">
                                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                  Processing...
                                </div>
                              ) : (
                                <div className="flex items-center gap-2">
                                  <CreditCard className="w-4 h-4" />
                                  Buy
                                </div>
                              )}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Security Notice */}
          <div className="mt-8 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
            <div className="flex items-center gap-3 text-center justify-center">
              <div className="text-green-600">🔒</div>
              <p className="text-sm text-slate-600">
                <strong>Secure Payment:</strong> All transactions processed safely through Stripe. We never store your
                payment information.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
