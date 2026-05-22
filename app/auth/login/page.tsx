'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Eye, EyeOff, Code2 } from 'lucide-react'
import Toast from '@/components/ui/Toast'

export default function LoginPage() {
  const [form, setForm]     = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [showPw, setShowPw]   = useState(false)
  const [toast, setToast]     = useState<{ msg: string; type: 'success'|'error' } | null>(null)

  const set = (k: keyof typeof form, v: string) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res  = await fetch('/api/auth/login', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          email:    form.email.trim().toLowerCase(),
          password: form.password,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setToast({ msg: data.error ?? 'Invalid credentials', type: 'error' })
        setLoading(false)
        return
      }
      const role = data.data?.user?.role
      const dest =
        role === 'ADMIN'  ? '/admin' :
        role === 'SELLER' ? '/dashboard/seller' :
                            '/dashboard/buyer'
      window.location.href = dest
    } catch {
      setToast({ msg: 'Network failure. Please retry.', type: 'error' })
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden font-sans">
      {/* ── Fixed cinematic horizon background ─────────────────── */}
      <div className="horizon-canvas" aria-hidden="true" />
      <div className="horizon-overlay" aria-hidden="true" />

      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

      {/* ── Minimal top logo ────────────────────────────────────── */}
      <div className="relative z-20 flex justify-center pt-8">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="h-9 w-9 rounded-xl border border-[var(--glass-border)] bg-[var(--glass-bg)] backdrop-blur-sm flex items-center justify-center transition-all group-hover:border-[var(--line-hover)]">
            <Code2 size={17} className="text-[var(--grey)] group-hover:text-[var(--charcoal)] transition-colors" />
          </div>
          <span className="font-mono-co text-[12px] tracking-[4px] uppercase text-[var(--charcoal)] font-medium">
            C-OASIS
          </span>
        </Link>
      </div>

      {/* ── Centered Auth Card ──────────────────────────────────── */}
      <div className="relative z-20 flex flex-col items-center justify-center min-h-[calc(100vh-80px)] px-6 py-8">
        <div className="w-full max-w-[400px]">

          {/* Card */}
          <div className="glass-panel-heavy p-8 md:p-10 rounded-2xl w-full">
            
            {/* Heading */}
            <div className="mb-8">
              <h1 className="font-display text-[32px] text-[var(--charcoal)] leading-tight tracking-wide mb-2">
                Welcome back
              </h1>
              <p className="text-[12px] text-[var(--grey)] font-light tracking-wide">
                Sign in to access your developer node
              </p>
            </div>

            {/* Google SSO */}
            <a
              href="/api/auth/google"
              className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-[var(--sso-bg)] border border-[var(--sso-border)] hover:bg-[var(--sso-hover-bg)] rounded-lg text-[11px] font-mono-co text-[var(--sso-text)] transition-all duration-300 mb-6 group tracking-wider backdrop-blur-sm"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 18 18" fill="none">
                <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
                <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.26c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
                <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
                <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
              </svg>
              <span>Continue with Google</span>
            </a>

            {/* Divider */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex-1 h-px bg-[var(--glass-border)]"/>
              <span className="text-[9px] uppercase tracking-[2px] text-[var(--grey)] font-mono-co">or</span>
              <div className="flex-1 h-px bg-[var(--glass-border)]"/>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
              <div>
                <label className="block text-[9px] uppercase tracking-[2.5px] text-[var(--grey)] mb-2 font-mono-co">
                  Email
                </label>
                <input
                  type="email"
                  className="input-underline"
                  placeholder="you@university.edu"
                  value={form.email}
                  onChange={e => set('email', e.target.value)}
                  required
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-[9px] uppercase tracking-[2.5px] text-[var(--grey)] font-mono-co">
                    Password
                  </label>
                  <Link href="/forgot-password" className="text-[9px] uppercase tracking-[1.5px] text-[var(--grey)] hover:text-[var(--charcoal)] font-mono-co transition-colors">
                    Forgot?
                  </Link>
                </div>
                <div className="relative">
                  <input
                    type={showPw ? 'text' : 'password'}
                    className="input-underline pr-10"
                    placeholder="••••••••••••"
                    value={form.password}
                    onChange={e => set('password', e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(!showPw)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--grey)] hover:text-[var(--charcoal)] transition-colors"
                  >
                    {showPw ? <EyeOff size={15}/> : <Eye size={15}/>}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 mt-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-[11px] tracking-[2px] uppercase font-mono-co font-semibold rounded-lg transition-all shadow-[0_4px_20px_rgba(16,185,129,0.25)] disabled:opacity-50"
              >
                {loading ? 'Connecting...' : 'Access Node'}
              </button>
            </form>

            <p className="text-center text-[11px] text-[var(--grey)] mt-6 font-light">
              New developer?{' '}
              <Link href="/auth/register" className="text-[var(--charcoal)] font-medium underline font-mono-co text-[10px] hover:text-emerald-400 transition-colors">
                Join free →
              </Link>
            </p>
          </div>

          {/* Legal */}
          <p className="text-center text-[9px] text-[var(--grey-light)] mt-5 font-mono-co tracking-wide">
            <Link href="#" className="underline hover:text-[var(--grey)] transition-colors">Privacy Policy</Link>
            {' '}·{' '}
            <Link href="#" className="underline hover:text-[var(--grey)] transition-colors">Terms of Service</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
