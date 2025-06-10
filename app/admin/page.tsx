"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Eye, BarChart3 } from "lucide-react"
import AdminAuth from "@/components/admin-auth"
import DilemmaForm from "@/components/dilemma-form"
import DilemmaList from "@/components/dilemma-list"

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [dilemmas, setDilemmas] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editingDilemma, setEditingDilemma] = useState(null)
  const [stats, setStats] = useState({ total: 0, choices: 0, freeText: 0 })

  useEffect(() => {
    const authStatus = localStorage.getItem("admin_authenticated")
    if (authStatus === "true") {
      setIsAuthenticated(true)
      loadDilemmas()
    }
  }, [])

  const loadDilemmas = async () => {
    try {
      const response = await fetch("/api/admin/dilemmas")
      const data = await response.json()
      setDilemmas(data.dilemmas || [])

      // Calculate stats
      const total = data.dilemmas?.length || 0
      const choices = data.dilemmas?.filter((d) => d.type === "choice").length || 0
      const freeText = data.dilemmas?.filter((d) => d.type === "freeText").length || 0
      setStats({ total, choices, freeText })
    } catch (error) {
      console.error("Error loading dilemmas:", error)
    }
  }

  const handleDilemmaSaved = () => {
    setShowForm(false)
    setEditingDilemma(null)
    loadDilemmas()
  }

  const handleEdit = (dilemma) => {
    setEditingDilemma(dilemma)
    setShowForm(true)
  }

  if (!isAuthenticated) {
    return <AdminAuth onAuthenticated={() => setIsAuthenticated(true)} />
  }

  return (
    <div className="min-h-screen bg-black p-3 sm:p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 p-4 sm:p-6 bg-gradient-to-r from-gray-900 to-black border border-yellow-600/30 rounded-lg">
          <div className="mb-4 sm:mb-0">
            <h1 className="text-3xl sm:text-4xl font-thin text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-300 tracking-wide">
              ADMINISTRATION
            </h1>
            <p className="text-gray-400 font-light tracking-wide">Gestion exclusive des dilemmes</p>
          </div>
          <Button
            onClick={() => {
              localStorage.removeItem("admin_authenticated")
              setIsAuthenticated(false)
            }}
            className="bg-gray-800 hover:bg-gray-700 text-yellow-400 border border-yellow-600/50"
          >
            Déconnexion
          </Button>
        </div>

        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-gray-900 border border-yellow-600/30 overflow-x-auto">
            <TabsTrigger
              value="dashboard"
              className="flex items-center gap-1 sm:gap-2 data-[state=active]:bg-yellow-600 data-[state=active]:text-black text-yellow-400 text-xs sm:text-sm"
            >
              <BarChart3 className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="truncate">Tableau de bord</span>
            </TabsTrigger>
            <TabsTrigger
              value="dilemmas"
              className="flex items-center gap-1 sm:gap-2 data-[state=active]:bg-yellow-600 data-[state=active]:text-black text-yellow-400 text-xs sm:text-sm"
            >
              <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="truncate">Dilemmes</span>
            </TabsTrigger>
            <TabsTrigger
              value="create"
              className="flex items-center gap-1 sm:gap-2 data-[state=active]:bg-yellow-600 data-[state=active]:text-black text-yellow-400 text-xs sm:text-sm"
            >
              <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="truncate">Créer</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
              <Card className="bg-gradient-to-br from-gray-900 to-black border border-yellow-600/30">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-yellow-400">Total Dilemmes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-light text-white">{stats.total}</div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-gray-900 to-black border border-yellow-600/30">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-yellow-400">Questions à choix</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-light text-white">{stats.choices}</div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-gray-900 to-black border border-yellow-600/30">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-yellow-400">Réponses libres</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-light text-white">{stats.freeText}</div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="dilemmas">
            <DilemmaList dilemmas={dilemmas} onEdit={handleEdit} onRefresh={loadDilemmas} />
          </TabsContent>

          <TabsContent value="create">
            <DilemmaForm
              dilemma={editingDilemma}
              onSaved={handleDilemmaSaved}
              onCancel={() => {
                setShowForm(false)
                setEditingDilemma(null)
              }}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
