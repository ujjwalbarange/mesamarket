import Link from 'next/link'
import { Compass } from 'lucide-react'

const cols = {
  'For Buyers': [
    { label: 'Browse All Gigs',   href: '/browse' },
    { label: 'Web Development',   href: '/browse?category=Web%20Development' },
    { label: 'AI & Automation',   href: '/browse?category=AI%20%26%20Automation' },
    { label: 'Data Science',      href: '/browse?category=Data%20Science' },
    { label: 'CS Academic',       href: '/browse?category=CS%20Academic' },
  ],
  'For Sellers': [
    { label: 'Become a Seller',   href: '/auth/register' },
    { label: 'Seller Dashboard',  href: '/dashboard/seller' },
    { label: 'Create a Gig',      href: '/dashboard/seller/create-gig' },
  ],
  'Platform': [
    { label: 'How It Works',      href: '/#how-it-works' },
    { label: 'Escrow Protection', href: '/#trust' },
    { label: 'Sign In',           href: '/auth/login' },
    { label: 'Register',          href: '/auth/register' },
  ],
}

export default function Footer() {
  return (
    <footer className="bg-[var(--bg)] border-t border-[var(--line)] mt-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-16 pt-20 pb-10">

        {/* Top — brand + columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="inline-flex items-center gap-2.5 mb-5 group">
              <div className="w-9 h-9 rounded-xl bg-[var(--ink)] flex items-center justify-center shadow-[0_4px_12px_rgba(15,23,42,0.20)] group-hover:scale-105 transition-transform">
                <Compass size={16} className="text-white" />
              </div>
              <span className="font-display-medium text-[14px] tracking-[3px] uppercase text-[var(--ink)]">C-Oasis</span>
            </Link>
            <p className="text-[13px] text-[var(--muted)] leading-relaxed max-w-[200px]">
              The boutique marketplace where vetted CS engineers build for forward-thinking brands.
            </p>
            <div className="flex gap-4 mt-6">
              {['GitHub', 'X', 'LinkedIn'].map(s => (
                <a key={s} href="#"
                  className="text-[11px] font-medium text-[var(--muted-light)] hover:text-[var(--ink)] transition-colors uppercase tracking-[1px]">
                  {s}
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(cols).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-[11px] uppercase tracking-[2.5px] font-semibold text-[var(--ink)] mb-5">{title}</h4>
              <ul className="space-y-3">
                {links.map(link => (
                  <li key={link.href}>
                    <Link href={link.href}
                      className="text-[13px] text-[var(--muted)] hover:text-[var(--ink)] transition-colors leading-none">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-[var(--line)]">
          <p className="text-[12px] text-[var(--muted-light)]">
            © {new Date().getFullYear()} Craftsmanship Oasis. Escrow-verified.
          </p>
          <div className="flex items-center gap-6">
            {['Privacy', 'Terms', 'Support'].map(l => (
              <a key={l} href="#"
                className="text-[12px] text-[var(--muted-light)] hover:text-[var(--ink)] transition-colors">
                {l}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
