"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/components/auth-provider"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"

interface UserRankCardProps {
  league: "1min" | "3min" | "5min"
}

export function UserRankCard({ league }: UserRankCardProps) {
  const { user } = useAuth()

  if (!user) return null

  // Mock user ranking data - in a real app, this would be calculated from the database
  const userRanking = {
    "1min": { rank: 1247, change: 5, percentile: 85 },
    "3min": { rank: 892, change: -2, percentile: 90 },
    "5min": { rank: 634, change: 0, percentile: 95 },
  }

  const ranking = userRanking[league]
  const getTrendIcon = () => {
    if (ranking.change > 0) return <TrendingUp className="h-4 w-4 text-green-600" />
    if (ranking.change < 0) return <TrendingDown className="h-4 w-4 text-red-600" />
    return <Minus className="h-4 w-4 text-muted-foreground" />
  }

  const getTrendColor = () => {
    if (ranking.change > 0) return "text-green-600"
    if (ranking.change < 0) return "text-red-600"
    return "text-muted-foreground"
  }

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <CardTitle className="text-sm">Your Ranking - {league.toUpperCase()}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Current Rank</span>
          <div className="flex items-center space-x-2">
            <Badge variant="outline">#{ranking.rank.toLocaleString()}</Badge>
            <div className="flex items-center space-x-1">
              {getTrendIcon()}
              <span className={`text-sm ${getTrendColor()}`}>
                {ranking.change > 0 && "+"}
                {ranking.change}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Percentile</span>
          <Badge variant="secondary">{ranking.percentile}th</Badge>
        </div>

        <div className="pt-2 border-t">
          <p className="text-xs text-muted-foreground">
            You're faster than {ranking.percentile}% of all typists in this league!
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
