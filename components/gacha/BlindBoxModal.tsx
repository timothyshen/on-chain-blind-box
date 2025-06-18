"use client"
import { cn } from "@/lib/utils"
import { GachaItem } from "@/types/gacha"
import { COLLECTION_COLORS, VERSION_STYLES } from "@/types/gacha"
import {
    Dialog,
    DialogContent,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Share } from "lucide-react"
import { soundManager } from "@/utils/sounds"
import { shareToTwitter } from "@/utils/twitter-share"
import { useNotifications } from "@/contexts/notification-context"

interface BlindBoxModalProps {
    isOpen: boolean
    onClose: () => void
    item: GachaItem
    onReveal: () => void
    isRevealed: boolean
}

export const BlindBoxModal = ({
    isOpen,
    onClose,
    item,
    onReveal,
    isRevealed,
}: BlindBoxModalProps) => {
    const { addNotification } = useNotifications();
    const handleShare = () => {
        if (item) {
            // Play button click sound
            soundManager.play("buttonClick")
            shareToTwitter(item, false)

            addNotification({
                type: "info",
                title: "Shared to Twitter!",
                message: "Show off your amazing pull!",
                icon: "🐦",
                duration: 3000,
            })
        }
    }
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-lg w-full shadow-2xl transition-all duration-700 border-0 items-center justify-center z-50 p-4 backdrop-blur-lg">
                {!isRevealed ? (
                    // Enhanced Blind Box State
                    <div className="mb-8">
                        <div className="text-6xl md:text-7xl mb-6 animate-bounce drop-shadow-lg">📦</div>
                        <h2
                            className="text-2xl md:text-3xl font-bold mb-3 text-black"
                        >
                            Mystery Premium Box
                        </h2>
                        <p
                            className={cn(
                                "mb-6 text-base md:text-lg font-medium",
                                "text-black"
                            )}
                        >
                            What treasures await inside? Open to discover your prize!
                        </p>
                        <Badge
                            className={cn(
                                "text-sm md:text-base px-4 py-2 font-bold",
                                "bg-slate-100 text-slate-800 border-slate-300"
                            )}
                        >
                            🎁 PREMIUM MYSTERY BOX
                        </Badge>
                    </div>
                ) : (
                    // Enhanced Revealed Item State
                    <div className="mb-8">
                        <div className="box-opening mb-6">
                            <div className="text-6xl md:text-7xl mb-4 drop-shadow-lg">📦</div>
                        </div>
                        <div className="item-reveal">
                            <div
                                className={cn(
                                    "mx-auto w-32 h-32 md:w-40 md:h-40 rounded-2xl border-4 p-6 md:p-8 flex flex-col items-center justify-center mb-6 transition-all duration-500 shadow-xl",
                                    COLLECTION_COLORS[item.collection],
                                    VERSION_STYLES[item.version],
                                    item.collection === "space" && "legendary-glow",
                                )}
                            >
                                <div className="text-4xl md:text-5xl mb-2 drop-shadow-lg">{item.emoji}</div>
                                <div className="text-xs md:text-sm font-bold text-center leading-tight">
                                    {item.name}
                                </div>
                            </div>
                            <h2
                                className={cn(
                                    "text-2xl md:text-3xl font-bold mb-3",
                                    "text-white",
                                    item.collection === "space" && "text-amber-400",
                                )}
                            >
                                {item.name}
                            </h2>
                            <p
                                className={cn(
                                    "mb-4 text-base md:text-lg font-medium",
                                    "text-slate-300/80"
                                )}
                            >
                                {item.description}
                            </p>
                            <div className="flex justify-center gap-3 mb-4">
                                <Badge variant="secondary" className="text-sm font-bold px-3 py-1">
                                    {item.collection.toUpperCase()}
                                </Badge>
                                <Badge
                                    variant={item.version === "hidden" ? "default" : "outline"}
                                    className={`text-sm font-bold px-3 py-1 ${item.version === "hidden" ? "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white" : ""}`}
                                >
                                    {item.version.toUpperCase()}
                                </Badge>
                            </div>
                            {/* {isNewItem ? (
                                        <Badge
                                            className="text-sm md:text-base px-4 py-2 font-bold bg-green-500/20 text-green-300 border-green-500/50"
                                        >
                                            ✨ NEW DISCOVERY!
                                        </Badge>
                                    ) : (
                                        <Badge
                                            className="text-sm md:text-base px-4 py-2 font-bold bg-blue-500/20 text-blue-300 border-blue-500/50"
                                        >
                                            📚 Already in Collection
                                        </Badge>
                                    )} */}
                        </div>
                    </div>
                )}

                <div className="space-y-4">
                    {!isRevealed ? (
                        <Button
                            onClick={onReveal}
                            size="lg"
                            className="w-full bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                            🎁 Open Premium Box
                        </Button>
                    ) : (
                        <>
                            {/* Enhanced Share Button */}
                            <Button
                                onClick={handleShare}
                                size="lg"
                                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold text-lg flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transition-all duration-300"
                            >
                                <Share className="w-5 h-5" />
                                Share Your Prize
                            </Button>

                            {/* Enhanced Continue Button */}
                            <Button
                                onClick={onClose}
                                size="lg"
                                className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                            >
                                ✨ Continue Playing
                            </Button>
                        </>
                    )}

                    {/* Enhanced Skip Button */}
                    <Button
                        onClick={onClose}
                        variant="outline"
                        size="lg"
                        className={cn(
                            "w-full text-base font-medium transition-all duration-300",
                            "border-slate-300 hover:bg-slate-100 text-slate-700 backdrop-blur-sm"
                        )}
                    >
                        {isRevealed ? "Skip Sharing" : "🎰 Continue Gacha"}
                    </Button>
                </div>
            </DialogContent >
        </Dialog >
    )
} 