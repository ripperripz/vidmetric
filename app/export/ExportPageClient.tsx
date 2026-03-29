'use client'

import { useState, useRef, useCallback } from 'react'
import type { AnalysisResult } from '@/src/types'
import { formatViews, formatDuration } from '@/src/lib/utils'
import { AppSidebar } from '@/src/components/AppSidebar'

export interface ExportPageClientProps {
  result: AnalysisResult
  sourceUrl: string
  errorBanner?: string
}

type FormatType = 'pdf' | 'csv' | 'json'

const PDF_ICON = (
  <svg width="16" height="16" viewBox="0 0 18 18" fill="none" aria-hidden="true">
    <rect x="2" y="1" width="11" height="15" rx="2" stroke="currentColor" strokeWidth="1.2" />
    <path d="M13 1L16 4.5V16H13" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
    <path d="M5 7H10M5 9.5H10M5 12H8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
  </svg>
)

const CSV_ICON = (
  <svg width="16" height="16" viewBox="0 0 18 18" fill="none" aria-hidden="true">
    <rect x="1.5" y="3" width="15" height="12" rx="2" stroke="currentColor" strokeWidth="1.2" />
    <path d="M1.5 7H16.5M6 3V15" stroke="currentColor" strokeWidth="1.2" />
  </svg>
)

const JSON_ICON = (
  <svg width="16" height="16" viewBox="0 0 18 18" fill="none" aria-hidden="true">
    <path d="M7 3C5.5 3 4.5 3.9 4.5 5V13C4.5 14.1 5.5 15 7 15" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    <path d="M11 3C12.5 3 13.5 3.9 13.5 5V13C13.5 14.1 12.5 15 11 15" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    <circle cx="9" cy="9" r="1" fill="currentColor" />
  </svg>
)

const DEFAULT_SECTIONS: Record<string, boolean> = {
  'Intelligence Brief': true,
  'Win Formula': true,
  'Top Outlier Videos': true,
  'Format Graveyard': true,
  'Shorts Analysis': true,
  'Cadence Heatmap': true,
  'Full Video Data': false,
}

function Toggle({ enabled, onToggle }: { enabled: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      style={{
        width: '36px',
        height: '20px',
        borderRadius: '999px',
        border: 'none',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        flexShrink: 0,
        padding: '0',
        background: enabled ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.1)',
        transition: 'background 200ms',
      }}
      aria-checked={enabled}
      role="switch"
    >
      <div
        style={{
          width: '14px',
          height: '14px',
          borderRadius: '999px',
          background: '#fff',
          transition: 'transform 200ms',
          transform: enabled ? 'translateX(18px)' : 'translateX(3px)',
          flexShrink: 0,
        }}
      />
    </button>
  )
}

function FormatButton({
  label,
  icon,
  active = false,
  badge,
  onClick,
}: {
  label: string
  icon: React.ReactNode
  active?: boolean
  badge?: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '12px 14px',
        borderRadius: '10px',
        border: active ? '1px solid rgba(255,255,255,0.2)' : '1px solid rgba(255,255,255,0.07)',
        background: active ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.02)',
        cursor: 'pointer',
        textAlign: 'left',
        transition: 'all 150ms',
        color: active ? '#fff' : 'rgba(255,255,255,0.45)',
      }}
      onMouseEnter={(e) => {
        if (!active) {
          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.14)'
          e.currentTarget.style.color = 'rgba(255,255,255,0.7)'
        }
      }}
      onMouseLeave={(e) => {
        if (!active) {
          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'
          e.currentTarget.style.color = 'rgba(255,255,255,0.45)'
        }
      }}
    >
      <span style={{ flexShrink: 0, opacity: active ? 1 : 0.6 }}>{icon}</span>
      <span style={{ fontSize: '13px', fontWeight: 500, flex: 1 }}>{label}</span>
      {badge && (
        <span style={{ fontSize: '9px', fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.4)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '999px', padding: '2px 7px' }}>
          {badge}
        </span>
      )}
      {active && (
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <circle cx="8" cy="8" r="7" stroke="rgba(255,255,255,0.3)" />
          <path d="M5 8L7 10L11 6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </button>
  )
}

