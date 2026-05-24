'use client'
import Link from 'next/link'
import { Star, Clock, ArrowUpRight } from 'lucide-react'
import { motion } from 'framer-motion'
import type { Gig } from '@/types'

export default function GigCard({ gig }: { gig: Gig }) {
  const tags = gig.techStack.split(',').map(s => s.trim()).filter(Boolean).slice(0, 3)

  return (
    <Link href={`/gig/${gig.id}`} className="group block h-full">
      <motion.article
        className="h-full flex flex-col bg-[var(--surface)] border border-[var(--line)] rounded-[28px] overflow-hidden transition-all duration-300 hover:border-[var(--line-strong)] cursor-pointer"
        style={{ boxShadow: 'var(--shadow-card)' }}
        initial={{ y: 0 }}
        whileHover={{ y: -6, boxShadow: 'var(--shadow-panel)' }}
        transition={{ type: 'spring', stiffness: 380, damping: 28 }}
      >
        {/* Image container — 32px rounded feel */}
        <div className="relative aspect-[16/10] overflow-hidden bg-[var(--bg-secondary)] rounded-[20px] m-3 mb-0 shrink-0">
          {gig.thumbnail ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={gig.thumbnail}
              alt={gig.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center relative overflow-hidden">
              {/* Ambient mini-aurora */}
              <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-30 blur-3xl bg-[var(--royal-blue)]" />
              <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full opacity-20 blur-3xl bg-[var(--cyan)]" />
              <svg width="36" height="36" viewBox="0 0 36 36" fill="none" className="opacity-20 relative z-10">
                <path d="M18 3L33 11v14L18 33 3 25V11z" stroke="var(--ink)" strokeWidth="1.2" strokeLinejoin="round"/>
              </svg>
            </div>
          )}
          {/* Category pill overlay */}
          <div className="absolute bottom-3 left-3">
            <span className="pill-badge pill-muted text-[10px] font-medium bg-[var(--glass-heavy)] backdrop-blur-md border border-[var(--glass-border)]">
              {gig.category}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col flex-1 p-5 pt-4">
          {/* Seller */}
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 rounded-full bg-[var(--ink)] flex items-center justify-center text-[10px] font-bold text-white shrink-0">
              {gig.seller?.name?.charAt(0)?.toUpperCase() ?? 'S'}
            </div>
            <span className="text-[12px] text-[var(--muted)] truncate">{gig.seller?.name ?? 'Seller'}</span>
            {gig.rating > 0 && (
              <div className="ml-auto flex items-center gap-1 text-[11px] text-amber-500 shrink-0">
                <Star size={10} fill="currentColor" />
                <span className="font-semibold">{gig.rating}</span>
              </div>
            )}
          </div>

          {/* Title */}
          <h3 className="font-display-medium text-[15px] text-[var(--ink)] leading-snug line-clamp-2 flex-1 mb-3 group-hover:text-[var(--royal-blue)] transition-colors">
            {gig.title}
          </h3>

          {/* Tags */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {tags.map(tag => (
                <span key={tag} className="pill-badge pill-muted">{tag}</span>
              ))}
            </div>
          )}

          {/* Footer: delivery + price */}
          <div className="flex items-center justify-between pt-3.5 border-t border-[var(--line)] mt-auto">
            <div className="flex items-center gap-1.5 text-[11px] text-[var(--muted-light)]">
              <Clock size={11} />
              <span>{gig.deliveryDays}d delivery</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div>
                <span className="text-[10px] text-[var(--muted-light)]">From </span>
                <span className="text-[16px] font-display-bold text-[var(--ink)]">₹{gig.basicPrice.toLocaleString()}</span>
              </div>
              <ArrowUpRight size={13} className="text-[var(--muted-light)] group-hover:text-[var(--royal-blue)] transition-colors" />
            </div>
          </div>
        </div>
      </motion.article>
    </Link>
  )
}
