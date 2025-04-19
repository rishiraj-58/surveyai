import { currentUser } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { generateSurveyQuestions } from '@/lib/openai'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    const user = await currentUser()
    const { topic } = await req.json()

    if (!user) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    // Ensure user exists in database
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id }
    });

    if (!dbUser) {
      // Create user if they don't exist in our database
      await prisma.user.create({
        data: {
          id: user.id,
          email: user.emailAddresses[0].emailAddress,
          name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.username || 'User',
        }
      });
    }

    // Generate questions using OpenAI
    const questions = await generateSurveyQuestions(topic)

    // Create survey in database
    const survey = await prisma.survey.create({
      data: {
        userId: user.id,
        topic,
        questions,
      },
    })

    return NextResponse.json(survey)
  } catch (error) {
    console.error('[GENERATE_QUESTIONS_ERROR]', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
} 