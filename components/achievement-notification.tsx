"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trophy, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface AchievementNotificationProps {
  achievement: {
    id: string
    name: string
    description: string
    rarity: "common" | "rare" | "epic" | "legendary"
  } | null
  onClose: () => void
}

export function AchievementNotification({ achievement, onClose }: AchievementNotificationProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (achievement) {
      setIsVisible(true)
      // Auto-hide after 5 seconds
      const timer = setTimeout(() => {
        setIsVisible(false)
        setTimeout(onClose, 300) // Wait for animation to complete
      }, 5000)

      return () => clearTimeout(timer)
    }
  }, [achievement, onClose])

  if (!achievement) return null

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "common":
        return "border-gray-200 bg-gray-50"
      case "rare":
        return "border-blue-200 bg-blue-50"
      case "epic":
        return "border-purple-200 bg-purple-50"
      case "legendary":
        return "border-yellow-200 bg-yellow-50"
      default:
        return "border-gray-200 bg-gray-50"
    }
  }

  return (
    <div
      className={`fixed top-20 right-4 z-50 transition-all duration-300 ${
        isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
      }`}
    >
      <Card className={`w-80 achievement-unlock ${getRarityColor(achievement.rarity)} border-2`}>
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Trophy className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <h4 className="font-semibold text-sm">Achievement Unlocked!</h4>
                  <Badge variant="outline" className="text-xs">
                    {achievement.rarity.toUpperCase()}
                  </Badge>
                </div>
                <h3 className="font-bold text-primary">{achievement.name}</h3>
                <p className="text-sm text-muted-foreground">{achievement.description}</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setIsVisible(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
