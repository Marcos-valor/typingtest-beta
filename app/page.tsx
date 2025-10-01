import { Navigation } from "@/components/navigation"
import { TypingTest } from "@/components/typing-test"
import { StatsOverview } from "@/components/stats-overview"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-primary via-purple-500 to-accent bg-clip-text text-transparent">
            Master Your Typing Speed
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Compete with players worldwide, unlock achievements, and race against ghosts in the ultimate typing
            experience.
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          <TypingTest />
          <StatsOverview />
        </div>
      </main>
    </div>
  )
}
