import { Navigation } from "@/components/navigation"
import { AchievementGrid } from "@/components/achievement-grid"
import { UnlockablesSection } from "@/components/unlockables-section"
import { AchievementStats } from "@/components/achievement-stats"

export default function AchievementsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-purple-500 to-accent bg-clip-text text-transparent">
            Achievements & Unlocks
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Earn achievements and unlock new keyboards, backgrounds, and sounds as you improve your typing skills.
          </p>
        </div>

        <div className="max-w-6xl mx-auto space-y-8">
          <AchievementStats />
          <AchievementGrid />
          <UnlockablesSection />
        </div>
      </main>
    </div>
  )
}