// ── Derived analytics for the report ──────────────────────────────────
function computeReportData(result: AnalysisResult) {
  const { videos } = result
  const longForm = videos.filter((v) => !v.isShort)
  const shorts = videos.filter((v) => v.isShort)

  const totalViews = videos.reduce((s, v) => s + v.views, 0)
  const totalLikes = videos.reduce((s, v) => s + v.likes, 0)
  const totalComments = videos.reduce((s, v) => s + v.comments, 0)

  const sorted = [...videos].sort((a, b) => b.views - a.views)
  const top10 = sorted.slice(0, 10)
  const bottom10 = sorted.slice(-10).reverse()

  const sortedByOutlier = [...videos].sort((a, b) => b.outlierScore - a.outlierScore)
  const top10Outliers = sortedByOutlier.slice(0, 10)

  // Comment goldmine: highest comment-to-view ratio
  const commentGoldmine = [...videos]
    .filter((v) => v.views > 0 && v.comments > 10)
    .sort((a, b) => (b.comments / b.views) - (a.comments / a.views))
    .slice(0, 5)

  // Ghost audience videos
  const ghostVideos = videos.filter((v) => v.ghostAudience)

  // Shorts vs long-form comparison
  const longFormAvgViews = longForm.length > 0
    ? Math.round(longForm.reduce((s, v) => s + v.views, 0) / longForm.length) : 0
  const shortsAvgViews = shorts.length > 0
    ? Math.round(shorts.reduce((s, v) => s + v.views, 0) / shorts.length) : 0
  const longFormAvgLikes = longForm.length > 0
    ? Math.round(longForm.reduce((s, v) => s + v.likes, 0) / longForm.length) : 0
  const shortsAvgLikes = shorts.length > 0
    ? Math.round(shorts.reduce((s, v) => s + v.likes, 0) / shorts.length) : 0

  // Engagement by day of week
  const dayStats: Record<string, { views: number; count: number }> = {}
  for (const v of longForm) {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    const day = days[new Date(v.publishedAt).getUTCDay()]
    if (!dayStats[day]) dayStats[day] = { views: 0, count: 0 }
    dayStats[day].views += v.views
    dayStats[day].count++
  }

  // Momentum: recent 10 vs older videos
  const chronological = [...longForm].sort((a, b) =>
    new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  )
  const recent10 = chronological.slice(0, 10)
  const older = chronological.slice(10)
  const recent10Avg = recent10.length > 0
    ? Math.round(recent10.reduce((s, v) => s + v.views, 0) / recent10.length) : 0
  const olderAvg = older.length > 0
    ? Math.round(older.reduce((s, v) => s + v.views, 0) / older.length) : 0
  const momentumPct = olderAvg > 0 ? Math.round((recent10Avg / olderAvg - 1) * 100) : 0

  // Curiosity gap analysis
  const avgCuriosityGap = videos.length > 0
    ? Math.round(videos.reduce((s, v) => s + v.curiosityGapScore, 0) / videos.length) : 0
  const highCuriosity = videos.filter((v) => v.curiosityGapScore >= 50)
  const lowCuriosity = videos.filter((v) => v.curiosityGapScore < 20)

  return {
    totalViews, totalLikes, totalComments,
    longForm, shorts, top10, bottom10,
    top10Outliers, commentGoldmine, ghostVideos,
    longFormAvgViews, shortsAvgViews, longFormAvgLikes, shortsAvgLikes,
    dayStats, recent10Avg, olderAvg, momentumPct,
    avgCuriosityGap, highCuriosity, lowCuriosity,
  }
}

