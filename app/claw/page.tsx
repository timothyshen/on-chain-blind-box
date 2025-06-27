"use client"

import ClawMachine from "@/components/claw/claw-machine"
import { MachineHeader } from "@/components/gacha/MachineHeader"
import { Footer } from "@/components/footer"

export default function Page() {
  return (
    <div>
      <MachineHeader />
      <ClawMachine />
      <Footer />
    </div>
  )
}
