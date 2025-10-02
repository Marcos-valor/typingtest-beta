"use client"

import { TypingTest } from "@/components/typing-test"
import { StatsOverview } from "@/components/stats-overview"
import { useLanguage } from "@/components/language-provider"

export function ClientHomeContent() {
  const { t } = useLanguage()

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-primary via-blue-600 to-purple-600 bg-clip-text text-transparent">
          ChronoType
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{t("home.subtitle")}</p>
      </div>

      <div className="max-w-4xl mx-auto space-y-8">
        <TypingTest />
        <StatsOverview />
      </div>
    </main>
  )
}
