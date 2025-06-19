"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Package, Bookmark } from "lucide-react"
import { soundManager } from "@/utils/sounds"

// Import all the new components
import { InventoryHeader } from "@/components/inventory/InventoryHeader"
import { InventoryStats } from "@/components/inventory/InventoryStats"
import { BlindBoxTab } from "@/components/inventory/BlindBoxTab"
import { CollectionFilters } from "@/components/inventory/CollectionFilters"
import { CollectionView } from "@/components/inventory/CollectionView"
import { GridView } from "@/components/inventory/GridView"
import { ListView } from "@/components/inventory/ListView"
import { CollectionModal } from "@/components/inventory/CollectionModal"

// Import types and constants
import {
  GachaItem,
  GachaItemWithCount,
  ViewMode,
  SortBy,
  CollectionStats,
  COLLECTION_TOTALS,
} from "@/components/inventory/types"

export default function Inventory() {
  const [inventory, setInventory] = useState<GachaItem[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCollection, setSelectedCollection] = useState<string>("all")
  const [selectedVersion, setSelectedVersion] = useState<string>("all")
  const [unrevealedItems, setUnrevealedItems] = useState<GachaItem[]>([])
  const [viewMode, setViewMode] = useState<ViewMode>("collection")
  const [sortBy, setSortBy] = useState<SortBy>("recent")
  const [showCollectionModal, setShowCollectionModal] = useState(false)
  const [selectedCollectionDetail, setSelectedCollectionDetail] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<"blindbox" | "collection">("blindbox")

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
    const newUnrevealed = [...unrevealedItems]
    newUnrevealed.splice(index, 1)
    setUnrevealedItems(newUnrevealed)
    localStorage.setItem("gacha-unrevealed", JSON.stringify(newUnrevealed))
  }

  const revealAllFromInventory = () => {
    setUnrevealedItems([])
    localStorage.setItem("gacha-unrevealed", JSON.stringify([]))
  }

  // Create a proper grouping that treats each version as a separate item
  const getUniqueItems = (): GachaItemWithCount[] => {
    const itemMap = new Map<string, GachaItemWithCount>()

    inventory.forEach((item) => {
      // Create a unique key that includes both id and version
      const key = `${item.id}-${item.version}`

      if (itemMap.has(key)) {
        itemMap.get(key)!.count += 1
      } else {
        itemMap.set(key, { ...item, count: 1 })
      }
    })

    return Array.from(itemMap.values())
  }

  // Enhanced filtering and sorting
  const filteredItems = getUniqueItems()
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
  const uniqueItems = getUniqueItems().length
  const hiddenCount = getUniqueItems().filter((item) => item.version === "hidden").length

  // Update statistics calculation to count unique items properly:
  const collectionStats: CollectionStats = {
    toys: getUniqueItems().filter((item) => item.collection === "toys").length,
    magic: getUniqueItems().filter((item) => item.collection === "magic").length,
    fantasy: getUniqueItems().filter((item) => item.collection === "fantasy").length,
    tech: getUniqueItems().filter((item) => item.collection === "tech").length,
    nature: getUniqueItems().filter((item) => item.collection === "nature").length,
    space: getUniqueItems().filter((item) => item.collection === "space").length,
  }

  const collectionCompletionPercentage: CollectionStats = {
    toys: Math.round((collectionStats.toys / (COLLECTION_TOTALS.toys * 2)) * 100), // *2 for standard and hidden
    magic: Math.round((collectionStats.magic / (COLLECTION_TOTALS.magic * 2)) * 100),
    fantasy: Math.round((collectionStats.fantasy / (COLLECTION_TOTALS.fantasy * 2)) * 100),
    tech: Math.round((collectionStats.tech / (COLLECTION_TOTALS.tech * 2)) * 100),
    nature: Math.round((collectionStats.nature / (COLLECTION_TOTALS.nature * 2)) * 100),
    space: Math.round((collectionStats.space / (COLLECTION_TOTALS.space * 2)) * 100),
  }

  // Get items for a specific collection
  const getCollectionItems = (collection: string): GachaItemWithCount[] => {
    return getUniqueItems().filter((item) => item.collection === collection)
  }

  // Open collection detail modal
  const openCollectionDetail = (collection: string) => {
    setSelectedCollectionDetail(collection)
    setShowCollectionModal(true)
  }

  const renderCollectionContent = () => {
    if (viewMode === "collection") {
      return (
        <CollectionView
          collectionStats={collectionStats}
          collectionCompletionPercentage={collectionCompletionPercentage}
          getCollectionItems={getCollectionItems}
          onOpenCollectionDetail={openCollectionDetail}
        />
      )
    }

    if (viewMode === "grid") {
      return <GridView items={filteredItems} inventoryLength={inventory.length} />
    }

    if (viewMode === "list") {
      return <ListView items={filteredItems} inventoryLength={inventory.length} />
    }

    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 p-4">
      <div className="max-w-7xl mx-auto">
        <InventoryHeader />

        <InventoryStats
          totalItems={totalItems}
          uniqueItems={uniqueItems}
          hiddenCount={hiddenCount}
          collectionStats={collectionStats}
        />

        {/* Main Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as "blindbox" | "collection")}
          className="space-y-6"
        >
          <TabsList className="bg-white/80 border-slate-200 shadow-lg backdrop-blur-sm">
            <TabsTrigger
              value="blindbox"
              className="data-[state=active]:bg-amber-600 data-[state=active]:text-white"
              onClick={() => soundManager.play("buttonClick")}
            >
              <Package className="w-4 h-4 mr-2" />
              Blind Boxes ({unrevealedItems.length})
            </TabsTrigger>
            <TabsTrigger
              value="collection"
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
              onClick={() => soundManager.play("buttonClick")}
            >
              <Bookmark className="w-4 h-4 mr-2" />
              Collection ({uniqueItems})
            </TabsTrigger>
          </TabsList>

          {/* Blind Box Tab */}
          <TabsContent value="blindbox" className="space-y-6">
            <BlindBoxTab
              unrevealedItems={unrevealedItems}
              onRevealItem={revealItemFromInventory}
              onRevealAll={revealAllFromInventory}
            />
          </TabsContent>

          {/* Collection Tab */}
          <TabsContent value="collection" className="space-y-6">
            <CollectionFilters
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              selectedCollection={selectedCollection}
              onCollectionChange={setSelectedCollection}
              selectedVersion={selectedVersion}
              onVersionChange={setSelectedVersion}
              sortBy={sortBy}
              onSortChange={setSortBy}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
            />

            {renderCollectionContent()}
          </TabsContent>
        </Tabs>

        {/* Collection Detail Modal */}
        <CollectionModal
          selectedCollectionDetail={selectedCollectionDetail}
          showModal={showCollectionModal}
          onClose={() => setShowCollectionModal(false)}
          collectionStats={collectionStats}
          collectionCompletionPercentage={collectionCompletionPercentage}
          getCollectionItems={getCollectionItems}
        />
      </div>
    </div>
  )
}
