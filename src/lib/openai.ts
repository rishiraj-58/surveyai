import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function generateSurveyQuestions(topic: string) {
  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: "You are a professional survey creator. Generate relevant, clear, and unbiased questions for the given topic. Return the questions as a JSON array of strings."
      },
      {
        role: "user",
        content: `Generate survey questions about: ${topic}`
      }
    ],
    response_format: { type: "json_object" }
  })

  const response = JSON.parse(completion.choices[0].message.content || '{"questions": []}')
  return response.questions
}

export async function analyzeResponses(questions: string[], answers: string[]) {
  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: "Analyze the survey responses and provide: 1. Sentiment analysis (positive, neutral, negative percentages), 2. Key insights, 3. Recommended actions. Return the analysis as a JSON object."
      },
      {
        role: "user",
        content: `Questions: ${JSON.stringify(questions)}\nAnswers: ${JSON.stringify(answers)}`
      }
    ],
    response_format: { type: "json_object" }
  })

  return JSON.parse(completion.choices[0].message.content || '{}')
} 