import { Coins } from "lucide-react"
import { cn } from "@/lib/utils"
import { Theme } from "@/types/theme"

interface CoinBalanceProps {
    theme: Theme
    coins: number
    onAddCoin: () => void
}

export const CoinBalance = ({ theme, coins, onAddCoin }: CoinBalanceProps) => {
    return (
        <div
            className={cn(
                "fixed top-4 right-4 px-4 py-2 rounded-xl border-2 shadow-lg backdrop-blur-md flex items-center gap-2 transition-all duration-300",
                theme.coinBalanceBg,
                theme.coinBalanceBorder,
                "hover:scale-105 active:scale-95 cursor-pointer",
            )}
            onClick={onAddCoin}
        >
            <Coins className="w-5 h-5" />
            <span className="font-medium">{coins}</span>
        </div>
    )
} 