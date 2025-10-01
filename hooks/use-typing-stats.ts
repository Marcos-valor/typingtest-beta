"use client"

import { useState, useCallback } from "react"

export interface TypingStats {
  wpm: number
  accuracy: number
  errors: number
  correctChars: number
  totalChars: number
  timeElapsed: number
}

export function useTypingStats() {
  const [stats, setStats] = useState<TypingStats>({
    wpm: 0,
    accuracy: 100,
    errors: 0,
    correctChars: 0,
    totalChars: 0,
    timeElapsed: 0,
  })

  const calculateStats = useCallback((userInput: string, targetText: string, startTime: number): TypingStats => {
    const timeElapsed = (Date.now() - startTime) / 1000 / 60 // in minutes
    const correctChars = userInput.split("").filter((char, index) => char === targetText[index]).length
    const totalChars = userInput.length
    const errors = totalChars - correctChars
    const wpm = timeElapsed > 0 ? Math.round(correctChars / 5 / timeElapsed) : 0
    const accuracy = totalChars > 0 ? Math.round((correctChars / totalChars) * 100) : 100

    return {
      wpm: Math.max(0, wpm),
      accuracy: Math.max(0, accuracy),
      errors,
      correctChars,
      totalChars,
      timeElapsed: timeElapsed * 60,
    }
  }, [])

  const updateStats = useCallback(
    (userInput: string, targetText: string, startTime: number) => {
      const newStats = calculateStats(userInput, targetText, startTime)
      setStats(newStats)
      return newStats
    },
    [calculateStats],
  )

  const resetStats = useCallback(() => {
    setStats({
      wpm: 0,
      accuracy: 100,
      errors: 0,
      correctChars: 0,
      totalChars: 0,
      timeElapsed: 0,
    })
  }, [])

  return {
    stats,
    updateStats,
    resetStats,
    calculateStats,
  }
}
