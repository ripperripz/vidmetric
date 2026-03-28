'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import dynamic from 'next/dynamic'

const ThreeBackground = dynamic(() => import('@/src/components/ThreeBackground'), { ssr: false })

// ── Animation helpers ──────────────────────────────────────────────────────
const EASE = [0.16, 1, 0.3, 1] as const

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
}
const stagger = (delay = 0.1) => ({
  hidden: {},
  show:   { transition: { staggerChildren: delay } },
})

// ── Floating Navbar ────────────────────────────────────────────────────────
function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-4 sm:pt-8 px-4">
      <nav
        className="flex items-center gap-4 sm:gap-12 px-5 sm:px-10 py-3 sm:py-4 rounded-full transition-all duration-300"
        style={{
          background: scrolled ? 'rgba(0,0,0,0.8)' : 'rgba(0,0,0,0.3)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.05)',
          boxShadow: scrolled ? '0 8px 32px rgba(0,0,0,0.4)' : 'none',
        }}
      >
        {/* Logo */}
        <a href="/" className="flex items-center no-underline">
          <span style={{ fontSize: '18px', fontWeight: 800, color: '#fff', letterSpacing: '0.05em' }}>
            VEXEL
          </span>
        </a>

        {/* Links */}
        <div className="hidden md:flex items-center gap-10">
          {[
            { label: 'Features', href: '#features' },
            { label: 'Pricing',  href: '#pricing'  },
            { label: 'About',    href: '/about'    },
          ].map(({ label, href }) => (
            <a key={label} href={href} className="vm-nav-link" style={{ fontSize: '14px', fontWeight: 500 }}>
              {label}
            </a>
          ))}
        </div>

        {/* CTA */}
        <a
          href="/analyze"
          className="btn-primary"
          style={{ padding: '8px 16px', fontSize: '13px', whiteSpace: 'nowrap' }}
        >
          <span className="hidden sm:inline">Get Started</span>
          <span className="sm:hidden">Start</span>
          <span className="arrow-circle">↗</span>
        </a>
      </nav>
    </header>
  )
}

