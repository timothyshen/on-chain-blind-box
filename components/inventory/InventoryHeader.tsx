"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { ArrowLeft, Package, User } from "lucide-react"
import Link from "next/link"
import { SoundToggle } from "@/components/sound-toggle"
import { usePrivy } from "@privy-io/react-auth"


export function InventoryHeader() {
    const { login, logout, user } = usePrivy()

    const sliceAddress = (address: string) => {
        return `${address.slice(0, 6)}...${address.slice(-4)}`
    }
    return (
        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-8">
            <div className="flex items-center gap-4">
                <Link href="/">
                    <Button
                        variant="outline"
                        size="lg"
                        className="bg-white/80 border-slate-200 text-slate-700 hover:bg-white backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                        <ArrowLeft className="w-4 h-4" />
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
                {user && (
                    <div className="px-3 py-2 border-1 border-slate-200 rounded-md text-sm bg-white/80 backdrop-blur-sm md:text-base font-medium transition-all duration-300 shadow-lg hover:shadow-xl">
                        {sliceAddress(user?.wallet?.address || "")}
                    </div>
                )}
                <Button
                    variant="outline"
                    size="lg"
                    className={cn(
                        "text-sm md:text-base font-medium transition-all duration-300 shadow-lg hover:shadow-xl",
                        "bg-white/80 border-slate-200 text-slate-700 hover:bg-white backdrop-blur-sm",
                    )}
                    onClick={user ? logout : login}
                >
                    <User className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                    {user ? "Logout" : "Login"}
                </Button>
            </div>
        </div>
    )
} 