'use client'
import { useEffect, useRef } from 'react'
import * as THREE from 'three'

// ── Config ──────────────────────────────────────────────────────────────
const NODE_COUNT     = 90
const SPREAD         = 20
const CONNECT_DIST   = 3.5
const MAX_LINES      = 250
const DRIFT_SPEED    = 0.06
const CURSOR_RADIUS  = 6
const CURSOR_PUSH    = 0.8
const CURSOR_LERP    = 0.035
const MAX_TILT       = 0.15
const SCROLL_FACTOR  = 0.0004

export default function ThreeBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || typeof window === 'undefined') return

    const isMobile  = window.matchMedia('(hover: none)').matches
    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (isReduced) return

    const nodeCount = isMobile ? 45 : NODE_COUNT

    // ── Renderer ────────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1 : 2))
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setClearColor(0x000000, 0)

    const scene  = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 100)
    camera.position.z = 15

    // ── Dot texture — soft glowing circle ───────────────────────────
    const dotCanvas = document.createElement('canvas')
    dotCanvas.width = 64
    dotCanvas.height = 64
    const dotCtx = dotCanvas.getContext('2d')!
    const dotGrad = dotCtx.createRadialGradient(32, 32, 0, 32, 32, 32)
    dotGrad.addColorStop(0, 'rgba(255,255,255,1)')
    dotGrad.addColorStop(0.15, 'rgba(200,220,255,0.9)')
    dotGrad.addColorStop(0.4, 'rgba(100,150,255,0.35)')
    dotGrad.addColorStop(0.7, 'rgba(61,110,255,0.08)')
    dotGrad.addColorStop(1, 'rgba(0,0,0,0)')
    dotCtx.fillStyle = dotGrad
    dotCtx.fillRect(0, 0, 64, 64)
    const dotTex = new THREE.CanvasTexture(dotCanvas)

    // ── Particle nodes ──────────────────────────────────────────────
    interface Node {
      pos: THREE.Vector3
      vel: THREE.Vector3
      baseY: number
      phase: number
      size: number
    }

    const nodes: Node[] = []
    const positions = new Float32Array(nodeCount * 3)
    const sizes     = new Float32Array(nodeCount)

    for (let i = 0; i < nodeCount; i++) {
      const x = (Math.random() - 0.5) * SPREAD
      const y = (Math.random() - 0.5) * SPREAD * 0.65
      const z = (Math.random() - 0.5) * 10 - 2
      const s = 0.8 + Math.random() * 2.0
      nodes.push({
        pos: new THREE.Vector3(x, y, z),
        vel: new THREE.Vector3(
          (Math.random() - 0.5) * DRIFT_SPEED,
          (Math.random() - 0.5) * DRIFT_SPEED * 0.4,
          (Math.random() - 0.5) * DRIFT_SPEED * 0.2,
        ),
        baseY: y,
        phase: Math.random() * Math.PI * 2,
        size: s,
      })
      positions[i * 3]     = x
      positions[i * 3 + 1] = y
      positions[i * 3 + 2] = z
      sizes[i] = s
    }

    const pointsGeo = new THREE.BufferGeometry()
    pointsGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    pointsGeo.setAttribute('size', new THREE.BufferAttribute(sizes, 1))

    const pointsMat = new THREE.PointsMaterial({
      map: dotTex,
      size: 0.22,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.6,
      color: new THREE.Color(0.5, 0.65, 1.0),
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
    const points = new THREE.Points(pointsGeo, pointsMat)
    scene.add(points)

    // ── Connection lines ────────────────────────────────────────────
    const linePositions = new Float32Array(MAX_LINES * 6)
    const lineColors    = new Float32Array(MAX_LINES * 6)
    const lineGeo = new THREE.BufferGeometry()
    lineGeo.setAttribute('position', new THREE.BufferAttribute(linePositions, 3))
    lineGeo.setAttribute('color', new THREE.BufferAttribute(lineColors, 3))
    lineGeo.setDrawRange(0, 0)

    const lineMat = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.25,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
    const lines = new THREE.LineSegments(lineGeo, lineMat)
    scene.add(lines)

    // ── Ambient glow layers ─────────────────────────────────────────
    function makeGlow(size: number, opacity: number, color: THREE.Color): THREE.Sprite {
      const c = document.createElement('canvas')
      c.width = 128; c.height = 128
      const cx = c.getContext('2d')!
      const g = cx.createRadialGradient(64, 64, 0, 64, 64, 64)
      g.addColorStop(0, 'rgba(255,255,255,0.6)')
      g.addColorStop(0.2, 'rgba(120,160,255,0.25)')
      g.addColorStop(0.5, 'rgba(61,110,255,0.08)')
      g.addColorStop(1, 'rgba(0,0,0,0)')
      cx.fillStyle = g
      cx.fillRect(0, 0, 128, 128)
      const tex = new THREE.CanvasTexture(c)
      const mat = new THREE.SpriteMaterial({
        map: tex,
        color,
        transparent: true,
        opacity,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      })
      const sprite = new THREE.Sprite(mat)
      sprite.scale.set(size, size, 1)
      return sprite
    }

    // Main center glow
    const glow1 = makeGlow(16, 0.12, new THREE.Color(0.25, 0.4, 1.0))
    glow1.position.set(0, 0, -5)
    scene.add(glow1)

    // Secondary offset glow for depth
    const glow2 = makeGlow(10, 0.06, new THREE.Color(0.2, 0.6, 0.8))
    glow2.position.set(4, -2, -8)
    scene.add(glow2)

    // ── A few brighter "star" nodes for visual interest ─────────────
    const starCount = isMobile ? 4 : 8
    const starPositions = new Float32Array(starCount * 3)
    for (let i = 0; i < starCount; i++) {
      starPositions[i * 3]     = (Math.random() - 0.5) * SPREAD * 0.8
      starPositions[i * 3 + 1] = (Math.random() - 0.5) * SPREAD * 0.5
      starPositions[i * 3 + 2] = (Math.random() - 0.5) * 6 - 1
    }
    const starGeo = new THREE.BufferGeometry()
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3))
    const starMat = new THREE.PointsMaterial({
      map: dotTex,
      size: 0.35,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.85,
      color: new THREE.Color(0.7, 0.8, 1.0),
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
    const stars = new THREE.Points(starGeo, starMat)
    scene.add(stars)

    // ── Interaction state ───────────────────────────────────────────
    const mouse3D = new THREE.Vector3(999, 999, 0) // offscreen default
    const current = { rx: 0, ry: 0 }
    const target  = { rx: 0, ry: 0 }
    const baseCamZ = camera.position.z
    let targetCamZ = baseCamZ

    function onMouseMove(e: MouseEvent) {
      const nx = (e.clientX / window.innerWidth - 0.5) * 2
      const ny = -(e.clientY / window.innerHeight - 0.5) * 2
      mouse3D.x = nx * (SPREAD * 0.5)
      mouse3D.y = ny * (SPREAD * 0.35)
      target.ry =  nx * MAX_TILT
      target.rx = -ny * MAX_TILT * 0.6
    }

    function onScroll() {
      targetCamZ = baseCamZ + window.scrollY * SCROLL_FACTOR
    }

    function onResize() {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }

    if (!isMobile) window.addEventListener('mousemove', onMouseMove, { passive: true })
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onResize)

    // ── Render loop ─────────────────────────────────────────────────
    const clock = new THREE.Clock()
    let rafId: number
    const halfSpread = SPREAD * 0.55

    function animate() {
      rafId = requestAnimationFrame(animate)
      const dt = Math.min(clock.getDelta(), 0.05)
      const elapsed = clock.elapsedTime
      const t = 1 - Math.pow(1 - CURSOR_LERP, dt * 60)

      // Smooth camera
      current.rx = THREE.MathUtils.lerp(current.rx, target.rx, t)
      current.ry = THREE.MathUtils.lerp(current.ry, target.ry, t)
      camera.position.z += (targetCamZ - camera.position.z) * 0.03

      // Subtle scene tilt from cursor
      scene.rotation.x = current.rx * 0.3
      scene.rotation.y = current.ry * 0.3

      // Update nodes
      const posArr = pointsGeo.attributes.position.array as Float32Array
      for (let i = 0; i < nodeCount; i++) {
        const n = nodes[i]

        // Drift
        n.pos.x += n.vel.x * dt * 60
        n.pos.y += n.vel.y * dt * 60
        n.pos.z += n.vel.z * dt * 60

        // Gentle float
        n.pos.y = n.baseY + Math.sin(elapsed * 0.25 + n.phase) * 0.4

        // Wrap boundaries
        if (n.pos.x >  halfSpread) n.pos.x = -halfSpread
        if (n.pos.x < -halfSpread) n.pos.x =  halfSpread
        if (n.pos.y >  halfSpread * 0.65) n.pos.y = -halfSpread * 0.65
        if (n.pos.y < -halfSpread * 0.65) n.pos.y =  halfSpread * 0.65

        // Cursor repulsion
        if (!isMobile) {
          const dx = n.pos.x - mouse3D.x
          const dy = n.pos.y - mouse3D.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < CURSOR_RADIUS && dist > 0.01) {
            const force = (1 - dist / CURSOR_RADIUS) * CURSOR_PUSH * dt * 60
            n.pos.x += (dx / dist) * force
            n.pos.y += (dy / dist) * force
          }
        }

        posArr[i * 3]     = n.pos.x
        posArr[i * 3 + 1] = n.pos.y
        posArr[i * 3 + 2] = n.pos.z
      }
      pointsGeo.attributes.position.needsUpdate = true

      // Update connections
      let lineIdx = 0
      const lPos = lineGeo.attributes.position.array as Float32Array
      const lCol = lineGeo.attributes.color.array as Float32Array

      for (let i = 0; i < nodeCount && lineIdx < MAX_LINES; i++) {
        for (let j = i + 1; j < nodeCount && lineIdx < MAX_LINES; j++) {
          const dx = nodes[i].pos.x - nodes[j].pos.x
          const dy = nodes[i].pos.y - nodes[j].pos.y
          const dz = nodes[i].pos.z - nodes[j].pos.z
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz)

          if (dist < CONNECT_DIST) {
            const alpha = (1 - dist / CONNECT_DIST)
            const base  = lineIdx * 6

            lPos[base]     = nodes[i].pos.x
            lPos[base + 1] = nodes[i].pos.y
            lPos[base + 2] = nodes[i].pos.z
            lPos[base + 3] = nodes[j].pos.x
            lPos[base + 4] = nodes[j].pos.y
            lPos[base + 5] = nodes[j].pos.z

            // Gradient: blue-white based on proximity
            const intensity = alpha * alpha // quadratic falloff for softer edges
            const r = 0.35 * intensity
            const g = 0.5  * intensity
            const b = 1.0  * intensity
            lCol[base] = r; lCol[base + 1] = g; lCol[base + 2] = b
            lCol[base + 3] = r; lCol[base + 4] = g; lCol[base + 5] = b

            lineIdx++
          }
        }
      }
      lineGeo.setDrawRange(0, lineIdx * 2)
      lineGeo.attributes.position.needsUpdate = true
      lineGeo.attributes.color.needsUpdate = true

      // Glow pulses
      glow1.material.opacity = 0.1 + Math.sin(elapsed * 0.4) * 0.04
      glow2.material.opacity = 0.04 + Math.sin(elapsed * 0.6 + 1) * 0.02

      // Star twinkle
      starMat.opacity = 0.6 + Math.sin(elapsed * 0.8) * 0.25

      renderer.render(scene, camera)
    }
    animate()

    // ── Cleanup ─────────────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('scroll',    onScroll)
      window.removeEventListener('resize',    onResize)
      pointsGeo.dispose(); pointsMat.dispose(); dotTex.dispose()
      lineGeo.dispose(); lineMat.dispose()
      starGeo.dispose(); starMat.dispose()
      glow1.material.dispose(); (glow1.material as THREE.SpriteMaterial).map?.dispose()
      glow2.material.dispose(); (glow2.material as THREE.SpriteMaterial).map?.dispose()
      renderer.dispose()
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
        display: 'block',
      }}
    />
  )
}
