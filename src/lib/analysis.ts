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

// ── Helpers ──────────────────────────────────────────────────────────────
const WEEK_DAYS  = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const
const TIME_SLOTS = ['Morning', 'Afternoon', 'Evening', 'Night']      as const

function getTimeSlot(hour: number): string {
  if (hour >= 6  && hour < 12) return 'Morning'
  if (hour >= 12 && hour < 17) return 'Afternoon'
  if (hour >= 17 && hour < 21) return 'Evening'
  return 'Night'
}

function median(arr: number[]): number {
  if (!arr.length) return 0
  const s = [...arr].sort((a, b) => a - b)
  const mid = Math.floor(s.length / 2)
  return s.length % 2 ? s[mid] : (s[mid - 1] + s[mid]) / 2
}

// ── Curiosity-gap scoring ──────────────────────────────────────────────
const CURIOSITY_PATTERNS: Array<{ re: RegExp; pts: number }> = [
  // Strong curiosity triggers
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
  // Moderate engagement signals
  { re: /\bvs\.?\b|\bversus\b/i,                           pts: 12 },
  { re: /\breview\b/i,                                      pts: 10 },
  { re: /\b(insane|crazy|unbelievable|incredible|shocking|amazing|ultimate|impossible)\b/i, pts: 14 },
  { re: /\b(never|always|every|no one|everyone)\b/i,       pts: 10 },
  { re: /\b(secret|hidden|unknown|banned|illegal)\b/i,     pts: 16 },
  { re: /\b(finally|actually|literally)\b/i,               pts:  8 },
  // Structural hooks
  { re: /^\d+/,                                             pts: 10 },  // starts with number
  { re: /[A-Z]{3,}/,                                        pts:  6 },  // ALL CAPS words
  { re: /!$/,                                                pts:  5 },  // ends with exclamation
  { re: /\|/,                                                pts:  4 },  // pipe separator (common in YT titles)
  { re: /\bpart\s+\d+\b/i,                                  pts:  6 },  // series content
  { re: /\bft\.?\b|\bfeat\.?\b|\bwith\b/i,                  pts:  8 },  // collaboration signal
]

function computeCuriosityGap(title: string): number {
  let score = 0
  for (const { re, pts } of CURIOSITY_PATTERNS) {
    if (re.test(title)) score += pts
  }
  return Math.min(100, score)
}

