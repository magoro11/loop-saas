import Anthropic from "@anthropic-ai/sdk"
import { Sentiment } from "@prisma/client"

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || "",
})

export type ClassificationResult = {
  sentiment: Sentiment
  sentimentScore: number
  themes: string[]
  featureArea: string
  rationale: string
}

export type AskLoopResult = {
  answer: string
  citations: { id: string; content: string; score: number }[]
}

export async function classifyFeedback(text: string, existingThemeNames: string[]): Promise<ClassificationResult> {
  if (!process.env.ANTHROPIC_API_KEY) {
    return {
      sentiment: Sentiment.NEUTRAL,
      sentimentScore: 0,
      themes: [],
      featureArea: "General",
      rationale: "No API key configured.",
    }
  }

  const themeList = existingThemeNames.length > 0 ? existingThemeNames.join(", ") : "none yet"

  const prompt = `You are a customer feedback classifier. Analyze the following feedback text and return ONLY a JSON object with these exact keys:
- sentiment: one of "POSITIVE", "NEUTRAL", "NEGATIVE"
- sentimentScore: a float between -1 and 1
- themes: an array of theme names (choose from existing themes if possible, otherwise create new concise names). Existing themes: ${themeList}
- featureArea: a short string describing the product area (e.g., "Onboarding", "Billing", "Mobile App")
- rationale: a one-sentence explanation

Feedback text: """${text}"""

Return ONLY valid JSON, no markdown, no explanation.`

  try {
    const message = await anthropic.messages.create({
      model: "claude-3-5-haiku-20241022",
      max_tokens: 300,
      messages: [{ role: "user", content: prompt }],
    })

    const raw = message.content[0].type === "text" ? message.content[0].text : "{}"
    const cleaned = raw.replace(/```json/g, "").replace(/```/g, "").trim()
    const parsed = JSON.parse(cleaned) as ClassificationResult

    return {
      sentiment: parsed.sentiment || Sentiment.NEUTRAL,
      sentimentScore: Math.max(-1, Math.min(1, Number(parsed.sentimentScore) || 0)),
      themes: Array.isArray(parsed.themes) ? parsed.themes.slice(0, 3) : [],
      featureArea: parsed.featureArea || "General",
      rationale: parsed.rationale || "",
    }
  } catch (error) {
    console.error("Classification error:", error)
    return {
      sentiment: Sentiment.NEUTRAL,
      sentimentScore: 0,
      themes: [],
      featureArea: "General",
      rationale: "Classification failed.",
    }
  }
}

export async function generateEmbedding(text: string): Promise<number[]> {
  const apiKey = process.env.OPENAI_API_KEY || process.env.EMBEDDING_API_KEY
  if (!apiKey) {
    return fallbackEmbedding(text)
  }

  try {
    const res = await fetch("https://api.openai.com/v1/embeddings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "text-embedding-3-small",
        input: text,
      }),
    })

    if (!res.ok) {
      const err = await res.text()
      console.error("Embedding API error:", res.status, err)
      return fallbackEmbedding(text)
    }

    const data = await res.json()
    const vector = data?.data?.[0]?.embedding as number[] | undefined
    if (!Array.isArray(vector) || vector.length === 0) {
      return fallbackEmbedding(text)
    }
    return vector
  } catch (error) {
    console.error("Embedding generation failed:", error)
    return fallbackEmbedding(text)
  }
}

function fallbackEmbedding(text: string): number[] {
  const vec: number[] = []
  let hash = 0
  for (let i = 0; i < text.length; i++) {
    hash = ((hash << 5) - hash + text.charCodeAt(i)) | 0
  }
  let seed = Math.abs(hash) || 1
  for (let i = 0; i < 1536; i++) {
    seed = (seed * 16807 + 0) % 2147483647
    vec.push((seed / 2147483647) * 2 - 1)
  }
  return vec
}

export function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) return 0
  let dot = 0
  let normA = 0
  let normB = 0
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i]
    normA += a[i] * a[i]
    normB += b[i] * b[i]
  }
  const denom = Math.sqrt(normA) * Math.sqrt(normB)
  return denom === 0 ? 0 : dot / denom
}

export async function askLoop(question: string, feedbacks: { id: string; content: string; vector: number[] }[]): Promise<AskLoopResult> {
  if (!process.env.ANTHROPIC_API_KEY) {
    return {
      answer: "AI is not configured. Set ANTHROPIC_API_KEY to enable Ask LOOP.",
      citations: [],
    }
  }

  const queryVector = await generateEmbedding(question)
  const scored = feedbacks
    .map((f) => ({
      id: f.id,
      content: f.content,
      score: cosineSimilarity(queryVector, f.vector),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 8)

  const context = scored
    .map((s, i) => `[${i + 1}] (id: ${s.id}, relevance: ${s.score.toFixed(2)}) "${s.content}"`)
    .join("\n\n")

  const prompt = `You are a helpful assistant answering questions about customer feedback. Use ONLY the provided feedback items to answer. If the answer is not present in the feedback, say "I don't have that information in the feedback data."

Question: ${question}

Relevant feedback:
${context}

Answer concisely. Cite feedback items by their [number] when relevant.`

  try {
    const message = await anthropic.messages.create({
      model: "claude-3-5-haiku-20241022",
      max_tokens: 500,
      messages: [{ role: "user", content: prompt }],
    })

    const answer = message.content[0].type === "text" ? message.content[0].text : "No answer generated."
    return { answer, citations: scored }
  } catch (error) {
    console.error("Ask LOOP error:", error)
    return {
      answer: "Sorry, I encountered an error generating the answer.",
      citations: scored,
    }
  }
}

export async function generateReportNarrative(stats: {
  totalFeedback: number
  topThemes: { name: string; count: number }[]
  sentimentBreakdown: { positive: number; neutral: number; negative: number }
  channelBreakdown: Record<string, number>
  recentFeedback: { content: string; channel: string }[]
}): Promise<string> {
  if (!process.env.ANTHROPIC_API_KEY) {
    return "AI report generation is not configured."
  }

  const prompt = `You are a product analyst writing a Voice of Customer report. Write a concise, professional narrative based on these stats. Include:
1. An executive summary
2. Key themes and their volumes
3. Sentiment overview
4. Notable verbatim quotes (use the recent feedback items)
5. Recommended actions

Stats:
- Total feedback: ${stats.totalFeedback}
- Top themes: ${JSON.stringify(stats.topThemes)}
- Sentiment: ${JSON.stringify(stats.sentimentBreakdown)}
- Channels: ${JSON.stringify(stats.channelBreakdown)}
- Recent quotes: ${JSON.stringify(stats.recentFeedback)}

Write in a professional tone suitable for leadership. Keep it under 400 words.`

  try {
    const message = await anthropic.messages.create({
      model: "claude-3-5-haiku-20241022",
      max_tokens: 600,
      messages: [{ role: "user", content: prompt }],
    })

    return message.content[0].type === "text" ? message.content[0].text : "Report generation failed."
  } catch (error) {
    console.error("Report generation error:", error)
    return "Report generation failed due to an error."
  }
}
