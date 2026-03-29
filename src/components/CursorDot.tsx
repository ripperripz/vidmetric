'use client'
import { useEffect, useRef } from 'react'

export default function CursorDot() {
  const dotRef  = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const mouse   = useRef({ x: -200, y: -200 })
  const pos     = useRef({ x: -200, y: -200 })
  const rafRef  = useRef<number>()
  const hovered = useRef(false)

  useEffect(() => {
    if (window.matchMedia('(hover: none)').matches) return

    const onMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX
      mouse.current.y = e.clientY
    }

    const onEnter = () => {
      hovered.current = true
      if (dotRef.current) {
        dotRef.current.style.transform = 'translate(-50%,-50%) scale(1.8)'
        dotRef.current.style.background = '#3D6EFF'
        dotRef.current.style.boxShadow = '0 0 8px rgba(61,110,255,0.6)'
      }
      if (ringRef.current) {
        ringRef.current.style.transform = 'translate(-50%,-50%) scale(1.5)'
        ringRef.current.style.opacity = '0'
      }
    }

    const onLeave = () => {
      hovered.current = false
      if (dotRef.current) {
        dotRef.current.style.transform = 'translate(-50%,-50%) scale(1)'
        dotRef.current.style.background = '#ffffff'
        dotRef.current.style.boxShadow = '0 0 4px rgba(255,255,255,0.3)'
      }
      if (ringRef.current) {
        ringRef.current.style.transform = 'translate(-50%,-50%) scale(1)'
        ringRef.current.style.opacity = '1'
      }
    }

    const animate = () => {
      const ease = 0.15
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

    // Use MutationObserver to handle dynamically added elements
    const attachListeners = () => {
      const interactables = document.querySelectorAll<Element>(
        'a, button, [role="button"], input, textarea, select, label'
      )
      interactables.forEach(el => {
        el.addEventListener('mouseenter', onEnter)
        el.addEventListener('mouseleave', onLeave)
      })
      return interactables
    }

    let interactables = attachListeners()

    window.addEventListener('mousemove', onMove, { passive: true })
    rafRef.current = requestAnimationFrame(animate)

    // Re-attach on DOM changes
    const observer = new MutationObserver(() => {
      interactables.forEach(el => {
        el.removeEventListener('mouseenter', onEnter)
        el.removeEventListener('mouseleave', onLeave)
      })
      interactables = attachListeners()
    })
    observer.observe(document.body, { childList: true, subtree: true })

    return () => {
      window.removeEventListener('mousemove', onMove)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      observer.disconnect()
      interactables.forEach(el => {
        el.removeEventListener('mouseenter', onEnter)
        el.removeEventListener('mouseleave', onLeave)
      })
    }
  }, [])

  return (
    <>
      {/* Outer ring — thin, subtle (hidden on touch devices) */}
      <div
        ref={ringRef}
        data-cursor-ring=""
        className="hidden md:block"
        style={{
          position:      'fixed',
          width:         '32px',
          height:        '32px',
          borderRadius:  '50%',
          border:        '1.5px solid rgba(255,255,255,0.25)',
          transform:     'translate(-50%,-50%)',
          pointerEvents: 'none',
          zIndex:        60,
          willChange:    'left, top',
          transition:    'transform 250ms cubic-bezier(0.16,1,0.3,1), opacity 200ms ease',
        }}
      />
      {/* Center dot — solid (hidden on touch devices) */}
      <div
        ref={dotRef}
        data-cursor-dot=""
        className="hidden md:block"
        style={{
          position:      'fixed',
          width:         '6px',
          height:        '6px',
          borderRadius:  '50%',
          background:    '#ffffff',
          boxShadow:     '0 0 4px rgba(255,255,255,0.3)',
          transform:     'translate(-50%,-50%)',
          pointerEvents: 'none',
          zIndex:        61,
          willChange:    'left, top',
          transition:    'transform 200ms cubic-bezier(0.16,1,0.3,1), background 200ms ease, box-shadow 200ms ease',
        }}
      />
    </>
  )
}
