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

export async function POST(request: NextRequest) {
  try {
    const { responses } = await request.json()
    const dilemmas = loadDilemmas()

    if (dilemmas.length === 0) {
      return NextResponse.json({ dilemma: null, message: "No dilemmas available" })
    }

    // Sort dilemmas by order
    const sortedDilemmas = dilemmas.sort((a: any, b: any) => a.order - b.order)

    // Find next dilemma based on responses
    const answeredDilemmaIds = responses.map((r: any) => r.dilemmaId)
    const nextDilemma = sortedDilemmas.find((d: any) => !answeredDilemmaIds.includes(d.id))

    if (!nextDilemma) {
      return NextResponse.json({ dilemma: null, message: "Journey complete" })
    }

    // Calculate progress
    const progress = (responses.length / sortedDilemmas.length) * 100

    return NextResponse.json({
      dilemma: nextDilemma,
      progress: Math.round(progress),
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to get next dilemma" }, { status: 500 })
  }
}
