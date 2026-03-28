'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { AppSidebar } from '@/src/components/AppSidebar'

// ── Shared styles ──────────────────────────────────────────────────────
const CARD = {
  background: 'rgba(255,255,255,0.03)',
  border: '1px solid rgba(255,255,255,0.07)',
  borderRadius: '16px',
  padding: '28px',
} as const

const INPUT_STYLE = {
  width: '100%',
  height: '44px',
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '10px',
  padding: '0 14px',
  color: '#fff',
  fontSize: '16px',
  outline: 'none',
} as const

const LABEL_STYLE = {
  fontSize: '11px',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.12em',
  color: 'rgba(255,255,255,0.3)',
  fontFamily: 'monospace',
  marginBottom: '6px',
  display: 'block',
}

// ── Types ──────────────────────────────────────────────────────────────
interface ProfileData { name: string; email: string; role: string; avatar: string }
interface WorkspaceData { agencyName: string; exportFormat: 'pdf'|'csv'|'json'; language: string }
interface NotificationsData { weeklyDigest: boolean; outlierAlerts: boolean; formatGraveyardAlerts: boolean }

// ── Sub-components ─────────────────────────────────────────────────────
function Toast({ message }: { message: string | null }) {
  if (!message) return null
  return (
    <div
      className="fixed bottom-6 right-6 z-[100] flex items-center gap-2.5 px-4 py-3 animate-fade-up"
      style={{ background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '12px', color: '#fff', fontSize: '13px' }}
    >
      <svg width="15" height="15" viewBox="0 0 16 16" fill="none" style={{ color: '#2DD4A7', flexShrink: 0 }}>
        <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.2" />
        <path d="M5 8L7 10L11 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {message}
    </div>
  )
}

function Toggle({ enabled, onToggle }: { enabled: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      role="switch"
      aria-checked={enabled}
      className="w-10 h-5 rounded-full flex items-center transition-all duration-200 flex-shrink-0"
      style={{ background: enabled ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.12)' }}
    >
      <div
        className="w-3.5 h-3.5 rounded-full shadow-sm transition-transform duration-200"
        style={{ background: enabled ? '#050508' : 'rgba(255,255,255,0.5)', transform: enabled ? 'translateX(22px)' : 'translateX(3px)' }}
      />
    </button>
  )
}

function SectionLabel({ id, title, description }: { id: string; title: string; description: string }) {
  return (
    <div id={id} className="scroll-mt-24" style={{ marginBottom: '20px' }}>
      <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#fff', letterSpacing: '-0.01em' }}>{title}</h2>
      <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.35)', marginTop: '4px' }}>{description}</p>
    </div>
  )
}

function SavedChip({ saved }: { saved: boolean }) {
  if (!saved) return null
  return (
    <span className="flex items-center gap-1.5" style={{ fontSize: '13px', color: '#2DD4A7' }}>
      <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
        <path d="M2.5 7L5.5 10L11.5 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      Saved
    </span>
  )
}

