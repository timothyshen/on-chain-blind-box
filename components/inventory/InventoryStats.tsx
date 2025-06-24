"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Star } from "lucide-react"

interface InventoryStatsProps {
    totalItems: number
    uniqueItems: number
    hiddenCount: number
}

export function InventoryStats({ totalItems, uniqueItems, hiddenCount }: InventoryStatsProps) {
    return (
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

            <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-300 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-4 text-center">
                    <div className="text-2xl md:text-3xl font-bold text-indigo-700 mb-1 flex items-center justify-center gap-1">
                        <Star className="w-5 h-5" />
                        {hiddenCount}
                    </div>
                    <div className="text-sm text-indigo-600 font-medium">Hidden Variants</div>
                </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-300 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-4 text-center">
                    <div className="text-2xl md:text-3xl font-bold text-purple-700 mb-1">0</div>
                    <div className="text-sm text-purple-600 font-medium">IPPY Collection</div>
                </CardContent>
            </Card>
        </div>
    )
} 