"use client"
import { useGachaMachine } from "@/hooks/useGachaMachine"
import { useInventory } from "@/hooks/useInventory"
import { MachineHeader } from "./MachineHeader"
import { MachineBody } from "./MachineBody"
import { ControlPanel } from "./ControlPanel"
import { BlindBoxModal } from "./BlindBoxModal"
import { AnimationEffects } from "./AnimationEffects"

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
        currentBlindBox,
        pullGacha,
        addCoin,
        revealBlindBox,
        closeModalAndReset,
    } = useGachaMachine()

    const { addToInventory } = useInventory()


    const handlePullGacha = () => {
        pullGacha()
    }

    const handleRevealBlindBox = () => {
        revealBlindBox()
        if (currentBlindBox) {
            addToInventory(currentBlindBox)
        }
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
            <MachineHeader />
            <MachineBody
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
                coins={coins}
                onAddCoin={addCoin}
                onOpenInventory={() => { }}
                onOpenMarket={() => { }}
            />
            <BlindBoxModal
                isOpen={showBlindBoxModal}
                onClose={closeModalAndReset}
                item={currentBlindBox!}
                onReveal={handleRevealBlindBox}
                isRevealed={showResults}
            />
            <AnimationEffects
                showCelebration={showCelebration}
                showItemEntrance={showItemEntrance}
                currentItem={currentBlindBox}
            />
        </div>
    )
} 