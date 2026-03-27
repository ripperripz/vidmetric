'use client'

import type { FormatGraveyardItem } from '@/src/types'

export interface FormatGraveyardProps {
  items: FormatGraveyardItem[]
}

export function FormatGraveyard({ items }: FormatGraveyardProps) {
  return (
    <div
      className="rounded-card p-6 flex flex-col gap-4 h-full"
      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}
    >
      <div>
        <p style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.18em', color: 'rgba(168,85,247,0.7)', fontWeight: 600 }} className="flex items-center gap-2">
          <span>✝</span>
          <span>Format Graveyard</span>
        </p>
        <p style={{ fontSize: '13px', color: '#888899', marginTop: '3px' }}>Winning formats they abandoned</p>
      </div>

      <div className="flex flex-col gap-3">
        {items.map((item) => (
          <div
            key={item.formatName}
            className="rounded-xl p-4 transition-all duration-200"
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.07)',
              borderLeft: '2px solid rgba(168,85,247,0.4)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(168,85,247,0.05)'
              e.currentTarget.style.borderLeftColor = 'rgba(168,85,247,0.7)'
              e.currentTarget.style.transform = 'translateY(-1px)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.03)'
              e.currentTarget.style.borderLeftColor = 'rgba(168,85,247,0.4)'
              e.currentTarget.style.transform = 'translateY(0)'
            }}
          >
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <span style={{ fontSize: '13px', fontWeight: 500, color: '#fff' }}>{item.formatName}</span>
              <span style={{ fontSize: '10px', fontFamily: 'monospace', background: 'rgba(168,85,247,0.1)', color: '#A855F7', border: '1px solid rgba(168,85,247,0.2)', borderRadius: '999px', padding: '2px 8px', flexShrink: 0 }}>
                ✝ Abandoned
              </span>
            </div>

            <p style={{ fontSize: '12px', color: '#4A4A62', fontStyle: 'italic', lineHeight: 1.4, marginTop: '6px' }} className="line-clamp-1">
              &ldquo;{item.exampleTitle}&rdquo;
            </p>

            <div className="flex items-center justify-between mt-3 pt-2.5" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
              <span style={{ fontSize: '11px', fontFamily: 'monospace', color: '#4A4A62' }}>Last: {item.lastUsed}</span>
              <span style={{ fontSize: '11px', fontFamily: 'monospace', color: '#2DD4A7' }}>{item.avgPerformance.toFixed(1)}x avg</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
