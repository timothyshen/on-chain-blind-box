"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Store, TrendingUp, Users, Coins, Star, Filter, Search } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { soundManager } from "@/utils/sounds"
import { SoundToggle } from "@/components/sound-toggle"
import { Input } from "@/components/ui/input"

// Update the GachaItem interface to include version
interface GachaItem {
  id: string
  name: string
  collection: "toys" | "magic" | "fantasy" | "tech" | "nature" | "space"
  emoji: string
  description: string
  version: "standard" | "hidden"
}

interface MarketListing {
  id: string
  item?: GachaItem // Make item optional for blind boxes
  blindBox?: {
    id: string
    name: string
    description: string
    emoji: string
  }
  seller: string
  price: number
  quantity: number
  featured?: boolean
  limited?: boolean
  discount?: number
  isBlindBox?: boolean // Add this flag
}

interface TradeOffer {
  id: string
  from: string
  to: string
  offering: (GachaItem | { isBlindBox: true; id: string; name: string; emoji: string })[]
  requesting: (GachaItem | { isBlindBox: true; id: string; name: string; emoji: string })[]
  status: "pending" | "accepted" | "rejected"
  expiresIn?: string
}

// Collection-based colors and styles
const COLLECTION_COLORS = {
  toys: "bg-pink-50 border-pink-200 text-pink-700 hover:bg-pink-100",
  magic: "bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100",
  fantasy: "bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100",
  tech: "bg-cyan-50 border-cyan-200 text-cyan-700 hover:bg-cyan-100",
  nature: "bg-green-50 border-green-200 text-green-700 hover:bg-green-100",
  space: "bg-indigo-50 border-indigo-200 text-indigo-700 hover:bg-indigo-100",
}

const COLLECTION_GLOW = {
  toys: "hover:shadow-pink-200/50",
  magic: "hover:shadow-purple-200/50",
  fantasy: "hover:shadow-amber-200/50",
  tech: "hover:shadow-cyan-200/50",
  nature: "hover:shadow-green-200/50",
  space: "hover:shadow-indigo-200/50",
}

// Add version styles
const VERSION_STYLES = {
  standard: "",
  hidden: "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white border-white/30 shadow-lg",
}



// Update the mock listings with collection-based pricing
const MOCK_LISTINGS: MarketListing[] = [
  {
    id: "1",
    item: {
      id: "8",
      name: "Dragon Egg",
      collection: "fantasy",
      emoji: "🥚",
      description: "Ancient and powerful",
      version: "standard",
    },
    seller: "DragonMaster",
    price: 35,
    quantity: 1,
  },
  {
    id: "2",
    item: {
      id: "4",
      name: "Magic Wand",
      collection: "magic",
      emoji: "🪄",
      description: "Sparkles with mystery",
      version: "standard",
    },
    seller: "WizardKing",
    price: 15,
    quantity: 3,
    featured: true,
  },
  {
    id: "3",
    item: {
      id: "9h",
      name: "Phoenix Feather",
      collection: "fantasy",
      emoji: "🪶",
      description: "Burns with eternal flame",
      version: "hidden",
    },
    seller: "FireBird",
    price: 85,
    quantity: 1,
    limited: true,
  },
  {
    id: "4",
    item: {
      id: "1",
      name: "Rubber Duck",
      collection: "toys",
      emoji: "🦆",
      description: "A squeaky companion",
      version: "standard",
    },
    seller: "DuckCollector",
    price: 2,
    quantity: 10,
    discount: 20,
  },
  {
    id: "5",
    item: {
      id: "15",
      name: "Shooting Star",
      collection: "space",
      emoji: "⭐",
      description: "Make a wish",
      version: "standard",
    },
    seller: "StarGazer",
    price: 120,
    quantity: 1,
    featured: true,
  },
  {
    id: "6",
    item: {
      id: "11h",
      name: "Laser Sword",
      collection: "tech",
      emoji: "⚡",
      description: "Futuristic weapon",
      version: "hidden",
    },
    seller: "TechMaster",
    price: 45,
    quantity: 2,
    limited: true,
  },
  {
    id: "7",
    item: {
      id: "13",
      name: "Sacred Tree",
      collection: "nature",
      emoji: "🌳",
      description: "Ancient wisdom",
      version: "standard",
    },
    seller: "NatureKeeper",
    price: 12,
    quantity: 5,
    discount: 15,
  },
  {
    id: "8",
    item: {
      id: "2h",
      name: "Teddy Bear",
      collection: "toys",
      emoji: "🧸",
      description: "Soft and cuddly",
      version: "hidden",
    },
    seller: "ToyMaster",
    price: 18,
    quantity: 2,
  },
  {
    id: "9",
    item: {
      id: "16h",
      name: "Moon Crystal",
      collection: "space",
      emoji: "🌙",
      description: "Lunar energy",
      version: "hidden",
    },
    seller: "MoonWalker",
    price: 180,
    quantity: 1,
    limited: true,
    featured: true,
  },
  // Add these blind box listings
  {
    id: "10",
    blindBox: {
      id: "bb1",
      name: "Mystery Premium Box",
      description: "Could contain any collection item!",
      emoji: "📦",
    },
    seller: "MysteryTrader",
    price: 8,
    quantity: 5,
    isBlindBox: true,
  },
  {
    id: "11",
    blindBox: {
      id: "bb2",
      name: "Rare Mystery Box",
      description: "Higher chance for epic+ items",
      emoji: "🎁",
    },
    seller: "BoxCollector",
    price: 15,
    quantity: 2,
    isBlindBox: true,
    featured: true,
  },
  {
    id: "12",
    blindBox: {
      id: "bb3",
      name: "Space Collection Box",
      description: "Guaranteed Space collection item inside!",
      emoji: "🌟",
    },
    seller: "StarHunter",
    price: 45,
    quantity: 1,
    isBlindBox: true,
    limited: true,
  },
]

