"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/auth-provider"
import { Keyboard, Palette, Volume2, Lock, CheckCircle } from "lucide-react"

interface UnlockableItem {
  id: string
  name: string
  description: string
  rarity: "common" | "rare" | "epic" | "legendary"
  unlocked: boolean
  preview?: string
  requiredAchievement?: string
}

const unlockableItems = {
  keyboards: [
    {
      id: "default",
      name: "Classic",
      description: "The standard typing experience",
      rarity: "common" as const,
      unlocked: true,
      preview: "⌨️ QWERTY Layout",
    },
    {
      id: "retro",
      name: "Retro Terminal",
      description: "Green text on black background",
      rarity: "common" as const,
      unlocked: false,
      preview: "💚 Vintage Computing",
      requiredAchievement: "first_race",
    },
    {
      id: "neon",
      name: "Neon Glow",
      description: "Cyberpunk-inspired glowing keys",
      rarity: "rare" as const,
      unlocked: false,
      preview: "🌈 RGB Lighting",
      requiredAchievement: "speed_demon",
    },
    {
      id: "lightning",
      name: "Lightning Strike",
      description: "Electric blue with lightning effects",
      rarity: "epic" as const,
      unlocked: false,
      preview: "⚡ Electric Theme",
      requiredAchievement: "lightning_fast",
    },
    {
      id: "divine",
      name: "Divine Touch",
      description: "Golden keys fit for typing gods",
      rarity: "legendary" as const,
      unlocked: false,
      preview: "👑 Golden Majesty",
      requiredAchievement: "typing_god",
    },
  ],
  backgrounds: [
    {
      id: "default",
      name: "Clean Minimal",
      description: "Simple and distraction-free",
      rarity: "common" as const,
      unlocked: true,
      preview: "🤍 Minimalist",
    },
    {
      id: "matrix",
      name: "Matrix Rain",
      description: "Falling green code in the background",
      rarity: "rare" as const,
      unlocked: false,
      preview: "💚 Digital Rain",
      requiredAchievement: "speed_demon",
    },
    {
      id: "storm",
      name: "Thunder Storm",
      description: "Dark clouds with lightning flashes",
      rarity: "epic" as const,
      unlocked: false,
      preview: "⛈️ Storm Clouds",
      requiredAchievement: "lightning_fast",
    },
    {
      id: "celestial",
      name: "Celestial Realm",
      description: "Starry sky with cosmic nebulae",
      rarity: "legendary" as const,
      unlocked: false,
      preview: "🌌 Cosmic Beauty",
      requiredAchievement: "typing_god",
    },
  ],
  sounds: [
    {
      id: "default",
      name: "Classic Click",
      description: "Traditional mechanical keyboard sound",
      rarity: "common" as const,
      unlocked: true,
      preview: "🔊 Click-clack",
    },
    {
      id: "perfect",
      name: "Perfect Chime",
      description: "Satisfying bell sound for accuracy",
      rarity: "rare" as const,
      unlocked: false,
      preview: "🔔 Harmonious",
      requiredAchievement: "accuracy_master",
    },
    {
      id: "thunder",
      name: "Thunder Clap",
      description: "Powerful thunder for each keystroke",
      rarity: "epic" as const,
      unlocked: false,
      preview: "⚡ Thunderous",
      requiredAchievement: "lightning_fast",
    },
    {
      id: "divine",
      name: "Divine Harmony",
      description: "Ethereal tones from the heavens",
      rarity: "legendary" as const,
      unlocked: false,
      preview: "👼 Angelic",
      requiredAchievement: "typing_god",
    },
  ],
}

export function UnlockablesSection() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState("keyboards")

  if (!user) return null

  const getRarityColor = (rarity: UnlockableItem["rarity"]) => {
    switch (rarity) {
      case "common":
        return "text-gray-600 border-gray-200"
      case "rare":
        return "text-blue-600 border-blue-200"
      case "epic":
        return "text-purple-600 border-purple-200"
      case "legendary":
        return "text-yellow-600 border-yellow-200"
    }
  }

  const getRarityBadgeVariant = (rarity: UnlockableItem["rarity"]) => {
    switch (rarity) {
      case "common":
        return "secondary"
      case "rare":
        return "default"
      case "epic":
        return "destructive"
      case "legendary":
        return "outline"
    }
  }

  const isItemUnlocked = (type: keyof typeof unlockableItems, itemId: string) => {
    return user.unlocks[type].includes(itemId)
  }

  const UnlockableGrid = ({ items, type }: { items: UnlockableItem[]; type: keyof typeof unlockableItems }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map((item) => {
        const unlocked = isItemUnlocked(type, item.id)

        return (
          <Card
            key={item.id}
            className={`transition-all hover:shadow-md ${
              unlocked ? `${getRarityColor(item.rarity)} bg-gradient-to-br from-background to-accent/5` : "opacity-75"
            }`}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className={`text-2xl ${unlocked ? "" : "grayscale"}`}>{item.preview?.split(" ")[0] || "🔒"}</div>
                <div className="flex flex-col items-end space-y-1">
                  <Badge variant={getRarityBadgeVariant(item.rarity)} className="text-xs">
                    {item.rarity.toUpperCase()}
                  </Badge>
                  {unlocked && <CheckCircle className="h-4 w-4 text-green-600" />}
                </div>
              </div>

              <h3 className="font-semibold mb-1">{item.name}</h3>
              <p className="text-sm text-muted-foreground mb-2">{item.description}</p>

              {item.preview && <p className="text-xs text-primary mb-3">{item.preview}</p>}

              {!unlocked && item.requiredAchievement && (
                <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                  <Lock className="h-3 w-3" />
                  <span>Requires: {item.requiredAchievement.replace("_", " ")}</span>
                </div>
              )}

              {unlocked && (
                <Button size="sm" variant="outline" className="w-full mt-2 bg-transparent">
                  Select
                </Button>
              )}
            </CardContent>
          </Card>
        )
      })}
    </div>
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>Unlockable Items</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="keyboards" className="flex items-center space-x-2">
              <Keyboard className="h-4 w-4" />
              <span>Keyboards</span>
            </TabsTrigger>
            <TabsTrigger value="backgrounds" className="flex items-center space-x-2">
              <Palette className="h-4 w-4" />
              <span>Backgrounds</span>
            </TabsTrigger>
            <TabsTrigger value="sounds" className="flex items-center space-x-2">
              <Volume2 className="h-4 w-4" />
              <span>Sounds</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="keyboards" className="mt-6">
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-2">Keyboard Themes</h3>
                <p className="text-sm text-muted-foreground">
                  Customize your typing experience with unique keyboard styles
                </p>
              </div>
              <UnlockableGrid items={unlockableItems.keyboards} type="keyboards" />
            </div>
          </TabsContent>

          <TabsContent value="backgrounds" className="mt-6">
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-2">Background Themes</h3>
                <p className="text-sm text-muted-foreground">Set the perfect atmosphere for your typing sessions</p>
              </div>
              <UnlockableGrid items={unlockableItems.backgrounds} type="backgrounds" />
            </div>
          </TabsContent>

          <TabsContent value="sounds" className="mt-6">
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-2">Sound Effects</h3>
                <p className="text-sm text-muted-foreground">Enhance your typing with satisfying audio feedback</p>
              </div>
              <UnlockableGrid items={unlockableItems.sounds} type="sounds" />
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
