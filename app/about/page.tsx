'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

const EASE = [0.16, 1, 0.3, 1] as const

const values = [
  {
    title: 'Signal over noise',
    desc: 'We built Vexel because most competitive tools drown you in data. We surface the six things that actually matter, ranked by impact.',
  },
  {
    title: 'Enterprise-grade accuracy',
    desc: 'Every metric is reconstructed from raw YouTube API data — no estimates, no scraping, no sampling. What you see is ground truth.',
  },
  {
    title: 'Speed as a feature',
    desc: 'A full 50-video channel intelligence brief in under 5 seconds. Because strategy moves fast and your tools should too.',
  },
  {
    title: 'Built for strategists',
    desc: 'Heads of Content, VPs of Digital, Strategy Directors. Not influencers. The language, the outputs, and the pricing reflect that.',
  },
]

const team = [
  { name: 'Jordan Park', role: 'CEO & Co-founder', bg: 'rgba(61,110,255,0.12)', text: 'JP' },
  { name: 'Maya Chen', role: 'Head of Product', bg: 'rgba(45,212,167,0.1)', text: 'MC' },
  { name: 'Ravi Solan', role: 'Lead Engineer', bg: 'rgba(168,85,247,0.1)', text: 'RS' },
  { name: 'Priya Mehta', role: 'Head of Data Science', bg: 'rgba(245,166,35,0.1)', text: 'PM' },
]

export default function AboutPage() {
  return (
    <div style={{ background: '#000000', minHeight: '100vh', color: '#fff' }}>

      {/* Nav */}
      <header className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-5 sm:px-10 py-4 sm:py-6"
        style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
        <Link href="/" style={{ fontFamily: 'inherit', fontSize: '18px', fontWeight: 800, color: '#fff', letterSpacing: '0.05em', textDecoration: 'none' }}>
          VEXEL
        </Link>
        <div className="flex items-center gap-4 sm:gap-8">
          <Link href="/#features" className="hidden sm:inline" style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)', textDecoration: 'none' }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#fff'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.5)'}>
            Features
          </Link>
          <Link href="/about" className="hidden sm:inline" style={{ fontSize: '14px', color: '#fff', textDecoration: 'none', fontWeight: 600 }}>
            About
          </Link>
          <Link href="/analyze" style={{
            fontSize: '13px', color: '#fff', textDecoration: 'none',
            background: 'rgba(61,110,255,0.15)', border: '1px solid rgba(61,110,255,0.3)',
            borderRadius: '8px', padding: '8px 18px', fontWeight: 600,
          }}>
            Get Started ↗
          </Link>
        </div>
      </header>

      <main style={{ maxWidth: '900px', margin: '0 auto', padding: '160px 24px 120px' }}>

        {/* Hero */}
        <motion.div
          className="flex flex-col gap-6 mb-24"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE }}
        >
          <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.2em', color: 'rgba(255,255,255,0.3)', fontWeight: 600 }}>
            About Vexel
          </span>
          <h1 style={{ fontSize: 'clamp(40px, 6vw, 68px)', fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1.0, color: '#fff' }}>
            Intelligence built for the<br />
            <span style={{ color: 'rgba(255,255,255,0.35)' }}>people who set the agenda.</span>
          </h1>
          <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.45)', lineHeight: 1.7, maxWidth: '620px' }}>
            Vexel was built by a team of media strategists and engineers who were frustrated
            by the gap between the data YouTube publishes and the decisions editorial teams
            actually need to make.
          </p>
        </motion.div>

        {/* Divider rule */}
        <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)', marginBottom: '80px' }} />

        {/* Mission */}
        <motion.div
          className="flex flex-col gap-5 mb-24"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: EASE }}
        >
          <span style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.2em', color: 'rgba(255,255,255,0.25)', fontWeight: 600 }}>
            Mission
          </span>
          <p style={{ fontSize: 'clamp(20px, 3vw, 28px)', fontWeight: 600, letterSpacing: '-0.02em', color: '#fff', lineHeight: 1.4 }}>
            &ldquo;Know why your competitor wins.&rdquo;
          </p>
          <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.4)', lineHeight: 1.75, maxWidth: '640px' }}>
            Every channel that performs well does so for specific, repeatable reasons.
            Vexel reverse-engineers those reasons — the post timing, the title pattern,
            the format that keeps outperforming — and delivers them as a brief you can
            act on in the next strategy meeting.
          </p>
        </motion.div>

        {/* Values grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-24"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: EASE }}
        >
          {values.map((v, i) => (
            <motion.div
              key={v.title}
              className="flex flex-col gap-3 rounded-xl p-6"
              style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)' }}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: EASE, delay: i * 0.07 }}
            >
              <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#fff' }}>{v.title}</h3>
              <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.4)', lineHeight: 1.65 }}>{v.desc}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Divider */}
        <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)', marginBottom: '80px' }} />

        {/* Team */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: EASE }}
        >
          <span style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.2em', color: 'rgba(255,255,255,0.25)', fontWeight: 600, display: 'block', marginBottom: '32px' }}>
            Team
          </span>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {team.map((member, i) => (
              <motion.div
                key={member.name}
                className="flex flex-col items-center gap-3 rounded-xl p-5 text-center"
                style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, ease: EASE, delay: i * 0.06 }}
              >
                <div className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{ background: member.bg, border: '1px solid rgba(255,255,255,0.08)' }}>
                  <span style={{ fontSize: '13px', fontFamily: 'monospace', fontWeight: 700, color: '#fff' }}>{member.text}</span>
                </div>
                <div>
                  <p style={{ fontSize: '13px', fontWeight: 600, color: '#fff' }}>{member.name}</p>
                  <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', marginTop: '2px' }}>{member.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          className="flex flex-col items-center text-center gap-6 mt-24 pt-24"
          style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: EASE }}
        >
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 700, letterSpacing: '-0.03em', color: '#fff' }}>
            Ready to see it for yourself?
          </h2>
          <Link href="/analyze" className="btn-primary" style={{ padding: '14px 32px', fontSize: '15px', textDecoration: 'none' }}>
            Analyze a Channel
            <span className="arrow-circle">↗</span>
          </Link>
        </motion.div>

      </main>
    </div>
  )
}
