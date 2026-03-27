import type { Metadata } from 'next'
import localFont from 'next/font/local'
import { Inter, DM_Sans } from 'next/font/google'
import CursorOrb from '@/src/components/CursorOrb'
import CursorDot from '@/src/components/CursorDot'
import AmbientOrbs from '@/src/components/AmbientOrbs'
import DotGrid from '@/src/components/DotGrid'
import './globals.css'

// ── Geist Mono (local) — numbers only ────────────────────────────────
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
})

// ── Inter — primary UI font ───────────────────────────────────────────
const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-inter',
  display: 'swap',
})

// ── DM Sans — display headlines (700 / 800) ───────────────────────────
const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-dm-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Vexel — YouTube Intelligence for Enterprise',
  description:
    'Deconstruct any YouTube channel into an intelligence brief — outlier scores, win formulas, format graveyards — in under 5 seconds. Powered by Vexel.',
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark">
      <body
        className={[
          geistMono.variable,
          inter.variable,
          dmSans.variable,
          'bg-background text-text-primary antialiased',
        ].join(' ')}
        style={{ fontFamily: "var(--font-inter), var(--font-dm-sans), system-ui, sans-serif" }}
      >
        <CursorOrb />
        <CursorDot />
        <AmbientOrbs />
        <DotGrid />
        <div style={{ position: 'relative', zIndex: 2 }}>
          {children}
        </div>
      </body>
    </html>
  )
}
