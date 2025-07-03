import { GachaMachine } from "@/components/gacha/GachaMachine"
import { NotificationContainer } from "@/components/notification-system"
import { NotificationProvider } from "@/contexts/notification-context"

export default function Home() {
  return (
    <NotificationProvider>
      
      <GachaMachine />
      <NotificationContainer />
    </NotificationProvider>
  )
}
