import { NextResponse } from "next/server"
import { prisma } from "../../../../lib/prisma"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../../../lib/nextauth"
import type { Session } from "next-auth"
import { Role, Channel, Sentiment, Status } from "@prisma/client"

function requireRole(session: Session | null, allowedRoles: string[]) {
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  if (!allowedRoles.includes(session.user.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }
  return null
}

const SIMULATED_FEEDBACK = [
  { content: "The onboarding flow is confusing. I couldn't figure out how to invite my team members.", channel: Channel.WEB, sentiment: Sentiment.NEGATIVE, sentimentScore: -0.7 },
  { content: "Love the new dark mode! It's much easier on the eyes during late-night work sessions.", channel: Channel.APPSTORE, sentiment: Sentiment.POSITIVE, sentimentScore: 0.8 },
  { content: "The Slack integration stopped working after the last update. Really blocking our workflow.", channel: Channel.EMAIL, sentiment: Sentiment.NEGATIVE, sentimentScore: -0.8 },
  { content: "Would be great to have a calendar view for tasks. Currently only list view available.", channel: Channel.NPS, sentiment: Sentiment.NEUTRAL, sentimentScore: 0.1 },
  { content: "Performance has been noticeably slower since the v2.0 release. Pages take 5+ seconds to load.", channel: Channel.SOCIAL, sentiment: Sentiment.NEGATIVE, sentimentScore: -0.9 },
  { content: "Customer support was incredibly helpful when I had billing questions. Shoutout to the team!", channel: Channel.CALL, sentiment: Sentiment.POSITIVE, sentimentScore: 0.9 },
  { content: "Can we get a mobile app? The web version on mobile is clunky and hard to use.", channel: Channel.APPSTORE, sentiment: Sentiment.NEUTRAL, sentimentScore: 0.2 },
  { content: "The export to CSV feature is broken. It only exports 100 rows even though I have 500.", channel: Channel.WEB, sentiment: Sentiment.NEGATIVE, sentimentScore: -0.6 },
  { content: "Really enjoying the new collaboration features. Real-time editing is smooth.", channel: Channel.NPS, sentiment: Sentiment.POSITIVE, sentimentScore: 0.7 },
  { content: "Why was the old notification system replaced? The new one is way too noisy.", channel: Channel.EMAIL, sentiment: Sentiment.NEGATIVE, sentimentScore: -0.5 },
  { content: "The pricing is fair for what we get. No complaints there.", channel: Channel.CALL, sentiment: Sentiment.POSITIVE, sentimentScore: 0.4 },
  { content: "Need better search functionality. Can't find old projects easily.", channel: Channel.SOCIAL, sentiment: Sentiment.NEUTRAL, sentimentScore: 0.0 },
  { content: "API documentation is outdated and missing several endpoints. Hard to build integrations.", channel: Channel.WEB, sentiment: Sentiment.NEGATIVE, sentimentScore: -0.8 },
  { content: "The new dashboard widgets are exactly what we needed. Great job!", channel: Channel.NPS, sentiment: Sentiment.POSITIVE, sentimentScore: 0.8 },
  { content: "Please add a dark mode for the mobile app too. Currently only available on web.", channel: Channel.APPSTORE, sentiment: Sentiment.NEUTRAL, sentimentScore: 0.1 },
  { content: "We've had 3 outages this month. Reliability is becoming a concern for our team.", channel: Channel.EMAIL, sentiment: Sentiment.NEGATIVE, sentimentScore: -0.9 },
  { content: "The file upload limit is too low. We need to share large design files.", channel: Channel.WEB, sentiment: Sentiment.NEUTRAL, sentimentScore: 0.2 },
  { content: "Best project management tool we've used. Switched from Asana and never looked back!", channel: Channel.SOCIAL, sentiment: Sentiment.POSITIVE, sentimentScore: 0.9 },
  { content: "The Kanban board is missing swimlanes. Hard to visualize our sprint workflow.", channel: Channel.NPS, sentiment: Sentiment.NEUTRAL, sentimentScore: 0.0 },
  { content: "Security audit passed with flying colors. Our compliance team is happy.", channel: Channel.CALL, sentiment: Sentiment.POSITIVE, sentimentScore: 0.6 },
]

export async function POST(request: Request) {
  const session = (await getServerSession(authOptions)) as Session | null
  const forbidden = requireRole(session, [Role.ADMIN, Role.ANALYST])
  if (forbidden) return forbidden

  const body = await request.json().catch(() => ({}))
  const count = Math.min(Number(body.count) || 20, 50)

  const items: { content: string; channel: Channel; sentiment: Sentiment; sentimentScore: number }[] = []
  for (let i = 0; i < count; i++) {
    const base = SIMULATED_FEEDBACK[i % SIMULATED_FEEDBACK.length]
    items.push({
      content: base.content,
      channel: base.channel,
      sentiment: base.sentiment,
      sentimentScore: base.sentimentScore + (Math.random() * 0.2 - 0.1),
    })
  }

  const created = []
  for (const item of items) {
    const feedback = await prisma.feedback.create({
      data: {
        content: item.content,
        channel: item.channel,
        sentiment: item.sentiment,
        sentimentScore: item.sentimentScore,
        workspaceId: session!.user.workspaceId,
        status: Status.NEW,
      },
    })
    created.push(feedback)
  }

  return NextResponse.json({ imported: created.length, items: created })
}
