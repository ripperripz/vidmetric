/**
 * analysis.ts — pure scoring logic, zero API calls, zero network I/O.
 * Input:  RawVideo[] + Channel (from youtube.ts)
 * Output: AnalysisResult
 */

import type {
  AnalysisResult,
  Video,
  Channel,
  WinFormula,
  FormatGraveyardItem,
  CadenceCell,
} from '@/src/types'
import type { RawVideo } from './youtube'

// ── Day + time helpers ─────────────────────────────────────────────────
const WEEK_DAYS  = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const
const TIME_SLOTS = ['Morning', 'Afternoon', 'Evening', 'Night']      as const

function getTimeSlot(hour: number): string {
  if (hour >= 6  && hour < 12) return 'Morning'
  if (hour >= 12 && hour < 17) return 'Afternoon'
  if (hour >= 17 && hour < 21) return 'Evening'
  return 'Night'
}

// ── Curiosity-gap scoring ──────────────────────────────────────────────
const CURIOSITY_PATTERNS: Array<{ re: RegExp; pts: number }> = [
  { re: /^\d+\s+(reasons?|things?|ways?|tips?|steps?|facts?|secrets?|tricks?|hacks?|mistakes?|signs?)/i, pts: 25 },
  { re: /\bwhy\b.*\?/i,                                    pts: 20 },
  { re: /\bwhat (happens?|if|would|is|are)\b/i,            pts: 18 },
  { re: /\bhow (to|i|we|did|does)\b/i,                     pts: 15 },
  { re: /\b(the )?(most|best|worst|biggest|fastest|cheapest|hardest|easiest)\b/i, pts: 15 },
  { re: /\bthe truth (about|behind|of)\b/i,                pts: 22 },
  { re: /\bi (tried|built|made|tested|spent|won|lost|quit)\b/i, pts: 18 },
  { re: /\b(explained|revealed|exposed|debunked|uncovered)\b/i, pts: 16 },
  { re: /\bnobody (told|talks|knows)\b/i,                  pts: 20 },
  { re: /\bstopped\s+(doing|using|watching|playing)\b/i,   pts: 15 },
  { re: /\.\.\./,                                           pts: 10 },
  { re: /\?$/,                                              pts:  8 },
]

function computeCuriosityGap(title: string): number {
  let score = 0
  for (const { re, pts } of CURIOSITY_PATTERNS) {
    if (re.test(title)) score += pts
  }
  return Math.min(100, score)
}

// ── Posting cadence ────────────────────────────────────────────────────
function computePostingCadence(videos: RawVideo[]): string {
  if (videos.length < 2) return 'inactive'
  const sorted = [...videos]
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, 10)
  const daysSinceLatest = (Date.now() - new Date(sorted[0].publishedAt).getTime()) / 86_400_000
  if (daysSinceLatest > 180) return 'inactive'
  const gaps: number[] = []
  for (let i = 0; i < sorted.length - 1; i++) {
    const a = new Date(sorted[i].publishedAt).getTime()
    const b = new Date(sorted[i + 1].publishedAt).getTime()
    gaps.push((a - b) / 86_400_000)
  }
  const avgDays = gaps.reduce((s, g) => s + g, 0) / gaps.length
  if (avgDays < 14) {
    const days = Math.round(avgDays)
    return days <= 1 ? 'every day' : `every ${days} days`
  }
  if (avgDays < 90) {
    const weeks = Math.round(avgDays / 7)
    return weeks <= 1 ? 'every week' : `every ${weeks} weeks`
  }
  const months = Math.round(avgDays / 30)
  return months <= 1 ? 'every month' : `every ${months} months`
}

// ── Upload frequency ───────────────────────────────────────────────────
function computeUploadFrequency(videos: RawVideo[]): number {
  if (videos.length < 2) return 0
  const sorted = [...videos].sort(
    (a, b) => new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime()
  )
  const oldest = new Date(sorted[0].publishedAt).getTime()
  const newest = new Date(sorted[sorted.length - 1].publishedAt).getTime()
  const weeks  = (newest - oldest) / (7 * 86_400_000)
  if (weeks < 0.5) return videos.length
  return Math.round((videos.length / weeks) * 10) / 10
}

