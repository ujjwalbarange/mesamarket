'use client'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import StarRating from '@/components/ui/StarRating'
import { Gig } from '@/types'

interface GigCardProps {
  gig: Gig
}

const getTechIconBadge = (tech: string) => {
  const t = tech.toUpperCase().trim()
  return (
    <span key={tech} className="inline-flex items-center bg-[var(--paper-dark)] border border-[var(--line)] text-[var(--grey)] px-2 py-0.5 rounded text-[9px] font-mono-co">
      {t}
    </span>
  )
}

export default function GigCard({ gig }: GigCardProps) {
  // Map comma separated tags to array
  const tags = gig.techStack.split(',').map(s => s.trim()).filter(Boolean).slice(0, 3)

  return (
    <Link href={`/gig/${gig.id}`} className="group block h-full">
      <motion.div 
        className="cyber-border-container glass-card depth-sm h-full flex flex-col justify-between overflow-hidden cursor-pointer transition-all duration-300 hover:border-[var(--line-hover)] hover:depth-lg"
        initial={{ y: 0 }}
        whileHover={{ y: -6 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      >
        {/* Top Segment: Fixed aspect ratio image with objects cover */}
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-[var(--paper-dark)] border-b border-[var(--line)]">
          {gig.thumbnail ? (
            <Image
              src={gig.thumbnail}
              alt={gig.title}
              fill
              sizes="(max-w-7xl) 33vw, 100vw"
              className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-[var(--paper)] text-[var(--grey-light)]/40">
              <svg width="40" height="40" viewBox="0 0 48 48" fill="none" className="text-slate-800/20 mb-2">
                <path d="M24 4L44 15v18L24 44 4 33V15z" stroke="currentColor" strokeWidth="1.5"/>
              </svg>
              <span className="text-[10px] font-mono-co tracking-[1.5px] uppercase opacity-30">Live Preview Empty</span>
            </div>
          )}

          {/* Category Floating Pill inside image */}
          <div className="absolute top-3 left-3">
            <span className="bg-[var(--paper-dark)]/85 backdrop-blur-md border border-[var(--line)] text-[8px] uppercase tracking-[1.5px] font-semibold text-[var(--grey)] px-2 py-0.5 rounded-md">
              {gig.category}
            </span>
          </div>
        </div>

        {/* Content Segment */}
        <div className="p-5 flex-1 flex flex-col justify-between">
          <div>
            {/* Tech Stack Pills Badge just below the image */}
            <div className="flex flex-wrap gap-1.5 mb-4">
              {tags.map(tag => getTechIconBadge(tag))}
            </div>

            {/* Seller profile reference */}
            <div className="flex items-center gap-2 mb-3">
              <div className="w-5 h-5 rounded-md border border-[var(--line)] bg-[var(--paper-dark)]/60 text-[var(--grey)] flex items-center justify-center text-[9px] font-semibold font-mono-co uppercase">
                {gig.seller.name.charAt(0)}
              </div>
              <span className="text-[10px] text-[var(--grey-light)] font-mono-co font-medium tracking-[0.5px] uppercase">{gig.seller.name}</span>
            </div>

            {/* Title with strict multi-line truncation to 2 lines */}
            <h3 className="font-display text-[15px] font-semibold text-[var(--charcoal)] leading-snug mb-4 line-clamp-2 h-[42px] group-hover:text-emerald-500 transition-colors">
              {gig.title}
            </h3>
          </div>

          {/* Pricing & Ratings bar */}
          <div className="flex items-center justify-between pt-4 border-t border-[var(--line)] mt-2">
            <div className="flex flex-col">
              <span className="text-[8px] uppercase tracking-[1.5px] text-[var(--grey-light)] font-mono-co mb-0.5">Escrow starting at</span>
              <span className="font-mono-co text-[17px] font-semibold text-[var(--charcoal)]">₹{gig.basicPrice.toLocaleString()}</span>
            </div>
            <div className="flex flex-col items-end">
              <StarRating rating={gig.rating} size={9} />
              <span className="text-[9px] text-[var(--grey-light)] font-mono-co mt-1">{gig.deliveryDays}d compile time</span>
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  )
}
