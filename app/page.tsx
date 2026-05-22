'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { ArrowRight, Zap, Code2, FlaskConical, GraduationCap, Shield, Clock } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import GigCard from '@/components/gig/GigCard'
import type { Gig } from '@/types'

const CATEGORIES = [
  { icon: Zap,           label: 'AI Automation',  count: 124 },
  { icon: Code2,         label: 'Web Development', count: 213 },
  { icon: FlaskConical,  label: 'Data Science',    count: 87  },
  { icon: GraduationCap, label: 'CS Academic',     count: 156 },
]

const STATS = [
  { num: '300+', label: 'Vetted Developers' },
  { num: '98%',  label: 'Delivery Rate' },
  { num: '4.9',  label: 'Avg Rating' },
  { num: '48h',  label: 'Avg Response' },
]

const TRUST = [
  { icon: Shield, title: 'Vetted Talent', desc: 'Every university engineer is manually audited for clean architecture, communication, and milestone reliability.' },
  { icon: Clock,  title: 'Escrow Delivery', desc: 'C-Oasis holds funds until code passes review. Zero code-dumps, zero surprises.' },
  { icon: Zap,    title: 'Fixed Pricing',   desc: 'Bespoke fixed-budget contracts locked upfront in secure escrow with transparent milestones.' },
]

const GigCardSkeleton = () => (
  <div className="glass-card depth-sm p-4 h-[380px] flex flex-col gap-4 animate-pulse select-none">
    <div className="aspect-[4/3] w-full bg-white/10 rounded-xl" />
    <div className="space-y-2 flex-1">
      <div className="h-3 bg-white/10 rounded w-16" />
      <div className="h-4 bg-white/10 rounded w-3/4 mt-2" />
      <div className="h-4 bg-white/10 rounded w-5/6" />
    </div>
    <div className="flex items-center justify-between pt-3 border-t border-white/10 mt-auto">
      <div className="h-4 bg-white/10 rounded w-16" />
      <div className="h-3 bg-white/10 rounded w-10" />
    </div>
  </div>
)

/* ── Scroll-reveal hook using IntersectionObserver ── */
function useScrollReveal(rootMargin = '0px 0px -60px 0px') {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { 
        if (entry.isIntersecting) { 
          el.classList.add('revealed')
          observer.disconnect() 
        } 
      },
      { rootMargin }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [rootMargin])
  return ref
}

