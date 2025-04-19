import ModelClient, { isUnexpected } from "@azure-rest/ai-inference";
import { AzureKeyCredential } from "@azure/core-auth";

// Configure GitHub AI client
const token = process.env.GITHUB_TOKEN;
const endpoint = "https://models.github.ai/inference";
const model = "openai/gpt-4.1";

if (!token) {
  console.error("GITHUB_TOKEN environment variable is not set");
}

// Create the client
const createClient = () => {
  return ModelClient(
    endpoint,
    new AzureKeyCredential(token || "")
  );
};

/**
 * Generate survey questions based on a topic
 */
export async function generateSurveyQuestions(topic: string): Promise<string[]> {
  try {
    const client = createClient();
    
    const systemPrompt = "You are a professional survey creator. Generate relevant, clear, and unbiased questions for the given topic. Return ONLY a JSON array of strings with no additional text.";
    
    const response = await client.path("/chat/completions").post({
      body: {
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Generate survey questions about: ${topic}` }
        ],
        temperature: 0.7,
        top_p: 1,
        model: model
      }
    });

    if (isUnexpected(response)) {
      console.error("Error generating questions:", response.body);
      throw new Error("Failed to generate survey questions");
    }

    // Parse the response content
    const content = response.body.choices[0].message.content || '';
    
    try {
      // Try to parse as JSON directly
      return JSON.parse(content);
    } catch (e) {
      // If direct parsing fails, try to extract JSON from the text
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      // Fallback to default questions
      console.error("Could not parse response as JSON:", content);
      return [
        `What aspects of ${topic} are most important to you?`,
        `How would you rate your overall satisfaction with ${topic}?`,
        `What improvements would you suggest for ${topic}?`,
        `How likely are you to recommend ${topic} to others?`
      ];
    }
  } catch (error) {
    console.error("Error in generateSurveyQuestions:", error);
    // Return default questions on error
    return [
      `What aspects of ${topic} are most important to you?`,
      `How would you rate your overall satisfaction with ${topic}?`,
      `What improvements would you suggest for ${topic}?`,
      `How likely are you to recommend ${topic} to others?`
    ];
  }
}

/**
 * Analyze survey responses
 */
export async function analyzeResponses(questions: string[], answers: string[]) {
  try {
    const client = createClient();
    
    const systemPrompt = "Analyze the survey responses and provide: 1. Sentiment analysis (positive, neutral, negative percentages), 2. Key insights, 3. Recommended actions. Return ONLY a JSON object with these fields.";
    
    const response = await client.path("/chat/completions").post({
      body: {
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Questions: ${JSON.stringify(questions)}\nAnswers: ${JSON.stringify(answers)}` }
        ],
        temperature: 0.7,
        top_p: 1,
        model: model
      }
    });

    if (isUnexpected(response)) {
      console.error("Error analyzing responses:", response.body);
      throw new Error("Failed to analyze survey responses");
    }

    // Parse the response content
    const content = response.body.choices[0].message.content || '';
    
    try {
      // Try to parse as JSON directly
      return JSON.parse(content);
    } catch (e) {
      // If direct parsing fails, return default analysis
      console.error("Could not parse response as JSON:", content);
      return {
        sentimentAnalysis: {
          positive: '50%',
          neutral: '30%',
          negative: '20%'
        },
        keyInsights: ['Limited data available for analysis'],
        recommendedActions: ['Collect more responses for better insights']
      };
    }
  } catch (error) {
    console.error("Error in analyzeResponses:", error);
    // Return default analysis on error
    return {
      sentimentAnalysis: {
        positive: '50%',
        neutral: '30%',
        negative: '20%'
      },
      keyInsights: ['Limited data available for analysis'],
      recommendedActions: ['Collect more responses for better insights']
    };
  }
} 