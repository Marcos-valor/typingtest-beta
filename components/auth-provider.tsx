"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

interface User {
  id: string
  name: string
  email: string
  avatar: string
  stats: {
    totalRaces: number
    bestWpm: number
    averageWpm: number
    accuracy: number
  }
  achievements: string[]
  unlocks: {
    keyboards: string[]
    backgrounds: string[]
    sounds: string[]
  }
}

interface AuthContextType {
  user: User | null
  login: (name: string, email: string) => void
  logout: () => void
  updateStats: (stats: Partial<User["stats"]>) => void
  unlockAchievement: (achievement: string) => void
  unlockItem: (type: "keyboards" | "backgrounds" | "sounds", item: string) => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const savedUser = localStorage.getItem("current_user")
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setIsLoading(false)
  }, [])

  const login = (name: string, email: string) => {
    const userId = email.toLowerCase().replace(/[^a-z0-9]/g, "_")
    const savedUserData = localStorage.getItem(`user_${userId}`)

    let userData: User

    if (savedUserData) {
      userData = JSON.parse(savedUserData)
    } else {
      userData = {
        id: userId,
        name,
        email,
        avatar: "/placeholder.svg?height=40&width=40",
        stats: {
          totalRaces: 0,
          bestWpm: 0,
          averageWpm: 0,
          accuracy: 0,
        },
        achievements: [],
        unlocks: {
          keyboards: ["default"],
          backgrounds: ["default"],
          sounds: ["default"],
        },
      }
    }

    setUser(userData)
    localStorage.setItem("current_user", JSON.stringify(userData))
    localStorage.setItem(`user_${userId}`, JSON.stringify(userData))
  }

  const logout = () => {
    localStorage.removeItem("current_user")
    setUser(null)
  }

  const updateStats = (newStats: Partial<User["stats"]>) => {
    if (!user) return
    const updatedUser = {
      ...user,
      stats: { ...user.stats, ...newStats },
    }
    setUser(updatedUser)
    localStorage.setItem("current_user", JSON.stringify(updatedUser))
    localStorage.setItem(`user_${user.id}`, JSON.stringify(updatedUser))
  }

  const unlockAchievement = (achievement: string) => {
    if (!user || user.achievements.includes(achievement)) return
    const updatedUser = {
      ...user,
      achievements: [...user.achievements, achievement],
    }
    setUser(updatedUser)
    localStorage.setItem("current_user", JSON.stringify(updatedUser))
    localStorage.setItem(`user_${user.id}`, JSON.stringify(updatedUser))
  }

  const unlockItem = (type: "keyboards" | "backgrounds" | "sounds", item: string) => {
    if (!user || user.unlocks[type].includes(item)) return
    const updatedUser = {
      ...user,
      unlocks: {
        ...user.unlocks,
        [type]: [...user.unlocks[type], item],
      },
    }
    setUser(updatedUser)
    localStorage.setItem("current_user", JSON.stringify(updatedUser))
    localStorage.setItem(`user_${user.id}`, JSON.stringify(updatedUser))
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        updateStats,
        unlockAchievement,
        unlockItem,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
