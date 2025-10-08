"use client"

/**
 * PROVEEDOR DE IDIOMAS (LANGUAGE PROVIDER)
 *
 * Este archivo gestiona el sistema de internacionalización (i18n) de la aplicación.
 * Permite cambiar entre inglés y español dinámicamente y persiste la preferencia del usuario.
 */

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

// ============================================================================
// TIPOS Y DEFINICIONES
// ============================================================================

/** Idiomas soportados por la aplicación */
type Language = "en" | "es"

/** Interface del contexto de idioma */
interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

// ============================================================================
// DICCIONARIO DE TRADUCCIONES
// ============================================================================

/**
 * Objeto que contiene todas las traducciones de la aplicación
 * Estructura: translations[idioma][clave] = texto traducido
 */
const translations = {
  // ---------------------------------------------------------------------------
  // INGLÉS (EN)
  // ---------------------------------------------------------------------------
  en: {
    // === NAVEGACIÓN ===
    "nav.home": "Home",
    "nav.leaderboard": "Leaderboard",
    "nav.profile": "Profile",
    "nav.achievements": "Achievements",
    "nav.settings": "Settings",
    "nav.stats": "Statistics",

    // === PÁGINA DE INICIO ===
    "home.title": "Master Your Typing Speed",
    "home.subtitle":
      "Compete with players worldwide, unlock achievements, and race against ghosts in the ultimate typing experience.",

    // === PRUEBA DE ESCRITURA ===
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

    // === MODOS DE JUEGO ===
    "mode.1min": "1 Minute",
    "mode.3min": "3 Minutes",
    "mode.5min": "5 Minutes",
    "mode.ghost": "Ghost Race",

    // === MODO FANTASMA ===
    "ghost.chooseOpponent": "Choose Your Ghost Opponent",
    "ghost.selected": "Selected",
    "ghost.raceDuration": "Race Duration",
    "ghost.you": "You",
    "ghost.start": "Start",
    "ghost.finish": "Finish",
    "ghost.remaining": "remaining",
    "ghost.selectGhost": "Select a ghost and click start to begin",
    "ghost.startRace": "Start Ghost Race",
    "ghost.victory": "Victory!",
    "ghost.ghostWins": "Ghost Wins!",
    "ghost.yourPerformance": "Your Performance",
    "ghost.congratulations": "Congratulations! You beat",
    "ghost.by": "by",
    "ghost.wonBy": "won by",
    "ghost.tryAgain": "Try again!",

    // === AUTENTICACIÓN ===
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

    // === RESUMEN DE ESTADÍSTICAS ===
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

    // === LOGROS ===
    "achievement.unlocked": "Achievement Unlocked!",
    "achievement.first_race": "First Race",
    "achievement.speed_demon": "Speed Demon",
    "achievement.accuracy_master": "Accuracy Master",

    // === CONFIGURACIÓN ===
    "settings.theme": "Theme",
    "settings.language": "Language",
    "settings.sound": "Sound Effects",
    "settings.keyboard": "Keyboard Style",
    "settings.background": "Background",

    // === ESTADÍSTICAS DETALLADAS ===
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

    // Real Data System
    "stats.totalTypists": "Total Typists",
    "stats.activeCommunity": "Active community members",
    "stats.beTheFirst": "Be the first to start!",
    "stats.completedWorldwide": "Completed worldwide",
    "stats.startFirst": "Start the first race!",
    "stats.globalAvgWpm": "Global Avg WPM",
    "stats.wordsPerMinute": "Words per minute",
    "stats.globalAccuracy": "Global Accuracy",
    "stats.averagePrecision": "Average precision",
    "leaderboard.noData": "No rankings yet",
    "leaderboard.beFirst": "Be the first to set a record in this league!",
    "leaderboard.you": "You",
    "leaderboard.rankingsByLeague": "Rankings by League",
    "leaderboard.sprintLeague": "Sprint League",
    "leaderboard.sprintDescription": "Fast-paced 1-minute races for maximum speed bursts",
    "leaderboard.enduranceLeague": "Endurance League",
    "leaderboard.enduranceDescription": "3-minute races balancing speed with consistency",
    "leaderboard.marathonLeague": "Marathon League",
    "leaderboard.marathonDescription": "5-minute races testing stamina and sustained performance",
    "stats.noTestsYet": "No tests completed yet",
    "stats.startTyping": "Start typing to see your statistics!",
  },

  // ---------------------------------------------------------------------------
  // ESPAÑOL (ES)
  // ---------------------------------------------------------------------------
  es: {
    // Navegación
    "nav.home": "Inicio",
    "nav.leaderboard": "Clasificación",
    "nav.profile": "Perfil",
    "nav.achievements": "Logros",
    "nav.settings": "Configuración",
    "nav.stats": "Estadísticas",

    // === PÁGINA DE INICIO ===
    "home.title": "Domina tu Velocidad de Escritura",
    "home.subtitle":
      "Compite con jugadores de todo el mundo, desbloquea logros y compite contra fantasmas en la experiencia de escritura definitiva.",

    // === PRUEBA DE ESCRITURA ===
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

    // === MODOS DE JUEGO ===
    "mode.1min": "1 Minuto",
    "mode.3min": "3 Minutos",
    "mode.5min": "5 Minutos",
    "mode.ghost": "Carrera Fantasma",

    // === MODO FANTASMA ===
    "ghost.chooseOpponent": "Elige tu Oponente Fantasma",
    "ghost.selected": "Seleccionado",
    "ghost.raceDuration": "Duración de la Carrera",
    "ghost.you": "Tú",
    "ghost.start": "Inicio",
    "ghost.finish": "Final",
    "ghost.remaining": "restantes",
    "ghost.selectGhost": "Selecciona un fantasma y haz clic en iniciar para comenzar",
    "ghost.startRace": "Iniciar Carrera Fantasma",
    "ghost.victory": "¡Victoria!",
    "ghost.ghostWins": "¡El Fantasma Gana!",
    "ghost.yourPerformance": "Tu Rendimiento",
    "ghost.congratulations": "¡Felicitaciones! Venciste a",
    "ghost.by": "por",
    "ghost.wonBy": "ganó por",
    "ghost.tryAgain": "¡Inténtalo de nuevo!",

    // === AUTENTICACIÓN ===
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

    // === RESUMEN DE ESTADÍSTICAS ===
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

    // === LOGROS ===
    "achievement.unlocked": "¡Logro Desbloqueado!",
    "achievement.first_race": "Primera Carrera",
    "achievement.speed_demon": "Demonio de la Velocidad",
    "achievement.accuracy_master": "Maestro de la Precisión",

    // === CONFIGURACIÓN ===
    "settings.theme": "Tema",
    "settings.language": "Idioma",
    "settings.sound": "Efectos de Sonido",
    "settings.keyboard": "Estilo de Teclado",
    "settings.background": "Fondo",

    // === ESTADÍSTICAS DETALLADAS ===
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

    // Sistema de Datos Reales
    "stats.totalTypists": "Mecanógrafos Totales",
    "stats.activeCommunity": "Miembros activos de la comunidad",
    "stats.beTheFirst": "¡Sé el primero en comenzar!",
    "stats.completedWorldwide": "Completadas en todo el mundo",
    "stats.startFirst": "¡Inicia la primera carrera!",
    "stats.globalAvgWpm": "PPM Promedio Global",
    "stats.wordsPerMinute": "Palabras por minuto",
    "stats.globalAccuracy": "Precisión Global",
    "stats.averagePrecision": "Precisión promedio",
    "leaderboard.noData": "Aún no hay clasificaciones",
    "leaderboard.beFirst": "¡Sé el primero en establecer un récord en esta liga!",
    "leaderboard.you": "Tú",
    "leaderboard.rankingsByLeague": "Clasificaciones por Liga",
    "leaderboard.sprintLeague": "Liga Sprint",
    "leaderboard.sprintDescription": "Carreras rápidas de 1 minuto para ráfagas de velocidad máxima",
    "leaderboard.enduranceLeague": "Liga de Resistencia",
    "leaderboard.enduranceDescription": "Carreras de 3 minutos equilibrando velocidad con consistencia",
    "leaderboard.marathonLeague": "Liga Maratón",
    "leaderboard.marathonDescription": "Carreras de 5 minutos probando resistencia y rendimiento sostenido",
    "stats.noTestsYet": "Aún no has completado pruebas",
    "stats.startTyping": "¡Comienza a escribir para ver tus estadísticas!",
  },
}

