"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Download } from "lucide-react"
import Link from "next/link"

export default function JournalPage() {
  const [responses, setResponses] = useState([])

  useEffect(() => {
    const savedResponses = JSON.parse(localStorage.getItem("lisiere_responses") || "[]")
    setResponses(savedResponses)
  }, [])

  const exportJournal = () => {
    const journalText = responses
      .map((response, index) => {
        return `${index + 1}. ${response.question}\n\nRéponse: ${response.response}\n\nDate: ${new Date(response.timestamp).toLocaleString()}\n\n---\n\n`
      })
      .join("")

    const blob = new Blob([journalText], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "mon-journal-lisiere.txt"
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(255,215,0,0.05),transparent_50%)]"></div>
      </div>

      <div className="relative z-10 p-3 sm:p-4">
        <div className="max-w-5xl mx-auto space-y-6 sm:space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-6 bg-gradient-to-r from-gray-900/80 to-black/80 border border-yellow-600/30 rounded-lg backdrop-blur-sm">
            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6 mb-4 sm:mb-0">
              <Link href="/" className="mb-4 sm:mb-0">
                <Button variant="ghost" className="text-yellow-400 hover:bg-yellow-600/20 hover:text-yellow-300">
                  <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3" />
                  RETOUR
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl sm:text-4xl font-thin text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-300 tracking-wide">
                  VOTRE JOURNAL
                </h1>
                <p className="text-gray-400 font-light tracking-wide">Vos réflexions exclusives</p>
              </div>
            </div>

            {responses.length > 0 && (
              <Button
                onClick={exportJournal}
                className="bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-500 hover:to-amber-500 text-black font-medium tracking-wide"
              >
                <Download className="w-4 h-4 mr-2" />
                EXPORTER
              </Button>
            )}
          </div>

          {responses.length === 0 ? (
            <Card className="bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-sm border border-yellow-600/30">
              <CardContent className="p-6 sm:p-8 text-center">
                <p className="text-white text-lg">Votre journal est vide.</p>
                <p className="text-gray-300 mt-2">Commencez votre voyage pour créer vos premières réflexions.</p>
                <Link href="/journey" className="inline-block mt-4">
                  <Button className="bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-500 hover:to-amber-500 text-black">
                    COMMENCER LE VOYAGE
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4 sm:space-y-6">
              {responses.map((response, index) => (
                <Card
                  key={index}
                  className="bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-sm border border-yellow-600/30 shadow-xl shadow-yellow-500/5"
                >
                  <CardHeader className="p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-0">
                      <CardTitle className="text-white font-light text-lg sm:text-xl leading-relaxed tracking-wide">
                        {response.question}
                      </CardTitle>
                      <Badge
                        variant="secondary"
                        className="bg-yellow-600/20 text-yellow-400 border border-yellow-600/40 font-light tracking-wide w-fit"
                      >
                        {response.type === "choice" ? "CHOIX" : "RÉFLEXION"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
                    <div className="space-y-3 sm:space-y-4">
                      <div className="bg-gradient-to-r from-gray-800/30 to-gray-900/30 p-4 sm:p-6 rounded-lg border border-yellow-600/20">
                        <p className="text-gray-200 leading-relaxed font-light tracking-wide">{response.response}</p>
                      </div>
                      <p className="text-gray-500 text-xs sm:text-sm tracking-wide">
                        {new Date(response.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
