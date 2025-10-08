"use client"

/**
 * ============================================================================
 * COMPONENTE DE NAVEGACIÓN (NAVIGATION)
 * ============================================================================
 *
 * Barra de navegación principal de la aplicación que incluye:
 * - Logo y enlaces principales
 * - Selector de tema (claro/oscuro)
 * - Selector de idioma (español/inglés)
 * - Menú de usuario con avatar y opciones
 * - Botón de inicio de sesión
 *
 * Es sticky (se queda fijo al hacer scroll) y tiene efecto de blur.
 */

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
  // Hooks para gestionar tema, idioma, autenticación y notificaciones
  const { theme, setTheme } = useTheme()
  const { language, setLanguage, t } = useLanguage()
  const { user, login, logout, isLoading } = useAuth()
  const { toast } = useToast()

  /**
   * Maneja el intento de inicio de sesión con Google
   * Por ahora muestra un toast indicando que está próximamente
   */
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
        {/* Logo - Icono de teclado que lleva al inicio */}
        <Link href="/" className="flex items-center space-x-2">
          <Keyboard className="h-8 w-8 text-primary" />
        </Link>

        {/* Enlaces de navegación - Solo visibles en desktop (md y superior) */}
        <div className="hidden md:flex items-center space-x-6">
          <Link href="/" className="text-sm font-medium hover:text-primary transition-colors">
            {t("nav.home")}
          </Link>
          <Link href="/leaderboard" className="text-sm font-medium hover:text-primary transition-colors">
            {t("nav.leaderboard")}
          </Link>
          {/* Enlaces adicionales solo para usuarios autenticados */}
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

        {/* Sección de controles y usuario */}
        <div className="flex items-center space-x-2">
          {/* Botón de cambio de tema (claro/oscuro) */}
          <Button variant="ghost" size="sm" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>

          {/* Menú desplegable de cambio de idioma */}
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

          {/* Menú de usuario o botón de inicio de sesión */}
          {isLoading ? (
            // Indicador de carga mientras se verifica la autenticación
            <Button variant="ghost" size="sm" disabled>
              <Loader2 className="h-4 w-4 animate-spin" />
            </Button>
          ) : user ? (
            // Menú desplegable de usuario autenticado
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
