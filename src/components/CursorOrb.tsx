'use client'
import { useEffect, useRef } from 'react'

export default function CursorOrb() {
  const orbRef = useRef<HTMLDivElement>(null)
  const mouse = useRef({ x: -1000, y: -1000 })
  const current = useRef({ x: -1000, y: -1000 })
  const rafRef = useRef<number>()

  useEffect(() => {
    if (window.matchMedia('(hover: none)').matches) return

    const onMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX
      mouse.current.y = e.clientY
    }

    const animate = () => {
      const ease = 0.055
      current.current.x += (mouse.current.x - current.current.x) * ease
      current.current.y += (mouse.current.y - current.current.y) * ease

      if (orbRef.current) {
        orbRef.current.style.left = current.current.x + 'px'
        orbRef.current.style.top = current.current.y + 'px'
      }

      rafRef.current = requestAnimationFrame(animate)
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    rafRef.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('mousemove', onMove)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return (
    <div
      ref={orbRef}
      style={{
        position: 'fixed',
        width: '700px',
        height: '700px',
        borderRadius: '50%',
        background: `radial-gradient(circle at center,
          rgba(79, 126, 255, 0.07) 0%,
          rgba(79, 126, 255, 0.04) 25%,
          rgba(79, 126, 255, 0.015) 50%,
          transparent 70%)`,
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'none',
        zIndex: 1,
        willChange: 'left, top',
      }}
    />
  )
}