// ── Hero Section ──────────────────────────────────────────────────────────
function Hero() {
  const router = useRouter()
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)

  function handleAnalyze(e: React.FormEvent) {
    e.preventDefault()
    if (!url.trim()) return
    setLoading(true)
    router.push(`/analysis?url=${encodeURIComponent(url.trim())}`)
  }

  const quickChannels = ['@MrBeast', '@veritasium', '@MKBHD', '@LexFridman', '@MarkRober']

  return (
    <section id="hero" className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden" style={{ background: 'transparent' }}>

      {/* Arena grid floor */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[50vh] pointer-events-none overflow-hidden"
        style={{ opacity: 0.6 }}
      >
        <div className="arena-grid absolute inset-0" />
        {/* Gradient fade to mask the grid edges */}
        <div
          className="absolute inset-0"
          style={{ background: 'radial-gradient(ellipse 80% 80% at 50% 100%, transparent 30%, #000000 80%)' }}
        />
      </div>

      {/* Blue glow cloud */}
      <div className="vm-hero-glow" />

      {/* Secondary glow rings */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: '700px', height: '700px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(61,110,255,0.12) 0%, transparent 65%)',
          bottom: '-200px', left: '50%', transform: 'translateX(-50%)',
        }}
      />

      {/* Content */}
      <div
        className="relative z-10 flex flex-col items-center text-center px-5 sm:px-6"
        style={{ maxWidth: '780px', paddingTop: 'clamp(100px, 20vw, 180px)', paddingBottom: 'clamp(40px, 10vw, 100px)' }}
      >
        {/* Headline */}
        <motion.h1
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE, delay: 0.08 }}
          style={{
            fontSize: 'clamp(48px, 8vw, 84px)',
            fontWeight: 800,
            lineHeight: 1.0,
            letterSpacing: '-0.04em',
          }}
        >
          <span className="vm-gradient-text">Decode Any Channel.</span><br />
          <span style={{ color: 'rgba(255,255,255,0.35)' }}>Own the Strategy.</span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE, delay: 0.18 }}
          style={{ fontSize: 'clamp(14px, 3.5vw, 18px)', color: 'rgba(255,255,255,0.4)', lineHeight: 1.6, maxWidth: '560px', marginBottom: 'clamp(24px, 6vw, 48px)' }}
        >
          Deconstruct any YouTube channel into an intelligence brief — outlier scores,
          win formulas, and competitive gaps — in under 5 seconds.
        </motion.p>

        {/* URL Input — Primary CTA */}
        <motion.form
          onSubmit={handleAnalyze}
          className="w-full"
          style={{ maxWidth: '620px', marginBottom: '16px' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE, delay: 0.28 }}
        >
          <div
            style={{
              position: 'relative',
              borderRadius: '999px',
              padding: '2px',
              background: 'linear-gradient(135deg, rgba(61,110,255,0.4), rgba(45,212,167,0.2), rgba(61,110,255,0.15))',
            }}
          >
            {/* Inner glow behind the input */}
            <div
              className="absolute -inset-3 rounded-full pointer-events-none"
              style={{
                background: 'radial-gradient(ellipse 60% 80% at 50% 50%, rgba(61,110,255,0.15) 0%, transparent 70%)',
                filter: 'blur(8px)',
              }}
            />
            <div
              className="relative flex items-center gap-2 sm:gap-3"
              style={{
                background: 'rgba(0,0,0,0.85)',
                borderRadius: '999px',
                padding: '8px 8px 8px 16px',
              }}
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true" style={{ color: 'rgba(61,110,255,0.6)', flexShrink: 0 }}>
                <circle cx="8" cy="8" r="5.5" stroke="currentColor" strokeWidth="1.4" />
                <path d="M12 12L16 16" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
              </svg>
              <input
                className="vm-input"
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Paste any YouTube channel URL..."
                style={{ fontSize: '16px', letterSpacing: '-0.01em' }}
              />
              <button
                type="submit"
                disabled={loading}
                className="btn-primary"
                style={{
                  padding: '10px 18px',
                  fontSize: '14px',
                  borderRadius: '999px',
                  opacity: loading ? 0.6 : 1,
                  fontWeight: 600,
                  whiteSpace: 'nowrap',
                }}
              >
                {loading ? 'Analyzing…' : 'Analyze'}
                {!loading && <span className="arrow-circle" style={{ marginLeft: '6px' }}>↗</span>}
              </button>
            </div>
          </div>
        </motion.form>

        {/* Quick channels */}
        <motion.div
          className="flex flex-wrap items-center justify-center gap-2 mb-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, ease: EASE, delay: 0.4 }}
        >
          <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.25)' }}>Try:</span>
          {quickChannels.map((ch) => (
            <button
              key={ch}
              type="button"
              onClick={() => {
                setUrl(`https://youtube.com/${ch}`)
                router.push(`/analysis?url=${encodeURIComponent(`https://youtube.com/${ch}`)}`)
              }}
              style={{
                fontSize: '12px',
                fontFamily: 'monospace',
                color: 'rgba(255,255,255,0.4)',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '999px',
                padding: '5px 12px',
                cursor: 'pointer',
                transition: 'all 150ms',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#fff'
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'rgba(255,255,255,0.4)'
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'
              }}
            >
              {ch}
            </button>
          ))}
        </motion.div>

        {/* Secondary links */}
        <motion.div
          className="flex items-center gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, ease: EASE, delay: 0.5 }}
        >
          <a
            href="#features"
            style={{
              fontSize: '13px',
              color: 'rgba(255,255,255,0.35)',
              textDecoration: 'none',
              transition: 'color 150ms',
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.7)'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.35)'}
          >
            See features →
          </a>
          <a
            href="#pricing"
            style={{
              fontSize: '13px',
              color: 'rgba(255,255,255,0.35)',
              textDecoration: 'none',
              transition: 'color 150ms',
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.7)'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.35)'}
          >
            View pricing →
          </a>
        </motion.div>
      </div>

      {/* Floating product preview cards */}
      <motion.div
        className="relative z-10 w-full flex justify-center gap-4 px-8"
        style={{ maxWidth: '1100px', margin: '-20px auto 60px' }}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5, ease: EASE }}
      >
        {/* Left card — Intelligence Brief preview */}
        <div
          className="hidden lg:block"
          style={{
            width: '240px',
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '12px',
            padding: '16px',
            transform: 'translateY(20px) rotate(-1.5deg)',
            boxShadow: '0 24px 48px rgba(0,0,0,0.6)',
          }}
        >
          <p style={{ fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.3)', marginBottom: '12px' }}>Intelligence Brief</p>
          {['↑ Outlier video 4.2× avg', '⚠ Format graveyard: 3 items', '↑ Win formula: Tuesday 8PM', '→ Engagement holding at 4.7%'].map((line, i) => (
            <div key={i} className="flex items-center gap-2 py-1.5" style={{ borderBottom: i < 3 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
              <span style={{ fontSize: '10px', color: i === 1 ? '#F5A623' : i === 0 || i === 2 ? '#00D4A1' : 'rgba(255,255,255,0.3)', fontFamily: 'monospace' }}>
                {line.charAt(0)}
              </span>
              <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)' }}>{line.slice(2)}</span>
            </div>
          ))}
        </div>

        {/* Center card — Outlier score */}
        <div
          style={{
            flex: '0 0 auto',
            width: 'clamp(140px, 40vw, 180px)',
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '12px',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px',
            transform: 'translateY(-10px)',
            boxShadow: '0 32px 64px rgba(0,0,0,0.7), 0 0 40px rgba(61,110,255,0.1)',
          }}
        >
          <p style={{ fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.3)' }}>Outlier Score</p>
          <p style={{ fontSize: '48px', fontFamily: 'monospace', fontWeight: 700, color: '#fff', lineHeight: 1 }}>8.4</p>
          <div style={{ width: '100%', height: '3px', background: 'rgba(255,255,255,0.07)', borderRadius: '999px', overflow: 'hidden' }}>
            <div style={{ width: '84%', height: '100%', background: 'rgba(255,255,255,0.5)', borderRadius: '999px' }} />
          </div>
          <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)' }}>Beats 94% of channels</p>
        </div>

        {/* Right card — Win formula */}
        <div
          className="hidden lg:block"
          style={{
            width: '220px',
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '12px',
            padding: '16px',
            transform: 'translateY(20px) rotate(1.5deg)',
            boxShadow: '0 24px 48px rgba(0,0,0,0.6)',
          }}
        >
          <p style={{ fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.3)', marginBottom: '12px' }}>Win Formula</p>
          {[
            { label: 'Best day', value: 'Tuesday–Thursday' },
            { label: 'Duration', value: '14–17 min' },
            { label: 'Title', value: 'Number in title' },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between py-2" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
              <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)' }}>{item.label}</span>
              <span style={{ fontSize: '10px', fontFamily: 'monospace', color: 'rgba(255,255,255,0.7)' }}>{item.value}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}

// ── Stats Row ──────────────────────────────────────────────────────────────
function StatsRow() {
  const stats = [
    { value: '10,000+', label: 'Channels Analyzed' },
    { value: '500M+',   label: 'Videos Processed' },
    { value: '<5s',     label: 'Analysis Time' },
    { value: '$499/mo', label: 'Enterprise Access' },
  ]

  return (
    <section style={{ background: '#000000', borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
      <div
        className="grid grid-cols-2 sm:grid-cols-4 items-center"
        style={{ maxWidth: '1100px', margin: '0 auto' }}
      >
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            className="flex-1 flex flex-col items-center justify-center py-6 sm:py-10"
            style={{
              minWidth: '0',
              borderRight: i < stats.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none',
            }}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: EASE, delay: i * 0.08 }}
          >
            <p className="font-mono" style={{ fontSize: 'clamp(20px, 5vw, 32px)', fontWeight: 700, color: '#fff', lineHeight: 1 }}>{s.value}</p>
            <p style={{ fontSize: 'clamp(9px, 2.5vw, 12px)', color: 'rgba(255,255,255,0.35)', marginTop: '6px', letterSpacing: '0.05em', textAlign: 'center' }}>{s.label}</p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

// ── Features Section ───────────────────────────────────────────────────────
function Features() {
  const items = [
    {
      title: 'Intelligence Brief',
      desc: 'Six-bullet AI summary of exactly what the channel is doing right — and what\'s about to break.',
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <path d="M3 5H17M3 10H13M3 15H9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
      ),
    },
    {
      title: 'Outlier Detection',
      desc: 'Every video scored against the channel average. Outliers up to 10× flagged and ranked instantly.',
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <path d="M2 14L7 9L11 13L15 7L18 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="18" cy="4" r="2" fill="currentColor" />
        </svg>
      ),
    },
    {
      title: 'Win Formula',
      desc: 'Post day, optimal duration, title patterns. Three recurring signals that define their top 10%.',
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <path d="M10 2L12.4 7.6L18 8.6L14 12.5L15 18L10 15.3L5 18L6 12.5L2 8.6L7.6 7.6L10 2Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
        </svg>
      ),
    },
    {
      title: 'Format Graveyard',
      desc: 'Winning formats the channel abandoned 6–18 months ago. Your opportunity to own the territory they left.',
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <path d="M10 3V3C6.7 3 4 5.7 4 9V15H16V9C16 5.7 13.3 3 10 3Z" stroke="currentColor" strokeWidth="1.4" />
          <path d="M7 15V17M13 15V17M4 15H16" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
      ),
    },
    {
      title: 'Cadence Heatmap',
      desc: 'A 7×4 grid showing when the channel posts vs when their best videos perform. Exploit the gap.',
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <rect x="2" y="2" width="4" height="4" rx="1" fill="currentColor" opacity="0.4" />
          <rect x="8" y="2" width="4" height="4" rx="1" fill="currentColor" opacity="0.8" />
          <rect x="14" y="2" width="4" height="4" rx="1" fill="currentColor" opacity="0.3" />
          <rect x="2" y="8" width="4" height="4" rx="1" fill="currentColor" opacity="0.9" />
          <rect x="8" y="8" width="4" height="4" rx="1" fill="currentColor" opacity="0.5" />
          <rect x="14" y="8" width="4" height="4" rx="1" fill="currentColor" opacity="0.7" />
          <rect x="2" y="14" width="4" height="4" rx="1" fill="currentColor" opacity="0.2" />
          <rect x="8" y="14" width="4" height="4" rx="1" fill="currentColor" opacity="0.6" />
          <rect x="14" y="14" width="4" height="4" rx="1" fill="currentColor" opacity="1" />
        </svg>
      ),
    },
    {
      title: 'Momentum Signals',
      desc: '30-day vs 90-day view trajectory comparison. Know if momentum is building before competitors catch on.',
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <path d="M3 15C5 12 7 11 10 13C13 15 15 10 17 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          <path d="M14 5H17V8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
    },
  ]

  return (
    <section id="features" style={{ background: '#000000', padding: 'clamp(48px, 10vw, 120px) clamp(16px, 4vw, 24px)' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

        {/* Section header */}
        <div className="flex flex-col items-center text-center mb-16">
          <motion.div className="mb-5" initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, ease: EASE }}>
            <span className="vm-badge">The Intelligence Edge</span>
          </motion.div>
          <motion.h2 initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, ease: EASE, delay: 0.1 }}
            style={{ fontSize: 'clamp(32px, 5vw, 52px)', fontWeight: 700, letterSpacing: '-0.03em', color: '#fff', marginBottom: '16px' }}>
            Every signal your strategy team needs
          </motion.h2>
          <motion.p initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, ease: EASE, delay: 0.2 }}
            style={{ fontSize: '16px', color: 'rgba(255,255,255,0.4)', maxWidth: '480px', lineHeight: 1.65 }}>
            Built for enterprise media companies and agency strategy teams, not individual creators.
          </motion.p>
        </div>

        {/* Bento grid — top row: Intelligence Brief (featured) + Outlier Score */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">

          {/* ── Intelligence Brief — the signature feature ─────────── */}
          <motion.div
            className="lg:col-span-2 rounded-xl p-7 flex flex-col gap-5"
            style={{
              background: 'rgba(61,110,255,0.05)',
              border: '1px solid rgba(61,110,255,0.18)',
              boxShadow: '0 0 48px rgba(61,110,255,0.06)',
            }}
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, ease: EASE }}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <span style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.18em', color: 'rgba(61,110,255,0.8)', fontWeight: 600 }}>Signature Feature</span>
                <h3 style={{ fontSize: '22px', fontWeight: 700, color: '#fff', marginTop: '6px', letterSpacing: '-0.02em' }}>Intelligence Brief</h3>
                <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.45)', lineHeight: 1.6, marginTop: '6px', maxWidth: '380px' }}>
                  Six AI-generated bullets that decode exactly what the channel is doing right — and where competitors can strike.
                </p>
              </div>
              <div className="vm-icon-box flex-shrink-0" style={{ color: '#3D6EFF', background: 'rgba(61,110,255,0.1)', border: '1px solid rgba(61,110,255,0.2)' }}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                  <path d="M3 5H17M3 10H13M3 15H9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                </svg>
              </div>
            </div>
            {/* Live preview */}
            <div className="rounded-lg p-4 flex flex-col gap-2.5"
              style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.06)', borderLeft: '3px solid rgba(61,110,255,0.6)' }}>
              {[
                { icon: '↑', color: '#2DD4A7', text: 'Channel outperforms with outlier score 8.4/10 — driven by first-person story titles.' },
                { icon: '⚠', color: '#F5A623', text: 'Format Graveyard: "Number Countdown" averaged 4.2× channel avg but abandoned 14 months ago.' },
                { icon: '↑', color: '#2DD4A7', text: 'Win formula confirmed: Tuesday–Thursday uploads in the 14–17 min range consistently outperform.' },
                { icon: '↓', color: '#FF4D6A', text: 'Engagement rate 1.2% below YouTube average — passive viewership, low sponsor conversion.' },
              ].map((b, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <span style={{ fontFamily: 'monospace', fontSize: '11px', color: b.color, flexShrink: 0, marginTop: '1px', fontWeight: 700 }}>{b.icon}</span>
                  <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.55)', lineHeight: 1.5 }}>{b.text}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* ── Outlier Score ──────────────────────────────────────── */}
          <motion.div
            className="rounded-xl p-7 flex flex-col gap-4"
            style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)' }}
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, ease: EASE, delay: 0.1 }}>
            <div className="vm-icon-box" style={{ color: 'rgba(255,255,255,0.6)' }}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <path d="M2 14L7 9L11 13L15 7L18 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="18" cy="4" r="2" fill="currentColor" />
              </svg>
            </div>
            <div>
              <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#fff', letterSpacing: '-0.02em' }}>Outlier Detection</h3>
              <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', lineHeight: 1.6, marginTop: '6px' }}>
                Every video scored against the channel's own baseline. Breakouts up to 99× flagged instantly.
              </p>
            </div>
            {/* Score widget */}
            <div className="mt-auto pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="flex items-end justify-between mb-2">
                <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', fontFamily: 'monospace' }}>OUTLIER SCORE</span>
                <span style={{ fontSize: '32px', fontFamily: 'monospace', fontWeight: 700, color: '#fff', lineHeight: 1 }}>8.4</span>
              </div>
              <div style={{ height: '3px', background: 'rgba(255,255,255,0.07)', borderRadius: '999px', overflow: 'hidden' }}>
                <div style={{ width: '84%', height: '100%', background: 'linear-gradient(90deg, #3D6EFF, #2DD4A7)', borderRadius: '999px' }} />
              </div>
              <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.25)', marginTop: '6px', fontFamily: 'monospace' }}>Beats 94% of channels</p>
            </div>
          </motion.div>
        </div>

        {/* Bottom row: Win Formula + Format Graveyard + supporting features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {items.slice(2).map((item, i) => (
            <motion.div
              key={item.title}
              className="vm-card"
              style={{ cursor: 'default' }}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ duration: 0.5, ease: EASE, delay: i * 0.07 }}>
              <div className="vm-icon-box mb-4" style={{ color: 'rgba(255,255,255,0.6)' }}>
                {item.icon}
              </div>
              <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#fff', marginBottom: '6px' }}>{item.title}</h3>
              <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', lineHeight: 1.6 }}>{item.desc}</p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  )
}

// ── Spotlight Sections ──────────────────────────────────────────────────────
function Spotlight({
  badge,
  title,
  description,
  visual,
  reversed = false,
}: {
  badge: string
  title: string
  description: string
  visual: React.ReactNode
  reversed?: boolean
}) {
  return (
    <section style={{ background: '#000000', padding: 'clamp(40px, 8vw, 80px) clamp(16px, 4vw, 24px)', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
      <div
        className={`flex flex-col ${reversed ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-8 lg:gap-16`}
        style={{ maxWidth: '1100px', margin: '0 auto' }}
      >
        {/* Text */}
        <motion.div
          className="flex-1 flex flex-col gap-5"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: EASE }}
        >
          <span className="vm-badge" style={{ alignSelf: 'flex-start' }}>{badge}</span>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 700, letterSpacing: '-0.03em', color: '#fff', lineHeight: 1.1 }}>
            {title}
          </h2>
          <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.4)', lineHeight: 1.7 }}>
            {description}
          </p>
          <a
            href="/analyze"
            style={{
              alignSelf: 'flex-start',
              fontSize: '14px',
              color: 'rgba(255,255,255,0.5)',
              textDecoration: 'none',
              transition: 'color 150ms',
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#fff'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.5)'}
          >
            Try it live →
          </a>
        </motion.div>

        {/* Visual */}
        <motion.div
          className="flex-1 flex justify-center"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: EASE, delay: 0.15 }}
        >
          {visual}
        </motion.div>
      </div>
    </section>
  )
}

