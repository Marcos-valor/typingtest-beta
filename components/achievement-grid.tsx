"use client"

import type React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useAuth } from "@/components/auth-provider"
import { useLanguage } from "@/components/language-provider"
import { Trophy, Zap, Target, Clock, Flame, Star, Crown, Ghost, Keyboard, Award, Lock, CheckCircle } from "lucide-react"

interface Achievement {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  category: "speed" | "accuracy" | "endurance" | "special"
  requirement: number
  currentProgress?: number
  unlocked: boolean
  rarity: "common" | "rare" | "epic" | "legendary"
  rewards: {
    keyboards?: string[]
    backgrounds?: string[]
    sounds?: string[]
  }
}

const achievementDefinitions: Achievement[] = [
  // Speed Achievements
  {
    id: "first_race",
    name: "First Steps",
    description: "Complete your first typing test",
    icon: <Trophy className="h-6 w-6" />,
    category: "speed",
    requirement: 1,
    unlocked: false,
    rarity: "common",
    rewards: { keyboards: ["retro"] },
  },
  {
    id: "speed_demon",
    name: "Speed Demon",
    description: "Reach 80 WPM in any test",
    icon: <Zap className="h-6 w-6" />,
    category: "speed",
    requirement: 80,
    unlocked: false,
    rarity: "rare",
    rewards: { keyboards: ["neon"], backgrounds: ["matrix"] },
  },
  {
    id: "lightning_fast",
    name: "Lightning Fast",
    description: "Reach 100 WPM in any test",
    icon: <Flame className="h-6 w-6" />,
    category: "speed",
    requirement: 100,
    unlocked: false,
    rarity: "epic",
    rewards: { keyboards: ["lightning"], backgrounds: ["storm"], sounds: ["thunder"] },
  },
  {
    id: "typing_god",
    name: "Typing God",
    description: "Reach 120 WPM in any test",
    icon: <Crown className="h-6 w-6" />,
    category: "speed",
    requirement: 120,
    unlocked: false,
    rarity: "legendary",
    rewards: { keyboards: ["divine"], backgrounds: ["celestial"], sounds: ["divine"] },
  },

  // Accuracy Achievements
  {
    id: "accuracy_master",
    name: "Accuracy Master",
    description: "Achieve 98% accuracy in any test",
    icon: <Target className="h-6 w-6" />,
    category: "accuracy",
    requirement: 98,
    unlocked: false,
    rarity: "rare",
    rewards: { keyboards: ["precision"], sounds: ["perfect"] },
  },
  {
    id: "perfectionist",
    name: "Perfectionist",
    description: "Achieve 100% accuracy in any test",
    icon: <Star className="h-6 w-6" />,
    category: "accuracy",
    requirement: 100,
    unlocked: false,
    rarity: "epic",
    rewards: { keyboards: ["perfect"], backgrounds: ["zen"], sounds: ["harmony"] },
  },

  // Endurance Achievements
  {
    id: "marathon_runner",
    name: "Marathon Runner",
    description: "Complete 50 typing tests",
    icon: <Clock className="h-6 w-6" />,
    category: "endurance",
    requirement: 50,
    unlocked: false,
    rarity: "rare",
    rewards: { backgrounds: ["endurance"], sounds: ["victory"] },
  },
  {
    id: "typing_veteran",
    name: "Typing Veteran",
    description: "Complete 100 typing tests",
    icon: <Award className="h-6 w-6" />,
    category: "endurance",
    requirement: 100,
    unlocked: false,
    rarity: "epic",
    rewards: { keyboards: ["veteran"], backgrounds: ["battlefield"] },
  },

  // Special Achievements
  {
    id: "ghost_winner",
    name: "Ghost Buster",
    description: "Win your first ghost race",
    icon: <Ghost className="h-6 w-6" />,
    category: "special",
    requirement: 1,
    unlocked: false,
    rarity: "rare",
    rewards: { keyboards: ["ghost"], sounds: ["spooky"] },
  },
  {
    id: "ghost_crusher",
    name: "Ghost Crusher",
    description: "Beat a ghost by 10+ WPM",
    icon: <Flame className="h-6 w-6" />,
    category: "special",
    requirement: 10,
    unlocked: false,
    rarity: "epic",
    rewards: { keyboards: ["crusher"], backgrounds: ["victory"], sounds: ["crush"] },
  },
]

