"use client"

import type React from "react"
import { useState, useEffect, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useLanguage } from "@/components/language-provider"
import { useAuth } from "@/components/auth-provider"
import { RotateCcw, Play, Pause, Ghost, Trophy, Zap } from "lucide-react"

interface GhostData {
  id: string
  name: string
  avatar: string
  wpm: number
  accuracy: number
  keystrokes: Array<{
    timestamp: number
    position: number
    correct: boolean
  }>
  totalTime: number
}

interface TypingStats {
  wpm: number
  accuracy: number
  errors: number
  correctChars: number
  totalChars: number
  timeElapsed: number
}

const sampleTexts = {
  en: [
    "The quick brown fox jumps over the lazy dog. This pangram contains every letter of the alphabet at least once, making it perfect for typing practice.",
    "Technology has revolutionized the way we communicate, work, and live. From smartphones to artificial intelligence, innovation continues to shape our future.",
    "Learning to type efficiently is a valuable skill in today's digital world. Practice makes perfect, and consistency is key to improvement.",
  ],
  es: [
    "El veloz murciélago hindú comía feliz cardillo y kiwi. La cigüeña tocaba el saxofón detrás del palenque de paja.",
    "La tecnología ha revolucionado la forma en que nos comunicamos, trabajamos y vivimos. Desde teléfonos inteligentes hasta inteligencia artificial.",
    "Aprender a escribir eficientemente es una habilidad valiosa en el mundo digital actual. La práctica hace al maestro.",
  ],
}

// Datos de fantasmas simulados - en una app real vendrían de la base de datos
const mockGhosts: GhostData[] = [
  {
    id: "1",
    name: "DemonioVeloz",
    avatar: "/placeholder.svg",
    wpm: 95,
    accuracy: 98,
    totalTime: 60,
    keystrokes: [],
  },
  {
    id: "2",
    name: "MaestroTeclas",
    avatar: "/placeholder.svg",
    wpm: 87,
    accuracy: 99,
    totalTime: 60,
    keystrokes: [],
  },
  {
    id: "3",
    name: "NinjaTeclado",
    avatar: "/placeholder.svg",
    wpm: 82,
    accuracy: 96,
    totalTime: 60,
    keystrokes: [],
  },
]

