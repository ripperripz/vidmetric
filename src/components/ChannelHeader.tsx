'use client'

import type { Channel } from '@/src/types'
import { formatViews, formatSubscribers } from '@/src/lib/utils'

export interface ChannelHeaderProps {
  channel: Channel
  postingCadence: string
}

export function ChannelHeader({ channel, postingCadence }: ChannelHeaderProps) {
  const initials = channel.name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  const stats = [
    { label: 'Avg Views',    value: formatViews(channel.avgViews),           mono: true },
    { label: 'Posts',        value: postingCadence,                          mono: false },
    { label: 'Engagement',   value: `${channel.engagementRate}%`,             mono: true },
    { label: 'Subscribers',  value: formatSubscribers(channel.subscribers),   mono: true },
  ]

  return (
    <div
      className="w-full rounded-xl p-8 flex flex-col md:flex-row md:items-center gap-8"
      style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}
    >
      {/* Avatar + identity */}
      <div className="flex items-center gap-5 flex-shrink-0">
        <div
          className="w-[72px] h-[72px] rounded-full overflow-hidden flex items-center justify-center flex-shrink-0"
          style={{ background: 'rgba(255,255,255,0.04)', border: '2px solid rgba(255,255,255,0.1)' }}
        >
          {channel.avatar ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={channel.avatar} alt={`${channel.name} avatar`} className="w-full h-full object-cover" />
          ) : (
            <span className="font-mono" style={{ fontSize: '20px', fontWeight: 700, color: 'rgba(255,255,255,0.25)' }}>
              {initials}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <h2 className="text-text-primary" style={{ fontSize: '26px', fontWeight: 700, letterSpacing: '-0.025em', lineHeight: 1 }}>
            {channel.name}
          </h2>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-text-secondary font-mono" style={{ fontSize: '13px' }}>
              {channel.handle}
            </span>
            <span style={{ width: '3px', height: '3px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'inline-block' }} />
            <span className="text-text-tertiary" style={{ fontSize: '13px' }}>
              {formatSubscribers(channel.subscribers)} subscribers
            </span>
          </div>
          {/* YouTube badge */}
          <div className="flex items-center gap-1.5 mt-0.5">
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#FF0000', display: 'inline-block' }} />
            <span className="text-text-tertiary" style={{ fontSize: '11px' }}>YouTube</span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-6 md:pl-8 md:border-l md:border-[rgba(255,255,255,0.06)]">
        {stats.map((stat) => (
          <div key={stat.label} className="flex flex-col gap-1">
            <span className="text-text-tertiary" style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.15em' }}>
              {stat.label}
            </span>
            <span className="text-text-primary font-mono" style={{ fontSize: '22px', fontWeight: 700, letterSpacing: '-0.02em' }}>
              {stat.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
