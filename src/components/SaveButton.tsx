'use client'

import { useState } from 'react'

export interface SaveButtonProps {
  channelId: string
  channelName: string
  channelHandle: string
  url: string
}

interface SavedChannel {
  channelId: string
  channelName: string
  channelHandle: string
  url: string
  savedAt: string
  avatar: string
}

export function SaveButton({ channelId, channelName, channelHandle, url }: SaveButtonProps) {
  const [saved, setSaved] = useState(false)
  const [toast, setToast] = useState(false)

  function handleSave() {
    const key = 'vexel_saved'
    const existing: SavedChannel[] = (() => {
      try {
        return JSON.parse(localStorage.getItem(key) ?? '[]') as SavedChannel[]
      } catch {
        return []
      }
    })()

    const alreadyExists = existing.some((c) => c.channelId === channelId)
    if (!alreadyExists) {
      const updated: SavedChannel[] = [
        ...existing,
        {
          channelId,
          channelName,
          channelHandle,
          url,
          savedAt: new Date().toISOString(),
          avatar: '',
        },
      ]
      localStorage.setItem(key, JSON.stringify(updated))
    }

    setSaved(true)
    setToast(true)
    setTimeout(() => setToast(false), 2500)
  }

  return (
    <>
      <button
        onClick={handleSave}
        className="flex items-center gap-1.5 transition-all duration-150"
        style={{
          padding: '6px 14px',
          border: `1px solid ${saved ? 'rgba(45,212,167,0.3)' : 'rgba(255,255,255,0.1)'}`,
          borderRadius: '8px',
          background: saved ? 'rgba(45,212,167,0.06)' : 'transparent',
          color: saved ? '#2DD4A7' : '#888899',
          fontSize: '11px',
          fontFamily: 'monospace',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          cursor: 'pointer',
        }}
      >
        {saved ? (
          <>
            <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path d="M2 6L5 9L10 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Saved
          </>
        ) : 'Save'}
      </button>

      {toast && (
        <div
          className="fixed bottom-6 right-6 z-[100] flex items-center gap-2.5 px-4 py-3 animate-fade-up"
          style={{
            background: 'rgba(255,255,255,0.08)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: '12px',
            color: '#fff',
            fontSize: '13px',
          }}
        >
          <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true" style={{ color: '#2DD4A7', flexShrink: 0 }}>
            <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.2" />
            <path d="M5 8L7 10L11 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Saved to workspace
        </div>
      )}
    </>
  )
}
