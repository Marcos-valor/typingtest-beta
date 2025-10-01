"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

type Language = "en" | "es"

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const translations = {
  en: {
    // Navigation
    "nav.home": "Home",
    "nav.leaderboard": "Leaderboard",
    "nav.profile": "Profile",
    "nav.achievements": "Achievements",
    "nav.settings": "Settings",
    "nav.stats": "Statistics",

    // Typing Test
    "test.start": "Start Test",
    "test.restart": "Restart",
    "test.wpm": "WPM",
    "test.accuracy": "Accuracy",
    "test.time": "Time",
    "test.words": "Words",
    "test.characters": "Characters",
    "test.errors": "Errors",

    // Modes
    "mode.1min": "1 Minute",
    "mode.3min": "3 Minutes",
    "mode.5min": "5 Minutes",
    "mode.ghost": "Ghost Race",

    // Auth
    "auth.login": "Sign In with Google",
    "auth.logout": "Sign Out",
    "auth.welcome": "Welcome back",

    // Achievements
    "achievement.unlocked": "Achievement Unlocked!",
    "achievement.first_race": "First Race",
    "achievement.speed_demon": "Speed Demon",
    "achievement.accuracy_master": "Accuracy Master",

    // Settings
    "settings.theme": "Theme",
    "settings.language": "Language",
    "settings.sound": "Sound Effects",
    "settings.keyboard": "Keyboard Style",
    "settings.background": "Background",

    // Statistics
    statistics: "Statistics",
    trackYourProgress: "Track your typing progress and performance",
    averageWPM: "Average WPM",
    accuracy: "Accuracy",
    totalTime: "Total Time",
    globalRank: "Global Rank",
    best: "Best",
    top: "Top",
    testsCompleted: "tests completed",
    performance: "Performance",
    heatmap: "Heatmap",
    comparison: "Comparison",
    wpmProgress: "WPM Progress Over Time",
    wpmProgressDescription: "Track your typing speed improvement over the last 30 days",
    accuracyTrends: "Accuracy Trends",
    accuracyTrendsDescription: "Monitor your typing accuracy and error patterns",
    typingHeatmap: "Typing Activity Heatmap",
    typingHeatmapDescription: "Visual representation of your daily typing activity",
    timeComparison: "Performance by Time Duration",
    timeComparisonDescription: "Compare your performance across different test durations",
    recentTests: "Recent Tests",
    recentTestsDescription: "Your latest typing test results and performance",
    typingActivity: "Typing Activity",
    last365Days: "Last 365 days",
    less: "Less",
    more: "More",
    myAverage: "My Average",
    globalAverage: "Global Average",
    myBest: "My Best",
    globalBest: "Global Best",
  },
  es: {
    // Navigation
    "nav.home": "Inicio",
    "nav.leaderboard": "Clasificación",
    "nav.profile": "Perfil",
    "nav.achievements": "Logros",
    "nav.settings": "Configuración",
    "nav.stats": "Estadísticas",

    // Typing Test
    "test.start": "Iniciar Test",
    "test.restart": "Reiniciar",
    "test.wpm": "PPM",
    "test.accuracy": "Precisión",
    "test.time": "Tiempo",
    "test.words": "Palabras",
    "test.characters": "Caracteres",
    "test.errors": "Errores",

    // Modes
    "mode.1min": "1 Minuto",
    "mode.3min": "3 Minutos",
    "mode.5min": "5 Minutos",
    "mode.ghost": "Carrera Fantasma",

    // Auth
    "auth.login": "Iniciar Sesión con Google",
    "auth.logout": "Cerrar Sesión",
    "auth.welcome": "Bienvenido de nuevo",

    // Achievements
    "achievement.unlocked": "¡Logro Desbloqueado!",
    "achievement.first_race": "Primera Carrera",
    "achievement.speed_demon": "Demonio de la Velocidad",
    "achievement.accuracy_master": "Maestro de la Precisión",

    // Settings
    "settings.theme": "Tema",
    "settings.language": "Idioma",
    "settings.sound": "Efectos de Sonido",
    "settings.keyboard": "Estilo de Teclado",
    "settings.background": "Fondo",

    // Statistics
    statistics: "Estadísticas",
    trackYourProgress: "Rastrea tu progreso y rendimiento de mecanografía",
    averageWPM: "PPM Promedio",
    accuracy: "Precisión",
    totalTime: "Tiempo Total",
    globalRank: "Rango Global",
    best: "Mejor",
    top: "Top",
    testsCompleted: "pruebas completadas",
    performance: "Rendimiento",
    heatmap: "Mapa de Calor",
    comparison: "Comparación",
    wpmProgress: "Progreso de PPM en el Tiempo",
    wpmProgressDescription: "Rastrea la mejora de tu velocidad de escritura en los últimos 30 días",
    accuracyTrends: "Tendencias de Precisión",
    accuracyTrendsDescription: "Monitorea tu precisión de escritura y patrones de errores",
    typingHeatmap: "Mapa de Calor de Actividad de Escritura",
    typingHeatmapDescription: "Representación visual de tu actividad diaria de escritura",
    timeComparison: "Rendimiento por Duración de Tiempo",
    timeComparisonDescription: "Compara tu rendimiento en diferentes duraciones de prueba",
    recentTests: "Pruebas Recientes",
    recentTestsDescription: "Tus últimos resultados y rendimiento de pruebas de escritura",
    typingActivity: "Actividad de Escritura",
    last365Days: "Últimos 365 días",
    less: "Menos",
    more: "Más",
    myAverage: "Mi Promedio",
    globalAverage: "Promedio Global",
    myBest: "Mi Mejor",
    globalBest: "Mejor Global",
  },
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("en")

  useEffect(() => {
    const saved = localStorage.getItem("language") as Language
    if (saved && (saved === "en" || saved === "es")) {
      setLanguage(saved)
    }
  }, [])

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang)
    localStorage.setItem("language", lang)
  }

  const t = (key: string): string => {
    return translations[language][key as keyof (typeof translations)[typeof language]] || key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
