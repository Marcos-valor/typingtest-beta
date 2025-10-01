"use client"

import { useTheme } from "next-themes"
import { useLanguage } from "./language-provider"

// Generar datos de heatmap para los últimos 365 días
const generateHeatmapData = () => {
  const data = []
  const today = new Date()

  for (let i = 364; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)

    // Simular actividad (0-4 niveles)
    const activity = Math.random() > 0.7 ? Math.floor(Math.random() * 5) : 0

    data.push({
      date: date.toISOString().split("T")[0],
      count: activity,
      day: date.getDay(),
      week: Math.floor(i / 7),
    })
  }

  return data
}

export function HeatmapChart() {
  const { theme } = useTheme()
  const { t } = useLanguage()
  const isDark = theme === "dark"
  const data = generateHeatmapData()

  const getColor = (count: number) => {
    if (count === 0) return isDark ? "#1f2937" : "#f3f4f6"
    if (count === 1) return isDark ? "#065f46" : "#dcfce7"
    if (count === 2) return isDark ? "#047857" : "#bbf7d0"
    if (count === 3) return isDark ? "#059669" : "#86efac"
    return isDark ? "#10b981" : "#22c55e"
  }

  const weeks = Math.ceil(data.length / 7)
  const months = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"]
  const days = ["D", "L", "M", "X", "J", "V", "S"]

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          {t("typingActivity")} - {t("last365Days")}
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>{t("less")}</span>
          <div className="flex gap-1">
            {[0, 1, 2, 3, 4].map((level) => (
              <div key={level} className="w-3 h-3 rounded-sm" style={{ backgroundColor: getColor(level) }} />
            ))}
          </div>
          <span>{t("more")}</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="flex gap-1" style={{ minWidth: `${weeks * 12}px` }}>
          {/* Days labels */}
          <div className="flex flex-col gap-1 mr-2">
            <div className="h-3"></div> {/* Space for month labels */}
            {days.map((day, index) => (
              <div key={index} className="h-3 text-xs text-muted-foreground flex items-center">
                {index % 2 === 1 ? day : ""}
              </div>
            ))}
          </div>

          {/* Heatmap grid */}
          <div className="flex flex-col">
            {/* Month labels */}
            <div className="flex mb-1">
              {Array.from({ length: weeks }, (_, weekIndex) => {
                const weekData = data.slice(weekIndex * 7, (weekIndex + 1) * 7)
                const firstDay = weekData[0]
                if (!firstDay) return <div key={weekIndex} className="w-3"></div>

                const date = new Date(firstDay.date)
                const isFirstWeekOfMonth = date.getDate() <= 7

                return (
                  <div key={weekIndex} className="w-3 text-xs text-muted-foreground">
                    {isFirstWeekOfMonth ? months[date.getMonth()] : ""}
                  </div>
                )
              })}
            </div>

            {/* Grid */}
            <div className="flex">
              {Array.from({ length: weeks }, (_, weekIndex) => (
                <div key={weekIndex} className="flex flex-col gap-1 mr-1">
                  {Array.from({ length: 7 }, (_, dayIndex) => {
                    const dataIndex = weekIndex * 7 + dayIndex
                    const dayData = data[dataIndex]

                    if (!dayData) {
                      return <div key={dayIndex} className="w-3 h-3"></div>
                    }

                    return (
                      <div
                        key={dayIndex}
                        className="w-3 h-3 rounded-sm cursor-pointer hover:ring-2 hover:ring-primary/50 transition-all"
                        style={{ backgroundColor: getColor(dayData.count) }}
                        title={`${dayData.date}: ${dayData.count} ${t("testsCompleted")}`}
                      />
                    )
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
