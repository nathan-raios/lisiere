import { type NextRequest, NextResponse } from "next/server"
import fs from "fs"
import path from "path"

const dataPath = path.join(process.cwd(), "data", "dilemmas.json")

const loadDilemmas = () => {
  try {
    if (fs.existsSync(dataPath)) {
      const data = fs.readFileSync(dataPath, "utf8")
      return JSON.parse(data)
    }
  } catch (error) {
    console.error("Error loading dilemmas:", error)
  }
  return []
}

const saveDilemmas = (dilemmas: any[]) => {
  const dataDir = path.dirname(dataPath)
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true })
  }
  fs.writeFileSync(dataPath, JSON.stringify(dilemmas, null, 2))
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const dilemmaData = await request.json()
    const dilemmas = loadDilemmas()

    const index = dilemmas.findIndex((d: any) => d.id === params.id)
    if (index === -1) {
      return NextResponse.json({ error: "Dilemma not found" }, { status: 404 })
    }

    dilemmas[index] = {
      ...dilemmas[index],
      ...dilemmaData,
      updatedAt: new Date().toISOString(),
    }

    saveDilemmas(dilemmas)

    return NextResponse.json({ success: true, dilemma: dilemmas[index] })
  } catch (error) {
    return NextResponse.json({ error: "Failed to update dilemma" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const dilemmas = loadDilemmas()
    const filteredDilemmas = dilemmas.filter((d: any) => d.id !== params.id)

    if (filteredDilemmas.length === dilemmas.length) {
      return NextResponse.json({ error: "Dilemma not found" }, { status: 404 })
    }

    saveDilemmas(filteredDilemmas)

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete dilemma" }, { status: 500 })
  }
}
