"use client"

import type React from "react"

import { useState, useEffect, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useLanguage } from "@/components/language-provider"
import { useAuth } from "@/components/auth-provider"
import { RotateCcw, Play, Pause } from "lucide-react"

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
    "The art of programming requires patience, logic, and creativity. Every line of code is a step towards solving complex problems.",
    "Nature provides endless inspiration with its intricate patterns, vibrant colors, and harmonious ecosystems that sustain all life on Earth.",
  ],
  es: [
    "El veloz murciélago hindú comía feliz cardillo y kiwi. La cigüeña tocaba el saxofón detrás del palenque de paja.",
    "La tecnología ha revolucionado la forma en que nos comunicamos, trabajamos y vivimos. Desde teléfonos inteligentes hasta inteligencia artificial.",
    "Aprender a escribir eficientemente es una habilidad valiosa en el mundo digital actual. La práctica hace al maestro.",
    "El arte de la programación requiere paciencia, lógica y creatividad. Cada línea de código es un paso hacia la resolución de problemas complejos.",
    "La naturaleza proporciona inspiración infinita con sus patrones intrincados, colores vibrantes y ecosistemas armoniosos.",
  ],
}

export function TypingTestStandard() {
  const { t, language } = useLanguage()
  const { user, updateStats, unlockAchievement } = useAuth()

  const [mode, setMode] = useState<1 | 3 | 5>(1)
  const [isActive, setIsActive] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [timeLeft, setTimeLeft] = useState(60)
  const [currentText, setCurrentText] = useState("")
  const [userInput, setUserInput] = useState("")
  const [currentIndex, setCurrentIndex] = useState(0)
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
  const startTimeRef = useRef<number>(0)

  // Inicializar texto
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
            finishTest()
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

  const startTest = () => {
    setIsActive(true)
    setIsPaused(false)
    setTimeLeft(mode * 60)
    setUserInput("")
    setCurrentIndex(0)
    startTimeRef.current = Date.now()
    inputRef.current?.focus()
  }

  const pauseTest = () => {
    setIsPaused(!isPaused)
  }

  const resetTest = () => {
    setIsActive(false)
    setIsPaused(false)
    setTimeLeft(mode * 60)
    setUserInput("")
    setCurrentIndex(0)
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

  const finishTest = () => {
    setIsActive(false)
    setIsPaused(false)

    // Actualizar estadísticas del usuario si está conectado
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
      if (newTotalRaces === 1) {
        unlockAchievement("first_race")
      }
      if (stats.wpm >= 80) {
        unlockAchievement("speed_demon")
      }
      if (stats.accuracy >= 98) {
        unlockAchievement("accuracy_master")
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
      finishTest()
    }
  }

  const getCharacterClass = (index: number) => {
    if (index < userInput.length) {
      return userInput[index] === currentText[index]
        ? "bg-green-500/20 text-green-700 dark:text-green-300"
        : "bg-red-500/20 text-red-700 dark:text-red-300"
    }
    if (index === currentIndex) {
      return "bg-primary/30 cursor-blink"
    }
    return "text-muted-foreground"
  }

  const progress = ((mode * 60 - timeLeft) / (mode * 60)) * 100

  return (
    <div className="space-y-6">
      {/* Selección de Modo */}
      <div className="flex items-center justify-between">
        <span className="font-medium">{t("test.selectMode")}</span>
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
      </div>

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

      {/* Barra de Progreso */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>{t("test.progress")}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Área de Escritura */}
      <Card>
        <CardContent className="p-6">
          <div className="mb-4 p-4 bg-muted/50 rounded-lg min-h-[120px] text-lg leading-relaxed font-mono">
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
            className="w-full p-3 border rounded-lg bg-background text-lg font-mono focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder={isActive ? t("test.startTyping") : t("test.clickStart")}
            disabled={!isActive || isPaused}
          />
        </CardContent>
      </Card>

      {/* Controles */}
      <div className="flex justify-center gap-4">
        {!isActive ? (
          <Button onClick={startTest} size="lg" className="px-8">
            <Play className="mr-2 h-4 w-4" />
            {t("test.start")}
          </Button>
        ) : (
          <Button onClick={pauseTest} size="lg" variant="outline" className="px-8 bg-transparent">
            <Pause className="mr-2 h-4 w-4" />
            {isPaused ? t("test.resume") : t("test.pause")}
          </Button>
        )}

        <Button onClick={resetTest} size="lg" variant="outline" className="px-8 bg-transparent">
          <RotateCcw className="mr-2 h-4 w-4" />
          {t("test.restart")}
        </Button>
      </div>

      {/* Modal/Resultados de Prueba Completada */}
      {!isActive && stats.timeElapsed > 0 && (
        <Card className="border-primary">
          <CardHeader>
            <CardTitle className="text-center text-green-600">{t("test.testComplete")}</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <div className="text-3xl font-bold text-primary">{stats.wpm}</div>
                <div className="text-sm text-muted-foreground">{t("test.wpm")}</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-green-600">{stats.accuracy}%</div>
                <div className="text-sm text-muted-foreground">{t("test.accuracy")}</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-600">{stats.correctChars}</div>
                <div className="text-sm text-muted-foreground">{t("test.correct")}</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-red-600">{stats.errors}</div>
                <div className="text-sm text-muted-foreground">{t("test.errors")}</div>
              </div>
            </div>

            {user && (
              <div className="pt-4 border-t">
                <p className="text-sm text-muted-foreground">
                  {t("test.personalBest")}: {user.stats.bestWpm} {t("test.wpm")} | {t("test.average")}:{" "}
                  {user.stats.averageWpm} {t("test.wpm")}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
