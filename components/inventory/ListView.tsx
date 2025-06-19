"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Package } from "lucide-react"
import { cn } from "@/lib/utils"
import { soundManager } from "@/utils/sounds"
import { GachaItemWithCount, COLLECTION_COLORS, VERSION_STYLES, COLLECTION_GLOW } from "./types"

interface ListViewProps {
    items: GachaItemWithCount[]
    inventoryLength: number
}

export function ListView({ items, inventoryLength }: ListViewProps) {
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
        <div className="space-y-3">
            {items.map((item, index) => (
                <Card
                    key={index}
                    className={cn(
                        "transition-all duration-300 cursor-pointer border-2 shadow-lg hover:shadow-xl",
                        COLLECTION_COLORS[item.collection],
                        VERSION_STYLES[item.version],
                        COLLECTION_GLOW[item.collection],
                        item.collection === "space" && "ring-2 ring-indigo-300/50",
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
    )
} 