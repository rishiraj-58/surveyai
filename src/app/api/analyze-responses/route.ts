import { currentUser } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { analyzeResponses } from '@/lib/openai'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    const user = await currentUser()
    const { surveyId, answers } = await req.json()

    if (!user) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    // Get survey questions
    const survey = await prisma.survey.findUnique({
      where: { id: surveyId },
    })

    if (!survey || survey.userId !== user.id) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    // Save responses
    const response = await prisma.response.create({
      data: {
        surveyId,
        userId: user.id,
        answers,
      },
    })

    // Analyze responses using OpenAI
    const analysis = await analyzeResponses(survey.questions, answers)

    // Save analysis
    const summary = await prisma.summary.create({
      data: {
        surveyId,
        sentimentAnalysis: analysis.sentimentAnalysis,
        keyInsights: analysis.keyInsights,
        recommendedActions: analysis.recommendedActions,
      },
    })

    return NextResponse.json({ response, summary })
  } catch (error) {
    console.error('[ANALYZE_RESPONSES_ERROR]', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
} 