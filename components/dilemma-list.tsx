"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2 } from "lucide-react"

interface DilemmaListProps {
  dilemmas: any[]
  onEdit: (dilemma: any) => void
  onRefresh: () => void
}

export default function DilemmaList({ dilemmas, onEdit, onRefresh }: DilemmaListProps) {
  const handleDelete = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce dilemme ?")) return

    try {
      const response = await fetch(`/api/admin/dilemmas/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        onRefresh()
      }
    } catch (error) {
      console.error("Error deleting dilemma:", error)
    }
  }

  return (
    <div className="space-y-4">
      {dilemmas.length === 0 ? (
        <Card>
          <CardContent className="p-6 sm:p-8 text-center">
            <p className="text-slate-500">Aucun dilemme créé pour le moment.</p>
          </CardContent>
        </Card>
      ) : (
        dilemmas
          .sort((a, b) => a.order - b.order)
          .map((dilemma) => (
            <Card
              key={dilemma.id}
              className="bg-gradient-to-br from-gray-900/80 to-black/80 border border-yellow-600/30 shadow-lg shadow-yellow-500/5"
            >
              <CardHeader className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="space-y-3">
                    <CardTitle className="text-lg sm:text-xl leading-relaxed text-white font-light tracking-wide">
                      {dilemma.question}
                    </CardTitle>
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                      <Badge
                        variant={dilemma.type === "choice" ? "default" : "secondary"}
                        className="bg-yellow-600/20 text-yellow-400 border border-yellow-600/40 font-light tracking-wide text-xs"
                      >
                        {dilemma.type === "choice" ? "CHOIX MULTIPLES" : "RÉPONSE LIBRE"}
                      </Badge>
                      <Badge variant="outline" className="border-yellow-600/40 text-yellow-400 font-light text-xs">
                        ORDRE: {dilemma.order}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex gap-2 self-start sm:self-center">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => onEdit(dilemma)}
                      className="border-yellow-600/50 text-yellow-400 hover:bg-yellow-600/20"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleDelete(dilemma.id)}
                      className="border-red-600/50 text-red-400 hover:bg-red-600/20"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              {dilemma.type === "choice" && dilemma.choices && (
                <CardContent className="pt-0 sm:pt-0 p-4 sm:p-6">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-slate-600">Options:</p>
                    <div className="grid gap-2">
                      {dilemma.choices.map((choice: string, index: number) => (
                        <div
                          key={index}
                          className="bg-gradient-to-r from-gray-800/30 to-gray-900/30 p-2 sm:p-3 rounded border border-yellow-600/20 text-xs sm:text-sm text-gray-200 font-light"
                        >
                          {choice}
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>
          ))
      )}
    </div>
  )
}