export function AchievementGrid() {
  const { user } = useAuth()
  const { t } = useLanguage()

  if (!user) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">Sign in to track your achievements and unlock rewards!</p>
        </CardContent>
      </Card>
    )
  }

  // Calculate achievement progress based on user stats
  const getAchievementProgress = (achievement: Achievement): Achievement => {
    let currentProgress = 0
    const unlocked = user.achievements.includes(achievement.id)

    switch (achievement.id) {
      case "first_race":
        currentProgress = user.stats.totalRaces
        break
      case "speed_demon":
      case "lightning_fast":
      case "typing_god":
        currentProgress = user.stats.bestWpm
        break
      case "accuracy_master":
      case "perfectionist":
        currentProgress = user.stats.accuracy
        break
      case "marathon_runner":
      case "typing_veteran":
        currentProgress = user.stats.totalRaces
        break
      default:
        currentProgress = unlocked ? achievement.requirement : 0
    }

    return {
      ...achievement,
      currentProgress,
      unlocked,
    }
  }

  const achievements = achievementDefinitions.map(getAchievementProgress)
  const categories = ["speed", "accuracy", "endurance", "special"] as const

  const getRarityColor = (rarity: Achievement["rarity"]) => {
    switch (rarity) {
      case "common":
        return "text-gray-600 border-gray-200"
      case "rare":
        return "text-blue-600 border-blue-200"
      case "epic":
        return "text-purple-600 border-purple-200"
      case "legendary":
        return "text-yellow-600 border-yellow-200"
    }
  }

  const getRarityBadgeVariant = (rarity: Achievement["rarity"]) => {
    switch (rarity) {
      case "common":
        return "secondary"
      case "rare":
        return "default"
      case "epic":
        return "destructive"
      case "legendary":
        return "outline"
    }
  }

  const getCategoryIcon = (category: Achievement["category"]) => {
    switch (category) {
      case "speed":
        return <Zap className="h-4 w-4" />
      case "accuracy":
        return <Target className="h-4 w-4" />
      case "endurance":
        return <Clock className="h-4 w-4" />
      case "special":
        return <Star className="h-4 w-4" />
    }
  }

  const getCategoryName = (category: Achievement["category"]) => {
    switch (category) {
      case "speed":
        return "Speed"
      case "accuracy":
        return "Accuracy"
      case "endurance":
        return "Endurance"
      case "special":
        return "Special"
    }
  }

  return (
    <div className="space-y-8">
      {categories.map((category) => {
        const categoryAchievements = achievements.filter((a) => a.category === category)

        return (
          <Card key={category}>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                {getCategoryIcon(category)}
                <span>{getCategoryName(category)} Achievements</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categoryAchievements.map((achievement) => (
                  <Card
                    key={achievement.id}
                    className={`relative transition-all hover:shadow-md ${
                      achievement.unlocked
                        ? `${getRarityColor(achievement.rarity)} bg-gradient-to-br from-background to-accent/5`
                        : "opacity-75"
                    }`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div
                          className={`p-2 rounded-lg ${
                            achievement.unlocked ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {achievement.unlocked ? achievement.icon : <Lock className="h-6 w-6" />}
                        </div>
                        <div className="flex flex-col items-end space-y-1">
                          <Badge variant={getRarityBadgeVariant(achievement.rarity)} className="text-xs">
                            {achievement.rarity.toUpperCase()}
                          </Badge>
                          {achievement.unlocked && <CheckCircle className="h-4 w-4 text-green-600" />}
                        </div>
                      </div>

                      <h3 className="font-semibold mb-1">{achievement.name}</h3>
                      <p className="text-sm text-muted-foreground mb-3">{achievement.description}</p>

                      {!achievement.unlocked && achievement.currentProgress !== undefined && (
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs">
                            <span>Progress</span>
                            <span>
                              {achievement.currentProgress}/{achievement.requirement}
                            </span>
                          </div>
                          <Progress
                            value={(achievement.currentProgress / achievement.requirement) * 100}
                            className="h-2"
                          />
                        </div>
                      )}

                      {achievement.unlocked && (
                        <div className="mt-3 pt-3 border-t">
                          <p className="text-xs text-muted-foreground mb-2">Rewards:</p>
                          <div className="flex flex-wrap gap-1">
                            {achievement.rewards.keyboards?.map((keyboard) => (
                              <Badge key={keyboard} variant="outline" className="text-xs">
                                <Keyboard className="h-3 w-3 mr-1" />
                                {keyboard}
                              </Badge>
                            ))}
                            {achievement.rewards.backgrounds?.map((bg) => (
                              <Badge key={bg} variant="outline" className="text-xs">
                                🎨 {bg}
                              </Badge>
                            ))}
                            {achievement.rewards.sounds?.map((sound) => (
                              <Badge key={sound} variant="outline" className="text-xs">
                                🔊 {sound}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
