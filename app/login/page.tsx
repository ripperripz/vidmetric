'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'

const EASE = [0.16, 1, 0.3, 1] as const

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!email) { setError('Email is required.'); return }
    if (password.length < 6) { setError('Password must be 6+ characters.'); return }
    setLoading(true)
    setTimeout(() => router.push('/analysis'), 900)
  }

  const stats = [
    { value: '94.2%', label: 'Precision accuracy' },
    { value: '1.2B+', label: 'Data points analyzed' },
    { value: '< 40ms', label: 'Inference latency' },
  ]

  return (
    <div className="flex min-h-screen" style={{ background: '#000000' }}>

      {/* ── Left panel ─────────────────────────────────────────────── */}
      <div
        className="hidden lg:flex flex-col justify-between"
        style={{
          width: '42%',
          flexShrink: 0,
          background: '#080810',
          borderRight: '1px solid rgba(255,255,255,0.06)',
          padding: '48px 52px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Subtle grid */}
        <div className="absolute inset-0 dot-grid opacity-30 pointer-events-none" />

        {/* Blue glow accent top-right */}
        <div
          className="absolute top-0 right-0 pointer-events-none"
          style={{
            width: '400px', height: '400px', borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(61,110,255,0.12) 0%, transparent 65%)',
            transform: 'translate(30%, -30%)',
          }}
        />

        {/* Logo */}
        <a href="/" className="no-underline relative z-10">
          <span style={{ fontFamily: "'Inter', 'DM Sans', system-ui, sans-serif", fontSize: '20px', fontWeight: 700, letterSpacing: '3px', color: '#FFFFFF', textTransform: 'uppercase' }}>VEXEL</span>
        </a>

        {/* Hero copy */}
        <motion.div
          className="relative z-10"
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: EASE, delay: 0.1 }}
        >
          <h1
            style={{
              fontSize: 'clamp(40px, 4vw, 56px)',
              fontWeight: 700,
              fontStyle: 'italic',
              letterSpacing: '-0.03em',
              color: '#ffffff',
              lineHeight: 1.1,
              marginBottom: '20px',
            }}
          >
            Intelligence is<br />your unfair<br />advantage.
          </h1>
          <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.35)', lineHeight: 1.65, maxWidth: '340px' }}>
            Deploy your quantitative edge against competitors before they know what hit them.
          </p>
          <div
            style={{ width: '40px', height: '2px', background: 'rgba(255,255,255,0.15)', borderRadius: '1px', marginTop: '24px' }}
          />
        </motion.div>

        {/* Stats */}
        <motion.div
          className="flex gap-8 relative z-10"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE, delay: 0.3 }}
        >
          {stats.map((s) => (
            <div key={s.label}>
              <p className="font-mono" style={{ fontSize: '18px', fontWeight: 700, color: '#00D4A1', lineHeight: 1 }}>{s.value}</p>
              <p style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'rgba(255,255,255,0.25)', marginTop: '5px' }}>{s.label}</p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* ── Right panel ────────────────────────────────────────────── */}
      <div
        className="flex-1 flex flex-col items-center justify-center"
        style={{ padding: '48px 32px', background: '#000000' }}
      >
        <motion.div
          className="w-full"
          style={{ maxWidth: '400px' }}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE, delay: 0.05 }}
        >
          {/* Heading */}
          <div className="mb-8">
            <h2 style={{ fontSize: '26px', fontWeight: 600, fontStyle: 'italic', color: '#fff', letterSpacing: '-0.02em', marginBottom: '6px' }}>
              Access Intelligence
            </h2>
            <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.35)' }}>
              Deploy your quantitative advantage today.
            </p>
          </div>

          {/* Google SSO */}
          <button
            type="button"
            onClick={() => router.push('/analysis')}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              padding: '12px 20px',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '10px',
              fontSize: '14px',
              fontWeight: 500,
              color: '#fff',
              cursor: 'pointer',
              transition: 'all 150ms',
              marginBottom: '20px',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.07)'
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.18)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.04)'
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'
            }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M15.5 8.2c0-.5 0-1-.1-1.5H8v2.8h4.2c-.2 1-.8 1.8-1.6 2.4v2h2.6c1.5-1.4 2.3-3.4 2.3-5.7Z" fill="#4285F4" />
              <path d="M8 16c2.1 0 3.9-.7 5.2-1.9l-2.6-2c-.7.5-1.6.8-2.6.8-2 0-3.7-1.3-4.3-3.1H1v2.1C2.4 14.2 5 16 8 16Z" fill="#34A853" />
              <path d="M3.7 9.8C3.5 9.2 3.4 8.6 3.4 8s.1-1.2.3-1.8V4.1H1C.4 5.3 0 6.6 0 8s.4 2.7 1 3.9l2.7-2.1Z" fill="#FBBC05" />
              <path d="M8 3.2c1.1 0 2.1.4 2.9 1.1l2.1-2.1C11.8.8 10.1 0 8 0 5 0 2.4 1.8 1 4.5l2.7 2.1C4.3 4.6 6 3.2 8 3.2Z" fill="#EA4335" />
            </svg>
            Continue with Google
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-5">
            <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.07)' }} />
            <span style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.2em', color: 'rgba(255,255,255,0.2)' }}>Or identity provider</span>
            <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.07)' }} />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.14em', color: 'rgba(255,255,255,0.3)', fontWeight: 600 }}>
                Terminal ID (Email)
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@enterprise.com"
                style={{
                  width: '100%',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '10px',
                  padding: '12px 16px',
                  fontSize: '14px',
                  color: '#fff',
                  outline: 'none',
                  transition: 'border-color 150ms',
                  fontFamily: 'monospace',
                }}
                onFocus={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.2)'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.14em', color: 'rgba(255,255,255,0.3)', fontWeight: 600 }}>
                  Secret Key
                </label>
                <a href="#" style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', textDecoration: 'none' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#fff'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.3)'}
                >
                  Lost access?
                </a>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{
                  width: '100%',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '10px',
                  padding: '12px 16px',
                  fontSize: '14px',
                  color: '#fff',
                  outline: 'none',
                  transition: 'border-color 150ms',
                }}
                onFocus={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.2)'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
              />
            </div>

            {/* Error */}
            {error && (
              <p style={{ fontSize: '12px', color: '#FF4D6A', fontFamily: 'monospace' }}>{error}</p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="vm-btn-accent"
              style={{ padding: '14px 24px', fontSize: '13px', borderRadius: '10px', marginTop: '8px', letterSpacing: '0.08em', opacity: loading ? 0.7 : 1 }}
            >
              {loading ? '◌ Authenticating...' : 'Initialize Session'}
            </button>
          </form>

          {/* Footer note */}
          <p style={{ marginTop: '20px', fontSize: '12px', color: 'rgba(255,255,255,0.2)', textAlign: 'center', lineHeight: 1.65 }}>
            Unauthorized access is strictly monitored.{' '}
            <a href="#" style={{ color: 'rgba(255,255,255,0.4)', textDecoration: 'none' }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#fff'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.4)'}
            >
              Request Provisioning
            </a>
          </p>

          {/* Bottom links */}
          <div className="flex justify-center gap-6 mt-6">
            {['Privacy', 'Terms', 'Security'].map((l) => (
              <a key={l} href="#" style={{ fontSize: '11px', color: 'rgba(255,255,255,0.2)', textDecoration: 'none' }}
                onMouseEnter={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.5)'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.2)'}
              >
                {l}
              </a>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
