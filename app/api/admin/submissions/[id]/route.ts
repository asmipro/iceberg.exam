import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const submission = await prisma.submission.findUnique({
      where: { id },
      include: {
        test: {
          include: {
            questions: true
          }
        }
      }
    })

    if (!submission) {
      return NextResponse.json({ error: "Natija topilmadi" }, { status: 404 })
    }

    return NextResponse.json(submission)
  } catch (error) {
    console.error("Submission fetch error:", error)
    return NextResponse.json({ error: "Tanlangan natijani yuklashda xatolik" }, { status: 500 })
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await prisma.submission.delete({
      where: { id }
    })

    return NextResponse.json({ message: "Natija o'chirildi" })
  } catch (error) {
    console.error("Submission delete error:", error)
    return NextResponse.json({ error: "Natijani o'chirishda xatolik" }, { status: 500 })
  }
}
