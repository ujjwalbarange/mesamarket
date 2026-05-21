'use client'
import { useState } from 'react'
import Link from 'next/link'
import { CheckCircle, Upload, Code2, Server } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Button from '@/components/ui/Button'
import Toast from '@/components/ui/Toast'

const toBase64 = (file: File) => new Promise<string>((resolve, reject) => {
  const reader = new FileReader()
  reader.readAsDataURL(file)
  reader.onload = () => resolve(reader.result as string)
  reader.onerror = e => reject(e)
})

interface Form {
  name: string; email: string; password: string; confirm: string
  bio: string; skills: string; isSeller: boolean
  paymentQr: File | null
}
type FormErrors = { name?: string; email?: string; password?: string; confirm?: string; paymentQr?: string }
const INIT: Form = { name:'', email:'', password:'', confirm:'', bio:'', skills:'', isSeller:false, paymentQr: null }

const SELLER_PERKS = [
  'Set your own customizable price tiers',
  'Payout within 48 hours of milestone sign-off',
  'Direct-to-brand portfolio and code showcases',
]
const BUYER_PERKS = [
  'Instant access to 300+ vetted university engineers',
  '100% transparent pricing and code quality escrow',
  'Hands-on managed delivery with robust oversight',
]

const getPasswordStrength = (pw: string) => {
  if (!pw) return { score: 0, label: 'EMPTY', color: 'bg-slate-800' }
  let score = 0
  if (pw.length >= 8) score++
  if (/[A-Z]/.test(pw)) score++
  if (/[0-9]/.test(pw)) score++
  if (/[^A-Za-z0-9]/.test(pw)) score++
  
  if (score <= 1) return { score: 1, label: 'WEAK', color: 'bg-red-500/60' }
  if (score <= 3) return { score: 2, label: 'MEDIUM', color: 'bg-amber-500/60' }
  return { score: 3, label: 'STRONG', color: 'bg-emerald-500/60' }
}

