"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Package } from "lucide-react"
import { cn } from "@/lib/utils"
import { soundManager } from "@/utils/sounds"
import { GachaItemWithCount, COLLECTION_COLORS, VERSION_STYLES, COLLECTION_GLOW } from "./types"

interface GridViewProps {
    items: GachaItemWithCount[]
    inventoryLength: number
}

export function GridView({ items, inventoryLength }: GridViewProps) {
    if (items.length === 0) {
        return (
            <Card className="bg-white/80 border-slate-200 shadow-lg backdrop-blur-sm">
                <CardContent className="p-16 text-center">
                    <Package className="w-20 h-20 text-slate-300 mx-auto mb-6" />
                    <h3 className="text-2xl font-bold text-slate-700 mb-3">No Items Found</h3>
                    <p className="text-slate-500 text-lg">
                        {inventoryLength === 0
                            ? "Your collection is empty. Start pulling some gacha to build your collection!"
                            : "No items match your current filters. Try adjusting your search criteria."}
                    </p>
                </CardContent>
            </Card>
        )
    }

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {items.map((item, index) => (
                <Card
                    key={index}
                    className={cn(
                        "transition-all duration-300 cursor-pointer border-2 shadow-lg hover:shadow-xl hover:scale-105",
                        COLLECTION_COLORS.ippy,
                        VERSION_STYLES[item.version],
                        COLLECTION_GLOW.ippy,
                        item.collection === "ippy" && "ring-2 ring-indigo-300/50",
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
                            <Badge
                                variant="secondary"
                                className="text-xs font-bold bg-pink-100 text-pink-800 border-pink-300"
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
    )
} 