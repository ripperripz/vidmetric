'use client'

import { AppSidebar } from '@/src/components/AppSidebar'

export default function AnalysisError({ message, url }: { message: string; url: string }) {
  return (
    <div className="flex min-h-screen" style={{ background: '#000000' }}>
      <AppSidebar active="New Analysis" />
      <div className="flex-1 ml-[220px] flex flex-col items-center justify-center gap-6 px-10">
        <div
          className="flex flex-col items-center gap-4 rounded-xl p-10 text-center"
          style={{ background: 'rgba(255,77,106,0.05)', border: '1px solid rgba(255,77,106,0.15)', maxWidth: '480px', width: '100%' }}
        >
          <span style={{ fontSize: '28px' }}>⚠</span>
          <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#fff', letterSpacing: '-0.01em' }}>
            Analysis Failed
          </h2>
          <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.6 }}>{message}</p>
          <div className="flex gap-3 mt-2">
            <a
              href={`/analysis?url=${encodeURIComponent(url)}`}
              style={{
                fontSize: '13px',
                fontFamily: 'monospace',
                color: '#fff',
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: '8px',
                padding: '8px 18px',
                textDecoration: 'none',
              }}
            >
              Retry
            </a>
            <a
              href="/analyze"
              style={{
                fontSize: '13px',
                fontFamily: 'monospace',
                color: 'rgba(255,255,255,0.45)',
                background: 'none',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '8px',
                padding: '8px 18px',
                textDecoration: 'none',
              }}
            >
              New Analysis
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
