import InventoryPage from "@/components/inventory/InventoryPage"
import { NotificationProvider } from "@/contexts/notification-context"
import { NotificationContainer } from "@/components/notification-system"

export default function Home() {

  return (
    <NotificationProvider>
      <InventoryPage />
      <NotificationContainer />
    </NotificationProvider>
  )
}
