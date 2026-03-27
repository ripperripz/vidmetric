'use client'

import { useState, useRef, useCallback } from 'react'
import type { AnalysisResult } from '@/src/types'
import { formatViews } from '@/src/lib/utils'
import { AppSidebar } from '@/src/components/AppSidebar'

export interface ExportPageClientProps {
  result: AnalysisResult
  sourceUrl: string
  errorBanner?: string
}

type FormatType = 'pdf' | 'csv' | 'json'

const PDF_ICON = (
  <svg width="16" height="16" viewBox="0 0 18 18" fill="none" aria-hidden="true">
    <rect x="2" y="1" width="11" height="15" rx="2" stroke="currentColor" strokeWidth="1.2" />
    <path d="M13 1L16 4.5V16H13" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
    <path d="M5 7H10M5 9.5H10M5 12H8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
  </svg>
)

const CSV_ICON = (
  <svg width="16" height="16" viewBox="0 0 18 18" fill="none" aria-hidden="true">
    <rect x="1.5" y="3" width="15" height="12" rx="2" stroke="currentColor" strokeWidth="1.2" />
    <path d="M1.5 7H16.5M6 3V15" stroke="currentColor" strokeWidth="1.2" />
  </svg>
)

const JSON_ICON = (
  <svg width="16" height="16" viewBox="0 0 18 18" fill="none" aria-hidden="true">
    <path d="M7 3C5.5 3 4.5 3.9 4.5 5V13C4.5 14.1 5.5 15 7 15" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    <path d="M11 3C12.5 3 13.5 3.9 13.5 5V13C13.5 14.1 12.5 15 11 15" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    <circle cx="9" cy="9" r="1" fill="currentColor" />
  </svg>
)

const DEFAULT_SECTIONS: Record<string, boolean> = {
  'Intelligence Brief': true,
  'Video Grid': true,
  'Format Graveyard': true,
  'Cadence Heatmap': true,
  'Raw Data Tables': false,
}

function Toggle({ enabled, onToggle }: { enabled: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      style={{
        width: '36px',
        height: '20px',
        borderRadius: '999px',
        border: 'none',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        flexShrink: 0,
        padding: '0',
        background: enabled ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.1)',
        transition: 'background 200ms',
      }}
      aria-checked={enabled}
      role="switch"
    >
      <div
        style={{
          width: '14px',
          height: '14px',
          borderRadius: '999px',
          background: '#fff',
          transition: 'transform 200ms',
          transform: enabled ? 'translateX(18px)' : 'translateX(3px)',
          flexShrink: 0,
        }}
      />
    </button>
  )
}

function FormatButton({
  label,
  icon,
  active = false,
  badge,
  onClick,
}: {
  label: string
  icon: React.ReactNode
  active?: boolean
  badge?: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '12px 14px',
        borderRadius: '10px',
        border: active ? '1px solid rgba(255,255,255,0.2)' : '1px solid rgba(255,255,255,0.07)',
        background: active ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.02)',
        cursor: 'pointer',
        textAlign: 'left',
        transition: 'all 150ms',
        color: active ? '#fff' : 'rgba(255,255,255,0.45)',
      }}
      onMouseEnter={(e) => {
        if (!active) {
          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.14)'
          e.currentTarget.style.color = 'rgba(255,255,255,0.7)'
        }
      }}
      onMouseLeave={(e) => {
        if (!active) {
          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'
          e.currentTarget.style.color = 'rgba(255,255,255,0.45)'
        }
      }}
    >
      <span style={{ flexShrink: 0, opacity: active ? 1 : 0.6 }}>{icon}</span>
      <span style={{ fontSize: '13px', fontWeight: 500, flex: 1 }}>{label}</span>
      {badge && (
        <span style={{ fontSize: '9px', fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.4)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '999px', padding: '2px 7px' }}>
          {badge}
        </span>
      )}
      {active && (
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <circle cx="8" cy="8" r="7" stroke="rgba(255,255,255,0.3)" />
          <path d="M5 8L7 10L11 6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </button>
  )
}

