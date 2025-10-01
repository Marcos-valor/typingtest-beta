import { Navigation } from "@/components/navigation"
import { LeaderboardTabs } from "@/components/leaderboard-tabs"
import { GlobalStats } from "@/components/global-stats"

export default function LeaderboardPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-purple-500 to-accent bg-clip-text text-transparent">
            Global Leaderboard
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Compete with typists worldwide across different time leagues and climb the rankings.
          </p>
        </div>

        <div className="max-w-6xl mx-auto space-y-8">
          <GlobalStats />
          <LeaderboardTabs />
        </div>
      </main>
    </div>
  )
}
