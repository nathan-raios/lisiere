"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ArrowRight, BookOpen } from "lucide-react"
import Link from "next/link"

export default function JourneyPage() {
  const [currentDilemma, setCurrentDilemma] = useState(null)
  const [userResponses, setUserResponses] = useState([])
  const [freeTextResponse, setFreeTextResponse] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [journeyComplete, setJourneyComplete] = useState(false)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    loadJourney()
  }, [])

  const loadJourney = async () => {
    try {
      // Load user responses from localStorage
      const savedResponses = JSON.parse(localStorage.getItem("lisiere_responses") || "[]")
      setUserResponses(savedResponses)

      // Determine next dilemma based on responses
      const response = await fetch("/api/journey/next", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ responses: savedResponses }),
      })

      const data = await response.json()

      if (data.dilemma) {
        setCurrentDilemma(data.dilemma)
        setProgress(data.progress || 0)
      } else {
        setJourneyComplete(true)
      }
    } catch (error) {
      console.error("Error loading journey:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleChoiceResponse = async (choice) => {
    const newResponse = {
      dilemmaId: currentDilemma.id,
      question: currentDilemma.question,
      type: "choice",
      response: choice,
      timestamp: new Date().toISOString(),
    }

    const updatedResponses = [...userResponses, newResponse]
    setUserResponses(updatedResponses)
    localStorage.setItem("lisiere_responses", JSON.stringify(updatedResponses))

    // Load next dilemma
    setIsLoading(true)
    await loadJourney()
  }

  const handleFreeTextSubmit = async () => {
    if (!freeTextResponse.trim()) return

    const newResponse = {
      dilemmaId: currentDilemma.id,
      question: currentDilemma.question,
      type: "freeText",
      response: freeTextResponse,
      timestamp: new Date().toISOString(),
    }

    const updatedResponses = [...userResponses, newResponse]
    setUserResponses(updatedResponses)
    localStorage.setItem("lisiere_responses", JSON.stringify(updatedResponses))

    setFreeTextResponse("")
    setIsLoading(true)
    await loadJourney()
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black relative overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,215,0,0.1),transparent_50%)]"></div>
        </div>
        <div className="relative z-10 text-center space-y-4 px-4">
          <div className="text-xl sm:text-2xl font-thin text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-300 tracking-wider">
            CHARGEMENT DE VOTRE EXPÉRIENCE...
          </div>
          <div className="w-16 h-px bg-gradient-to-r from-transparent via-yellow-400 to-transparent mx-auto animate-pulse"></div>
        </div>
      </div>
    )
  }

  if (journeyComplete) {
    return (
      <div className="min-h-screen bg-black relative overflow-hidden flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,215,0,0.08),transparent_50%)]"></div>
        </div>

        <Card className="max-w-3xl mx-auto relative z-10 bg-gradient-to-br from-gray-900/90 to-black/90 backdrop-blur-sm border border-yellow-600/30 shadow-2xl shadow-yellow-500/10 w-full">
          <CardContent className="p-6 sm:p-8 md:p-12 text-center space-y-6 sm:space-y-8">
            <div className="space-y-4">
              <h1 className="text-3xl sm:text-4xl font-thin text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-300 tracking-wide">
                EXPÉRIENCE TERMINÉE
              </h1>
              <div className="h-px bg-gradient-to-r from-transparent via-yellow-400 to-transparent w-36 sm:w-48 mx-auto"></div>
            </div>

            <p className="text-lg sm:text-xl text-gray-300 font-light tracking-wide">
              Vous avez exploré {userResponses.length} réflexions philosophiques exclusives.
            </p>

            <div className="space-y-6">
              <Link href="/journal" className="block w-full sm:w-auto sm:inline-block">
                <Button className="bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-500 hover:to-amber-500 text-black font-medium px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg tracking-wider shadow-lg shadow-yellow-500/25 transition-all duration-300 hover:scale-105 w-full sm:w-auto">
                  <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3" />
                  CONSULTER VOTRE JOURNAL
                </Button>
              </Link>
              <div>
                <Link
                  href="/"
                  className="text-gray-400 hover:text-yellow-400 transition-colors tracking-wide text-sm sm:text-base"
                >
                  RETOUR À L'ACCUEIL
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Luxury background */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,rgba(255,215,0,0.05),transparent_50%)]"></div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-3 sm:p-4">
        <div className="max-w-4xl mx-auto w-full space-y-6 sm:space-y-8">
          <div className="text-center space-y-3 sm:space-y-4">
            <Progress
              value={progress}
              className="w-full max-w-md mx-auto h-1.5 sm:h-2 bg-gray-800 [&>div]:bg-gradient-to-r [&>div]:from-yellow-600 [&>div]:to-amber-500"
            />
            <p className="text-yellow-400 text-xs sm:text-sm tracking-wider font-light">
              QUESTION {userResponses.length + 1}
            </p>
          </div>

          <Card className="bg-gradient-to-br from-gray-900/90 to-black/90 backdrop-blur-sm border border-yellow-600/30 shadow-2xl shadow-yellow-500/10">
            <CardContent className="p-6 sm:p-8 md:p-12">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-light text-white mb-8 sm:mb-12 leading-relaxed text-center tracking-wide">
                {currentDilemma?.question}
              </h2>

              {currentDilemma?.type === "choice" && (
                <div className="space-y-3 sm:space-y-4">
                  {currentDilemma.choices?.map((choice, index) => (
                    <Button
                      key={index}
                      onClick={() => handleChoiceResponse(choice)}
                      className="w-full p-4 sm:p-6 md:p-8 text-left justify-start bg-gradient-to-r from-gray-800/50 to-gray-900/50 hover:from-yellow-600/20 hover:to-amber-600/20 text-white border border-yellow-600/20 hover:border-yellow-400/60 transition-all duration-500 hover:scale-[1.02] shadow-lg hover:shadow-yellow-500/20"
                      variant="outline"
                    >
                      <span className="text-base sm:text-lg font-light tracking-wide">{choice}</span>
                      <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 ml-auto text-yellow-400" />
                    </Button>
                  ))}
                </div>
              )}

              {currentDilemma?.type === "freeText" && (
                <div className="space-y-4">
                  <Textarea
                    value={freeTextResponse}
                    onChange={(e) => setFreeTextResponse(e.target.value)}
                    placeholder="Exprimez votre réflexion exclusive..."
                    className="min-h-32 sm:min-h-40 bg-gray-900/50 border-yellow-600/30 text-white placeholder:text-gray-400 resize-none focus:border-yellow-400 text-base sm:text-lg font-light"
                  />
                  <Button
                    onClick={handleFreeTextSubmit}
                    disabled={!freeTextResponse.trim()}
                    className="bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-500 hover:to-amber-500 text-black px-8 sm:px-12 py-3 sm:py-4 font-medium tracking-wide w-full sm:w-auto"
                  >
                    CONTINUER
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2 sm:ml-3" />
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="text-center">
            <Link
              href="/journal"
              className="text-gray-400 hover:text-yellow-400 transition-colors text-xs sm:text-sm tracking-wide"
            >
              CONSULTER VOTRE JOURNAL
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
