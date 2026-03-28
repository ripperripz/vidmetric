'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AppSidebar } from '@/src/components/AppSidebar'

const EXAMPLES = [
  'https://youtube.com/@MrBeast',
  'https://youtube.com/@mkbhd',
  'https://youtube.com/@veritasium',
]

export default function AnalyzePage() {
  const router = useRouter()
  const [url, setUrl] = useState('')
  const [error, setError] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = url.trim()
    if (!trimmed) { setError('Paste a YouTube channel URL to continue.'); return }
    if (!trimmed.includes('youtube.com') && !trimmed.includes('youtu.be')) {
      setError('Must be a valid YouTube channel URL.')
      return
    }
    router.push(`/analysis?url=${encodeURIComponent(trimmed)}`)
  }

  return (
    <div className="flex min-h-screen" style={{ background: '#000000' }}>
      <AppSidebar active="New Analysis" />

      <div className="flex-1 ml-0 md:ml-[220px] flex flex-col min-h-screen">

        {/* Topbar */}
        <header
          className="sticky top-0 z-30 h-16 flex items-center pl-14 pr-4 md:px-10"
          style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(24px)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}
        >
          <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.2em', color: 'rgba(255,255,255,0.3)', fontWeight: 600 }}>
            New Analysis
          </span>
        </header>

        {/* Centered content */}
        <div className="flex-1 flex items-center justify-center px-4 md:px-10 py-8 md:py-12">
          <div className="w-full" style={{ maxWidth: '640px' }}>

            {/* Icon with glow */}
            <div className="relative mb-8">
              <div
                className="absolute -inset-4 rounded-full pointer-events-none"
                style={{ background: 'radial-gradient(circle, rgba(61,110,255,0.12) 0%, transparent 70%)' }}
              />
              <div
                className="relative w-14 h-14 rounded-2xl flex items-center justify-center"
                style={{ background: 'rgba(61,110,255,0.1)', border: '1px solid rgba(61,110,255,0.2)' }}
              >
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
                  <circle cx="10" cy="10" r="7.5" stroke="#3D6EFF" strokeWidth="1.5" />
                  <path d="M15.5 15.5L19.5 19.5" stroke="#3D6EFF" strokeWidth="1.5" strokeLinecap="round" />
                  <path d="M10 7V13M7 10H13" stroke="#3D6EFF" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>
            </div>

            <h1 style={{ fontSize: 'clamp(24px, 5vw, 32px)', fontWeight: 700, color: '#fff', letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: '12px' }}>
              Analyze a Channel
            </h1>
            <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.35)', marginBottom: '40px', lineHeight: 1.6 }}>
              Paste any YouTube channel URL to generate an instant intelligence brief — outlier videos, win formulas, and momentum signals.
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <input
                  type="url"
                  value={url}
                  onChange={(e) => { setUrl(e.target.value); setError('') }}
                  placeholder="https://youtube.com/@channel"
                  autoFocus
                  style={{
                    width: '100%',
                    height: '64px',
                    background: 'rgba(255,255,255,0.04)',
                    border: `1px solid ${error ? 'rgba(255,77,106,0.5)' : 'rgba(255,255,255,0.1)'}`,
                    borderRadius: '14px',
                    padding: '0 22px',
                    color: '#fff',
                    fontSize: '16px',
                    outline: 'none',
                    fontFamily: 'monospace',
                    transition: 'border-color 150ms',
                  }}
                  onFocus={(e) => { if (!error) e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)' }}
                  onBlur={(e) => { if (!error) e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)' }}
                />
                {error && (
                  <p className="font-mono" style={{ fontSize: '12px', color: '#FF4D6A', marginTop: '8px' }}>{error}</p>
                )}
              </div>

              <button
                type="submit"
                className="btn-primary w-full"
                style={{ height: '52px', fontSize: '14px', borderRadius: '12px', justifyContent: 'center' }}
              >
                Generate Intelligence Brief
                <span className="arrow-circle">↗</span>
              </button>
            </form>

            {/* Examples */}
            <div style={{ marginTop: '32px' }}>
              <p style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.2)', marginBottom: '12px' }}>
                Try an example
              </p>
              <div className="flex flex-wrap gap-2">
                {EXAMPLES.map((ex) => (
                  <button
                    key={ex}
                    type="button"
                    onClick={() => { setUrl(ex); setError('') }}
                    className="font-mono"
                    style={{
                      fontSize: '12px',
                      padding: '6px 14px',
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      borderRadius: '999px',
                      color: 'rgba(255,255,255,0.45)',
                      cursor: 'pointer',
                      transition: 'all 150ms',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)' }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.45)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)' }}
                  >
                    {ex.replace('https://youtube.com/', '')}
                  </button>
                ))}
              </div>
            </div>

            {/* What you get */}
            <div
              className="rounded-xl p-6 mt-10"
              style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}
            >
              <p style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.25)', marginBottom: '16px' }}>
                What you get
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  'Intelligence Brief — 6 AI insights',
                  'Outlier Score — per-video ranking',
                  'Cadence Heatmap — post timing',
                  'Format Graveyard — abandoned wins',
                  'Momentum View — 30 vs 90 day',
                  'Win Formula — top 3 patterns',
                ].map((item) => (
                  <div key={item} className="flex items-start gap-2.5">
                    <div className="w-1 h-1 rounded-full mt-2 flex-shrink-0" style={{ background: '#3D6EFF' }} />
                    <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', lineHeight: 1.5 }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
