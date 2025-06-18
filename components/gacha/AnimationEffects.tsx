import { cn } from "@/lib/utils"
import { GachaItem } from "@/types/gacha"
import { COLLECTION_COLORS, VERSION_STYLES } from "@/types/gacha"

interface AnimationEffectsProps {
    showCelebration: boolean
    showItemEntrance: boolean
    currentItem: GachaItem | null
}

export const AnimationEffects = ({
    showCelebration,
    showItemEntrance,
    currentItem,
}: AnimationEffectsProps) => {
    return (
        <>
            {/* Celebration Effect */}
            {showCelebration && (
                <div className="fixed inset-0 pointer-events-none z-50">
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/20 to-transparent animate-pulse" />
                    {Array.from({ length: 20 }).map((_, i) => (
                        <div
                            key={i}
                            className="absolute w-2 h-2 rounded-full bg-primary animate-confetti"
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                                animationDelay: `${Math.random() * 2}s`,
                                animationDuration: `${1 + Math.random() * 2}s`,
                            }}
                        />
                    ))}
                </div>
            )}

            {/* Item Entrance Effect */}
            {showItemEntrance && currentItem && (
                <div className="fixed inset-0 pointer-events-none z-50">
                    <div
                        className={cn(
                            "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-xl border-2 p-4 flex flex-col items-center justify-center text-center animate-item-entrance",
                            COLLECTION_COLORS[currentItem.collection],
                            VERSION_STYLES[currentItem.version],
                        )}
                    >
                        <div className="text-4xl mb-2 drop-shadow-lg">{currentItem.emoji}</div>
                        <div className="text-sm font-medium">{currentItem.name}</div>
                        <div className="text-xs opacity-80 mt-1">{currentItem.collection}</div>
                    </div>
                </div>
            )}
        </>
    )
} 