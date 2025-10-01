"use client"

import { useState, useEffect } from "react"

interface LeaderboardEntry {
  id: string
  name: string
  avatar: string
  wpm: number
  accuracy: number
  league: "1min" | "3min" | "5min"
  rank: number
  country?: string
  isCurrentUser?: boolean
}

export function useLeaderboard(league: "1min" | "3min" | "5min") {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [userRank, setUserRank] = useState<number | null>(null)

  useEffect(() => {
    // Simulate API call
    const fetchLeaderboard = async () => {
      setIsLoading(true)
      // In a real app, this would be an API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock data would be replaced with actual API response
      const mockData: LeaderboardEntry[] = [
        // ... mock data based on league
      ]

      setLeaderboard(mockData)
      setIsLoading(false)
    }

    fetchLeaderboard()
  }, [league])

  const updateUserScore = (wpm: number, accuracy: number) => {
    // In a real app, this would submit the score to the backend
    // and potentially update the leaderboard
    console.log(`Submitting score: ${wpm} WPM, ${accuracy}% accuracy for ${league} league`)
  }

  return {
    leaderboard,
    isLoading,
    userRank,
    updateUserScore,
  }
}
