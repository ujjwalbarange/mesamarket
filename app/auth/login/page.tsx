'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Eye, EyeOff, Compass, ArrowRight } from 'lucide-react'
import Toast from '@/components/ui/Toast'
import { motion } from 'framer-motion'

export default function LoginPage() {
  const [form, setForm]       = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [showPw, setShowPw]   = useState(false)
  const [toast, setToast]     = useState<{ msg: string; type: 'success' | 'error' } | null>(null)

  const set = (k: keyof typeof form, v: string) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res  = await fetch('/api/auth/login', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email.trim().toLowerCase(), password: form.password }),
      })
      const data = await res.json()
      if (!res.ok) { setToast({ msg: data.error ?? 'Invalid credentials', type: 'error' }); setLoading(false); return }
      const role = data.data?.user?.role
      window.location.href = role === 'ADMIN' ? '/admin' : role === 'SELLER' ? '/dashboard/seller' : '/dashboard/buyer'
    } catch {
      setToast({ msg: 'Network failure. Please retry.', type: 'error' })
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen aurora-page overflow-hidden flex">
      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

      {/* ── Left panel — cinematic editorial ── */}
      <div className="hidden lg:flex flex-col flex-1 relative overflow-hidden bg-[var(--ink)] p-14">
        {/* Aurora on dark */}
        <div className="absolute inset-0">
          <div className="aurora-orb-blue w-[500px] h-[500px] top-[-20%] right-[-20%] opacity-40" style={{ position: 'absolute' }} />
          <div className="aurora-orb-cyan w-[400px] h-[400px] bottom-[-20%] left-[-10%] opacity-30" style={{ position: 'absolute' }} />
        </div>

        {/* Logo */}
        <Link href="/" className="relative z-10 flex items-center gap-2.5 w-fit">
          <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center">
            <Compass size={16} className="text-[var(--bg)]" />
          </div>
          <span className="font-display-medium text-[13px] tracking-[3px] uppercase text-[var(--bg)]">C-Oasis</span>
        </Link>

        {/* Main editorial copy */}
        <div className="relative z-10 mt-auto max-w-md">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <h1 className="font-display text-[64px] leading-[0.95] text-[var(--bg)] mb-6">
              Welcome<br />back.
            </h1>
            <p className="text-[16px] text-[var(--bg)] opacity-60 leading-relaxed font-light mb-10">
              Your projects, orders, and vetted developer network — all in one place.
            </p>
          </motion.div>
          {/* Floating testimonial */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="p-5 rounded-2xl bg-white/8 border border-white/12 backdrop-blur-sm"
          >
            <p className="text-[14px] text-[var(--bg)] opacity-80 font-light leading-relaxed mb-3">
              "Shipped our MVP in 3 weeks. The escrow system gave us total confidence."
            </p>
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-blue-400 flex items-center justify-center text-[11px] font-semibold text-white">A</div>
              <div>
                <div className="text-[12px] font-medium text-[var(--bg)]">Arjun M.</div>
                <div className="text-[10px] text-[var(--bg)] opacity-50">Startup Founder</div>
              </div>
              <div className="ml-auto text-amber-400 text-[12px]">★★★★★</div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── Right panel — form ── */}
      <div className="flex flex-col items-center justify-center flex-1 lg:max-w-[480px] px-6 py-12">
        {/* Mobile logo */}
        <Link href="/" className="lg:hidden flex items-center gap-2.5 mb-10">
          <div className="w-8 h-8 rounded-xl bg-[var(--ink)] flex items-center justify-center">
            <Compass size={15} className="text-[var(--bg)]" />
          </div>
          <span className="font-display-medium text-[13px] tracking-[3px] uppercase text-[var(--ink)]">C-Oasis</span>
        </Link>

        <div className="w-full max-w-[380px]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="mb-8">
              <h2 className="font-display text-[36px] text-[var(--ink)] leading-tight mb-2">Sign in</h2>
              <p className="text-[14px] text-[var(--muted)] font-light">Access your workspace.</p>
            </div>

            {/* Google SSO */}
            <a href="/api/auth/google"
              className="w-full flex items-center justify-center gap-3 py-3.5 px-4 rounded-full border border-[var(--line-strong)] bg-[var(--surface)] hover:bg-[var(--bg-secondary)] text-[13px] font-medium text-[var(--ink)] transition-all hover:-translate-y-px shadow-[var(--shadow-xs)] mb-6"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 18 18" fill="none">
                <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
                <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.26c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
                <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
                <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </a>

            <div className="flex items-center gap-4 mb-6">
              <div className="flex-1 h-px bg-[var(--line)]" />
              <span className="text-[11px] text-[var(--muted-light)] font-medium">or</span>
              <div className="flex-1 h-px bg-[var(--line)]" />
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
              <div>
                <label className="block text-[11px] uppercase tracking-[2px] text-[var(--muted)] font-semibold mb-2">Email</label>
                <input type="email" className="input-field" placeholder="you@university.edu"
                  value={form.email} onChange={e => set('email', e.target.value)} required />
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-[11px] uppercase tracking-[2px] text-[var(--muted)] font-semibold">Password</label>
                  <Link href="/forgot-password" className="text-[12px] text-[var(--muted)] hover:text-[var(--royal-blue)] transition-colors">Forgot?</Link>
                </div>
                <div className="relative">
                  <input type={showPw ? 'text' : 'password'} className="input-field pr-12" placeholder="••••••••"
                    value={form.password} onChange={e => set('password', e.target.value)} required />
                  <button type="button" onClick={() => setShowPw(!showPw)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--muted-light)] hover:text-[var(--ink)] transition-colors">
                    {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              <button type="submit" disabled={loading}
                className="w-full py-4 rounded-full bg-[var(--ink)] text-[var(--bg)] text-[13px] font-semibold flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(15,23,42,0.25)] hover:bg-[var(--ink-soft)] hover:-translate-y-px transition-all disabled:opacity-50 mt-2">
                {loading ? 'Signing in...' : <><span>Sign In</span><ArrowRight size={14} /></>}
              </button>
            </form>

            <p className="text-center text-[13px] text-[var(--muted)] mt-6 font-light">
              New here?{' '}
              <Link href="/auth/register" className="text-[var(--ink)] font-semibold hover:text-[var(--royal-blue)] transition-colors">
                Create account →
              </Link>
            </p>

            <div className="flex items-center justify-center gap-4 mt-8">
              <Link href="#" className="text-[11px] text-[var(--muted-light)] hover:text-[var(--muted)] transition-colors">Privacy</Link>
              <span className="text-[var(--line-strong)]">·</span>
              <Link href="#" className="text-[11px] text-[var(--muted-light)] hover:text-[var(--muted)] transition-colors">Terms</Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