// ── Testimonials ──────────────────────────────────────────────────────────
function Testimonials() {
  const quotes = [
    {
      quote: "We spotted a Format Graveyard item from a competitor and produced four videos in that format. Three of them became our top performers that quarter.",
      name: 'Sarah Kwan',
      title: 'Head of Content Strategy, Condé Nast',
    },
    {
      quote: "The Intelligence Brief alone is worth the subscription. Our editorial team reads it before every strategy meeting. It's replaced a two-hour competitive analysis process.",
      name: 'James Portillo',
      title: 'VP Digital Content, Hearst Media',
    },
    {
      quote: "The win formula card is uncanny. It confirmed everything we suspected about posting windows — and showed us three patterns we'd completely missed.",
      name: 'Anika Brennan',
      title: 'Director of Strategy, WPP Group',
    },
  ]

  return (
    <section style={{ background: '#000000', padding: 'clamp(48px, 10vw, 120px) clamp(16px, 4vw, 24px)', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <motion.div
          className="flex flex-col items-center text-center mb-10 sm:mb-16"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: EASE }}
        >
          <span className="vm-badge mb-5">Client Outcomes</span>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 700, letterSpacing: '-0.03em', color: '#fff' }}>
            Used by the teams that set the agenda
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {quotes.map((q, i) => (
            <motion.div
              key={q.name}
              className="vm-card flex flex-col gap-5"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: EASE, delay: i * 0.1 }}
            >
              {/* Stars */}
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg key={i} width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                    <path d="M6 1L7.5 4.4L11 4.8L8.5 7.2L9.2 11L6 9.3L2.8 11L3.5 7.2L1 4.8L4.5 4.4L6 1Z" fill="rgba(255,255,255,0.4)" />
                  </svg>
                ))}
              </div>
              <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)', lineHeight: 1.7, flex: 1 }}>
                &ldquo;{q.quote}&rdquo;
              </p>
              <div>
                <p style={{ fontSize: '13px', fontWeight: 600, color: '#fff' }}>{q.name}</p>
                <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)', marginTop: '2px' }}>{q.title}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── Pricing ───────────────────────────────────────────────────────────────