// ── Page ───────────────────────────────────────────────────────────────
export default function SettingsPage() {
  const router = useRouter()
  const avatarInputRef = useRef<HTMLInputElement>(null)
  const [toast, setToast] = useState<string | null>(null)

  const [profile, setProfile] = useState<ProfileData>({ name: 'Alex Chen', email: 'alex@agency.com', role: 'Lead Strategist', avatar: '' })
  const [profileSaved, setProfileSaved] = useState(false)
  const [workspace, setWorkspace] = useState<WorkspaceData>({ agencyName: '', exportFormat: 'pdf', language: 'English' })
  const [workspaceSaved, setWorkspaceSaved] = useState(false)
  const [notifications, setNotifications] = useState<NotificationsData>({ weeklyDigest: true, outlierAlerts: false, formatGraveyardAlerts: false })
  const [notifSaved, setNotifSaved] = useState(false)
  const [cancelConfirm, setCancelConfirm] = useState(false)

  function showToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(null), 2500)
  }

  useEffect(() => {
    try {
      const p = localStorage.getItem('vexel_profile')
      if (p) setProfile(JSON.parse(p) as ProfileData)
      const w = localStorage.getItem('vexel_workspace')
      if (w) setWorkspace(JSON.parse(w) as WorkspaceData)
      const n = localStorage.getItem('vexel_notifications')
      if (n) setNotifications(JSON.parse(n) as NotificationsData)
    } catch { /* ignore */ }
  }, [])

  function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      if (typeof ev.target?.result === 'string')
        setProfile((p) => ({ ...p, avatar: ev.target!.result as string }))
    }
    reader.readAsDataURL(file)
  }

  function handleSaveProfile() {
    localStorage.setItem('vexel_profile', JSON.stringify(profile))
    setProfileSaved(true); showToast('Profile saved')
    setTimeout(() => setProfileSaved(false), 2000)
  }
  function handleSaveWorkspace() {
    localStorage.setItem('vexel_workspace', JSON.stringify(workspace))
    setWorkspaceSaved(true); showToast('Workspace settings saved')
    setTimeout(() => setWorkspaceSaved(false), 2000)
  }
  function handleSaveNotifications() {
    localStorage.setItem('vexel_notifications', JSON.stringify(notifications))
    setNotifSaved(true); showToast('Notification preferences saved')
    setTimeout(() => setNotifSaved(false), 2000)
  }

  const SECTION_ANCHORS = [
    { id: 'profile',       label: 'Profile' },
    { id: 'workspace',     label: 'Workspace' },
    { id: 'notifications', label: 'Notifications' },
    { id: 'api',           label: 'API & Data' },
    { id: 'billing',       label: 'Billing' },
  ]

  return (
    <div className="flex min-h-screen" style={{ background: '#000000' }}>
      <AppSidebar active="Settings" />

      <div className="flex-1 ml-0 md:ml-[220px] flex flex-col min-h-screen">

        {/* Topbar */}
        <header
          className="sticky top-0 z-30 h-16 flex items-center justify-between pl-14 pr-4 md:px-10"
          style={{ background: 'rgba(5,5,8,0.8)', backdropFilter: 'blur(24px)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}
        >
          <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.2em', color: 'rgba(255,255,255,0.3)', fontWeight: 600 }}>
            Settings
          </span>
          <button
            type="button"
            onClick={() => router.push('/login')}
            style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)', background: 'none', border: 'none', cursor: 'pointer' }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#FF4D6A'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.3)'}
          >
            Sign out
          </button>
        </header>

        <div className="flex gap-8 lg:gap-12 px-4 md:px-10 py-6 md:py-12">

          {/* Anchor nav */}
          <nav className="w-[160px] flex-shrink-0 sticky top-24 self-start hidden lg:block">
            <p style={{ fontSize: '10px', fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.2)', marginBottom: '16px' }}>
              Jump to
            </p>
            <div className="flex flex-col gap-1">
              {SECTION_ANCHORS.map(({ id, label }) => (
                <a
                  key={id}
                  href={`#${id}`}
                  style={{ fontSize: '13px', color: 'rgba(255,255,255,0.35)', textDecoration: 'none', padding: '6px 10px', borderRadius: '8px', display: 'block', transition: 'color 150ms' }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.background = 'rgba(255,255,255,0.04)' }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.35)'; e.currentTarget.style.background = 'transparent' }}
                >
                  {label}
                </a>
              ))}
            </div>
          </nav>

          {/* Content */}
          <div className="flex-1 flex flex-col" style={{ gap: '48px', maxWidth: '680px' }}>

            {/* ── Profile ───────────────────────────────────────── */}
            <section>
              <SectionLabel id="profile" title="Profile" description="Your personal information and display preferences." />
              <div style={CARD}>

                {/* Avatar */}
                <div className="flex items-center gap-5 mb-6">
                  <button
                    type="button"
                    onClick={() => avatarInputRef.current?.click()}
                    className="w-16 h-16 rounded-full flex items-center justify-center overflow-hidden transition-all duration-150 flex-shrink-0"
                    style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)' }}
                    onMouseEnter={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'}
                    onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'}
                  >
                    {profile.avatar ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={profile.avatar} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <span style={{ fontSize: '20px', fontFamily: 'monospace', fontWeight: 600, color: '#888899' }}>
                        {profile.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
                      </span>
                    )}
                  </button>
                  <input ref={avatarInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
                  <div>
                    <p style={{ fontSize: '15px', fontWeight: 500, color: '#fff' }}>{profile.name}</p>
                    <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)', marginTop: '3px' }}>Click to upload photo</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
                  {[
                    { label: 'Full Name', value: profile.name, onChange: (v: string) => setProfile((p) => ({ ...p, name: v })), placeholder: 'Alex Chen', type: 'text' },
                    { label: 'Email', value: profile.email, onChange: (v: string) => setProfile((p) => ({ ...p, email: v })), placeholder: 'alex@agency.com', type: 'email' },
                  ].map(({ label, value, onChange, placeholder, type }) => (
                    <div key={label}>
                      <label style={LABEL_STYLE}>{label}</label>
                      <input
                        type={type}
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        placeholder={placeholder}
                        style={INPUT_STYLE}
                        onFocus={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'}
                        onBlur={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'}
                      />
                    </div>
                  ))}
                </div>

                <div className="mb-6">
                  <label style={LABEL_STYLE}>Role</label>
                  <select
                    value={profile.role}
                    onChange={(e) => setProfile((p) => ({ ...p, role: e.target.value }))}
                    style={{ ...INPUT_STYLE, cursor: 'pointer' }}
                    onFocus={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'}
                    onBlur={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'}
                  >
                    {['Lead Strategist', 'Head of Content', 'VP Content', 'Agency Owner', 'Freelance Analyst'].map((r) => (
                      <option key={r} value={r} style={{ background: '#111118' }}>{r}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-4">
                  <button type="button" onClick={handleSaveProfile} className="vm-btn" style={{ padding: '10px 20px', fontSize: '13px', borderRadius: '10px' }}>
                    Save Profile
                  </button>
                  <SavedChip saved={profileSaved} />
                </div>
              </div>
            </section>

            {/* ── Workspace ─────────────────────────────────────── */}
            <section>
              <SectionLabel id="workspace" title="Workspace" description="Configure your agency defaults and export preferences." />
              <div style={CARD}>

                <div className="mb-5">
                  <label style={LABEL_STYLE}>Agency Name</label>
                  <input
                    type="text"
                    value={workspace.agencyName}
                    onChange={(e) => setWorkspace((p) => ({ ...p, agencyName: e.target.value }))}
                    placeholder="Acme Media Group"
                    style={INPUT_STYLE}
                    onFocus={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'}
                    onBlur={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'}
                  />
                </div>

                <div className="mb-5">
                  <label style={LABEL_STYLE}>Default Export Format</label>
                  <div className="flex gap-2 mt-1">
                    {(['pdf', 'csv', 'json'] as const).map((f) => (
                      <button
                        key={f}
                        type="button"
                        onClick={() => setWorkspace((p) => ({ ...p, exportFormat: f }))}
                        style={{
                          padding: '8px 18px',
                          borderRadius: '10px',
                          border: `1px solid ${workspace.exportFormat === f ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.08)'}`,
                          background: workspace.exportFormat === f ? 'rgba(255,255,255,0.1)' : 'transparent',
                          color: workspace.exportFormat === f ? '#fff' : 'rgba(255,255,255,0.4)',
                          fontSize: '12px',
                          fontFamily: 'monospace',
                          textTransform: 'uppercase',
                          letterSpacing: '0.08em',
                          cursor: 'pointer',
                          transition: 'all 150ms',
                        }}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mb-6">
                  <label style={LABEL_STYLE}>Report Language</label>
                  <select
                    value={workspace.language}
                    onChange={(e) => setWorkspace((p) => ({ ...p, language: e.target.value }))}
                    style={{ ...INPUT_STYLE, cursor: 'pointer' }}
                    onFocus={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'}
                    onBlur={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'}
                  >
                    {['English', 'Spanish', 'French', 'German', 'Portuguese'].map((l) => (
                      <option key={l} value={l} style={{ background: '#111118' }}>{l}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-4">
                  <button type="button" onClick={handleSaveWorkspace} className="vm-btn" style={{ padding: '10px 20px', fontSize: '13px', borderRadius: '10px' }}>
                    Save Workspace
                  </button>
                  <SavedChip saved={workspaceSaved} />
                </div>
              </div>
            </section>

            {/* ── Notifications ─────────────────────────────────── */}
            <section>
              <SectionLabel id="notifications" title="Notifications" description="Choose what you want to be alerted about." />
              <div style={CARD}>
                {([
                  { key: 'weeklyDigest' as const,          label: 'Weekly email digest',        desc: 'Summary of your saved channels every Monday' },
                  { key: 'outlierAlerts' as const,         label: 'Outlier score alerts',        desc: 'Fires when a new outlier >8x is detected' },
                  { key: 'formatGraveyardAlerts' as const, label: 'Format Graveyard alerts',     desc: 'New abandoned winning formats detected' },
                ]).map(({ key, label, desc }, i, arr) => (
                  <div
                    key={key}
                    className="flex items-center justify-between py-4"
                    style={{ borderBottom: i < arr.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none' }}
                  >
                    <div>
                      <p style={{ fontSize: '14px', fontWeight: 500, color: '#fff' }}>{label}</p>
                      <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)', marginTop: '2px' }}>{desc}</p>
                    </div>
                    <Toggle enabled={notifications[key]} onToggle={() => setNotifications((p) => ({ ...p, [key]: !p[key] }))} />
                  </div>
                ))}

                <div className="flex items-center gap-4 mt-6">
                  <button type="button" onClick={handleSaveNotifications} className="vm-btn" style={{ padding: '10px 20px', fontSize: '13px', borderRadius: '10px' }}>
                    Save
                  </button>
                  <SavedChip saved={notifSaved} />
                </div>
              </div>
            </section>

            {/* ── API & Data ────────────────────────────────────── */}
            <section>
              <SectionLabel id="api" title="API & Data" description="YouTube API configuration and data management." />
              <div style={CARD} className="flex flex-col gap-6">

                <div className="flex items-center justify-between py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  <div>
                    <p style={{ fontSize: '14px', fontWeight: 500, color: '#fff' }}>YouTube Data API v3</p>
                    <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)', marginTop: '2px' }}>Connected via Google Cloud Console</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.2)' }} />
                    <span style={{ fontSize: '12px', fontFamily: 'monospace', color: 'rgba(255,255,255,0.3)' }}>Demo Mode</span>
                  </div>
                </div>

                <div>
                  <label style={LABEL_STYLE}>Data Retention</label>
                  <select
                    defaultValue="30 days"
                    style={{ ...INPUT_STYLE, cursor: 'pointer' }}
                    onFocus={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'}
                    onBlur={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'}
                  >
                    {['7 days', '30 days', '90 days', 'Never'].map((o) => (
                      <option key={o} value={o} style={{ background: '#111118' }}>{o}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <p style={{ fontSize: '14px', fontWeight: 500, color: '#fff' }}>Daily Quota Usage</p>
                    <span style={{ fontSize: '12px', fontFamily: 'monospace', color: 'rgba(255,255,255,0.35)' }}>201 / 10,000 units</span>
                  </div>
                  <div className="vm-bar-track">
                    <div className="vm-bar-fill" style={{ width: '2.01%' }} />
                  </div>
                  <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.25)', marginTop: '6px', fontFamily: 'monospace' }}>2.01% of daily limit</p>
                </div>

                <button
                  type="button"
                  onClick={() => showToast('Cache cleared')}
                  className="vm-btn-ghost self-start"
                  style={{ padding: '8px 18px', fontSize: '13px' }}
                >
                  Clear Analysis Cache
                </button>
              </div>
            </section>

            {/* ── Billing ───────────────────────────────────────── */}
            <section>
              <SectionLabel id="billing" title="Billing" description="Manage your subscription and payment information." />
              <div style={CARD} className="flex flex-col gap-6">

                {/* Current plan */}
                <div className="rounded-xl p-5 relative overflow-hidden" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <div className="absolute -right-8 -top-8 w-32 h-32 pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(107,94,255,0.12) 0%, transparent 70%)' }} />
                  <div className="flex items-start justify-between">
                    <div>
                      <p style={{ fontSize: '10px', fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.35)', marginBottom: '4px' }}>
                        Current Plan
                      </p>
                      <p style={{ fontSize: '20px', fontWeight: 600, color: '#fff' }}>Pro Editorial</p>
                      <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', marginTop: '4px' }}>
                        <span style={{ fontFamily: 'monospace' }}>$499</span>/month
                      </p>
                    </div>
                    <span style={{ fontSize: '10px', fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.1em', background: 'rgba(45,212,167,0.1)', color: '#2DD4A7', border: '1px solid rgba(45,212,167,0.2)', borderRadius: '999px', padding: '4px 10px' }}>
                      Active
                    </span>
                  </div>
                  <div className="mt-4 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
                    <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)' }}>
                      Next billing: <span style={{ fontFamily: 'monospace', color: 'rgba(255,255,255,0.5)' }}>Apr 27, 2026</span>
                    </p>
                  </div>
                </div>

                {/* Payment method */}
                <div className="flex items-center justify-between py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  <div>
                    <p style={{ fontSize: '14px', fontWeight: 500, color: '#fff' }}>Payment Method</p>
                    <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)', marginTop: '2px' }}>
                      Visa <span style={{ fontFamily: 'monospace' }}>•••• 4242</span>
                    </p>
                  </div>
                  <button
                    type="button"
                    style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', background: 'none', border: 'none', cursor: 'pointer' }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#fff'}
                    onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.4)'}
                  >
                    Update
                  </button>
                </div>

                {/* Usage stats */}
                <div>
                  <p style={{ fontSize: '14px', fontWeight: 500, color: '#fff', marginBottom: '14px' }}>Usage This Month</p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      { label: 'Channels Analyzed', value: '14' },
                      { label: 'Reports Exported',  value: '7' },
                      { label: 'API Calls',         value: '1,407' },
                    ].map(({ label, value }) => (
                      <div
                        key={label}
                        className="rounded-xl p-4"
                        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
                      >
                        <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '6px' }}>{label}</p>
                        <p style={{ fontSize: '22px', fontFamily: 'monospace', fontWeight: 700, color: '#fff' }}>{value}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button type="button" className="vm-btn" style={{ padding: '10px 20px', fontSize: '13px', borderRadius: '10px' }}>
                    Upgrade Plan
                  </button>
                  {cancelConfirm ? (
                    <div className="flex items-center gap-2">
                      <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)' }}>Are you sure?</span>
                      <button
                        type="button"
                        onClick={() => { setCancelConfirm(false); showToast('Cancellation noted — you remain on Pro through Apr 27, 2026.') }}
                        style={{ padding: '6px 14px', background: 'rgba(255,77,106,0.1)', border: '1px solid rgba(255,77,106,0.2)', color: '#FF4D6A', fontSize: '12px', borderRadius: '8px', cursor: 'pointer' }}
                      >
                        Yes, cancel
                      </button>
                      <button
                        type="button"
                        onClick={() => setCancelConfirm(false)}
                        style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)', background: 'none', border: 'none', cursor: 'pointer' }}
                      >
                        Keep plan
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setCancelConfirm(true)}
                      className="vm-btn-ghost"
                      style={{ padding: '10px 20px', fontSize: '13px' }}
                    >
                      Cancel Plan
                    </button>
                  )}
                </div>
              </div>
            </section>

            {/* Bottom padding */}
            <div style={{ height: '40px' }} />
          </div>
        </div>
      </div>

      <Toast message={toast} />
    </div>
  )
}
