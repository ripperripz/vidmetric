'use client'

import { getSentimentIcon } from '@/src/lib/utils'

export interface IntelligenceBriefProps {
  bullets: string[]
  generatedIn: number
}

function getSentimentConfig(bullet: string) {
  const sentiment = getSentimentIcon(bullet)
  switch (sentiment) {
    case 'up':      return { char: '↑', color: '#2DD4A7', bg: 'rgba(45,212,167,0.08)' }
    case 'down':    return { char: '↓', color: '#FF4D6A', bg: 'rgba(255,77,106,0.06)' }
    case 'warning': return { char: '⚠', color: '#F5A623', bg: 'rgba(245,166,35,0.06)' }
    default:        return { char: '→', color: '#888899', bg: 'transparent' }
  }
}

function stripSentiment(bullet: string): string {
  return bullet.replace(/^[↑↓⚠→]\s*/, '')
}

export function IntelligenceBrief({ bullets, generatedIn }: IntelligenceBriefProps) {
  return (
    <div
      className="w-full max-w-full rounded-card overflow-hidden"
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderLeft: '3px solid rgba(61,110,255,0.5)',
        boxShadow: 'inset 3px 0 16px rgba(61,110,255,0.08)',
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 sm:px-6 pt-5 pb-4"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
      >
        <span className="flex items-center gap-2" style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.2em', color: 'rgba(61,110,255,0.7)', fontWeight: 600 }}>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path d="M6 1L7.5 4.5H11L8.3 6.8L9.3 10.5L6 8.2L2.7 10.5L3.7 6.8L1 4.5H4.5L6 1Z" fill="currentColor" />
          </svg>
          Intelligence Brief
        </span>
        <span className="font-mono" style={{ fontSize: '11px', color: 'rgba(255,255,255,0.2)' }}>
          {generatedIn}s
        </span>
      </div>

      {/* Bullets */}
      <ul className="px-4 sm:px-5 py-3">
        {bullets.map((bullet, i) => {
          const { char, color, bg } = getSentimentConfig(bullet)
          const text = stripSentiment(bullet)

          return (
            <li
              key={i}
              className="flex items-start gap-3 px-3 py-3 -mx-2 rounded-xl transition-all duration-150"
              style={{ animationDelay: `${i * 100}ms` }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)' }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
            >
              <span
                className="flex-shrink-0 w-6 h-6 rounded-md flex items-center justify-center"
                style={{ background: bg, fontSize: '12px', color, fontWeight: 700, marginTop: '1px' }}
              >
                {char}
              </span>
              <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.55)', lineHeight: 1.65 }}>{text}</p>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
