import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { auth } from "@/lib/auth"

export async function GET(req: NextRequest) {
  // Check auth
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: "Ruxsat berilmagan" }, { status: 401 })
  }

  try {
    const submissions = await prisma.submission.findMany({
      include: {
        test: {
          include: {
            questions: true
          }
        }
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json(submissions)
  } catch (error) {
    console.error("Admin submissions error:", error)
    return NextResponse.json({ error: "Ma'lumotlarni yuklashda xatolik" }, { status: 500 })
  }
}
