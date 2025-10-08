"use client"

/**
 * ============================================================================
 * PÁGINA DE CLASIFICACIÓN (LEADERBOARD)
 * ============================================================================
 *
 * Esta página muestra las clasificaciones globales de jugadores en diferentes
 * modos de juego (1min, 3min, 5min). Los usuarios pueden ver:
 * - Estadísticas globales de la comunidad
 * - Rankings por liga/modo de juego
 * - Su posición en cada clasificación
 */

import { Navigation } from "@/components/navigation"
import { LeaderboardTabs } from "@/components/leaderboard-tabs"
import { GlobalStats } from "@/components/global-stats"
import { useLanguage } from "@/components/language-provider"

export default function LeaderboardPage() {
  const { t } = useLanguage()

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        {/* Encabezado de la página */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-purple-500 to-accent bg-clip-text text-transparent">
            {t("nav.leaderboard")}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t("leaderboard.rankingsByLeague")}
          </p>
        </div>

        {/* Contenido principal: estadísticas y clasificaciones */}
        <div className="max-w-6xl mx-auto space-y-8">
          <GlobalStats />
          <LeaderboardTabs />
        </div>
      </main>
    </div>
  )
}
