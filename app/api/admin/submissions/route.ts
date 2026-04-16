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

export async function DELETE(req: NextRequest) {
  // Check auth
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: "Ruxsat berilmagan" }, { status: 401 })
  }

  try {
    const { ids } = await req.json()
    
    if (!ids || !Array.isArray(ids)) {
      return NextResponse.json({ error: "ID-lar ro'yxati topilmadi" }, { status: 400 })
    }

    await prisma.submission.deleteMany({
      where: {
        id: { in: ids }
      }
    })

    return NextResponse.json({ message: "Tanlangan natijalar o'chirildi" })
  } catch (error) {
    console.error("Bulk delete error:", error)
    return NextResponse.json({ error: "Natijalarni o'chirishda xatolik" }, { status: 500 })
  }
}
