'use client'
import { useEffect, useRef } from 'react'

// Both dot and ring share one lerped position so the dot is always
// the center of the ring — giving a clear, coherent cursor.
export default function CursorDot() {
  const dotRef  = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const mouse   = useRef({ x: -200, y: -200 })
  const pos     = useRef({ x: -200, y: -200 })   // single shared lerped position
  const rafRef  = useRef<number>()

  useEffect(() => {
    if (window.matchMedia('(hover: none)').matches) return

    const onMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX
      mouse.current.y = e.clientY
    }

    const onEnter = () => {
      if (dotRef.current)  dotRef.current.style.transform  = 'translate(-50%,-50%) scale(0)'
      if (ringRef.current) {
        ringRef.current.style.transform   = 'translate(-50%,-50%) scale(1.7)'
        ringRef.current.style.borderColor = 'rgba(61,110,255,0.7)'
        ringRef.current.style.borderWidth = '1.5px'
      }
    }

    const onLeave = () => {
      if (dotRef.current)  dotRef.current.style.transform  = 'translate(-50%,-50%) scale(1)'
      if (ringRef.current) {
        ringRef.current.style.transform   = 'translate(-50%,-50%) scale(1)'
        ringRef.current.style.borderColor = 'rgba(255,255,255,0.5)'
        ringRef.current.style.borderWidth = '1px'
      }
    }

    const animate = () => {
      // One lerp controls both — they always move together
      const ease = 0.14
      pos.current.x += (mouse.current.x - pos.current.x) * ease
      pos.current.y += (mouse.current.y - pos.current.y) * ease

      const x = pos.current.x
      const y = pos.current.y

      if (dotRef.current) {
        dotRef.current.style.left = x + 'px'
        dotRef.current.style.top  = y + 'px'
      }
      if (ringRef.current) {
        ringRef.current.style.left = x + 'px'
        ringRef.current.style.top  = y + 'px'
      }

      rafRef.current = requestAnimationFrame(animate)
    }

    const interactables = document.querySelectorAll<Element>(
      'a, button, [role="button"], input, textarea, select, label'
    )
    interactables.forEach(el => {
      el.addEventListener('mouseenter', onEnter)
      el.addEventListener('mouseleave', onLeave)
    })

    window.addEventListener('mousemove', onMove, { passive: true })
    rafRef.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('mousemove', onMove)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      interactables.forEach(el => {
        el.removeEventListener('mouseenter', onEnter)
        el.removeEventListener('mouseleave', onLeave)
      })
    }
  }, [])

  return (
    <>
      {/* Ring — outer boundary */}
      <div
        ref={ringRef}
        style={{
          position:      'fixed',
          width:         '28px',
          height:        '28px',
          borderRadius:  '50%',
          border:        '1px solid rgba(255,255,255,0.5)',
          transform:     'translate(-50%,-50%)',
          pointerEvents: 'none',
          zIndex:        9999,
          willChange:    'left, top',
          transition:    'transform 200ms cubic-bezier(0.16,1,0.3,1), border-color 150ms ease, border-width 150ms ease',
        }}
      />
      {/* Center dot — always co-located with ring */}
      <div
        ref={dotRef}
        style={{
          position:      'fixed',
          width:         '4px',
          height:        '4px',
          borderRadius:  '50%',
          background:    '#ffffff',
          transform:     'translate(-50%,-50%)',
          pointerEvents: 'none',
          zIndex:        10000,
          willChange:    'left, top',
          transition:    'transform 180ms cubic-bezier(0.16,1,0.3,1)',
        }}
      />
    </>
  )
}
