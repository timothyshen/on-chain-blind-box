"use client"
import { useState } from "react"
import { useGachaMachine } from "@/hooks/useGachaMachine"
import { useTheme } from "@/hooks/useTheme"
import { useSound } from "@/hooks/useSound"
import { useAchievements } from "@/hooks/useAchievements"
import { useInventory } from "@/hooks/useInventory"
import { MachineHeader } from "./MachineHeader"
import { MachineBody } from "./MachineBody"
import { ControlPanel } from "./ControlPanel"
import { ThemeSelector } from "./ThemeSelector"
import { CoinBalance } from "./CoinBalance"
import { BlindBoxModal } from "./BlindBoxModal"
import { AnimationEffects } from "./AnimationEffects"
import { Theme } from "@/types/theme"

export const GachaMachine = () => {
    const {
        coins,
        isSpinning,
        currentResults,
        showBlindBoxModal,
        blinkingCell,
        animationPhase,
        showResults,
        leverPulled,
        showCelebration,
        showItemEntrance,
        currentItem,
        pullGacha,
        addCoin,
        revealBlindBox,
        closeModalAndReset,
    } = useGachaMachine()

    const { currentTheme, changeTheme, } = useTheme()
    const { playThemeChange } = useSound()
    const { checkForAchievements } = useAchievements()
    const { addToInventory } = useInventory()


    const handleThemeChange = (theme: Theme) => {
        changeTheme(theme)
        playThemeChange(theme.id)
        setShowThemeSelector(false)
    }

    const handlePullGacha = () => {
        pullGacha()
        checkForAchievements()
    }

    const handleRevealBlindBox = () => {
        revealBlindBox()
        if (currentItem) {
            addToInventory(currentItem)
        }
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
            <MachineHeader theme={currentTheme} />
            <MachineBody
                theme={currentTheme}
                isSpinning={isSpinning}
                showBlindBoxModal={showBlindBoxModal}
                blinkingCell={blinkingCell}
                animationPhase={animationPhase}
                showResults={showResults}
                currentResults={currentResults}
                leverPulled={leverPulled}
                coins={coins}
                onPullGacha={handlePullGacha}
            />
            <ControlPanel
                theme={currentTheme}
                coins={coins}
                onAddCoin={addCoin}
                onOpenInventory={() => { }}
                onOpenMarket={() => { }}
            />
            <CoinBalance theme={currentTheme} coins={coins} onAddCoin={addCoin} />
            <BlindBoxModal
                isOpen={showBlindBoxModal}
                onClose={closeModalAndReset}
                theme={currentTheme}
                item={currentItem!}
                onReveal={handleRevealBlindBox}
                isRevealed={showResults}
            />
            <AnimationEffects
                theme={currentTheme}
                showCelebration={showCelebration}
                showItemEntrance={showItemEntrance}
                currentItem={currentItem}
            />
        </div>
    )
} 