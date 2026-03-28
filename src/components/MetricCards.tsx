'use client'

import Image from 'next/image'
import type { AnalysisResult } from '@/src/types'
import { formatViews, formatDuration } from '@/src/lib/utils'

export interface MetricCardsProps {
  result: AnalysisResult
}

const CARD_STYLE: React.CSSProperties = {
  background: 'rgba(255,255,255,0.03)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: '16px',
  padding: '20px',
  transition: 'border-color 200ms ease, transform 200ms cubic-bezier(0.16,1,0.3,1)',
}

const LABEL_STYLE = {
  fontSize: '10px',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.15em',
  color: '#4A4A62',
}

// ── Semi-circle arc gauge ─────────────────────────────────────────────
const ARC_LENGTH = Math.PI * 44

function OutlierArc({ score }: { score: number }) {
  const fill = ARC_LENGTH * (score / 10)
  const empty = ARC_LENGTH - fill
  return (
    <svg viewBox="0 0 100 58" width="120" height="70" aria-label={`Outlier score ${score} out of 10`}>
      <path d="M 8 52 A 44 44 0 1 1 92 52" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="6" strokeLinecap="round" />
      <path d="M 8 52 A 44 44 0 1 1 92 52" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="6" strokeLinecap="round"
        strokeDasharray={`${fill} ${empty}`} />
    </svg>
  )
}

// ── Donut chart ───────────────────────────────────────────────────────
const DONUT_R = 32
const DONUT_CIRC = 2 * Math.PI * DONUT_R

function ShortsDonut({ shortsPercent, underperforms }: { shortsPercent: number; underperforms: boolean }) {
  const shortsDash = DONUT_CIRC * (shortsPercent / 100)
  const longFormDash = DONUT_CIRC - shortsDash
  return (
    <svg viewBox="0 0 80 80" width="80" height="80" aria-label="Shorts vs Long-form split">
      <circle cx="40" cy="40" r={DONUT_R} fill="none" stroke="rgba(45,212,167,0.4)" strokeWidth="10"
        strokeDasharray={`${longFormDash} ${shortsDash}`} strokeDashoffset={DONUT_CIRC * 0.25}
        transform="rotate(-90 40 40)" />
      <circle cx="40" cy="40" r={DONUT_R} fill="none"
        stroke={underperforms ? 'rgba(255,77,106,0.5)' : 'rgba(255,255,255,0.25)'}
        strokeWidth="10"
        strokeDasharray={`${shortsDash} ${longFormDash}`}
        strokeDashoffset={DONUT_CIRC * 0.25 + longFormDash}
        transform="rotate(-90 40 40)" />
      <text x="40" y="44" textAnchor="middle" fontSize="12" fontFamily="monospace" fill="white" fontWeight="700">
        {shortsPercent}%
      </text>
    </svg>
  )
}