// ── Posting cadence (uses median gap, robust to breaks) ─────────────────
function computePostingCadence(videos: RawVideo[]): string {
  if (videos.length < 2) return 'inactive'

  const sorted = [...videos]
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())

  const daysSinceLatest = (Date.now() - new Date(sorted[0].publishedAt).getTime()) / 86_400_000
  if (daysSinceLatest > 180) return 'inactive'

  // Use all available videos for more accurate cadence (not just 10)
  const gaps: number[] = []
  for (let i = 0; i < sorted.length - 1; i++) {
    const a = new Date(sorted[i].publishedAt).getTime()
    const b = new Date(sorted[i + 1].publishedAt).getTime()
    const gapDays = (a - b) / 86_400_000
    // Cap individual gaps at 60 days to avoid vacation/break skew
    if (gapDays <= 60) gaps.push(gapDays)
  }

  if (!gaps.length) return 'inactive'

  // Use median instead of mean — robust to outlier gaps
  const medianDays = median(gaps)

  if (medianDays < 1.5) return 'every day'
  if (medianDays < 14) {
    const days = Math.round(medianDays)
    return `every ${days} days`
  }
  if (medianDays < 90) {
    const weeks = Math.round(medianDays / 7)
    return weeks <= 1 ? 'every week' : `every ${weeks} weeks`
  }
  const months = Math.round(medianDays / 30)
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
    const d = WEEK_DAYS[(new Date(v.publishedAt).getUTCDay() + 6) % 7]
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
    { re: /\breview\b/i,               label: 'Review format'      },
    { re: /\bvs\.?\b|\bversus\b/i,     label: 'Comparison format'  },
  ]
  let titlePattern = 'Descriptive title'
  // Lower threshold from 3 to 2 so patterns are detected more often
  for (const p of titlePatterns) {
    if (top10.filter((v) => p.re.test(v.title)).length >= 2) {
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

  const avgViews = median(longForm.map((v) => v.views))
  const now = Date.now()

  // Determine the actual time range of our sample
  const dates = longForm.map((v) => new Date(v.publishedAt).getTime())
  const oldestDate = Math.min(...dates)
  const sampleSpanDays = (now - oldestDate) / 86_400_000

  // Adaptive thresholds: use 40% and 90% of sample span
  // This way for a 4-month sample, "abandoned" means not used in the last ~48 days
  // For a 12-month sample, it means not used in the last ~144 days
  const recentCutoff = now - sampleSpanDays * 0.4 * 86_400_000
  const oldCutoff    = now - sampleSpanDays * 0.9 * 86_400_000

  const buckets: Array<{ pattern: string; re: RegExp }> = [
    { pattern: 'Number list',    re: /^\d+\s+\w/                           },
    { pattern: 'How-to guide',   re: /^how (to|i|we)/i                    },
    { pattern: 'Deep dive',      re: /explained|deep dive|breakdown/i     },
    { pattern: 'Challenge',      re: /challenge|i tried|i spent/i         },
    { pattern: 'Vs./Comparison', re: /\bvs\.?\b|\bversus\b|\bcompar/i     },
    { pattern: 'Review',         re: /\breview\b/i                         },
    { pattern: 'Reaction',       re: /\breact(ion|ing)?\b/i               },
    { pattern: 'Tutorial',       re: /\btutorial\b|\bhow to\b/i           },
  ]

  const graves: FormatGraveyardItem[] = []

  for (const bucket of buckets) {
    const matched = longForm.filter((v) => bucket.re.test(v.title))
    if (matched.length < 2) continue

    const bucketMedian = median(matched.map((v) => v.views))
    if (bucketMedian < avgViews * 1.3) continue   // must outperform by 30%+

    const mostRecent = Math.max(...matched.map((v) => new Date(v.publishedAt).getTime()))
    if (mostRecent > recentCutoff) continue  // still active
    if (mostRecent < oldCutoff)    continue  // too old to be relevant in sample

    const daysSince   = (now - mostRecent) / 86_400_000
    const monthsAgo   = Math.round(daysSince / 30)
    const weeksAgo    = Math.round(daysSince / 7)
    const lastUsed    = monthsAgo >= 2 ? `${monthsAgo} months ago` : `${weeksAgo} weeks ago`
    const multiplier  = Math.round((bucketMedian / Math.max(1, avgViews)) * 10) / 10
    const exampleVideo = matched.sort((a, b) => b.views - a.views)[0]

    graves.push({
      formatName:      bucket.pattern,
      lastUsed,
      avgPerformance:  multiplier,
      exampleTitle:    exampleVideo.title,
    })
  }

  return graves.sort((a, b) => b.avgPerformance - a.avgPerformance).slice(0, 4)
}

// ── Cadence heatmap (uses UTC hours for consistency) ────────────────────
function computeCadenceGrid(videos: Video[]): CadenceCell[] {
  const map: Record<string, { views: number; count: number }> = {}

  for (const v of videos) {
    if (v.isShort) continue
    const d    = new Date(v.publishedAt)
    // Use UTC so results are consistent regardless of server timezone
    const day  = WEEK_DAYS[(d.getUTCDay() + 6) % 7]
    const time = getTimeSlot(d.getUTCHours())
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
  graves:       FormatGraveyardItem[],
  postingCadence: string
): string[] {
  const bullets: string[] = []
  const longForm  = videos.filter((v) => !v.isShort)
  const avgViews  = channel.avgViews
  const totalVws  = videos.reduce((s, v) => s + v.views, 0)
  const shortVids = videos.filter((v) => v.isShort)
  const shortVws  = shortVids.reduce((s, v) => s + v.views, 0)
  const shortsPct = Math.round((shortVids.length / Math.max(1, videos.length)) * 100)
  const shortsVwPct = Math.round((shortVws / Math.max(1, totalVws)) * 100)

  // 1. Overall performance (5.0 = median, 7+ = strong, <4 = weak)
  if (outlierScore >= 7) {
    bullets.push(`↑ Channel consistently outperforms with an outlier score of ${outlierScore.toFixed(1)}/10 — driven primarily by ${winFormula.titlePattern.toLowerCase()} content.`)
  } else if (outlierScore >= 5.5) {
    bullets.push(`↑ Channel performs above average at ${outlierScore.toFixed(1)}/10 with strong breakout videos. Top performers cluster around ${winFormula.postDay} uploads.`)
  } else if (outlierScore >= 4) {
    bullets.push(`→ Channel performance sits at ${outlierScore.toFixed(1)}/10 — near-average with occasional breakout videos.`)
  } else {
    bullets.push(`↓ Outlier score of ${outlierScore.toFixed(1)}/10 indicates below-average performance — recent uploads trail the channel's own historical average.`)
  }

  // 2. Shorts signal
  if (shortsPct > 0 && shortsVwPct < shortsPct * 0.7) {
    bullets.push(`⚠ Shorts make up ${shortsPct}% of uploads but only ${shortsVwPct}% of total views — a significant drag the algorithm may be penalising.`)
  } else if (shortsPct > 30 && shortsVwPct > shortsPct) {
    bullets.push(`↑ Shorts overperform: ${shortsPct}% of uploads drive ${shortsVwPct}% of views — highly efficient short-form strategy.`)
  } else if (shortsPct === 0) {
    bullets.push(`→ Pure long-form strategy. ${winFormula.duration} appears to be the sweet spot for this audience.`)
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
      bullets.push(`→ No abandoned winning formats detected. Channel maintains a consistent format strategy.`)
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

  // 6. Momentum — compare recent 5 vs full sample
  const recent5    = [...longForm].sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()).slice(0, 5)
  const recentAvg  = recent5.reduce((s, v) => s + v.views, 0) / Math.max(1, recent5.length)
  const longFormAvg = longForm.reduce((s, v) => s + v.views, 0) / Math.max(1, longForm.length)
  const delta      = Math.abs(Math.round((recentAvg / Math.max(1, longFormAvg) - 1) * 100))
  const direction  = recentAvg > longFormAvg * 1.1 ? 'accelerating' : recentAvg > longFormAvg * 0.7 ? 'stable' : 'declining'
  const arrow      = direction === 'accelerating' ? '↑' : direction === 'stable' ? '→' : '↓'
  bullets.push(`${arrow} Momentum is ${direction} — posting ${postingCadence} with recent videos ${direction === 'accelerating' ? 'outpacing' : direction === 'stable' ? 'tracking near' : 'lagging'} the sample average by ${delta}%.`)

  return bullets.slice(0, 6)
}

// ── Main export ────────────────────────────────────────────────────────
export function analyze(rawVideos: RawVideo[], rawChannel: Channel): AnalysisResult {
  const start = Date.now()

  // Derived channel stats from video data — ALWAYS use sample, not lifetime
  const uploadFrequency = computeUploadFrequency(rawVideos)
  const totalViews   = rawVideos.reduce((s, v) => s + v.views,    0)
  const totalLikes   = rawVideos.reduce((s, v) => s + v.likes,    0)
  const totalComments= rawVideos.reduce((s, v) => s + v.comments, 0)
  const engagementRate = totalViews > 0
    ? Math.round(((totalLikes + totalComments) / totalViews) * 1000) / 10
    : 0

  // Use median of sample views as the baseline — robust to viral outliers
  // Mean is inflated by 1-2 massive hits; median represents "typical" performance
  const sampleMedianViews = median(rawVideos.map((v) => v.views))
  const sampleMeanViews   = Math.round(totalViews / Math.max(1, rawVideos.length))
  // Display avg uses mean (more intuitive for users), scoring uses median (more robust)
  const displayAvgViews   = sampleMeanViews

  const channel: Channel = {
    ...rawChannel,
    uploadFrequency: Math.round(uploadFrequency * 10) / 10,
    engagementRate,
    avgViews: displayAvgViews,
  }

  // Separate baselines for Shorts vs Long-form so Shorts don't skew long-form scores
  const longFormVideos = rawVideos.filter((v) => !v.isShort)
  const shortsVideos   = rawVideos.filter((v) => v.isShort)
  const longFormBaseline = Math.max(1, median(longFormVideos.map((v) => v.views)))
  const shortsBaseline   = Math.max(1, median(shortsVideos.map((v) => v.views)))
  // Fallback: if no videos of one type, use overall median
  const overallBaseline  = Math.max(1, sampleMedianViews)

  function computeOutlierScore(views: number, isShort: boolean): number {
    const baseline = isShort
      ? (shortsVideos.length >= 3 ? shortsBaseline : overallBaseline)
      : (longFormVideos.length >= 3 ? longFormBaseline : overallBaseline)
    const ratio = views / baseline
    // Log-scale: 5 + log2(ratio) * 1.5 → ratio=1 maps to 5.0, ratio=2 → 6.5, ratio=0.5 → 3.5
    const rawScore = ratio > 0 ? 5 + Math.log2(ratio) * 1.5 : 0
    return Math.min(10, Math.max(0, Math.round(rawScore * 10) / 10))
  }

  const videos: Video[] = rawVideos.map((v): Video => ({
    ...v,
    outlierScore:      computeOutlierScore(v.views, v.isShort),
    curiosityGapScore: computeCuriosityGap(v.title),
    // Ghost audience: scale threshold to channel size — top 20% comment ratio
    ghostAudience:     v.comments > 50 && v.views > 0 && (v.comments / v.views) > 0.005,
    formatGraveyard:   false,  // patched below
  }))

  const winFormula     = computeWinFormula(videos)
  const formatGraveyard = computeFormatGraveyard(videos)

  // Mark graveyard videos by matching example titles
  const graveTitles = new Set(formatGraveyard.map((g) => g.exampleTitle))
  const scoredVideos = videos.map((v) => ({ ...v, formatGraveyard: graveTitles.has(v.title) }))

  // Overall outlier score — weighted: 60% median of all scores + 40% median of top-10
  // This balances consistency (how most videos perform) with peak performance
  const allScores = scoredVideos.map((v) => v.outlierScore)
  const top10Scores = [...scoredVideos]
    .sort((a, b) => b.outlierScore - a.outlierScore)
    .slice(0, 10)
    .map((v) => v.outlierScore)
  const overallMedian = median(allScores)
  const topMedian = median(top10Scores)
  const outlierScore = Math.min(10, Math.round((overallMedian * 0.6 + topMedian * 0.4) * 10) / 10)

  const cadenceGrid = computeCadenceGrid(scoredVideos)

  const shortVids       = rawVideos.filter((v) => v.isShort)
  const shortsPercentage = Math.round((shortVids.length / Math.max(1, rawVideos.length)) * 100)
  const shortsViews      = shortVids.reduce((s, v) => s + v.views, 0)
  const shortsViewShare  = totalViews > 0 ? Math.round((shortsViews / totalViews) * 100) : 0

  const postingCadence = computePostingCadence(rawVideos)

  const intelligenceBrief = generateBrief(
    scoredVideos, channel, winFormula, outlierScore, formatGraveyard, postingCadence
  )

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
