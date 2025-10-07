"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Zap, Target, Trophy } from "lucide-react"
import { getGlobalStats } from "@/lib/user-tracking"
import { useLanguage } from "@/components/language-provider"

export function GlobalStats() {
  const { t } = useLanguage()
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalTests: 0,
    averageWpm: 0,
    averageAccuracy: 0,
  })

  useEffect(() => {
    // Cargar estadísticas globales reales
    const globalStats = getGlobalStats()
    setStats(globalStats)

    // Actualizar cada 5 segundos para reflejar cambios en tiempo real
    const interval = setInterval(() => {
      const updatedStats = getGlobalStats()
      setStats(updatedStats)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{t("stats.totalTypists")}</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-primary">
            {stats.totalUsers > 0 ? stats.totalUsers.toLocaleString() : "0"}
          </div>
          <p className="text-xs text-muted-foreground">
            {stats.totalUsers > 0 ? t("stats.activeCommunity") : t("stats.beTheFirst")}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{t("stats.totalRaces")}</CardTitle>
          <Trophy className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">
            {stats.totalTests > 0 ? stats.totalTests.toLocaleString() : "0"}
          </div>
          <p className="text-xs text-muted-foreground">
            {stats.totalTests > 0 ? t("stats.completedWorldwide") : t("stats.startFirst")}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{t("stats.globalAvgWpm")}</CardTitle>
          <Zap className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{stats.averageWpm > 0 ? stats.averageWpm : "—"}</div>
          <p className="text-xs text-muted-foreground">{t("stats.wordsPerMinute")}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{t("stats.globalAccuracy")}</CardTitle>
          <Target className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-600">
            {stats.averageAccuracy > 0 ? `${stats.averageAccuracy}%` : "—"}
          </div>
          <p className="text-xs text-muted-foreground">{t("stats.averagePrecision")}</p>
        </CardContent>
      </Card>
    </div>
  )
}
