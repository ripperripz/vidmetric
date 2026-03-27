'use client'

import type { AnalysisResult } from '@/src/types'
import { AppSidebar } from '@/src/components/AppSidebar'
import { ChannelHeader } from '@/src/components/ChannelHeader'
import { IntelligenceBrief } from '@/src/components/IntelligenceBrief'
import { MetricCards } from '@/src/components/MetricCards'
import { VideoGrid } from '@/src/components/VideoGrid'
import { CadenceHeatmap } from '@/src/components/CadenceHeatmap'
import { FormatGraveyard } from '@/src/components/FormatGraveyard'
import { SaveButton } from '@/src/components/SaveButton'

// ── Section label ──────────────────────────────────────────────────────
function SectionLabel({ label, description }: { label: string; description?: string }) {
  return (
    <div className="flex flex-col gap-1 mb-6">
      <span
        style={{
          fontSize: '10px',
          textTransform: 'uppercase',
          letterSpacing: '0.2em',
          color: 'rgba(255,255,255,0.25)',
          fontWeight: 600,
        }}
      >
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
          className="rounded-xl p-5 flex flex-col gap-2"
          style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}
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
              fontSize: '15px',
              fontWeight: 600,
              color: text,
              background: color,
              borderRadius: '8px',
              padding: '8px 14px',
              display: 'inline-block',
              marginTop: '4px',
            }}
          >
            {value}
          </span>
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

      <div className="flex-1 ml-[220px] flex flex-col min-h-screen">

        {/* Topbar */}
        <header
          className="sticky top-0 z-30 h-16 flex items-center justify-between px-10"
          style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(24px)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}
        >
          <div className="flex items-center gap-3">
            <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.2em', color: 'rgba(255,255,255,0.3)', fontWeight: 600 }}>
              Analysis Report
            </span>
            <span style={{ width: '3px', height: '3px', borderRadius: '50%', background: 'rgba(255,255,255,0.15)', display: 'inline-block' }} />
            <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>{result.channel.name}</span>
          </div>
          <div className="flex items-center gap-3">
            <SaveButton
              channelId={result.channel.id}
              channelName={result.channel.name}
              channelHandle={result.channel.handle}
              url={sourceUrl}
            />
            <a
              href="/analyze"
              className="btn-primary"
              style={{ padding: '8px 18px', fontSize: '12px' }}
            >
              New Analysis
              <span className="arrow-circle">↗</span>
            </a>
          </div>
        </header>

        {/* Content */}
        <main
          className="flex-1 w-full mx-auto flex flex-col pb-24 px-10"
          style={{ maxWidth: '1160px', gap: '64px', paddingTop: '48px' }}
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
          <div style={{ height: '1px', background: 'rgba(255,255,255,0.05)' }} />

          {/* 3 — Key Metrics */}
          <section>
            <SectionLabel
              label="Key Metrics"
              description="Deep performance indicators reconstructed from the last 50 uploads"
            />
            <MetricCards result={result} />
          </section>

          {/* Divider */}
          <div style={{ height: '1px', background: 'rgba(255,255,255,0.05)' }} />

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
          <div style={{ height: '1px', background: 'rgba(255,255,255,0.05)' }} />

          {/* 5 — Win Formula */}
          <section>
            <SectionLabel
              label="Win Formula"
              description="Three recurring patterns found in top-performing videos"
            />
            <WinFormulaSection winFormula={result.winFormula} />
          </section>

          {/* Divider */}
          <div style={{ height: '1px', background: 'rgba(255,255,255,0.05)' }} />

          {/* 6 — Video Performance */}
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
          style={{ borderTop: '1px solid rgba(255,255,255,0.04)', padding: '40px 40px' }}
          className="flex items-center justify-between"
        >
          <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.2)' }}>
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
