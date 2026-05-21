'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Search, Menu, X, Code2, LogOut, Settings, Sun, Moon, Monitor } from 'lucide-react'
import Button from '@/components/ui/Button'
import { useSimpleAuth } from '@/lib/useSimpleAuth'
import { useTheme } from '@/lib/useTheme'

export default function Navbar() {
  const { user, loading } = useSimpleAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const [isSellerToggle, setIsSellerToggle] = useState(false)
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const userRole = user?.role

  const cycleTheme = () => {
    if (theme === 'system') setTheme('light')
    else if (theme === 'light') setTheme('dark')
    else setTheme('system')
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-[500]">
      {/* Sticky Main Navigation */}
      <nav className="w-full border-b border-[var(--line)] bg-[var(--paper)]/80 backdrop-blur-lg h-16">
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center gap-6">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 shrink-0 group">
            <div className="h-9 w-9 rounded-xl border border-[var(--line)] bg-[var(--paper-dark)]/60 flex items-center justify-center transition-all group-hover:border-[var(--line-hover)]">
              <Code2 size={18} className="text-[var(--grey)] group-hover:text-[var(--charcoal)] transition-colors" />
            </div>
            <span className="font-mono-co text-[14px] tracking-[3px] uppercase text-[var(--charcoal)] font-semibold hidden sm:block group-hover:text-[var(--charcoal)] transition-colors">
              C-Oasis <span className="text-slate-500">.</span>
            </span>
          </Link>

          {/* Global Search Bar */}
          <form 
            onSubmit={(e) => {
              e.preventDefault()
              const query = (e.currentTarget.elements.namedItem('search') as HTMLInputElement).value
              window.location.href = `/browse?search=${encodeURIComponent(query)}`
            }}
            className="flex-1 max-w-md relative hidden md:block"
          >
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--grey-light)]" />
            <input 
              type="text" 
              name="search"
              placeholder="Query software assets, live nodes..."
              className="w-full pl-9 pr-4 py-2 bg-[var(--input-bg)] border border-[var(--input-border)] rounded-lg text-[12px] font-mono-co text-[var(--charcoal)] placeholder:text-[var(--input-placeholder)] outline-none focus:border-emerald-500/30 transition-all" 
            />
          </form>

          {/* Action Links */}
          <div className="flex items-center gap-4 ml-auto">
            {!loading && !user && (
              <button 
                onClick={() => {
                  setIsSellerToggle(!isSellerToggle)
                  setTimeout(() => {
                    window.location.href = '/auth/register'
                  }, 300)
                }}
                className="hidden md:flex items-center gap-2 text-[10px] tracking-[1.5px] uppercase font-mono-co text-[var(--grey)] hover:text-[var(--charcoal)] transition-colors font-semibold"
              >
                <div className={`w-8 h-4 rounded-full transition-colors relative border border-[var(--line)] ${isSellerToggle ? 'bg-emerald-500 border-transparent' : 'bg-[var(--capsule-bg)]'}`}>
                  <div className={`absolute top-0.5 w-2.5 h-2.5 rounded-full bg-[var(--sso-bg)] transition-all ${isSellerToggle ? 'left-4' : 'left-0.5'}`} />
                </div>
                {isSellerToggle ? 'Seller Mode' : 'Become a Seller'}
              </button>
            )}

            {/* Theme Toggle Cycle Button */}
            <button
              onClick={cycleTheme}
              className="w-9 h-9 border border-[var(--line)] bg-[var(--paper-dark)]/60 text-[var(--grey)] rounded-lg flex items-center justify-center hover:border-[var(--line-hover)] hover:text-[var(--charcoal)] transition-all cursor-pointer select-none"
              title={`Theme: ${theme}`}
              type="button"
            >
              {!mounted ? (
                <Monitor size={15} />
              ) : theme === 'system' ? (
                <Monitor size={15} />
              ) : theme === 'light' ? (
                <Sun size={15} />
              ) : (
                <Moon size={15} />
              )}
            </button>

            {userRole === 'ADMIN' && (
              <Link href="/admin"><Button variant="outline" size="sm">Admin console</Button></Link>
            )}
            {userRole === 'SELLER' && (
              <Link href="/dashboard/seller"><Button variant="outline" size="sm">Dev Node</Button></Link>
            )}
            {userRole === 'BUYER' && (
              <Link href="/dashboard/buyer"><Button variant="outline" size="sm">Procurements</Button></Link>
            )}
            
            {user && (
              <Link href="/settings" aria-label="Settings">
                <div
                  className="w-9 h-9 border border-[var(--line)] bg-[var(--paper-dark)]/60 text-[var(--grey)] rounded-lg flex items-center justify-center hover:border-[var(--line-hover)] hover:text-[var(--charcoal)] transition-all cursor-pointer"
                  title="Settings"
                >
                  <Settings size={15} />
                </div>
              </Link>
            )}

            {!loading && !user && (
              <>
                <Link href="/auth/login"><Button variant="ghost" size="sm">Sign In</Button></Link>
                <Link href="/auth/register"><Button size="sm">Verify Free</Button></Link>
              </>
            )}

            {user && (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg border border-[var(--line)] bg-[var(--paper-dark)]/60 flex items-center justify-center text-[var(--charcoal)] text-[12px] font-mono-co font-semibold uppercase">
                  {user.name.charAt(0)}
                </div>
                <button
                  onClick={async () => {
                    await fetch('/api/auth/logout', { method: 'POST' })
                    window.location.href = '/'
                  }}
                  className="text-[9px] uppercase tracking-[1.5px] font-mono-co text-[var(--grey-light)] hover:text-[var(--charcoal)] transition-colors flex items-center gap-1 font-medium"
                >
                  <LogOut size={10} />
                  Exit
                </button>
              </div>
            )}

            <button className="md:hidden ml-1 text-slate-400 hover:text-slate-200 transition-colors" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-[var(--line)] bg-[var(--paper)]/95 backdrop-blur-lg px-6 py-6 flex flex-col gap-4 animate-rise shadow-2xl">
            {/* Mobile Theme selector inline row */}
            <div className="flex items-center justify-between py-2 border-b border-[var(--line)]">
              <span className="text-[10px] uppercase font-mono-co text-[var(--grey)] tracking-wider">Theme Node</span>
              <div className="flex gap-1.5">
                {(['system', 'light', 'dark'] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTheme(t)}
                    className={`px-2.5 py-1 border rounded-md text-[9px] uppercase font-mono-co font-medium tracking-[1px] cursor-pointer transition-all ${
                      mounted && theme === t
                        ? 'bg-emerald-500 text-slate-950 border-transparent shadow-[0_2px_10px_rgba(16,185,129,0.15)] font-semibold'
                        : 'bg-[var(--sso-bg)] border-[var(--line)] text-[var(--grey)] hover:bg-[var(--sso-hover-bg)]'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <form 
              onSubmit={(e) => {
                e.preventDefault()
                const query = (e.currentTarget.elements.namedItem('search-mobile') as HTMLInputElement).value
                window.location.href = `/browse?search=${encodeURIComponent(query)}`
              }}
            >
              <input 
                type="text" 
                name="search-mobile"
                placeholder="Search software contracts..." 
                className="input-underline text-xs w-full" 
              />
            </form>
            <Link href="/browse" className="text-xs font-mono-co text-[var(--grey)] hover:text-[var(--charcoal)] tracking-wider">Browse Contracts</Link>
            {!user && (
              <>
                <Link href="/auth/login" className="text-xs font-mono-co text-[var(--grey)] hover:text-[var(--charcoal)] tracking-wider">Sign In</Link>
                <Link href="/auth/register" className="text-xs font-mono-co text-[var(--charcoal)] tracking-wider font-semibold">Verify Account</Link>
              </>
            )}
            {user && <Link href={user.role === 'SELLER' ? '/dashboard/seller' : '/dashboard/buyer'} className="text-xs font-mono-co text-[var(--charcoal)]">Dashboard Control</Link>}
            {user && <Link href="/settings" className="text-xs font-mono-co text-[var(--grey)] hover:text-[var(--charcoal)] tracking-wider">Settings Node</Link>}
          </div>
        )}
      </nav>
    </div>
  )
}
