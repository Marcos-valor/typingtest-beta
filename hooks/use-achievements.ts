"use client"

import { useState, useCallback } from "react"
import { useAuth } from "@/components/auth-provider"

interface Achievement {
  id: string
  name: string
  description: string
  rarity: "common" | "rare" | "epic" | "legendary"
}

const achievementDefinitions: Record<string, Achievement> = {
  first_race: {
    id: "first_race",
    name: "First Steps",
    description: "Complete your first typing test",
    rarity: "common",
  },
  speed_demon: {
    id: "speed_demon",
    name: "Speed Demon",
    description: "Reach 80 WPM in any test",
    rarity: "rare",
  },
  lightning_fast: {
    id: "lightning_fast",
    name: "Lightning Fast",
    description: "Reach 100 WPM in any test",
    rarity: "epic",
  },
  typing_god: {
    id: "typing_god",
    name: "Typing God",
    description: "Reach 120 WPM in any test",
    rarity: "legendary",
  },
  accuracy_master: {
    id: "accuracy_master",
    name: "Accuracy Master",
    description: "Achieve 98% accuracy in any test",
    rarity: "rare",
  },
  perfectionist: {
    id: "perfectionist",
    name: "Perfectionist",
    description: "Achieve 100% accuracy in any test",
    rarity: "epic",
  },
  ghost_winner: {
    id: "ghost_winner",
    name: "Ghost Buster",
    description: "Win your first ghost race",
    rarity: "rare",
  },
  ghost_crusher: {
    id: "ghost_crusher",
    name: "Ghost Crusher",
    description: "Beat a ghost by 10+ WPM",
    rarity: "epic",
  },
}

export function useAchievements() {
  const { user, unlockAchievement, unlockItem } = useAuth()
  const [pendingNotification, setPendingNotification] = useState<Achievement | null>(null)

  const checkAndUnlockAchievements = useCallback(
    (stats: {
      wpm: number
      accuracy: number
      totalRaces: number
      isGhostRace?: boolean
      ghostWpmDifference?: number
    }) => {
      if (!user) return

      const newAchievements: string[] = []

      // Check speed achievements
      if (stats.wpm >= 80 && !user.achievements.includes("speed_demon")) {
        newAchievements.push("speed_demon")
      }
      if (stats.wpm >= 100 && !user.achievements.includes("lightning_fast")) {
        newAchievements.push("lightning_fast")
      }
      if (stats.wpm >= 120 && !user.achievements.includes("typing_god")) {
        newAchievements.push("typing_god")
      }

      // Check accuracy achievements
      if (stats.accuracy >= 98 && !user.achievements.includes("accuracy_master")) {
        newAchievements.push("accuracy_master")
      }
      if (stats.accuracy >= 100 && !user.achievements.includes("perfectionist")) {
        newAchievements.push("perfectionist")
      }

      // Check first race
      if (stats.totalRaces === 1 && !user.achievements.includes("first_race")) {
        newAchievements.push("first_race")
      }

      // Check ghost race achievements
      if (stats.isGhostRace) {
        if (!user.achievements.includes("ghost_winner")) {
          newAchievements.push("ghost_winner")
        }
        if (
          stats.ghostWpmDifference &&
          stats.ghostWpmDifference >= 10 &&
          !user.achievements.includes("ghost_crusher")
        ) {
          newAchievements.push("ghost_crusher")
        }
      }

      // Unlock achievements and items
      newAchievements.forEach((achievementId) => {
        unlockAchievement(achievementId)

        // Unlock associated items
        switch (achievementId) {
          case "first_race":
            unlockItem("keyboards", "retro")
            break
          case "speed_demon":
            unlockItem("keyboards", "neon")
            unlockItem("backgrounds", "matrix")
            break
          case "lightning_fast":
            unlockItem("keyboards", "lightning")
            unlockItem("backgrounds", "storm")
            unlockItem("sounds", "thunder")
            break
          case "typing_god":
            unlockItem("keyboards", "divine")
            unlockItem("backgrounds", "celestial")
            unlockItem("sounds", "divine")
            break
          case "accuracy_master":
            unlockItem("keyboards", "precision")
            unlockItem("sounds", "perfect")
            break
          case "perfectionist":
            unlockItem("keyboards", "perfect")
            unlockItem("backgrounds", "zen")
            unlockItem("sounds", "harmony")
            break
          case "ghost_winner":
            unlockItem("keyboards", "ghost")
            unlockItem("sounds", "spooky")
            break
          case "ghost_crusher":
            unlockItem("keyboards", "crusher")
            unlockItem("backgrounds", "victory")
            unlockItem("sounds", "crush")
            break
        }

        // Show notification for the first new achievement
        if (newAchievements.length > 0 && achievementDefinitions[achievementId]) {
          setPendingNotification(achievementDefinitions[achievementId])
        }
      })
    },
    [user, unlockAchievement, unlockItem],
  )

  const clearNotification = useCallback(() => {
    setPendingNotification(null)
  }, [])

  return {
    checkAndUnlockAchievements,
    pendingNotification,
    clearNotification,
  }
}
