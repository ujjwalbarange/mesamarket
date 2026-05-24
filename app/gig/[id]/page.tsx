'use client'
import { useState, useEffect, use } from 'react'
import Link from 'next/link'
import { Star, Clock, RefreshCw, Check, ShieldCheck, ChevronRight, Package, ArrowLeft } from 'lucide-react'
import { motion } from 'framer-motion'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import type { Gig } from '@/types'

export default function GigPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [gig, setGig]             = useState<Gig | null>(null)
  const [loading, setLoading]     = useState(true)
  const [activePkg, setActivePkg] = useState<'basic' | 'standard' | 'premium'>('standard')
  const [orderLoading, setOrderLoading] = useState(false)

  useEffect(() => {
    fetch(`/api/gigs/${id}`)
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (d?.gig) setGig(d.gig as Gig); setLoading(false) })
      .catch(() => setLoading(false))
  }, [id])

  const handleOrder = async () => {
    if (!gig) return
    setOrderLoading(true)
    try {
      const res = await fetch('/api/orders', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gigId: gig.id, package: activePkg }),
      })
      if (res.ok) {
        const d = await res.json()
        window.location.href = `/checkout?orderId=${d.order.id}&gigId=${gig.id}&tier=${activePkg}&price=${d.order.price}`
      } else {
        const d = await res.json()
        if (d.error?.toLowerCase().includes('unauthorized')) window.location.href = '/auth/login'
        else alert(d.error || 'Order failed. Please try again.')
      }
    } catch { alert('Network error. Please try again.') }
    finally { setOrderLoading(false) }
  }

  if (loading) return (
    <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center">
      <RefreshCw size={24} className="animate-spin text-[var(--muted-light)]" />
    </div>
  )

  if (!gig) return (
    <div className="aurora-page min-h-screen">
      <Navbar />
      <div className="max-w-7xl mx-auto px-8 py-40 text-center">
        <div className="font-display text-[80px] text-[var(--line-strong)] leading-none mb-6 select-none">404</div>
        <h1 className="font-display-medium text-[24px] text-[var(--ink)] mb-4">Gig Not Found</h1>
        <Link href="/browse" className="inline-flex items-center gap-2 text-[13px] font-medium text-[var(--muted)] hover:text-[var(--ink)] transition-colors">
          <ArrowLeft size={14} /> Back to Browse
        </Link>
      </div>
    </div>
  )

  const packages = {
    basic:    { label: 'Basic',    price: gig.basicPrice,    desc: gig.basicDesc    || 'Core architecture and basic functionality.', deadline: gig.deliveryDays,     items: ['Source Code', 'Setup Guide'] },
    standard: { label: 'Standard', price: gig.standardPrice, desc: gig.standardDesc || 'Full development with API integration.',     deadline: gig.deliveryDays + 3, items: ['Source Code', 'Setup Guide', '1 Revision', 'Technical Docs'] },
    premium:  { label: 'Premium',  price: gig.premiumPrice,  desc: gig.premiumDesc  || 'Enterprise-ready with deployment & support.', deadline: gig.deliveryDays + 7, items: ['Source Code', 'Setup Guide', 'Priority Support', '3 Revisions', 'Deployment'] },
  }
  const pkg = packages[activePkg]

  return (
    <div className="aurora-page min-h-screen">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 lg:px-16 pt-28 pb-20">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-[12px] text-[var(--muted)] mb-10">
          <Link href="/browse" className="flex items-center gap-1.5 hover:text-[var(--ink)] transition-colors">
            <ArrowLeft size={12} /> Browse
          </Link>
          <ChevronRight size={11} className="text-[var(--muted-light)]" />
          <span className="text-[var(--ink)]">{gig.category}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* ── Left — main content ── */}
          <div className="lg:col-span-8">
            <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: [0.16,1,0.3,1] }}>

              {/* Title */}
              <h1 className="font-display text-display text-[var(--ink)] mb-8">{gig.title}</h1>

              {/* Seller strip */}
              <div className="flex items-center gap-4 mb-10 pb-10 border-b border-[var(--line)]">
                <div className="w-12 h-12 rounded-2xl bg-[var(--ink)] flex items-center justify-center text-white font-display-bold text-lg">
                  {gig.seller?.name?.charAt(0) ?? 'S'}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-display-medium text-[15px] text-[var(--ink)]">{gig.seller?.name ?? 'Seller'}</span>
                    <Badge variant="blue">Pro Seller</Badge>
                  </div>
                  {gig.rating > 0 && (
                    <div className="flex items-center gap-1.5 text-[12px] text-amber-500">
                      <Star size={12} fill="currentColor" /> {gig.rating}
                      <span className="text-[var(--muted-light)]">({gig.totalOrders ?? 0} orders)</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Hero image */}
              <div className="aspect-video rounded-[28px] overflow-hidden bg-[var(--bg-secondary)] mb-12 relative group">
                {gig.thumbnail ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={gig.thumbnail} alt={gig.title} className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-700" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center relative overflow-hidden">
                    <div className="aurora-orb-blue w-64 h-64 opacity-30" style={{ position: 'absolute', top: '-20%', right: '-10%' }} />
                    <Package size={52} className="text-[var(--muted-light)] relative z-10" />
                  </div>
                )}
              </div>

              {/* Demo */}
              {gig.demoUrl && (
                <div className="mb-12">
                  <h2 className="text-[11px] uppercase tracking-[2.5px] font-semibold text-[var(--muted)] mb-5">Preview / Demo</h2>
                  <div className="rounded-[24px] overflow-hidden border border-[var(--line)]">
                    {gig.demoUrl.startsWith('data:image/')  && <img src={gig.demoUrl} alt="Demo" className="w-full h-auto" />}
                    {gig.demoUrl.startsWith('data:video/')  && <video src={gig.demoUrl} controls className="w-full h-auto" />}
                    {(gig.demoUrl.includes('youtube.com') || gig.demoUrl.includes('youtu.be')) && (
                      <div className="aspect-video">
                        <iframe className="w-full h-full" src={gig.demoUrl.replace('watch?v=', 'embed/').replace('youtu.be/', 'youtube.com/embed/')} title="Demo" frameBorder="0" allowFullScreen />
                      </div>
                    )}
                    {!gig.demoUrl.startsWith('data:') && !gig.demoUrl.includes('youtube') && !gig.demoUrl.includes('youtu.be') && (
                      <div className="p-8 flex items-center justify-between gap-6 bg-[var(--bg-secondary)]">
                        <p className="text-[13px] text-[var(--muted)] font-light">A demo file is available for this gig.</p>
                        <Button variant="outline" size="sm" onClick={() => window.open(gig.demoUrl!, '_blank')}>View Demo</Button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* About */}
              <div className="mb-12">
                <h2 className="text-[11px] uppercase tracking-[2.5px] font-semibold text-[var(--muted)] mb-5">About this Gig</h2>
                <div className="text-[15px] leading-[1.85] text-[var(--ink-soft)] font-light whitespace-pre-wrap">{gig.description}</div>
              </div>

              {/* Tech stack */}
              <div className="mb-12">
                <h2 className="text-[11px] uppercase tracking-[2.5px] font-semibold text-[var(--muted)] mb-5">Technologies</h2>
                <div className="flex flex-wrap gap-2">
                  {gig.techStack.split(',').map((tech: string) => (
                    <span key={tech} className="pill-badge pill-blue">{tech.trim()}</span>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* ── Right — sticky pricing ── */}
          <div className="lg:col-span-4">
            <motion.div
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.15, ease: [0.16,1,0.3,1] }}
              className="sticky top-24 space-y-4"
            >
              {/* Pricing card */}
              <div className="bento-card overflow-hidden">
                {/* Package tabs */}
                <div className="flex border-b border-[var(--line)]">
                  {(['basic', 'standard', 'premium'] as const).map(k => (
                    <button key={k} onClick={() => setActivePkg(k)}
                      className={`flex-1 py-3.5 text-[11px] font-semibold capitalize tracking-wide transition-all ${
                        activePkg === k
                          ? 'bg-[var(--ink)] text-white'
                          : 'text-[var(--muted)] hover:text-[var(--ink)] hover:bg-[var(--bg-secondary)]'
                      }`}
                    >{k}</button>
                  ))}
                </div>

                <div className="p-7">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-display-medium text-[18px] text-[var(--ink)] capitalize">{activePkg} Package</h3>
                    <div className="font-display text-[28px] text-[var(--ink)] leading-none">₹{pkg.price.toLocaleString()}</div>
                  </div>
                  <p className="text-[13px] text-[var(--muted)] font-light mb-6 leading-relaxed">{pkg.desc}</p>

                  <div className="space-y-3 mb-7">
                    <div className="flex items-center gap-3 text-[13px] text-[var(--ink-soft)]">
                      <Clock size={14} className="text-[var(--muted-light)] shrink-0" />
                      {pkg.deadline} days delivery
                    </div>
                    {pkg.items.map(item => (
                      <div key={item} className="flex items-center gap-3 text-[13px] text-[var(--ink-soft)]">
                        <Check size={14} className="text-emerald-500 shrink-0" />
                        {item}
                      </div>
                    ))}
                  </div>

                  <Button size="lg" className="w-full" onClick={handleOrder} loading={orderLoading}>
                    Continue · ₹{pkg.price.toLocaleString()}
                  </Button>
                </div>
              </div>

              {/* Trust badge */}
              <div className="bento-card p-5 flex items-start gap-3">
                <ShieldCheck size={18} className="text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-[12px] font-semibold text-[var(--ink)] mb-1">Oasis Escrow Protection</h4>
                  <p className="text-[12px] text-[var(--muted)] font-light leading-relaxed">Payment held securely and released only when you approve the delivered work.</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
