"use client"

import { Button } from "@/components/ui/button"
import { ArrowLeft, Package } from "lucide-react"
import Link from "next/link"
import { soundManager } from "@/utils/sounds"
import { SoundToggle } from "@/components/sound-toggle"

export function InventoryHeader() {
    return (
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
                        Designer Collection
                    </h1>
                    <p className="text-lg text-slate-600 font-medium mt-1">Premium Collectible Showcase</p>
                </div>
            </div>

            <div className="flex items-center gap-3 md:ml-auto">
                <SoundToggle />
            </div>
        </div>
    )
} 