export default function ExportPageClient({ result, sourceUrl, errorBanner }: ExportPageClientProps) {
  const [format, setFormat] = useState<FormatType>('pdf')
  const [sections, setSections] = useState<Record<string, boolean>>(DEFAULT_SECTIONS)
  const [logoUrl, setLogoUrl] = useState<string | null>(null)
  const [whiteLabel, setWhiteLabel] = useState(false)
  const [copied, setCopied] = useState(false)
  const [scheduleEmail, setScheduleEmail] = useState('')
  const [toastMsg, setToastMsg] = useState<string | null>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)

  const showToast = useCallback((msg: string) => {
    setToastMsg(msg)
    setTimeout(() => setToastMsg(null), 2500)
  }, [])

  function handleLogoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      if (typeof ev.target?.result === 'string') {
        setLogoUrl(ev.target.result)
      }
    }
    reader.readAsDataURL(file)
  }

  function handleGeneratePDF() {
    const style = document.createElement('style')
    style.id = 'vm-print-style'
    style.textContent = `
      @media print {
        body > div > *:not(#vm-report-wrapper) { display: none !important; }
        #vm-report-wrapper { display: block !important; position: fixed !important; inset: 0 !important; z-index: 99999 !important; overflow: auto !important; background: white !important; padding: 40px !important; }
        .no-print { display: none !important; }
      }
    `
    document.head.appendChild(style)
    window.print()
    setTimeout(() => {
      const existing = document.getElementById('vm-print-style')
      if (existing) existing.remove()
    }, 2000)
  }

  function handleDownloadCSV() {
    const header = 'Title,Views,Likes,Comments,Duration (sec),Published,Outlier Score,Curiosity Gap,Is Short'
    const rows = result.videos.map((v) =>
      [
        `"${v.title.replace(/"/g, '""')}"`,
        v.views,
        v.likes,
        v.comments,
        v.duration,
        v.publishedAt,
        v.outlierScore,
        v.curiosityGapScore,
        v.isShort ? 'true' : 'false',
      ].join(',')
    )
    const csv = [header, ...rows].join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    const date = new Date().toISOString().slice(0, 10)
    a.href = url
    a.download = `${result.channel.name}-vexel-${date}.csv`
    a.click()
    URL.revokeObjectURL(url)
    showToast('CSV downloaded')
  }

  function handleDownloadJSON() {
    const json = JSON.stringify(result, null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    const date = new Date().toISOString().slice(0, 10)
    a.href = url
    a.download = `${result.channel.name}-vexel-${date}.json`
    a.click()
    URL.revokeObjectURL(url)
    showToast('JSON downloaded')
  }

  function handleCopyLink() {
    const handle = result.channel.handle.replace('@', '')
    navigator.clipboard.writeText(`https://vexel.app/r/${handle}`).catch(() => null)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function handleExport() {
    if (format === 'pdf') handleGeneratePDF()
    else if (format === 'csv') handleDownloadCSV()
    else handleDownloadJSON()
  }

  const topVideo = result.videos.reduce((b, v) => (v.views > b.views ? v : b))

  const exportButtonLabel =
    format === 'pdf' ? 'Generate PDF' : format === 'csv' ? 'Download CSV' : 'Download JSON'

  return (
    <div className="flex min-h-screen" style={{ background: '#050508' }}>
      <AppSidebar active="Export" />

      {/* ── Main ──────────────────────────────────────────────────────── */}
      <div className="flex-1 ml-[220px] flex flex-col min-h-screen">

        {/* Topbar */}
        <header
          className="no-print sticky top-0 z-30 h-16 flex items-center justify-between px-10"
          style={{ background: 'rgba(5,5,8,0.8)', backdropFilter: 'blur(24px)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}
        >
          <div className="flex items-center gap-6">
            <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.2em', color: 'rgba(255,255,255,0.3)', fontWeight: 600 }}>
              Export Report
            </span>
            {sourceUrl && (
              <div
                className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
              >
                <span style={{ fontSize: '9px', color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Channel</span>
                <span style={{ fontSize: '11px', fontFamily: 'monospace', color: 'rgba(255,255,255,0.45)', maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {result.channel.name}
                </span>
              </div>
            )}
            <a
              href={sourceUrl ? `/analysis?url=${encodeURIComponent(sourceUrl)}` : '/analysis'}
              style={{ fontSize: '12px', fontFamily: 'monospace', color: 'rgba(255,255,255,0.25)', textDecoration: 'none' }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.25)'}
            >
              ← Analysis
            </a>
          </div>

          <button
            type="button"
            onClick={handleGeneratePDF}
            className="no-print flex items-center gap-2"
            style={{ fontSize: '12px', fontFamily: 'monospace', color: 'rgba(255,255,255,0.35)', background: 'none', border: 'none', cursor: 'pointer', transition: 'color 150ms' }}
            onMouseEnter={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.7)'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.35)'}
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M2 4H14M2 8H14M2 12H10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
            Print
          </button>
        </header>

        {/* Error / demo banner */}
        {errorBanner && (
          <div
            className="no-print flex items-center gap-2 px-10 py-2.5"
            style={{ background: 'rgba(245,166,35,0.05)', borderBottom: '1px solid rgba(245,166,35,0.12)' }}
          >
            <span style={{ fontSize: '12px' }}>⚠</span>
            <p style={{ fontSize: '12px', fontFamily: 'monospace', color: '#F5A623' }}>{errorBanner}</p>
          </div>
        )}

        {/* Two-panel layout */}
        <div className="flex flex-1 overflow-hidden">

          {/* ── Document preview ──────────────────────────────────────── */}
          <div className="flex-1 overflow-y-auto flex justify-center" style={{ padding: '48px 40px', background: 'rgba(255,255,255,0.01)' }}>
            <div
              id="vm-report-wrapper"
              className="w-full max-w-[640px] bg-white rounded-2xl overflow-hidden"
              style={{ boxShadow: '0 40px 80px -20px rgba(0,0,0,0.6)' }}
            >
              {/* Report header */}
              <div style={{ padding: '40px', borderBottom: '1px solid #f0f0f0' }}>
                <div className="flex items-start justify-between" style={{ marginBottom: '24px' }}>
                  <div className="flex items-center gap-3">
                    {whiteLabel ? (
                      logoUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={logoUrl} alt="Agency logo" style={{ height: '32px', objectFit: 'contain' }} />
                      ) : (
                        <span style={{ color: '#1a1a1a', fontWeight: 600, fontSize: '17px' }}>Your Agency</span>
                      )
                    ) : (
                      <>
                        <span style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: '17px', fontWeight: 700, letterSpacing: '3px', color: '#111827', textTransform: 'uppercase' }}>VEXEL</span>
                      </>
                    )}
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontSize: '10px', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Channel Focus</p>
                    <p style={{ fontSize: '16px', color: '#374151', fontStyle: 'italic', marginTop: '2px' }}>{result.channel.name}</p>
                  </div>
                </div>

                <h1 style={{ fontSize: '34px', lineHeight: 1.2, color: '#111827', fontStyle: 'italic', marginBottom: '8px' }}>
                  Competitive Intelligence<br />Report
                </h1>
                <p style={{ fontSize: '13px', color: '#9ca3af' }}>
                  {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </p>
              </div>

              {/* 01. Channel Overview */}
              <div style={{ padding: '32px 40px', borderBottom: '1px solid #f0f0f0' }}>
                <p style={{ fontSize: '10px', fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.15em', color: '#9ca3af', marginBottom: '20px' }}>
                  01. Channel Overview
                </p>
                <div className="grid grid-cols-4 gap-4">
                  {[
                    { label: 'Subscribers', value: formatViews(result.channel.subscribers) },
                    { label: 'Avg. VPV',    value: formatViews(result.channel.avgViews) },
                    { label: 'Growth',      value: '+12%', highlight: true },
                    { label: 'Engagement',  value: `${result.channel.engagementRate}%` },
                  ].map((s) => (
                    <div key={s.label} className="flex flex-col gap-1">
                      <p style={{ fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#9ca3af' }}>{s.label}</p>
                      <p style={{ fontSize: '20px', fontFamily: 'monospace', fontWeight: 600, color: s.highlight ? '#059669' : '#111827' }}>
                        {s.value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* 02. Intelligence Brief */}
              {sections['Intelligence Brief'] && (
                <div style={{ padding: '32px 40px', borderBottom: '1px solid #f0f0f0' }}>
                  <p style={{ fontSize: '10px', fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.15em', color: '#9ca3af', marginBottom: '20px' }}>
                    02. Intelligence Brief
                  </p>
                  <div className="flex flex-col gap-3">
                    {result.intelligenceBrief.map((bullet, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <span style={{
                          fontSize: '14px',
                          color: bullet.startsWith('↑') ? '#059669' : bullet.startsWith('↓') ? '#dc2626' : bullet.startsWith('⚠') ? '#d97706' : '#6b7280',
                          flexShrink: 0,
                          marginTop: '1px',
                        }}>
                          {bullet.startsWith('↑') ? '↑' : bullet.startsWith('↓') ? '↓' : bullet.startsWith('⚠') ? '⚠' : '→'}
                        </span>
                        <p style={{ fontSize: '13px', color: '#374151', lineHeight: 1.6 }}>
                          {bullet.replace(/^[↑↓⚠→]\s*/, '')}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 03. Top 5 Outlier Videos */}
              <div style={{ padding: '32px 40px' }}>
                <p style={{ fontSize: '10px', fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.15em', color: '#9ca3af', marginBottom: '20px' }}>
                  03. Top 5 Outlier Videos
                </p>
                <div className="flex flex-col">
                  {result.videos
                    .slice()
                    .sort((a, b) => b.outlierScore - a.outlierScore)
                    .slice(0, 5)
                    .map((v, i) => (
                      <div
                        key={v.id}
                        className="flex items-center justify-between py-3"
                        style={{ borderBottom: i < 4 ? '1px solid #f3f4f6' : 'none' }}
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <span style={{ fontSize: '11px', fontFamily: 'monospace', color: '#9ca3af', flexShrink: 0, width: '16px' }}>
                            {i + 1}
                          </span>
                          <div style={{ width: '48px', height: '28px', borderRadius: '4px', background: '#f3f4f6', flexShrink: 0 }} />
                          <p style={{ fontSize: '13px', color: '#374151', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {v.title}
                          </p>
                        </div>
                        <span style={{ fontSize: '11px', fontFamily: 'monospace', color: '#4F7EFF', marginLeft: '16px', flexShrink: 0 }}>
                          +{v.outlierScore.toFixed(1)}x
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>

          {/* ── Export options panel ──────────────────────────────────── */}
          <aside
            className="no-print flex-shrink-0 overflow-y-auto flex flex-col"
            style={{ width: '300px', borderLeft: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.01)', padding: '32px 24px', gap: '32px' }}
          >

            {/* Export As */}
            <div className="flex flex-col gap-3">
              <p style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.18em', color: 'rgba(255,255,255,0.25)', fontWeight: 600 }}>
                Export As
              </p>
              <div className="flex flex-col gap-2">
                <FormatButton
                  label="PDF Report"
                  icon={PDF_ICON}
                  active={format === 'pdf'}
                  badge={format === 'pdf' ? 'Recommended' : undefined}
                  onClick={() => setFormat('pdf')}
                />
                <FormatButton
                  label="CSV Raw Data"
                  icon={CSV_ICON}
                  active={format === 'csv'}
                  onClick={() => setFormat('csv')}
                />
                <FormatButton
                  label="JSON Data"
                  icon={JSON_ICON}
                  active={format === 'json'}
                  onClick={() => setFormat('json')}
                />
              </div>
            </div>

            {/* Divider */}
            <div style={{ height: '1px', background: 'rgba(255,255,255,0.05)' }} />

            {/* Customize Report */}
            <div className="flex flex-col gap-3">
              <p style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.18em', color: 'rgba(255,255,255,0.25)', fontWeight: 600 }}>
                Customize Report
              </p>
              <div className="flex flex-col">
                {Object.entries(sections).map(([label, enabled]) => (
                  <div
                    key={label}
                    className="flex items-center justify-between py-3"
                    style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
                  >
                    <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.55)' }}>{label}</span>
                    <Toggle
                      enabled={enabled}
                      onToggle={() => setSections((prev) => ({ ...prev, [label]: !prev[label] }))}
                    />
                  </div>
                ))}
                {/* Locked item */}
                <div className="flex items-center justify-between py-3">
                  <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.25)' }}>Competitor Comparison</span>
                  <span style={{ fontSize: '9px', fontFamily: 'monospace', color: '#F5A623', border: '1px solid rgba(245,166,35,0.25)', borderRadius: '999px', padding: '2px 7px' }}>
                    PRO
                  </span>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div style={{ height: '1px', background: 'rgba(255,255,255,0.05)' }} />

            {/* Branding */}
            <div className="flex flex-col gap-3">
              <p style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.18em', color: 'rgba(255,255,255,0.25)', fontWeight: 600 }}>
                Branding
              </p>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleLogoUpload}
              />

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex flex-col items-center gap-2 w-full"
                style={{ border: '1px dashed rgba(255,255,255,0.1)', borderRadius: '10px', padding: '20px', cursor: 'pointer', background: 'none', transition: 'border-color 150ms' }}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.22)'}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'}
              >
                {logoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={logoUrl} alt="Uploaded logo" style={{ height: '40px', objectFit: 'contain' }} />
                ) : (
                  <>
                    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true" style={{ color: 'rgba(255,255,255,0.25)' }}>
                      <path d="M10 13V3M10 3L6 7M10 3L14 7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M3 15V17H17V15" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                    </svg>
                    <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)', textAlign: 'center' }}>Add your agency logo</p>
                    <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.2)' }}>PNG/SVG up to 2MB</p>
                  </>
                )}
              </button>

              <div className="flex items-center justify-between py-2">
                <div>
                  <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.55)' }}>White-label report</p>
                  <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.25)', marginTop: '2px' }}>Remove Vexel logo</p>
                </div>
                <Toggle enabled={whiteLabel} onToggle={() => setWhiteLabel((p) => !p)} />
              </div>
            </div>

            {/* Divider */}
            <div style={{ height: '1px', background: 'rgba(255,255,255,0.05)' }} />

            {/* Share link */}
            <div className="flex flex-col gap-2">
              <p style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.18em', color: 'rgba(255,255,255,0.25)', fontWeight: 600 }}>
                Share Link
              </p>
              <div className="flex gap-2">
                <input
                  readOnly
                  value={`vexel.app/r/${result.channel.handle.replace('@', '')}`}
                  style={{ flex: 1, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '8px 12px', fontSize: '11px', fontFamily: 'monospace', color: 'rgba(255,255,255,0.4)', outline: 'none', minWidth: 0 }}
                />
                <button
                  type="button"
                  onClick={handleCopyLink}
                  style={{ padding: '8px 14px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '12px', color: copied ? '#fff' : 'rgba(255,255,255,0.45)', cursor: 'pointer', flexShrink: 0, transition: 'all 150ms', fontFamily: 'monospace' }}
                  onMouseEnter={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'}
                  onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'}
                >
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>

            {/* Schedule Weekly Report */}
            <div className="flex flex-col gap-2">
              <p style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.18em', color: 'rgba(255,255,255,0.25)', fontWeight: 600 }}>
                Schedule Weekly Report
              </p>
              <div className="flex gap-2">
                <input
                  type="email"
                  value={scheduleEmail}
                  onChange={(e) => setScheduleEmail(e.target.value)}
                  placeholder="analyst@agency.com"
                  style={{ flex: 1, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '8px 12px', fontSize: '12px', fontFamily: 'monospace', color: 'rgba(255,255,255,0.6)', outline: 'none', minWidth: 0 }}
                />
                <button
                  type="button"
                  onClick={() => showToast('Weekly report scheduled')}
                  className="vm-btn"
                  style={{ padding: '8px 16px', fontSize: '12px', flexShrink: 0 }}
                >
                  Set
                </button>
              </div>
            </div>

            {/* Footer info */}
            <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.2)', marginTop: 'auto' }}>
              <span style={{ fontFamily: 'monospace' }}>{formatViews(topVideo.views)}</span> views analyzed across{' '}
              <span style={{ fontFamily: 'monospace' }}>{result.videos.length}</span> videos.
            </p>

            {/* Export button */}
            <button
              type="button"
              onClick={handleExport}
              className="vm-btn w-full"
              style={{ padding: '12px 24px', fontSize: '14px', fontWeight: 600 }}
            >
              {exportButtonLabel}
            </button>
          </aside>
        </div>
      </div>

      {/* Toast */}
      {toastMsg && (
        <div
          className="fixed bottom-6 right-6 z-[100] flex items-center gap-2.5 rounded-xl px-4 py-3"
          style={{ background: 'rgba(10,10,18,0.95)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(20px)', boxShadow: '0 8px 32px rgba(0,0,0,0.4)', fontSize: '13px', color: '#fff' }}
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true" style={{ color: '#2DD4A7', flexShrink: 0 }}>
            <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.2" />
            <path d="M5 8L7 10L11 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span>{toastMsg}</span>
        </div>
      )}
    </div>
  )
}