// Update the mock trades with collection-based items
const MOCK_TRADES: TradeOffer[] = [
  {
    id: "1",
    from: "TradeKing",
    to: "You",
    offering: [
      {
        id: "5",
        name: "Crystal Ball",
        collection: "magic",
        emoji: "🔮",
        description: "Sees the future",
        version: "standard",
      },
      {
        id: "5",
        name: "Crystal Ball",
        collection: "magic",
        emoji: "🔮",
        description: "Sees the future",
        version: "standard",
      },
    ],
    requesting: [
      {
        id: "7",
        name: "Golden Crown",
        collection: "fantasy",
        emoji: "👑",
        description: "Fit for royalty",
        version: "standard",
      },
    ],
    status: "pending",
    expiresIn: "23 hours",
  },
  {
    id: "2",
    from: "MagicUser",
    to: "You",
    offering: [
      {
        id: "2h",
        name: "Teddy Bear",
        collection: "toys",
        emoji: "🧸",
        description: "Soft and cuddly",
        version: "hidden",
      },
    ],
    requesting: [
      {
        id: "4",
        name: "Magic Wand",
        collection: "magic",
        emoji: "🪄",
        description: "Sparkles with mystery",
        version: "standard",
      },
    ],
    status: "pending",
    expiresIn: "2 days",
  },
  {
    id: "3",
    from: "SpaceExplorer",
    to: "You",
    offering: [
      {
        id: "12",
        name: "Hologram",
        collection: "tech",
        emoji: "🌐",
        description: "3D projection",
        version: "standard",
      },
      {
        id: "14",
        name: "Rainbow Flower",
        collection: "nature",
        emoji: "🌺",
        description: "Blooms in all colors",
        version: "standard",
      },
    ],
    requesting: [
      {
        id: "16h",
        name: "Moon Crystal",
        collection: "space",
        emoji: "🌙",
        description: "Lunar energy",
        version: "hidden",
      },
    ],
    status: "pending",
    expiresIn: "12 hours",
  },
  {
    id: "4",
    from: "BoxTrader",
    to: "You",
    offering: [
      {
        isBlindBox: true,
        id: "bb4",
        name: "Fantasy Mystery Box",
        emoji: "📦",
      },
      {
        isBlindBox: true,
        id: "bb5",
        name: "Magic Mystery Box",
        emoji: "🎁",
      },
    ],
    requesting: [
      {
        id: "15h",
        name: "Shooting Star",
        collection: "space",
        emoji: "⭐",
        description: "Make a wish",
        version: "hidden",
      },
    ],
    status: "pending",
    expiresIn: "6 hours",
  },
]

