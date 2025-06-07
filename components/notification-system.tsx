"use client"

import { useEffect, useState } from "react"
import { X, Trophy, AlertTriangle, Info, CheckCircle, XCircle, Zap, Star, Crown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { useNotifications, type Notification } from "@/contexts/notification-context"

const NotificationIcon = ({ type, icon }: { type: Notification["type"]; icon?: string }) => {
  if (icon) {
    return <span className="text-2xl">{icon}</span>
  }

  const iconMap = {
    success: <CheckCircle className="w-5 h-5" />,
    warning: <AlertTriangle className="w-5 h-5" />,
    info: <Info className="w-5 h-5" />,
    error: <XCircle className="w-5 h-5" />,
    achievement: <Trophy className="w-5 h-5" />,
    pity: <Zap className="w-5 h-5" />,
    collection: <Star className="w-5 h-5" />,
    legendary: <Crown className="w-5 h-5" />,
  }

  return iconMap[type]
}

const NotificationCard = ({ notification, onRemove }: { notification: Notification; onRemove: () => void }) => {
  const [isVisible, setIsVisible] = useState(false)
  const [isLeaving, setIsLeaving] = useState(false)

  useEffect(() => {
    // Trigger entrance animation
    const timer = setTimeout(() => setIsVisible(true), 50)
    return () => clearTimeout(timer)
  }, [])

  const handleRemove = () => {
    setIsLeaving(true)
    setTimeout(onRemove, 300) // Wait for exit animation
  }

  const typeStyles = {
    success: "bg-green-500/90 border-green-400 text-white",
    warning: "bg-yellow-500/90 border-yellow-400 text-black",
    info: "bg-blue-500/90 border-blue-400 text-white",
    error: "bg-red-500/90 border-red-400 text-white",
    achievement: "bg-gradient-to-r from-purple-600 to-pink-600 border-purple-400 text-white",
    pity: "bg-gradient-to-r from-yellow-500 to-orange-500 border-yellow-400 text-black",
    collection: "bg-gradient-to-r from-blue-500 to-purple-500 border-blue-400 text-white",
    legendary:
      "bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 border-yellow-300 text-black animate-pulse",
  }

  return (
    <Card
      className={cn(
        "border-2 shadow-lg backdrop-blur-sm transition-all duration-300 ease-out",
        typeStyles[notification.type],
        isVisible && !isLeaving ? "translate-x-0 opacity-100" : "translate-x-full opacity-0",
        isLeaving && "-translate-x-full opacity-0",
        notification.type === "legendary" && "ring-4 ring-yellow-300 ring-opacity-50",
      )}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 mt-0.5">
            <NotificationIcon type={notification.type} icon={notification.icon} />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-semibold text-sm truncate">{notification.title}</h4>
              {notification.type === "achievement" && (
                <Badge variant="secondary" className="text-xs bg-white/20 text-white border-white/30">
                  ACHIEVEMENT
                </Badge>
              )}
              {notification.type === "legendary" && (
                <Badge variant="secondary" className="text-xs bg-black/20 text-black border-black/30">
                  LEGENDARY!
                </Badge>
              )}
            </div>

            {notification.message && <p className="text-xs opacity-90 leading-relaxed">{notification.message}</p>}

            {notification.action && (
              <Button
                size="sm"
                variant="outline"
                onClick={notification.action.onClick}
                className="mt-2 h-7 text-xs bg-white/10 border-white/30 hover:bg-white/20"
              >
                {notification.action.label}
              </Button>
            )}
          </div>

          {!notification.persistent && (
            <Button
              size="sm"
              variant="ghost"
              onClick={handleRemove}
              className="flex-shrink-0 h-6 w-6 p-0 hover:bg-white/20"
            >
              <X className="w-3 h-3" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export function NotificationContainer() {
  const { notifications, removeNotification } = useNotifications()

  if (notifications.length === 0) return null

  return (
    <div className="fixed top-4 right-4 z-[100] space-y-2 max-w-sm w-full">
      {notifications.map((notification) => (
        <NotificationCard
          key={notification.id}
          notification={notification}
          onRemove={() => removeNotification(notification.id)}
        />
      ))}
    </div>
  )
}

// Achievement notification with special animation
export function AchievementNotification({
  title,
  description,
  icon,
  show,
  onClose,
}: {
  title: string
  description: string
  icon: string
  show: boolean
  onClose: () => void
}) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (show) {
      setIsVisible(true)
      const timer = setTimeout(() => {
        setIsVisible(false)
        setTimeout(onClose, 500)
      }, 4000)
      return () => clearTimeout(timer)
    }
  }, [show, onClose])

  if (!show) return null

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center pointer-events-none">
      <div
        className={cn(
          "bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 p-6 rounded-xl border-4 border-yellow-400 shadow-2xl transition-all duration-500 max-w-md mx-4",
          isVisible ? "scale-100 opacity-100" : "scale-75 opacity-0",
        )}
      >
        <div className="text-center text-white">
          <div className="text-6xl mb-4 animate-bounce">{icon}</div>
          <h2 className="text-2xl font-bold mb-2">🎉 ACHIEVEMENT UNLOCKED! 🎉</h2>
          <h3 className="text-xl font-semibold mb-2">{title}</h3>
          <p className="text-sm opacity-90">{description}</p>
        </div>
      </div>

      {/* Celebration particles */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 20 }, (_, i) => (
          <div
            key={i}
            className="absolute text-2xl animate-ping"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          >
            {["🎉", "✨", "🌟", "🎊", "💫"][Math.floor(Math.random() * 5)]}
          </div>
        ))}
      </div>
    </div>
  )
}
