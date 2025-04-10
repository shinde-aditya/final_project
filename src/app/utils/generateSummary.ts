import { GoogleGenerativeAI } from "@google/generative-ai"

const apiKey = process.env.GEMINI_API_KEY
const genAI = new GoogleGenerativeAI(apiKey as string)

export async function generateSummary(transcript: string): Promise<string> {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

  const prompt = `
    Summarize the following tutoring session transcript. Include:
    1. Main topics covered
    2. Key points discussed
    3. Any action items or homework assigned

    Transcript:
    ${transcript}
  `

  const result = await model.generateContent(prompt)
  const summary = result.response.text()

  return summary
}

