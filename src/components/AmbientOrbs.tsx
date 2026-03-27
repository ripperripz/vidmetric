export default function AmbientOrbs() {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 0,
        overflow: 'hidden',
      }}
    >
      {/* Top right — blue */}
      <div style={{
        position: 'absolute',
        top: '-300px',
        right: '-300px',
        width: '900px',
        height: '900px',
        borderRadius: '50%',
        background: `radial-gradient(circle at center,
          rgba(79,126,255,0.055) 0%,
          transparent 65%)`,
      }} />

      {/* Bottom left — teal */}
      <div style={{
        position: 'absolute',
        bottom: '-400px',
        left: '-400px',
        width: '1000px',
        height: '1000px',
        borderRadius: '50%',
        background: `radial-gradient(circle at center,
          rgba(45,212,167,0.04) 0%,
          transparent 65%)`,
      }} />

      {/* Center — very faint purple */}
      <div style={{
        position: 'absolute',
        top: '20%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '800px',
        height: '800px',
        borderRadius: '50%',
        background: `radial-gradient(circle at center,
          rgba(120,80,255,0.025) 0%,
          transparent 65%)`,
        animation: 'ambientPulse 10s ease-in-out infinite',
      }} />
    </div>
  )
}
