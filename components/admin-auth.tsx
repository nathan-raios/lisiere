"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface AdminAuthProps {
  onAuthenticated: () => void
}

export default function AdminAuth({ onAuthenticated }: AdminAuthProps) {
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      })

      const data = await response.json()

      if (data.success) {
        localStorage.setItem("admin_authenticated", "true")
        onAuthenticated()
      } else {
        setError("Mot de passe incorrect")
      }
    } catch (error) {
      setError("Erreur de connexion")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,215,0,0.08),transparent_50%)]"></div>
      </div>

      <Card className="w-full max-w-md relative z-10 bg-gradient-to-br from-gray-900/90 to-black/90 backdrop-blur-sm border border-yellow-600/30 shadow-2xl shadow-yellow-500/10">
        <CardHeader className="text-center space-y-4 p-6 sm:p-8">
          <CardTitle className="text-2xl sm:text-3xl font-thin text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-300 tracking-wide">
            ACCÈS PRIVILÉGIÉ
          </CardTitle>
          <div className="h-px bg-gradient-to-r from-transparent via-yellow-400 to-transparent w-32 mx-auto"></div>
        </CardHeader>
        <CardContent className="p-6 sm:p-8">
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <Input
                type="password"
                placeholder="Mot de passe exclusif"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-gray-900/50 border-yellow-600/30 text-white placeholder:text-gray-400 focus:border-yellow-400 h-12 text-center tracking-wider"
              />
            </div>

            {error && (
              <Alert variant="destructive" className="bg-red-900/20 border-red-600/30 text-red-400">
                <AlertDescription className="text-center font-light">{error}</AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-500 hover:to-amber-500 text-black font-medium tracking-wider h-12"
              disabled={isLoading}
            >
              {isLoading ? "CONNEXION..." : "ACCÉDER"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
