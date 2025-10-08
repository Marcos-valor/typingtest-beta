/**
 * ============================================================================
 * SISTEMA DE SEGUIMIENTO DE USUARIOS (USER TRACKING)
 * ============================================================================
 *
 * Este módulo gestiona el seguimiento de usuarios y sus estadísticas sin
 * requerir autenticación. Utiliza fingerprinting del navegador para
 * identificar usuarios de forma anónima entre sesiones.
 *
 * Características principales:
 * - Identificación única por navegador (browser fingerprinting)
 * - Almacenamiento local de resultados de pruebas
 * - Cálculo de estadísticas personales y globales
 * - Sistema de clasificación (leaderboard) por modos de juego
 * - Sin necesidad de registro o autenticación
 *
 * Estructura de datos:
 * - localStorage: Persiste datos entre sesiones
 * - browser_fingerprint: ID único del usuario
 * - test_results: Array con todos los resultados de pruebas
 * - global_stats: Estadísticas globales de la aplicación
 */

// ============================================================================
// FUNCIONES AUXILIARES
// ============================================================================

/**
 * Verifica si el código se está ejecutando en el navegador (cliente)
 * Esto es importante para Next.js que renderiza en servidor y cliente
 *
 * @returns true si estamos en el navegador, false en el servidor
 */
function isClient(): boolean {
  return typeof window !== "undefined" && typeof localStorage !== "undefined"
}

// ============================================================================
// IDENTIFICACIÓN DE USUARIOS (BROWSER FINGERPRINTING)
// ============================================================================

/**
 * Genera un identificador único basado en características del navegador
 *
 * Este proceso se conoce como "browser fingerprinting" y crea un ID único
 * combinando características del navegador como:
 * - User Agent (navegador y sistema operativo)
 * - Idioma del navegador
 * - Resolución y profundidad de color de la pantalla
 * - Zona horaria
 * - Renderizado de canvas (cada navegador lo hace ligeramente diferente)
 *
 * El ID generado se guarda en localStorage para mantener la identidad
 * del usuario entre sesiones.
 *
 * @returns ID único del navegador o "server_render" si está en servidor
 */
export function generateBrowserFingerprint(): string {
  if (!isClient()) {
    return "server_render"
  }

  // Verificar si ya existe un ID guardado en sesiones previas
  const existingId = localStorage.getItem("browser_fingerprint")
  if (existingId) {
    return existingId
  }

  // Crear un canvas para fingerprinting
  const canvas = document.createElement("canvas")
  const ctx = canvas.getContext("2d")

  let fingerprint = ""

  // Recopilar información única del navegador
  fingerprint += navigator.userAgent // Navegador y OS
  fingerprint += navigator.language // Idioma
  fingerprint += screen.colorDepth // Bits de color
  fingerprint += screen.width + "x" + screen.height // Resolución
  fingerprint += new Date().getTimezoneOffset() // Zona horaria

  // Canvas fingerprinting: cada navegador renderiza el texto de forma única
  if (ctx) {
    ctx.textBaseline = "top"
    ctx.font = "14px Arial"
    ctx.fillText("ChronoType", 2, 2)
    fingerprint += canvas.toDataURL()
  }

  // Generar hash numérico del fingerprint usando el algoritmo DJB2
  let hash = 0
  for (let i = 0; i < fingerprint.length; i++) {
    const char = fingerprint.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash // Convertir a entero de 32 bits
  }

  // Crear ID único combinando hash y timestamp
  const uniqueId = `user_${Math.abs(hash)}_${Date.now()}`

  // Persistir el ID en localStorage
  localStorage.setItem("browser_fingerprint", uniqueId)

  return uniqueId
}

/**
 * Obtiene el ID único del usuario actual
 *
 * Esta es la función principal que debes usar para obtener el ID del usuario.
 * Internamente llama a generateBrowserFingerprint().
 *
 * @returns ID único del usuario
 */
export function getUserId(): string {
  return generateBrowserFingerprint()
}