export default function HomePage() {
  const [gigs, setGigs] = useState<Gig[]>([])
  const [gigsLoading, setGigsLoading] = useState(true)

  /* Scroll-reveal refs */
  const catRef    = useScrollReveal()
  const gigsRef   = useScrollReveal()
  const trustRef  = useScrollReveal()
  const ctaRef    = useScrollReveal()

  useEffect(() => {
    fetch('/api/gigs?limit=6&sort=popular')
      .then(r => r.json())
      .then(d => setGigs((d.gigs || d.data?.gigs || []) as Gig[]))
      .catch(() => {})
      .finally(() => setGigsLoading(false))
  }, [])

  return (
    <>
      {/* ── Fixed cinematic landscape background ─────────────────── */}
      <div className="horizon-canvas" aria-hidden="true" />
      <div className="horizon-overlay" aria-hidden="true" />

      {/* ── Scrollable content above the fixed backdrop ───────────── */}
      <div className="relative z-10 min-h-screen flex flex-col">
        <Navbar />

        {/* ══ HERO ═══════════════════════════════════════════════════ */}
        <section className="flex-1 flex items-center min-h-screen pt-14 px-6 lg:px-20">
          <div className="max-w-7xl mx-auto w-full">
            <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center py-20 lg:py-28">

              {/* Left copy — staggered hero entrance */}
              <div className="lg:col-span-6 flex flex-col text-center lg:text-left">

                {/* Badge */}
                <div className="hero-rise hero-rise-1 inline-flex items-center gap-2 px-3 py-1.5 glass-card depth-sm text-[9px] uppercase tracking-[2.5px] text-[var(--grey)] font-mono-co mb-7 w-fit mx-auto lg:mx-0 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-shimmer" />
                  Vetted · Escrowed · Delivered
                </div>

                {/* Headline — word-by-word feel via two lines */}
                <h1 className="hero-rise hero-rise-2 font-display text-[clamp(3rem,7vw,5.5rem)] leading-[1.0] text-[var(--charcoal)] mb-5 tracking-wide">
                  Get your<br />
                  perfect builder.
                </h1>

                {/* Sub-copy */}
                <p className="hero-rise hero-rise-3 text-[15px] leading-[1.9] text-[var(--grey)] max-w-md mb-9 mx-auto lg:mx-0 font-light tracking-wide">
                  The boutique forge where university engineers build
                  high-performance web systems and AI tools for forward-thinking brands.
                </p>

                {/* CTAs */}
                <div className="hero-rise hero-rise-4 flex items-center gap-4 flex-wrap justify-center lg:justify-start mb-14">
                  <Link href="/browse">
                    <button className="flex items-center gap-2 px-7 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-[11px] tracking-[2px] uppercase font-mono-co font-semibold rounded-xl transition-all duration-300 shadow-[0_6px_28px_rgba(16,185,129,0.35)] hover:shadow-[0_8px_36px_rgba(16,185,129,0.45)] hover:-translate-y-0.5">
                      Explore Gigs <ArrowRight size={13} />
                    </button>
                  </Link>
                  <Link href="/auth/register">
                    <button className="px-7 py-3.5 glass-card depth-sm text-[var(--charcoal)] text-[11px] tracking-[2px] uppercase font-mono-co rounded-xl hover:border-[var(--line-hover)] hover:-translate-y-0.5 transition-all duration-300">
                      Become a Seller
                    </button>
                  </Link>
                </div>

                {/* Stats row */}
                <div className="hero-rise hero-rise-5 hidden md:grid grid-cols-4 gap-5 pt-7 border-t border-[var(--glass-border)]">
                  {STATS.map((s, i) => (
                    <div key={s.label} className="space-y-1" style={{ animationDelay: `${0.55 + i * 0.08}s` }}>
                      <div className="font-mono-co text-[22px] font-medium text-[var(--charcoal)] tracking-tight">{s.num}</div>
                      <div className="text-[9px] uppercase tracking-[2px] text-[var(--grey)] font-mono-co">{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right — Marketplace panel with depth */}
              <div className="lg:col-span-6 flex justify-center lg:justify-end panel-slide">
                <div className="w-full max-w-[440px]">
                  <MarketplacePanel />
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ══ Below-fold: solid bg, scroll-reveal sections ═════════ */}
        <div className="bg-[var(--paper)] relative z-10">

          {/* ── Scroll transition gradient edge ── */}
          <div className="h-px bg-gradient-to-r from-transparent via-[var(--glass-border-subtle)] to-transparent" />

          {/* CATEGORIES */}
          <section className="border-b border-[var(--glass-border-subtle)] bg-[var(--paper)]">
            <div ref={catRef} className="scroll-reveal max-w-7xl mx-auto px-6 lg:px-16 py-14">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {CATEGORIES.map((cat, i) => {
                  const Icon = cat.icon
                  return (
                    <Link
                      key={cat.label}
                      href={`/browse?category=${encodeURIComponent(cat.label)}`}
                      className={`cyber-border-container depth-sm p-5 flex items-center gap-4 group transition-all duration-300 hover:border-[var(--line-solid)] hover:-translate-y-0.5 hover:depth-md scroll-reveal-child delay-${i + 1}`}
                      style={{ transitionDelay: `${i * 0.07}s` }}
                    >
                      <div className="w-9 h-9 border border-[var(--glass-border)] rounded-lg flex items-center justify-center bg-[var(--surface)] group-hover:border-[var(--line-solid)] transition-all duration-300">
                        <Icon size={14} className="text-[var(--grey-light)] group-hover:text-[var(--charcoal)] transition-colors duration-300" />
                      </div>
                      <div>
                        <div className="text-[11px] font-mono-co font-medium text-[var(--grey)] group-hover:text-[var(--charcoal)] transition-colors tracking-wide">{cat.label}</div>
                        <div className="text-[9px] font-mono-co text-[var(--grey-light)] mt-0.5 tracking-wider">{cat.count} active</div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>
          </section>

          {/* POPULAR GIGS */}
          <section className="max-w-7xl mx-auto px-6 lg:px-16 py-24">
            <div ref={gigsRef} className="scroll-reveal">
              <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-12 gap-4">
                <div>
                  <div className="text-[9px] uppercase tracking-[2.5px] text-[var(--grey)] font-mono-co mb-3">Verified Escrows</div>
                  <h2 className="font-display-medium text-[28px] text-[var(--charcoal)] tracking-wide">Active compiler nodes</h2>
                </div>
                <Link href="/browse" className="flex items-center gap-2 text-[10px] uppercase tracking-[2px] font-mono-co text-[var(--grey)] hover:text-[var(--charcoal)] transition-colors shrink-0">
                  All Contracts <ArrowRight size={11} />
                </Link>
              </div>

              {gigsLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  <GigCardSkeleton /><GigCardSkeleton /><GigCardSkeleton />
                </div>
              ) : gigs.length === 0 ? (
                <div className="cyber-border-container depth-sm p-20 text-center">
                  <p className="text-[var(--grey)] font-mono-co text-sm tracking-wide">No verified contracts active in this network segment.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {gigs.map((gig, i) => (
                    <div key={gig.id} className="scroll-reveal-child" style={{ transitionDelay: `${i * 0.10}s` }}>
                      <GigCard gig={gig} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* TRUST */}
          <section className="border-t border-[var(--glass-border-subtle)] py-24">
            <div ref={trustRef} className="scroll-reveal max-w-7xl mx-auto px-6 lg:px-16">
              <div className="text-[9px] uppercase tracking-[2.5px] text-[var(--grey)] font-mono-co mb-3">Oasis Managed</div>
              <h2 className="font-display-medium text-[28px] text-[var(--charcoal)] mb-16 tracking-wide">Vetted security. Direct compiler links.</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {TRUST.map((item, i) => {
                  const Icon = item.icon
                  return (
                    <div
                      key={item.title}
                      className="cyber-border-container depth-md p-8 flex flex-col gap-4 hover:-translate-y-1 hover:depth-lg transition-all duration-400"
                      style={{ transitionDelay: `${i * 0.1}s` }}
                    >
                      <div className="w-9 h-9 border border-[var(--glass-border)] rounded-xl flex items-center justify-center bg-[var(--surface)]">
                        <Icon size={15} className="text-[var(--grey)]" />
                      </div>
                      <h3 className="font-display-medium text-[16px] text-[var(--charcoal)] tracking-wide">{item.title}</h3>
                      <p className="text-[12px] text-[var(--grey)] leading-relaxed font-light">{item.desc}</p>
                    </div>
                  )
                })}
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="max-w-7xl mx-auto px-6 lg:px-16 py-24">
            <div ref={ctaRef} className="scroll-reveal">
              <div className="cyber-border-container depth-lg p-12 lg:p-16 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="text-center md:text-left">
                  <h2 className="font-display-medium text-[26px] text-[var(--charcoal)] mb-2 tracking-wide">Ready to verify a software node?</h2>
                  <p className="text-[12px] text-[var(--grey)] font-light tracking-wide">Deploy fixed-budget contracts to checked engineers in minutes.</p>
                </div>
                <div className="flex gap-4 shrink-0">
                  <Link href="/browse">
                    <button className="px-7 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-[11px] tracking-[2px] uppercase font-mono-co font-semibold rounded-xl transition-all shadow-[0_4px_24px_rgba(16,185,129,0.28)] hover:shadow-[0_6px_32px_rgba(16,185,129,0.38)] hover:-translate-y-0.5">
                      Explore Gigs
                    </button>
                  </Link>
                  <Link href="/auth/register">
                    <button className="px-7 py-3 glass-card depth-sm text-[var(--charcoal)] text-[11px] tracking-[2px] uppercase font-mono-co rounded-xl hover:border-[var(--line-solid)] hover:-translate-y-0.5 transition-all">
                      Join as Seller
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </section>

          <Footer />
        </div>
      </div>
    </>
  )
}

/* ─── Marketplace Panel ─────────────────────────────────────────── */
const LIVE_CATEGORIES = [
  { label: 'Web Development',  count: 213, tag: 'Most Active' },
  { label: 'AI & Automation',  count: 124, tag: '' },
  { label: 'Data Science',     count: 87,  tag: '' },
  { label: 'CS Academic',      count: 156, tag: '' },
]

const FEATURED_DEVS = [
  { initial: 'A', name: 'Arjun M.', skill: 'React · Next.js', rate: '₹4,500', rating: '4.9' },
  { initial: 'P', name: 'Priya S.', skill: 'ML · PyTorch',    rate: '₹6,200', rating: '5.0' },
  { initial: 'R', name: 'Rohan K.', skill: 'Node · AWS',      rate: '₹3,800', rating: '4.8' },
]

function MarketplacePanel() {
  return (
    <div className="glass-panel-heavy depth-panel rounded-2xl overflow-hidden w-full">

      {/* Header */}
      <div className="px-6 pt-6 pb-4 border-b border-[var(--glass-border)]">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[9px] uppercase tracking-[2.5px] font-mono-co text-[var(--grey)]">Live Marketplace</span>
          <span className="flex items-center gap-1.5 text-[9px] font-mono-co text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-shimmer" />
            300+ active gigs
          </span>
        </div>
        <p className="font-display text-[22px] text-[var(--charcoal)] leading-tight tracking-wide">
          Find your builder,<br/>set the escrow.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 border-b border-[var(--glass-border)]">
        {[
          { num: '98%', label: 'On-Time' },
          { num: '48h', label: 'First Reply' },
          { num: '4.9★', label: 'Avg Rating' },
        ].map((s) => (
          <div key={s.label} className="flex flex-col items-center justify-center py-4 border-r border-[var(--glass-border)] last:border-r-0">
            <span className="font-mono-co text-[17px] font-semibold text-[var(--charcoal)] tracking-tight">{s.num}</span>
            <span className="text-[8px] uppercase tracking-[1.5px] text-[var(--grey)] font-mono-co mt-0.5">{s.label}</span>
          </div>
        ))}
      </div>

      {/* Categories */}
      <div className="px-6 pt-4 pb-2">
        <div className="text-[8px] uppercase tracking-[2px] text-[var(--grey)] font-mono-co mb-3">Top Categories</div>
        <div className="space-y-2">
          {LIVE_CATEGORIES.map((cat) => (
            <Link
              key={cat.label}
              href={`/browse?category=${encodeURIComponent(cat.label)}`}
              className="flex items-center justify-between py-2 px-3 rounded-lg bg-[var(--glass-bg)] border border-[var(--glass-border)] hover:border-[var(--line-hover)] hover:-translate-y-px transition-all group depth-sm"
            >
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono-co text-[var(--grey)] group-hover:text-[var(--charcoal)] tracking-wide transition-colors">{cat.label}</span>
                {cat.tag && <span className="text-[7px] px-1.5 py-px bg-emerald-500/15 text-emerald-400 rounded font-mono-co uppercase tracking-wider">{cat.tag}</span>}
              </div>
              <span className="text-[9px] font-mono-co text-[var(--grey-light)] group-hover:text-[var(--grey)] transition-colors">{cat.count} gigs ›</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Featured devs */}
      <div className="px-6 pt-4 pb-2 border-t border-[var(--glass-border)] mt-2">
        <div className="text-[8px] uppercase tracking-[2px] text-[var(--grey)] font-mono-co mb-3">Featured Developers</div>
        <div className="space-y-2">
          {FEATURED_DEVS.map((dev) => (
            <div key={dev.name} className="flex items-center justify-between py-2 px-3 rounded-lg bg-[var(--glass-bg)] border border-[var(--glass-border)] depth-sm">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-[var(--capsule-bg)] border border-[var(--glass-border)] flex items-center justify-center text-[11px] font-semibold font-mono-co text-[var(--charcoal)]">
                  {dev.initial}
                </div>
                <div>
                  <div className="text-[10px] font-mono-co font-medium text-[var(--charcoal)] tracking-wide">{dev.name}</div>
                  <div className="text-[8px] text-[var(--grey)] font-mono-co tracking-wide">{dev.skill}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-[10px] font-mono-co font-semibold text-[var(--charcoal)]">{dev.rate}</div>
                <div className="text-[8px] text-emerald-400 font-mono-co">{dev.rating}★</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="px-6 pt-4 pb-6">
        <div className="flex gap-3">
          <Link href="/browse" className="flex-1">
            <button className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-[10px] tracking-[2px] uppercase font-mono-co font-semibold rounded-lg transition-all shadow-[0_4px_16px_rgba(16,185,129,0.25)] hover:-translate-y-px">
              Browse All Gigs
            </button>
          </Link>
          <Link href="/auth/register" className="flex-1">
            <button className="w-full py-2.5 bg-[var(--glass-bg)] border border-[var(--glass-border)] hover:border-[var(--line-hover)] text-[var(--charcoal)] text-[10px] tracking-[2px] uppercase font-mono-co rounded-lg transition-all backdrop-blur-sm hover:-translate-y-px depth-sm">
              Post a Project
            </button>
          </Link>
        </div>
        <p className="text-center text-[8px] text-[var(--grey-light)] font-mono-co tracking-wide mt-3">
          Escrow-protected · No hidden fees · 48h avg turnaround
        </p>
      </div>
    </div>
  )
}