function Pricing() {
  const tiers = [
    {
      name: 'Starter',
      price: '$149',
      period: '/mo',
      desc: 'For independent analysts and small agencies',
      features: ['10 channel analyses/mo', 'Intelligence Brief', 'Outlier scoring', 'Win Formula', 'PDF export'],
      cta: 'Start Free Trial',
      highlight: false,
    },
    {
      name: 'Pro Editorial',
      price: '$499',
      period: '/mo',
      desc: 'For editorial teams and media companies',
      features: ['Unlimited analyses', 'All features', 'Cadence Heatmap', 'Format Graveyard', 'CSV + JSON export', 'White-label reports', 'Priority support'],
      cta: 'Get Access ↗',
      highlight: true,
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: '',
      desc: 'For large organizations with custom needs',
      features: ['Volume licensing', 'SSO + SAML', 'Custom integrations', 'Dedicated CSM', 'SLA guarantee', 'Audit logs'],
      cta: 'Contact Sales',
      highlight: false,
    },
  ]

  return (
    <section id="pricing" style={{ background: '#000000', padding: 'clamp(48px, 10vw, 120px) clamp(16px, 4vw, 24px)', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <motion.div
          className="flex flex-col items-center text-center mb-10 sm:mb-16"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: EASE }}
        >
          <span className="vm-badge mb-5">Pricing</span>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 700, letterSpacing: '-0.03em', color: '#fff', marginBottom: '12px' }}>
            Select your tier
          </h2>
          <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.35)', maxWidth: '400px', lineHeight: 1.6 }}>
            Cancel any time. 14-day free trial on all plans.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center"
          variants={stagger(0.1)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
        >
          {tiers.map((tier) => (
            <motion.div
              key={tier.name}
              variants={fadeUp}
              style={{
                background: tier.highlight ? 'rgba(61,110,255,0.08)' : 'rgba(255,255,255,0.025)',
                border: `1px solid ${tier.highlight ? 'rgba(61,110,255,0.3)' : 'rgba(255,255,255,0.07)'}`,
                borderRadius: '12px',
                padding: tier.highlight ? '40px 32px' : '32px 28px',
                display: 'flex',
                flexDirection: 'column',
                gap: '20px',
                transform: tier.highlight ? 'scale(1.04)' : 'scale(1)',
              }}
            >
              {tier.highlight && (
                <span style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.15em', color: '#3D6EFF', fontWeight: 600 }}>Most Popular</span>
              )}
              <div>
                <p style={{ fontSize: '14px', fontWeight: 600, color: '#fff', marginBottom: '4px' }}>{tier.name}</p>
                <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)' }}>{tier.desc}</p>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="font-mono" style={{ fontSize: '40px', fontWeight: 700, color: '#fff', lineHeight: 1 }}>{tier.price}</span>
                {tier.period && <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)' }}>{tier.period}</span>}
              </div>
              <div className="flex flex-col gap-2.5">
                {tier.features.map((f) => (
                  <div key={f} className="flex items-center gap-2.5">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                      <circle cx="7" cy="7" r="6" stroke="rgba(255,255,255,0.15)" />
                      <path d="M4.5 7L6.5 9L9.5 5" stroke={tier.highlight ? '#3D6EFF' : 'rgba(255,255,255,0.5)'} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.55)' }}>{f}</span>
                  </div>
                ))}
              </div>
              <a
                href="/analyze"
                className={tier.highlight ? 'btn-primary' : 'btn-secondary'}
                style={{ marginTop: '8px', padding: '12px 24px', fontSize: '13px', textAlign: 'center', textDecoration: 'none' }}
              >
                {tier.cta}
              </a>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

// ── Logos / Social Proof ──────────────────────────────────────────────────
function LogoStrip() {
  const logos = ['Condé Nast', 'Hearst', 'Vox Media', 'BuzzFeed', 'Vice', 'The Atlantic', 'Group Nine', 'Dotdash', 'Meredith', 'Future plc']

  return (
    <section style={{ background: '#000000', padding: '60px 0', borderTop: '1px solid rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.04)', overflow: 'hidden' }}>
      <p style={{ textAlign: 'center', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.2em', color: 'rgba(255,255,255,0.2)', marginBottom: '32px' }}>
        Trusted by enterprise media teams at
      </p>
      <div className="relative overflow-hidden">
        <div className="vm-marquee-track">
          {[...logos, ...logos].map((logo, i) => (
            <span
              key={i}
              style={{
                fontSize: '14px',
                fontWeight: 600,
                color: 'rgba(255,255,255,0.2)',
                whiteSpace: 'nowrap',
                letterSpacing: '-0.01em',
                transition: 'color 200ms',
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.5)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.2)'}
            >
              {logo}
            </span>
          ))}
        </div>
        {/* Fade edges */}
        <div className="absolute inset-y-0 left-0 w-24" style={{ background: 'linear-gradient(to right, #000 0%, transparent 100%)' }} />
        <div className="absolute inset-y-0 right-0 w-24" style={{ background: 'linear-gradient(to left, #000 0%, transparent 100%)' }} />
      </div>
    </section>
  )
}

// ── Final CTA ─────────────────────────────────────────────────────────────
function FinalCTA() {
  return (
    <section style={{ background: '#000000', padding: 'clamp(60px, 12vw, 140px) clamp(16px, 4vw, 24px)', textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.04)', position: 'relative', overflow: 'hidden' }}>
      {/* Glow */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: '600px', height: '400px', borderRadius: '50%',
          background: 'radial-gradient(ellipse, rgba(61,110,255,0.15) 0%, transparent 70%)',
          top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
        }}
      />
      <motion.div
        className="relative z-10 flex flex-col items-center gap-8"
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: EASE }}
      >
        <h2 style={{ fontSize: 'clamp(36px, 6vw, 64px)', fontWeight: 700, letterSpacing: '-0.03em', color: '#fff', lineHeight: 1.05, maxWidth: '700px' }}>
          Intelligence is your unfair advantage.
        </h2>
        <p style={{ fontSize: '17px', color: 'rgba(255,255,255,0.4)', maxWidth: '440px', lineHeight: 1.65 }}>
          Start your 14-day free trial. No card required. Unlimited analyses during trial.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <a href="/analyze" className="btn-primary" style={{ padding: '12px 24px', fontSize: '15px', textDecoration: 'none' }}>
            Start Free Trial
            <span className="arrow-circle">↗</span>
          </a>
          <a href="/about" className="btn-secondary" style={{ padding: '11px 22px', fontSize: '15px', textDecoration: 'none' }}>
            Learn More
          </a>
        </div>
      </motion.div>
    </section>
  )
}

// ── Footer ────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer style={{ background: '#000000', borderTop: '1px solid rgba(255,255,255,0.05)', padding: 'clamp(32px, 6vw, 64px) clamp(16px, 4vw, 24px) 48px' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="mb-4">
              <a href="#top" style={{ fontFamily: "'Inter', 'DM Sans', system-ui, sans-serif", fontSize: '20px', fontWeight: 700, letterSpacing: '3px', color: '#FFFFFF', textTransform: 'uppercase', textDecoration: 'none' }}>VEXEL</a>
            </div>
            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.3)', lineHeight: 1.65, maxWidth: '200px' }}>
              YouTube competitor intelligence for enterprise media teams.
            </p>
          </div>
          {/* Links */}
          {[
            { heading: 'Product', links: [{ label: 'Features', href: '#features' }, { label: 'Pricing', href: '#pricing' }, { label: 'Changelog', href: '#' }] },
            { heading: 'Company', links: [{ label: 'About', href: '/about' }, { label: 'Blog', href: '#' }, { label: 'Careers', href: '#' }, { label: 'Press', href: '#' }] },
            { heading: 'Legal',   links: [{ label: 'Privacy', href: '#' }, { label: 'Terms', href: '#' }, { label: 'Security', href: '#' }, { label: 'API Docs', href: '#' }] },
          ].map((col) => (
            <div key={col.heading}>
              <p style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.25)', fontWeight: 600, marginBottom: '16px' }}>
                {col.heading}
              </p>
              <div className="flex flex-col gap-3">
                {col.links.map(({ label, href }) => (
                  <a key={label} href={href} style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', textDecoration: 'none', transition: 'color 150ms' }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#fff'}
                    onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.4)'}
                  >
                    {label}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="vm-rule" />
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mt-8">
          <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.2)' }}>
            © 2024 Vexel Intelligence. Built for the modern media stack.
          </p>
          <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.15)' }}>
            YouTube is a trademark of Google LLC.
          </p>
        </div>
      </div>
    </footer>
  )
}