// ── Win formula ────────────────────────────────────────────────────────
function computeWinFormula(videos: Video[]): WinFormula {
  const top10 = [...videos]
    .filter((v) => !v.isShort)
    .sort((a, b) => b.views - a.views)
    .slice(0, 10)

  if (!top10.length) return { postDay: 'Weekdays', duration: '10–15 min', titlePattern: 'Question in title' }

  // Best publish day (by avg views in top-10)
  const dayCounts: Record<string, { views: number; count: number }> = {}
  for (const v of top10) {
    const d = WEEK_DAYS[(new Date(v.publishedAt).getDay() + 6) % 7]
    if (!dayCounts[d]) dayCounts[d] = { views: 0, count: 0 }
    dayCounts[d].views += v.views
    dayCounts[d].count++
  }
  const bestDay = Object.entries(dayCounts).sort(
    (a, b) => b[1].views / b[1].count - a[1].views / a[1].count
  )[0]?.[0] ?? 'Tuesday'

  // IQR-based duration range
  const durs = top10.map((v) => v.duration).sort((a, b) => a - b)
  const q1 = durs[Math.floor(durs.length * 0.25)]
  const q3 = durs[Math.floor(durs.length * 0.75)]
  const durationStr = `${Math.floor(q1 / 60)}–${Math.ceil(q3 / 60)} min`

  // Most common title pattern among top-10
  const titlePatterns: Array<{ re: RegExp; label: string }> = [
    { re: /^\d+/,                      label: 'Number in title'    },
    { re: /\b(why|what|how|when)\b/i,  label: 'Question hook'      },
    { re: /\bi (tried|built|made)/i,   label: 'First-person story' },
    { re: /\bthe truth\b/i,            label: 'Truth reveal'       },
    { re: /\bexplained\b/i,            label: '"Explained" format' },
  ]
  let titlePattern = 'Descriptive title'
  for (const p of titlePatterns) {
    if (top10.filter((v) => p.re.test(v.title)).length >= 3) {
      titlePattern = p.label
      break
    }
  }

  return { postDay: bestDay, duration: durationStr, titlePattern }
}

// ── Format graveyard ───────────────────────────────────────────────────
function computeFormatGraveyard(videos: Video[]): FormatGraveyardItem[] {
  const longForm = videos.filter((v) => !v.isShort)
  if (longForm.length < 5) return []

  const avgViews = longForm.reduce((s, v) => s + v.views, 0) / longForm.length
  const now = Date.now()
  const sixMonthsAgo     = now - 180 * 86_400_000
  const eighteenMonthsAgo = now - 540 * 86_400_000

  const buckets: Array<{ pattern: string; re: RegExp }> = [
    { pattern: 'Number list',    re: /^\d+\s+\w/                           },
    { pattern: 'How-to guide',   re: /^how (to|i|we)/i                    },
    { pattern: 'Deep dive',      re: /explained|deep dive|breakdown/i     },
    { pattern: 'Challenge',      re: /challenge|i tried|i spent/i         },
    { pattern: 'Vs./Comparison', re: /\bvs\.?\b|\bversus\b|\bcompar/i     },
  ]

  const graves: FormatGraveyardItem[] = []

  for (const bucket of buckets) {
    const matched = longForm.filter((v) => bucket.re.test(v.title))
    if (matched.length < 2) continue

    const bucketAvg = matched.reduce((s, v) => s + v.views, 0) / matched.length
    if (bucketAvg < avgViews * 1.5) continue   // must outperform by 50 %+

    const mostRecent = Math.max(...matched.map((v) => new Date(v.publishedAt).getTime()))
    if (mostRecent > sixMonthsAgo)      continue  // still active
    if (mostRecent < eighteenMonthsAgo) continue  // too old to be relevant

    const monthsAgo   = Math.round((now - mostRecent) / (30 * 86_400_000))
    const multiplier  = Math.round((bucketAvg / avgViews) * 10) / 10
    const exampleVideo = matched.sort((a, b) => b.views - a.views)[0]

    graves.push({
      formatName:      bucket.pattern,
      lastUsed:        `${monthsAgo} months ago`,
      avgPerformance:  multiplier,
      exampleTitle:    exampleVideo.title,
    })
  }

  return graves.slice(0, 4)
}

