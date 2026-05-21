'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowRight, Zap, Code2, FlaskConical, GraduationCap, Shield, Clock, Terminal, Laptop, Activity } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import GigCard from '@/components/gig/GigCard'
import Button from '@/components/ui/Button'
import type { Gig } from '@/types'

const CATEGORIES = [
  { icon: Zap,           label: 'AI Automation',  count: 124 },
  { icon: Code2,         label: 'Web Development', count: 213 },
  { icon: FlaskConical,  label: 'Data Science',    count: 87  },
  { icon: GraduationCap, label: 'CS Academic',     count: 156 },
]

const STATS = [
  { num: '47+', label: 'PROJ_SHIPPED' },
  { num: '32',  label: 'VETTED_DEVS' },
  { num: '98%', label: 'DELIVERY_RATE' },
  { num: '4.9★',label: 'AVG_SCORE' },
]

const TRUST = [
  { icon: Shield, title: 'Vetted Talent Protocol', desc: 'Every university engineer is manually audited for clean architectures, communication, and milestone reliability.' },
  { icon: Clock,  title: 'Escrow Managed Delivery',  desc: 'C-Oasis oversees visual milestones and code review before releasing funds, ensuring zero code-dumps.' },
  { icon: Zap,    title: 'Fixed Pricing Schema',    desc: 'Bespoke fixed-budget contracts locked upfront in secure escrow. No surprises, no hourly leakages.' },
]

const GigCardSkeleton = () => (
  <div className="cyber-border-container glass-card h-[400px] flex flex-col justify-between p-5 animate-pulse select-none">
    <div className="relative aspect-[4/3] w-full bg-[var(--paper-dark)] border border-[var(--line)] rounded-lg mb-4" />
    <div className="space-y-3 flex-1 flex flex-col justify-between">
      <div className="space-y-2">
        <div className="flex gap-2">
          <div className="h-4 bg-[var(--paper-dark)] border border-[var(--line)] rounded w-16" />
          <div className="h-4 bg-[var(--paper-dark)] border border-[var(--line)] rounded w-12" />
        </div>
        <div className="h-5 bg-[var(--paper-dark)] border border-[var(--line)] rounded w-1/3 mt-2" />
        <div className="h-4 bg-[var(--paper-dark)] border border-[var(--line)] rounded w-full mt-2" />
        <div className="h-4 bg-[var(--paper-dark)] border border-[var(--line)] rounded w-5/6" />
      </div>
      <div className="flex items-center justify-between pt-4 border-t border-[var(--line)] mt-4">
        <div className="space-y-1">
          <div className="h-3 bg-[var(--paper-dark)] border border-[var(--line)] rounded w-16" />
          <div className="h-5 bg-[var(--paper-dark)] border border-[var(--line)] rounded w-24" />
        </div>
        <div className="h-4 bg-[var(--paper-dark)] border border-[var(--line)] rounded w-10" />
      </div>
    </div>
  </div>
)

