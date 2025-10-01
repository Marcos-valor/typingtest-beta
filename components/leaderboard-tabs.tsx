"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useLanguage } from "@/components/language-provider"
import { useAuth } from "@/components/auth-provider"
import { Trophy, Medal, Award, Crown, Zap, Target } from "lucide-react"

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

// Mock leaderboard data - in a real app, this would come from a database
const mockLeaderboardData: Record<string, LeaderboardEntry[]> = {
  "1min": [
    {
      id: "1",
      name: "SpeedDemon",
      avatar: "/placeholder.svg",
      wpm: 142,
      accuracy: 98,
      league: "1min",
      rank: 1,
      country: "US",
    },
    {
      id: "2",
      name: "TypeMaster",
      avatar: "/placeholder.svg",
      wpm: 138,
      accuracy: 99,
      league: "1min",
      rank: 2,
      country: "CA",
    },
    {
      id: "3",
      name: "KeyboardNinja",
      avatar: "/placeholder.svg",
      wpm: 135,
      accuracy: 97,
      league: "1min",
      rank: 3,
      country: "UK",
    },
    {
      id: "4",
      name: "FastFingers",
      avatar: "/placeholder.svg",
      wpm: 132,
      accuracy: 96,
      league: "1min",
      rank: 4,
      country: "DE",
    },
    {
      id: "5",
      name: "RapidTyper",
      avatar: "/placeholder.svg",
      wpm: 128,
      accuracy: 98,
      league: "1min",
      rank: 5,
      country: "FR",
    },
  ],
  "3min": [
    {
      id: "1",
      name: "MarathonTyper",
      avatar: "/placeholder.svg",
      wpm: 125,
      accuracy: 99,
      league: "3min",
      rank: 1,
      country: "JP",
    },
    {
      id: "2",
      name: "SteadyHands",
      avatar: "/placeholder.svg",
      wpm: 122,
      accuracy: 98,
      league: "3min",
      rank: 2,
      country: "KR",
    },
    {
      id: "3",
      name: "ConsistentPro",
      avatar: "/placeholder.svg",
      wpm: 119,
      accuracy: 97,
      league: "3min",
      rank: 3,
      country: "AU",
    },
    {
      id: "4",
      name: "EnduranceKing",
      avatar: "/placeholder.svg",
      wpm: 116,
      accuracy: 99,
      league: "3min",
      rank: 4,
      country: "BR",
    },
    {
      id: "5",
      name: "PersistentTyper",
      avatar: "/placeholder.svg",
      wpm: 114,
      accuracy: 96,
      league: "3min",
      rank: 5,
      country: "IN",
    },
  ],
  "5min": [
    {
      id: "1",
      name: "UltimateTypist",
      avatar: "/placeholder.svg",
      wpm: 118,
      accuracy: 99,
      league: "5min",
      rank: 1,
      country: "SE",
    },
    {
      id: "2",
      name: "LongDistanceAce",
      avatar: "/placeholder.svg",
      wpm: 115,
      accuracy: 98,
      league: "5min",
      rank: 2,
      country: "NO",
    },
    {
      id: "3",
      name: "StaminaChamp",
      avatar: "/placeholder.svg",
      wpm: 112,
      accuracy: 97,
      league: "5min",
      rank: 3,
      country: "FI",
    },
    {
      id: "4",
      name: "PatienceTyper",
      avatar: "/placeholder.svg",
      wpm: 109,
      accuracy: 99,
      league: "5min",
      rank: 4,
      country: "DK",
    },
    {
      id: "5",
      name: "FocusedFingers",
      avatar: "/placeholder.svg",
      wpm: 107,
      accuracy: 96,
      league: "5min",
      rank: 5,
      country: "NL",
    },
  ],
}

export function LeaderboardTabs() {
  const { t } = useLanguage()
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState("1min")

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-5 w-5 text-yellow-500" />
      case 2:
        return <Trophy className="h-5 w-5 text-gray-400" />
      case 3:
        return <Medal className="h-5 w-5 text-amber-600" />
      default:
        return <Award className="h-4 w-4 text-muted-foreground" />
    }
  }

  const getRankBadgeVariant = (rank: number) => {
    switch (rank) {
      case 1:
        return "default"
      case 2:
        return "secondary"
      case 3:
        return "outline"
      default:
        return "outline"
    }
  }

  const LeaderboardTable = ({ data }: { data: LeaderboardEntry[] }) => (
    <div className="space-y-2">
      {data.map((entry) => (
        <Card
          key={entry.id}
          className={`transition-all hover:shadow-md ${entry.isCurrentUser ? "ring-2 ring-primary bg-primary/5" : ""}`}
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  {getRankIcon(entry.rank)}
                  <Badge variant={getRankBadgeVariant(entry.rank)} className="min-w-[2rem] justify-center">
                    #{entry.rank}
                  </Badge>
                </div>

                <Avatar className="h-10 w-10">
                  <AvatarImage src={entry.avatar || "/placeholder.svg"} alt={entry.name} />
                  <AvatarFallback>{entry.name.charAt(0)}</AvatarFallback>
                </Avatar>

                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold">{entry.name}</span>
                    {entry.isCurrentUser && (
                      <Badge variant="outline" className="text-xs">
                        You
                      </Badge>
                    )}
                  </div>
                  {entry.country && <span className="text-sm text-muted-foreground">{entry.country}</span>}
                </div>
              </div>

              <div className="flex items-center space-x-6">
                <div className="text-center">
                  <div className="flex items-center space-x-1">
                    <Zap className="h-4 w-4 text-primary" />
                    <span className="text-2xl font-bold text-primary">{entry.wpm}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">WPM</span>
                </div>

                <div className="text-center">
                  <div className="flex items-center space-x-1">
                    <Target className="h-4 w-4 text-green-600" />
                    <span className="text-lg font-semibold text-green-600">{entry.accuracy}%</span>
                  </div>
                  <span className="text-xs text-muted-foreground">Accuracy</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Trophy className="h-5 w-5" />
          <span>Rankings by League</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="1min" className="flex items-center space-x-2">
              <span>{t("mode.1min")}</span>
            </TabsTrigger>
            <TabsTrigger value="3min" className="flex items-center space-x-2">
              <span>{t("mode.3min")}</span>
            </TabsTrigger>
            <TabsTrigger value="5min" className="flex items-center space-x-2">
              <span>{t("mode.5min")}</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="1min" className="mt-6">
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-2">Sprint League</h3>
                <p className="text-sm text-muted-foreground">Fast-paced 1-minute races for maximum speed bursts</p>
              </div>
              <LeaderboardTable data={mockLeaderboardData["1min"]} />
            </div>
          </TabsContent>

          <TabsContent value="3min" className="mt-6">
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-2">Endurance League</h3>
                <p className="text-sm text-muted-foreground">3-minute races balancing speed with consistency</p>
              </div>
              <LeaderboardTable data={mockLeaderboardData["3min"]} />
            </div>
          </TabsContent>

          <TabsContent value="5min" className="mt-6">
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-2">Marathon League</h3>
                <p className="text-sm text-muted-foreground">
                  5-minute races testing stamina and sustained performance
                </p>
              </div>
              <LeaderboardTable data={mockLeaderboardData["5min"]} />
            </div>
          </TabsContent>
        </Tabs>

        {!user && (
          <div className="mt-6 p-4 bg-muted/50 rounded-lg text-center">
            <p className="text-sm text-muted-foreground mb-2">
              Sign in to see your ranking and compete for the top spots!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
