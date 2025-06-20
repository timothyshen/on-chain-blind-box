import { Gift, Package, Coins } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface ControlPanelProps {
    coins: number
    onAddCoin: () => void
    onOpenInventory: () => void
    onOpenMarket: () => void
}

export const ControlPanel = ({
    coins,
    onAddCoin,
    onOpenInventory,
    onOpenMarket,
}: ControlPanelProps) => {
    return (
        <div className="fixed bottom-0 left-0 right-0 p-4 flex justify-center items-center gap-2 sm:gap-4 z-50 w-full max-w-full overflow-x-auto sm:w-max sm:left-1/2 sm:transform sm:-translate-x-1/2">
            <div
                className=
                "flex items-center gap-4 px-6 py-3 rounded-2xl border-2 shadow-lg bg-white/80 backdrop-blur-md border-purple-200/50"
            >
                {/* Coin Balance */}
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={onAddCoin}
                    className={cn(
                        "flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1.5 sm:py-2 rounded-xl transition-all duration-300",
                        "bg-white/80 backdrop-blur-md flex-1 sm:flex-none",
                        "hover:scale-105 active:scale-95",
                    )}
                >
                    <Coins className="w-5 h-5" />
                    <span className="font-medium">{coins}</span>
                </Button>

                {/* Inventory Button */}
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={onOpenInventory}
                    className={cn(
                        "flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300",
                        "bg-white/80 backdrop-blur-md",
                        "hover:scale-105 active:scale-95",
                    )}
                >
                    <Package className="w-5 h-5" />
                    <span className="font-medium">Inventory</span>
                </Button>

                {/* Market Button */}
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={onOpenMarket}
                    className={cn(
                        "flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300",
                        "bg-white/80 backdrop-blur-md",
                        "hover:scale-105 active:scale-95",
                    )}
                >
                    <Gift className="w-5 h-5" />
                    <span className="font-medium">Market</span>
                </Button>

            </div>
        </div>
    )
} 