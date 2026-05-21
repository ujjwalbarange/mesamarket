import Link from 'next/link'
import { Code2 } from 'lucide-react'

const links = {
  'Web Development': { cat: 'Web Dev', items: ['Next.js Sites', 'API Development', 'React Apps', 'Backend Forge'] },
  'AI & Automation': { cat: 'AI & ML', items: ['RAG Chatbots', 'LLM Agents', 'Scrapers & Bots', 'Fine-tuning'] },
  'Data Science':    { cat: 'Data Science', items: ['Data Analysis', 'Visualizations', 'Stock Prediction', 'Cleaning'] },
  'CS & Scripts':    { cat: 'CS Projects', items: ['DSA Solutions', 'Compiler Design', 'OS Simulations', 'Python Scripts'] },
}

export default function Footer() {
  return (
    <footer className="border-t border-[var(--line)] bg-[var(--paper)] relative mt-24">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-9 w-9 rounded-xl border border-[var(--line)] bg-[var(--paper-dark)]/60 flex items-center justify-center">
                <Code2 size={16} className="text-slate-350" />
              </div>
              <span className="font-mono-co text-[14px] tracking-[2.5px] uppercase font-semibold text-[var(--charcoal)]">C-OASIS</span>
            </div>
            <p className="text-[12px] text-[var(--grey)] leading-relaxed max-w-[200px] font-sans">
              The boutique tech forge where checked CS engineers build for premium brands.
            </p>
            <div className="flex gap-4 mt-6">
              {['GitHub', 'X', 'IG'].map(s => (
                <a key={s} href="#" className="text-[9px] tracking-[1.5px] font-mono-co text-[var(--grey-light)] hover:text-[var(--charcoal)] uppercase transition-colors">{s}</a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(links).map(([title, data]) => (
            <div key={title}>
              <h4 className="text-[10px] tracking-[2.5px] uppercase font-mono-co text-[var(--grey-light)] mb-4 font-semibold">{title}</h4>
              <ul className="flex flex-col gap-2.5">
                {data.items.map(item => (
                  <li key={item}>
                    <Link 
                      href={`/browse?category=${encodeURIComponent(data.cat)}&search=${encodeURIComponent(item)}`} 
                      className="text-[12px] text-[var(--grey)] hover:text-[var(--charcoal)] font-sans transition-colors"
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-[var(--line)] mt-12 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-[11px] font-mono-co text-[var(--grey-light)] tracking-wide">© 2026 CRAFTSMANSHIP OASIS. ESCROW VERIFIED.</p>
          <div className="flex gap-5">
            {['Privacy', 'Terms', 'Support'].map(l => (
              <a key={l} href="#" className="text-[10px] text-[var(--grey-light)] hover:text-[var(--charcoal)] font-mono-co uppercase tracking-[1.5px] transition-colors">{l}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
