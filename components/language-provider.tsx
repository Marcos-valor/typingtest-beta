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

    // Home Page
    "home.title": "Master Your Typing Speed",
    "home.subtitle":
      "Compete with players worldwide, unlock achievements, and race against ghosts in the ultimate typing experience.",

    // Typing Test
    "test.title": "Typing Challenge",
    "test.standardTest": "Standard Test",
    "test.selectMode": "Select Mode",
    "test.progress": "Progress",
    "test.startTyping": "Start typing...",
    "test.clickStart": "Click start to begin",
    "test.testComplete": "Test Complete!",
    "test.personalBest": "Personal Best",
    "test.average": "Average",
    "test.correct": "Correct",
    "test.resume": "Resume",
    "test.pause": "Pause",
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
    "auth.signInDescription": "Sign in to track your progress and compete globally",
    "auth.name": "Name",
    "auth.email": "Email",
    "auth.namePlaceholder": "Enter your name",
    "auth.emailPlaceholder": "Enter your email",
    "auth.continueAsGuest": "Continue as guest",
    "auth.termsAgreement": "By signing in, you agree to our Terms of Service and Privacy Policy",
    "auth.comingSoon": "Coming soon...",

    // Stats Overview
    "stats.signInPrompt": "Sign in to track your progress and compete with others!",
    "stats.bestWpm": "Best WPM",
    "stats.personalRecord": "Personal record",
    "stats.averageWpm": "Average WPM",
    "stats.acrossAllRaces": "Across all races",
    "stats.accuracy": "Accuracy",
    "stats.bestAccuracy": "Best accuracy",
    "stats.totalRaces": "Total Races",
    "stats.completed": "Completed",
    "stats.recentAchievements": "Recent Achievements",

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
    // Navegación
    "nav.home": "Inicio",
    "nav.leaderboard": "Clasificación",
    "nav.profile": "Perfil",
    "nav.achievements": "Logros",
    "nav.settings": "Configuración",
    "nav.stats": "Estadísticas",

    // Página de Inicio
    "home.title": "Domina tu Velocidad de Escritura",
    "home.subtitle":
      "Compite con jugadores de todo el mundo, desbloquea logros y compite contra fantasmas en la experiencia de escritura definitiva.",

    // Prueba de Escritura
    "test.title": "Desafío de Escritura",
    "test.standardTest": "Prueba Estándar",
    "test.selectMode": "Seleccionar Modo",
    "test.progress": "Progreso",
    "test.startTyping": "Comienza a escribir...",
    "test.clickStart": "Haz clic en iniciar para comenzar",
    "test.testComplete": "¡Prueba Completada!",
    "test.personalBest": "Mejor Personal",
    "test.average": "Promedio",
    "test.correct": "Correctos",
    "test.resume": "Reanudar",
    "test.pause": "Pausar",
    "test.start": "Iniciar Prueba",
    "test.restart": "Reiniciar",
    "test.wpm": "PPM",
    "test.accuracy": "Precisión",
    "test.time": "Tiempo",
    "test.words": "Palabras",
    "test.characters": "Caracteres",
    "test.errors": "Errores",

    // Modos
    "mode.1min": "1 Minuto",
    "mode.3min": "3 Minutos",
    "mode.5min": "5 Minutos",
    "mode.ghost": "Carrera Fantasma",

    // Autenticación
    "auth.login": "Iniciar Sesión con Google",
    "auth.logout": "Cerrar Sesión",
    "auth.welcome": "Bienvenido de nuevo",
    "auth.signInDescription": "Inicia sesión para rastrear tu progreso y competir globalmente",
    "auth.name": "Nombre",
    "auth.email": "Correo Electrónico",
    "auth.namePlaceholder": "Ingresa tu nombre",
    "auth.emailPlaceholder": "Ingresa tu correo electrónico",
    "auth.continueAsGuest": "Continuar como invitado",
    "auth.termsAgreement": "Al iniciar sesión, aceptas nuestros Términos de Servicio y Política de Privacidad",
    "auth.comingSoon": "Próximamente...",

    // Resumen de Estadísticas
    "stats.signInPrompt": "¡Inicia sesión para rastrear tu progreso y competir con otros!",
    "stats.bestWpm": "Mejor PPM",
    "stats.personalRecord": "Récord personal",
    "stats.averageWpm": "PPM Promedio",
    "stats.acrossAllRaces": "En todas las carreras",
    "stats.accuracy": "Precisión",
    "stats.bestAccuracy": "Mejor precisión",
    "stats.totalRaces": "Carreras Totales",
    "stats.completed": "Completadas",
    "stats.recentAchievements": "Logros Recientes",

    // Logros
    "achievement.unlocked": "¡Logro Desbloqueado!",
    "achievement.first_race": "Primera Carrera",
    "achievement.speed_demon": "Demonio de la Velocidad",
    "achievement.accuracy_master": "Maestro de la Precisión",

    // Configuración
    "settings.theme": "Tema",
    "settings.language": "Idioma",
    "settings.sound": "Efectos de Sonido",
    "settings.keyboard": "Estilo de Teclado",
    "settings.background": "Fondo",

    // Estadísticas
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
  const [language, setLanguage] = useState<Language>("es")

  useEffect(() => {
    // Cargar idioma guardado del localStorage
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
    throw new Error("useLanguage debe usarse dentro de un LanguageProvider")
  }
  return context
}
