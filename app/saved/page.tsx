'use client'

import { useState, useEffect } from 'react'
import { AppSidebar } from '@/src/components/AppSidebar'

interface SavedChannel {
  channelId: string
  channelName: string
  channelHandle: string
  url: string
  savedAt: string
  avatar: string
}

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const days = Math.floor(diff / 86_400_000)
  const weeks = Math.floor(days / 7)
  const months = Math.floor(days / 30)
  if (months >= 1) return `${months} ${months === 1 ? 'month' : 'months'} ago`
  if (weeks >= 1)  return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`
  if (days >= 1)   return `${days} ${days === 1 ? 'day' : 'days'} ago`
  return 'Today'
}

function getInitials(name: string): string {
  return name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
}

export default function SavedPage() {
  const [saved, setSaved] = useState<SavedChannel[]>([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    try {
      const data = localStorage.getItem('vexel_saved')
      if (data) setSaved(JSON.parse(data) as SavedChannel[])
    } catch { /* ignore */ }
    setLoaded(true)
  }, [])

  function handleRemove(channelId: string) {
    const updated = saved.filter((c) => c.channelId !== channelId)
    setSaved(updated)
    localStorage.setItem('vexel_saved', JSON.stringify(updated))
  }

  return (
    <div className="flex min-h-screen" style={{ background: '#000000' }}>
      <AppSidebar active="Saved" />


      <div className="flex-1 ml-0 md:ml-[220px] flex flex-col min-h-screen">

        {/* Topbar */}
        <header
          className="sticky top-0 z-30 h-16 flex items-center justify-between pl-14 pr-4 md:px-10"
          style={{ background: 'rgba(5,5,8,0.8)', backdropFilter: 'blur(24px)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}
        >
          <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.2em', color: 'rgba(255,255,255,0.3)', fontWeight: 600 }}>
            Saved Analyses
          </span>
          <a
            href="/analyze"
            style={{ fontSize: '12px', fontFamily: 'monospace', color: 'rgba(255,255,255,0.25)', textDecoration: 'none' }}
            onMouseEnter={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.25)'}
          >
            ← New Analysis
          </a>
        </header>

        <main className="px-4 md:px-10 py-6 md:py-12" style={{ flex: 1 }}>

          {/* Page header */}
          <div style={{ marginBottom: '40px' }}>
            <h1 style={{ fontSize: '28px', fontWeight: 600, color: '#fff', letterSpacing: '-0.02em' }}>Saved Channels</h1>
            <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.35)', marginTop: '6px' }}>
              <span style={{ fontFamily: 'monospace' }}>{saved.length}</span> channel{saved.length !== 1 ? 's' : ''} in your workspace
            </p>
          </div>

          {loaded && saved.length === 0 ? (
            /* Empty state */
            <div
              className="flex flex-col items-center justify-center text-center rounded-card"
              style={{ padding: '80px 40px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}
            >
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center mb-6"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true" style={{ color: 'rgba(255,255,255,0.2)' }}>
                  <path d="M5 3H19C19.9 3 20.5 3.6 20.5 4.5V21L12 17.25L3.5 21V4.5C3.5 3.6 4.1 3 5 3Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" fill="none" />
                </svg>
              </div>
              <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#fff', marginBottom: '8px' }}>No saved analyses yet</h2>
              <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.35)', marginBottom: '28px', maxWidth: '320px', lineHeight: 1.6 }}>
                Analyze a channel and click Save to add it here for quick access.
              </p>
              <a
                href="/analyze"
                className="btn-primary"
                style={{ fontSize: '13px', padding: '10px 22px', textDecoration: 'none' }}
              >
                Analyze a channel
                <span className="arrow-circle">↗</span>
              </a>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {saved.map((channel) => (
                <div
                  key={channel.channelId}
                  className="flex flex-col gap-5 rounded-card p-6 transition-all duration-200"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.14)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; e.currentTarget.style.transform = 'translateY(0)' }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)' }}
                      >
                        <span style={{ fontSize: '13px', fontFamily: 'monospace', color: '#888899', fontWeight: 600 }}>
                          {getInitials(channel.channelName)}
                        </span>
                      </div>
                      <div>
                        <p style={{ fontSize: '14px', fontWeight: 600, color: '#fff', lineHeight: 1.2 }}>{channel.channelName}</p>
                        <p style={{ fontSize: '12px', fontFamily: 'monospace', color: 'rgba(255,255,255,0.3)', marginTop: '2px' }}>{channel.channelHandle}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemove(channel.channelId)}
                      className="transition-colors duration-150 flex-shrink-0"
                      style={{ color: 'rgba(255,255,255,0.2)', background: 'none', border: 'none', cursor: 'pointer', padding: '2px' }}
                      aria-label={`Remove ${channel.channelName}`}
                      onMouseEnter={(e) => e.currentTarget.style.color = '#FF4D6A'}
                      onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.2)'}
                    >
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                        <path d="M4 4L12 12M12 4L4 12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                      </svg>
                    </button>
                  </div>

                  <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)' }} />

                  <div className="flex items-center justify-between">
                    <span style={{ fontSize: '11px', fontFamily: 'monospace', color: 'rgba(255,255,255,0.25)' }}>
                      {relativeTime(channel.savedAt)}
                    </span>
                    <a
                      href={channel.url ? `/analysis?url=${encodeURIComponent(channel.url)}` : '/analysis'}
                      style={{ fontSize: '12px', fontFamily: 'monospace', color: 'rgba(255,255,255,0.5)', textDecoration: 'none', transition: 'color 150ms' }}
                      onMouseEnter={(e) => e.currentTarget.style.color = '#fff'}
                      onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.5)'}
                    >
                      Analyze again →
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