export default function RegisterPage() {
  const [form, setForm]     = useState<Form>(INIT)
  const [loading, setLoading] = useState(false)
  const [toast, setToast]     = useState<{ msg: string; type: 'success'|'error' } | null>(null)
  const [errors, setErrors]   = useState<FormErrors>({})
  
  const [step, setStep]       = useState<'form' | 'otp'>('form')
  const [otp, setOtp]         = useState('')

  const setField = (k: keyof Form, v: any) => {
    setForm(prev => ({ ...prev, [k]: v }))
    if (errors[k as keyof FormErrors]) setErrors(prev => ({ ...prev, [k]: undefined }))
  }

  const validate = () => {
    const e: FormErrors = {}
    if (form.name.length < 2) e.name = 'Full name required'
    if (!form.email.includes('@')) e.email = 'Valid email required'
    if (form.password.length < 8) e.password = 'Password must be at least 8 characters'
    if (form.password !== form.confirm) e.confirm = 'Passwords must match'
    if (form.isSeller && !form.paymentQr) e.paymentQr = 'Payment QR required for payouts'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSendOtp = async (ev: React.FormEvent) => {
    ev.preventDefault()
    if (!validate()) return
    setLoading(true)

    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email.trim().toLowerCase() }),
      })
      const data = await res.json()
      if (!res.ok) {
         setToast({ msg: data.error ?? 'Failed to send verification OTP', type: 'error' })
         setLoading(false)
         return
      }
      setToast({ msg: 'Verification OTP sent to your university email.', type: 'success' })
      setStep('otp')
    } catch {
      setToast({ msg: 'Network error. Please try again.', type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitFinal = async (ev: React.FormEvent) => {
    ev.preventDefault()
    if (otp.length !== 6) {
       setToast({ msg: 'Please enter the 6-digit code', type: 'error' })
       return
     }
    setLoading(true)
    try {
      let qrBase64 = null
      if (form.isSeller && form.paymentQr) {
        qrBase64 = await toBase64(form.paymentQr)
      }

      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim().toLowerCase(),
          password: form.password,
          isSeller: form.isSeller,
          bio: form.bio || undefined,
          skills: form.skills || undefined,
          paymentQr: qrBase64 || undefined,
          otp: otp,
        })
      })
      const data = await res.json()
      if (res.ok) {
        setToast({ msg: 'Registration successful! Launching console...', type: 'success' })
        setTimeout(() => window.location.href = '/auth/login', 1500)
      } else {
        setToast({ msg: data.error || 'Registration failed. Check code.', type: 'error' })
      }
    } catch {
      setToast({ msg: 'Network error occurred.', type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const perks = form.isSeller ? SELLER_PERKS : BUYER_PERKS
  const pwStrength = getPasswordStrength(form.password)

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-10 bg-[var(--paper)] text-[var(--charcoal)] overflow-x-hidden font-sans">
      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

      {/* ── Left splash (40%) - Hidden on mobile viewports under lg ──────────────────────── */}
      <div className="hidden lg:flex lg:col-span-4 bg-[var(--paper-dark)] p-14 flex-col justify-between relative overflow-hidden border-r border-[var(--line)]">
        {/* Soft radial ambient illumination */}
        <div className="absolute top-[-10%] right-[-10%] w-[350px] h-[350px] rounded-full bg-slate-900/10 blur-[100px] pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[450px] h-[450px] rounded-full bg-slate-950/20 blur-[120px] pointer-events-none" />
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 relative z-10 group">
          <div className="h-10 w-10 relative overflow-hidden rounded-xl border border-[var(--line)] bg-[var(--paper)] flex items-center justify-center transition-all group-hover:border-[var(--line-hover)]">
            <Code2 size={20} className="text-[var(--grey)] group-hover:text-[var(--charcoal)] transition-colors" />
          </div>
          <span className="font-mono-co text-[14px] tracking-[4px] uppercase text-[var(--charcoal)] font-semibold">
            C-OASIS <span className="text-slate-500">.</span>
          </span>
        </Link>

        {/* Hero Copy */}
        <div className="relative z-10 animate-fade">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[var(--paper)] border border-[var(--line)] rounded-full text-[10px] uppercase tracking-[2px] text-[var(--grey)] font-mono-co mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--grey-light)]" />
            Vetted CS Marketplace
          </div>
          <h2 className="font-display text-4xl lg:text-5xl font-semibold leading-[1.1] text-[var(--charcoal)] mb-8 tracking-tight">
            {form.isSeller ? (
              <>Engineered for pinnacle developers.</>
            ) : (
              <>Find your perfect builder.</>
            )}
          </h2>
          
          <ul className="space-y-5">
            {perks.map(p => (
              <li key={p} className="flex items-start gap-4 text-[13px] text-[var(--grey)] leading-relaxed font-sans">
                <span className="shrink-0 font-mono-co text-[var(--grey-light)] text-[12px] mt-0.5 font-semibold">=&gt;</span>
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Technical footer */}
        <div className="flex justify-between items-center text-[10px] text-[var(--grey-light)] font-mono-co border-t border-[var(--line)] pt-6 relative z-10">
          <span>SYS_VER: 2.1.0</span>
          <span>© 2026 CRAFTSMANSHIP OASIS</span>
        </div>
      </div>

      {/* ── Right form (60% on desktop, 100% on mobile) ───────────────────────────────────────── */}
      <div className="lg:col-span-6 flex flex-col items-center justify-start lg:justify-center pt-6 lg:pt-14 px-4 bg-[var(--paper)] relative w-full min-h-screen pb-12">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.015),transparent_60%)] pointer-events-none" />

        {/* Minimal brand logo outside form container - Visible on mobile only */}
        <div className="flex flex-col items-center mb-6 lg:hidden relative z-10">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="h-9 w-9 rounded-xl border border-[var(--line)] bg-[var(--paper-dark)]/60 flex items-center justify-center">
              <Code2 size={18} className="text-[var(--grey)]" />
            </div>
            <span className="font-mono-co text-[14px] tracking-[4px] uppercase text-[var(--charcoal)] font-semibold">
              C-OASIS <span className="text-slate-500">.</span>
            </span>
          </Link>
        </div>

        {/* Unified Form Container Card */}
        <div className="w-full max-w-md cyber-border-container p-8 relative z-10 glass-panel">
          
          <div className="mb-8 text-center lg:text-left">
            <h1 className="font-display text-3xl font-semibold text-[var(--charcoal)] tracking-tight mb-2">Create Account</h1>
            <p className="text-[13px] text-[var(--grey)]">
              Already verified?{' '}
              <Link href="/auth/login" className="text-[var(--charcoal)] hover:text-emerald-500 font-medium transition-colors font-mono-co underline">Sign in -&gt;</Link>
            </p>
          </div>

          {/* Social Sign Up - Fixed exact height of 48px */}
          <a
            href="/api/auth/google"
            className="w-full h-12 flex items-center justify-center gap-3 px-4 bg-[var(--sso-bg)] border border-[var(--sso-border)] hover:bg-[var(--sso-hover-bg)] hover:border-[var(--line-hover)] rounded-lg text-[12px] font-mono-co font-medium text-[var(--sso-text)] shadow-[var(--sso-shadow)] transition-all duration-300 mb-6 group"
          >
            <svg className="w-4 h-4" width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
              <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.26c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
              <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
              <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
            </svg>
            <span className="group-hover:text-[var(--charcoal)] transition-colors">Register with Google SSO</span>
          </a>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-[1px] bg-[var(--line)]"/>
            <span className="text-[9px] uppercase tracking-[2px] text-[var(--grey-light)] font-mono-co font-medium">Or deploy with credentials</span>
            <div className="flex-1 h-[1px] bg-[var(--line)]"/>
          </div>

          {/* Role Toggle capsule slider - Fixed exact height of 48px */}
          <div className="relative flex h-12 p-1 bg-[var(--capsule-bg)] border border-[var(--line)] rounded-xl mb-8">
            <div 
              className={`absolute top-1 bottom-1 rounded-lg transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]
                ${form.isSeller ? 'bg-emerald-500 border-transparent shadow-[0_2px_12px_rgba(16,185,129,0.2)]' : 'bg-[var(--sso-bg)] border border-[var(--sso-border)] shadow-[var(--sso-shadow)]'}`}
              style={{
                left: form.isSeller ? '50%' : '4px',
                right: form.isSeller ? '4px' : '50%',
              }}
            />
            {([false, true] as const).map(s => (
              <button
                key={String(s)}
                type="button"
                onClick={() => setField('isSeller', s)}
                className={`relative z-10 flex-1 h-full flex items-center justify-center text-[10px] uppercase tracking-[2.5px] font-mono-co text-center transition-colors duration-200
                  ${form.isSeller === s 
                    ? (s ? 'text-slate-950 font-semibold' : 'text-[var(--charcoal)] font-semibold') 
                    : 'text-[var(--grey-light)] hover:text-[var(--charcoal)]'}`}
              >
                {s ? 'I am a Seller' : 'I am a Buyer'}
              </button>
            ))}
          </div>

          {step === 'form' ? (
            <form onSubmit={handleSendOtp} className="space-y-6 animate-fade" noValidate>
              {/* Full Name */}
              <div className="relative min-h-[82px]">
                <label className="block text-[10px] uppercase tracking-[2.5px] text-[var(--grey)] mb-2 font-mono-co font-medium">Full Name</label>
                <input required className="input-underline" placeholder="e.g. Priyanshu Sharma"
                  value={form.name} onChange={e => setField('name', e.target.value)} />
                <AnimatePresence>
                  {errors.name && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="text-[11px] text-red-400 mt-1.5 font-mono-co flex items-center gap-1.5 overflow-hidden"
                    >
                      <span className="w-1 h-1 rounded-full bg-red-400 shrink-0" />
                      {errors.name}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Email Address */}
              <div className="relative min-h-[82px]">
                <label className="block text-[10px] uppercase tracking-[2.5px] text-[var(--grey)] mb-2 font-mono-co font-medium">University Email</label>
                <input type="email" required className="input-underline" placeholder="you@university.edu"
                  value={form.email} onChange={e => setField('email', e.target.value)} />
                <AnimatePresence>
                  {errors.email && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="text-[11px] text-red-400 mt-1.5 font-mono-co flex items-center gap-1.5 overflow-hidden"
                    >
                      <span className="w-1 h-1 rounded-full bg-red-400 shrink-0" />
                      {errors.email}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Password */}
              <div className="relative min-h-[110px]">
                <label className="block text-[10px] uppercase tracking-[2.5px] text-[var(--grey)] mb-2 font-mono-co font-medium">Password</label>
                <input type="password" required className="input-underline"
                  placeholder="••••••••••••"
                  value={form.password} onChange={e => setField('password', e.target.value)} />

                {/* Password Strength indicator */}
                {form.password && (
                  <div className="mt-2.5 space-y-1 animate-scale-in">
                    <div className="flex justify-between items-center text-[9px] font-mono-co text-[var(--grey-light)]">
                      <span>STRENGTH METER</span>
                      <span className={pwStrength.score === 3 ? 'text-emerald-400' : pwStrength.score === 2 ? 'text-amber-400' : 'text-red-400'}>
                        {pwStrength.label}
                      </span>
                    </div>
                    <div className="flex gap-1.5 h-1">
                      <div className={`flex-1 rounded-full h-full transition-colors duration-300 ${pwStrength.score >= 1 ? pwStrength.color : 'bg-slate-800'}`} />
                      <div className={`flex-1 rounded-full h-full transition-colors duration-300 ${pwStrength.score >= 2 ? pwStrength.color : 'bg-slate-800'}`} />
                      <div className={`flex-1 rounded-full h-full transition-colors duration-300 ${pwStrength.score >= 3 ? pwStrength.color : 'bg-slate-800'}`} />
                    </div>
                  </div>
                )}

                <AnimatePresence>
                  {errors.password && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="text-[11px] text-red-400 mt-1.5 font-mono-co flex items-center gap-1.5 overflow-hidden"
                    >
                      <span className="w-1 h-1 rounded-full bg-red-400 shrink-0" />
                      {errors.password}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Confirm Password */}
              <div className="relative min-h-[82px]">
                <label className="block text-[10px] uppercase tracking-[2.5px] text-[var(--grey)] mb-2 font-mono-co font-medium">Re-enter Password</label>
                <input type="password" required className="input-underline" placeholder="••••••••••••"
                  value={form.confirm} onChange={e => setField('confirm', e.target.value)} />
                <AnimatePresence>
                  {errors.confirm && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="text-[11px] text-red-400 mt-1.5 font-mono-co flex items-center gap-1.5 overflow-hidden"
                    >
                      <span className="w-1 h-1 rounded-full bg-red-400 shrink-0" />
                      {errors.confirm}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {form.isSeller && (
                <div className="space-y-6 border-t border-[var(--line)] pt-6 animate-scale-in">
                  <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-[var(--paper-dark)]/60 border border-[var(--line)] rounded-md text-[9px] uppercase tracking-[1.5px] text-[var(--grey)] font-mono-co mb-2">
                    <Server size={10} />
                    Developer Profiles
                  </div>
                  
                  <div>
                    <label className="block text-[10px] uppercase tracking-[2.5px] text-[var(--grey)] mb-2 font-mono-co font-medium">College / University</label>
                    <input className="input-underline" placeholder="e.g. BITS Pilani, IIT Madras"
                      value={form.bio} onChange={e => setField('bio', e.target.value)} />
                  </div>
                  
                  <div>
                    <label className="block text-[10px] uppercase tracking-[2.5px] text-[var(--grey)] mb-2 font-mono-co font-medium">Core Tech Skills</label>
                    <input className="input-underline" placeholder="e.g. React, Next.js, Node, PyTorch"
                      value={form.skills} onChange={e => setField('skills', e.target.value)} />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-[2.5px] text-[var(--grey)] mb-2 font-mono-co font-medium">Payment QR Code (Required)</label>
                    <label className="block bg-[var(--paper-dark)] border border-dashed border-[var(--line)] hover:border-[var(--grey)] p-5 rounded-lg text-center cursor-pointer transition-all duration-300">
                      <input type="file" className="hidden" accept="image/*" 
                        onChange={e => setField('paymentQr', e.target.files?.[0] ?? null)} />
                      {form.paymentQr ? (
                        <div className="flex items-center justify-center gap-2 text-[var(--charcoal)] text-[11px] font-mono-co">
                          <CheckCircle size={14} className="text-slate-400 shrink-0" />
                          <span className="truncate max-w-[200px]">{form.paymentQr.name}</span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-2 text-[var(--grey-light)]">
                          <span className="text-[11px] font-mono-co">Upload UPI QR Asset</span>
                        </div>
                      )}
                    </label>
                    <AnimatePresence>
                      {errors.paymentQr && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="text-[11px] text-red-400 mt-1.5 font-mono-co flex items-center gap-1.5 overflow-hidden"
                        >
                          <span className="w-1 h-1 rounded-full bg-red-400 shrink-0" />
                          {errors.paymentQr}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              )}

              <Button type="submit" size="lg" className="w-full mt-4 h-12" loading={loading}>
                Deploy Registration
              </Button>
            </form>
          ) : (
            <form onSubmit={handleSubmitFinal} className="space-y-6 animate-scale-in">
              <div className="text-center mb-6">
                <p className="text-[15px] text-[var(--charcoal)] font-mono-co font-semibold mb-2">Verify email address</p>
                <p className="text-[12px] text-[var(--grey)] leading-relaxed">
                  We have dispatched a 6-digit confirmation code to <strong className="text-[var(--charcoal)] font-semibold">{form.email}</strong>.
                </p>
              </div>
              
              <div>
                <input 
                  type="text" 
                  maxLength={6}
                  required 
                  className="input-underline text-center text-2xl tracking-[12px] font-mono-co bg-[var(--input-bg)] border border-[var(--input-border)] rounded-lg py-4" 
                  placeholder="000000"
                  value={otp} 
                  onChange={e => setOtp(e.target.value.replace(/\D/g, ''))} 
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="button" variant="outline" size="md" onClick={() => setStep('form')} disabled={loading}>Back</Button>
                <Button type="submit" size="lg" className="flex-1 h-12" loading={loading}>Finalize Verification</Button>
              </div>
            </form>
          )}
        </div>

        {/* 3. Subtle Legal Disclaimer at the very bottom */}
        <div className="mt-8 text-center relative z-10">
          <p className="text-[10px] text-[var(--grey-light)] font-mono-co leading-relaxed">
            By deploying, you commit to our{' '}
            <Link href="#" className="underline text-[var(--grey)] hover:text-[var(--charcoal)] transition-colors">Service Agreement</Link>
            {' '}and{' '}
            <Link href="#" className="underline text-[var(--grey)] hover:text-[var(--charcoal)] transition-colors">Privacy Protocols</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
