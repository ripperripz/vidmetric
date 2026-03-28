'use client'

import type { AnalysisResult } from '@/src/types'
import { AppSidebar } from '@/src/components/AppSidebar'
import { ChannelHeader } from '@/src/components/ChannelHeader'
import { IntelligenceBrief } from '@/src/components/IntelligenceBrief'
import { MetricCards } from '@/src/components/MetricCards'
import { VideoGrid } from '@/src/components/VideoGrid'
import { ViewsOverTimeChart, OutlierDistributionChart } from '@/src/components/PerformanceChart'
import { CadenceHeatmap } from '@/src/components/CadenceHeatmap'
import { FormatGraveyard } from '@/src/components/FormatGraveyard'
import { SaveButton } from '@/src/components/SaveButton'

// ── Section label ──────────────────────────────────────────────────────
function SectionLabel({ label, description }: { label: string; description?: string }) {
  return (
    <div className="flex flex-col gap-1.5 mb-6">
      <span className="flex items-center gap-2"
        style={{
          fontSize: '10px',
          textTransform: 'uppercase',
          letterSpacing: '0.2em',
          color: 'rgba(255,255,255,0.3)',
          fontWeight: 600,
        }}
      >
        <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'rgba(61,110,255,0.5)', display: 'inline-block', flexShrink: 0 }} />
        {label}
      </span>
      {description && (
        <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.32)', lineHeight: 1.5 }}>{description}</p>
      )}
    </div>
  )
}

// ── Win Formula section ────────────────────────────────────────────────
function WinFormulaSection({ winFormula }: { winFormula: AnalysisResult['winFormula'] }) {
  const patterns = [
    { label: 'Best Post Days', value: winFormula.postDay, color: 'rgba(255,255,255,0.12)', text: '#fff' },
    { label: 'Optimal Duration', value: winFormula.duration, color: 'rgba(45,212,167,0.1)', text: '#2DD4A7' },
    { label: 'Title Pattern', value: winFormula.titlePattern, color: 'rgba(245,166,35,0.1)', text: '#F5A623' },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {patterns.map(({ label, value, color, text }) => (
        <div
          key={label}
          className="rounded-xl p-5 flex flex-col gap-3 transition-all duration-200"
          style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; e.currentTarget.style.transform = 'translateY(0)' }}
        >
          <span
            style={{
              fontSize: '10px',
              textTransform: 'uppercase',
              letterSpacing: '0.15em',
              color: 'rgba(255,255,255,0.3)',
            }}
          >
            {label}
          </span>
          <span
            className="font-mono"
            style={{
              fontSize: '16px',
              fontWeight: 600,
              color: text,
              letterSpacing: '-0.01em',
            }}
          >
            {value}
          </span>
          <div style={{ height: '2px', borderRadius: '1px', background: color, width: '40px' }} />
        </div>
      ))}
    </div>
  )
}

