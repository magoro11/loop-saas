import { PrismaClient, Role, Channel, Sentiment, Status } from "@prisma/client"
import bcrypt from "bcrypt"

const prisma = new PrismaClient()

const DAY_MS = 24 * 60 * 60 * 1000

// Deterministic PRNG (mulberry32) seeded by an integer
function makeRng(seed: number) {
  let a = seed >>> 0
  return function () {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

// Hash a string into a 32-bit integer so embeddings are reproducible per feedback id
function hashString(str: string): number {
  let h = 2166136261
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

const CHANNELS = [Channel.EMAIL, Channel.WEB, Channel.APPSTORE, Channel.NPS, Channel.SOCIAL, Channel.CALL] as const
const STATUSES = [Status.NEW, Status.REVIEWED, Status.ACTIONED] as const
const SENTIMENTS = [Sentiment.POSITIVE, Sentiment.NEUTRAL, Sentiment.NEGATIVE] as const

const THEME_DEFINITIONS = [
  { name: "Onboarding & Setup", color: "#6366f1", description: "First-run experience, account setup, and getting started" },
  { name: "Integrations & API", color: "#0ea5e9", description: "Third-party integrations, webhooks, and API access" },
  { name: "Performance & Speed", color: "#f59e0b", description: "Load times, latency, and responsiveness" },
  { name: "UI/UX Design", color: "#ec4899", description: "Visual design, layout, and usability" },
  { name: "Mobile Experience", color: "#10b981", description: "Mobile app and responsive behavior" },
  { name: "Pricing & Plans", color: "#8b5cf6", description: "Plans, billing, and value perception" },
  { name: "Collaboration Features", color: "#14b8a6", description: "Sharing, comments, and team workflows" },
  { name: "Notifications & Alerts", color: "#ef4444", description: "Email, push, and in-app notifications" },
  { name: "Data Export/Import", color: "#f97316", description: "Importing and exporting data, CSV, backups" },
  { name: "Security & Privacy", color: "#64748b", description: "Permissions, data protection, and compliance" },
]

// Feedback templates grouped by the theme they primarily relate to.
// Each entry: [themeIndex, channelBias?, content]
const FEEDBACK_TEMPLATES: { theme: number; content: string }[] = [
  // Onboarding & Setup (0)
  { theme: 0, content: "I signed up but got completely lost on the welcome screen. There was no clear guide on how to create my first project." },
  { theme: 0, content: "The onboarding flow assumes I already know your terminology. Took me 20 minutes just to figure out what a 'workspace' is." },
  { theme: 0, content: "Why do I need to invite teammates before I can even explore the dashboard? The setup wizard is too pushy." },
  { theme: 0, content: "First-time setup was smooth but I couldn't find where to import my existing tasks from Trello." },
  { theme: 0, content: "The getting started checklist disappeared after one step and I never saw it again. Confusing onboarding." },
  { theme: 0, content: "Loved the demo video but the actual product onboarding didn't match what was promised. Felt disjointed." },
  // Integrations & API (1)
  { theme: 1, content: "Please add a Slack integration so our team can get updates without logging in. This is a dealbreaker for us." },
  { theme: 1, content: "The API rate limits are way too low for our automation. We hit the cap in minutes." },
  { theme: 1, content: "Webhooks are unreliable — half of ours never fire. Need better delivery guarantees." },
  { theme: 1, content: "Missing a native GitHub integration. We're using Zapier as a workaround but it's slow." },
  { theme: 1, content: "I'd love a Google Calendar two-way sync. Right now I'm manually copying events over." },
  { theme: 1, content: "The REST API docs are incomplete. Couldn't find how to filter by custom fields." },
  // Performance & Speed (2)
  { theme: 2, content: "The dashboard takes 8+ seconds to load when I have a large project open. Unusable at scale." },
  { theme: 2, content: "Search is painfully slow. Typing a query and waiting for results kills my flow." },
  { theme: 2, content: "App freezes for a couple seconds every time I drag a card between columns. Please optimize." },
  { theme: 2, content: "Performance degrades badly once we cross 500 tasks. The board becomes a slideshow." },
  { theme: 2, content: "Page transitions feel laggy on my older laptop. Needs better performance budgeting." },
  { theme: 2, content: "Exporting a big report times out at 30 seconds. The server should handle larger jobs async." },
  // UI/UX Design (3)
  { theme: 3, content: "The color contrast on the sidebar is too low. I can barely read the labels in dark mode." },
  { theme: 3, content: "Too many buttons on the screen. The interface feels cluttered and overwhelming for new users." },
  { theme: 3, content: "I wish the task detail panel were a drawer instead of a full page. Too many clicks to close." },
  { theme: 3, content: "Keyboard shortcuts are not documented anywhere. Power users need a cheat sheet." },
  { theme: 3, content: "The mobile layout doesn't collapse the navigation properly. Lots of wasted space." },
  { theme: 3, content: "Drag and drop on the calendar is unintuitive. I keep dropping events in the wrong slot." },
  // Mobile Experience (4)
  { theme: 4, content: "The iOS app crashes whenever I try to attach a photo to a comment. Please fix." },
  { theme: 4, content: "Android app drains my battery in an hour. Something is polling in the background constantly." },
  { theme: 4, content: "Offline mode on mobile doesn't sync when I reconnect. I lost edits twice this week." },
  { theme: 4, content: "The mobile app is missing the timeline view that's on desktop. We need parity." },
  { theme: 4, content: "Push notifications on the app are delayed by 10+ minutes. Notifications feel broken on mobile." },
  { theme: 4, content: "Typography on mobile is too small. I have to zoom in to read task descriptions." },
  // Pricing & Plans (5)
  { theme: 5, content: "The jump from Starter to Pro is $30/user — too expensive for a small team of 8." },
  { theme: 5, content: "Why is two-factor auth locked behind the Enterprise plan? Security shouldn't be a premium feature." },
  { theme: 5, content: "Annual billing should come with a discount. Competitors give 20% off for yearly." },
  { theme: 5, content: "I hit the 10-project limit on Starter and had to upgrade unexpectedly. Pricing tiers are confusing." },
  { theme: 5, content: "Guest seats shouldn't count toward our paid user count. That pricing model is unfair." },
  { theme: 5, content: "Love the product but the per-seat pricing makes it hard to justify to finance." },
  // Collaboration Features (6)
  { theme: 6, content: "Real-time cursors would be amazing. My team and I keep editing the same task simultaneously." },
  { theme: 6, content: "Comments don't support @mentions with notifications. Collaboration feels half-baked." },
  { theme: 6, content: "We need shared templates so every project starts with the same structure. Big ask from our PMO." },
  { theme: 6, content: "Guest access is too restrictive. Clients should be able to comment without a full seat." },
  { theme: 6, content: "Activity log is hard to scan. I want a per-user filter to see what my reports did." },
  { theme: 6, content: "Please add threaded replies to comments. Long discussions get messy fast." },
  // Notifications & Alerts (7)
  { theme: 7, content: "I get 40 emails a day from the app. Need a digest option instead of instant alerts." },
  { theme: 7, content: "I turned off notifications but still got pinged about mentions. Settings don't stick." },
  { theme: 7, content: "No desktop notification when a task is assigned to me. I only find out by accident." },
  { theme: 7, content: "Notification preferences are buried three menus deep. Make them easier to reach." },
  { theme: 7, content: "I want to mute a specific project's alerts during focus time. Per-project muting please." },
  { theme: 7, content: "The 'daily summary' email arrives at 3am my time. Let me pick the delivery hour." },
  // Data Export/Import (8)
  { theme: 8, content: "CSV export drops custom field values. I can't migrate my data out cleanly." },
  { theme: 8, content: "Importing from Asana failed silently — half my tasks vanished. Need better error reporting." },
  { theme: 8, content: "Please add scheduled exports to S3 or Google Drive for our backups." },
  { theme: 8, content: "Bulk import should support updating existing tasks by ID, not just creating new ones." },
  { theme: 8, content: "Excel export formats dates wrong (US vs EU). Localization is broken on export." },
  { theme: 8, content: "I need a JSON API export for our data warehouse. CSV alone isn't enough." },
  // Security & Privacy (9)
  { theme: 9, content: "Please support SSO/SAML. We can't roll this out company-wide without it." },
  { theme: 9, content: "Audit logs should be exportable for our compliance team. Right now they're view-only." },
  { theme: 9, content: "I'm uncomfortable that support can see my workspace content. Need clearer data access policies." },
  { theme: 9, content: "Add role-based permissions per project, not just workspace-wide admin/viewer." },
  { theme: 9, content: "Where is your data hosted? We have GDPR residency requirements for EU customers." },
  { theme: 9, content: "Please let us enforce session timeouts and IP allowlists for enterprise security." },
  // A few positive / neutral cross-cutting items
  { theme: 3, content: "Overall the redesign is a big improvement. The new board view is genuinely pleasant to use." },
  { theme: 6, content: "Sharing a read-only link with my client worked perfectly. Small thing but much appreciated." },
  { theme: 2, content: "Speed has noticeably improved since the last update. Whatever you changed, keep doing it." },
  { theme: 1, content: "The Zapier integration saved us hours each week. Solid work on the API." },
  { theme: 5, content: "Pricing is fair for what we get. We happily upgraded to Pro after a month." },
]

const CUSTOMER_LABELS = [
  "Enterprise", "SMB", "Startup", "Agency", "Freelancer", "Education",
  "Healthcare", "Finance", "E-commerce", "Nonprofit", "Government", "Consulting",
]

function pick<T>(rng: () => number, arr: readonly T[]): T {
  return arr[Math.floor(rng() * arr.length)]
}

function buildEmbedding(feedbackId: string): number[] {
  const rng = makeRng(hashString(feedbackId))
  const vec: number[] = []
  for (let i = 0; i < 1536; i++) {
    vec.push(Number((rng() * 2 - 1).toFixed(5)))
  }
  return vec
}

async function main() {
  console.log("Resetting existing data...")
  // Delete in dependency order
  await prisma.embedding.deleteMany()
  await prisma.feedbackTheme.deleteMany()
  await prisma.report.deleteMany()
  await prisma.feedback.deleteMany()
  await prisma.theme.deleteMany()
  await prisma.user.deleteMany()
  await prisma.workspace.deleteMany()

  const passwordHash = await bcrypt.hash("Admin123!", 10)

  console.log("Creating workspace...")
  const workspace = await prisma.workspace.create({
    data: {
      name: "Acme Corp",
      users: {
        create: [
          { email: "admin@demo.com", name: "Admin User", passwordHash, role: Role.ADMIN },
          { email: "analyst@demo.com", name: "Analyst User", passwordHash, role: Role.ANALYST },
          { email: "viewer@demo.com", name: "Viewer User", passwordHash, role: Role.VIEWER },
        ],
      },
    },
    include: { users: true },
  })

  const users = workspace.users
  const analyst = users.find((u) => u.role === Role.ANALYST)!

  console.log("Creating themes...")
  const themes = []
  for (const t of THEME_DEFINITIONS) {
    const theme = await prisma.theme.create({
      data: {
        name: t.name,
        description: t.description,
        color: t.color,
        workspaceId: workspace.id,
      },
    })
    themes.push(theme)
  }

  const now = Date.now()
  const FEEDBACK_COUNT = 130

  console.log(`Creating ${FEEDBACK_COUNT} feedback items...`)
  const feedbacks = []
  for (let i = 0; i < FEEDBACK_COUNT; i++) {
    const rng = makeRng(1000 + i)
    const template = FEEDBACK_TEMPLATES[i % FEEDBACK_TEMPLATES.length]
    const channel = pick(rng, CHANNELS)

    // Spread across last 90 days, weighted slightly toward recent
    const daysAgo = Math.floor(Math.pow(rng(), 1.3) * 90)
    const createdAt = new Date(now - daysAgo * DAY_MS - Math.floor(rng() * DAY_MS))

    // Sentiment: ~40% get a sentiment. Of those: ~15% POS, ~15% NEG, ~10% NEU
    let sentiment: Sentiment | null = null
    let sentimentScore: number | null = null
    const sRoll = rng()
    if (sRoll < 0.15) {
      sentiment = Sentiment.POSITIVE
      sentimentScore = Number((0.2 + rng() * 0.8).toFixed(3))
    } else if (sRoll < 0.30) {
      sentiment = Sentiment.NEGATIVE
      sentimentScore = Number((-0.2 - rng() * 0.8).toFixed(3))
    } else if (sRoll < 0.40) {
      sentiment = Sentiment.NEUTRAL
      sentimentScore = Number((rng() * 0.4 - 0.2).toFixed(3))
    }

    // Status: ~50% NEW, ~30% REVIEWED, ~20% ACTIONED
    const stRoll = rng()
    const status = stRoll < 0.5 ? Status.NEW : stRoll < 0.8 ? Status.REVIEWED : Status.ACTIONED

    const sourceRef = `${channel}-${String(100000 + i)}`

    const fb = await prisma.feedback.create({
      data: {
        content: template.content,
        channel,
        sourceRef,
        customerLabel: pick(rng, CUSTOMER_LABELS),
        sentiment,
        sentimentScore,
        status,
        createdAt,
        workspaceId: workspace.id,
      },
    })
    feedbacks.push(fb)

    // Assign primary theme + sometimes a secondary theme
    const primaryTheme = themes[template.theme]
    await prisma.feedbackTheme.create({
      data: {
        feedbackId: fb.id,
        themeId: primaryTheme.id,
        confidence: Number((0.8 + rng() * 0.2).toFixed(3)),
      },
    })

    // ~35% chance of a secondary related theme
    if (rng() < 0.35) {
      let secondaryIdx = Math.floor(rng() * themes.length)
      if (secondaryIdx === template.theme) {
        secondaryIdx = (secondaryIdx + 1) % themes.length
      }
      await prisma.feedbackTheme.create({
        data: {
          feedbackId: fb.id,
          themeId: themes[secondaryIdx].id,
          confidence: Number((0.6 + rng() * 0.3).toFixed(3)),
        },
      })
    }

    // Embedding for every feedback item
    await prisma.embedding.create({
      data: {
        feedbackId: fb.id,
        vector: buildEmbedding(fb.id),
        workspaceId: workspace.id,
      },
    })
  }

  console.log("Creating reports...")
  const reportPeriods = [
    { title: "Q1 Feedback Insights Report", startOffset: 90, endOffset: 60 },
    { title: "Mid-Quarter Sentiment Review", startOffset: 60, endOffset: 30 },
    { title: "Recent Themes & Trends", startOffset: 30, endOffset: 7 },
    { title: "Weekly Pulse — Last 7 Days", startOffset: 7, endOffset: 0 },
  ]

  for (let r = 0; r < reportPeriods.length; r++) {
    const period = reportPeriods[r]
    const periodStart = new Date(now - period.startOffset * DAY_MS)
    const periodEnd = new Date(now - period.endOffset * DAY_MS)

    // Compute some real stats for the period from the feedback we created
    const inPeriod = feedbacks.filter(
      (f) => f.createdAt >= periodStart && f.createdAt <= periodEnd
    )
    const total = inPeriod.length
    const byChannel: Record<string, number> = {}
    const byStatus: Record<string, number> = {}
    const bySentiment: Record<string, number> = {}
    for (const f of inPeriod) {
      byChannel[f.channel] = (byChannel[f.channel] || 0) + 1
      byStatus[f.status] = (byStatus[f.status] || 0) + 1
      if (f.sentiment) bySentiment[f.sentiment] = (bySentiment[f.sentiment] || 0) + 1
    }
    const topThemes = themes.slice(0, 5).map((t, idx) => ({
      theme: t.name,
      mentions: Math.max(0, total - idx * Math.max(1, Math.floor(total / 8))),
      trend: idx % 2 === 0 ? "up" : "down",
    }))

    const contentJson = JSON.stringify(
      {
        summary: `Analyzed ${total} feedback items collected between ${periodStart.toISOString().slice(0, 10)} and ${periodEnd.toISOString().slice(0, 10)}.`,
        generatedAt: new Date(now - r * DAY_MS).toISOString(),
        totals: { collected: total },
        byChannel,
        byStatus,
        bySentiment,
        topThemes,
        highlights: [
          "Performance & Speed remains the most cited pain point among enterprise customers.",
          "Mobile app crash reports spiked following the latest iOS release.",
          "Positive sentiment is growing around the redesigned board view.",
        ],
        recommendations: [
          "Prioritize API rate limit increases for automation-heavy teams.",
          "Ship per-project notification muting to reduce email fatigue.",
          "Add SSO/SAML to unblock enterprise security reviews.",
        ],
      },
      null,
      2
    )

    await prisma.report.create({
      data: {
        title: period.title,
        periodStart,
        periodEnd,
        contentJson,
        workspaceId: workspace.id,
        generatedById: analyst.id,
      },
    })
  }

  console.log("Seed complete.")
  console.log(`  Workspace: ${workspace.name} (${workspace.id})`)
  console.log(`  Users: ${users.length}`)
  console.log(`  Themes: ${themes.length}`)
  console.log(`  Feedback: ${feedbacks.length}`)
  console.log(`  Embeddings: ${feedbacks.length}`)
  console.log(`  Reports: ${reportPeriods.length}`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
