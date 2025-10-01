"use client"
import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TypingTestStandard } from "@/components/typing-test-standard"
import { GhostRaceMode } from "@/components/ghost-race-mode"
import { useLanguage } from "@/components/language-provider"
import { Timer, Ghost } from "lucide-react"

export function TypingTest() {
  const { t } = useLanguage()
  const [activeTab, setActiveTab] = useState("standard")

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("test.title")}</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="standard" className="flex items-center space-x-2">
              <Timer className="h-4 w-4" />
              <span>{t("test.standardTest")}</span>
            </TabsTrigger>
            <TabsTrigger value="ghost" className="flex items-center space-x-2">
              <Ghost className="h-4 w-4" />
              <span>{t("mode.ghost")}</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="standard" className="mt-6">
            <TypingTestStandard />
          </TabsContent>

          <TabsContent value="ghost" className="mt-6">
            <GhostRaceMode />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
