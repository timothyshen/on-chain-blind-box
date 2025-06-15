import { cn } from "@/lib/utils"
import { Theme } from "@/types/theme"
import { themes } from "@/types/theme"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

interface ThemeSelectorProps {
    isOpen: boolean
    onClose: () => void
    currentTheme: Theme
    themesUsed: string[]
    onThemeChange: (theme: Theme) => void
}

export const ThemeSelector = ({
    isOpen,
    onClose,
    currentTheme,
    themesUsed,
    onThemeChange,
}: ThemeSelectorProps) => {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Select Theme</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-4 py-4">
                    {themes.map((theme) => {
                        const isUsed = themesUsed.includes(theme.id)
                        const isCurrent = currentTheme.id === theme.id

                        return (
                            <Button
                                key={theme.id}
                                variant="ghost"
                                onClick={() => onThemeChange(theme)}
                                disabled={isCurrent}
                                className={cn(
                                    "relative h-24 rounded-xl border-2 transition-all duration-300",
                                    theme.machineBg,
                                    theme.machineBorder,
                                    isCurrent && "ring-2 ring-primary",
                                    !isCurrent && "hover:scale-105 active:scale-95",
                                )}
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/10 rounded-xl" />
                                <div className="relative z-10 flex flex-col items-center justify-center gap-2">
                                    <div className="text-lg font-medium">{theme.name}</div>
                                    {!isUsed && (
                                        <div className="text-xs px-2 py-1 rounded-full bg-primary/20 text-primary">
                                            New!
                                        </div>
                                    )}
                                </div>
                            </Button>
                        )
                    })}
                </div>
            </DialogContent>
        </Dialog>
    )
} 