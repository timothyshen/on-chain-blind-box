"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, Sparkles } from "lucide-react"
import { soundManager } from "@/utils/sounds"
import { GachaItem } from "./types"

interface BlindBoxTabProps {
    unrevealedItems: GachaItem[]
    onRevealItem: (index: number) => void
}

export function BlindBoxTab({ unrevealedItems, onRevealItem }: BlindBoxTabProps) {
    const handleRevealItem = (index: number) => {
        soundManager.play("boxOpen")
        onRevealItem(index)
    }

    if (unrevealedItems.length === 0) {
        return (
            <Card className="bg-white/80 border-slate-200 shadow-lg backdrop-blur-sm">
                <CardContent className="p-16 text-center">
                    <Package className="w-20 h-20 text-slate-300 mx-auto mb-6" />
                    <h3 className="text-2xl font-bold text-slate-700 mb-3">No Blind Boxes</h3>
                    <p className="text-slate-500 text-lg">
                        You don&apos;t have any unrevealed blind boxes. Pull some gacha to get new boxes!
                    </p>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="bg-gradient-to-r from-amber-50 to-orange-50 border-amber-300 shadow-xl">
            <CardHeader>
                <CardTitle className="text-amber-800 flex items-center gap-3 text-xl">
                    <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center">
                        <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    Designer Blind Boxes ({unrevealedItems.length})
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-12 gap-3">
                    {unrevealedItems.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => handleRevealItem(index)}
                            className="aspect-square bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl border-2 border-amber-300 cursor-pointer hover:scale-105 hover:shadow-xl transition-all duration-300 flex items-center justify-center text-3xl shadow-lg hover:from-amber-500 hover:to-amber-700"
                        >
                            📦
                        </button>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
} 