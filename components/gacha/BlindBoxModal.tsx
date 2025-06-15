import { Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import { Theme } from "@/types/theme"
import { GachaItem } from "@/types/gacha"
import { COLLECTION_COLORS, VERSION_STYLES } from "@/types/gacha"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface BlindBoxModalProps {
    isOpen: boolean
    onClose: () => void
    theme: Theme
    item: GachaItem
    onReveal: () => void
    isRevealed: boolean
}

export const BlindBoxModal = ({
    isOpen,
    onClose,
    theme,
    item,
    onReveal,
    isRevealed,
}: BlindBoxModalProps) => {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Blind Box</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col items-center gap-6 py-4">
                    {/* Box Animation */}
                    <div
                        className={cn(
                            "relative w-48 h-48 rounded-2xl border-4 shadow-xl transition-all duration-500",
                            theme.blindBoxBg,
                            theme.blindBoxBorder,
                            isRevealed && "scale-90 opacity-50",
                        )}
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-black/10 rounded-xl" />
                        <div className="absolute inset-0 flex items-center justify-center">
                            {isRevealed ? (
                                <div
                                    className={cn(
                                        "w-32 h-32 rounded-xl border-2 p-4 flex flex-col items-center justify-center text-center transition-all duration-500",
                                        COLLECTION_COLORS[item.collection],
                                        VERSION_STYLES[item.version],
                                        "scale-110",
                                    )}
                                >
                                    <div className="text-4xl mb-2 drop-shadow-lg">{item.emoji}</div>
                                    <div className="text-sm font-medium">{item.name}</div>
                                    <div className="text-xs opacity-80 mt-1">{item.collection}</div>
                                </div>
                            ) : (
                                <div className="text-6xl animate-bounce drop-shadow-lg">📦</div>
                            )}
                        </div>
                    </div>

                    {/* Reveal Button */}
                    {!isRevealed && (
                        <Button
                            onClick={onReveal}
                            className={cn(
                                "relative px-8 py-6 rounded-xl transition-all duration-300",
                                theme.revealButtonBg,
                                "hover:scale-105 active:scale-95",
                            )}
                        >
                            <Sparkles className="w-6 h-6 mr-2" />
                            <span className="text-lg font-medium">Reveal Item</span>
                        </Button>
                    )}

                    {/* Item Description */}
                    {isRevealed && (
                        <div className="text-center">
                            <p className="text-lg font-medium mb-2">{item.name}</p>
                            <p className="text-sm text-muted-foreground">{item.description}</p>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
} 