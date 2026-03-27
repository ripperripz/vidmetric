'use client'

import { useState } from 'react'
import type { CadenceCell } from '@/src/types'

export interface CadenceHeatmapProps {
  grid: CadenceCell[]
}

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const TIMES = ['Morning', 'Afternoon', 'Evening', 'Night']

function cellBg(performance: number): string {
  if (performance === 0)   return 'rgba(255,255,255,0.03)'
  if (performance < 0.3)   return 'rgba(255,255,255,0.08)'
  if (performance < 0.6)   return 'rgba(255,255,255,0.18)'
  if (performance < 0.85)  return 'rgba(255,255,255,0.35)'
  return 'rgba(255,255,255,0.55)'
}

function cellGlow(performance: number): string {
  if (performance >= 0.85) return '0 0 8px rgba(255,255,255,0.2)'
  return 'none'
}

export function CadenceHeatmap({ grid }: CadenceHeatmapProps) {
  const [tooltip, setTooltip] = useState<{ day: string; time: string; performance: number } | null>(null)

  const lookup: Record<string, Record<string, number>> = {}
  for (const cell of grid) {
    if (!lookup[cell.day]) lookup[cell.day] = {}
    lookup[cell.day][cell.time] = cell.performance
  }

  return (
    <div
      className="rounded-card p-6 flex flex-col gap-4"
      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}
    >
      <div>
        <p style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.18em', color: 'rgba(255,255,255,0.35)', fontWeight: 600 }}>
          Upload Cadence
        </p>
        <p style={{ fontSize: '13px', color: '#888899', marginTop: '3px' }}>When they post vs. when they win</p>
      </div>

      <div className="relative">
        <div className="flex gap-2">
          {/* Time labels */}
          <div className="flex flex-col gap-2 justify-start pt-7">
            {TIMES.map((t) => (
              <div key={t} className="h-9 flex items-center">
                <span style={{ fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#4A4A62', width: '64px', textAlign: 'right', paddingRight: '8px' }}>{t}</span>
              </div>
            ))}
          </div>

          {/* Grid */}
          <div className="flex flex-col gap-2 flex-1 min-w-0">
            <div className="grid grid-cols-7 gap-2">
              {DAYS.map((d) => (
                <div key={d} className="flex justify-center">
                  <span style={{ fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#4A4A62' }}>{d}</span>
                </div>
              ))}
            </div>

            {TIMES.map((time) => (
              <div key={time} className="grid grid-cols-7 gap-2">
                {DAYS.map((day) => {
                  const perf = lookup[day]?.[time] ?? 0
                  return (
                    <div
                      key={`${day}-${time}`}
                      className="aspect-square rounded-lg cursor-pointer transition-transform duration-150 hover:scale-110"
                      style={{
                        background: cellBg(perf),
                        border: '1px solid rgba(255,255,255,0.06)',
                        boxShadow: cellGlow(perf),
                      }}
                      onMouseEnter={() => setTooltip({ day, time, performance: perf })}
                      onMouseLeave={() => setTooltip(null)}
                      role="gridcell"
                      aria-label={`${day} ${time}: ${(perf * 10).toFixed(1)}x avg views`}
                    />
                  )
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Tooltip */}
        {tooltip && (
          <div
            className="absolute -top-9 left-1/2 -translate-x-1/2 rounded-lg px-3 py-1.5 pointer-events-none z-10 whitespace-nowrap"
            style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.15)' }}
          >
            <span style={{ fontSize: '12px', fontFamily: 'monospace', color: '#fff' }}>
              {tooltip.day} {tooltip.time} · {(tooltip.performance * 10).toFixed(1)}x avg
            </span>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-2 pt-2" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <span style={{ fontSize: '10px', color: '#4A4A62' }}>Low</span>
        {[0.03, 0.08, 0.18, 0.35, 0.55].map((op, i) => (
          <div key={i} className="w-5 h-3 rounded-sm" style={{ background: `rgba(255,255,255,${op})`, border: '1px solid rgba(255,255,255,0.06)' }} />
        ))}
        <span style={{ fontSize: '10px', color: '#4A4A62' }}>High performance</span>
      </div>
    </div>
  )
}
