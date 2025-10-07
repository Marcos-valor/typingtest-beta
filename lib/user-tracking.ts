// Sistema de tracking de usuarios sin necesidad de autenticación
// Utiliza un identificador único del navegador (fingerprint) para rastrear usuarios

/**
 * Verifica si estamos en el cliente (navegador)
 */
function isClient(): boolean {
  return typeof window !== "undefined" && typeof localStorage !== "undefined"
}

/**
 * Genera un identificador único basado en características del navegador
 * Este ID persiste entre sesiones y permite rastrear usuarios sin login
 */
export function generateBrowserFingerprint(): string {
  if (!isClient()) {
    return "server_render"
  }

  // Verificar si ya existe un ID guardado
  const existingId = localStorage.getItem("browser_fingerprint")
  if (existingId) {
    return existingId
  }

  // Generar nuevo fingerprint basado en características del navegador
  const canvas = document.createElement("canvas")
  const ctx = canvas.getContext("2d")

  let fingerprint = ""

  // Información del navegador
  fingerprint += navigator.userAgent
  fingerprint += navigator.language
  fingerprint += screen.colorDepth
  fingerprint += screen.width + "x" + screen.height
  fingerprint += new Date().getTimezoneOffset()

  // Canvas fingerprinting (más único)
  if (ctx) {
    ctx.textBaseline = "top"
    ctx.font = "14px Arial"
    ctx.fillText("ChronoType", 2, 2)
    fingerprint += canvas.toDataURL()
  }

  // Generar hash simple del fingerprint
  let hash = 0
  for (let i = 0; i < fingerprint.length; i++) {
    const char = fingerprint.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash // Convertir a entero de 32 bits
  }

  // Agregar timestamp para mayor unicidad
  const uniqueId = `user_${Math.abs(hash)}_${Date.now()}`

  // Guardar en localStorage
  localStorage.setItem("browser_fingerprint", uniqueId)

  return uniqueId
}

/**
 * Obtiene el ID único del usuario actual
 */
export function getUserId(): string {
  return generateBrowserFingerprint()
}

/**
 * Estructura de datos para resultados de pruebas
 */
export interface TestResult {
  id: string
  userId: string
  wpm: number
  accuracy: number
  errors: number
  duration: number // en segundos
  mode: "1min" | "3min" | "5min"
  timestamp: number
  language: "es" | "en"
}

/**
 * Guarda un resultado de prueba en localStorage
 */
