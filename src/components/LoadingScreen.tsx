'use client'

import { useState, useEffect } from 'react'

export interface LoadingScreenProps {
  channelHandle?: string
}

const STEPS = [
  'Mapping engagement heatmap...',
  'Cross-referencing audience retention scores...',
  'Scoring outlier performance ratios...',
  'Detecting win formula patterns...',
  'Scanning format graveyard signals...',
  'Generating intelligence brief...',
]

function GemLogo() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" aria-hidden="true">
      {/* Outer glow ring */}
      <circle cx="24" cy="24" r="23" stroke="rgba(61,110,255,0.15)" strokeWidth="1" />
      {/* Inner ring */}
      <circle cx="24" cy="24" r="18" stroke="rgba(61,110,255,0.25)" strokeWidth="0.5" strokeDasharray="3 4" />
      {/* Diamond shape */}
      <path
        d="M24 8 L36 20 L24 40 L12 20 Z"
        fill="none"
        stroke="rgba(255,255,255,0.7)"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <path
        d="M12 20 L24 24 L36 20"
        stroke="rgba(255,255,255,0.35)"
        strokeWidth="0.8"
      />
      <path
        d="M24 8 L24 24 M24 24 L24 40"
        stroke="rgba(255,255,255,0.15)"
        strokeWidth="0.8"
      />
      {/* Inner highlight */}
      <path
        d="M24 8 L30 18 L24 24 L18 18 Z"
        fill="rgba(61,110,255,0.15)"
      />
    </svg>
  )
}

export function LoadingScreen({ channelHandle = 'channel' }: LoadingScreenProps) {
  const [stepIndex, setStepIndex] = useState(0)
  const [progress, setProgress]   = useState(0)
  const [elapsed, setElapsed]     = useState(0)

  // Advance steps
  useEffect(() => {
    const iv = setInterval(() => {
      setStepIndex((i) => Math.min(i + 1, STEPS.length - 1))
    }, 650)
    return () => clearInterval(iv)
  }, [])

  // Progress counter
  useEffect(() => {
    const iv = setInterval(() => {
      setProgress((p) => {
        const target = Math.min(95, (stepIndex / STEPS.length) * 100 + Math.random() * 8)
        return Math.min(p + 1.5, target)
      })
    }, 80)
    return () => clearInterval(iv)
  }, [stepIndex])

  // Elapsed timer
  useEffect(() => {
    const iv = setInterval(() => setElapsed((s) => s + 1), 1000)
    return () => clearInterval(iv)
  }, [])

  const circumference = 2 * Math.PI * 54
  const strokeDash    = circumference - (progress / 100) * circumference

  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center z-50"
      style={{ background: '#000000' }}
    >
      {/* Subtle blue ambient */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: '500px', height: '500px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(61,110,255,0.08) 0%, transparent 65%)',
          top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        }}
      />

      {/* Logo top */}
      <a href="/" className="absolute top-10 no-underline">
        <span style={{ fontFamily: "'Inter', 'DM Sans', system-ui, sans-serif", fontSize: '20px', fontWeight: 700, letterSpacing: '3px', color: '#FFFFFF', textTransform: 'uppercase' }}>VEXEL</span>
      </a>

      {/* Elapsed top-right */}
      <div className="absolute top-10 right-10 text-right">
        <p style={{ fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.18em', color: 'rgba(255,255,255,0.2)', marginBottom: '2px' }}>Elapsed</p>
        <p className="font-mono" style={{ fontSize: '18px', fontWeight: 700, color: 'rgba(255,255,255,0.6)' }}>
          {elapsed}s
        </p>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center gap-8">
        {/* Circular progress ring */}
        <div className="relative flex items-center justify-center" style={{ width: '160px', height: '160px' }}>
          {/* Track ring */}
          <svg className="absolute inset-0" width="160" height="160" style={{ transform: 'rotate(-90deg)' }}>
            <circle cx="80" cy="80" r="54" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="2" />
            <circle
              cx="80" cy="80" r="54"
              fill="none"
              stroke="rgba(61,110,255,0.7)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray={`${circumference}`}
              strokeDashoffset={`${strokeDash}`}
              style={{ transition: 'stroke-dashoffset 200ms ease' }}
            />
          </svg>
          {/* Inner gem */}
          <div className="animate-float-slow">
            <GemLogo />
          </div>
          {/* Progress % in center */}
          <div className="absolute" style={{ bottom: '28px', left: '50%', transform: 'translateX(-50%)' }}>
            <p style={{ fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.2em', color: 'rgba(255,255,255,0.25)', textAlign: 'center' }}>
              {Math.round(progress)}%
            </p>
          </div>
        </div>

        {/* Channel name */}
        <div className="text-center">
          <p style={{ fontSize: '22px', fontWeight: 600, letterSpacing: '-0.02em', color: '#fff', marginBottom: '4px' }}>
            Analyzing{' '}
            <span className="font-mono" style={{ color: '#3D6EFF' }}>{channelHandle}</span>
          </p>
          <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.3)', lineHeight: 1.65, maxWidth: '340px' }}>
            Intelligence brief in progress. Cross-referencing audience retention scores with historical performance benchmarks.
          </p>
        </div>

        {/* Step list */}
        <div className="flex flex-col gap-2" style={{ minWidth: '260px' }}>
          {STEPS.map((step, i) => {
            const done    = i < stepIndex
            const current = i === stepIndex
            return (
              <div
                key={step}
                className="flex items-center gap-3"
                style={{
                  opacity: done ? 0.3 : current ? 1 : 0.15,
                  transition: 'opacity 300ms',
                }}
              >
                <div
                  style={{
                    width: '6px', height: '6px', borderRadius: '50%', flexShrink: 0,
                    background: done ? 'rgba(255,255,255,0.4)' : current ? '#3D6EFF' : 'rgba(255,255,255,0.1)',
                    boxShadow: current ? '0 0 8px rgba(61,110,255,0.8)' : 'none',
                    transition: 'all 300ms',
                  }}
                />
                <span style={{ fontSize: '12px', color: current ? '#fff' : 'rgba(255,255,255,0.5)', fontFamily: 'monospace' }}>
                  {step}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Bottom stats strip */}
      <div
        className="absolute bottom-0 left-0 right-0 flex items-center justify-center gap-10"
        style={{ padding: '20px 24px', borderTop: '1px solid rgba(255,255,255,0.04)' }}
      >
        {[
          { label: 'Category', value: 'Entertainment' },
          { label: 'Est. quality', value: 'On: High' },
          { label: 'Pipeline', value: 'Premium Alpha' },
        ].map((s) => (
          <div key={s.label} className="text-center">
            <p style={{ fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.2)', marginBottom: '3px' }}>{s.label}</p>
            <p className="font-mono" style={{ fontSize: '11px', color: 'rgba(255,255,255,0.45)' }}>{s.value}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
