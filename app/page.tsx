import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Background luxury pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,215,0,0.1),transparent_50%)]"></div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="max-w-4xl mx-auto text-center space-y-8 sm:space-y-12">
          <div className="space-y-6 sm:space-y-8">
            <div className="relative">
              <h1 className="text-5xl sm:text-6xl md:text-8xl font-thin text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-200 tracking-wide sm:tracking-[0.2em] mb-4">
                LISIÈRE
              </h1>
              <div className="h-px bg-gradient-to-r from-transparent via-yellow-400 to-transparent w-48 sm:w-64 mx-auto"></div>
            </div>

            <div className="space-y-4 sm:space-y-6 px-2">
              <p className="text-xl sm:text-2xl text-amber-100 font-light tracking-wide">
                Une expérience philosophique exclusive
              </p>
              <p className="text-base sm:text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed font-light px-4 sm:px-0">
                Explorez les profondeurs de votre conscience à travers un voyage introspectif réservé aux esprits en
                quête de vérité.
              </p>
            </div>
          </div>

          <div className="space-y-6 sm:space-y-8">
            <Link href="/journey">
              <Button
                size="lg"
                className="bg-gradient-to-r from-yellow-600 via-yellow-500 to-yellow-600 hover:from-yellow-500 hover:via-yellow-400 hover:to-yellow-500 text-black font-medium px-8 sm:px-12 py-5 sm:py-6 text-lg sm:text-xl tracking-wider border border-yellow-400 shadow-2xl shadow-yellow-500/25 transition-all duration-500 hover:scale-105 hover:shadow-yellow-400/40 w-full sm:w-auto"
              >
                COMMENCER L'EXPÉRIENCE
              </Button>
            </Link>

            <div className="pt-8 sm:pt-12">
              <Link
                href="/admin"
                className="text-sm text-gray-500 hover:text-yellow-400 transition-colors tracking-wide"
              >
                ACCÈS PRIVILÉGIÉ
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
