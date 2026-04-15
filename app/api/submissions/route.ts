import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { testId, firstName, lastName, role, level, answers } = body

    // Calculate score
    const test = await prisma.test.findUnique({
      where: { id: testId },
      include: { questions: true },
    })

    if (!test) {
      return NextResponse.json({ error: "Test topilmadi" }, { status: 404 })
    }

    let score = 0
    const processedAnswers = test.questions.map((q) => {
      const userAnswer = answers.find((a: any) => a.questionId === q.id)?.answer
      const isCorrect = userAnswer === q.correctAnswer
      if (isCorrect) score++
      return {
        questionId: q.id,
        questionText: q.text,
        correctAnswer: q.correctAnswer,
        answer: userAnswer,
        isCorrect,
      }
    })

    const submission = await prisma.submission.create({
      data: {
        testId,
        firstName,
        lastName,
        role: role.toUpperCase() as "STUDENT" | "TEACHER",
        level,
        answers: processedAnswers,
        score,
        totalQuestions: test.questions.length,
      },
    })

    return NextResponse.json(submission)
  } catch (error) {
    console.error("Submission error:", error)
    return NextResponse.json({ error: "Natijani saqlashda xatolik" }, { status: 500 })
  }
}