// ── Spotlight visuals ──────────────────────────────────────────────────────
function MomentumVisual() {
  const bars1 = [35, 42, 38, 50, 60, 55, 70, 80]
  const bars2 = [25, 30, 28, 40, 52, 48, 58, 65]
  return (
    <div
      style={{
        width: '100%', maxWidth: '460px',
        background: 'rgba(255,255,255,0.025)',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: '12px',
        padding: '24px',
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <p style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.3)' }}>Momentum View</p>
        <div className="flex gap-3">
          {[{ label: '30-day', color: '#fff' }, { label: '90-day', color: 'rgba(255,255,255,0.3)' }].map((l) => (
            <div key={l.label} className="flex items-center gap-1.5">
              <div style={{ width: '8px', height: '2px', background: l.color, borderRadius: '1px' }} />
              <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.35)' }}>{l.label}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-end gap-2" style={{ height: '100px' }}>
        {bars1.map((_h, i) => (
          <div key={i} className="flex-1 flex flex-col gap-1 items-stretch">
            <div style={{ height: `${bars1[i]}%`, background: 'rgba(255,255,255,0.6)', borderRadius: '3px 3px 0 0', transition: 'height 300ms' }} />
            <div style={{ height: `${bars2[i]}%`, background: 'rgba(255,255,255,0.15)', borderRadius: '3px 3px 0 0', marginTop: 'auto' }} />
          </div>
        ))}
      </div>
    </div>
  )
}

function HeatmapVisual() {
  const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S']
  const times = ['AM', 'AFT', 'EVE', 'NGT']
  const data = [
    [0.2, 0.5, 0.3, 0.1],
    [0.8, 0.9, 0.6, 0.2],
    [0.4, 0.7, 0.95, 0.3],
    [0.1, 0.4, 0.8, 0.5],
    [0.3, 0.6, 0.7, 0.4],
    [0.6, 0.3, 0.2, 0.1],
    [0.5, 0.2, 0.1, 0.1],
  ]
  return (
    <div
      style={{
        width: '100%', maxWidth: '420px',
        background: 'rgba(255,255,255,0.025)',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: '12px',
        padding: '24px',
      }}
    >
      <p style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.3)', marginBottom: '16px' }}>Cadence Heatmap</p>
      <div className="flex gap-1">
        <div className="flex flex-col gap-1 mr-1" style={{ paddingTop: '20px' }}>
          {times.map((t) => <span key={t} style={{ fontSize: '8px', color: 'rgba(255,255,255,0.2)', height: '24px', display: 'flex', alignItems: 'center' }}>{t}</span>)}
        </div>
        {days.map((d, di) => (
          <div key={di} className="flex flex-col gap-1 flex-1">
            <span style={{ fontSize: '8px', color: 'rgba(255,255,255,0.3)', textAlign: 'center', marginBottom: '2px' }}>{d}</span>
            {data[di].map((v, ti) => (
              <div key={ti} style={{ height: '24px', borderRadius: '4px', background: `rgba(255,255,255,${0.04 + v * 0.5})`, border: '1px solid rgba(255,255,255,0.04)' }} />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

function GraveyardVisual() {
  const items = [
    { label: 'Number Countdown', months: '14 months ago', perf: '4.2×' },
    { label: 'Live Q&A Format', months: '11 months ago', perf: '3.8×' },
    { label: 'Product Unboxings', months: '8 months ago', perf: '3.1×' },
  ]
  return (
    <div
      style={{
        width: '100%', maxWidth: '420px',
        background: 'rgba(255,255,255,0.025)',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: '12px',
        padding: '24px',
      }}
    >
      <p style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.3)', marginBottom: '16px' }}>Format Graveyard</p>
      <div className="flex flex-col gap-2">
        {items.map((item) => (
          <div key={item.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', background: 'rgba(168,85,247,0.06)', border: '1px solid rgba(168,85,247,0.15)', borderRadius: '8px' }}>
            <div>
              <p style={{ fontSize: '12px', color: '#fff', fontWeight: 500 }}>{item.label}</p>
              <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', marginTop: '2px' }}>{item.months}</p>
            </div>
            <span className="font-mono" style={{ fontSize: '13px', color: '#A855F7', fontWeight: 600 }}>{item.perf}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────
export default function HomePage() {
  return (
    <main className="landing-cursor-hidden" style={{ background: 'transparent' }}>
      <ThreeBackground />
      <Navbar />
      <Hero />
      <StatsRow />
      <Features />
      <Spotlight
        badge="Momentum Tracking"
        title="See the 30-day vs 90-day trend before anyone else"
        description="Know exactly when a competitor's momentum is building — or breaking — weeks before it shows up in public reports. Our view trajectory comparison runs on every analysis."
        visual={<MomentumVisual />}
      />
      <Spotlight
        badge="Upload Cadence"
        title="Win the slot they're not posting in"
        description="The 7×4 cadence grid maps where they post against where they perform best. The gap between those two is your opportunity."
        visual={<HeatmapVisual />}
        reversed
      />
      <Spotlight
        badge="Format Graveyard"
        title="Mine winning formats your competitors abandoned"
        description="We track formats from 6–18 months ago that significantly outperformed channel averages but were quietly dropped. These are unclaimed territory — ready for you to own."
        visual={<GraveyardVisual />}
      />
      <LogoStrip />
      <Testimonials />
      <Pricing />
      <FinalCTA />
      <Footer />
    </main>
  )
}
