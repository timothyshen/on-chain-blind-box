import { cn } from "@/lib/utils"
import { Theme } from "@/types/theme"

interface MachineIdleEffectsProps {
    theme: Theme
    isActive: boolean
}

export const MachineIdleEffects = ({ theme, isActive }: MachineIdleEffectsProps) => {
    return (
        <div className="absolute inset-0 pointer-events-none">
            {/* Ambient Light Effect */}
            <div
                className={cn(
                    "absolute inset-0 opacity-20 transition-opacity duration-1000",
                    isActive ? "opacity-30" : "opacity-10",
                )}
                style={{
                    background: `radial-gradient(circle at 50% 50%, ${theme.ambientLightColor} 0%, transparent 70%)`,
                }}
            />

            {/* Particle Effects */}
            {Array.from({ length: 20 }).map((_, i) => (
                <div
                    key={i}
                    className={cn(
                        "absolute w-1 h-1 rounded-full transition-all duration-1000",
                        theme.particleColor,
                        isActive ? "opacity-40" : "opacity-20",
                    )}
                    style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        animation: `float ${2 + Math.random() * 3}s ease-in-out infinite`,
                        animationDelay: `${Math.random() * 2}s`,
                    }}
                />
            ))}

            {/* Glow Effect */}
            <div
                className={cn(
                    "absolute inset-0 transition-opacity duration-1000",
                    isActive ? "opacity-30" : "opacity-10",
                )}
                style={{
                    background: `radial-gradient(circle at 50% 50%, ${theme.glowColor} 0%, transparent 70%)`,
                }}
            />
        </div>
    )
} 