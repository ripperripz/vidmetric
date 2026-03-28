'use client'

import { useMemo } from 'react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from 'recharts'
import type { Video } from '@/src/types'
import { formatViews, relativeTime } from '@/src/lib/utils'

export interface PerformanceChartProps {
  videos: Video[]
}

// ── Views Over Time ─────────────────────────────────────────────────────
export function ViewsOverTimeChart({ videos }: PerformanceChartProps) {
  const data = useMemo(() => {
    return [...videos]
      .sort((a, b) => new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime())
      .slice(-20)
      .map((v) => ({
        name: relativeTime(v.publishedAt),
        views: v.views,
        title: v.title.length > 40 ? v.title.slice(0, 40) + '...' : v.title,
      }))
  }, [videos])

  return (
    <div
      className="w-full rounded-xl p-5 sm:p-6"
      style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}
    >
      <div className="flex items-center justify-between mb-5">
        <div>
          <p style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.3)' }}>
            View Performance
          </p>
          <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', marginTop: '4px' }}>
            Last {data.length} videos · chronological
          </p>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={260}>
        <AreaChart data={data} margin={{ top: 5, right: 5, left: -15, bottom: 0 }}>
          <defs>
            <linearGradient id="viewGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#4F7EFF" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#4F7EFF" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
          <XAxis
            dataKey="name"
            stroke="rgba(255,255,255,0.15)"
            fontSize={10}
            tick={{ fill: 'rgba(255,255,255,0.3)' }}
            tickLine={false}
            axisLine={false}
            interval="preserveStartEnd"
          />
          <YAxis
            stroke="rgba(255,255,255,0.15)"
            fontSize={10}
            tick={{ fill: 'rgba(255,255,255,0.3)' }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v: number) => formatViews(v)}
          />
          <Tooltip
            contentStyle={{
              background: 'rgba(10,10,18,0.95)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: 8,
              color: '#fff',
              fontSize: 12,
              backdropFilter: 'blur(12px)',
            }}
            formatter={(v) => [formatViews(Number(v)), 'Views']}
            labelFormatter={(_label, payload) => {
              if (payload?.[0]?.payload?.title) return payload[0].payload.title as string
              return String(_label)
            }}
          />
          <Area
            type="monotone"
            dataKey="views"
            stroke="#4F7EFF"
            strokeWidth={2}
            fill="url(#viewGrad)"
            dot={{ r: 3, fill: '#4F7EFF', stroke: 'rgba(0,0,0,0.5)', strokeWidth: 1 }}
            activeDot={{ r: 5, fill: '#fff', stroke: '#4F7EFF', strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

// ── Outlier Score Distribution ───────────────────────────────────────────
export function OutlierDistributionChart({ videos }: PerformanceChartProps) {
  const data = useMemo(() => {
    return [...videos]
      .sort((a, b) => b.outlierScore - a.outlierScore)
      .slice(0, 15)
      .map((v) => ({
        name: v.title.length > 25 ? v.title.slice(0, 25) + '...' : v.title,
        score: parseFloat(v.outlierScore.toFixed(1)),
        fullTitle: v.title,
      }))
  }, [videos])

  return (
    <div
      className="w-full rounded-xl p-5 sm:p-6"
      style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}
    >
      <div className="flex items-center justify-between mb-5">
        <div>
          <p style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.3)' }}>
            Outlier Distribution
          </p>
          <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', marginTop: '4px' }}>
            Top 15 videos by outlier score
          </p>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} layout="vertical" margin={{ top: 0, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" horizontal={false} />
          <XAxis
            type="number"
            stroke="rgba(255,255,255,0.15)"
            fontSize={10}
            tick={{ fill: 'rgba(255,255,255,0.3)' }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v: number) => `${v}×`}
          />
          <YAxis
            type="category"
            dataKey="name"
            width={140}
            stroke="rgba(255,255,255,0.15)"
            fontSize={10}
            tick={{ fill: 'rgba(255,255,255,0.4)' }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            contentStyle={{
              background: 'rgba(10,10,18,0.95)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: 8,
              color: '#fff',
              fontSize: 12,
            }}
            formatter={(v) => [`${v}×`, 'Outlier Score']}
            labelFormatter={(_l, payload) => {
              if (payload?.[0]?.payload?.fullTitle) return payload[0].payload.fullTitle as string
              return String(_l)
            }}
          />
          <Bar dataKey="score" radius={[0, 4, 4, 0]} maxBarSize={20}>
            {data.map((entry, i) => (
              <Cell
                key={i}
                fill={i < 3 ? '#F5A623' : '#4F7EFF'}
                fillOpacity={i < 3 ? 0.8 : 0.4 + (1 - i / data.length) * 0.3}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
