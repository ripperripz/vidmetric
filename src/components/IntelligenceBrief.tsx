'use client'

import { getSentimentIcon } from '@/src/lib/utils'

export interface IntelligenceBriefProps {
  bullets: string[]
  generatedIn: number
}

function getSentimentConfig(bullet: string) {
  const sentiment = getSentimentIcon(bullet)
  switch (sentiment) {
    case 'up':      return { char: '↑', color: '#2DD4A7' }
    case 'down':    return { char: '↓', color: '#FF4D6A' }
    case 'warning': return { char: '⚠', color: '#F5A623' }
    default:        return { char: '→', color: '#888899' }
  }
}

function stripSentiment(bullet: string): string {
  return bullet.replace(/^[↑↓⚠→]\s*/, '')
}

export function IntelligenceBrief({ bullets, generatedIn }: IntelligenceBriefProps) {
  return (
    <div
      className="w-full rounded-card overflow-hidden"
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderLeft: '2px solid rgba(255,255,255,0.25)',
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-6 pt-5 pb-4"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
      >
        <span style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.2em', color: 'rgba(255,255,255,0.4)', fontWeight: 600 }}>
          Intelligence Brief
        </span>
        <span style={{ fontSize: '11px', fontFamily: 'monospace', color: '#4A4A62' }}>
          Generated in {generatedIn}s
        </span>
      </div>

      {/* Bullets */}
      <ul className="px-4 py-3">
        {bullets.map((bullet, i) => {
          const { char, color } = getSentimentConfig(bullet)
          const text = stripSentiment(bullet)

          return (
            <li
              key={i}
              className="flex items-start gap-3 px-3 py-2.5 -mx-3 rounded-xl transition-all duration-150"
              style={{ animationDelay: `${i * 100}ms` }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)' }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
            >
              <span style={{ color, fontSize: '14px', flexShrink: 0, marginTop: '1px', lineHeight: 1.5 }}>{char}</span>
              <p style={{ fontSize: '14px', color: '#888899', lineHeight: 1.65 }}>{text}</p>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
