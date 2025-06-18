import { Coins, Sparkles, Zap } from "lucide-react"
import { cn } from "@/lib/utils"
import { GachaItem } from "@/types/gacha"
import { COLLECTION_COLORS, VERSION_STYLES } from "@/types/gacha"
import { MachineIdleEffects } from "@/components/enhanced-animations"

interface MachineBodyProps {
    isSpinning: boolean
    showBlindBoxModal: boolean
    blinkingCell: number | null
    animationPhase: "fast" | "slowing" | "landing" | "none"
    showResults: boolean
    currentResults: GachaItem[]
    leverPulled: boolean
    coins: number
    onPullGacha: () => void
}

export const MachineBody = ({
    isSpinning,
    showBlindBoxModal,
    blinkingCell,
    animationPhase,
    showResults,
    currentResults,
    leverPulled,
    coins,
    onPullGacha,
}: MachineBodyProps) => {
    return (
        <div className="relative flex flex-col items-center">
            {/* Machine Stand/Base */}
            <div
                className={cn(
                    "w-[300px] h-[90px] md:w-[360px] md:h-[110px] rounded-b-3xl border-4 shadow-2xl transition-all duration-700",
                    "bg-gradient-to-b from-pink-200 via-purple-200 to-blue-200",
                    "border-white/80",
                    "border-t-0 relative overflow-hidden",
                )}
            >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
                <div className="w-full h-full flex items-center justify-center relative z-10">
                    <div
                        className={cn(
                            "text-xl md:text-2xl font-bold tracking-[0.2em] transition-all duration-700 text-purple-700 drop-shadow-lg"
                        )}
                    >
                        PREMIUM GACHA
                    </div>
                </div>
            </div>

            {/* Main Machine Body */}
            <div
                className={cn(
                    "relative w-[360px] h-[480px] md:w-[420px] md:h-[560px] rounded-t-3xl border-4 shadow-2xl transition-all duration-700 overflow-hidden",
                    "bg-gradient-to-b from-pink-200 via-purple-200 to-blue-200",
                    "border-white/80",
                    "border-b-0",
                )}
            >
                <div className="absolute inset-0 bg-gradient-to-b from-white/5 via-transparent to-black/10 pointer-events-none"></div>

                {/* Display Window */}
                <div className="relative w-full h-[65%] p-5 flex flex-col">
                    <div
                        className=
                        "w-full h-full rounded-2xl border-4 shadow-inner overflow-hidden transition-all duration-700 relative bg-white/40 backdrop-blur-sm border-white/20"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent pointer-events-none"></div>

                        {/* Background Capsules */}
                        <div className="absolute inset-0 opacity-20">
                            {Array.from({ length: 15 }).map((_, i) => (
                                <div
                                    key={`bg-${i}`}
                                    className="absolute w-6 h-6 md:w-8 md:h-8 rounded-full border-2 shadow-lg"
                                    style={{
                                        left: `${8 + (i % 5) * 18}%`,
                                        top: `${8 + Math.floor(i / 5) * 22}%`,
                                        backgroundColor: [
                                            "#ff6b6b",
                                            "#4ecdc4",
                                            "#45b7d1",
                                            "#96ceb4",
                                            "#feca57",
                                            "#ff9ff3",
                                            "#a8e6cf",
                                        ][i % 7],
                                        borderColor: "rgba(255,255,255,0.4)",
                                        transform: `rotate(${i * 24}deg)`,
                                    }}
                                />
                            ))}
                        </div>

                        {/* Active Display Area */}
                        <div className="relative z-10 grid grid-cols-3 gap-3 h-full p-4">
                            {isSpinning && !showBlindBoxModal
                                ? Array.from({ length: 9 }).map((_, i) => (
                                    <div
                                        key={i}
                                        className={cn(
                                            "rounded-2xl flex items-center justify-center transition-all duration-200 border-2 shadow-lg",
                                            blinkingCell === i
                                                ? cn(
                                                    "bg-gradient-to-br from-amber-300 to-amber-500 border-amber-200",
                                                    "ring-4 ring-amber-400/60 shadow-xl scale-105",
                                                    animationPhase === "landing" && "scale-110",
                                                    animationPhase === "landing" && i === 4 && "scale-125",
                                                )
                                                : "bg-white/10 border-white/20 backdrop-blur-sm",
                                        )}
                                    >
                                        {blinkingCell === i ? (
                                            <Sparkles
                                                className={cn(
                                                    "w-5 h-5 md:w-6 md:h-6 text-amber-800 drop-shadow-lg",
                                                    animationPhase === "fast" && "animate-ping",
                                                    animationPhase === "landing" && i === 4 && "animate-pulse",
                                                )}
                                            />
                                        ) : (
                                            <div className="text-sm md:text-base text-white/40 font-medium">?</div>
                                        )}
                                    </div>
                                ))
                                : showResults && currentResults.length > 0
                                    ? currentResults.slice(0, 9).map((item, i) => {
                                        const isNewest = i === 0 && !showBlindBoxModal
                                        return (
                                            <div
                                                key={`${item.id}-${item.name}-${i}`}
                                                className={cn(
                                                    "rounded-2xl border-2 p-2 flex flex-col items-center justify-center text-center transition-all duration-500 shadow-lg",
                                                    COLLECTION_COLORS[item.collection],
                                                    VERSION_STYLES[item.version],
                                                    isNewest
                                                        ? "ring-4 ring-amber-400/60 scale-105 shadow-xl z-10 border-amber-300"
                                                        : "opacity-60 scale-90",
                                                    item.version === "hidden" && isNewest && "shadow-purple-500/30",
                                                    item.collection === "space" && isNewest && "animate-pulse shadow-amber-500/40",
                                                )}
                                            >
                                                <div className="text-xl md:text-2xl mb-1 drop-shadow-sm">{item.emoji}</div>
                                                {isNewest && (
                                                    <div className="text-[8px] md:text-[9px] font-bold leading-none mt-1 opacity-80">
                                                        {item.collection.charAt(0).toUpperCase()}
                                                    </div>
                                                )}
                                            </div>
                                        )
                                    })
                                    : Array.from({ length: 9 }).map((_, i) => (
                                        <div
                                            key={i}
                                            className="rounded-2xl flex items-center justify-center bg-white/10 border-2 border-white/20 backdrop-blur-sm shadow-lg"
                                        >
                                            <div className="text-sm md:text-base text-white/40 font-medium">?</div>
                                        </div>
                                    ))}
                        </div>
                    </div>
                </div>

                {/* Control Panel */}
                <div className="w-full h-[35%] p-5 flex flex-col justify-between">
                    {/* Coin Slot */}
                    <div className="flex justify-center mb-4">
                        <div
                            className=
                            "w-32 h-10 md:w-36 md:h-12 rounded-full border-2 flex items-center justify-center transition-all duration-700 shadow-inner bg-white/50 backdrop-blur-sm border-white/30"
                        >
                            <div className="font-semibold text-xs md:text-sm tracking-wide text-purple-600">
                                <Coins className="inline w-3 h-3 md:w-4 md:h-4 mr-2" />
                                INSERT COIN
                            </div>
                        </div>
                    </div>

                    {/* Turn Knob and Dispensing Area */}
                    <div className="flex justify-between items-end">
                        {/* Turn Knob */}
                        <div className="flex flex-col items-center">
                            <div className="text-xs md:text-sm text-black/60 mb-3 font-medium tracking-wide">TURN</div>
                            <button
                                onClick={onPullGacha}
                                // disabled={coins < 1 || isSpinning || showBlindBoxModal}
                                className={cn(
                                    "relative w-18 h-18 md:w-22 md:h-22 rounded-full transition-all duration-500 ease-out focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed group",
                                    "bg-gradient-to-br from-amber-300 via-yellow-400 to-amber-500",
                                    "shadow-lg hover:shadow-xl",
                                    "border-2 border-amber-200/50",
                                    leverPulled ? "rotate-90 scale-95" : "rotate-0 scale-100",
                                    !(coins < 1 || isSpinning || showBlindBoxModal) &&
                                    "hover:scale-105 hover:shadow-2xl hover:shadow-amber-500/25 active:scale-95",
                                )}
                                style={{ width: "72px", height: "72px" }}
                                aria-label="Turn Gacha Knob"
                            >
                                {/* Outer ring with metallic effect */}
                                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-slate-300 via-slate-400 to-slate-500 p-1">
                                    <div className="w-full h-full rounded-full bg-gradient-to-br from-amber-200 via-yellow-300 to-amber-400 relative overflow-hidden">
                                        {/* Inner highlight ring */}
                                        <div className="absolute inset-2 rounded-full border border-white/40 bg-gradient-to-br from-white/30 to-transparent">
                                            {/* Radial notches for grip */}
                                            <div className="w-full h-full relative">
                                                {Array.from({ length: 16 }).map((_, i) => (
                                                    <div
                                                        key={i}
                                                        className="absolute w-0.5 h-3 bg-gradient-to-b from-slate-600/60 to-slate-400/40 rounded-full"
                                                        style={{
                                                            left: "50%",
                                                            top: "4px",
                                                            transformOrigin: "50% 24px",
                                                            transform: `translateX(-50%) rotate(${i * 22.5}deg)`,
                                                        }}
                                                    />
                                                ))}
                                            </div>
                                        </div>

                                        {/* Center piece with icon */}
                                        <div className="absolute inset-4 rounded-full bg-gradient-to-br from-amber-100 via-yellow-200 to-amber-300 border border-amber-400/50 flex items-center justify-center shadow-inner">
                                            <Zap
                                                className="w-5 h-5 md:w-6 md:h-6 transition-all duration-500 drop-shadow-md text-amber-700 group-hover:scale-110 group-hover:text-amber-800"
                                            />
                                        </div>

                                        {/* Glossy highlight effect */}
                                        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/20 via-transparent to-transparent"></div>
                                    </div>
                                </div>

                                {/* Glow effect on hover */}
                                <div className="absolute inset-0 rounded-full bg-amber-400/0 group-hover:bg-amber-400/10 transition-all duration-300 group-hover:shadow-[0_0_20px_rgba(245,158,11,0.3)]"></div>
                            </button>
                        </div>

                        {/* Dispensing Chute */}
                        <div className="flex flex-col items-center">
                            <div className="text-xs md:text-sm text-green-600 mb-3 font-medium tracking-wide">PRIZE</div>
                            <div
                                className={
                                    "w-24 h-14 md:w-28 md:h-16 rounded-xl border-2 transition-all duration-700 shadow-inner flex items-center justify-center bg-white/50 backdrop-blur-sm border-white/30 backdrop-blur-sm"}
                            >
                                {showBlindBoxModal ? (
                                    <div className="text-3xl md:text-4xl animate-bounce drop-shadow-lg">📦</div>
                                ) : (
                                    <div className="text-xs md:text-sm text-gray/40 font-medium">EMPTY</div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Machine Idle Effects */}
                <MachineIdleEffects isActive={isSpinning || showBlindBoxModal} />
            </div>
        </div>
    )
} 