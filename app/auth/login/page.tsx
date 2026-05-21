'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Eye, EyeOff, Code2, ArrowLeft } from 'lucide-react'
import Button from '@/components/ui/Button'
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
        setToast({ msg: data.error ?? 'Invalid email or credentials', type: 'error' })
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
      setToast({ msg: 'Network link failure. Please retry.', type: 'error' })
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[var(--paper)] text-[var(--grey)] flex flex-col items-center justify-center px-6 py-12 relative overflow-hidden font-sans">
      {/* Decorative gradient blur */}
      <div className="absolute top-[20%] left-[20%] w-[350px] h-[350px] rounded-full bg-[var(--paper-dark)]/20 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[20%] w-[350px] h-[350px] rounded-full bg-[var(--paper)]/40 blur-[120px] pointer-events-none" />

      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

      <div className="w-full max-w-[440px] relative z-10">
        
        {/* Brand logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3 mb-4 group">
            <div className="h-10 w-10 relative overflow-hidden rounded-xl border border-[var(--line)] bg-[var(--paper-dark)]/60 flex items-center justify-center transition-all group-hover:border-[var(--line-hover)]">
              <Code2 size={20} className="text-[var(--grey)] group-hover:text-[var(--charcoal)] transition-colors" />
            </div>
            <span className="font-mono-co text-[14px] tracking-[4px] uppercase text-[var(--charcoal)] font-semibold">
              C-OASIS <span className="text-[var(--grey-light)]">.</span>
            </span>
          </Link>
          <h1 className="font-display text-3xl font-semibold text-[var(--charcoal)] tracking-tight">Welcome back</h1>
          <p className="text-[13px] text-[var(--grey)] mt-2">Sign in to access your developer node</p>
        </div>

        {/* Card */}
        <div className="cyber-border-container p-6 lg:p-10 glass-panel shadow-2xl relative">
          <form onSubmit={handleSubmit} className="flex flex-col gap-6 mt-2" noValidate>
            <div>
              <label className="block text-[10px] uppercase tracking-[2.5px] text-[var(--grey)] mb-2 font-mono-co font-medium">
                Email Address
              </label>
              <input type="email" className="input-underline" placeholder="you@university.edu"
                value={form.email} onChange={e => set('email', e.target.value)} required />
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-[10px] uppercase tracking-[2.5px] text-[var(--grey)] font-mono-co font-medium">
                  Password
                </label>
                <Link 
                  href="/forgot-password" 
                  className="text-[9px] uppercase tracking-[1.5px] text-[var(--grey)] hover:text-[var(--charcoal)] font-mono-co font-medium transition-colors"
                >
                  Forgot Key?
                </Link>
              </div>
              <div className="relative">
                <input type={showPw ? 'text' : 'password'} className="input-underline pr-10"
                  placeholder="••••••••••••"
                  value={form.password} onChange={e => set('password', e.target.value)} required />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--grey)] hover:text-[var(--charcoal)] transition-colors">
                  {showPw ? <EyeOff size={16}/> : <Eye size={16}/>}
                </button>
              </div>
            </div>

            <Button type="submit" size="lg" loading={loading} className="w-full mt-2">
              Access Node
            </Button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-[1px] bg-[var(--line)]"/>
            <span className="text-[9px] uppercase tracking-[2px] text-[var(--grey-light)] font-mono-co font-medium">Or</span>
            <div className="flex-1 h-[1px] bg-[var(--line)]"/>
          </div>

          {/* Social Sign In */}
          <a
            href="/api/auth/google"
            className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-[var(--sso-bg)] border border-[var(--sso-border)] hover:border-[var(--line-hover)] hover:bg-[var(--sso-hover-bg)] rounded-lg text-[12px] font-mono-co font-medium text-[var(--sso-text)] shadow-[var(--sso-shadow)] transition-all duration-300 group"
          >
            <svg className="w-4 h-4" width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
              <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.26c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
              <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
              <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
            </svg>
            <span className="group-hover:text-[var(--charcoal)] transition-colors">Continue with Google</span>
          </a>

          <p className="text-center text-[12px] text-[var(--grey)] mt-6">
            New developer?{' '}
            <Link href="/auth/register" className="text-[var(--charcoal)] hover:text-[var(--grey-light)] font-medium font-mono-co transition-colors underline">
              Verify account free
            </Link>
          </p>
        </div>

        <div className="text-center mt-8">
          <Link href="/" className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[2px] text-[var(--grey)] hover:text-[var(--charcoal)] font-mono-co font-medium transition-colors">
            <ArrowLeft size={12}/> Return Home
          </Link>
        </div>
      </div>
    </div>
  )
}
