"use client"

/**
 * ============================================================================
 * COMPONENTE DE PESTAÑAS DE CLASIFICACIÓN (LEADERBOARD TABS)
 * ============================================================================
 *
 * Muestra las clasificaciones (rankings) separadas por modo de juego:
 * - Liga Sprint (1 minuto)
 * - Liga de Resistencia (3 minutos)
 * - Liga Maratón (5 minutos)
 *
 * Para cada liga muestra:
 * - Top 10 jugadores ordenados por WPM
 * - Iconos especiales para los primeros 3 lugares
 * - Resalta la entrada del usuario actual
 */

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useLanguage } from "@/components/language-provider"
import { Trophy, Medal, Award, Crown, Zap, Target } from "lucide-react"
import { getLeaderboard, getUserId, type LeaderboardEntry } from "@/lib/user-tracking"

export function LeaderboardTabs() {
  const { t } = useLanguage()
  const [activeTab, setActiveTab] = useState<"1min" | "3min" | "5min">("1min")

  // Estado que contiene las clasificaciones de cada modo
  const [leaderboards, setLeaderboards] = useState<{
    "1min": LeaderboardEntry[]
    "3min": LeaderboardEntry[]
    "5min": LeaderboardEntry[]
  }>({
    "1min": [],
    "3min": [],
    "5min": [],
  })

  const currentUserId = getUserId()

  /**
   * Efecto que se ejecuta al montar el componente
   * Carga las clasificaciones desde localStorage
   */
  useEffect(() => {
    setLeaderboards({
      "1min": getLeaderboard("1min", 10),
      "3min": getLeaderboard("3min", 10),
      "5min": getLeaderboard("5min", 10),
    })
  }, [])

  /**
   * Obtiene el icono apropiado según el puesto en la clasificación
   * @param rank - Posición del jugador (1, 2, 3, etc.)
   * @returns Componente de icono con color correspondiente
   */
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-5 w-5 text-yellow-500" /> // Corona dorada para 1er lugar
      case 2:
        return <Trophy className="h-5 w-5 text-gray-400" /> // Trofeo plateado para 2do lugar
      case 3:
        return <Medal className="h-5 w-5 text-amber-600" /> // Medalla bronce para 3er lugar
      default:
        return <Award className="h-4 w-4 text-muted-foreground" /> // Award genérico para el resto
    }
  }

  /**
   * Obtiene la variante del badge según el puesto
   * @param rank - Posición del jugador
   * @returns Variante del badge (afecta el color y estilo)
   */
  const getRankBadgeVariant = (rank: number) => {
    switch (rank) {
      case 1:
        return "default" // Estilo destacado para el campeón
      case 2:
        return "secondary" // Estilo secundario para subcampeón
      case 3:
        return "outline" // Estilo con borde para tercer lugar
      default:
        return "outline" // Estilo básico para el resto
    }
  }

  const LeaderboardTable = ({ data }: { data: LeaderboardEntry[] }) => {
    if (data.length === 0) {
      return (
        <div className="text-center py-12">
          <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">{t("leaderboard.noData")}</h3>
          <p className="text-sm text-muted-foreground">{t("leaderboard.beFirst")}</p>
        </div>
      )
    }

    return (
      <div className="space-y-2">
        {data.map((entry, index) => {
          const rank = index + 1
          const isCurrentUser = entry.userId === currentUserId

          return (
            <Card
              key={entry.userId}
              className={`transition-all hover:shadow-md ${isCurrentUser ? "ring-2 ring-primary bg-primary/5" : ""}`}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      {getRankIcon(rank)}
                      <Badge variant={getRankBadgeVariant(rank)} className="min-w-[2rem] justify-center">
                        #{rank}
                      </Badge>
                    </div>

                    <Avatar className="h-10 w-10">
                      <AvatarFallback>{entry.username.charAt(0)}</AvatarFallback>
                    </Avatar>

                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold">{entry.username}</span>
                        {isCurrentUser && (
                          <Badge variant="outline" className="text-xs">
                            {t("leaderboard.you")}
                          </Badge>
                        )}
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {new Date(entry.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-6">
                    <div className="text-center">
                      <div className="flex items-center space-x-1">
                        <Zap className="h-4 w-4 text-primary" />
                        <span className="text-2xl font-bold text-primary">{entry.wpm}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">PPM</span>
                    </div>

                    <div className="text-center">
                      <div className="flex items-center space-x-1">
                        <Target className="h-4 w-4 text-green-600" />
                        <span className="text-lg font-semibold text-green-600">{entry.accuracy}%</span>
                      </div>
                      <span className="text-xs text-muted-foreground">{t("test.accuracy")}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Trophy className="h-5 w-5" />
          <span>{t("leaderboard.rankingsByLeague")}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "1min" | "3min" | "5min")}>
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
                <h3 className="text-lg font-semibold mb-2">{t("leaderboard.sprintLeague")}</h3>
                <p className="text-sm text-muted-foreground">{t("leaderboard.sprintDescription")}</p>
              </div>
              <LeaderboardTable data={leaderboards["1min"]} />
            </div>
          </TabsContent>

          <TabsContent value="3min" className="mt-6">
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-2">{t("leaderboard.enduranceLeague")}</h3>
                <p className="text-sm text-muted-foreground">{t("leaderboard.enduranceDescription")}</p>
              </div>
              <LeaderboardTable data={leaderboards["3min"]} />
            </div>
          </TabsContent>

          <TabsContent value="5min" className="mt-6">
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-2">{t("leaderboard.marathonLeague")}</h3>
                <p className="text-sm text-muted-foreground">{t("leaderboard.marathonDescription")}</p>
              </div>
              <LeaderboardTable data={leaderboards["5min"]} />
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
