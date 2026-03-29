'use client'

import { useState, useEffect } from 'react'

const NAV_ITEMS = [
  {
    label: 'Home',
    href: '/dashboard',
    icon: (
      <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path d="M2 6.5L8 2L14 6.5V14H10V10H6V14H2V6.5Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    label: 'New Analysis',
    href: '/analyze',
    icon: (
      <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.3" />
        <path d="M11 11L14 14" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
        <path d="M7 4.5V9.5M4.5 7H9.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    label: 'Saved',
    href: '/saved',
    icon: (
      <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path d="M3 2H13C13.6 2 14 2.4 14 3V14L8 11L2 14V3C2 2.4 2.4 2 3 2Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    label: 'Reports',
    href: '/reports',
    icon: (
      <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <rect x="2" y="2" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.3" />
        <path d="M5 11V8M8 11V6M11 11V9" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    label: 'Settings',
    href: '/settings',
    icon: (
      <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <circle cx="8" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.3" />
        <path d="M8 1V3M8 13V15M1 8H3M13 8H15M3 3L4.5 4.5M11.5 11.5L13 13M3 13L4.5 11.5M11.5 4.5L13 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      </svg>
    ),
  },
]

const BOTTOM_ITEMS = [
  {
    label: 'Support', href: '#', icon: (
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.3" />
        <path d="M8 9V8.5C8 7.7 8.6 7.3 9.2 6.9C9.7 6.6 10 6.1 10 5.5C10 4.4 9.1 3.5 8 3.5C6.9 3.5 6 4.4 6 5.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
        <circle cx="8" cy="11.5" r="0.7" fill="currentColor" />
      </svg>
    )
  },
]

export function AppSidebar({ active }: { active: string }) {
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    function onResize() {
      if (window.innerWidth >= 768) setMobileOpen(false)
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  return (
    <>
      {/* ── Mobile hamburger ──────────────────────────────────────── */}
      <button
        type="button"
        className="md:hidden fixed z-[55] flex items-center justify-center"
        style={{
          top: 'env(safe-area-inset-top, 0px)', left: 0,
          width: '56px', height: '56px',
          minHeight: '44px', minWidth: '44px',
          background: 'transparent', border: 'none', cursor: 'pointer',
          color: 'rgba(255,255,255,0.6)',
        }}
        onClick={() => setMobileOpen(true)}
        aria-label="Open navigation"
      >
        <svg width="18" height="14" viewBox="0 0 18 14" fill="none">
          <path d="M0 1H18M0 7H18M0 13H18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      </button>

      {/* ── Backdrop ──────────────────────────────────────────────── */}
      <div
        className="md:hidden fixed inset-0 z-[48] transition-opacity duration-300"
        style={{
          background: 'rgba(0,0,0,0.75)',
          backdropFilter: 'blur(4px)',
          opacity: mobileOpen ? 1 : 0,
          pointerEvents: mobileOpen ? 'auto' : 'none',
        }}
        onClick={() => setMobileOpen(false)}
      />

      {/* ── Sidebar ───────────────────────────────────────────────── */}
      <aside
        className={`w-[220px] h-screen fixed left-0 top-0 flex flex-col z-[49] transition-transform duration-300 md:translate-x-0 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}
        style={{
          background: '#06060E',
          borderRight: '1px solid rgba(255,255,255,0.05)',
          transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* Logo row with close button on mobile */}
        <div className="px-5 py-5 flex items-center justify-between" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
          <a href="/" className="flex items-center no-underline" onClick={() => setMobileOpen(false)}>
            <span style={{ fontFamily: "'Inter', 'DM Sans', system-ui, sans-serif", fontSize: '20px', fontWeight: 700, letterSpacing: '3px', color: '#FFFFFF', textTransform: 'uppercase' }}>
              VEXEL
            </span>
          </a>
          <button
            type="button"
            className="md:hidden flex items-center justify-center rounded-lg"
            style={{ width: '44px', height: '44px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.5)', cursor: 'pointer' }}
            onClick={() => setMobileOpen(false)}
            aria-label="Close navigation"
          >
            <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
              <path d="M1 1L10 10M10 1L1 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Main nav */}
        <nav className="flex-1 flex flex-col py-3 px-2.5 gap-0.5 overflow-y-auto">
          {NAV_ITEMS.map(({ label, href, icon }) => {
            const isActive = active === label
            return (
              <a
                key={label}
                href={href}
                className="flex items-center gap-3 px-3 rounded-lg font-medium no-underline transition-all duration-150"
                style={{
                  height: '44px',
                  fontSize: '12.5px',
                  ...(isActive
                    ? { background: 'rgba(61,110,255,0.1)', color: '#fff' }
                    : { color: 'rgba(255,255,255,0.35)' }),
                }}
                onClick={() => setMobileOpen(false)}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.color = 'rgba(255,255,255,0.7)'
                    e.currentTarget.style.background = 'rgba(255,255,255,0.03)'
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.color = 'rgba(255,255,255,0.35)'
                    e.currentTarget.style.background = 'transparent'
                  }
                }}
              >
                <span style={{ opacity: isActive ? 1 : 0.5, flexShrink: 0, color: isActive ? '#3D6EFF' : 'currentColor' }}>
                  {icon}
                </span>
                <span>{label}</span>
                {isActive && (
                  <div
                    className="ml-auto w-1.5 h-1.5 rounded-full flex-shrink-0"
                    style={{ background: '#3D6EFF', boxShadow: '0 0 6px rgba(61,110,255,0.8)' }}
                  />
                )}
              </a>
            )
          })}
        </nav>

        {/* Plan card */}
        <div className="px-2.5 mb-3">
          <div
            className="rounded-xl p-4 flex flex-col gap-3"
            style={{ background: 'rgba(61,110,255,0.06)', border: '1px solid rgba(61,110,255,0.12)' }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p style={{ fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.25)', marginBottom: '2px' }}>Plan</p>
                <p style={{ fontSize: '12px', fontWeight: 600, color: '#fff' }}>Pro Editorial</p>
              </div>
              <span style={{ fontSize: '9px', fontFamily: 'monospace', color: '#3D6EFF', border: '1px solid rgba(61,110,255,0.3)', borderRadius: '999px', padding: '2px 7px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                PRO
              </span>
            </div>
            <a
              href="/settings#billing"
              style={{
                display: 'block', textAlign: 'center', fontSize: '11px', fontWeight: 600,
                color: '#3D6EFF', textDecoration: 'none', padding: '7px 12px',
                background: 'rgba(61,110,255,0.1)', border: '1px solid rgba(61,110,255,0.2)',
                borderRadius: '8px', transition: 'all 150ms',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(61,110,255,0.18)'; e.currentTarget.style.borderColor = 'rgba(61,110,255,0.35)' }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(61,110,255,0.1)'; e.currentTarget.style.borderColor = 'rgba(61,110,255,0.2)' }}
            >
              Upgrade to Pro
            </a>
          </div>
        </div>

        {/* Bottom */}
        <div className="px-2.5 pb-4 flex flex-col gap-0.5" style={{ borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: '12px' }}>
          {BOTTOM_ITEMS.map(({ label, href, icon }) => (
            <a
              key={label}
              href={href}
              className="flex items-center gap-3 px-3 py-2 rounded-lg no-underline transition-all duration-150"
              style={{ color: 'rgba(255,255,255,0.25)', fontSize: '12px' }}
              onMouseEnter={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.6)'; e.currentTarget.style.background = 'rgba(255,255,255,0.03)' }}
              onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.25)'; e.currentTarget.style.background = 'transparent' }}
            >
              <span style={{ opacity: 0.5, flexShrink: 0 }}>{icon}</span>
              {label}
            </a>
          ))}

          <div className="flex items-center gap-2.5 px-3 py-2 mt-1">
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
            >
              <span style={{ fontSize: '10px', fontWeight: 600, color: 'rgba(255,255,255,0.5)' }}>AC</span>
            </div>
            <div style={{ minWidth: 0 }}>
              <p style={{ fontSize: '12px', fontWeight: 500, color: 'rgba(255,255,255,0.7)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Alex Chen</p>
              <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.2)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Lead Strategist</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}