export function GhostRaceMode() {
  const { t, language } = useLanguage()
  const { user, updateStats, unlockAchievement } = useAuth()

  const [selectedGhost, setSelectedGhost] = useState<GhostData | null>(null)
  const [mode, setMode] = useState<1 | 3 | 5>(1)
  const [isActive, setIsActive] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [timeLeft, setTimeLeft] = useState(60)
  const [currentText, setCurrentText] = useState("")
  const [userInput, setUserInput] = useState("")
  const [currentIndex, setCurrentIndex] = useState(0)
  const [ghostProgress, setGhostProgress] = useState(0)
  const [raceResult, setRaceResult] = useState<"won" | "lost" | null>(null)

  const [stats, setStats] = useState<TypingStats>({
    wpm: 0,
    accuracy: 100,
    errors: 0,
    correctChars: 0,
    totalChars: 0,
    timeElapsed: 0,
  })

  const inputRef = useRef<HTMLInputElement>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const ghostIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const startTimeRef = useRef<number>(0)

  // Inicializar texto al cargar o cambiar idioma
  useEffect(() => {
    const texts = sampleTexts[language]
    const randomText = texts[Math.floor(Math.random() * texts.length)]
    setCurrentText(randomText)
  }, [language])

  // Lógica del temporizador
  useEffect(() => {
    if (isActive && !isPaused && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((time) => {
          if (time <= 1) {
            finishRace()
            return 0
          }
          return time - 1
        })
      }, 1000)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isActive, isPaused, timeLeft])

  // Lógica de animación del fantasma
  useEffect(() => {
    if (isActive && !isPaused && selectedGhost) {
      const totalDuration = mode * 60 * 1000 // en milisegundos
      const updateInterval = 100 // Actualizar cada 100ms

      ghostIntervalRef.current = setInterval(() => {
        const elapsed = Date.now() - startTimeRef.current
        const progress = Math.min((elapsed / totalDuration) * 100, 100)

        // Simular escritura del fantasma basado en su WPM
        const expectedCharsPerMs = (selectedGhost.wpm * 5) / (60 * 1000) // caracteres por milisegundo
        const expectedPosition = Math.floor(elapsed * expectedCharsPerMs)

        setGhostProgress(Math.min(expectedPosition, currentText.length))
      }, updateInterval)
    } else {
      if (ghostIntervalRef.current) {
        clearInterval(ghostIntervalRef.current)
      }
    }

    return () => {
      if (ghostIntervalRef.current) {
        clearInterval(ghostIntervalRef.current)
      }
    }
  }, [isActive, isPaused, selectedGhost, mode, currentText.length])

  // Calcular estadísticas en tiempo real
  const calculateStats = useCallback(() => {
    const timeElapsed = (Date.now() - startTimeRef.current) / 1000 / 60 // en minutos
    const correctChars = userInput.split("").filter((char, index) => char === currentText[index]).length
    const totalChars = userInput.length
    const errors = totalChars - correctChars
    const wpm = timeElapsed > 0 ? Math.round(correctChars / 5 / timeElapsed) : 0
    const accuracy = totalChars > 0 ? Math.round((correctChars / totalChars) * 100) : 100

    setStats({
      wpm: Math.max(0, wpm),
      accuracy: Math.max(0, accuracy),
      errors,
      correctChars,
      totalChars,
      timeElapsed: timeElapsed * 60,
    })
  }, [userInput, currentText])

  // Actualizar estadísticas cuando cambia la entrada
  useEffect(() => {
    if (isActive) {
      calculateStats()
    }
  }, [userInput, isActive, calculateStats])

  useEffect(() => {
    if (isActive && !isPaused) {
      inputRef.current?.focus()
    }
  }, [isActive, isPaused])

  const startRace = () => {
    if (!selectedGhost) return

    setIsActive(true)
    setIsPaused(false)
    setTimeLeft(mode * 60)
    setUserInput("")
    setCurrentIndex(0)
    setGhostProgress(0)
    setRaceResult(null)
    startTimeRef.current = Date.now()
  }

  const pauseRace = () => {
    setIsPaused(!isPaused)
  }

  const resetRace = () => {
    setIsActive(false)
    setIsPaused(false)
    setTimeLeft(mode * 60)
    setUserInput("")
    setCurrentIndex(0)
    setGhostProgress(0)
    setRaceResult(null)
    setStats({
      wpm: 0,
      accuracy: 100,
      errors: 0,
      correctChars: 0,
      totalChars: 0,
      timeElapsed: 0,
    })

    // Generar nuevo texto
    const texts = sampleTexts[language]
    const randomText = texts[Math.floor(Math.random() * texts.length)]
    setCurrentText(randomText)
  }

  const finishRace = () => {
    setIsActive(false)
    setIsPaused(false)

    // Determinar resultado de la carrera
    if (selectedGhost) {
      const userWon = stats.wpm > selectedGhost.wpm
      setRaceResult(userWon ? "won" : "lost")

      // Actualizar estadísticas del usuario si está autenticado
      if (user) {
        const newBestWpm = Math.max(user.stats.bestWpm, stats.wpm)
        const newTotalRaces = user.stats.totalRaces + 1
        const newAverageWpm = Math.round((user.stats.averageWpm * user.stats.totalRaces + stats.wpm) / newTotalRaces)

        updateStats({
          totalRaces: newTotalRaces,
          bestWpm: newBestWpm,
          averageWpm: newAverageWpm,
          accuracy: Math.max(user.stats.accuracy, stats.accuracy),
        })

        // Verificar logros
        if (userWon) {
          unlockAchievement("ghost_winner")
        }
        if (stats.wpm > selectedGhost.wpm + 10) {
          unlockAchievement("ghost_crusher")
        }
      }
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isActive || isPaused) return

    const value = e.target.value
    setUserInput(value)
    setCurrentIndex(value.length)

    // Finalizar automáticamente si se completa el texto
    if (value.length >= currentText.length) {
      finishRace()
    }
  }

  const handleInputBlur = () => {
    if (isActive && !isPaused) {
      setTimeout(() => {
        inputRef.current?.focus()
      }, 0)
    }
  }

  // Determinar la clase CSS para cada carácter
  const getCharacterClass = (index: number) => {
    if (index < userInput.length) {
      return userInput[index] === currentText[index]
        ? "bg-green-500/20 text-green-700 dark:text-green-300"
        : "bg-red-500/20 text-red-700 dark:text-red-300"
    }
    if (index === currentIndex) {
      return "bg-primary/30 cursor-blink"
    }
    if (index <= ghostProgress) {
      return "bg-purple-500/10 text-purple-600 dark:text-purple-400"
    }
    return "text-muted-foreground"
  }

  const userProgress = (userInput.length / currentText.length) * 100
  const ghostProgressPercent = (ghostProgress / currentText.length) * 100

  return (
    <div className="space-y-6">
      {/* Selección de Fantasma */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Ghost className="h-5 w-5" />
            <span>{t("ghost.chooseOpponent")}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {mockGhosts.map((ghost) => (
              <Card
                key={ghost.id}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedGhost?.id === ghost.id ? "ring-2 ring-primary bg-primary/5" : ""
                }`}
                onClick={() => setSelectedGhost(ghost)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={ghost.avatar || "/placeholder.svg"} alt={ghost.name} />
                      <AvatarFallback>{ghost.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="font-semibold">{ghost.name}</div>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <span>{ghost.wpm} PPM</span>
                        <span>•</span>
                        <span>
                          {ghost.accuracy}% {t("test.accuracy")}
                        </span>
                      </div>
                    </div>
                    {selectedGhost?.id === ghost.id && (
                      <Badge variant="default" className="ml-2">
                        {t("ghost.selected")}
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Selección de Modo */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>{t("ghost.raceDuration")}</span>
            <div className="flex gap-2">
              {[1, 3, 5].map((time) => (
                <Button
                  key={time}
                  variant={mode === time ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    setMode(time as 1 | 3 | 5)
                    setTimeLeft(time * 60)
                  }}
                  disabled={isActive}
                >
                  {t(`mode.${time}min`)}
                </Button>
              ))}
            </div>
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Progreso de la Carrera */}
      {selectedGhost && (
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-primary rounded-full"></div>
                  <span>
                    {t("ghost.you")}: {stats.wpm} PPM
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <span>
                    {selectedGhost.name}: {selectedGhost.wpm} PPM
                  </span>
                </div>
              </div>

              <div className="relative">
                <Progress value={userProgress} className="h-3" />
                <div
                  className="absolute top-0 h-3 bg-purple-500/30 rounded-full transition-all duration-100"
                  style={{ width: `${ghostProgressPercent}%` }}
                />
              </div>

              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{t("ghost.start")}</span>
                <span>
                  {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, "0")} {t("ghost.remaining")}
                </span>
                <span>{t("ghost.finish")}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Visualización de Estadísticas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">{stats.wpm}</div>
            <div className="text-sm text-muted-foreground">{t("test.wpm")}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{stats.accuracy}%</div>
            <div className="text-sm text-muted-foreground">{t("test.accuracy")}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, "0")}
            </div>
            <div className="text-sm text-muted-foreground">{t("test.time")}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">{stats.errors}</div>
            <div className="text-sm text-muted-foreground">{t("test.errors")}</div>
          </CardContent>
        </Card>
      </div>

      {/* Área de Escritura */}
      <Card>
        <CardContent className="p-6">
          <div
            className="mb-4 p-4 bg-muted/50 rounded-lg min-h-[120px] text-lg leading-relaxed font-mono cursor-text select-none"
            onClick={() => inputRef.current?.focus()}
          >
            {currentText.split("").map((char, index) => (
              <span key={index} className={getCharacterClass(index)}>
                {char}
              </span>
            ))}
          </div>

          <input
            ref={inputRef}
            type="text"
            value={userInput}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            className="w-full p-3 border rounded-lg bg-background text-lg font-mono focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
            placeholder={isActive ? t("test.startTyping") : t("ghost.selectGhost")}
            disabled={!isActive || isPaused || !selectedGhost}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
          />
        </CardContent>
      </Card>

      {/* Controles */}
      <div className="flex justify-center gap-4">
        {!isActive ? (
          <Button onClick={startRace} size="lg" className="px-8" disabled={!selectedGhost}>
            <Play className="mr-2 h-4 w-4" />
            {t("ghost.startRace")}
          </Button>
        ) : (
          <Button onClick={pauseRace} size="lg" variant="outline" className="px-8 bg-transparent">
            <Pause className="mr-2 h-4 w-4" />
            {isPaused ? t("test.resume") : t("test.pause")}
          </Button>
        )}

        <Button onClick={resetRace} size="lg" variant="outline" className="px-8 bg-transparent">
          <RotateCcw className="mr-2 h-4 w-4" />
          {t("test.restart")}
        </Button>
      </div>

      {/* Resultados de la Carrera */}
      {raceResult && selectedGhost && (
        <Card className={`border-2 ${raceResult === "won" ? "border-green-500" : "border-red-500"}`}>
          <CardHeader>
            <CardTitle className="text-center flex items-center justify-center space-x-2">
              {raceResult === "won" ? (
                <>
                  <Trophy className="h-6 w-6 text-yellow-500" />
                  <span className="text-green-600">{t("ghost.victory")}</span>
                </>
              ) : (
                <>
                  <Ghost className="h-6 w-6 text-purple-500" />
                  <span className="text-red-600">{t("ghost.ghostWins")}</span>
                </>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="grid grid-cols-2 gap-8">
              <div>
                <h4 className="font-semibold mb-2">{t("ghost.yourPerformance")}</h4>
                <div className="space-y-1">
                  <div className="flex items-center justify-center space-x-2">
                    <Zap className="h-4 w-4 text-primary" />
                    <span className="text-2xl font-bold text-primary">{stats.wpm} PPM</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {stats.accuracy}% {t("test.accuracy")}
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">{selectedGhost.name}</h4>
                <div className="space-y-1">
                  <div className="flex items-center justify-center space-x-2">
                    <Ghost className="h-4 w-4 text-purple-500" />
                    <span className="text-2xl font-bold text-purple-500">{selectedGhost.wpm} PPM</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {selectedGhost.accuracy}% {t("test.accuracy")}
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t">
              <p className="text-sm text-muted-foreground">
                {raceResult === "won"
                  ? `${t("ghost.congratulations")} ${selectedGhost.name} ${t("ghost.by")} ${stats.wpm - selectedGhost.wpm} PPM!`
                  : `${selectedGhost.name} ${t("ghost.wonBy")} ${selectedGhost.wpm - stats.wpm} PPM. ${t("ghost.tryAgain")}`}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
