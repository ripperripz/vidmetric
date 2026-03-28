'use client'

import { useState, useEffect } from 'react'
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

function downloadJson(data: unknown, filename: string) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url; a.download = filename; a.click()
  URL.revokeObjectURL(url)
}

function downloadCsv(channels: SavedChannel[], filename: string) {
  const header = 'Channel Name,Handle,URL,Saved At'
  const rows = channels.map((c) =>
    [c.channelName, c.channelHandle, c.url, c.savedAt].map((v) => `"${v}"`).join(',')
  )
  const csv = [header, ...rows].join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url; a.download = filename; a.click()
  URL.revokeObjectURL(url)
}

export default function ReportsPage() {
  const [saved, setSaved] = useState<SavedChannel[]>([])
  const [loaded, setLoaded] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  useEffect(() => {
    try {
      const data = localStorage.getItem('vexel_saved')
      if (data) setSaved(JSON.parse(data) as SavedChannel[])
    } catch { /* ignore */ }
    setLoaded(true)
  }, [])

  function showToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(null), 2500)
  }

  function handleExportCsv() {
    downloadCsv(saved, 'vexel-channels.csv')
    showToast('CSV exported')
  }

  function handleExportJson() {
    downloadJson(saved, 'vexel-channels.json')
    showToast('JSON exported')
  }

  return (
    <div className="flex min-h-screen" style={{ background: '#000000' }}>
      <AppSidebar active="Reports" />

      <div className="flex-1 ml-0 md:ml-[220px] flex flex-col min-h-screen">

        {/* Topbar */}
        <header
          className="sticky top-0 z-30 h-16 flex items-center justify-between pl-14 pr-4 md:px-10"
          style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(24px)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}
        >
          <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.2em', color: 'rgba(255,255,255,0.3)', fontWeight: 600 }}>
            Reports
          </span>
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={handleExportCsv}
              disabled={saved.length === 0}
              className="hidden sm:block"
              style={{
                fontSize: '12px',
                padding: '7px 16px',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '999px',
                color: saved.length === 0 ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.6)',
                cursor: saved.length === 0 ? 'not-allowed' : 'pointer',
                fontFamily: 'monospace',
                transition: 'all 150ms',
              }}
              onMouseEnter={(e) => { if (saved.length > 0) { e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)' } }}
              onMouseLeave={(e) => { e.currentTarget.style.color = saved.length === 0 ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.6)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)' }}
            >
              Export CSV
            </button>
            <button
              type="button"
              onClick={handleExportJson}
              disabled={saved.length === 0}
              className="btn-primary"
              style={{ padding: '8px 18px', fontSize: '12px', opacity: saved.length === 0 ? 0.4 : 1 }}
            >
              Export JSON
              <span className="arrow-circle">↗</span>
            </button>
          </div>
        </header>

        <main className="px-4 md:px-10 py-6 md:py-12" style={{ flex: 1 }}>

          {/* Header */}
          <div style={{ marginBottom: '40px' }}>
            <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#fff', letterSpacing: '-0.02em' }}>Export Reports</h1>
            <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.35)', marginTop: '6px' }}>
              Export your saved channel data for external analysis or client reports.
            </p>
          </div>

          {/* Export format cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
            {[
              {
                format: 'CSV',
                desc: 'Spreadsheet-ready. Compatible with Excel, Google Sheets, and Tableau.',
                icon: (
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                    <rect x="2" y="2" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="1.3" />
                    <path d="M2 7H18M2 12H18M7 7V18" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                  </svg>
                ),
                action: handleExportCsv,
              },
              {
                format: 'JSON',
                desc: 'Full structured data. Use with custom dashboards and APIs.',
                icon: (
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                    <path d="M6 4C4.5 4 4 5 4 6V9C4 10 3 10.5 2.5 11C3 11.5 4 12 4 13V16C4 17 4.5 18 6 18" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                    <path d="M14 4C15.5 4 16 5 16 6V9C16 10 17 10.5 17.5 11C17 11.5 16 12 16 13V16C16 17 15.5 18 14 18" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                    <circle cx="10" cy="11" r="1.5" fill="currentColor" />
                  </svg>
                ),
                action: handleExportJson,
              },
              {
                format: 'PDF',
                desc: 'Print-ready report. Go to an analysis page and use Export Report.',
                icon: (
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                    <path d="M5 2H13L17 6V18H5V2Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
                    <path d="M13 2V6H17" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                    <path d="M8 10H12M8 13H12M8 7H10" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                  </svg>
                ),
                action: null,
              },
            ].map(({ format, desc, icon, action }) => (
              <div
                key={format}
                className="rounded-xl p-6 flex flex-col gap-4"
                style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}
              >
                <div className="flex items-center justify-between">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.5)' }}
                  >
                    {icon}
                  </div>
                  <span className="font-mono" style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.25)' }}>
                    .{format.toLowerCase()}
                  </span>
                </div>
                <div>
                  <p style={{ fontSize: '15px', fontWeight: 600, color: '#fff', marginBottom: '4px' }}>{format}</p>
                  <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)', lineHeight: 1.6 }}>{desc}</p>
                </div>
                {action ? (
                  <button
                    type="button"
                    onClick={action}
                    disabled={saved.length === 0}
                    style={{
                      marginTop: 'auto',
                      padding: '9px 18px',
                      background: 'rgba(255,255,255,0.06)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '8px',
                      color: saved.length === 0 ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.7)',
                      fontSize: '12px',
                      fontWeight: 500,
                      cursor: saved.length === 0 ? 'not-allowed' : 'pointer',
                      transition: 'all 150ms',
                    }}
                    onMouseEnter={(e) => { if (saved.length > 0) { e.currentTarget.style.color = '#fff'; e.currentTarget.style.background = 'rgba(255,255,255,0.1)' } }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = saved.length === 0 ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.7)'; e.currentTarget.style.background = 'rgba(255,255,255,0.06)' }}
                  >
                    Export {format}
                  </button>
                ) : (
                  <a
                    href="/analysis"
                    style={{
                      marginTop: 'auto',
                      padding: '9px 18px',
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.07)',
                      borderRadius: '8px',
                      color: 'rgba(255,255,255,0.3)',
                      fontSize: '12px',
                      fontWeight: 500,
                      cursor: 'pointer',
                      textDecoration: 'none',
                      display: 'block',
                      textAlign: 'center',
                      transition: 'all 150ms',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.6)'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)' }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.3)'; e.currentTarget.style.background = 'rgba(255,255,255,0.03)' }}
                  >
                    Open Analysis →
                  </a>
                )}
              </div>
            ))}
          </div>

          {/* Channel data preview */}
          <div>
            <div className="flex items-center justify-between mb-5">
              <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#fff' }}>
                Saved Channels{' '}
                <span className="font-mono" style={{ fontSize: '13px', color: 'rgba(255,255,255,0.3)' }}>
                  ({saved.length})
                </span>
              </h2>
              <a
                href="/saved"
                style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)', textDecoration: 'none' }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#fff'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.35)'}
              >
                Manage →
              </a>
            </div>

            {!loaded ? null : saved.length === 0 ? (
              <div
                className="rounded-xl flex flex-col items-center justify-center text-center"
                style={{ padding: '56px 40px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}
              >
                <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.3)', marginBottom: '16px' }}>
                  No saved channels. Analyze a channel and save it to export here.
                </p>
                <a
                  href="/analyze"
                  className="btn-primary"
                  style={{ padding: '10px 22px', fontSize: '13px' }}
                >
                  Analyze a channel
                  <span className="arrow-circle">↗</span>
                </a>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {saved.map((ch) => (
                  <div
                    key={ch.channelId}
                    className="rounded-xl p-4 flex flex-col gap-3"
                    style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}
                  >
                    {/* Top row: avatar + name + saved time */}
                    <div className="flex items-center gap-3">
                      <div
                        className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
                      >
                        <span className="font-mono" style={{ fontSize: '11px', fontWeight: 600, color: 'rgba(255,255,255,0.5)' }}>
                          {getInitials(ch.channelName)}
                        </span>
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: '14px', fontWeight: 600, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {ch.channelName}
                        </p>
                        <p className="font-mono" style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginTop: '1px' }}>
                          {ch.channelHandle}
                        </p>
                      </div>
                      <span className="font-mono flex-shrink-0" style={{ fontSize: '11px', color: 'rgba(255,255,255,0.25)' }}>
                        {relativeTime(ch.savedAt)}
                      </span>
                    </div>
                    {/* URL row */}
                    {ch.url && (
                      <p className="font-mono" style={{ fontSize: '11px', color: 'rgba(255,255,255,0.2)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', paddingLeft: '0' }}>
                        {ch.url}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Toast */}
      {toast && (
        <div
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3"
          style={{ background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '12px', color: '#fff', fontSize: '13px' }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ color: '#2DD4A7', flexShrink: 0 }}>
            <path d="M2 7L5.5 10.5L12 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {toast}
        </div>
      )}
    </div>
  )
}