export function MetricCards({ result }: MetricCardsProps) {
  const topVideo = result.videos.reduce((best, v) => v.views > best.views ? v : best)
  const shortsUnderperforms = result.shortsViewShare < result.shortsPercentage * 0.7

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">

      {/* Top Video */}
      <div style={CARD_STYLE} className="flex flex-col gap-3">
        <p style={LABEL_STYLE}>Top Video · This Period</p>
        <div className="relative w-full aspect-video rounded-xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.04)' }}>
          {topVideo.thumbnail ? (
            <Image src={topVideo.thumbnail} alt={topVideo.title} fill className="object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <svg width="32" height="22" viewBox="0 0 32 22" fill="none" aria-hidden="true">
                <rect width="32" height="22" rx="3" fill="rgba(255,255,255,0.06)" />
                <path d="M13 7L22 11L13 15V7Z" fill="rgba(255,255,255,0.2)" />
              </svg>
            </div>
          )}
          <div className="absolute bottom-2 left-2 rounded px-1.5 py-0.5" style={{ background: 'rgba(0,0,0,0.7)' }}>
            <span style={{ fontSize: '11px', fontFamily: 'monospace', color: '#fff' }}>{formatDuration(topVideo.duration)}</span>
          </div>
        </div>
        <p style={{ fontSize: '13px', fontWeight: 500, color: '#fff', lineHeight: 1.4 }} className="line-clamp-2">{topVideo.title}</p>
        <div className="flex items-center justify-between mt-auto">
          <span style={{ fontSize: '13px', fontFamily: 'monospace', color: '#2DD4A7' }}>{formatViews(topVideo.views)} views</span>
          <span
            style={{ fontSize: '11px', fontFamily: 'monospace', background: 'rgba(245,166,35,0.1)', color: '#F5A623', border: '1px solid rgba(245,166,35,0.2)', borderRadius: '999px', padding: '2px 10px' }}
          >
            {topVideo.outlierScore.toFixed(1)}x avg
          </span>
        </div>
      </div>

      {/* Outlier Score */}
      <div style={{ ...CARD_STYLE, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px', textAlign: 'center' }}>
        <p style={{ ...LABEL_STYLE, alignSelf: 'flex-start' }}>Outlier Score</p>
        <div className="flex items-end gap-1 mt-2">
          <span style={{ fontSize: '48px', fontFamily: 'monospace', fontWeight: 700, color: '#fff', lineHeight: 1 }}>
            {result.outlierScore.toFixed(1)}
          </span>
          <span style={{ fontSize: '22px', fontFamily: 'monospace', color: '#4A4A62', marginBottom: '4px' }}>/10</span>
        </div>
        <p style={{ fontSize: '12px', color: '#888899' }}>Top 15% of channels analyzed</p>
        <OutlierArc score={result.outlierScore} />
      </div>

      {/* Shorts Performance */}
      <div style={{ ...CARD_STYLE, display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <p style={LABEL_STYLE}>Shorts Performance</p>
        <div className="flex items-center gap-4">
          <ShortsDonut shortsPercent={result.shortsPercentage} underperforms={shortsUnderperforms} />
          <div className="flex flex-col gap-2">
            <div>
              <p style={{ fontSize: '11px', color: '#4A4A62' }}>Uploads</p>
              <p style={{ fontSize: '13px', fontFamily: 'monospace', color: '#fff' }}>{result.shortsPercentage}% Shorts</p>
            </div>
            <div>
              <p style={{ fontSize: '11px', color: '#4A4A62' }}>View share</p>
              <p style={{ fontSize: '13px', fontFamily: 'monospace', color: shortsUnderperforms ? '#FF4D6A' : '#2DD4A7' }}>
                {result.shortsViewShare}% of views
              </p>
            </div>
          </div>
        </div>
        {shortsUnderperforms && (
          <p style={{ fontSize: '11px', color: '#FF4D6A', lineHeight: 1.5 }}>
            Shorts drive only {result.shortsViewShare}% of views vs {result.shortsPercentage}% of uploads.
          </p>
        )}
      </div>

      {/* Win Formula */}
      <div style={{ ...CARD_STYLE, display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <p style={LABEL_STYLE}>Win Formula Match</p>
        <div className="flex flex-col gap-2 mt-1">
          {[
            { value: result.winFormula.postDay,      color: 'rgba(255,255,255,0.15)', text: '#fff' },
            { value: result.winFormula.duration,     color: 'rgba(45,212,167,0.12)',  text: '#2DD4A7' },
            { value: result.winFormula.titlePattern, color: 'rgba(245,166,35,0.10)', text: '#F5A623' },
          ].map((item) => (
            <span
              key={item.value}
              style={{
                fontSize: '12px',
                fontFamily: 'monospace',
                background: item.color,
                color: item.text,
                border: `1px solid ${item.color}`,
                borderRadius: '999px',
                padding: '6px 14px',
                textAlign: 'center',
                display: 'block',
              }}
            >
              {item.value}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-2 mt-auto pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <circle cx="7" cy="7" r="6.5" fill="rgba(45,212,167,0.1)" stroke="rgba(45,212,167,0.3)" />
            <path d="M4 7L6 9.5L10 5" stroke="#2DD4A7" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span style={{ fontSize: '12px', color: '#2DD4A7' }}>3 of 3 patterns confirmed</span>
        </div>
      </div>
    </div>
  )
}
