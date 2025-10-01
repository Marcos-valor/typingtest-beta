"use client"

import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, Legend } from "recharts"
import { useTheme } from "next-themes"
import { useLanguage } from "./language-provider"

const data = [
  { duration: "1min", myAvg: 72, globalAvg: 45, myBest: 89, globalBest: 120 },
  { duration: "3min", myAvg: 68, globalAvg: 42, myBest: 85, globalBest: 115 },
  { duration: "5min", myAvg: 65, globalAvg: 40, myBest: 82, globalBest: 110 },
]

export function ComparisonChart() {
  const { theme } = useTheme()
  const { t } = useLanguage()
  const isDark = theme === "dark"

  return (
    <div className="h-[400px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#374151" : "#e5e7eb"} />
          <XAxis dataKey="duration" stroke={isDark ? "#9ca3af" : "#6b7280"} fontSize={12} />
          <YAxis stroke={isDark ? "#9ca3af" : "#6b7280"} fontSize={12} />
          <Tooltip
            contentStyle={{
              backgroundColor: isDark ? "#1f2937" : "#ffffff",
              border: `1px solid ${isDark ? "#374151" : "#e5e7eb"}`,
              borderRadius: "8px",
              color: isDark ? "#f9fafb" : "#111827",
            }}
            formatter={(value, name) => [
              `${value} WPM`,
              name === "myAvg"
                ? t("myAverage")
                : name === "globalAvg"
                  ? t("globalAverage")
                  : name === "myBest"
                    ? t("myBest")
                    : t("globalBest"),
            ]}
          />
          <Legend
            formatter={(value) =>
              value === "myAvg"
                ? t("myAverage")
                : value === "globalAvg"
                  ? t("globalAverage")
                  : value === "myBest"
                    ? t("myBest")
                    : t("globalBest")
            }
          />
          <Bar dataKey="myAvg" fill="#3b82f6" radius={[2, 2, 0, 0]} />
          <Bar dataKey="globalAvg" fill="#6b7280" radius={[2, 2, 0, 0]} />
          <Bar dataKey="myBest" fill="#10b981" radius={[2, 2, 0, 0]} />
          <Bar dataKey="globalBest" fill="#f59e0b" radius={[2, 2, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
