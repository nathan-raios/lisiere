"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X, Plus } from "lucide-react"

interface DilemmaFormProps {
  dilemma?: any
  onSaved: () => void
  onCancel: () => void
}

export default function DilemmaForm({ dilemma, onSaved, onCancel }: DilemmaFormProps) {
  const [formData, setFormData] = useState({
    question: "",
    type: "choice",
    choices: [""],
    nextDilemmas: {},
    order: 0,
  })
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (dilemma) {
      setFormData({
        question: dilemma.question || "",
        type: dilemma.type || "choice",
        choices: dilemma.choices || [""],
        nextDilemmas: dilemma.nextDilemmas || {},
        order: dilemma.order || 0,
      })
    }
  }, [dilemma])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const method = dilemma ? "PUT" : "POST"
      const url = dilemma ? `/api/admin/dilemmas/${dilemma.id}` : "/api/admin/dilemmas"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        onSaved()
      }
    } catch (error) {
      console.error("Error saving dilemma:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const addChoice = () => {
    setFormData((prev) => ({
      ...prev,
      choices: [...prev.choices, ""],
    }))
  }

  const removeChoice = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      choices: prev.choices.filter((_, i) => i !== index),
    }))
  }

  const updateChoice = (index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      choices: prev.choices.map((choice, i) => (i === index ? value : choice)),
    }))
  }

  return (
    <Card className="bg-gradient-to-br from-gray-900/90 to-black/90 border border-yellow-600/30 shadow-xl shadow-yellow-500/10">
      <CardHeader className="border-b border-yellow-600/20 p-4 sm:p-6">
        <CardTitle className="text-xl sm:text-2xl font-light text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-300 tracking-wide">
          {dilemma ? "MODIFIER LE DILEMME" : "CRÉER UN NOUVEAU DILEMME"}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 sm:p-6 md:p-8">
        <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2 sm:mb-3 text-yellow-400 tracking-wide uppercase">
              Question
            </label>
            <Textarea
              value={formData.question}
              onChange={(e) => setFormData((prev) => ({ ...prev, question: e.target.value }))}
              placeholder="Posez votre question philosophique exclusive..."
              required
              className="min-h-24 sm:min-h-32 bg-gray-900/50 border-yellow-600/30 text-white placeholder:text-gray-400 focus:border-yellow-400 font-light"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-yellow-400 tracking-wide uppercase">
              Type de réponse
            </label>
            <Select value={formData.type} onValueChange={(value) => setFormData((prev) => ({ ...prev, type: value }))}>
              <SelectTrigger className="bg-gray-900/50 border-yellow-600/30 text-white focus:border-yellow-400">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-yellow-600/30 text-white">
                <SelectItem value="choice">Choix multiples</SelectItem>
                <SelectItem value="freeText">Réponse libre</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {formData.type === "choice" && (
            <div>
              <label className="block text-sm font-medium mb-2 text-yellow-400 tracking-wide uppercase">
                Options de réponse
              </label>
              <div className="space-y-3">
                {formData.choices.map((choice, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={choice}
                      onChange={(e) => updateChoice(index, e.target.value)}
                      placeholder={`Option ${index + 1}`}
                      required
                      className="bg-gray-900/50 border-yellow-600/30 text-white placeholder:text-gray-400 focus:border-yellow-400"
                    />
                    {formData.choices.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => removeChoice(index)}
                        className="border-yellow-600/30 text-yellow-400 hover:bg-yellow-600/20"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={addChoice}
                  className="w-full border-yellow-600/30 text-yellow-400 hover:bg-yellow-600/20"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Ajouter une option
                </Button>
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-2 text-yellow-400 tracking-wide uppercase">
              Ordre d'apparition
            </label>
            <Input
              type="number"
              value={formData.order}
              onChange={(e) => setFormData((prev) => ({ ...prev, order: Number.parseInt(e.target.value) || 0 }))}
              min="0"
              className="bg-gray-900/50 border-yellow-600/30 text-white placeholder:text-gray-400 focus:border-yellow-400"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2">
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-500 hover:to-amber-500 text-black font-medium tracking-wide order-2 sm:order-1"
            >
              {isLoading ? "ENREGISTREMENT..." : "ENREGISTRER"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="border-yellow-600/50 text-yellow-400 hover:bg-yellow-600/20 order-1 sm:order-2"
            >
              ANNULER
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
