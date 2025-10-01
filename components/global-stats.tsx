"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Zap, Target, Trophy } from "lucide-react"

export function GlobalStats() {
  // Mock global statistics - in a real app, this would come from a database
  const globalStats = {
    totalUsers: 15420,
    totalRaces: 89340,
    averageWpm: 67,
    averageAccuracy: 94,
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Typists</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-primary">{globalStats.totalUsers.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">Active community members</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Races</CardTitle>
          <Trophy className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">{globalStats.totalRaces.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">Completed worldwide</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Global Avg WPM</CardTitle>
          <Zap className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{globalStats.averageWpm}</div>
          <p className="text-xs text-muted-foreground">Words per minute</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Global Accuracy</CardTitle>
          <Target className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-600">{globalStats.averageAccuracy}%</div>
          <p className="text-xs text-muted-foreground">Average precision</p>
        </CardContent>
      </Card>
    </div>
  )
}
