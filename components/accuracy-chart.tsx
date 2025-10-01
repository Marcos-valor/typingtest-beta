"use client"

import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts"
import { useTheme } from "next-themes"

const data = [
  { date: "2024-01-01", accuracy: 89, errors: 11 },
  { date: "2024-01-02", accuracy: 91, errors: 9 },
  { date: "2024-01-03", accuracy: 88, errors: 12 },
  { date: "2024-01-04", accuracy: 93, errors: 7 },
  { date: "2024-01-05", accuracy: 90, errors: 10 },
  { date: "2024-01-06", accuracy: 94, errors: 6 },
  { date: "2024-01-07", accuracy: 92, errors: 8 },
  { date: "2024-01-08", accuracy: 95, errors: 5 },
  { date: "2024-01-09", accuracy: 91, errors: 9 },
  { date: "2024-01-10", accuracy: 96, errors: 4 },
  { date: "2024-01-11", accuracy: 94, errors: 6 },
  { date: "2024-01-12", accuracy: 93, errors: 7 },
  { date: "2024-01-13", accuracy: 95, errors: 5 },
  { date: "2024-01-14", accuracy: 97, errors: 3 },
  { date: "2024-01-15", accuracy: 96, errors: 4 },
]

export function AccuracyChart() {
  const { theme } = useTheme()
  const isDark = theme === "dark"

  return (
    <div className="h-[400px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <defs>
            <linearGradient id="accuracyGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0.1} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#374151" : "#e5e7eb"} />
          <XAxis
            dataKey="date"
            stroke={isDark ? "#9ca3af" : "#6b7280"}
            fontSize={12}
            tickFormatter={(value) => new Date(value).toLocaleDateString("es-ES", { month: "short", day: "numeric" })}
          />
          <YAxis stroke={isDark ? "#9ca3af" : "#6b7280"} fontSize={12} domain={[80, 100]} />
          <Tooltip
            contentStyle={{
              backgroundColor: isDark ? "#1f2937" : "#ffffff",
              border: `1px solid ${isDark ? "#374151" : "#e5e7eb"}`,
              borderRadius: "8px",
              color: isDark ? "#f9fafb" : "#111827",
            }}
            labelFormatter={(value) => new Date(value).toLocaleDateString("es-ES")}
            formatter={(value, name) => [
              `${value}${name === "accuracy" ? "%" : ""}`,
              name === "accuracy" ? "Precisión" : "Errores",
            ]}
          />
          <Area
            type="monotone"
            dataKey="accuracy"
            stroke="#10b981"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#accuracyGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