// ── Cadence heatmap ────────────────────────────────────────────────────
function computeCadenceGrid(videos: Video[]): CadenceCell[] {
  const map: Record<string, { views: number; count: number }> = {}

  for (const v of videos) {
    if (v.isShort) continue
    const d    = new Date(v.publishedAt)
    const day  = WEEK_DAYS[(d.getDay() + 6) % 7]
    const time = getTimeSlot(d.getHours())
    const key  = `${day}|${time}`
    if (!map[key]) map[key] = { views: 0, count: 0 }
    map[key].views += v.views
    map[key].count++
  }

  const maxAvg = Math.max(
    1,
    ...Object.values(map).map((c) => (c.count > 0 ? c.views / c.count : 0))
  )

  const cells: CadenceCell[] = []
  for (const day of WEEK_DAYS) {
    for (const time of TIME_SLOTS) {
      const entry       = map[`${day}|${time}`]
      const performance = entry?.count ? Math.round((entry.views / entry.count / maxAvg) * 100) / 100 : 0
      cells.push({ day, time, performance })
    }
  }
  return cells
}

// ── Intelligence brief (6 bullets) ────────────────────────────────────
function generateBrief(
  videos:       Video[],
  channel:      Channel,
  winFormula:   WinFormula,
  outlierScore: number,
  graves:       FormatGraveyardItem[]
): string[] {
  const bullets: string[] = []
  const longForm  = videos.filter((v) => !v.isShort)
  const avgViews  = channel.avgViews || (longForm.reduce((s, v) => s + v.views, 0) / Math.max(1, longForm.length))
  const totalVws  = videos.reduce((s, v) => s + v.views, 0)
  const shortVids = videos.filter((v) => v.isShort)
  const shortVws  = shortVids.reduce((s, v) => s + v.views, 0)
  const shortsPct = Math.round((shortVids.length / Math.max(1, videos.length)) * 100)
  const shortsVwPct = Math.round((shortVws / Math.max(1, totalVws)) * 100)

  // 1. Overall performance
  if (outlierScore >= 7) {
    bullets.push(`↑ Channel consistently outperforms the YouTube average with an outlier score of ${outlierScore.toFixed(1)}/10 — driven primarily by ${winFormula.titlePattern.toLowerCase()} content.`)
  } else if (outlierScore >= 4) {
    bullets.push(`→ Channel performance sits at ${outlierScore.toFixed(1)}/10 with occasional breakout videos. Top performers cluster around ${winFormula.postDay} uploads.`)
  } else {
    bullets.push(`↓ Outlier score of ${outlierScore.toFixed(1)}/10 indicates below-average performance — recent uploads trail the channel's own historical average.`)
  }

  // 2. Shorts signal
  if (shortsPct > 0 && shortsVwPct < shortsPct * 0.7) {
    bullets.push(`⚠ Shorts make up ${shortsPct}% of uploads but only ${shortsVwPct}% of total views — a significant drag the algorithm may be penalising.`)
  } else if (shortsPct > 30 && shortsVwPct > shortsPct) {
    bullets.push(`↑ Shorts overperform: ${shortsPct}% of uploads drive ${shortsVwPct}% of views — highly efficient short-form strategy.`)
  } else {
    bullets.push(`→ Long-form content dominates at ${100 - shortsVwPct}% view share. ${winFormula.duration} appears to be the sweet spot for this audience.`)
  }

  // 3. Win formula
  bullets.push(`↑ Win formula confirmed: ${winFormula.postDay} uploads in the ${winFormula.duration} range using "${winFormula.titlePattern}" consistently outperform the channel average.`)

  // 4. Format graveyard or ghost audience
  if (graves.length > 0) {
    const g = graves[0]
    bullets.push(`⚠ Format Graveyard: "${g.formatName}" content averaged ${g.avgPerformance}× the channel average but was abandoned ${g.lastUsed}. Competitor opportunity.`)
  } else {
    const ghostCount = videos.filter((v) => v.ghostAudience).length
    if (ghostCount > 0) {
      bullets.push(`⚠ ${ghostCount} Ghost Audience video${ghostCount > 1 ? 's' : ''} detected — high-comment, zero-creator-reply posts where competitors could capture unmet demand.`)
    } else {
      bullets.push(`→ No abandoned winning formats in the last 12 months. Channel maintains a consistent format strategy.`)
    }
  }

  // 5. Engagement rate
  const er = channel.engagementRate
  if (er > 4) {
    bullets.push(`↑ Engagement rate of ${er.toFixed(1)}% significantly exceeds the ~2% YouTube average — highly loyal, comment-active audience worth targeting.`)
  } else if (er > 1.5) {
    bullets.push(`→ Engagement rate of ${er.toFixed(1)}% is near the YouTube average. Moderate audience loyalty with room for community growth.`)
  } else {
    bullets.push(`↓ Engagement rate of ${er.toFixed(1)}% is below the YouTube average — passive viewership that may not convert well for sponsor or affiliate campaigns.`)
  }

  // 6. Momentum
  const recent5    = [...videos].sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()).slice(0, 5)
  const recentAvg  = recent5.reduce((s, v) => s + v.views, 0) / Math.max(1, recent5.length)
  const delta      = Math.abs(Math.round((recentAvg / Math.max(1, avgViews) - 1) * 100))
  const direction  = recentAvg > avgViews ? 'accelerating' : recentAvg > avgViews * 0.7 ? 'stable' : 'declining'
  const arrow      = direction === 'accelerating' ? '↑' : direction === 'stable' ? '→' : '↓'
  bullets.push(`${arrow} Momentum is ${direction} — uploading ${channel.uploadFrequency}× per week with recent videos ${direction === 'accelerating' ? 'outpacing' : direction === 'stable' ? 'tracking near' : 'lagging'} the historical average by ${delta}%.`)

  return bullets.slice(0, 6)
}

