'use client'
import { useState, useEffect, useCallback, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Grid3X3, List, SlidersHorizontal, Loader2, ArrowUpRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import GigCard from '@/components/gig/GigCard'
import FilterSidebar from '@/components/gig/FilterSidebar'
import type { Gig } from '@/types'

interface Filters {
  category: string
  techStack: string[]
  budgetMin: number
  budgetMax: number
  deliveryDays: number
}

const DEFAULT: Filters = { category: 'All', techStack: [], budgetMin: 0, budgetMax: 100000, deliveryDays: 0 }
const SORT_OPTIONS = ['Popular', 'Newest', 'Best Rated', 'Lowest Price', 'Highest Price']

export default function BrowsePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center">
        <Loader2 size={24} className="animate-spin text-[var(--muted-light)]" />
      </div>
    }>
      <BrowseInner />
    </Suspense>
  )
}

function BrowseInner() {
  const searchParams  = useSearchParams()
  const searchQuery   = searchParams.get('search') ?? ''
  const initCategory  = searchParams.get('category') ?? 'All'

  const [filters, setFilters] = useState<Filters>({ ...DEFAULT, category: initCategory })
  const [sort, setSort]       = useState('Popular')
  const [gigs, setGigs]       = useState<Gig[]>([])
  const [loading, setLoading] = useState(true)
  const [mobileFilter, setMobileFilter] = useState(false)
  const [view, setView]       = useState<'grid' | 'list'>('grid')

  const fetchGigs = useCallback(async () => {
    setLoading(true)
    try {
      const sp = new URLSearchParams()
      // Only append filters when they differ from defaults
      if (filters.category && filters.category !== 'All') sp.append('category', filters.category)
      if (filters.techStack.length)    sp.append('techStack', filters.techStack.join(','))
      if (filters.budgetMin > 0)       sp.append('budgetMin', String(filters.budgetMin))
      if (filters.budgetMax < 100000)  sp.append('budgetMax', String(filters.budgetMax))
      if (filters.deliveryDays > 0)    sp.append('deliveryDays', String(filters.deliveryDays))
      if (searchQuery)                 sp.append('search', searchQuery)
      sp.append('limit', '24')

      const sortVal =
        sort === 'Best Rated'    ? 'rating'     :
        sort === 'Lowest Price'  ? 'price_asc'  :
        sort === 'Highest Price' ? 'price_desc' :
        sort === 'Newest'        ? 'newest'     : 'popular'
      sp.append('sort', sortVal)

      const res = await fetch(`/api/gigs?${sp.toString()}`)
      if (res.ok) {
        const d = await res.json()
        // Handle multiple possible response shapes
        const incoming = (d.gigs ?? d.data?.gigs ?? d.data ?? []) as Gig[]
        setGigs(Array.isArray(incoming) ? incoming : [])
      }
    } catch {
      setGigs([])
    } finally {
      setLoading(false)
    }
  }, [filters, sort, searchQuery])

  useEffect(() => { fetchGigs() }, [fetchGigs])

  const hasActiveFilters = filters.category !== 'All' || filters.techStack.length > 0 || filters.budgetMin > 0 || filters.budgetMax < 100000 || filters.deliveryDays > 0 || !!searchQuery

  return (
    <div className="aurora-page min-h-screen">
      <Navbar />

      {/* ── Page header ── */}
      <div className="pt-[68px] border-b border-[var(--line)] bg-[var(--bg)]">
        <div className="max-w-7xl mx-auto px-6 lg:px-16 py-14 lg:py-20">
          <div className="aurora-orb-blue w-[500px] h-[500px] absolute right-0 top-0 opacity-25 pointer-events-none" style={{ position: 'absolute' }} />
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="text-[11px] uppercase tracking-[2.5px] text-[var(--muted)] font-semibold mb-3">
              {gigs.length > 0 ? `${gigs.length} gigs found` : 'Marketplace'}
            </p>
            <h1 className="font-display text-display text-[var(--ink)]">
              {searchQuery
                ? `"${searchQuery}"`
                : filters.category !== 'All'
                  ? filters.category
                  : 'All Gigs'}
            </h1>
          </motion.div>
        </div>
      </div>

      {/* ── Toolbar ── */}
      <div className="sticky top-[56px] z-40 border-b border-[var(--line)] bg-[var(--glass-heavy)] backdrop-blur-2xl">
        <div className="max-w-7xl mx-auto px-6 lg:px-16 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {/* Mobile filter trigger */}
            <button
              onClick={() => setMobileFilter(true)}
              className="md:hidden flex items-center gap-2 px-3.5 py-2 rounded-full border border-[var(--line-strong)] text-[12px] font-medium text-[var(--muted)] hover:text-[var(--ink)] hover:border-[var(--ink)] transition-all"
            >
              <SlidersHorizontal size={13} /> Filters
            </button>
            {/* Active filter chips (mobile) */}
            {hasActiveFilters && (
              <button
                onClick={() => setFilters({ ...DEFAULT, category: 'All' })}
                className="text-[11px] text-[var(--muted)] hover:text-red-600 transition-colors px-3 py-2 rounded-full border border-[var(--line)]"
              >
                Clear all
              </button>
            )}
          </div>

          <div className="flex items-center gap-3 ml-auto">
            {/* Sort */}
            <select
              value={sort}
              onChange={e => setSort(e.target.value)}
              className="text-[12px] bg-transparent border border-[var(--line-strong)] rounded-full px-3.5 py-2 text-[var(--ink)] outline-none cursor-pointer hover:border-[var(--ink)] transition-all"
            >
              {SORT_OPTIONS.map(o => <option key={o}>{o}</option>)}
            </select>

            {/* View toggle */}
            <div className="flex border border-[var(--line-strong)] rounded-full overflow-hidden">
              <button
                onClick={() => setView('grid')}
                className={`p-2.5 transition-colors ${view === 'grid' ? 'bg-[var(--ink)] text-white' : 'text-[var(--muted)] hover:text-[var(--ink)]'}`}
              >
                <Grid3X3 size={13} />
              </button>
              <button
                onClick={() => setView('list')}
                className={`p-2.5 border-l border-[var(--line-strong)] transition-colors ${view === 'list' ? 'bg-[var(--ink)] text-white' : 'text-[var(--muted)] hover:text-[var(--ink)]'}`}
              >
                <List size={13} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main content ── */}
      <div className="max-w-7xl mx-auto px-6 lg:px-16 py-10">
        <div className="flex gap-10">

          {/* Sidebar — desktop */}
          <div className="hidden md:block">
            <FilterSidebar filters={filters} onChange={setFilters} />
          </div>

          {/* Mobile filter drawer */}
          <AnimatePresence>
            {mobileFilter && (
              <>
                <motion.div
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="fixed inset-0 z-[600] bg-black/40 backdrop-blur-sm md:hidden"
                  onClick={() => setMobileFilter(false)}
                />
                <motion.div
                  initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
                  transition={{ type: 'spring', stiffness: 350, damping: 35 }}
                  className="fixed left-0 top-0 bottom-0 z-[700] w-72 bg-[var(--surface)] border-r border-[var(--line)] p-6 overflow-y-auto md:hidden shadow-[var(--shadow-xl)]"
                >
                  <FilterSidebar filters={filters} onChange={f => { setFilters(f); setMobileFilter(false) }} />
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* Gigs */}
          <div className="flex-1 min-w-0">
            {loading ? (
              <div className="flex justify-center py-32">
                <Loader2 size={28} className="animate-spin text-[var(--muted-light)]" />
              </div>
            ) : gigs.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-32 text-center">
                <div className="font-display text-[80px] leading-none text-[var(--line-strong)] mb-6 select-none">∅</div>
                <h2 className="font-display-medium text-[22px] text-[var(--ink)] mb-3">
                  {hasActiveFilters ? 'No gigs match your filters.' : 'No gigs yet.'}
                </h2>
                <p className="text-[14px] text-[var(--muted)] font-light mb-8">
                  {hasActiveFilters ? 'Try adjusting your filters or search.' : 'Check back soon — sellers are posting gigs daily.'}
                </p>
                {hasActiveFilters && (
                  <button
                    onClick={() => { setFilters({ ...DEFAULT }); window.history.pushState({}, '', '/browse') }}
                    className="flex items-center gap-2 px-6 py-3 rounded-full border border-[var(--line-strong)] text-[13px] font-medium text-[var(--ink)] hover:bg-[var(--line)] transition-all"
                  >
                    Clear Filters <ArrowUpRight size={13} />
                  </button>
                )}
              </div>
            ) : view === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                <AnimatePresence mode="popLayout">
                  {gigs.map((gig, i) => (
                    <motion.div
                      key={gig.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.96 }}
                      transition={{ duration: 0.45, delay: Math.min(i * 0.05, 0.4), ease: [0.16, 1, 0.3, 1] }}
                    >
                      <GigCard gig={gig} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {gigs.map((gig, i) => (
                  <motion.a
                    key={gig.id}
                    href={`/gig/${gig.id}`}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: Math.min(i * 0.04, 0.3), ease: [0.16, 1, 0.3, 1] }}
                    className="bento-card p-5 flex gap-5 hover:-translate-y-1 transition-all duration-300 group"
                  >
                    <div className="w-28 h-20 bg-[var(--bg-secondary)] rounded-2xl shrink-0 flex items-center justify-center overflow-hidden">
                      {gig.thumbnail
                        ? <img src={gig.thumbnail} alt={gig.title} className="w-full h-full object-cover" />
                        : <div className="w-full h-full flex items-center justify-center"><span className="text-[var(--muted-light)] text-[22px] font-display">{gig.title.charAt(0)}</span></div>
                      }
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="pill-badge pill-muted">{gig.category}</span>
                        {gig.rating > 0 && <span className="text-[11px] text-amber-500 font-medium">★ {gig.rating}</span>}
                      </div>
                      <h3 className="font-display-medium text-[16px] text-[var(--ink)] group-hover:text-[var(--royal-blue)] transition-colors mb-1.5 line-clamp-1">{gig.title}</h3>
                      <p className="text-[13px] text-[var(--muted)] line-clamp-2 font-light leading-relaxed">{gig.description}</p>
                    </div>
                    <div className="shrink-0 text-right flex flex-col justify-between">
                      <div>
                        <div className="text-[11px] text-[var(--muted-light)] mb-0.5">From</div>
                        <div className="font-display text-[22px] text-[var(--ink)] leading-none">₹{gig.basicPrice.toLocaleString()}</div>
                      </div>
                      <div className="text-[11px] text-[var(--muted-light)]">{gig.deliveryDays}d delivery</div>
                    </div>
                  </motion.a>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
