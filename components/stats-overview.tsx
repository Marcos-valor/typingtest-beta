"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/components/auth-provider"
import { useLanguage } from "@/components/language-provider"
import { Trophy, Target, Zap, TrendingUp } from "lucide-react"

export function StatsOverview() {
  const { user } = useAuth()
  const { t } = useLanguage()

  if (!user) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">{t("stats.signInPrompt")}</p>
        </CardContent>
      </Card>
    )
  }

  const { stats, achievements } = user

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{t("stats.bestWpm")}</CardTitle>
          <Zap className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-primary">{stats.bestWpm}</div>
          <p className="text-xs text-muted-foreground">{t("stats.personalRecord")}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{t("stats.averageWpm")}</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">{stats.averageWpm}</div>
          <p className="text-xs text-muted-foreground">{t("stats.acrossAllRaces")}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{t("stats.accuracy")}</CardTitle>
          <Target className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{stats.accuracy}%</div>
          <p className="text-xs text-muted-foreground">{t("stats.bestAccuracy")}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{t("stats.totalRaces")}</CardTitle>
          <Trophy className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-600">{stats.totalRaces}</div>
          <p className="text-xs text-muted-foreground">{t("stats.completed")}</p>
        </CardContent>
      </Card>

      {achievements.length > 0 && (
        <Card className="md:col-span-2 lg:col-span-4">
          <CardHeader>
            <CardTitle className="text-sm font-medium">{t("stats.recentAchievements")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {achievements.slice(-5).map((achievement) => (
                <Badge key={achievement} variant="secondary" className="bg-primary/10 text-primary">
                  {t(`achievement.${achievement}`)}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