// ============================================================================
// TIPOS E INTERFACES
// ============================================================================

/**
 * Interface para los resultados de una prueba de escritura
 *
 * Cada vez que un usuario completa una prueba, se crea un objeto TestResult
 * que contiene toda la información relevante de esa sesión.
 */
export interface TestResult {
  id: string                          // ID único de la prueba
  userId: string                       // ID del usuario que hizo la prueba
  wpm: number                          // Palabras por minuto (Words Per Minute)
  accuracy: number                     // Precisión (0-100%)
  errors: number                       // Número de errores cometidos
  duration: number                     // Duración en segundos (60, 180, 300)
  mode: "1min" | "3min" | "5min"      // Modo de juego
  timestamp: number                    // Momento en que se completó (Date.now())
  language: "es" | "en"               // Idioma de la prueba
}

// ============================================================================
// GESTIÓN DE RESULTADOS DE PRUEBAS
// ============================================================================

/**
 * Guarda un resultado de prueba en localStorage
 *
 * Esta función:
 * 1. Genera automáticamente el ID, userId y timestamp
 * 2. Añade el resultado al historial del usuario
 * 3. Actualiza las estadísticas globales
 * 4. Persiste todo en localStorage
 *
 * @param result - Datos del resultado (sin id, userId ni timestamp)
 * @returns El resultado completo guardado con todos los campos
 */
