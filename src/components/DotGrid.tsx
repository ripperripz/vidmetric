'use client'
import { useEffect } from 'react'

export default function DotGrid() {
  useEffect(() => {
    if (window.matchMedia('(hover: none)').matches) return

    const update = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth * 100).toFixed(1)
      const y = (e.clientY / window.innerHeight * 100).toFixed(1)
      document.documentElement.style.setProperty('--cx', x + '%')
      document.documentElement.style.setProperty('--cy', y + '%')
    }

    window.addEventListener('mousemove', update, { passive: true })
    return () => window.removeEventListener('mousemove', update)
  }, [])

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundImage: `radial-gradient(rgba(255,255,255,0.035) 1px, transparent 1px)`,
        backgroundSize: '36px 36px',
        pointerEvents: 'none',
        zIndex: 0,
        WebkitMaskImage: `radial-gradient(ellipse 600px 600px at var(--cx, 50%) var(--cy, 50%), black 0%, transparent 100%)`,
        maskImage: `radial-gradient(ellipse 600px 600px at var(--cx, 50%) var(--cy, 50%), black 0%, transparent 100%)`,
      }}
    />
  )
}