export default function ExportPageClient({ result, sourceUrl, errorBanner }: ExportPageClientProps) {
  const [format, setFormat] = useState<FormatType>('pdf')
  const [sections, setSections] = useState<Record<string, boolean>>(DEFAULT_SECTIONS)
  const [logoUrl, setLogoUrl] = useState<string | null>(null)
  const [whiteLabel, setWhiteLabel] = useState(false)
  const [copied, setCopied] = useState(false)
  const [toastMsg, setToastMsg] = useState<string | null>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)

  const data = computeReportData(result)

  const showToast = useCallback((msg: string) => {
    setToastMsg(msg)
    setTimeout(() => setToastMsg(null), 2500)
  }, [])

  function handleLogoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      if (typeof ev.target?.result === 'string') {
        setLogoUrl(ev.target.result)
      }
    }
    reader.readAsDataURL(file)
  }

  function handleGeneratePDF() {
    const style = document.createElement('style')
    style.id = 'vm-print-style'
    style.textContent = `
      @media print {
        body > div > *:not(#vm-report-wrapper) { display: none !important; }
        #vm-report-wrapper { display: block !important; position: absolute !important; inset: 0 !important; z-index: 99999 !important; overflow: visible !important; background: white !important; padding: 40px !important; }
        .no-print { display: none !important; }
      }
    `
    document.head.appendChild(style)
    window.print()
    setTimeout(() => {
      const existing = document.getElementById('vm-print-style')
      if (existing) existing.remove()
    }, 2000)
  }

  function handleDownloadCSV() {
    const dateStr = new Date().toISOString().slice(0, 10)
    const lines: string[] = []

    // Sheet 1: Channel Summary
    lines.push('=== CHANNEL SUMMARY ===')
    lines.push('Metric,Value')
    lines.push(`Channel Name,"${result.channel.name}"`)
    lines.push(`Handle,"${result.channel.handle}"`)
    lines.push(`Subscribers,${result.channel.subscribers}`)
    lines.push(`Average Views Per Video,${result.channel.avgViews}`)
    lines.push(`Upload Frequency,"${result.channel.uploadFrequency} videos/week"`)
    lines.push(`Engagement Rate,${result.channel.engagementRate}%`)
    lines.push(`Overall Outlier Score,${result.outlierScore}`)
    lines.push(`Shorts Percentage,${result.shortsPercentage}%`)
    lines.push(`Shorts View Share,${result.shortsViewShare}%`)
    lines.push(`Posting Cadence,"${result.postingCadence}"`)
    lines.push(`Total Videos Analyzed,${result.videos.length}`)
    lines.push(`Long-Form Videos,${data.longForm.length}`)
    lines.push(`Shorts,${data.shorts.length}`)
    lines.push(`Total Views (Sample),${data.totalViews}`)
    lines.push(`Total Likes (Sample),${data.totalLikes}`)
    lines.push(`Total Comments (Sample),${data.totalComments}`)
    lines.push(`Long-Form Avg Views,${data.longFormAvgViews}`)
    lines.push(`Shorts Avg Views,${data.shortsAvgViews}`)
    lines.push(`Momentum (Recent vs Older),${data.momentumPct > 0 ? '+' : ''}${data.momentumPct}%`)
    lines.push(`Avg Curiosity Gap Score,${data.avgCuriosityGap}/100`)
    lines.push(`Report Generated,"${dateStr}"`)
    lines.push('')

    // Sheet 2: Intelligence Brief
    lines.push('=== INTELLIGENCE BRIEF ===')
    lines.push('Sentiment,Insight')
    for (const bullet of result.intelligenceBrief) {
      const sentiment = bullet.startsWith('↑') ? 'Positive' : bullet.startsWith('↓') ? 'Negative' : bullet.startsWith('⚠') ? 'Warning' : 'Neutral'
      lines.push(`${sentiment},"${bullet.replace(/^[↑↓⚠→]\s*/, '').replace(/"/g, '""')}"`)
    }
    lines.push('')

    // Sheet 3: Win Formula
    lines.push('=== WIN FORMULA ===')
    lines.push('Parameter,Value')
    lines.push(`Best Post Day,"${result.winFormula.postDay}"`)
    lines.push(`Optimal Duration,"${result.winFormula.duration}"`)
    lines.push(`Title Pattern,"${result.winFormula.titlePattern}"`)
    lines.push('')

    // Sheet 4: Format Graveyard
    if (result.formatGraveyard.length > 0) {
      lines.push('=== FORMAT GRAVEYARD ===')
      lines.push('Format,Last Used,Performance Multiplier,Example Title')
      for (const g of result.formatGraveyard) {
        lines.push(`"${g.formatName}","${g.lastUsed}",${g.avgPerformance}x,"${g.exampleTitle.replace(/"/g, '""')}"`)
      }
      lines.push('')
    }

    // Sheet 5: All Videos (detailed)
    lines.push('=== ALL VIDEOS ===')
    lines.push('Rank,Title,Views,Likes,Comments,Duration,Duration (sec),Published Date,Outlier Score,Curiosity Gap,Is Short,Ghost Audience,Format Graveyard,Engagement Rate,Like-to-View Ratio,Comment-to-View Ratio,YouTube URL')
    const sorted = [...result.videos].sort((a, b) => b.views - a.views)
    sorted.forEach((v, i) => {
      const engRate = v.views > 0 ? ((v.likes + v.comments) / v.views * 100).toFixed(3) : '0'
      const likeRatio = v.views > 0 ? (v.likes / v.views * 100).toFixed(3) : '0'
      const commentRatio = v.views > 0 ? (v.comments / v.views * 100).toFixed(4) : '0'
      lines.push([
        i + 1,
        `"${v.title.replace(/"/g, '""')}"`,
        v.views,
        v.likes,
        v.comments,
        `"${formatDuration(v.duration)}"`,
        v.duration,
        v.publishedAt.slice(0, 10),
        v.outlierScore.toFixed(1),
        v.curiosityGapScore,
        v.isShort ? 'Yes' : 'No',
        v.ghostAudience ? 'Yes' : 'No',
        v.formatGraveyard ? 'Yes' : 'No',
        engRate + '%',
        likeRatio + '%',
        commentRatio + '%',
        `https://youtube.com/watch?v=${v.id}`,
      ].join(','))
    })
    lines.push('')

    // Sheet 6: Cadence Heatmap
    lines.push('=== CADENCE HEATMAP (performance 0-1) ===')
    lines.push('Day,Morning,Afternoon,Evening,Night')
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    for (const day of days) {
      const cells = result.cadenceGrid.filter((c) => c.day === day)
      const morning = cells.find((c) => c.time === 'Morning')?.performance ?? 0
      const afternoon = cells.find((c) => c.time === 'Afternoon')?.performance ?? 0
      const evening = cells.find((c) => c.time === 'Evening')?.performance ?? 0
      const night = cells.find((c) => c.time === 'Night')?.performance ?? 0
      lines.push(`${day},${morning},${afternoon},${evening},${night}`)
    }

    const csv = lines.join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${result.channel.name}-vexel-report-${dateStr}.csv`
    a.click()
    URL.revokeObjectURL(url)
    showToast('CSV downloaded')
  }

  function handleDownloadJSON() {
    const dateStr = new Date().toISOString().slice(0, 10)

    // Build a comprehensive JSON report
    const report = {
      meta: {
        tool: 'Vexel — YouTube Competitor Intelligence',
        generatedAt: new Date().toISOString(),
        generatedIn: `${result.generatedIn}s`,
        videosAnalyzed: result.videos.length,
        sourceUrl: sourceUrl || undefined,
      },
      channel: {
        ...result.channel,
        totalViewsInSample: data.totalViews,
        totalLikesInSample: data.totalLikes,
        totalCommentsInSample: data.totalComments,
        longFormCount: data.longForm.length,
        shortsCount: data.shorts.length,
      },
      scores: {
        outlierScore: result.outlierScore,
        engagementRate: result.channel.engagementRate,
        shortsPercentage: result.shortsPercentage,
        shortsViewShare: result.shortsViewShare,
        postingCadence: result.postingCadence,
        avgCuriosityGapScore: data.avgCuriosityGap,
        momentum: {
          recent10AvgViews: data.recent10Avg,
          olderAvgViews: data.olderAvg,
          changePercent: data.momentumPct,
          direction: data.momentumPct > 10 ? 'accelerating' : data.momentumPct > -10 ? 'stable' : 'declining',
        },
      },
      intelligenceBrief: result.intelligenceBrief.map((bullet) => ({
        sentiment: bullet.startsWith('↑') ? 'positive' : bullet.startsWith('↓') ? 'negative' : bullet.startsWith('⚠') ? 'warning' : 'neutral',
        text: bullet.replace(/^[↑↓⚠→]\s*/, ''),
      })),
      winFormula: result.winFormula,
      formatGraveyard: result.formatGraveyard,
      shortsAnalysis: {
        count: data.shorts.length,
        percentageOfUploads: result.shortsPercentage,
        viewShare: result.shortsViewShare,
        avgViews: data.shortsAvgViews,
        longFormAvgViews: data.longFormAvgViews,
        avgLikes: data.shortsAvgLikes,
        longFormAvgLikes: data.longFormAvgLikes,
      },
      topVideos: {
        byViews: data.top10.map((v) => ({
          id: v.id,
          title: v.title,
          views: v.views,
          likes: v.likes,
          comments: v.comments,
          outlierScore: v.outlierScore,
          curiosityGapScore: v.curiosityGapScore,
          duration: v.duration,
          publishedAt: v.publishedAt,
          url: `https://youtube.com/watch?v=${v.id}`,
        })),
        byOutlierScore: data.top10Outliers.map((v) => ({
          id: v.id,
          title: v.title,
          views: v.views,
          outlierScore: v.outlierScore,
          url: `https://youtube.com/watch?v=${v.id}`,
        })),
        commentGoldmine: data.commentGoldmine.map((v) => ({
          id: v.id,
          title: v.title,
          views: v.views,
          comments: v.comments,
          commentToViewRatio: v.views > 0 ? +(v.comments / v.views * 100).toFixed(4) : 0,
          url: `https://youtube.com/watch?v=${v.id}`,
        })),
        ghostAudience: data.ghostVideos.map((v) => ({
          id: v.id,
          title: v.title,
          views: v.views,
          comments: v.comments,
          url: `https://youtube.com/watch?v=${v.id}`,
        })),
      },
      cadenceHeatmap: result.cadenceGrid,
      allVideos: result.videos.map((v) => ({
        id: v.id,
        title: v.title,
        views: v.views,
        likes: v.likes,
        comments: v.comments,
        duration: v.duration,
        publishedAt: v.publishedAt,
        isShort: v.isShort,
        outlierScore: v.outlierScore,
        curiosityGapScore: v.curiosityGapScore,
        ghostAudience: v.ghostAudience,
        formatGraveyard: v.formatGraveyard,
        engagementRate: v.views > 0 ? +((v.likes + v.comments) / v.views * 100).toFixed(3) : 0,
        url: `https://youtube.com/watch?v=${v.id}`,
      })),
    }

    const json = JSON.stringify(report, null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${result.channel.name}-vexel-report-${dateStr}.json`
    a.click()
    URL.revokeObjectURL(url)
    showToast('JSON downloaded')
  }

  function handleCopyLink() {
    const handle = result.channel.handle.replace('@', '')
    navigator.clipboard.writeText(`https://vexel.app/r/${handle}`).catch(() => null)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function handleExport() {
    if (format === 'pdf') handleGeneratePDF()
    else if (format === 'csv') handleDownloadCSV()
    else handleDownloadJSON()
  }

  const topVideo = result.videos.reduce((b, v) => (v.views > b.views ? v : b))
  const exportButtonLabel =
    format === 'pdf' ? 'Generate PDF' : format === 'csv' ? 'Download CSV' : 'Download JSON'

  // Section number counter
  let sectionNum = 0
  function nextSection() { return String(++sectionNum).padStart(2, '0') }

  return (
    <div className="flex min-h-screen" style={{ background: '#050508', overflowX: 'clip' }}>
      <AppSidebar active="Export" />

      <div className="flex-1 min-w-0 ml-0 md:ml-[220px] flex flex-col min-h-screen overflow-x-hidden">
        {/* Topbar */}
        <header
          className="no-print sticky top-0 z-30 h-14 sm:h-16 flex items-center justify-between pl-14 pr-4 md:px-10"
          style={{ background: 'rgba(5,5,8,0.8)', backdropFilter: 'blur(24px)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}
        >
          <div className="flex items-center gap-6">
            <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.2em', color: 'rgba(255,255,255,0.3)', fontWeight: 600 }}>
              Export Report
            </span>
            {sourceUrl && (
              <div
                className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
              >
                <span style={{ fontSize: '9px', color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Channel</span>
                <span style={{ fontSize: '11px', fontFamily: 'monospace', color: 'rgba(255,255,255,0.45)', maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {result.channel.name}
                </span>
              </div>
            )}
            <a
              href={sourceUrl ? `/analysis?url=${encodeURIComponent(sourceUrl)}` : '/analysis'}
              style={{ fontSize: '12px', fontFamily: 'monospace', color: 'rgba(255,255,255,0.25)', textDecoration: 'none' }}
              onMouseEnter={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.6)' }}
              onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.25)' }}
            >
              ← Analysis
            </a>
          </div>
          <button
            type="button"
            onClick={handleGeneratePDF}
            className="no-print flex items-center gap-2"
            style={{ fontSize: '12px', fontFamily: 'monospace', color: 'rgba(255,255,255,0.35)', background: 'none', border: 'none', cursor: 'pointer', transition: 'color 150ms' }}
            onMouseEnter={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.7)' }}
            onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.35)' }}
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M2 4H14M2 8H14M2 12H10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
            Print
          </button>
        </header>

        {/* Error / demo banner */}
        {errorBanner && (
          <div
            className="no-print flex items-center gap-2 px-4 md:px-10 py-2.5"
            style={{ background: 'rgba(245,166,35,0.05)', borderBottom: '1px solid rgba(245,166,35,0.12)' }}
          >
            <span style={{ fontSize: '12px' }}>⚠</span>
            <p style={{ fontSize: '12px', fontFamily: 'monospace', color: '#F5A623' }}>{errorBanner}</p>
          </div>
        )}

        {/* Two-panel layout */}
        <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">

          {/* ── Document preview ─────────────────────────────────────── */}
          <div className="flex-1 overflow-y-auto flex justify-center px-4 md:px-10 py-6 md:py-12" style={{ background: 'rgba(255,255,255,0.01)' }}>
            <div
              id="vm-report-wrapper"
              className="w-full max-w-[640px] bg-white rounded-2xl overflow-hidden"
              style={{ boxShadow: '0 40px 80px -20px rgba(0,0,0,0.6)' }}
            >
              {/* ── Report Header ───────────────────────────────────── */}
              <div className="p-6 sm:p-10" style={{ borderBottom: '1px solid #f0f0f0' }}>
                <div className="flex flex-col sm:flex-row items-start justify-between gap-4" style={{ marginBottom: '24px' }}>
                  <div className="flex items-center gap-3">
                    {whiteLabel ? (
                      logoUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={logoUrl} alt="Agency logo" style={{ height: '32px', objectFit: 'contain' }} />
                      ) : (
                        <span style={{ color: '#1a1a1a', fontWeight: 600, fontSize: '17px' }}>Your Agency</span>
                      )
                    ) : (
                      <span style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: '17px', fontWeight: 700, letterSpacing: '3px', color: '#111827', textTransform: 'uppercase' }}>VEXEL</span>
                    )}
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontSize: '10px', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Channel Focus</p>
                    <p style={{ fontSize: '16px', color: '#374151', fontStyle: 'italic', marginTop: '2px' }}>{result.channel.name}</p>
                  </div>
                </div>
                <h1 style={{ fontSize: '34px', lineHeight: 1.2, color: '#111827', fontStyle: 'italic', marginBottom: '8px' }}>
                  Competitive Intelligence<br />Report
                </h1>
                <p style={{ fontSize: '13px', color: '#9ca3af' }}>
                  {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  {' · '}{result.videos.length} videos analyzed in {result.generatedIn}s
                </p>
              </div>

              {/* ── 01. Channel Overview ────────────────────────────── */}
              <div className="p-6 sm:p-10" style={{ borderBottom: '1px solid #f0f0f0' }}>
                <p style={{ fontSize: '10px', fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.15em', color: '#9ca3af', marginBottom: '20px' }}>
                  {nextSection()}. Channel Overview
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4" style={{ marginBottom: '20px' }}>
                  {[
                    { label: 'Subscribers', value: formatViews(result.channel.subscribers) },
                    { label: 'Avg Views/Video', value: formatViews(result.channel.avgViews) },
                    { label: 'Outlier Score', value: `${result.outlierScore.toFixed(1)}/10`, highlight: result.outlierScore >= 7 },
                    { label: 'Engagement', value: `${result.channel.engagementRate}%`, highlight: result.channel.engagementRate > 4 },
                  ].map((s) => (
                    <div key={s.label} className="flex flex-col gap-1">
                      <p style={{ fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#9ca3af' }}>{s.label}</p>
                      <p style={{ fontSize: '20px', fontFamily: 'monospace', fontWeight: 600, color: s.highlight ? '#059669' : '#111827' }}>
                        {s.value}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[
                    { label: 'Upload Cadence', value: result.postingCadence },
                    { label: 'Videos/Week', value: `${result.channel.uploadFrequency}` },
                    { label: 'Shorts %', value: `${result.shortsPercentage}%` },
                    { label: 'Momentum', value: `${data.momentumPct > 0 ? '+' : ''}${data.momentumPct}%`, highlight: data.momentumPct > 10, negative: data.momentumPct < -10 },
                  ].map((s) => (
                    <div key={s.label} className="flex flex-col gap-1">
                      <p style={{ fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#9ca3af' }}>{s.label}</p>
                      <p style={{ fontSize: '14px', fontFamily: 'monospace', fontWeight: 500, color: s.highlight ? '#059669' : s.negative ? '#dc2626' : '#374151' }}>
                        {s.value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* ── 02. Intelligence Brief ─────────────────────────── */}
              {sections['Intelligence Brief'] && (
                <div className="p-6 sm:p-10" style={{ borderBottom: '1px solid #f0f0f0' }}>
                  <p style={{ fontSize: '10px', fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.15em', color: '#9ca3af', marginBottom: '20px' }}>
                    {nextSection()}. Intelligence Brief
                  </p>
                  <div className="flex flex-col gap-3">
                    {result.intelligenceBrief.map((bullet, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <span style={{
                          fontSize: '14px',
                          color: bullet.startsWith('↑') ? '#059669' : bullet.startsWith('↓') ? '#dc2626' : bullet.startsWith('⚠') ? '#d97706' : '#6b7280',
                          flexShrink: 0, marginTop: '1px',
                        }}>
                          {bullet.startsWith('↑') ? '↑' : bullet.startsWith('↓') ? '↓' : bullet.startsWith('⚠') ? '⚠' : '→'}
                        </span>
                        <p style={{ fontSize: '13px', color: '#374151', lineHeight: 1.6 }}>
                          {bullet.replace(/^[↑↓⚠→]\s*/, '')}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ── 03. Win Formula ────────────────────────────────── */}
              {sections['Win Formula'] && (
                <div className="p-6 sm:p-10" style={{ borderBottom: '1px solid #f0f0f0' }}>
                  <p style={{ fontSize: '10px', fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.15em', color: '#9ca3af', marginBottom: '20px' }}>
                    {nextSection()}. Win Formula
                  </p>
                  <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '16px', lineHeight: 1.6 }}>
                    Recurring patterns found in the top-performing long-form videos on this channel.
                  </p>
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { label: 'Best Post Day', value: result.winFormula.postDay, icon: '📅' },
                      { label: 'Sweet Spot Duration', value: result.winFormula.duration, icon: '⏱' },
                      { label: 'Title Pattern', value: result.winFormula.titlePattern, icon: '✍️' },
                    ].map((item) => (
                      <div key={item.label} className="flex flex-col gap-1 p-3 rounded-lg" style={{ background: '#f9fafb' }}>
                        <p style={{ fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#9ca3af' }}>{item.label}</p>
                        <p style={{ fontSize: '14px', fontFamily: 'monospace', fontWeight: 600, color: '#111827' }}>
                          {item.value}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ── 04. Top Outlier Videos ─────────────────────────── */}
              {sections['Top Outlier Videos'] && (
                <div className="p-6 sm:p-10" style={{ borderBottom: '1px solid #f0f0f0' }}>
                  <p style={{ fontSize: '10px', fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.15em', color: '#9ca3af', marginBottom: '20px' }}>
                    {nextSection()}. Top 10 Outlier Videos
                  </p>
                  <div className="flex flex-col">
                    {data.top10Outliers.map((v, i) => (
                      <div
                        key={v.id}
                        className="flex items-center gap-3 py-2.5"
                        style={{ borderBottom: i < 9 ? '1px solid #f3f4f6' : 'none' }}
                      >
                        <span style={{ fontSize: '11px', fontFamily: 'monospace', color: '#9ca3af', flexShrink: 0, width: '18px', textAlign: 'right' }}>
                          {i + 1}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p style={{ fontSize: '12px', color: '#374151', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {v.title}
                          </p>
                          <p style={{ fontSize: '10px', fontFamily: 'monospace', color: '#9ca3af', marginTop: '2px' }}>
                            {formatViews(v.views)} views · {formatViews(v.likes)} likes · {formatViews(v.comments)} comments
                          </p>
                        </div>
                        <div className="flex flex-col items-end flex-shrink-0" style={{ minWidth: '54px' }}>
                          <span style={{ fontSize: '12px', fontFamily: 'monospace', fontWeight: 600, color: v.outlierScore >= 7 ? '#d97706' : '#4F7EFF' }}>
                            {v.outlierScore.toFixed(1)}
                          </span>
                          <span style={{ fontSize: '9px', fontFamily: 'monospace', color: '#9ca3af' }}>/10</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ── 05. Shorts Analysis ────────────────────────────── */}
              {sections['Shorts Analysis'] && data.shorts.length > 0 && (
                <div className="p-6 sm:p-10" style={{ borderBottom: '1px solid #f0f0f0' }}>
                  <p style={{ fontSize: '10px', fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.15em', color: '#9ca3af', marginBottom: '20px' }}>
                    {nextSection()}. Shorts vs Long-Form Analysis
                  </p>
                  <div className="grid grid-cols-2 gap-px rounded-lg overflow-hidden" style={{ background: '#e5e7eb' }}>
                    <div className="bg-white p-4 flex flex-col gap-1">
                      <p style={{ fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#9ca3af' }}>Metric</p>
                    </div>
                    <div className="grid grid-cols-2 gap-px" style={{ background: '#e5e7eb' }}>
                      <div className="bg-white p-4"><p style={{ fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#9ca3af', textAlign: 'center' }}>Long-Form</p></div>
                      <div className="bg-white p-4"><p style={{ fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#9ca3af', textAlign: 'center' }}>Shorts</p></div>
                    </div>
                    {[
                      { label: 'Count', lf: `${data.longForm.length}`, s: `${data.shorts.length}` },
                      { label: 'Avg Views', lf: formatViews(data.longFormAvgViews), s: formatViews(data.shortsAvgViews) },
                      { label: 'Avg Likes', lf: formatViews(data.longFormAvgLikes), s: formatViews(data.shortsAvgLikes) },
                      { label: '% of Uploads', lf: `${100 - result.shortsPercentage}%`, s: `${result.shortsPercentage}%` },
                      { label: '% of Views', lf: `${100 - result.shortsViewShare}%`, s: `${result.shortsViewShare}%` },
                    ].map((row) => (
                      <div key={row.label} className="contents">
                        <div className="bg-white p-3"><p style={{ fontSize: '12px', color: '#374151' }}>{row.label}</p></div>
                        <div className="grid grid-cols-2 gap-px" style={{ background: '#e5e7eb' }}>
                          <div className="bg-white p-3"><p style={{ fontSize: '12px', fontFamily: 'monospace', color: '#111827', textAlign: 'center' }}>{row.lf}</p></div>
                          <div className="bg-white p-3"><p style={{ fontSize: '12px', fontFamily: 'monospace', color: '#111827', textAlign: 'center' }}>{row.s}</p></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ── 06. Format Graveyard ───────────────────────────── */}
              {sections['Format Graveyard'] && result.formatGraveyard.length > 0 && (
                <div className="p-6 sm:p-10" style={{ borderBottom: '1px solid #f0f0f0' }}>
                  <p style={{ fontSize: '10px', fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.15em', color: '#9ca3af', marginBottom: '8px' }}>
                    {nextSection()}. Format Graveyard
                  </p>
                  <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '16px', lineHeight: 1.6 }}>
                    High-performing content formats this channel has abandoned — potential competitor opportunities.
                  </p>
                  <div className="flex flex-col gap-3">
                    {result.formatGraveyard.map((g) => (
                      <div key={g.formatName} className="flex items-center justify-between p-3 rounded-lg" style={{ background: '#faf5ff', border: '1px solid #f3e8ff' }}>
                        <div className="flex flex-col gap-0.5 min-w-0 flex-1">
                          <p style={{ fontSize: '13px', fontWeight: 600, color: '#7c3aed' }}>{g.formatName}</p>
                          <p style={{ fontSize: '11px', color: '#9ca3af', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            e.g. &quot;{g.exampleTitle}&quot;
                          </p>
                        </div>
                        <div className="flex items-center gap-4 flex-shrink-0 ml-4">
                          <div className="text-right">
                            <p style={{ fontSize: '14px', fontFamily: 'monospace', fontWeight: 600, color: '#7c3aed' }}>{g.avgPerformance}×</p>
                            <p style={{ fontSize: '9px', color: '#9ca3af' }}>avg perf</p>
                          </div>
                          <div className="text-right">
                            <p style={{ fontSize: '11px', fontFamily: 'monospace', color: '#dc2626' }}>{g.lastUsed}</p>
                            <p style={{ fontSize: '9px', color: '#9ca3af' }}>last used</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ── 07. Cadence Heatmap ────────────────────────────── */}
              {sections['Cadence Heatmap'] && (
                <div className="p-6 sm:p-10" style={{ borderBottom: '1px solid #f0f0f0' }}>
                  <p style={{ fontSize: '10px', fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.15em', color: '#9ca3af', marginBottom: '8px' }}>
                    {nextSection()}. Upload Cadence Heatmap
                  </p>
                  <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '16px', lineHeight: 1.6 }}>
                    When this channel posts vs when those posts perform best. Darker = higher average views.
                  </p>
                  <div style={{ display: 'grid', gridTemplateColumns: '48px repeat(4, 1fr)', gap: '2px', fontSize: '10px' }}>
                    <div />
                    {['Morning', 'Afternoon', 'Evening', 'Night'].map((t) => (
                      <div key={t} style={{ textAlign: 'center', color: '#9ca3af', padding: '4px 0', fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{t}</div>
                    ))}
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                      <div key={day} className="contents">
                        <div style={{ display: 'flex', alignItems: 'center', fontSize: '10px', fontFamily: 'monospace', color: '#6b7280', paddingRight: '8px' }}>{day}</div>
                        {['Morning', 'Afternoon', 'Evening', 'Night'].map((time) => {
                          const cell = result.cadenceGrid.find((c) => c.day === day && c.time === time)
                          const perf = cell?.performance ?? 0
                          const bg = perf > 0
                            ? `rgba(79, 126, 255, ${0.1 + perf * 0.7})`
                            : '#f9fafb'
                          return (
                            <div
                              key={`${day}-${time}`}
                              style={{
                                background: bg,
                                borderRadius: '4px',
                                aspectRatio: '1',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '9px',
                                fontFamily: 'monospace',
                                color: perf > 0.5 ? '#fff' : '#9ca3af',
                              }}
                            >
                              {perf > 0 ? perf.toFixed(2) : ''}
                            </div>
                          )
                        })}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ── 08. Comment Goldmine ────────────────────────────── */}
              {data.commentGoldmine.length > 0 && (
                <div className="p-6 sm:p-10" style={{ borderBottom: '1px solid #f0f0f0' }}>
                  <p style={{ fontSize: '10px', fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.15em', color: '#9ca3af', marginBottom: '8px' }}>
                    {nextSection()}. Comment Goldmine
                  </p>
                  <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '16px', lineHeight: 1.6 }}>
                    Videos with the highest comment-to-view ratio — these topics spark the most audience engagement.
                  </p>
                  <div className="flex flex-col">
                    {data.commentGoldmine.map((v, i) => (
                      <div key={v.id} className="flex items-center gap-3 py-2.5" style={{ borderBottom: i < data.commentGoldmine.length - 1 ? '1px solid #f3f4f6' : 'none' }}>
                        <div className="flex-1 min-w-0">
                          <p style={{ fontSize: '12px', color: '#374151', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{v.title}</p>
                          <p style={{ fontSize: '10px', fontFamily: 'monospace', color: '#9ca3af', marginTop: '2px' }}>
                            {formatViews(v.views)} views · {formatViews(v.comments)} comments
                          </p>
                        </div>
                        <span style={{ fontSize: '12px', fontFamily: 'monospace', fontWeight: 600, color: '#059669', flexShrink: 0 }}>
                          {v.views > 0 ? (v.comments / v.views * 100).toFixed(2) : '0'}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ── 09. Full Video Data Table ──────────────────────── */}
              {sections['Full Video Data'] && (
                <div className="p-6 sm:p-10" style={{ borderBottom: '1px solid #f0f0f0' }}>
                  <p style={{ fontSize: '10px', fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.15em', color: '#9ca3af', marginBottom: '20px' }}>
                    {nextSection()}. All Videos — Raw Data
                  </p>
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', fontSize: '10px', borderCollapse: 'collapse' }}>
                      <thead>
                        <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                          {['#', 'Title', 'Views', 'Likes', 'Duration', 'Score', 'Type'].map((h) => (
                            <th key={h} style={{ padding: '6px 4px', textAlign: 'left', color: '#9ca3af', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {[...result.videos].sort((a, b) => b.views - a.views).map((v, i) => (
                          <tr key={v.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                            <td style={{ padding: '5px 4px', fontFamily: 'monospace', color: '#9ca3af' }}>{i + 1}</td>
                            <td style={{ padding: '5px 4px', color: '#374151', maxWidth: '220px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{v.title}</td>
                            <td style={{ padding: '5px 4px', fontFamily: 'monospace', color: '#111827' }}>{formatViews(v.views)}</td>
                            <td style={{ padding: '5px 4px', fontFamily: 'monospace', color: '#6b7280' }}>{formatViews(v.likes)}</td>
                            <td style={{ padding: '5px 4px', fontFamily: 'monospace', color: '#6b7280' }}>{formatDuration(v.duration)}</td>
                            <td style={{ padding: '5px 4px', fontFamily: 'monospace', color: v.outlierScore >= 7 ? '#d97706' : '#4F7EFF' }}>{v.outlierScore.toFixed(1)}</td>
                            <td style={{ padding: '5px 4px', color: '#9ca3af' }}>{v.isShort ? 'Short' : 'Long'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* ── Footer ─────────────────────────────────────────── */}
              <div className="p-6 sm:p-10" style={{ background: '#f9fafb' }}>
                <div className="flex items-center justify-between">
                  <p style={{ fontSize: '10px', color: '#9ca3af' }}>
                    {!whiteLabel && 'Generated by Vexel · '}{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </p>
                  <p style={{ fontSize: '10px', fontFamily: 'monospace', color: '#9ca3af' }}>
                    {result.videos.length} videos · {result.generatedIn}s
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ── Export options panel ───────────────────────────────── */}
          <aside
            className="no-print flex-shrink-0 overflow-y-auto flex flex-col w-full lg:w-[300px]"
            style={{ borderTop: '1px solid rgba(255,255,255,0.06)', borderLeft: 'none', background: 'rgba(255,255,255,0.01)', padding: '24px 16px', gap: '32px' }}
          >
            {/* Export As */}
            <div className="flex flex-col gap-3">
              <p style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.18em', color: 'rgba(255,255,255,0.25)', fontWeight: 600 }}>
                Export As
              </p>
              <div className="flex flex-col gap-2">
                <FormatButton label="PDF Report" icon={PDF_ICON} active={format === 'pdf'} badge={format === 'pdf' ? 'Recommended' : undefined} onClick={() => setFormat('pdf')} />
                <FormatButton label="CSV Spreadsheet" icon={CSV_ICON} active={format === 'csv'} onClick={() => setFormat('csv')} />
                <FormatButton label="JSON Data" icon={JSON_ICON} active={format === 'json'} onClick={() => setFormat('json')} />
              </div>
              {format === 'csv' && (
                <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.25)', lineHeight: 1.5, marginTop: '4px' }}>
                  Includes channel summary, intelligence brief, win formula, format graveyard, all video data with per-video metrics, and cadence heatmap.
                </p>
              )}
              {format === 'json' && (
                <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.25)', lineHeight: 1.5, marginTop: '4px' }}>
                  Full structured report with metadata, scores, momentum, shorts analysis, comment goldmine, ghost audience, and all video data.
                </p>
              )}
            </div>

            <div style={{ height: '1px', background: 'rgba(255,255,255,0.05)' }} />

            {/* Customize Report (PDF sections) */}
            <div className="flex flex-col gap-3">
              <p style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.18em', color: 'rgba(255,255,255,0.25)', fontWeight: 600 }}>
                Customize Report
              </p>
              <div className="flex flex-col">
                {Object.entries(sections).map(([label, enabled]) => (
                  <div key={label} className="flex items-center justify-between py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.55)' }}>{label}</span>
                    <Toggle enabled={enabled} onToggle={() => setSections((prev) => ({ ...prev, [label]: !prev[label] }))} />
                  </div>
                ))}
                <div className="flex items-center justify-between py-3">
                  <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.25)' }}>Competitor Comparison</span>
                  <span style={{ fontSize: '9px', fontFamily: 'monospace', color: '#F5A623', border: '1px solid rgba(245,166,35,0.25)', borderRadius: '999px', padding: '2px 7px' }}>PRO</span>
                </div>
              </div>
            </div>

            <div style={{ height: '1px', background: 'rgba(255,255,255,0.05)' }} />

            {/* Branding */}
            <div className="flex flex-col gap-3">
              <p style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.18em', color: 'rgba(255,255,255,0.25)', fontWeight: 600 }}>
                Branding
              </p>
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex flex-col items-center gap-2 w-full"
                style={{ border: '1px dashed rgba(255,255,255,0.1)', borderRadius: '10px', padding: '20px', cursor: 'pointer', background: 'none', transition: 'border-color 150ms' }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.22)' }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)' }}
              >
                {logoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={logoUrl} alt="Uploaded logo" style={{ height: '40px', objectFit: 'contain' }} />
                ) : (
                  <>
                    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true" style={{ color: 'rgba(255,255,255,0.25)' }}>
                      <path d="M10 13V3M10 3L6 7M10 3L14 7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M3 15V17H17V15" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                    </svg>
                    <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)', textAlign: 'center' }}>Add your agency logo</p>
                    <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.2)' }}>PNG/SVG up to 2MB</p>
                  </>
                )}
              </button>
              <div className="flex items-center justify-between py-2">
                <div>
                  <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.55)' }}>White-label report</p>
                  <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.25)', marginTop: '2px' }}>Remove Vexel logo</p>
                </div>
                <Toggle enabled={whiteLabel} onToggle={() => setWhiteLabel((p) => !p)} />
              </div>
            </div>

            <div style={{ height: '1px', background: 'rgba(255,255,255,0.05)' }} />

            {/* Share link */}
            <div className="flex flex-col gap-2">
              <p style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.18em', color: 'rgba(255,255,255,0.25)', fontWeight: 600 }}>
                Share Link
              </p>
              <div className="flex gap-2">
                <input
                  readOnly
                  value={`vexel.app/r/${result.channel.handle.replace('@', '')}`}
                  style={{ flex: 1, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '8px 12px', fontSize: '11px', fontFamily: 'monospace', color: 'rgba(255,255,255,0.4)', outline: 'none', minWidth: 0 }}
                />
                <button
                  type="button"
                  onClick={handleCopyLink}
                  style={{ padding: '8px 14px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '12px', color: copied ? '#fff' : 'rgba(255,255,255,0.45)', cursor: 'pointer', flexShrink: 0, transition: 'all 150ms', fontFamily: 'monospace' }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)' }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)' }}
                >
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>

            {/* Footer info */}
            <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.2)', marginTop: 'auto' }}>
              <span style={{ fontFamily: 'monospace' }}>{formatViews(topVideo.views)}</span> peak views across{' '}
              <span style={{ fontFamily: 'monospace' }}>{result.videos.length}</span> videos.
            </p>

            {/* Export button */}
            <button
              type="button"
              onClick={handleExport}
              className="vm-btn w-full"
              style={{ padding: '12px 24px', fontSize: '14px', fontWeight: 600 }}
            >
              {exportButtonLabel}
            </button>
          </aside>
        </div>
      </div>

      {/* Toast */}
      {toastMsg && (
        <div
          className="fixed bottom-6 right-6 z-[100] flex items-center gap-2.5 rounded-xl px-4 py-3"
          style={{ background: 'rgba(10,10,18,0.95)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(20px)', boxShadow: '0 8px 32px rgba(0,0,0,0.4)', fontSize: '13px', color: '#fff' }}
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true" style={{ color: '#2DD4A7', flexShrink: 0 }}>
            <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.2" />
            <path d="M5 8L7 10L11 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span>{toastMsg}</span>
        </div>
      )}
    </div>
  )
}