export function saveTestResult(result: Omit<TestResult, "id" | "userId" | "timestamp">): TestResult {
  if (!isClient()) {
    throw new Error("saveTestResult solo puede ejecutarse en el cliente")
  }

  // Obtener ID del usuario actual
  const userId = getUserId()

  // Construir objeto completo con campos autogenerados
  const testResult: TestResult = {
    ...result,
    id: `test_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    userId,
    timestamp: Date.now(),
  }

  // Obtener resultados previos y agregar el nuevo
  const existingResults = getTestResults()
  existingResults.push(testResult)

  // Persistir en localStorage
  localStorage.setItem("test_results", JSON.stringify(existingResults))

  // Recalcular y actualizar estadísticas globales
  updateGlobalStats(testResult)

  return testResult
}

/**
 * Obtiene todos los resultados de pruebas guardados en localStorage
 *
 * Devuelve un array con TODOS los resultados de TODOS los usuarios.
 * Esto es útil para calcular estadísticas globales y leaderboards.
 *
 * @returns Array de TestResult (puede estar vacío)
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
 * Obtiene solo los resultados del usuario actual
 *
 * Filtra todos los resultados para devolver únicamente los que
 * pertenecen al usuario actual (basado en su browser fingerprint).
 *
 * @returns Array de TestResult del usuario actual
 */
export function getUserTestResults(): TestResult[] {
  const userId = getUserId()
  return getTestResults().filter((result) => result.userId === userId)
}

// ============================================================================
// ESTADÍSTICAS GLOBALES
// ============================================================================

/**
 * Interface para las estadísticas globales de la aplicación
 *
 * Estas estadísticas se calculan en base a todos los usuarios y pruebas.
 * Se actualizan cada vez que alguien completa una prueba.
 */
export interface GlobalStats {
  totalUsers: number       // Número total de usuarios únicos
  totalTests: number       // Número total de pruebas completadas
  averageWpm: number       // PPM promedio de todos los usuarios
  averageAccuracy: number  // Precisión promedio de todos los usuarios
  lastUpdated: number      // Última actualización (timestamp)
}

/**
 * Actualiza las estadísticas globales con un nuevo resultado
 *
 * Esta función se ejecuta automáticamente cada vez que se guarda
 * un resultado. Recalcula:
 * - Número total de usuarios únicos
 * - Número total de pruebas
 * - Promedio de WPM
 * - Promedio de precisión
 *
 * @param newResult - El nuevo resultado que se acaba de guardar
 */
function updateGlobalStats(newResult: TestResult): void {
  if (!isClient()) {
    return
  }

  const stats = getGlobalStats()

  // Obtener todos los resultados para recalcular
  const allResults = getTestResults()

  // Contar usuarios únicos usando Set (elimina duplicados)
  const uniqueUsers = new Set(allResults.map((r) => r.userId))

  // Calcular promedios de WPM y precisión
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
 * Obtiene las estadísticas globales actuales
 *
 * Si no hay estadísticas guardadas, devuelve un objeto con valores en cero.
 *
 * @returns Objeto GlobalStats con las estadísticas actuales
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

// ============================================================================
// SISTEMA DE CLASIFICACIÓN (LEADERBOARD)
// ============================================================================

/**
 * Interface para una entrada en la clasificación (leaderboard)
 *
 * Representa a un usuario y su mejor puntuación en un modo específico.
 */
export interface LeaderboardEntry {
  userId: string      // ID único del usuario
  username: string    // Nombre para mostrar (generado a partir del ID)
  wpm: number         // Mejor WPM del usuario en este modo
  accuracy: number    // Precisión de su mejor resultado
  timestamp: number   // Cuándo logró este resultado
}

/**
 * Obtiene la clasificación (leaderboard) para un modo específico
 *
 * Proceso:
 * 1. Filtra resultados por modo
 * 2. Agrupa por usuario y selecciona su mejor resultado
 * 3. Ordena por WPM descendente
 * 4. Limita al número especificado
 *
 * @param mode - Modo de juego ("1min", "3min", "5min")
 * @param limit - Número máximo de entradas (por defecto 10)
 * @returns Array ordenado de LeaderboardEntry
 */
export function getLeaderboard(mode: "1min" | "3min" | "5min", limit = 10): LeaderboardEntry[] {
  if (!isClient()) {
    return []
  }

  // Filtrar resultados solo del modo especificado
  const allResults = getTestResults().filter((r) => r.mode === mode)

  // Agrupar por usuario y quedarse solo con su mejor resultado
  // Usamos un Map para facilitar la búsqueda por userId
  const userBestResults = new Map<string, TestResult>()

  allResults.forEach((result) => {
    const existing = userBestResults.get(result.userId)
    // Si no existe o el nuevo WPM es mejor, actualizar
    if (!existing || result.wpm > existing.wpm) {
      userBestResults.set(result.userId, result)
    }
  })

  // Convertir Map a array de LeaderboardEntry y ordenar
  const leaderboard: LeaderboardEntry[] = Array.from(userBestResults.values())
    .map((result) => ({
      userId: result.userId,
      username: `Usuario ${result.userId.slice(-6)}`, // Nombre generado (anónimo)
      wpm: result.wpm,
      accuracy: result.accuracy,
      timestamp: result.timestamp,
    }))
    .sort((a, b) => b.wpm - a.wpm) // Ordenar de mayor a menor WPM
    .slice(0, limit) // Limitar resultados

  return leaderboard
}

// ============================================================================
// ESTADÍSTICAS DEL USUARIO
// ============================================================================

/**
 * Interface para las estadísticas personales de un usuario
 *
 * Contiene un resumen completo del rendimiento del usuario.
 */
export interface UserStats {
  totalTests: number       // Número total de pruebas completadas
  bestWpm: number          // Mejor WPM logrado (récord personal)
  averageWpm: number       // WPM promedio en todas las pruebas
  bestAccuracy: number     // Mejor precisión lograda
  averageAccuracy: number  // Precisión promedio en todas las pruebas
  totalErrors: number      // Total de errores cometidos
  totalTimeTyped: number   // Tiempo total escribiendo (en segundos)
}

/**
 * Calcula y obtiene las estadísticas del usuario actual
 *
 * Analiza todos los resultados del usuario y calcula:
 * - Totales (pruebas, errores, tiempo)
 * - Máximos (mejor WPM, mejor precisión)
 * - Promedios (WPM promedio, precisión promedio)
 *
 * @returns Objeto UserStats con las estadísticas calculadas
 */
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