// ============================================================================
// CONTEXTO Y PROVEEDOR
// ============================================================================

/**
 * Contexto de React para compartir el estado del idioma en toda la aplicación
 */
const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

/**
 * LanguageProvider - Componente proveedor de idioma
 *
 * Este componente envuelve la aplicación y proporciona:
 * - Estado del idioma actual
 * - Función para cambiar el idioma
 * - Función de traducción (t)
 * - Persistencia del idioma en localStorage
 *
 * @param children - Componentes hijos que tendrán acceso al contexto de idioma
 */
export function LanguageProvider({ children }: { children: React.ReactNode }) {
  // Estado del idioma actual (por defecto español)
  const [language, setLanguage] = useState<Language>("es")

  /**
   * Efecto que se ejecuta al montar el componente
   * Recupera el idioma guardado en localStorage si existe
   */
  useEffect(() => {
    const saved = localStorage.getItem("language") as Language
    if (saved && (saved === "en" || saved === "es")) {
      setLanguage(saved)
    }
  }, [])

  /**
   * Función para cambiar el idioma
   * Actualiza el estado y guarda la preferencia en localStorage
   *
   * @param lang - Nuevo idioma a establecer
   */
  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang)
    localStorage.setItem("language", lang)
  }

  /**
   * Función de traducción (translate)
   * Busca una clave en el diccionario de traducciones
   *
   * @param key - Clave de traducción (ej: "nav.home")
   * @returns Texto traducido o la clave si no se encuentra
   */
  const t = (key: string): string => {
    return translations[language][key as keyof (typeof translations)[typeof language]] || key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

// ============================================================================
// HOOK PERSONALIZADO
// ============================================================================

/**
 * useLanguage - Hook para acceder al contexto de idioma
 *
 * Uso:
 * ```tsx
 * const { language, setLanguage, t } = useLanguage()
 * return <h1>{t("nav.home")}</h1>
 * ```
 *
 * @throws Error si se usa fuera del LanguageProvider
 * @returns Objeto con language, setLanguage y función t
 */
export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage debe usarse dentro de un LanguageProvider")
  }
  return context
}
