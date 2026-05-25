'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight, Search, Zap, Code2, FlaskConical, GraduationCap, Shield, Clock, Star, ArrowUpRight } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import GigCard from '@/components/gig/GigCard'
import type { Gig } from '@/types'

/* ── Scroll reveal hook ────────────────────────────────────────── */
function useReveal() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current; if (!el) return
    const ob = new IntersectionObserver(([e]) => { if (e.isIntersecting) { el.classList.add('revealed'); ob.disconnect() } }, { rootMargin: '0px 0px -60px 0px' })
    ob.observe(el)
    return () => ob.disconnect()
  }, [])
  return ref
}

/* ── Static data ───────────────────────────────────────────────── */
const STATS = [
  { num: '300+', label: 'Vetted Engineers' },
  { num: '98%',  label: 'On-Time Delivery' },
  { num: '4.9',  label: 'Avg Rating'       },
  { num: '48h',  label: 'Avg Response'     },
]
const CATEGORIES = [
  { icon: Zap,           label: 'AI & Automation',  count: 124, color: 'text-amber-500'   },
  { icon: Code2,         label: 'Web Development',  count: 213, color: 'text-blue-500'    },
  { icon: FlaskConical,  label: 'Data Science',     count: 87,  color: 'text-emerald-500' },
  { icon: GraduationCap, label: 'CS Academic',      count: 156, color: 'text-purple-500'  },
]
const HOW = [
  { n: '01', title: 'Browse & Discover',   desc: 'Explore 300+ vetted university engineers across AI, web, data, and more.' },
  { n: '02', title: 'Secure Your Escrow',  desc: 'Lock in a fixed-budget contract. Your payment is held safely until delivery.' },
  { n: '03', title: 'Ship with Confidence',desc: 'Review the work, request revisions, and release funds when you\'re satisfied.' },
]
const TRUST = [
  { icon: Shield, title: 'Escrow Protection', desc: 'Funds held securely until you approve the delivered code.' },
  { icon: Clock,  title: 'Fixed Timelines',   desc: 'Clear milestones, zero ambiguity. Deadlines are contractual.' },
  { icon: Star,   title: 'Verified Reviews',  desc: 'Every review comes from a confirmed, completed order.' },
]

