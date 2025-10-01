"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { PerformanceChart } from "@/components/performance-chart"
import { AccuracyChart } from "@/components/accuracy-chart"
import { HeatmapChart } from "@/components/heatmap-chart"
import { ComparisonChart } from "@/components/comparison-chart"
import { useLanguage } from "@/components/language-provider"
import { TrendingUp, Target, Clock, Award, Calendar, BarChart3 } from "lucide-react"

export default function StatsPage() {
  const { t } = useLanguage()

  // Mock data - en una app real vendría de la base de datos
  const stats = {
    totalTests: 247,
    averageWPM: 68,
    bestWPM: 89,
    averageAccuracy: 94.2,
    bestAccuracy: 98.7,
    totalTimeTyped: 1847, // minutos
    streak: 12,
    rank: 1247,
    percentile: 78,
  }

  const recentTests = [
    { date: "2024-01-15", wpm: 72, accuracy: 96.2, duration: 60 },
    { date: "2024-01-14", wpm: 68, accuracy: 94.8, duration: 180 },
    { date: "2024-01-13", wpm: 71, accuracy: 95.1, duration: 300 },
    { date: "2024-01-12", wpm: 65, accuracy: 93.7, duration: 60 },
    { date: "2024-01-11", wpm: 69, accuracy: 95.8, duration: 180 },
  ]

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          {t("statistics")}
        </h1>
        <p className="text-muted-foreground text-lg">{t("trackYourProgress")}</p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300">{t("averageWPM")}</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">{stats.averageWPM}</div>
            <p className="text-xs text-blue-600 dark:text-blue-400">
              {t("best")}: {stats.bestWPM} WPM
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200 dark:border-green-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-700 dark:text-green-300">{t("accuracy")}</CardTitle>
            <Target className="h-4 w-4 text-green-600 dark:text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900 dark:text-green-100">{stats.averageAccuracy}%</div>
            <p className="text-xs text-green-600 dark:text-green-400">
              {t("best")}: {stats.bestAccuracy}%
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border-purple-200 dark:border-purple-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-700 dark:text-purple-300">{t("totalTime")}</CardTitle>
            <Clock className="h-4 w-4 text-purple-600 dark:text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">
              {Math.floor(stats.totalTimeTyped / 60)}h {stats.totalTimeTyped % 60}m
            </div>
            <p className="text-xs text-purple-600 dark:text-purple-400">
              {stats.totalTests} {t("testsCompleted")}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 border-orange-200 dark:border-orange-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-700 dark:text-orange-300">
              {t("globalRank")}
            </CardTitle>
            <Award className="h-4 w-4 text-orange-600 dark:text-orange-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-900 dark:text-orange-100">#{stats.rank}</div>
            <p className="text-xs text-orange-600 dark:text-orange-400">
              {t("top")} {stats.percentile}%
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <Tabs defaultValue="performance" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="performance">{t("performance")}</TabsTrigger>
          <TabsTrigger value="accuracy">{t("accuracy")}</TabsTrigger>
          <TabsTrigger value="heatmap">{t("heatmap")}</TabsTrigger>
          <TabsTrigger value="comparison">{t("comparison")}</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                {t("wpmProgress")}
              </CardTitle>
              <CardDescription>{t("wpmProgressDescription")}</CardDescription>
            </CardHeader>
            <CardContent>
              <PerformanceChart />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="accuracy" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                {t("accuracyTrends")}
              </CardTitle>
              <CardDescription>{t("accuracyTrendsDescription")}</CardDescription>
            </CardHeader>
            <CardContent>
              <AccuracyChart />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="heatmap" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                {t("typingHeatmap")}
              </CardTitle>
              <CardDescription>{t("typingHeatmapDescription")}</CardDescription>
            </CardHeader>
            <CardContent>
              <HeatmapChart />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="comparison" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                {t("timeComparison")}
              </CardTitle>
              <CardDescription>{t("timeComparisonDescription")}</CardDescription>
            </CardHeader>
            <CardContent>
              <ComparisonChart />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Recent Tests */}
      <Card>
        <CardHeader>
          <CardTitle>{t("recentTests")}</CardTitle>
          <CardDescription>{t("recentTestsDescription")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentTests.map((test, index) => (
              <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                <div className="flex items-center gap-4">
                  <div className="text-sm text-muted-foreground">{new Date(test.date).toLocaleDateString()}</div>
                  <Badge variant="secondary">
                    {test.duration === 60 ? "1min" : test.duration === 180 ? "3min" : "5min"}
                  </Badge>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <div className="text-lg font-semibold">{test.wpm}</div>
                    <div className="text-xs text-muted-foreground">WPM</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold">{test.accuracy}%</div>
                    <div className="text-xs text-muted-foreground">{t("accuracy")}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