// ── Main export ────────────────────────────────────────────────────────
export function analyze(rawVideos: RawVideo[], rawChannel: Channel): AnalysisResult {
  const start = Date.now()

  // Derived channel stats from video data
  const uploadFrequency = computeUploadFrequency(rawVideos)
  const totalViews   = rawVideos.reduce((s, v) => s + v.views,    0)
  const totalLikes   = rawVideos.reduce((s, v) => s + v.likes,    0)
  const totalComments= rawVideos.reduce((s, v) => s + v.comments, 0)
  const engagementRate = totalViews > 0
    ? Math.round(((totalLikes + totalComments) / totalViews) * 1000) / 10
    : 0
  const avgViews = rawChannel.avgViews || Math.round(totalViews / Math.max(1, rawVideos.length))

  const channel: Channel = {
    ...rawChannel,
    uploadFrequency: Math.round(uploadFrequency * 10) / 10,
    engagementRate,
    avgViews,
  }

  // Build Video[] with computed scores
  const videos: Video[] = rawVideos.map((v): Video => ({
    ...v,
    outlierScore:      Math.min(10, Math.round((v.views / Math.max(1, avgViews)) * 10) / 10),
    curiosityGapScore: computeCuriosityGap(v.title),
    ghostAudience:     v.comments > 2000 && (v.comments / Math.max(1, v.views)) > 0.003,
    formatGraveyard:   false,  // patched below
  }))

  const winFormula     = computeWinFormula(videos)
  const formatGraveyard = computeFormatGraveyard(videos)

  // Mark graveyard videos by matching example titles
  const graveTitles = new Set(formatGraveyard.map((g) => g.exampleTitle))
  const scoredVideos = videos.map((v) => ({ ...v, formatGraveyard: graveTitles.has(v.title) }))

  // Overall outlier score — average of top-10
  const top10Avg = [...scoredVideos]
    .sort((a, b) => b.outlierScore - a.outlierScore)
    .slice(0, 10)
    .reduce((s, v) => s + v.outlierScore, 0) / Math.min(10, scoredVideos.length)
  const outlierScore = Math.min(10, Math.round(top10Avg * 10) / 10)

  const cadenceGrid = computeCadenceGrid(scoredVideos)

  const shortVids       = rawVideos.filter((v) => v.isShort)
  const shortsPercentage = Math.round((shortVids.length / Math.max(1, rawVideos.length)) * 100)
  const shortsViews      = shortVids.reduce((s, v) => s + v.views, 0)
  const shortsViewShare  = totalViews > 0 ? Math.round((shortsViews / totalViews) * 100) : 0

  const intelligenceBrief = generateBrief(
    scoredVideos, channel, winFormula, outlierScore, formatGraveyard
  )

  const postingCadence = computePostingCadence(rawVideos)

  return {
    channel,
    videos: scoredVideos,
    intelligenceBrief,
    winFormula,
    formatGraveyard,
    cadenceGrid,
    outlierScore,
    shortsPercentage,
    shortsViewShare,
    postingCadence,
    generatedIn: Math.max(0.1, Math.round((Date.now() - start) / 100) / 10),
  }
}
