'use client'

import Image from 'next/image'
import type { Video } from '@/src/types'
import { formatViews, formatDuration, relativeTime } from '@/src/lib/utils'

export interface VideoCardProps {
  video: Video
}

function StatusBadge({ video }: { video: Video }) {
  // Priority: outlier > high demand > short — only show one
  if (video.outlierScore > 5) {
    return (
      <span
        className="absolute top-2 right-2 text-[9px] font-mono font-semibold rounded-full px-2 py-0.5"
        style={{ background: 'rgba(245,166,35,0.85)', backdropFilter: 'blur(8px)', color: '#000' }}
      >
        OUTLIER ↑
      </span>
    )
  }
  const highDemand = video.views > 0 && (video.comments / video.views) > 0.003
  if (highDemand) {
    return (
      <span
        className="absolute top-2 right-2 text-[9px] font-mono font-semibold rounded-full px-2 py-0.5"
        style={{ background: 'rgba(0,212,161,0.85)', backdropFilter: 'blur(8px)', color: '#000' }}
      >
        HIGH DEMAND
      </span>
    )
  }
  if (video.isShort) {
    return (
      <span
        className="absolute top-2 right-2 text-[9px] font-mono font-semibold rounded-full px-2 py-0.5"
        style={{ background: 'rgba(61,110,255,0.85)', backdropFilter: 'blur(8px)', color: '#fff' }}
      >
        SHORT
      </span>
    )
  }
  return null
}

export function VideoCard({ video }: VideoCardProps) {
  function handleClick() {
    window.open(`https://youtube.com/watch?v=${video.id}`, '_blank', 'noopener,noreferrer')
  }

  return (
    <article
      className="group flex flex-col overflow-hidden rounded-card cursor-pointer transition-all duration-200"
      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && handleClick()}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'
        e.currentTarget.style.transform = 'translateY(-2px)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'
        e.currentTarget.style.transform = 'translateY(0)'
      }}
    >
      {/* Thumbnail — 16:9 */}
      <div className="relative w-full overflow-hidden" style={{ paddingBottom: '56.25%', background: 'rgba(255,255,255,0.05)' }}>
        {video.thumbnail ? (
          <Image
            src={video.thumbnail}
            alt={video.title}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <svg width="36" height="24" viewBox="0 0 36 24" fill="none" aria-hidden="true">
              <rect width="36" height="24" rx="3" fill="rgba(255,255,255,0.04)" />
              <path d="M14 8L24 12L14 16V8Z" fill="rgba(255,255,255,0.15)" />
            </svg>
          </div>
        )}

        {/* Duration pill */}
        <div className="absolute bottom-2 left-2 rounded px-1.5 py-0.5" style={{ background: 'rgba(0,0,0,0.75)' }}>
          <span className="font-mono text-white" style={{ fontSize: '11px' }}>{formatDuration(video.duration)}</span>
        </div>

        <StatusBadge video={video} />
      </div>

      {/* Card body */}
      <div className="p-5 flex flex-col gap-4">
        {/* Title */}
        <h3 className="text-text-primary line-clamp-2" style={{ fontSize: '14px', fontWeight: 500, lineHeight: 1.5 }}>
          {video.title}
        </h3>

        {/* Stats row */}
        <div className="flex items-center justify-between font-mono" style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>
          <span className="flex items-center gap-1">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path d="M1 6C1 6 2.5 2.5 6 2.5C9.5 2.5 11 6 11 6C11 6 9.5 9.5 6 9.5C2.5 9.5 1 6 1 6Z" stroke="currentColor" strokeWidth="1" strokeLinejoin="round" />
              <circle cx="6" cy="6" r="1.5" fill="currentColor" />
            </svg>
            {formatViews(video.views)}
          </span>
          <span className="flex items-center gap-1">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path d="M6 10C6 10 1.5 7 1.5 4.2C1.5 2.9 2.5 2 3.5 2C4.5 2 5.5 2.8 6 3.8C6.5 2.8 7.5 2 8.5 2C9.5 2 10.5 2.9 10.5 4.2C10.5 7 6 10 6 10Z" stroke="currentColor" strokeWidth="1" strokeLinejoin="round" />
            </svg>
            {formatViews(video.likes)}
          </span>
          <span className="flex items-center gap-1">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path d="M1.5 2.5H10.5C10.8 2.5 11 2.7 11 3V7.5C11 7.8 10.8 8 10.5 8H4L2 10V8H1.5C1.2 8 1 7.8 1 7.5V3C1 2.7 1.2 2.5 1.5 2.5Z" stroke="currentColor" strokeWidth="1" strokeLinejoin="round" />
            </svg>
            {formatViews(video.comments)}
          </span>
          <span className="flex items-center gap-1">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1" />
              <path d="M6 3.5V6L7.5 7.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
            </svg>
            {relativeTime(video.publishedAt)}
          </span>
        </div>

        {/* Divider */}
        <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)' }} />

        {/* Score bars */}
        <div className="flex flex-col gap-3">
          {/* Outlier Score */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-text-tertiary" style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                Outlier Score
              </span>
              <span className="font-mono text-text-secondary" style={{ fontSize: '11px' }}>
                {video.outlierScore.toFixed(1)}×
              </span>
            </div>
            <div className="vm-bar-track">
              <div className="vm-bar-fill" style={{ width: `${Math.min(100, (video.outlierScore / 10) * 100)}%` }} />
            </div>
          </div>

          {/* Curiosity Gap */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-text-tertiary" style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                Curiosity Gap
              </span>
              <span className="font-mono text-text-secondary" style={{ fontSize: '11px', opacity: 0.7 }}>
                {video.curiosityGapScore}/100
              </span>
            </div>
            <div className="vm-bar-track">
              <div className="vm-bar-fill" style={{ width: `${video.curiosityGapScore}%`, opacity: 0.55 }} />
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}
