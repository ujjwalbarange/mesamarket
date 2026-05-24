'use client'
import { useState } from 'react'
import { ChevronDown, ChevronUp, SlidersHorizontal, X } from 'lucide-react'

interface Filters {
  category: string
  techStack: string[]
  budgetMin: number
  budgetMax: number
  deliveryDays: number
}

interface FilterSidebarProps {
  filters: Filters
  onChange: (filters: Filters) => void
}

const CATEGORIES = ['All', 'AI Automation', 'Web Development', 'CS Academic', 'Data Science', 'Mobile App']
const TECH_STACKS = ['Python', 'Django', 'React', 'Next.js', 'FastAPI', 'LangChain', 'PyTorch', 'Node.js', 'Java', 'Flutter']
const DELIVERY_OPTIONS = [
  { label: 'Any',        value: 0  },
  { label: 'Up to 3d',   value: 3  },
  { label: 'Up to 7d',   value: 7  },
  { label: 'Up to 14d',  value: 14 },
]

export default function FilterSidebar({ filters, onChange }: FilterSidebarProps) {
  const [openSections, setOpenSections] = useState({ category: true, tech: true, budget: false, delivery: true })
  const toggle = (key: keyof typeof openSections) => setOpenSections(s => ({ ...s, [key]: !s[key] }))
  const toggleTech = (tech: string) => {
    const next = filters.techStack.includes(tech)
      ? filters.techStack.filter(t => t !== tech)
      : [...filters.techStack, tech]
    onChange({ ...filters, techStack: next })
  }
  const reset = () => onChange({ category: 'All', techStack: [], budgetMin: 0, budgetMax: 100000, deliveryDays: 0 })
  const hasActive = filters.category !== 'All' || filters.techStack.length > 0 || filters.budgetMin > 0 || filters.budgetMax < 100000 || filters.deliveryDays > 0

  return (
    <div className="w-56 shrink-0">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={13} className="text-[var(--royal-blue)]" />
          <span className="text-[11px] uppercase tracking-[2px] font-semibold text-[var(--ink)]">Filters</span>
        </div>
        {hasActive && (
          <button onClick={reset} className="flex items-center gap-1 text-[11px] text-[var(--muted)] hover:text-[var(--ink)] transition-colors rounded-full px-2.5 py-1 border border-[var(--line)] hover:border-[var(--line-strong)]">
            <X size={10} /> Clear
          </button>
        )}
      </div>

      {/* Active filter chips */}
      {filters.techStack.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {filters.techStack.map(t => (
            <button key={t} onClick={() => toggleTech(t)}
              className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-medium bg-[var(--royal-blue-dim)] text-[var(--royal-blue)] border border-[rgba(37,99,235,0.20)] hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all">
              {t} <X size={9} />
            </button>
          ))}
        </div>
      )}

      {/* Category */}
      <div className="border-t border-[var(--line)] py-4">
        <button onClick={() => toggle('category')} className="flex items-center justify-between w-full mb-3 group">
          <span className="text-[10px] uppercase tracking-[2px] text-[var(--muted)] font-semibold group-hover:text-[var(--ink)] transition-colors">Category</span>
          {openSections.category ? <ChevronUp size={12} className="text-[var(--muted-light)]"/> : <ChevronDown size={12} className="text-[var(--muted-light)]"/>}
        </button>
        {openSections.category && (
          <div className="flex flex-col gap-0.5">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => onChange({ ...filters, category: cat })}
                className={`text-left text-[13px] py-2 px-3 rounded-xl transition-all ${
                  filters.category === cat
                    ? 'text-[var(--royal-blue)] bg-[var(--royal-blue-dim)] font-medium'
                    : 'text-[var(--muted)] hover:text-[var(--ink)] hover:bg-[var(--line)]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Tech Stack */}
      <div className="border-t border-[var(--line)] py-4">
        <button onClick={() => toggle('tech')} className="flex items-center justify-between w-full mb-3 group">
          <span className="text-[10px] uppercase tracking-[2px] text-[var(--muted)] font-semibold group-hover:text-[var(--ink)] transition-colors">Tech Stack</span>
          {openSections.tech ? <ChevronUp size={12} className="text-[var(--muted-light)]"/> : <ChevronDown size={12} className="text-[var(--muted-light)]"/>}
        </button>
        {openSections.tech && (
          <div className="flex flex-wrap gap-1.5">
            {TECH_STACKS.map(tech => (
              <button
                key={tech}
                onClick={() => toggleTech(tech)}
                className={`px-2.5 py-1 rounded-full text-[11px] font-medium border transition-all ${
                  filters.techStack.includes(tech)
                    ? 'bg-[var(--royal-blue-dim)] text-[var(--royal-blue)] border-[rgba(37,99,235,0.20)]'
                    : 'bg-transparent text-[var(--muted)] border-[var(--line)] hover:border-[var(--line-strong)] hover:text-[var(--ink)]'
                }`}
              >
                {tech}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Budget */}
      <div className="border-t border-[var(--line)] py-4">
        <button onClick={() => toggle('budget')} className="flex items-center justify-between w-full mb-3 group">
          <span className="text-[10px] uppercase tracking-[2px] text-[var(--muted)] font-semibold group-hover:text-[var(--ink)] transition-colors">Budget (₹)</span>
          {openSections.budget ? <ChevronUp size={12} className="text-[var(--muted-light)]"/> : <ChevronDown size={12} className="text-[var(--muted-light)]"/>}
        </button>
        {openSections.budget && (
          <div className="flex gap-2 items-center">
            <input type="number" placeholder="Min"
              value={filters.budgetMin || ''}
              onChange={e => onChange({ ...filters, budgetMin: Number(e.target.value) })}
              className="input-underline text-[12px] w-full rounded-xl py-2.5"
            />
            <span className="text-[var(--muted-light)] text-xs shrink-0">–</span>
            <input type="number" placeholder="Max"
              value={filters.budgetMax === 100000 ? '' : filters.budgetMax}
              onChange={e => onChange({ ...filters, budgetMax: Number(e.target.value) || 100000 })}
              className="input-underline text-[12px] w-full rounded-xl py-2.5"
            />
          </div>
        )}
      </div>

      {/* Delivery */}
      <div className="border-t border-[var(--line)] py-4">
        <button onClick={() => toggle('delivery')} className="flex items-center justify-between w-full mb-3 group">
          <span className="text-[10px] uppercase tracking-[2px] text-[var(--muted)] font-semibold group-hover:text-[var(--ink)] transition-colors">Delivery</span>
          {openSections.delivery ? <ChevronUp size={12} className="text-[var(--muted-light)]"/> : <ChevronDown size={12} className="text-[var(--muted-light)]"/>}
        </button>
        {openSections.delivery && (
          <div className="flex flex-col gap-0.5">
            {DELIVERY_OPTIONS.map(opt => (
              <button key={opt.value} onClick={() => onChange({ ...filters, deliveryDays: opt.value })}
                className={`text-left text-[13px] py-2 px-3 rounded-xl transition-all ${
                  filters.deliveryDays === opt.value
                    ? 'text-[var(--royal-blue)] bg-[var(--royal-blue-dim)] font-medium'
                    : 'text-[var(--muted)] hover:text-[var(--ink)] hover:bg-[var(--line)]'
                }`}>
                {opt.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
