'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { AppSidebar } from '@/src/components/AppSidebar'

interface SavedChannel {
  channelId: string
  channelName: string
  channelHandle: string
  url: string
  savedAt: string
}

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const days = Math.floor(diff / 86_400_000)
  const weeks = Math.floor(days / 7)
  const months = Math.floor(days / 30)
  if (months >= 1) return `${months}mo ago`
  if (weeks >= 1) return `${weeks}w ago`
  if (days >= 1) return `${days}d ago`
  return 'Today'
}

function getInitials(name: string): string {
  return name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
}

const QUICK_STATS = [
  { label: 'Channels Analyzed', value: '14', delta: '+3 this week' },
  { label: 'Outliers Detected', value: '47', delta: '+12 vs last month' },
  { label: 'Reports Exported', value: '7', delta: 'This month' },
  { label: 'API Quota Used', value: '2%', delta: '201 / 10,000 units' },
]

export default function DashboardPage() {
  const router = useRouter()
  const [url, setUrl] = useState('')
  const [saved, setSaved] = useState<SavedChannel[]>([])
  const [hour] = useState(() => new Date().getHours())

  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  useEffect(() => {
    try {
      const data = localStorage.getItem('vexel_saved')
      if (data) setSaved((JSON.parse(data) as SavedChannel[]).slice(0, 4))
    } catch { /* ignore */ }
  }, [])

  function handleAnalyze(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = url.trim()
    if (!trimmed) return
    router.push(`/analysis?url=${encodeURIComponent(trimmed)}`)
  }

  return (
    <div className="flex min-h-screen" style={{ background: '#000000' }}>
      <AppSidebar active="Home" />

      <div className="flex-1 ml-0 md:ml-[220px] flex flex-col min-h-screen">

        {/* Topbar */}
        <header
          className="sticky top-0 z-30 h-16 flex items-center justify-between pl-14 pr-4 md:px-10"
          style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(24px)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}
        >
          <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.2em', color: 'rgba(255,255,255,0.3)', fontWeight: 600 }}>
            Dashboard
          </span>
          <a
            href="/analyze"
            className="btn-primary"
            style={{ padding: '8px 18px', fontSize: '12px' }}
          >
            New Analysis
            <span className="arrow-circle">↗</span>
          </a>
        </header>

        <main className="px-4 md:px-10 py-6 md:py-12" style={{ flex: 1 }}>

          {/* Greeting */}
          <div style={{ marginBottom: '40px' }}>
            <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#fff', letterSpacing: '-0.02em' }}>
              {greeting}.
            </h1>
            <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.35)', marginTop: '6px' }}>
              Your intelligence workspace is ready.
            </p>
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4" style={{ marginBottom: '48px' }}>
            {QUICK_STATS.map(({ label, value, delta }, i) => (
              <div
                key={label}
                className="vm-accent-bar rounded-xl p-5 flex flex-col gap-2 transition-all duration-200"
                style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; e.currentTarget.style.transform = 'translateY(0)' }}
              >
                <span style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.3)' }}>
                  {label}
                </span>
                <span className="font-mono" style={{ fontSize: '28px', fontWeight: 700, color: '#fff', letterSpacing: '-0.02em', lineHeight: 1 }}>
                  {value}
                </span>
                <span className="font-mono" style={{ fontSize: '11px', color: i === 0 ? 'rgba(45,212,167,0.7)' : 'rgba(255,255,255,0.25)' }}>
                  {delta}
                </span>
              </div>
            ))}
          </div>

          {/* Quick start */}
          <div
            className="rounded-xl p-8 mb-12"
            style={{ background: 'rgba(61,110,255,0.04)', border: '1px solid rgba(61,110,255,0.12)' }}
          >
            <p style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'rgba(61,110,255,0.7)', marginBottom: '12px', fontWeight: 600 }}>
              Quick Analysis
            </p>
            <h2 style={{ fontSize: '20px', fontWeight: 600, color: '#fff', marginBottom: '20px', letterSpacing: '-0.01em' }}>
              Analyze a YouTube channel
            </h2>
            <form onSubmit={handleAnalyze} className="flex flex-col sm:flex-row gap-3">
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://youtube.com/@channel or channel URL"
                style={{
                  flex: 1,
                  height: '48px',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '10px',
                  padding: '0 18px',
                  color: '#fff',
                  fontSize: '16px',
                  outline: 'none',
                  fontFamily: 'monospace',
                  transition: 'border-color 150ms',
                  minWidth: 0,
                }}
                onFocus={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)'}
                onBlur={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'}
              />
              <button
                type="submit"
                className="btn-primary"
                style={{ padding: '0 24px', height: '48px', fontSize: '13px', borderRadius: '10px', flexShrink: 0 }}
              >
                Analyze
                <span className="arrow-circle">↗</span>
              </button>
            </form>
          </div>

          {/* Recent analyses */}
          <div>
            <div className="flex items-center justify-between mb-5">
              <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#fff', letterSpacing: '-0.01em' }}>
                Recent Analyses
              </h2>
              <a
                href="/saved"
                style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)', textDecoration: 'none', transition: 'color 150ms' }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#fff'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.35)'}
              >
                View all →
              </a>
            </div>

            {saved.length === 0 ? (
              <div
                className="rounded-xl flex flex-col items-center justify-center text-center"
                style={{ padding: '64px 40px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                >
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true" style={{ color: 'rgba(255,255,255,0.2)' }}>
                    <path d="M10 2L13 7H18L14 11L15.5 16L10 13L4.5 16L6 11L2 7H7L10 2Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
                  </svg>
                </div>
                <p style={{ fontSize: '15px', fontWeight: 500, color: '#fff', marginBottom: '6px' }}>No analyses yet</p>
                <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.3)', marginBottom: '20px' }}>
                  Analyze your first channel to see it here.
                </p>
                <a
                  href="/analyze"
                  className="btn-primary"
                  style={{ padding: '10px 22px', fontSize: '13px' }}
                >
                  Start analyzing
                  <span className="arrow-circle">↗</span>
                </a>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {saved.map((ch) => (
                  <a
                    key={ch.channelId}
                    href={ch.url ? `/analysis?url=${encodeURIComponent(ch.url)}` : '/analysis'}
                    className="flex items-center gap-4 rounded-xl p-5 no-underline transition-all duration-200"
                    style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; e.currentTarget.style.transform = 'translateY(0)' }}
                  >
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
                    >
                      <span className="font-mono" style={{ fontSize: '12px', fontWeight: 700, color: 'rgba(255,255,255,0.5)' }}>
                        {getInitials(ch.channelName)}
                      </span>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: '14px', fontWeight: 600, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ch.channelName}</p>
                      <p className="font-mono" style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', marginTop: '2px' }}>{ch.channelHandle}</p>
                    </div>
                    <span className="font-mono" style={{ fontSize: '11px', color: 'rgba(255,255,255,0.25)', flexShrink: 0 }}>
                      {relativeTime(ch.savedAt)}
                    </span>
                  </a>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
