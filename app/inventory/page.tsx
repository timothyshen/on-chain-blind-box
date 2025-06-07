"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Search, Package, Crown, Star, Filter, Grid3X3, List, Sparkles } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { soundManager } from "@/utils/sounds"
import { SoundToggle } from "@/components/sound-toggle"

// Update the GachaItem interface to use collection:
interface GachaItem {
  id: string
  name: string
  collection: "toys" | "magic" | "fantasy" | "tech" | "nature" | "space"
  emoji: string
  description: string
  version: "standard" | "hidden"
}

// Enhanced version styles with better gradients
const VERSION_STYLES = {
  standard: "",
  hidden: "bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white border-white/30 shadow-xl",
}

// Replace RARITY_COLORS with COLLECTION_COLORS:
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

export default function Inventory() {
  const [inventory, setInventory] = useState<GachaItem[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  // Update the filter state and logic:
  const [selectedCollection, setSelectedCollection] = useState<string>("all")
  const [selectedVersion, setSelectedVersion] = useState<string>("all")
  const [unrevealedItems, setUnrevealedItems] = useState<GachaItem[]>([])
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [sortBy, setSortBy] = useState<"name" | "rarity" | "count" | "recent">("recent")

  useEffect(() => {
    // Initialize sound manager
    soundManager.initialize()

    const savedInventory = localStorage.getItem("gacha-inventory")
    if (savedInventory) {
      setInventory(JSON.parse(savedInventory))
    }

    const savedUnrevealed = localStorage.getItem("gacha-unrevealed")
    if (savedUnrevealed) {
      setUnrevealedItems(JSON.parse(savedUnrevealed))
    }
  }, [])

  const revealItemFromInventory = (index: number) => {
    soundManager.play("boxOpen")
    const newUnrevealed = [...unrevealedItems]
    newUnrevealed.splice(index, 1)
    setUnrevealedItems(newUnrevealed)
    localStorage.setItem("gacha-unrevealed", JSON.stringify(newUnrevealed))
  }

  const revealAllFromInventory = () => {
    soundManager.play("celebration")
    setUnrevealedItems([])
    localStorage.setItem("gacha-unrevealed", JSON.stringify([]))
  }

  // Update the groupedItems to include version in the key
  const groupedItems = inventory.reduce(
    (acc, item) => {
      const key = `${item.id}-${item.name}-${item.version}`
      if (acc[key]) {
        acc[key].count += 1
      } else {
        acc[key] = { ...item, count: 1 }
      }
      return acc
    },
    {} as Record<string, GachaItem & { count: number }>,
  )

  // Enhanced filtering and sorting
  // Update the filtering logic:
  const filteredItems = Object.values(groupedItems)
    .filter((item) => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCollection = selectedCollection === "all" || item.collection === selectedCollection
      const matchesVersion = selectedVersion === "all" || item.version === selectedVersion
      return matchesSearch && matchesCollection && matchesVersion
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name)
        case "collection":
          return a.collection.localeCompare(b.collection)
        case "count":
          return b.count - a.count
        case "recent":
        default:
          return 0
      }
    })

  const totalItems = inventory.length
  const uniqueItems = Object.keys(groupedItems).length
  const legendaryCount = Object.values(groupedItems).filter((item) => item.collection === "legendary").length
  const hiddenCount = Object.values(groupedItems).filter((item) => item.version === "hidden").length

  // Update statistics calculation:
  const collectionStats = {
    toys: Object.values(groupedItems).filter((item) => item.collection === "toys").length,
    magic: Object.values(groupedItems).filter((item) => item.collection === "magic").length,
    fantasy: Object.values(groupedItems).filter((item) => item.collection === "fantasy").length,
    tech: Object.values(groupedItems).filter((item) => item.collection === "tech").length,
    nature: Object.values(groupedItems).filter((item) => item.collection === "nature").length,
    space: Object.values(groupedItems).filter((item) => item.collection === "space").length,
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Elegant Header */}
        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-8">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button
                variant="outline"
                size="lg"
                className="bg-white/80 border-slate-200 text-slate-700 hover:bg-white backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300"
                onClick={() => soundManager.play("buttonClick")}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Gacha
              </Button>
            </Link>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-slate-800 flex items-center gap-3 tracking-tight">
                <Package className="w-8 h-8 md:w-10 md:h-10 text-blue-600 drop-shadow-lg" />
                My Collection
              </h1>
              <p className="text-lg text-slate-600 font-medium mt-1">Premium Item Collection</p>
            </div>
          </div>

          <div className="flex items-center gap-3 md:ml-auto">
            <SoundToggle isDark={false} />

            {/* View Mode Toggle */}
            <div className="flex bg-white/80 backdrop-blur-sm rounded-lg border border-slate-200 shadow-lg">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => {
                  setViewMode("grid")
                  soundManager.play("buttonClick")
                }}
                className="rounded-r-none"
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => {
                  setViewMode("list")
                  soundManager.play("buttonClick")
                }}
                className="rounded-l-none"
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
          <Card className="bg-white/80 border-slate-200 shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm">
            <CardContent className="p-4 text-center">
              <div className="text-2xl md:text-3xl font-bold text-slate-800 mb-1">{totalItems}</div>
              <div className="text-sm text-slate-600 font-medium">Total Items</div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 border-slate-200 shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm">
            <CardContent className="p-4 text-center">
              <div className="text-2xl md:text-3xl font-bold text-blue-600 mb-1">{uniqueItems}</div>
              <div className="text-sm text-slate-600 font-medium">Unique Items</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-50 to-amber-50 border-yellow-300 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-4 text-center">
              <div className="text-2xl md:text-3xl font-bold text-amber-700 mb-1 flex items-center justify-center gap-1">
                <Crown className="w-5 h-5" />
                {legendaryCount}
              </div>
              <div className="text-sm text-amber-600 font-medium">Legendary</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-300 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-4 text-center">
              <div className="text-2xl md:text-3xl font-bold text-purple-700 mb-1 flex items-center justify-center gap-1">
                <Star className="w-5 h-5" />
                {hiddenCount}
              </div>
              <div className="text-sm text-purple-600 font-medium">Hidden</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-300 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-4 text-center">
              <div className="text-2xl md:text-3xl font-bold text-purple-700 mb-1">{collectionStats.magic}</div>
              <div className="text-sm text-purple-600 font-medium">Magic</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-300 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-4 text-center">
              <div className="text-2xl md:text-3xl font-bold text-blue-700 mb-1">{collectionStats.tech}</div>
              <div className="text-sm text-blue-600 font-medium">Tech</div>
            </CardContent>
          </Card>
        </div>

        {/* Unrevealed Items Section */}
        {unrevealedItems.length > 0 && (
          <Card className="bg-gradient-to-r from-amber-50 to-orange-50 border-amber-300 mb-8 shadow-xl">
            <CardHeader>
              <CardTitle className="text-amber-800 flex items-center gap-3 text-xl">
                <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                Unrevealed Premium Boxes ({unrevealedItems.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-12 gap-3">
                {unrevealedItems.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => revealItemFromInventory(index)}
                    className="aspect-square bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl border-2 border-amber-300 cursor-pointer hover:scale-105 hover:shadow-xl transition-all duration-300 flex items-center justify-center text-3xl shadow-lg hover:from-amber-500 hover:to-amber-700"
                  >
                    📦
                  </button>
                ))}
              </div>
              <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                <Button
                  onClick={revealAllFromInventory}
                  size="lg"
                  className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  🎁 Reveal All Boxes
                </Button>
                <p className="text-amber-700 text-sm font-medium">
                  Click individual boxes to reveal them one by one, or reveal all at once
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Enhanced Filters */}
        <Card className="bg-white/80 border-slate-200 mb-8 shadow-lg backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <Input
                    placeholder="Search your collection..."
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
                    { value: "recent", label: "Recent" },
                    { value: "rarity", label: "Rarity" },
                    { value: "name", label: "Name" },
                    { value: "count", label: "Count" },
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
              {/* Update the filter buttons section: */}
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
          </CardContent>
        </Card>

        {/* Items Display */}
        {filteredItems.length === 0 ? (
          <Card className="bg-white/80 border-slate-200 shadow-lg backdrop-blur-sm">
            <CardContent className="p-16 text-center">
              <Package className="w-20 h-20 text-slate-300 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-slate-700 mb-3">No Items Found</h3>
              <p className="text-slate-500 text-lg">
                {inventory.length === 0
                  ? "Your collection is empty. Start pulling some gacha to build your collection!"
                  : "No items match your current filters. Try adjusting your search criteria."}
              </p>
            </CardContent>
          </Card>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {filteredItems.map((item, index) => (
              <Card
                key={index}
                className={cn(
                  "transition-all duration-300 cursor-pointer border-2 shadow-lg hover:shadow-xl hover:scale-105",
                  COLLECTION_COLORS[item.collection],
                  VERSION_STYLES[item.version],
                  COLLECTION_GLOW[item.collection],
                  item.collection === "legendary" && "ring-2 ring-yellow-300/50",
                )}
                onClick={() => soundManager.play("buttonClick")}
              >
                <CardHeader className="pb-3">
                  <div className="text-4xl md:text-5xl text-center mb-3 drop-shadow-sm">{item.emoji}</div>
                  <CardTitle className="text-sm md:text-base text-center font-bold leading-tight">
                    {item.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0 space-y-3">
                  <p className="text-xs text-center opacity-80 leading-relaxed">{item.description}</p>

                  <div className="flex justify-between items-center">
                    {/* Update all references to item.rarity to item.collection in the component rendering */}
                    {/* Update the Badge styling for collections: */}
                    <Badge
                      variant="secondary"
                      className={cn(
                        "text-xs font-bold",
                        item.collection === "toys" && "bg-pink-100 text-pink-800 border-pink-300",
                        item.collection === "magic" && "bg-purple-100 text-purple-800 border-purple-300",
                        item.collection === "fantasy" && "bg-amber-100 text-amber-800 border-amber-300",
                        item.collection === "tech" && "bg-cyan-100 text-cyan-800 border-cyan-300",
                        item.collection === "nature" && "bg-green-100 text-green-800 border-green-300",
                        item.collection === "space" && "bg-indigo-100 text-indigo-800 border-indigo-300",
                      )}
                    >
                      {item.collection.toUpperCase()}
                    </Badge>
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-xs font-bold",
                        item.version === "hidden"
                          ? "border-white/50 text-white bg-white/20"
                          : "border-slate-300 text-slate-600",
                      )}
                    >
                      {item.version.toUpperCase()}
                    </Badge>
                  </div>

                  <div className="text-center">
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-sm font-bold px-3 py-1",
                        item.version === "hidden"
                          ? "border-white/50 text-white bg-white/20"
                          : "border-slate-400 text-slate-700 bg-slate-50",
                      )}
                    >
                      ×{item.count}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          // List View
          <div className="space-y-3">
            {filteredItems.map((item, index) => (
              <Card
                key={index}
                className={cn(
                  "transition-all duration-300 cursor-pointer border-2 shadow-lg hover:shadow-xl",
                  COLLECTION_COLORS[item.collection],
                  VERSION_STYLES[item.version],
                  COLLECTION_GLOW[item.collection],
                  item.collection === "legendary" && "ring-2 ring-yellow-300/50",
                )}
                onClick={() => soundManager.play("buttonClick")}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="text-3xl drop-shadow-sm">{item.emoji}</div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg">{item.name}</h3>
                      <p className="text-sm opacity-80">{item.description}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      {/* Update all references to item.rarity to item.collection in the component rendering */}
                      {/* Update the Badge styling for collections: */}
                      <Badge
                        variant="secondary"
                        className={cn(
                          "font-bold",
                          item.collection === "toys" && "bg-pink-100 text-pink-800 border-pink-300",
                          item.collection === "magic" && "bg-purple-100 text-purple-800 border-purple-300",
                          item.collection === "fantasy" && "bg-amber-100 text-amber-800 border-amber-300",
                          item.collection === "tech" && "bg-cyan-100 text-cyan-800 border-cyan-300",
                          item.collection === "nature" && "bg-green-100 text-green-800 border-green-300",
                          item.collection === "space" && "bg-indigo-100 text-indigo-800 border-indigo-300",
                        )}
                      >
                        {item.collection.toUpperCase()}
                      </Badge>
                      <Badge
                        variant="outline"
                        className={cn(
                          "font-bold",
                          item.version === "hidden"
                            ? "border-white/50 text-white bg-white/20"
                            : "border-slate-300 text-slate-600",
                        )}
                      >
                        {item.version.toUpperCase()}
                      </Badge>
                      <Badge
                        variant="outline"
                        className={cn(
                          "font-bold px-3",
                          item.version === "hidden"
                            ? "border-white/50 text-white bg-white/20"
                            : "border-slate-400 text-slate-700 bg-slate-50",
                        )}
                      >
                        ×{item.count}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
