"use client"
import Link from "next/link"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useLanguage } from "@/components/language-provider"
import { useAuth } from "@/components/auth-provider"
import { Moon, Sun, Globe, Trophy, User, Settings, LogOut, Keyboard, Loader2, BarChart3 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function Navigation() {
  const { theme, setTheme } = useTheme()
  const { language, setLanguage, t } = useLanguage()
  const { user, login, logout, isLoading } = useAuth()
  const { toast } = useToast()

  const handleGoogleSignIn = () => {
    toast({
      title: t("auth.comingSoon"),
      description: "La autenticación con Google estará disponible pronto.",
      duration: 3000,
    })
  }

  return (
    <nav className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <Keyboard className="h-8 w-8 text-primary" />
          <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            TypeRace Pro
          </span>
        </Link>

        <div className="hidden md:flex items-center space-x-6">
          <Link href="/" className="text-sm font-medium hover:text-primary transition-colors">
            {t("nav.home")}
          </Link>
          <Link href="/leaderboard" className="text-sm font-medium hover:text-primary transition-colors">
            {t("nav.leaderboard")}
          </Link>
          {user && (
            <>
              <Link href="/stats" className="text-sm font-medium hover:text-primary transition-colors">
                {t("nav.stats")}
              </Link>
              <Link href="/profile" className="text-sm font-medium hover:text-primary transition-colors">
                {t("nav.profile")}
              </Link>
              <Link href="/achievements" className="text-sm font-medium hover:text-primary transition-colors">
                {t("nav.achievements")}
              </Link>
            </>
          )}
        </div>

        <div className="flex items-center space-x-2">
          {/* Cambio de Tema */}
          <Button variant="ghost" size="sm" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>

          {/* Cambio de Idioma */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <Globe className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setLanguage("es")}>Español</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLanguage("en")}>English</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Menú de Usuario */}
          {isLoading ? (
            <Button variant="ghost" size="sm" disabled>
              <Loader2 className="h-4 w-4 animate-spin" />
            </Button>
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium">{user.name}</p>
                    <p className="w-[200px] truncate text-sm text-muted-foreground">{user.email}</p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile">
                    <User className="mr-2 h-4 w-4" />
                    {t("nav.profile")}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/stats">
                    <BarChart3 className="mr-2 h-4 w-4" />
                    {t("nav.stats")}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/achievements">
                    <Trophy className="mr-2 h-4 w-4" />
                    {t("nav.achievements")}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings">
                    <Settings className="mr-2 h-4 w-4" />
                    {t("nav.settings")}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  {t("auth.logout")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button onClick={handleGoogleSignIn} size="sm">
              {t("auth.login")}
            </Button>
          )}
        </div>
      </div>
    </nav>
  )
}
