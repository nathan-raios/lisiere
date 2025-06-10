import { type NextRequest, NextResponse } from "next/server"
import fs from "fs"
import path from "path"

const dataPath = path.join(process.cwd(), "data", "dilemmas.json")

// Ensure data directory exists
const ensureDataDir = () => {
  const dataDir = path.dirname(dataPath)
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true })
  }
}

const loadDilemmas = () => {
  ensureDataDir()
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
  ensureDataDir()
  fs.writeFileSync(dataPath, JSON.stringify(dilemmas, null, 2))
}

export async function GET() {
  try {
    const dilemmas = loadDilemmas()
    return NextResponse.json({ dilemmas })
  } catch (error) {
    return NextResponse.json({ error: "Failed to load dilemmas" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const dilemmaData = await request.json()
    const dilemmas = loadDilemmas()

    const newDilemma = {
      id: Date.now().toString(),
      ...dilemmaData,
      createdAt: new Date().toISOString(),
    }

    dilemmas.push(newDilemma)
    saveDilemmas(dilemmas)

    return NextResponse.json({ success: true, dilemma: newDilemma })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create dilemma" }, { status: 500 })
  }
}