// ── Main layout ────────────────────────────────────────────────────────
export default function AnalysisLayout({
  result,
  sourceUrl,
  errorBanner,
  isInfo,
}: {
  result: AnalysisResult
  sourceUrl: string
  errorBanner?: string
  isInfo?: boolean
}) {
  return (
    <div className="flex min-h-screen" style={{ background: '#000000' }}>
      <AppSidebar active="New Analysis" />

      <div className="flex-1 ml-0 md:ml-[220px] flex flex-col min-h-screen">

        {/* Topbar */}
        <header
          className="sticky top-0 z-30 h-14 sm:h-16 flex items-center justify-between pl-14 pr-3 sm:pr-4 md:px-10"
          style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(24px)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}
        >
          <div className="flex items-center gap-3 min-w-0">
            <span className="hidden sm:inline" style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.2em', color: 'rgba(255,255,255,0.3)', fontWeight: 600, flexShrink: 0 }}>
              Analysis Report
            </span>
            <span className="hidden sm:inline-block" style={{ width: '3px', height: '3px', borderRadius: '50%', background: 'rgba(255,255,255,0.15)' }} />
            <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{result.channel.name}</span>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            <SaveButton
              channelId={result.channel.id}
              channelName={result.channel.name}
              channelHandle={result.channel.handle}
              url={sourceUrl}
            />
            <a
              href={sourceUrl ? `/export?url=${encodeURIComponent(sourceUrl)}` : '/export'}
              className="hidden sm:flex items-center gap-1.5"
              style={{
                padding: '8px 16px',
                fontSize: '12px',
                fontFamily: 'monospace',
                color: 'rgba(255,255,255,0.45)',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '8px',
                textDecoration: 'none',
                transition: 'all 150ms',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)' }}
              onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.45)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)' }}
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M8 2V10M8 10L5 7M8 10L11 7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M3 13H13" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
              </svg>
              Export
            </a>
            <a
              href="/analyze"
              className="btn-primary hidden sm:flex"
              style={{ padding: '8px 18px', fontSize: '12px' }}
            >
              New Analysis
              <span className="arrow-circle">↗</span>
            </a>
          </div>
        </header>

        {/* Content */}
        <main
          className="flex-1 w-full mx-auto flex flex-col pb-16 md:pb-24 px-4 md:px-10"
          style={{ maxWidth: '1160px', gap: '40px', paddingTop: '24px' }}
        >
          {/* Error / info / demo banner */}
          {errorBanner && (
            <div
              className="flex items-center gap-3 px-6 py-3 rounded-xl"
              style={isInfo
                ? { background: 'rgba(45,212,167,0.05)', border: '1px solid rgba(45,212,167,0.1)' }
                : { background: 'rgba(245,160,0,0.05)', border: '1px solid rgba(245,160,0,0.1)' }
              }
            >
              <span style={{ fontSize: '14px' }}>{isInfo ? 'ℹ️' : '⚠️'}</span>
              <p style={{ fontSize: '13px', color: isInfo ? '#2DD4A7' : '#F5A623', letterSpacing: '0.01em' }}>{errorBanner}</p>
            </div>
          )}

          {/* 1 — Channel Overview */}
          <section>
            <SectionLabel label="Channel Overview" />
            <ChannelHeader channel={result.channel} postingCadence={result.postingCadence} />
          </section>

          {/* 2 — Intelligence Brief */}
          <section>
            <SectionLabel
              label="Intelligence Brief"
              description="AI-generated signal summary from the last 50 uploads"
            />
            <IntelligenceBrief bullets={result.intelligenceBrief} generatedIn={result.generatedIn} />
          </section>

          {/* Divider */}
          <div className="vm-section-divider" />

          {/* 3 — Key Metrics */}
          <section>
            <SectionLabel
              label="Key Metrics"
              description="Deep performance indicators reconstructed from the last 50 uploads"
            />
            <MetricCards result={result} />
          </section>

          {/* Divider */}
          <div className="vm-section-divider" />

          {/* 4 — Upload Patterns */}
          <section>
            <SectionLabel
              label="Upload Patterns"
              description="Signals in the posting timeline and cadence"
            />
            <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-8 items-start">
              <CadenceHeatmap grid={result.cadenceGrid} />
              <FormatGraveyard items={result.formatGraveyard} />
            </div>
          </section>

          {/* Divider */}
          <div className="vm-section-divider" />

          {/* 5 — Win Formula */}
          <section>
            <SectionLabel
              label="Win Formula"
              description="Three recurring patterns found in top-performing videos"
            />
            <WinFormulaSection winFormula={result.winFormula} />
          </section>

          {/* Divider */}
          <div className="vm-section-divider" />

          {/* 6 — Performance Charts */}
          <section>
            <SectionLabel
              label="Performance Charts"
              description="Visual breakdown of view trends and outlier distribution"
            />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <ViewsOverTimeChart videos={result.videos} />
              <OutlierDistributionChart videos={result.videos} />
            </div>
          </section>

          {/* Divider */}
          <div className="vm-section-divider" />

          {/* 7 — Video Performance */}
          <section>
            <SectionLabel
              label="Video Performance"
              description="Outlier rankings — high-performance formats vs channel baseline"
            />
            <VideoGrid videos={result.videos} />
          </section>
        </main>

        {/* Footer */}
        <footer
          className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 md:px-10 py-8 md:py-10"
          style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}
        >
          <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.2)', textAlign: 'center' }}>
            All reports are AI-generated based on public YouTube engagement data.
          </p>
          <div className="flex gap-6">
            {['Privacy', 'Terms', 'Support'].map((l) => (
              <a key={l} href="#" style={{ fontSize: '12px', color: 'rgba(255,255,255,0.25)', textDecoration: 'none' }}
                onMouseEnter={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.25)'}
              >
                {l}
              </a>
            ))}
          </div>
        </footer>
      </div>
    </div>
  )
}
