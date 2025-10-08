/**
 * ============================================================================
 * PÁGINA PRINCIPAL (HOME PAGE)
 * ============================================================================
 *
 * Punto de entrada de la aplicación ChronoType.
 * Muestra la prueba de escritura interactiva y las estadísticas del usuario.
 *
 * Esta es una página de servidor (Server Component) que renderiza:
 * - Navegación global
 * - Contenido del cliente (prueba de escritura y estadísticas)
 */

import { Navigation } from "@/components/navigation"
import { ClientHomeContent } from "@/components/client-home-content"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      {/* Barra de navegación global */}
      <Navigation />

      {/* Contenido principal de la página */}
      <ClientHomeContent />
    </div>
  )
}