export default function Market() {
  const [coins, setCoins] = useState(0)
  const [inventory, setInventory] = useState<GachaItem[]>([])
  const [listings] = useState<MarketListing[]>(MOCK_LISTINGS)
  const [trades] = useState<TradeOffer[]>(MOCK_TRADES)
  const [selectedCollection, setSelectedCollection] = useState<string>("all")
  const [selectedVersion, setSelectedVersion] = useState<string>("all")
  const [sortBy, setSortBy] = useState<"price" | "collection" | "name">("price")
  const [searchTerm, setSearchTerm] = useState("")
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false)
  const [showLimitedOnly, setShowLimitedOnly] = useState(false)
  const [showDiscountOnly, setShowDiscountOnly] = useState(false)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  useEffect(() => {
    // Initialize sound manager
    soundManager.initialize()

    const savedCoins = localStorage.getItem("gacha-coins")
    if (savedCoins) {
      setCoins(Number.parseInt(savedCoins))
    }

    const savedInventory = localStorage.getItem("gacha-inventory")
    if (savedInventory) {
      setInventory(JSON.parse(savedInventory))
    }
  }, [])

  const buyItem = (listing: MarketListing) => {
    if (coins >= listing.price) {
      soundManager.play("coinAdd")

      setCoins((prev) => {
        const newCoins = prev - listing.price
        localStorage.setItem("gacha-coins", newCoins.toString())
        return newCoins
      })

      if (listing.isBlindBox && listing.blindBox) {
        // Add blind box to unrevealed items
        const blindBoxItem: GachaItem = {
          id: listing.blindBox.id,
          name: listing.blindBox.name,
          collection: "toys", // Placeholder - will be determined when opened
          emoji: listing.blindBox.emoji,
          description: listing.blindBox.description,
          version: "standard", // Placeholder
        }

        const currentUnrevealed = JSON.parse(localStorage.getItem("gacha-unrevealed") || "[]")
        localStorage.setItem("gacha-unrevealed", JSON.stringify([...currentUnrevealed, blindBoxItem]))

        alert(`Successfully purchased ${listing.blindBox.name} for ${listing.price} coins! Check your blind boxes.`)
      } else if (listing.item) {
        const newInventory = [...inventory, listing.item]
        setInventory(newInventory)
        localStorage.setItem("gacha-inventory", JSON.stringify(newInventory))

        alert(`Successfully purchased ${listing.item.name} for ${listing.price} coins!`)
      }
    } else {
      soundManager.play("buttonClick")
      alert(`Not enough coins! You need ${listing.price - coins} more coins.`)
    }
  }

  const acceptTrade = (trade: TradeOffer) => {
    soundManager.play("celebration")
    // In a real app, this would handle the trade logic
    alert(`Trade accepted! You received ${trade.offering.map((item) => item.name).join(", ")}`)
  }

  const rejectTrade = (trade: TradeOffer) => {
    soundManager.play("buttonClick")
    alert("Trade rejected!")
  }

  // Filter and sort listings
  const filteredListings = listings
    .filter((listing) => {
      const matchesSearch = (listing.isBlindBox ? listing.blindBox?.name : listing.item?.name)
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase())
      const matchesCollection = selectedCollection === "all" || listing.item?.collection === selectedCollection
      const matchesVersion = selectedVersion === "all" || listing.item?.version === selectedVersion
      const matchesFeatured = showFeaturedOnly ? listing.featured : true
      const matchesLimited = showLimitedOnly ? listing.limited : true
      const matchesDiscount = showDiscountOnly ? listing.discount && listing.discount > 0 : true
      return (
        matchesSearch && matchesCollection && matchesVersion && matchesFeatured && matchesLimited && matchesDiscount
      )
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price":
          return a.price - b.price
        case "collection":
          return (a.item?.collection || "").localeCompare(b.item?.collection || "")
        case "name":
          return (a.isBlindBox ? a.blindBox?.name : a.item?.name || "").localeCompare(
            (b.isBlindBox ? b.blindBox?.name : b.item?.name) || "",
          )
        default:
          return 0
      }
    })

  // Calculate market stats
  const totalListings = listings.length
  const spaceItems = listings.filter((listing) => listing.item?.collection === "space").length
  const hiddenItems = listings.filter((listing) => listing.item?.version === "hidden").length
  const blindBoxes = listings.filter((listing) => listing.isBlindBox).length
  const averagePrice = Math.round(listings.reduce((sum, listing) => sum + listing.price, 0) / listings.length)
  const featuredItems = listings.filter((listing) => listing.featured).length
  const limitedItems = listings.filter((listing) => listing.limited).length

  // Featured listings
  const featuredListings = listings.filter((listing) => listing.featured)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Enhanced Header */}
        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-8">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button
                variant="outline"
                className="bg-white/80 border-slate-200 text-slate-700 hover:bg-white backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300"
                onClick={() => soundManager.play("buttonClick")}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Gacha
              </Button>
            </Link>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-slate-800 flex items-center gap-3 tracking-tight">
                <Store className="w-8 h-8 md:w-10 md:h-10 text-blue-600 drop-shadow-lg" />
                Designer Market
              </h1>
              <p className="text-lg text-slate-600 font-medium mt-1">Buy, Sell & Trade Premium Collectibles</p>
            </div>
          </div>

          <div className="flex items-center gap-3 md:ml-auto">
            <SoundToggle isDark={false} />

            <Card className="bg-white/80 border-slate-200 shadow-lg backdrop-blur-sm">
              <CardContent className="p-4 flex items-center gap-2">
                <Coins className="w-5 h-5 text-amber-500" />
                <span className="text-slate-800 font-bold text-lg">{coins} Coins</span>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Market Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <Card className="bg-white/80 border-slate-200 shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm">
            <CardContent className="p-4 text-center">
              <div className="text-2xl md:text-3xl font-bold text-slate-800 mb-1">{totalListings}</div>
              <div className="text-sm text-slate-600 font-medium">Total Listings</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-300 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-4 text-center">
              <div className="text-2xl md:text-3xl font-bold text-indigo-700 mb-1">{spaceItems}</div>
              <div className="text-sm text-indigo-600 font-medium">Space Items</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-300 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-4 text-center">
              <div className="text-2xl md:text-3xl font-bold text-purple-700 mb-1">{hiddenItems}</div>
              <div className="text-sm text-purple-600 font-medium">Hidden Variants</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-300 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-4 text-center">
              <div className="text-2xl md:text-3xl font-bold text-amber-700 mb-1">{blindBoxes}</div>
              <div className="text-sm text-amber-600 font-medium">Mystery Boxes</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-300 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-4 text-center">
              <div className="text-2xl md:text-3xl font-bold text-amber-700 mb-1">{averagePrice}</div>
              <div className="text-sm text-amber-600 font-medium">Avg. Price</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-300 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-4 text-center">
              <div className="text-2xl md:text-3xl font-bold text-green-700 mb-1">{featuredItems}</div>
              <div className="text-sm text-green-600 font-medium">Featured</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-50 to-pink-50 border-red-300 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-4 text-center">
              <div className="text-2xl md:text-3xl font-bold text-red-700 mb-1">{limitedItems}</div>
              <div className="text-sm text-red-600 font-medium">Limited Edition</div>
            </CardContent>
          </Card>
        </div>

        {/* Featured Items Section */}
        {featuredListings.length > 0 && (
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-300 mb-8 shadow-xl">
            <CardHeader>
              <CardTitle className="text-blue-800 flex items-center gap-3 text-xl">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <Star className="w-4 h-4 text-white" />
                </div>
                Featured Designer Items
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {featuredListings.slice(0, 3).map((listing) => (
                  <Card
                    key={listing.id}
                    className={cn(
                      "transition-all duration-300 cursor-pointer border-2 shadow-lg hover:shadow-xl hover:scale-105",
                      COLLECTION_COLORS[listing.item?.collection || "toys"],
                      listing.item && VERSION_STYLES[listing.item.version],
                      listing.item && COLLECTION_GLOW[listing.item.collection],
                      "ring-2 ring-blue-300/50",
                    )}
                  >
                    <CardHeader className="pb-3">
                      <div className="text-4xl text-center mb-3 drop-shadow-sm">{listing.item?.emoji}</div>
                      <CardTitle className="text-base text-center font-bold leading-tight">
                        {listing.item?.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0 space-y-3">
                      <p className="text-xs text-center opacity-80 leading-relaxed">{listing.item?.description}</p>

                      <div className="flex justify-between items-center">
                        <Badge
                          variant="secondary"
                          className={cn(
                            "text-xs font-bold",
                            listing.item?.collection === "toys" && "bg-pink-100 text-pink-800 border-pink-300",
                            listing.item?.collection === "magic" && "bg-purple-100 text-purple-800 border-purple-300",
                            listing.item?.collection === "fantasy" && "bg-amber-100 text-amber-800 border-amber-300",
                            listing.item?.collection === "tech" && "bg-cyan-100 text-cyan-800 border-cyan-300",
                            listing.item?.collection === "nature" && "bg-green-100 text-green-800 border-green-300",
                            listing.item?.collection === "space" && "bg-indigo-100 text-indigo-800 border-indigo-300",
                          )}
                        >
                          {listing.item?.collection.toUpperCase()}
                        </Badge>
                        <Badge className="bg-blue-100 text-blue-800 border-blue-300 text-xs font-bold">FEATURED</Badge>
                      </div>

                      <div className="text-center space-y-2">
                        <div className="text-sm font-semibold text-slate-600">Seller: {listing.seller}</div>
                        <div className="flex items-center justify-center gap-1 mb-3">
                          <Coins className="w-4 h-4 text-amber-600" />
                          <span className="font-bold text-lg">{listing.price}</span>
                        </div>

                        <Button
                          onClick={() => buyItem(listing)}
                          disabled={coins < listing.price}
                          className={cn(
                            "w-full font-bold shadow-lg hover:shadow-xl transition-all duration-300",
                            coins >= listing.price
                              ? "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
                              : "bg-slate-300 text-slate-500 cursor-not-allowed",
                          )}
                          size="sm"
                        >
                          {coins >= listing.price ? "Buy Now" : `Need ${listing.price - coins} more coins`}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <Tabs defaultValue="marketplace" className="space-y-6">
          <TabsList className="bg-white/80 border-slate-200 shadow-lg backdrop-blur-sm">
            <TabsTrigger
              value="marketplace"
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
              onClick={() => soundManager.play("buttonClick")}
            >
              <Store className="w-4 h-4 mr-2" />
              Marketplace
            </TabsTrigger>
            <TabsTrigger
              value="trades"
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
              onClick={() => soundManager.play("buttonClick")}
            >
              <Users className="w-4 h-4 mr-2" />
              Trade Offers ({trades.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="marketplace" className="space-y-6">
            {/* Enhanced Filters */}
            <Card className="bg-white/80 border-slate-200 shadow-lg backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Search */}
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                      <Input
                        placeholder="Search marketplace..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 bg-white/80 border-slate-200 text-slate-800 placeholder:text-slate-400 h-12 text-base shadow-sm"
                      />
                    </div>
                  </div>

                  {/* Sort By */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex items-center gap-2">
                      <Filter className="w-4 h-4 text-slate-600" />
                      <span className="text-sm font-medium text-slate-600">Sort:</span>
                    </div>
                    <div className="flex gap-2">
                      {[
                        { value: "price", label: "Price" },
                        { value: "collection", label: "Collection" },
                        { value: "name", label: "Name" },
                      ].map((sort) => (
                        <Button
                          key={sort.value}
                          variant={sortBy === sort.value ? "default" : "outline"}
                          size="sm"
                          onClick={() => {
                            setSortBy(sort.value as any)
                            soundManager.play("buttonClick")
                          }}
                          className={cn(
                            "transition-all duration-300",
                            sortBy === sort.value
                              ? "bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
                              : "bg-white/80 border-slate-200 text-slate-700 hover:bg-slate-100",
                          )}
                        >
                          {sort.label}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Filter Buttons */}
                <div className="flex flex-wrap gap-3 mt-6">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-slate-600">Collection:</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant={selectedCollection === "all" ? "default" : "outline"}
                      size="sm"
                      onClick={() => {
                        setSelectedCollection("all")
                        soundManager.play("buttonClick")
                      }}
                      className={cn(
                        "transition-all duration-300",
                        selectedCollection === "all"
                          ? "bg-slate-600 hover:bg-slate-700 text-white"
                          : "bg-white/80 border-slate-200 text-slate-700 hover:bg-slate-100",
                      )}
                    >
                      All
                    </Button>
                    {["toys", "magic", "fantasy", "tech", "nature", "space"].map((collection) => (
                      <Button
                        key={collection}
                        variant={selectedCollection === collection ? "default" : "outline"}
                        size="sm"
                        onClick={() => {
                          setSelectedCollection(collection)
                          soundManager.play("buttonClick")
                        }}
                        className={cn(
                          "transition-all duration-300",
                          selectedCollection === collection
                            ? collection === "toys"
                              ? "bg-pink-600 hover:bg-pink-700 text-white"
                              : collection === "magic"
                                ? "bg-purple-600 hover:bg-purple-700 text-white"
                                : collection === "fantasy"
                                  ? "bg-amber-600 hover:bg-amber-700 text-white"
                                  : collection === "tech"
                                    ? "bg-cyan-600 hover:bg-cyan-700 text-white"
                                    : collection === "nature"
                                      ? "bg-green-600 hover:bg-green-700 text-white"
                                      : "bg-indigo-600 hover:bg-indigo-700 text-white"
                            : "bg-white/80 border-slate-200 text-slate-700 hover:bg-slate-100",
                        )}
                      >
                        {collection.charAt(0).toUpperCase() + collection.slice(1)}
                      </Button>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    <span className="text-sm font-medium text-slate-600">Version:</span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant={selectedVersion === "all" ? "default" : "outline"}
                      size="sm"
                      onClick={() => {
                        setSelectedVersion("all")
                        soundManager.play("buttonClick")
                      }}
                      className={cn(
                        "transition-all duration-300",
                        selectedVersion === "all"
                          ? "bg-slate-600 hover:bg-slate-700 text-white"
                          : "bg-white/80 border-slate-200 text-slate-700 hover:bg-slate-100",
                      )}
                    >
                      All Versions
                    </Button>
                    <Button
                      variant={selectedVersion === "standard" ? "default" : "outline"}
                      size="sm"
                      onClick={() => {
                        setSelectedVersion("standard")
                        soundManager.play("buttonClick")
                      }}
                      className={cn(
                        "transition-all duration-300",
                        selectedVersion === "standard"
                          ? "bg-slate-600 hover:bg-slate-700 text-white"
                          : "bg-white/80 border-slate-200 text-slate-700 hover:bg-slate-100",
                      )}
                    >
                      Standard
                    </Button>
                    <Button
                      variant={selectedVersion === "hidden" ? "default" : "outline"}
                      size="sm"
                      onClick={() => {
                        setSelectedVersion("hidden")
                        soundManager.play("buttonClick")
                      }}
                      className={cn(
                        "transition-all duration-300",
                        selectedVersion === "hidden"
                          ? "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white"
                          : "bg-white/80 border-slate-200 text-slate-700 hover:bg-slate-100",
                      )}
                    >
                      Hidden
                    </Button>
                  </div>
                </div>

                {/* Special Filters */}
                <div className="flex flex-wrap gap-3 mt-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-slate-600">Special:</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant={showFeaturedOnly ? "default" : "outline"}
                      size="sm"
                      onClick={() => {
                        setShowFeaturedOnly(!showFeaturedOnly)
                        soundManager.play("buttonClick")
                      }}
                      className={cn(
                        "transition-all duration-300",
                        showFeaturedOnly
                          ? "bg-blue-600 hover:bg-blue-700 text-white"
                          : "bg-white/80 border-slate-200 text-slate-700 hover:bg-slate-100",
                      )}
                    >
                      Featured Only
                    </Button>
                    <Button
                      variant={showLimitedOnly ? "default" : "outline"}
                      size="sm"
                      onClick={() => {
                        setShowLimitedOnly(!showLimitedOnly)
                        soundManager.play("buttonClick")
                      }}
                      className={cn(
                        "transition-all duration-300",
                        showLimitedOnly
                          ? "bg-red-600 hover:bg-red-700 text-white"
                          : "bg-white/80 border-slate-200 text-slate-700 hover:bg-slate-100",
                      )}
                    >
                      Limited Edition
                    </Button>
                    <Button
                      variant={showDiscountOnly ? "default" : "outline"}
                      size="sm"
                      onClick={() => {
                        setShowDiscountOnly(!showDiscountOnly)
                        soundManager.play("buttonClick")
                      }}
                      className={cn(
                        "transition-all duration-300",
                        showDiscountOnly
                          ? "bg-green-600 hover:bg-green-700 text-white"
                          : "bg-white/80 border-slate-200 text-slate-700 hover:bg-slate-100",
                      )}
                    >
                      On Sale
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Marketplace Items */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredListings.map((listing) => (
                <Card
                  key={listing.id}
                  className={cn(
                    "transition-all duration-300 cursor-pointer border-2 shadow-lg hover:shadow-xl hover:scale-105 relative",
                    listing.isBlindBox
                      ? "bg-gradient-to-br from-amber-50 to-orange-50 border-amber-300 hover:shadow-amber-200/50"
                      : COLLECTION_COLORS[listing.item?.collection || "toys"],
                    listing.item && VERSION_STYLES[listing.item.version],
                    listing.item && COLLECTION_GLOW[listing.item.collection],
                    listing.item?.collection === "space" && "ring-2 ring-indigo-300/50",
                    listing.featured && "ring-2 ring-blue-300/50",
                    listing.limited && "ring-2 ring-red-300/50",
                  )}
                >
                  {/* Special badges */}
                  <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
                    {listing.isBlindBox && (
                      <Badge className="bg-amber-500 text-white text-xs font-bold">📦 MYSTERY</Badge>
                    )}
                    {listing.featured && (
                      <Badge className="bg-blue-500 text-white text-xs font-bold">⭐ FEATURED</Badge>
                    )}
                    {listing.limited && <Badge className="bg-red-500 text-white text-xs font-bold">🔥 LIMITED</Badge>}
                    {listing.discount && listing.discount > 0 && (
                      <Badge className="bg-green-500 text-white text-xs font-bold">-{listing.discount}% OFF</Badge>
                    )}
                  </div>

                  <CardHeader className="pb-3">
                    <div className="text-4xl md:text-5xl text-center mb-3 drop-shadow-sm">
                      {listing.isBlindBox ? listing.blindBox?.emoji : listing.item?.emoji}
                    </div>
                    <CardTitle className="text-sm md:text-base text-center font-bold leading-tight">
                      {listing.isBlindBox ? listing.blindBox?.name : listing.item?.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0 space-y-3">
                    <p className="text-xs text-center opacity-80 leading-relaxed">
                      {listing.isBlindBox ? listing.blindBox?.description : listing.item?.description}
                    </p>

                    <div className="flex justify-between items-center">
                      {listing.isBlindBox ? (
                        <>
                          <Badge className="bg-amber-100 text-amber-800 border-amber-300 text-xs font-bold">
                            MYSTERY BOX
                          </Badge>
                          <Badge className="bg-orange-100 text-orange-800 border-orange-300 text-xs font-bold">
                            SURPRISE
                          </Badge>
                        </>
                      ) : (
                        <>
                          <Badge
                            variant="secondary"
                            className={cn(
                              "text-xs font-bold",
                              listing.item?.collection === "toys" && "bg-pink-100 text-pink-800 border-pink-300",
                              listing.item?.collection === "magic" && "bg-purple-100 text-purple-800 border-purple-300",
                              listing.item?.collection === "fantasy" && "bg-amber-100 text-amber-800 border-amber-300",
                              listing.item?.collection === "tech" && "bg-cyan-100 text-cyan-800 border-cyan-300",
                              listing.item?.collection === "nature" && "bg-green-100 text-green-800 border-green-300",
                              listing.item?.collection === "space" && "bg-indigo-100 text-indigo-800 border-indigo-300",
                            )}
                          >
                            {listing.item?.collection.toUpperCase()}
                          </Badge>
                          <Badge
                            variant={listing.item?.version === "hidden" ? "default" : "outline"}
                            className={cn(
                              "text-xs font-bold",
                              listing.item?.version === "hidden"
                                ? "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white border-white/30"
                                : "border-slate-300 text-slate-600",
                            )}
                          >
                            {listing.item?.version.toUpperCase()}
                          </Badge>
                        </>
                      )}
                    </div>

                    <div className="text-center space-y-2">
                      <div className="text-sm font-semibold text-slate-600">Seller: {listing.seller}</div>
                      <div className="flex items-center justify-center gap-1 mb-3">
                        <Coins className="w-4 h-4 text-amber-600" />
                        {listing.discount && listing.discount > 0 ? (
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-lg text-green-600">
                              {Math.round(listing.price * (1 - listing.discount / 100))}
                            </span>
                            <span className="text-sm line-through text-slate-500">{listing.price}</span>
                          </div>
                        ) : (
                          <span className="font-bold text-lg">{listing.price}</span>
                        )}
                        <span className="text-xs text-slate-500">({listing.quantity} available)</span>
                      </div>

                      <Button
                        onClick={() => buyItem(listing)}
                        disabled={
                          coins <
                          (listing.discount ? Math.round(listing.price * (1 - listing.discount / 100)) : listing.price)
                        }
                        className={cn(
                          "w-full font-bold shadow-lg hover:shadow-xl transition-all duration-300",
                          coins >=
                            (listing.discount
                              ? Math.round(listing.price * (1 - listing.discount / 100))
                              : listing.price)
                            ? listing.isBlindBox
                              ? "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white"
                              : "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
                            : "bg-slate-300 text-slate-500 cursor-not-allowed",
                        )}
                        size="sm"
                      >
                        {coins >=
                        (listing.discount ? Math.round(listing.price * (1 - listing.discount / 100)) : listing.price)
                          ? listing.isBlindBox
                            ? "Buy Mystery Box"
                            : "Buy Now"
                          : `Need ${(listing.discount ? Math.round(listing.price * (1 - listing.discount / 100)) : listing.price) - coins} more coins`}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredListings.length === 0 && (
              <Card className="bg-white/80 border-slate-200 shadow-lg backdrop-blur-sm">
                <CardContent className="p-16 text-center">
                  <Store className="w-20 h-20 text-slate-300 mx-auto mb-6" />
                  <h3 className="text-2xl font-bold text-slate-700 mb-3">No Items Found</h3>
                  <p className="text-slate-500 text-lg">
                    No items match your current filters. Try adjusting your search criteria.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="trades" className="space-y-6">
            {trades.length === 0 ? (
              <Card className="bg-white/80 border-slate-200 shadow-lg backdrop-blur-sm">
                <CardContent className="p-16 text-center">
                  <Users className="w-20 h-20 text-slate-300 mx-auto mb-6" />
                  <h3 className="text-2xl font-bold text-slate-700 mb-3">No Trade Offers</h3>
                  <p className="text-slate-500 text-lg">You don't have any pending trade offers.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {trades.map((trade) => (
                  <Card key={trade.id} className="bg-white/80 border-slate-200 shadow-lg backdrop-blur-sm">
                    <CardHeader>
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-slate-800 flex items-center gap-2">
                          <Users className="w-5 h-5 text-blue-600" />
                          Trade from {trade.from}
                        </CardTitle>
                        {trade.expiresIn && (
                          <Badge variant="outline" className="text-xs">
                            Expires in {trade.expiresIn}
                          </Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-6">
                        {/* Offering */}
                        <div>
                          <h4 className="text-slate-700 font-semibold mb-3 flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-green-500" />
                            They're Offering:
                          </h4>
                          <div className="grid grid-cols-2 gap-2">
                            {trade.offering.map((item, index) => (
                              <div
                                key={index}
                                className={cn(
                                  "p-3 rounded-lg text-center border-2 transition-all duration-300 hover:scale-105",
                                  "isBlindBox" in item
                                    ? "bg-gradient-to-br from-amber-50 to-orange-50 border-amber-300 text-amber-700"
                                    : "collection" in item
                                      ? COLLECTION_COLORS[item.collection]
                                      : "bg-slate-100",
                                  "version" in item && VERSION_STYLES[item.version],
                                  "collection" in item && COLLECTION_GLOW[item.collection],
                                )}
                              >
                                <div className="text-2xl mb-1">{item.emoji}</div>
                                <div className="text-xs font-semibold mb-1">{item.name}</div>
                                <div className="flex justify-center gap-1">
                                  {"isBlindBox" in item ? (
                                    <Badge className="bg-amber-100 text-amber-800 border-amber-300 text-xs">
                                      MYSTERY
                                    </Badge>
                                  ) : (
                                    <Badge
                                      variant="outline"
                                      className={cn(
                                        "text-xs",
                                        "version" in item && item.version === "hidden"
                                          ? "border-white/50 text-white bg-white/20"
                                          : "border-slate-400 text-slate-600",
                                      )}
                                    >
                                      {"collection" in item && item.collection.toUpperCase()}
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Requesting */}
                        <div>
                          <h4 className="text-slate-700 font-semibold mb-3 flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-red-500 rotate-180" />
                            They Want:
                          </h4>
                          <div className="grid grid-cols-2 gap-2">
                            {trade.requesting.map((item, index) => (
                              <div
                                key={index}
                                className={cn(
                                  "p-3 rounded-lg text-center border-2 transition-all duration-300 hover:scale-105",
                                  "isBlindBox" in item
                                    ? "bg-gradient-to-br from-amber-50 to-orange-50 border-amber-300 text-amber-700"
                                    : "collection" in item
                                      ? COLLECTION_COLORS[item.collection]
                                      : "bg-slate-100",
                                  "version" in item && VERSION_STYLES[item.version],
                                  "collection" in item && COLLECTION_GLOW[item.collection],
                                )}
                              >
                                <div className="text-2xl mb-1">{item.emoji}</div>
                                <div className="text-xs font-semibold mb-1">{item.name}</div>
                                <div className="flex justify-center gap-1">
                                  {"isBlindBox" in item ? (
                                    <Badge className="bg-amber-100 text-amber-800 border-amber-300 text-xs">
                                      MYSTERY
                                    </Badge>
                                  ) : (
                                    <Badge
                                      variant="outline"
                                      className={cn(
                                        "text-xs",
                                        "version" in item && item.version === "hidden"
                                          ? "border-white/50 text-white bg-white/20"
                                          : "border-slate-400 text-slate-600",
                                      )}
                                    >
                                      {"collection" in item && item.collection.toUpperCase()}
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-3 pt-4">
                        <Button
                          onClick={() => acceptTrade(trade)}
                          className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                          Accept Trade
                        </Button>
                        <Button
                          onClick={() => rejectTrade(trade)}
                          variant="outline"
                          className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white border-red-500 font-bold shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                          Reject
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