export default function HomePage() {
  const [gigs, setGigs] = useState<Gig[]>([])
  const [gigsLoading, setGigsLoading] = useState(true)
  const [isCompiling, setIsCompiling] = useState(false)
  const [hoverIDE, setHoverIDE] = useState(false)

  useEffect(() => {
    fetch('/api/gigs?limit=6&sort=popular')
      .then(r => r.json())
      .then(d => setGigs((d.gigs || d.data?.gigs || []) as Gig[]))
      .catch(() => {})
      .finally(() => setGigsLoading(false))
  }, [])

  useEffect(() => {
    if (hoverIDE) {
      setIsCompiling(true)
      const t = setTimeout(() => setIsCompiling(false), 1400)
      return () => clearTimeout(t)
    }
  }, [hoverIDE])

  return (
    <div className="min-h-screen bg-[var(--paper)] text-[var(--grey)] font-sans pt-[92px]">
      <Navbar />

      {/* HERO SECTION */}
      <section className="relative overflow-hidden py-20 lg:py-32 border-b border-[var(--line)]">
        <div className="absolute top-[10%] right-[10%] w-[500px] h-[500px] rounded-full bg-[var(--paper-dark)]/10 blur-[140px] pointer-events-none" />
        <div className="absolute bottom-[10%] left-[10%] w-[500px] h-[500px] rounded-full bg-[var(--paper)]/25 blur-[160px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 lg:px-16">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Copy */}
            <div className="lg:col-span-5 flex flex-col justify-center text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[var(--paper-dark)]/40 border border-[var(--line)] rounded-full text-[10px] uppercase tracking-[2px] text-[var(--grey)] font-mono-co mb-6 w-fit mx-auto lg:mx-0">
                <Terminal size={12} />
                MANAGED COMPILATION PIPELINE
              </div>
              <h1 className="font-display text-[40px] md:text-[52px] lg:text-[58px] leading-[1.05] font-semibold text-[var(--charcoal)] mb-8 tracking-tight">
                Vetted university developers. <br/>
                Escrowed code delivery.
              </h1>
              <p className="text-[14px] leading-[1.8] text-[var(--grey)] max-w-lg mb-10 mx-auto lg:mx-0 font-sans">
                The boutique tech forge where checked university computer science engineers build high-performance web systems, AI configurations, and technical tools for forward-thinking brands.
              </p>
              
              <div className="flex items-center gap-4 flex-wrap justify-center lg:justify-start">
                <Link href="/browse"><Button size="lg">Explore Gigs -&gt;</Button></Link>
                <Link href="/auth/register"><Button variant="outline" size="lg">Verify as Seller</Button></Link>
              </div>

              {/* Monospaced Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4 mt-16 pt-10 border-t border-[var(--line)] text-left">
                {STATS.map((s) => (
                  <div key={s.label} className="space-y-1">
                    <div className="font-mono-co text-2xl font-semibold text-[var(--charcoal)]">{s.num}</div>
                    <div className="text-[9px] uppercase tracking-[1.5px] text-[var(--grey-light)] font-mono-co">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Premium Interactive IDE Code Stream & App wireframe preview */}
            <div className="lg:col-span-7 flex justify-center w-full">
              <div 
                className="w-full max-w-[620px] cyber-border-container p-1 bg-[var(--paper-dark)]/80 glass-panel overflow-hidden cursor-pointer"
                onMouseEnter={() => setHoverIDE(true)}
                onMouseLeave={() => setHoverIDE(false)}
              >
                {/* Editor Header */}
                <div className="flex justify-between items-center px-4 py-2 border-b border-[var(--line)] bg-[var(--paper-dark)]">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[var(--line-hover)]" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[var(--line-hover)]" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[var(--line-hover)]" />
                    <span className="text-[10px] text-[var(--grey-light)] font-mono-co ml-3 uppercase tracking-wider">compiler.config.ts</span>
                  </div>
                  <div className="flex items-center gap-2 text-[9px] font-mono-co text-[var(--grey)] bg-[var(--paper)] border border-[var(--line)] px-2 py-0.5 rounded">
                    <Laptop size={10} className="text-[var(--grey)]" />
                    NODE_ACTIVE
                  </div>
                </div>

                {/* Editor Workspace split container */}
                <div className="grid grid-cols-1 md:grid-cols-12 h-[340px] font-mono-co">
                  
                  {/* Left Sidebar or Code editor panel */}
                  <div className="col-span-7 p-4 border-r border-[var(--line)] overflow-hidden text-[10.5px] leading-relaxed relative flex flex-col justify-between">
                    <div className="space-y-1">
                      <div><span className="text-[var(--grey-light)]">import</span> &#123; <span className="text-[var(--charcoal)] font-medium">AgentEscrow</span> &#125; <span className="text-[var(--grey-light)]">from</span> <span className="text-[var(--grey)]">&apos;@oasis/core&apos;</span></div>
                      <div><span className="text-[var(--grey-light)]">import</span> &#123; <span className="text-[var(--charcoal)] font-medium">NextAuth</span> &#125; <span className="text-[var(--grey-light)]">from</span> <span className="text-[var(--grey)]">&apos;jose&apos;</span></div>
                      <div className="text-slate-500/70">// Initiate secure pipeline</div>
                      <div><span className="text-[var(--grey-light)]">const</span> <span className="text-[var(--charcoal)]">node</span> = <span className="text-[var(--grey-light)]">new</span> <span className="text-[var(--charcoal)]">AgentEscrow</span>(&#123;</div>
                      <div className="pl-4">id: <span className="text-[var(--grey)]">&apos;NODE_VERIFY_2.1&apos;</span>,</div>
                      <div className="pl-4">rateLimit: <span className="text-[var(--grey-light)]">true</span>,</div>
                      <div className="pl-4">compilation: <span className="text-[var(--grey)]">&apos;TURBOPACK&apos;</span></div>
                      <div>&#125;)</div>
                      <div className="text-slate-500/70 mt-2">// Escrow contract checks</div>
                      <div><span className="text-[var(--grey-light)]">async function</span> <span className="text-emerald-600 dark:text-emerald-400 font-medium">deployNode</span>(developerId) &#123;</div>
                      <div className="pl-4"><span className="text-[var(--grey-light)]">const</span> verified = <span className="text-[var(--grey-light)]">await</span> node.<span className="text-emerald-650 dark:text-emerald-450">audit</span>(developerId)</div>
                      <div className="pl-4"><span className="text-[var(--grey-light)]">if</span> (verified) &#123;</div>
                      <div className="pl-8"><span className="text-[var(--grey-light)]">return</span> <span className="text-[var(--grey-light)]">await</span> node.<span className="text-emerald-650 dark:text-emerald-450">compileWireframe</span>()</div>
                      <div className="pl-4">&#125;</div>
                      <div>&#125;</div>
                    </div>

                    {/* Interactive Compilation Status bar */}
                    <div className="mt-4 p-2 bg-[var(--paper)] border border-[var(--line)] rounded flex items-center justify-between">
                      <span className="text-[9px] text-[var(--grey-light)]">SYSTEM_OUTPUT</span>
                      {isCompiling ? (
                        <span className="text-[9px] text-[var(--grey)] flex items-center gap-1.5 animate-pulse">
                          <Activity size={10} className="animate-spin" />
                          COMPILING_WIRE...
                        </span>
                      ) : (
                        <span className="text-[9px] text-[var(--grey)] flex items-center gap-1">
                          ● READY_STATE
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Right Browser Wireframe Viewport Mockup */}
                  <div className="col-span-5 p-4 bg-[var(--paper)]/10 relative overflow-hidden flex flex-col justify-between">
                    {/* Browser Address bar */}
                    <div className="w-full py-1 px-2.5 bg-[var(--paper-dark)]/85 border border-[var(--line)] rounded text-[8.5px] text-[var(--grey)] mb-4 select-none truncate">
                      https://c-oasis.dev/preview
                    </div>

                    {/* Wireframe Preview Canvas */}
                    <div className="flex-1 border border-[var(--line)] rounded bg-[var(--paper-dark)]/50 p-2.5 flex flex-col gap-2 relative">
                      {isCompiling ? (
                        <div className="absolute inset-0 bg-[var(--paper-dark)]/85 flex flex-col items-center justify-center gap-2 z-20">
                          <div className="w-4 h-4 border-2 border-[var(--line-hover)] border-t-transparent rounded-full animate-spin" />
                          <span className="text-[8px] tracking-[1.5px] uppercase text-[var(--grey)] animate-pulse">Building Node</span>
                        </div>
                      ) : null}

                      {/* Mock Stat Cards */}
                      <div className="flex justify-between gap-1.5">
                        <div className="flex-1 bg-[var(--paper)] border border-[var(--line)] p-1.5 rounded flex flex-col gap-1">
                          <span className="text-[6px] text-[var(--grey-light)] uppercase tracking-wider">Node Escrow</span>
                          <span className="text-[10px] font-semibold text-[var(--charcoal)] font-sans">₹12,400</span>
                        </div>
                        <div className="flex-1 bg-[var(--paper)] border border-[var(--line)] p-1.5 rounded flex flex-col gap-1">
                          <span className="text-[6px] text-[var(--grey-light)] uppercase tracking-wider">KPI Uptime</span>
                          <span className="text-[10px] font-semibold text-[var(--charcoal)] font-sans">99.88%</span>
                        </div>
                      </div>

                      {/* Mock Chart Area */}
                      <div className="flex-1 border border-[var(--line)] bg-[var(--paper-dark)]/80 rounded p-1 flex flex-col justify-end gap-1 overflow-hidden relative">
                        <div className="absolute top-1 left-1.5 text-[5.5px] text-[var(--grey-light)] uppercase tracking-widest">LIVE_SIGNAL_METRICS</div>
                        <div className="flex items-end justify-between gap-1 h-[32px] px-1">
                          <div className="w-full bg-[var(--line-hover)] h-[10%] rounded-sm" />
                          <div className="w-full bg-[var(--line-hover)] h-[30%] rounded-sm" />
                          <div className="w-full bg-[var(--grey)]/40 h-[60%] rounded-sm" />
                          <div className="w-full bg-[var(--grey)]/60 h-[80%] rounded-sm" />
                          <div className="w-full bg-[var(--grey)]/60 h-[50%] rounded-sm" />
                          <div className="w-full bg-[var(--grey)] h-[95%] rounded-sm" />
                        </div>
                      </div>

                      {/* Compiling Success Indicator */}
                      <div className="text-[7.5px] text-center text-[var(--charcoal)] bg-[var(--paper)] border border-[var(--line)] py-1 rounded tracking-wide uppercase font-semibold">
                        PREVIEW COMPILED OK
                      </div>
                    </div>

                    <div className="text-center text-[7.5px] text-[var(--grey-light)] font-mono-co mt-2 uppercase select-none">
                      Hover to trigger reload
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* CATEGORIES SECTION */}
      <section className="border-b border-[var(--line)] bg-[var(--paper-dark)]/40 relative">
        <div className="max-w-7xl mx-auto px-6 lg:px-16 py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon
              return (
                <Link 
                  key={cat.label} 
                  href={`/browse?category=${encodeURIComponent(cat.label)}`}
                  className="cyber-border-container p-5 flex items-center gap-4 group transition-all duration-300 hover:border-[var(--line-hover)]"
                >
                  <div className="w-9 h-9 border border-[var(--line)] rounded-lg flex items-center justify-center bg-[var(--paper-dark)] group-hover:border-[var(--line-hover)] transition-all duration-300">
                    <Icon size={14} className="text-[var(--grey-light)] group-hover:text-[var(--charcoal)] transition-colors duration-300" />
                  </div>
                  <div>
                    <div className="text-[12px] font-mono-co font-semibold text-[var(--grey)] group-hover:text-[var(--charcoal)] transition-colors duration-300">{cat.label}</div>
                    <div className="text-[9px] font-mono-co text-[var(--grey-light)] mt-0.5">{cat.count} nodes active</div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* POPULAR GIGS FEED */}
      <section className="max-w-7xl mx-auto px-6 lg:px-16 py-28">
        <div className="cyber-border-container p-6 flex flex-col sm:flex-row items-center sm:items-end justify-between mb-14 gap-4 bg-[var(--paper-dark)]/20">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-[var(--paper-dark)]/40 border border-[var(--line)] rounded-md text-[9px] uppercase tracking-[1.5px] text-[var(--grey)] font-mono-co mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--grey-light)] shrink-0" />
              Verified Escrows
            </div>
            <h2 className="font-display text-3xl font-semibold text-[var(--charcoal)] tracking-tight">Active compiler nodes</h2>
          </div>
          <Link href="/browse" className="flex items-center gap-2 text-[10px] uppercase tracking-[2px] font-mono-co text-[var(--grey)] hover:text-[var(--charcoal)] font-semibold transition-colors shrink-0">
            Audit All Contracts <ArrowRight size={12}/>
          </Link>
        </div>

        {gigsLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <GigCardSkeleton />
            <GigCardSkeleton />
            <GigCardSkeleton />
          </div>
        ) : gigs.length === 0 ? (
          <div className="cyber-border-container glass-card p-20 text-center">
            <p className="text-[var(--grey)] font-mono-co text-sm">No verified contracts active in this network segment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {gigs.map(gig => <GigCard key={gig.id} gig={gig}/>)}
          </div>
        )}
      </section>

      {/* MANAGED DIFFERENCE TRUST SECTION */}
      <section className="bg-[var(--paper-dark)]/40 border-t border-b border-[var(--line)] py-28 relative">
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[var(--line-hover)] to-transparent" />
        
        <div className="max-w-7xl mx-auto px-6 lg:px-16">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-[var(--paper-dark)] border border-[var(--line)] rounded-md text-[9px] uppercase tracking-[1.5px] text-[var(--grey)] font-mono-co mb-3">
            OASIS MANAGED ESCROW
          </div>
          <h2 className="font-display text-3xl font-semibold text-[var(--charcoal)] mb-20 tracking-tight">Vetted security, direct compiler links</h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            {TRUST.map((item) => {
              const Icon = item.icon
              return (
                <div key={item.title} className="cyber-border-container p-8 relative flex flex-col justify-between bg-[var(--paper-dark)]/40">
                  <div>
                    <div className="w-10 h-10 border border-[var(--line)] rounded-xl flex items-center justify-center mb-6 bg-[var(--paper-dark)]">
                      <Icon size={16} className="text-[var(--grey)]" />
                    </div>
                    <h3 className="font-display text-[18px] font-semibold text-[var(--charcoal)] mb-3 tracking-tight">{item.title}</h3>
                    <p className="text-[12.5px] text-[var(--grey)] leading-relaxed font-sans">{item.desc}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="max-w-7xl mx-auto px-6 lg:px-16 py-28">
        <div className="cyber-border-container p-12 lg:p-16 flex flex-col md:flex-row items-center justify-between gap-8 bg-[var(--paper-dark)]/40 border border-[var(--line)] shadow-xl">
          <div className="text-center md:text-left">
            <h2 className="font-display text-3xl font-semibold text-[var(--charcoal)] mb-2 tracking-tight">
              Ready to verify a software node?
            </h2>
            <p className="text-[13px] text-[var(--grey)] font-sans">Deploy fixed-budget contracts to checked computer science engineers in minutes.</p>
          </div>
          <div className="flex gap-4 shrink-0">
            <Link href="/browse"><Button size="lg">Explore Gigs</Button></Link>
            <Link href="/auth/register"><Button variant="outline" size="lg">Verify as Seller</Button></Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
