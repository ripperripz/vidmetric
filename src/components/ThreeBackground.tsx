'use client'
import { useEffect, useRef } from 'react'
import * as THREE from 'three'

const PARTICLE_COUNT = 120
const MAX_TILT_RAD   = 10 * (Math.PI / 180)  // ±10 degrees
const SCROLL_SPEED   = 0.018                  // units per scroll-px
const LERP_EASE      = 0.06                   // cursor parallax lag

// ── Distribute particles in a wide, deep box ─────────────────────────
function buildGeometry(): THREE.BufferGeometry {
  const positions = new Float32Array(PARTICLE_COUNT * 3)
  const colors    = new Float32Array(PARTICLE_COUNT * 3)

  // A handful of very dim cool-tone base colours
  const palette = [
    [0.88, 0.90, 1.00],   // near-white with faint blue cast
    [0.55, 0.62, 0.82],   // muted steel blue
    [0.65, 0.68, 0.78],   // cool grey
    [0.80, 0.82, 0.92],   // pale silver
    [0.42, 0.50, 0.72],   // dim indigo
  ]

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    // Spread across a deep 3-D corridor: wide x, moderate y, very deep z
    positions[i * 3]     = (Math.random() - 0.5) * 100  // x ±50
    positions[i * 3 + 1] = (Math.random() - 0.5) * 60   // y ±30
    positions[i * 3 + 2] = -200 + Math.random() * 240   // z −200 → +40

    const [r, g, b] = palette[Math.floor(Math.random() * palette.length)]
    // Random dim multiplier so each star has its own perceived brightness
    const dim = 0.06 + Math.random() * 0.28
    colors[i * 3]     = r * dim
    colors[i * 3 + 1] = g * dim
    colors[i * 3 + 2] = b * dim
  }

  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geo.setAttribute('color',    new THREE.BufferAttribute(colors, 3))
  return geo
}

// ── Component ─────────────────────────────────────────────────────────
export default function ThreeBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || typeof window === 'undefined') return

    // Skip the effect on low-performance / touch devices
    const isMobile = window.matchMedia('(hover: none)').matches
    const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (isMobile || isReducedMotion) return

    // ── Renderer ─────────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setClearColor(0x000000, 0)

    // ── Scene ────────────────────────────────────────────────────────
    const scene  = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      400,
    )
    camera.position.z = 50

    // ── Points ───────────────────────────────────────────────────────
    const geometry = buildGeometry()
    const material = new THREE.PointsMaterial({
      vertexColors:   true,
      size:           0.45,
      sizeAttenuation: true,
      transparent:    true,
      opacity:        0.9,
      depthWrite:     false,
    })
    const points = new THREE.Points(geometry, material)
    const group  = new THREE.Group()
    group.add(points)
    scene.add(group)

    // ── State: parallax targets ───────────────────────────────────────
    const mouse   = { x: 0, y: 0 }
    const tilted  = { x: 0, y: 0 }
    const targetT = { x: 0, y: 0 }

    // ── Mouse → parallax target ───────────────────────────────────────
    function onMouseMove(e: MouseEvent) {
      // Normalise to −1 … +1
      const nx =  (e.clientX / window.innerWidth  - 0.5) * 2
      const ny = -(e.clientY / window.innerHeight - 0.5) * 2
      mouse.x = nx
      mouse.y = ny
      targetT.y =  nx * MAX_TILT_RAD
      targetT.x = -ny * MAX_TILT_RAD * 0.55
    }
    window.addEventListener('mousemove', onMouseMove, { passive: true })

    // ── Scroll → camera drift ─────────────────────────────────────────
    // Camera moves forward (−z) as the user scrolls down.
    // Particles are spread from z −200 → +40 so there's plenty of depth.
    let targetZ = 50
    function onScroll() {
      targetZ = 50 - window.scrollY * SCROLL_SPEED
    }
    window.addEventListener('scroll', onScroll, { passive: true })

    // ── Resize ────────────────────────────────────────────────────────
    function onResize() {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }
    window.addEventListener('resize', onResize)

    // ── Render loop ───────────────────────────────────────────────────
    const clock = new THREE.Clock()
    let rafId: number

    function animate() {
      rafId = requestAnimationFrame(animate)
      const dt = Math.min(clock.getDelta(), 0.05)  // cap delta so tab-switch doesn't jump

      // Frame-rate–independent lerp factor
      const t = 1 - Math.pow(1 - LERP_EASE, dt * 60)

      // Parallax tilt
      tilted.x = THREE.MathUtils.lerp(tilted.x, targetT.x, t)
      tilted.y = THREE.MathUtils.lerp(tilted.y, targetT.y, t)
      group.rotation.x = tilted.x
      group.rotation.y = tilted.y

      // Scroll drift — lerp camera z toward scroll target
      camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, t * 0.6)

      // Slow passive auto-drift to keep the scene feeling alive when idle
      group.rotation.z += dt * 0.006

      renderer.render(scene, camera)
    }
    animate()

    // ── Cleanup ───────────────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('scroll',    onScroll)
      window.removeEventListener('resize',    onResize)
      geometry.dispose()
      material.dispose()
      renderer.dispose()
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position:      'fixed',
        top:           0,
        left:          0,
        width:         '100%',
        height:        '100%',
        zIndex:        0,
        pointerEvents: 'none',
        display:       'block',
      }}
    />
  )
}
