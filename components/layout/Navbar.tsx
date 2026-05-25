'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { Search, Menu, X, LogOut, Settings, Sun, Moon, Monitor, Compass } from 'lucide-react'
import Button from '@/components/ui/Button'
import { useSimpleAuth } from '@/lib/useSimpleAuth'
import { useTheme } from '@/lib/useTheme'

export default function Navbar() {
  const { user, loading } = useSimpleAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled]  = useState(false)
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!menuOpen) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setMenuOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [menuOpen])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const cycleTheme = () => {
    if (theme === 'system') setTheme('light')
    else if (theme === 'light') setTheme('dark')
    else setTheme('system')
  }

  const ThemeIcon = !mounted ? Monitor : theme === 'light' ? Sun : theme === 'dark' ? Moon : Monitor

  const navLinks = [
    { href: '/browse', label: 'Marketplace' },
    { href: '/browse?category=AI%20%26%20Automation', label: 'AI & ML' },
    { href: '/browse?category=Web%20Development', label: 'Web Dev' },
  ]

  return (
    <>
      {/* Mobile backdrop */}
      <div
        className={`menu-backdrop ${menuOpen ? 'open' : ''}`}
        onClick={() => setMenuOpen(false)}
        aria-hidden="true"
      />

      <div className="fixed top-0 left-0 right-0 z-[500]">
        <nav className={[
          'w-full transition-all duration-500',
          scrolled
            ? 'nav-glass shadow-[0_2px_20px_rgba(15,23,42,0.08)] h-[56px]'
            : 'bg-transparent h-[68px]',
        ].join(' ')}>
          <div className="max-w-7xl mx-auto px-6 h-full flex items-center gap-6">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 shrink-0 group mr-2">
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-300
                ${scrolled ? 'bg-[var(--ink)] shadow-[0_4px_12px_rgba(15,23,42,0.20)]' : 'bg-[var(--ink)] shadow-[0_4px_20px_rgba(15,23,42,0.25)]'}
                group-hover:scale-105`}>
                <Compass size={15} className="text-[var(--bg)]" />
              </div>
              <span className="font-display-medium text-[14px] tracking-[3px] uppercase text-[var(--ink)] hidden sm:block">
                C-Oasis
              </span>
            </Link>

            {/* Desktop nav links */}
            <div className="hidden md:flex items-center gap-1 flex-1">
              {navLinks.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-4 py-2 rounded-full text-[13px] text-[var(--muted)] hover:text-[var(--ink)] hover:bg-[var(--line)] transition-all duration-200 font-medium"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Search — desktop */}
            <form
              onSubmit={(e) => {
                e.preventDefault()
                const q = (e.currentTarget.elements.namedItem('search') as HTMLInputElement).value
                window.location.href = `/browse?search=${encodeURIComponent(q)}`
              }}
              className="hidden lg:flex flex-1 max-w-xs relative"
            >
              <Search size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--muted-light)] pointer-events-none" />
              <input
                type="text" name="search"
                placeholder="Search developers, skills..."
                className="w-full pl-9 pr-4 py-2.5 rounded-full text-[12px] font-medium text-[var(--ink)] placeholder:text-[var(--muted-light)] outline-none transition-all border border-[var(--line-strong)] bg-[var(--glass)] backdrop-blur-md focus:border-[var(--royal-blue)] focus:ring-2 focus:ring-[var(--royal-blue-dim)]"
              />
            </form>

            {/* Right actions */}
            <div className="flex items-center gap-2 ml-auto">
              {/* Theme toggle */}
              <button
                onClick={cycleTheme}
                title={`Mode: ${mounted ? theme : 'system'}`}
                className="w-9 h-9 rounded-full flex items-center justify-center text-[var(--muted)] hover:text-[var(--ink)] hover:bg-[var(--line)] transition-all duration-200 border border-[var(--line-strong)]"
              >
                <ThemeIcon size={14} />
              </button>

              {/* Dashboard shortcuts */}
              {user?.role === 'ADMIN'  && <Link href="/admin"><Button size="sm" variant="outline">Admin</Button></Link>}
              {user?.role === 'SELLER' && <Link href="/dashboard/seller" className="hidden md:block"><Button size="sm" variant="outline">Dashboard</Button></Link>}
              {user?.role === 'BUYER'  && <Link href="/dashboard/buyer" className="hidden md:block"><Button size="sm" variant="outline">My Orders</Button></Link>}

              {/* Settings */}
              {user && (
                <Link href="/settings">
                  <button className="w-9 h-9 rounded-full flex items-center justify-center text-[var(--muted)] hover:text-[var(--ink)] hover:bg-[var(--line)] transition-all border border-[var(--line-strong)]">
                    <Settings size={14} />
                  </button>
                </Link>
              )}

              {/* Auth */}
              {!loading && !user && (
                <div className="hidden md:flex items-center gap-2">
                  <Link href="/auth/login">
                    <button className="px-4 py-2 rounded-full text-[12px] font-medium text-[var(--muted)] hover:text-[var(--ink)] hover:bg-[var(--line)] transition-all border border-[var(--line)] ">
                      Sign In
                    </button>
                  </Link>
                  <Link href="/auth/register">
                    <button className="px-4 py-2 rounded-full text-[12px] font-medium bg-[var(--ink)] text-[var(--bg)] shadow-[0_2px_12px_rgba(15,23,42,0.22)] hover:bg-[var(--ink-soft)] hover:shadow-[0_6px_20px_rgba(15,23,42,0.28)] transition-all hover:-translate-y-px">
                      Join Free
                    </button>
                  </Link>
                </div>
              )}

              {/* User avatar */}
              {user && (
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-full bg-[var(--ink)] text-[var(--bg)] flex items-center justify-center text-[13px] font-semibold shadow-[0_2px_8px_rgba(15,23,42,0.20)]">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <button
                    onClick={async () => { await fetch('/api/auth/logout', { method: 'POST' }); window.location.href = '/' }}
                    className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-medium text-[var(--muted)] hover:text-[var(--ink)] hover:bg-[var(--line)] transition-all border border-[var(--line)]"
                  >
                    <LogOut size={11} /> Exit
                  </button>
                </div>
              )}

              {/* Hamburger */}
              <button
                className="md:hidden w-9 h-9 rounded-full flex items-center justify-center text-[var(--muted)] hover:text-[var(--ink)] hover:bg-[var(--line)] border border-[var(--line-strong)] transition-all"
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              >
                {menuOpen ? <X size={16} /> : <Menu size={16} />}
              </button>
            </div>
          </div>
        </nav>

        {/* Mobile fullscreen overlay */}
        {menuOpen && (
          <div
            ref={menuRef}
            className="md:hidden fixed inset-0 top-0 z-[499] flex flex-col bg-[var(--glass-heavy)] backdrop-blur-3xl border-b border-[var(--glass-border)] animate-menu-drop"
            style={{ backdropFilter: 'blur(40px) saturate(200%)' }}
          >
            {/* Mobile header */}
            <div className="flex items-center justify-between px-6 h-[68px] border-b border-[var(--line)]">
              <Link href="/" onClick={() => setMenuOpen(false)} className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[var(--ink)] flex items-center justify-center">
                  <Compass size={15} className="text-[var(--bg)]" />
                </div>
                <span className="font-display-medium text-[14px] tracking-[3px] uppercase text-[var(--ink)]">C-Oasis</span>
              </Link>
              <button
                onClick={() => setMenuOpen(false)}
                className="w-9 h-9 rounded-full flex items-center justify-center text-[var(--muted)] hover:text-[var(--ink)] hover:bg-[var(--line)] border border-[var(--line-strong)] transition-all"
              >
                <X size={16} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-8 flex flex-col gap-6">
              {/* Search */}
              <form onSubmit={(e) => {
                e.preventDefault()
                const q = (e.currentTarget.elements.namedItem('m-search') as HTMLInputElement).value
                setMenuOpen(false); window.location.href = `/browse?search=${encodeURIComponent(q)}`
              }}>
                <div className="relative">
                  <Search size={13} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted-light)] pointer-events-none" />
                  <input type="text" name="m-search" placeholder="Search..."
                    className="w-full pl-10 pr-4 py-3 rounded-full text-[13px] border border-[var(--line-strong)] bg-[var(--input-bg)] text-[var(--ink)] placeholder:text-[var(--muted-light)] outline-none focus:border-[var(--royal-blue)]"
                  />
                </div>
              </form>

              {/* Nav links */}
              <nav className="flex flex-col gap-1">
                {[...navLinks,
                  ...(!user ? [{ href: '/auth/login', label: 'Sign In' }, { href: '/auth/register', label: 'Join Free' }] :
                    [{ href: user.role === 'SELLER' ? '/dashboard/seller' : '/dashboard/buyer', label: 'Dashboard' },
                     { href: '/settings', label: 'Settings' }])
                ].map(item => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center justify-between px-4 py-3.5 rounded-2xl text-[15px] font-medium text-[var(--ink-soft)] hover:text-[var(--ink)] hover:bg-[var(--line)] transition-all"
                  >
                    {item.label}
                    <span className="text-[var(--muted-light)] text-[18px] leading-none">›</span>
                  </Link>
                ))}
              </nav>

              {/* Theme */}
              <div className="mt-auto">
                <p className="text-[11px] uppercase tracking-[2px] text-[var(--muted-light)] mb-3 font-medium">Display</p>
                <div className="flex gap-2">
                  {(['system', 'light', 'dark'] as const).map(t => (
                    <button
                      key={t}
                      onClick={() => setTheme(t)}
                      className={`flex-1 py-2.5 rounded-full text-[11px] font-medium capitalize border transition-all ${
                        mounted && theme === t
                          ? 'bg-[var(--ink)] text-[var(--bg)] border-transparent shadow-[0_2px_8px_rgba(15,23,42,0.20)]'
                          : 'bg-transparent text-[var(--muted)] border-[var(--line-strong)] hover:border-[var(--ink)]'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mobile CTA */}
              {!user && (
                <div className="flex gap-3">
                  <Link href="/auth/login" className="flex-1" onClick={() => setMenuOpen(false)}>
                    <button className="w-full py-3 rounded-full text-[13px] font-medium border border-[var(--line-strong)] text-[var(--ink)] hover:bg-[var(--line)] transition-all">Sign In</button>
                  </Link>
                  <Link href="/auth/register" className="flex-1" onClick={() => setMenuOpen(false)}>
                    <button className="w-full py-3 rounded-full text-[13px] font-medium bg-[var(--ink)] text-[var(--bg)] shadow-[0_2px_12px_rgba(15,23,42,0.25)] hover:-translate-y-px transition-all">Join Free</button>
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
