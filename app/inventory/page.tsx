"use client"

import { useEffect } from "react"
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

// Import custom hooks
import { useInventoryLogic } from "@/hooks/useInventoryLogic"
import { useInventoryFilters } from "@/hooks/useInventoryFilters"

export default function Inventory() {
  // Use the inventory logic hook
  const {
    inventory,
    unrevealedItems,
    totalItems,
    uniqueItems,
    hiddenCount,
    collectionStats,
    collectionCompletionPercentage,
    getCollectionItems,
    getFilteredItems,
    revealItemFromInventory,
    revealAllFromInventory,
  } = useInventoryLogic()

  // Use the inventory filters hook
  const {
    searchTerm,
    setSearchTerm,
    selectedCollection,
    setSelectedCollection,
    selectedVersion,
    setSelectedVersion,
    viewMode,
    setViewMode,
    sortBy,
    setSortBy,
    showCollectionModal,
    selectedCollectionDetail,
    activeTab,
    setActiveTab,
    openCollectionDetail,
    closeCollectionModal,
  } = useInventoryFilters()

  useEffect(() => {
    // Initialize sound manager
    soundManager.initialize()
  }, [])

  // Get filtered items based on current filters
  const filteredItems = getFilteredItems(searchTerm, selectedCollection, selectedVersion, sortBy)

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
          onClose={closeCollectionModal}
          collectionStats={collectionStats}
          collectionCompletionPercentage={collectionCompletionPercentage}
          getCollectionItems={getCollectionItems}
        />
      </div>
    </div>
  )
}