export default function HomePage() {
  const [gigs, setGigs] = useState<Gig[]>([])
  const [gigsLoading, setGigsLoading] = useState(true)
  const { scrollYProgress } = useScroll()
  const heroY = useTransform(scrollYProgress, [0, 0.4], [0, -60])

  const catRef   = useReveal()
  const howRef   = useReveal()
  const gigsRef  = useReveal()
  const trustRef = useReveal()
  const ctaRef   = useReveal()

  useEffect(() => {
    fetch('/api/gigs?limit=6&sort=popular')
      .then(r => r.json())
      .then(d => setGigs((d.gigs || d.data?.gigs || []) as Gig[]))
      .catch(() => {})
      .finally(() => setGigsLoading(false))
  }, [])

  return (
    <div className="aurora-page min-h-screen">
      <Navbar />

      {/* ════════════════════════════════════════════════
          HERO
      ════════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex items-center overflow-hidden pt-[68px]">
        {/* Aurora orbs */}
        <div className="aurora-orb-blue w-[700px] h-[700px] top-[-15%] right-[-10%] opacity-60" />
        <div className="aurora-orb-cyan w-[500px] h-[500px] bottom-[-10%] left-[-8%] opacity-50" />

        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-16 py-12 md:py-20 lg:py-32">
          <motion.div style={{ y: heroY }}>
            <div className="max-w-4xl">
              {/* Pill label */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--glass)] backdrop-blur-md border border-[var(--glass-border)] text-[11px] font-medium text-[var(--ink-soft)] mb-8 shadow-[var(--shadow-sm)]"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-shimmer" />
                Vetted · Escrowed · Delivered
              </motion.div>

              {/* Giant headline */}
              <motion.h1
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="font-display text-hero text-[var(--ink)] mb-7"
              >
                Build the future
                <br />
                <span className="text-[var(--royal-blue)]">with elite</span>
                <br />
                university talent.
              </motion.h1>

              {/* Sub */}
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.38, ease: [0.16, 1, 0.3, 1] }}
                className="text-[17px] text-[var(--muted)] leading-relaxed max-w-xl mb-10 font-light"
              >
                The boutique marketplace connecting forward-thinking brands with
                vetted CS engineers — all work escrowed, milestone-driven, zero risk.
              </motion.p>

              {/* Search bar */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.52, ease: [0.16, 1, 0.3, 1] }}
                className="flex gap-3 mb-12 max-w-lg"
              >
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    const q = (e.currentTarget.elements.namedItem('q') as HTMLInputElement).value
                    window.location.href = `/browse?search=${encodeURIComponent(q)}`
                  }}
                  className="flex-1 flex gap-2"
                >
                  <div className="flex-1 relative">
                    <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted-light)] pointer-events-none" />
                    <input
                      type="text" name="q"
                      placeholder="React, Next.js, LangChain..."
                      className="w-full pl-11 pr-4 py-3.5 rounded-full text-[14px] bg-[var(--surface)] border border-[var(--line-strong)] text-[var(--ink)] placeholder:text-[var(--muted-light)] outline-none focus:border-[var(--royal-blue)] focus:ring-2 focus:ring-[var(--royal-blue-dim)] shadow-[var(--shadow-sm)] transition-all"
                    />
                  </div>
                  <button type="submit" className="px-6 py-3.5 rounded-full bg-[var(--ink)] text-[var(--bg)] text-[13px] font-medium shadow-[0_4px_20px_rgba(15,23,42,0.25)] hover:bg-[var(--ink-soft)] hover:-translate-y-px transition-all">
                    Search
                  </button>
                </form>
              </motion.div>

              {/* CTAs */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.64, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-wrap items-center gap-4"
              >
                <Link href="/browse">
                  <button className="flex items-center justify-center gap-2 w-full md:w-auto px-7 py-3.5 rounded-full bg-[var(--ink)] text-[var(--bg)] text-[13px] font-medium shadow-[0_4px_24px_rgba(15,23,42,0.25)] hover:bg-[var(--ink-soft)] hover:shadow-[0_8px_32px_rgba(15,23,42,0.32)] hover:-translate-y-0.5 transition-all duration-300">
                    Browse Marketplace <ArrowRight size={14} />
                  </button>
                </Link>
                <Link href="/auth/register">
                  <button className="flex items-center justify-center gap-2 w-full md:w-auto px-7 py-3.5 rounded-full bg-[var(--glass)] backdrop-blur-md border border-[var(--glass-border)] text-[var(--ink)] text-[13px] font-medium shadow-[var(--shadow-sm)] hover:bg-[var(--glass-heavy)] hover:-translate-y-0.5 transition-all duration-300">
                    Sell Your Skills
                  </button>
                </Link>
              </motion.div>
            </div>
          </motion.div>

          {/* Floating stats — no boxes, free typography */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="absolute right-0 bottom-16 lg:bottom-24 lg:right-16 hidden lg:grid grid-cols-2 gap-x-16 gap-y-10"
          >
            {STATS.map(s => (
              <div key={s.label}>
                <div className="font-display text-[44px] text-[var(--ink)] leading-none">{s.num}</div>
                <div className="text-[12px] text-[var(--muted)] mt-1 font-medium tracking-wide">{s.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Scroll hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.6 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[var(--muted-light)]"
        >
          <div className="w-px h-10 bg-gradient-to-b from-transparent via-[var(--muted-light)] to-transparent animate-pulse" />
          <span className="text-[10px] uppercase tracking-[2px] font-medium">Scroll</span>
        </motion.div>
      </section>

      {/* ════════════════════════════════════════════════
          CATEGORIES
      ════════════════════════════════════════════════ */}
      <section className="bg-[var(--bg)] relative z-10 border-t border-[var(--line)] py-14 md:py-20">
        <div ref={catRef} className="scroll-reveal max-w-7xl mx-auto px-6 lg:px-16">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-[11px] uppercase tracking-[2.5px] text-[var(--muted)] font-semibold mb-3">Specializations</p>
              <h2 className="font-display text-editorial text-[var(--ink)]">Built for every stack.</h2>
            </div>
            <Link href="/browse" className="hidden md:flex items-center gap-2 text-[12px] font-medium text-[var(--muted)] hover:text-[var(--ink)] transition-colors">
              All Categories <ArrowUpRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {CATEGORIES.map((cat, i) => {
              const Icon = cat.icon
              return (
                <Link
                  key={cat.label}
                  href={`/browse?category=${encodeURIComponent(cat.label)}`}
                  className="scroll-reveal-child group bento-card p-6 hover:-translate-y-2 transition-all duration-300"
                  style={{ transitionDelay: `${i * 0.08}s` }}
                >
                  <div className={`mb-4 ${cat.color}`}><Icon size={22} /></div>
                  <div className="font-display-medium text-[15px] text-[var(--ink)] mb-1 group-hover:text-[var(--royal-blue)] transition-colors">{cat.label}</div>
                  <div className="text-[12px] text-[var(--muted-light)]">{cat.count} active gigs</div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════
          HOW IT WORKS — editorial floating numbers
      ════════════════════════════════════════════════ */}
      <section id="how-it-works" className="py-16 md:py-28 bg-[var(--bg)] relative overflow-hidden">
        <div className="aurora-orb-blue w-[400px] h-[400px] right-[-10%] top-[10%] opacity-20 absolute" />
        <div ref={howRef} className="scroll-reveal max-w-7xl mx-auto px-6 lg:px-16 relative z-10">
          <div className="mb-16">
            <p className="text-[11px] uppercase tracking-[2.5px] text-[var(--muted)] font-semibold mb-3">Process</p>
            <h2 className="font-display text-editorial text-[var(--ink)] max-w-md">Simple. Secure. Delivered.</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-0 relative">
            {/* Connector line */}
            <div className="hidden md:block absolute top-8 left-[16.6%] right-[16.6%] h-px bg-[var(--line)]" />
            {HOW.map((step, i) => (
              <div
                key={step.n}
                className="scroll-reveal-child relative flex flex-col gap-5 p-8"
                style={{ transitionDelay: `${i * 0.12}s` }}
              >
                {/* Big floating number */}
                <div className="font-display text-[80px] leading-none text-[var(--line-strong)] select-none mb-2">{step.n}</div>
                <div>
                  <h3 className="font-display-medium text-[18px] text-[var(--ink)] mb-2">{step.title}</h3>
                  <p className="text-[14px] text-[var(--muted)] leading-relaxed font-light">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════
          POPULAR GIGS
      ════════════════════════════════════════════════ */}
      <section className="py-16 md:py-28 bg-[var(--bg-secondary)] border-t border-[var(--line)]">
        <div ref={gigsRef} className="scroll-reveal max-w-7xl mx-auto px-6 lg:px-16">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-[11px] uppercase tracking-[2.5px] text-[var(--muted)] font-semibold mb-3">Marketplace</p>
              <h2 className="font-display text-editorial text-[var(--ink)]">Popular gigs.</h2>
            </div>
            <Link href="/browse" className="hidden md:flex items-center gap-2 text-[12px] font-medium text-[var(--muted)] hover:text-[var(--ink)] transition-colors">
              Browse All <ArrowUpRight size={14} />
            </Link>
          </div>

          {gigsLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1,2,3].map(i => (
                <div key={i} className="bento-card h-[380px] animate-pulse">
                  <div className="h-48 bg-[var(--line)] rounded-[20px] m-3" />
                  <div className="p-5 space-y-3">
                    <div className="h-3 bg-[var(--line)] rounded-full w-24" />
                    <div className="h-4 bg-[var(--line)] rounded-full w-4/5" />
                    <div className="h-4 bg-[var(--line)] rounded-full w-3/5" />
                  </div>
                </div>
              ))}
            </div>
          ) : gigs.length === 0 ? (
            <div className="bento-card p-20 text-center">
              <p className="font-display text-[20px] text-[var(--muted)] font-light">No gigs active right now.</p>
              <p className="text-[13px] text-[var(--muted-light)] mt-2">Check back soon or browse categories above.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {gigs.map((gig, i) => (
                <div key={gig.id} className="scroll-reveal-child" style={{ transitionDelay: `${i * 0.09}s` }}>
                  <GigCard gig={gig} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ════════════════════════════════════════════════
          TRUST
      ════════════════════════════════════════════════ */}
      <section id="trust" className="section-dark py-16 md:py-28">
        <div ref={trustRef} className="scroll-reveal max-w-7xl mx-auto px-6 lg:px-16">
          <div className="mb-16">
            <p className="text-[11px] uppercase tracking-[2.5px] text-blue-400 font-semibold mb-3">Why C-Oasis</p>
            <h2 className="font-display text-editorial text-white max-w-lg">Built on trust, delivered with precision.</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {TRUST.map((item, i) => {
              const Icon = item.icon
              return (
                <div
                  key={item.title}
                  className="scroll-reveal-child bento-card-glass border border-white/10 p-8 hover:-translate-y-2 transition-all duration-300"
                  style={{ background: 'rgba(255,255,255,0.05)', transitionDelay: `${i * 0.10}s` }}
                >
                  <div className="w-10 h-10 rounded-2xl bg-[var(--royal-blue-dim)] flex items-center justify-center mb-5">
                    <Icon size={17} className="text-blue-400" />
                  </div>
                  <h3 className="font-display-medium text-[18px] text-white mb-3">{item.title}</h3>
                  <p className="text-[14px] text-blue-100/70 leading-relaxed font-light">{item.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════
          CTA
      ════════════════════════════════════════════════ */}
      <section className="py-16 md:py-28 bg-[var(--bg)] border-t border-[var(--line)]">
        <div ref={ctaRef} className="scroll-reveal max-w-7xl mx-auto px-6 lg:px-16">
          <div className="bento-card p-16 lg:p-24 flex flex-col md:flex-row items-center justify-between gap-12 relative overflow-hidden">
            <div className="aurora-orb-blue w-[400px] h-[400px] right-[-10%] top-[-50%] opacity-20 absolute" />
            <div className="relative z-10">
              <h2 className="font-display text-display text-[var(--ink)] mb-4">Ready to build?</h2>
              <p className="text-[16px] text-[var(--muted)] font-light max-w-md leading-relaxed">
                Join 300+ companies that ship better software with C-Oasis engineers.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 relative z-10 shrink-0">
              <Link href="/browse">
                <button className="w-full sm:w-auto px-8 py-4 rounded-full bg-[var(--ink)] text-[var(--bg)] text-[13px] font-medium shadow-[0_4px_24px_rgba(15,23,42,0.25)] hover:bg-[var(--ink-soft)] hover:-translate-y-0.5 transition-all">
                  Browse Gigs
                </button>
              </Link>
              <Link href="/auth/register">
                <button className="w-full sm:w-auto px-8 py-4 rounded-full border border-[var(--line-strong)] text-[var(--ink)] text-[13px] font-medium hover:bg-[var(--line)] hover:-translate-y-0.5 transition-all">
                  Become a Seller
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
