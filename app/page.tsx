import { Navigation } from "@/components/navigation"
import { ClientHomeContent } from "@/components/client-home-content"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      <Navigation />
      <ClientHomeContent />
    </div>
  )
}
