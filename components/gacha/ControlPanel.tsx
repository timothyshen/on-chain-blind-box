import { Gift, Package, Coins } from "lucide-react"
import { cn } from "@/lib/utils"
import { Theme } from "@/types/theme"
import { Button } from "@/components/ui/button"

interface ControlPanelProps {
    theme: Theme
    coins: number
    onAddCoin: () => void
    onOpenInventory: () => void
    onOpenMarket: () => void
}

export const ControlPanel = ({
    theme,
    coins,
    onAddCoin,
    onOpenInventory,
    onOpenMarket,
}: ControlPanelProps) => {
    return (
        <div className="fixed bottom-0 left-0 right-0 p-4 flex justify-center items-center gap-4 z-50">
            <div
                className={cn(
                    "flex items-center gap-4 px-6 py-3 rounded-2xl border-2 shadow-lg backdrop-blur-md",
                    theme.controlPanelBg,
                    theme.controlPanelBorder,
                )}
            >
                {/* Coin Balance */}
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={onAddCoin}
                    className={cn(
                        "flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300",
                        theme.controlPanelButtonBg,
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
                        theme.controlPanelButtonBg,
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
                        theme.controlPanelButtonBg,
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