export function saveTestResult(result: Omit<TestResult, "id" | "userId" | "timestamp">): TestResult {
  if (!isClient()) {
    throw new Error("saveTestResult solo puede ejecutarse en el cliente")
  }

  const userId = getUserId()
  const testResult: TestResult = {
    ...result,
    id: `test_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    userId,
    timestamp: Date.now(),
  }

  // Obtener resultados existentes
  const existingResults = getTestResults()
  existingResults.push(testResult)

  // Guardar en localStorage
  localStorage.setItem("test_results", JSON.stringify(existingResults))

  // Actualizar estadísticas globales
  updateGlobalStats(testResult)

  return testResult
}

/**
 * Obtiene todos los resultados de pruebas guardados
 */
export function getTestResults(): TestResult[] {
  if (!isClient()) {
    return []
  }

  const stored = localStorage.getItem("test_results")
  if (!stored) return []

  try {
    return JSON.parse(stored)
  } catch {
    return []
  }
}

/**
 * Obtiene los resultados del usuario actual
 */
export function getUserTestResults(): TestResult[] {
  const userId = getUserId()
  return getTestResults().filter((result) => result.userId === userId)
}

/**
 * Estadísticas globales de la aplicación
 */
export interface GlobalStats {
  totalUsers: number
  totalTests: number
  averageWpm: number
  averageAccuracy: number
  lastUpdated: number
}

/**
 * Actualiza las estadísticas globales con un nuevo resultado
 */
function updateGlobalStats(newResult: TestResult): void {
  if (!isClient()) {
    return
  }

  const stats = getGlobalStats()

  // Contar usuarios únicos
  const allResults = getTestResults()
  const uniqueUsers = new Set(allResults.map((r) => r.userId))

  // Calcular promedios
  const totalTests = allResults.length
  const totalWpm = allResults.reduce((sum, r) => sum + r.wpm, 0)
  const totalAccuracy = allResults.reduce((sum, r) => sum + r.accuracy, 0)

  const updatedStats: GlobalStats = {
    totalUsers: uniqueUsers.size,
    totalTests,
    averageWpm: totalTests > 0 ? Math.round(totalWpm / totalTests) : 0,
    averageAccuracy: totalTests > 0 ? Math.round(totalAccuracy / totalTests) : 0,
    lastUpdated: Date.now(),
  }

  localStorage.setItem("global_stats", JSON.stringify(updatedStats))
}

/**
 * Obtiene las estadísticas globales
 */
export function getGlobalStats(): GlobalStats {
  if (!isClient()) {
    return {
      totalUsers: 0,
      totalTests: 0,
      averageWpm: 0,
      averageAccuracy: 0,
      lastUpdated: Date.now(),
    }
  }

  const stored = localStorage.getItem("global_stats")
  if (!stored) {
    return {
      totalUsers: 0,
      totalTests: 0,
      averageWpm: 0,
      averageAccuracy: 0,
      lastUpdated: Date.now(),
    }
  }

  try {
    return JSON.parse(stored)
  } catch {
    return {
      totalUsers: 0,
      totalTests: 0,
      averageWpm: 0,
      averageAccuracy: 0,
      lastUpdated: Date.now(),
    }
  }
}

/**
 * Obtiene el leaderboard para un modo específico
 */
export interface LeaderboardEntry {
  userId: string
  username: string
  wpm: number
  accuracy: number
  timestamp: number
}

export function getLeaderboard(mode: "1min" | "3min" | "5min", limit = 10): LeaderboardEntry[] {
  if (!isClient()) {
    return []
  }

  const allResults = getTestResults().filter((r) => r.mode === mode)

  // Agrupar por usuario y obtener su mejor resultado
  const userBestResults = new Map<string, TestResult>()

  allResults.forEach((result) => {
    const existing = userBestResults.get(result.userId)
    if (!existing || result.wpm > existing.wpm) {
      userBestResults.set(result.userId, result)
    }
  })

  // Convertir a array y ordenar por WPM
  const leaderboard: LeaderboardEntry[] = Array.from(userBestResults.values())
    .map((result) => ({
      userId: result.userId,
      username: `Usuario ${result.userId.slice(-6)}`, // Nombre anónimo basado en ID
      wpm: result.wpm,
      accuracy: result.accuracy,
      timestamp: result.timestamp,
    }))
    .sort((a, b) => b.wpm - a.wpm)
    .slice(0, limit)

  return leaderboard
}

/**
 * Obtiene las estadísticas del usuario actual
 */
export interface UserStats {
  totalTests: number
  bestWpm: number
  averageWpm: number
  bestAccuracy: number
  averageAccuracy: number
  totalErrors: number
  totalTimeTyped: number // en segundos
}

export function getUserStats(): UserStats {
  const userResults = getUserTestResults()

  if (userResults.length === 0) {
    return {
      totalTests: 0,
      bestWpm: 0,
      averageWpm: 0,
      bestAccuracy: 0,
      averageAccuracy: 0,
      totalErrors: 0,
      totalTimeTyped: 0,
    }
  }

  const totalWpm = userResults.reduce((sum, r) => sum + r.wpm, 0)
  const totalAccuracy = userResults.reduce((sum, r) => sum + r.accuracy, 0)
  const totalErrors = userResults.reduce((sum, r) => sum + r.errors, 0)
  const totalTime = userResults.reduce((sum, r) => sum + r.duration, 0)

  return {
    totalTests: userResults.length,
    bestWpm: Math.max(...userResults.map((r) => r.wpm)),
    averageWpm: Math.round(totalWpm / userResults.length),
    bestAccuracy: Math.max(...userResults.map((r) => r.accuracy)),
    averageAccuracy: Math.round(totalAccuracy / userResults.length),
    totalErrors,
    totalTimeTyped: totalTime,
  }
}
