"use client"

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts"
import { useTheme } from "next-themes"

const data = [
  { date: "2024-01-01", wpm: 45, accuracy: 89 },
  { date: "2024-01-02", wpm: 48, accuracy: 91 },
  { date: "2024-01-03", wpm: 52, accuracy: 88 },
  { date: "2024-01-04", wpm: 49, accuracy: 93 },
  { date: "2024-01-05", wpm: 55, accuracy: 90 },
  { date: "2024-01-06", wpm: 58, accuracy: 94 },
  { date: "2024-01-07", wpm: 61, accuracy: 92 },
  { date: "2024-01-08", wpm: 59, accuracy: 95 },
  { date: "2024-01-09", wpm: 64, accuracy: 91 },
  { date: "2024-01-10", wpm: 67, accuracy: 96 },
  { date: "2024-01-11", wpm: 69, accuracy: 94 },
  { date: "2024-01-12", wpm: 65, accuracy: 93 },
  { date: "2024-01-13", wpm: 71, accuracy: 95 },
  { date: "2024-01-14", wpm: 68, accuracy: 97 },
  { date: "2024-01-15", wpm: 72, accuracy: 96 },
]

export function PerformanceChart() {
  const { theme } = useTheme()
  const isDark = theme === "dark"

  return (
    <div className="h-[400px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#374151" : "#e5e7eb"} />
          <XAxis
            dataKey="date"
            stroke={isDark ? "#9ca3af" : "#6b7280"}
            fontSize={12}
            tickFormatter={(value) => new Date(value).toLocaleDateString("es-ES", { month: "short", day: "numeric" })}
          />
          <YAxis stroke={isDark ? "#9ca3af" : "#6b7280"} fontSize={12} />
          <Tooltip
            contentStyle={{
              backgroundColor: isDark ? "#1f2937" : "#ffffff",
              border: `1px solid ${isDark ? "#374151" : "#e5e7eb"}`,
              borderRadius: "8px",
              color: isDark ? "#f9fafb" : "#111827",
            }}
            labelFormatter={(value) => new Date(value).toLocaleDateString("es-ES")}
          />
          <Line
            type="monotone"
            dataKey="wpm"
            stroke="#3b82f6"
            strokeWidth={3}
            dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: "#3b82f6", strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
