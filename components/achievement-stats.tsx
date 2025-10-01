"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/components/auth-provider"
import { Trophy, Star, Lock, CheckCircle } from "lucide-react"

export function AchievementStats() {
  const { user } = useAuth()

  if (!user) return null

  // Mock achievement data - in a real app, this would be calculated from the database
  const totalAchievements = 10
  const unlockedAchievements = user.achievements.length
  const totalUnlocks = user.unlocks.keyboards.length + user.unlocks.backgrounds.length + user.unlocks.sounds.length
  const completionRate = Math.round((unlockedAchievements / totalAchievements) * 100)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Achievements</CardTitle>
          <Trophy className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-primary">
            {unlockedAchievements}/{totalAchievements}
          </div>
          <p className="text-xs text-muted-foreground">Unlocked</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Completion</CardTitle>
          <Star className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{completionRate}%</div>
          <p className="text-xs text-muted-foreground">Complete</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Unlocks</CardTitle>
          <CheckCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">{totalUnlocks}</div>
          <p className="text-xs text-muted-foreground">Items earned</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Rarest Item</CardTitle>
          <Lock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-600">Epic</div>
          <p className="text-xs text-muted-foreground">Highest rarity</p>
        </CardContent>
      </Card>
    </div>
  )
}
