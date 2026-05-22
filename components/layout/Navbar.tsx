'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { Search, Menu, X, Code2, LogOut, Settings, Sun, Moon, Monitor } from 'lucide-react'
import Button from '@/components/ui/Button'
import { useSimpleAuth } from '@/lib/useSimpleAuth'
import { useTheme } from '@/lib/useTheme'

export default function Navbar() {
  const { user, loading } = useSimpleAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const [isSellerToggle, setIsSellerToggle] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => { setMounted(true) }, [])

  /* Shrink nav on scroll */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  /* Close menu on escape */
  useEffect(() => {
    if (!menuOpen) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setMenuOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [menuOpen])

  /* Lock body scroll while menu is open */
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const userRole = user?.role

  const cycleTheme = () => {
    if (theme === 'system') setTheme('light')
    else if (theme === 'light') setTheme('dark')
    else setTheme('system')
  }

  const themeTitle = !mounted ? 'System' : theme === 'system' ? 'System' : theme === 'light' ? 'Light' : 'Dark'

  return (
    <>
      {/* ── Blur / darken backdrop — appears behind the open mobile menu ── */}
      <div
        className={`menu-backdrop ${menuOpen ? 'open' : ''}`}
        onClick={() => setMenuOpen(false)}
        aria-hidden="true"
      />

      <div className="fixed top-0 left-0 right-0 z-[500]">
        {/* ── Main nav ─────────────────────────────────────────────── */}
        <nav
          className={`nav-glass w-full transition-all duration-500 ${
            scrolled ? 'h-12 shadow-[0_4px_32px_rgba(0,0,0,0.18)]' : 'h-14'
          }`}
        >
          <div className="max-w-7xl mx-auto px-5 h-full flex items-center gap-4">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
              <div className={`rounded-lg border border-[var(--glass-border)] bg-[var(--glass-bg)] flex items-center justify-center transition-all duration-300 group-hover:border-[var(--line-hover)] depth-sm ${scrolled ? 'h-7 w-7' : 'h-8 w-8'}`}>
                <Code2 size={scrolled ? 13 : 15} className="text-[var(--grey)] group-hover:text-[var(--charcoal)] transition-colors" />
              </div>
              <span className="font-mono-co text-[12px] tracking-[4px] uppercase text-[var(--charcoal)] font-medium hidden sm:block">
                C-Oasis
              </span>
            </Link>

            {/* Search */}
            <form
              onSubmit={(e) => {
                e.preventDefault()
                const query = (e.currentTarget.elements.namedItem('search') as HTMLInputElement).value
                window.location.href = `/browse?search=${encodeURIComponent(query)}`
              }}
              className="flex-1 max-w-sm relative hidden md:block"
            >
              <Search size={11} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--grey-light)] pointer-events-none" />
              <input
                type="text"
                name="search"
                placeholder="Search developers, skills..."
                className="w-full pl-8 pr-4 py-1.5 bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-lg text-[11px] font-mono-co text-[var(--charcoal)] placeholder:text-[var(--grey-light)] outline-none focus:border-[var(--input-border-focus)] transition-all backdrop-blur-sm tracking-wider depth-sm"
              />
            </form>

            {/* Actions */}
            <div className="flex items-center gap-2.5 ml-auto">
              {!loading && !user && (
                <button
                  onClick={() => {
                    setIsSellerToggle(!isSellerToggle)
                    setTimeout(() => { window.location.href = '/auth/register' }, 300)
                  }}
                  className="hidden md:flex items-center gap-2 text-[9px] tracking-[1.5px] uppercase font-mono-co text-[var(--grey)] hover:text-[var(--charcoal)] transition-colors"
                >
                  <div className={`w-7 h-3.5 rounded-full transition-colors relative border ${isSellerToggle ? 'bg-emerald-500 border-transparent' : 'border-[var(--glass-border)] bg-[var(--capsule-bg)]'}`}>
                    <div className={`absolute top-px w-2.5 h-2.5 rounded-full bg-white transition-all shadow-sm ${isSellerToggle ? 'left-3.5' : 'left-px'}`} />
                  </div>
                  Become a Seller
                </button>
              )}

              {/* Theme Toggle */}
              <button
                onClick={cycleTheme}
                className="w-8 h-8 border border-[var(--glass-border)] bg-[var(--glass-bg)] text-[var(--grey)] rounded-lg flex items-center justify-center hover:border-[var(--line-hover)] hover:text-[var(--charcoal)] transition-all cursor-pointer select-none backdrop-blur-sm depth-sm"
                title={`Mode: ${themeTitle}`}
                type="button"
              >
                {!mounted ? <Monitor size={13} /> : theme === 'system' ? <Monitor size={13} /> : theme === 'light' ? <Sun size={13} /> : <Moon size={13} />}
              </button>

              {userRole === 'ADMIN' && <Link href="/admin"><Button variant="outline" size="sm">Admin</Button></Link>}
              {userRole === 'SELLER' && <Link href="/dashboard/seller"><Button variant="outline" size="sm">Dashboard</Button></Link>}
              {userRole === 'BUYER' && <Link href="/dashboard/buyer"><Button variant="outline" size="sm">Procurements</Button></Link>}

              {user && (
                <Link href="/settings" aria-label="Settings">
                  <div className="w-8 h-8 border border-[var(--glass-border)] bg-[var(--glass-bg)] text-[var(--grey)] rounded-lg flex items-center justify-center hover:border-[var(--line-hover)] hover:text-[var(--charcoal)] transition-all cursor-pointer backdrop-blur-sm depth-sm">
                    <Settings size={13} />
                  </div>
                </Link>
              )}

              {!loading && !user && (
                <>
                  <Link href="/auth/login">
                    <button className="text-[9px] tracking-[2px] uppercase font-mono-co text-[var(--grey)] hover:text-[var(--charcoal)] transition-colors border border-[var(--glass-border)] bg-[var(--glass-bg)] px-3 py-1.5 rounded-md backdrop-blur-sm depth-sm">
                      Sign In
                    </button>
                  </Link>
                  <Link href="/auth/register">
                    <button className="text-[9px] tracking-[2px] uppercase font-mono-co text-white bg-emerald-500 hover:bg-emerald-400 px-3 py-1.5 rounded-md font-medium transition-all shadow-[0_2px_12px_rgba(16,185,129,0.30)]">
                      Join Free
                    </button>
                  </Link>
                </>
              )}

              {user && (
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg border border-[var(--glass-border)] bg-[var(--glass-bg)] flex items-center justify-center text-[var(--charcoal)] text-[11px] font-mono-co font-semibold uppercase backdrop-blur-sm depth-sm">
                    {user.name.charAt(0)}
                  </div>
                  <button
                    onClick={async () => {
                      await fetch('/api/auth/logout', { method: 'POST' })
                      window.location.href = '/'
                    }}
                    className="text-[9px] uppercase tracking-[1.5px] font-mono-co text-[var(--grey-light)] hover:text-[var(--charcoal)] transition-colors flex items-center gap-1"
                  >
                    <LogOut size={10} />
                    Exit
                  </button>
                </div>
              )}

              {/* Hamburger */}
              <button
                className="md:hidden w-8 h-8 border border-[var(--glass-border)] bg-[var(--glass-bg)] text-[var(--grey)] hover:text-[var(--charcoal)] rounded-lg flex items-center justify-center transition-all backdrop-blur-sm depth-sm"
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              >
                {menuOpen ? <X size={15} /> : <Menu size={15} />}
              </button>
            </div>
          </div>
        </nav>

        {/* ── Mobile slide-down menu — rendered ABOVE backdrop (z-[500]) ── */}
        {menuOpen && (
          <div
            ref={menuRef}
            className="md:hidden border-t border-[var(--glass-border)] animate-menu-drop depth-panel"
            style={{
              background: 'var(--glass-bg-heavy)',
              backdropFilter: 'blur(32px) saturate(180%)',
              WebkitBackdropFilter: 'blur(32px) saturate(180%)',
            }}
          >
            <div className="px-5 py-5 flex flex-col gap-4">

              {/* Theme selector */}
              <div className="flex items-center justify-between py-2.5 border-b border-[var(--glass-border)]">
                <span className="text-[9px] uppercase font-mono-co text-[var(--grey)] tracking-[2px]">Display Mode</span>
                <div className="flex gap-1.5">
                  {(['system', 'light', 'dark'] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setTheme(t)}
                      className={`px-2.5 py-1 border rounded-md text-[9px] uppercase font-mono-co tracking-wider cursor-pointer transition-all ${
                        mounted && theme === t
                          ? 'bg-emerald-500 text-slate-950 border-transparent font-semibold shadow-[0_2px_8px_rgba(16,185,129,0.25)]'
                          : 'bg-[var(--glass-bg)] border-[var(--glass-border)] text-[var(--grey)]'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mobile search */}
              <form onSubmit={(e) => {
                e.preventDefault()
                const query = (e.currentTarget.elements.namedItem('search-mobile') as HTMLInputElement).value
                window.location.href = `/browse?search=${encodeURIComponent(query)}`
              }}>
                <div className="relative">
                  <Search size={11} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--grey-light)] pointer-events-none" />
                  <input
                    type="text"
                    name="search-mobile"
                    placeholder="Search developers, skills..."
                    className="w-full pl-8 pr-4 py-2 bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-lg text-[11px] font-mono-co text-[var(--charcoal)] placeholder:text-[var(--grey-light)] outline-none focus:border-[var(--input-border-focus)] transition-all"
                  />
                </div>
              </form>

              {/* Nav links */}
              <div className="flex flex-col gap-1 pt-1">
                {[
                  { href: '/browse', label: 'Browse Gigs' },
                  ...(!user ? [
                    { href: '/auth/login',    label: 'Sign In' },
                    { href: '/auth/register', label: 'Join Free' },
                  ] : [
                    { href: user.role === 'SELLER' ? '/dashboard/seller' : '/dashboard/buyer', label: 'Dashboard' },
                    { href: '/settings', label: 'Settings' },
                  ])
                ].map((item, i) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center justify-between px-3 py-2.5 rounded-lg text-[11px] font-mono-co text-[var(--grey)] hover:text-[var(--charcoal)] hover:bg-[var(--glass-bg)] tracking-wider transition-all border border-transparent hover:border-[var(--glass-border)]"
                  >
                    {item.label}
                    <span className="text-[var(--grey-light)] text-[9px]">›</span>
                  </Link>
                ))}
              </div>

              {/* Bottom sign-in CTA */}
              {!user && (
                <div className="flex gap-3 pt-2 border-t border-[var(--glass-border)]">
                  <Link href="/auth/login" className="flex-1" onClick={() => setMenuOpen(false)}>
                    <button className="w-full py-2.5 border border-[var(--glass-border)] bg-[var(--glass-bg)] text-[var(--charcoal)] text-[10px] tracking-[2px] uppercase font-mono-co rounded-lg transition-all">
                      Sign In
                    </button>
                  </Link>
                  <Link href="/auth/register" className="flex-1" onClick={() => setMenuOpen(false)}>
                    <button className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-[10px] tracking-[2px] uppercase font-mono-co font-semibold rounded-lg transition-all shadow-[0_2px_12px_rgba(16,185,129,0.25)]">
                      Join Free
                    </button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  )
}
