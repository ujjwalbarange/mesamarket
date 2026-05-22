'use client'
import { useState } from 'react'
import Link from 'next/link'
import { CheckCircle, Code2, Server } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
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

const getPasswordStrength = (pw: string) => {
  if (!pw) return { score: 0, label: 'EMPTY', color: 'bg-white/20' }
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
    if (form.password.length < 8) e.password = 'Min. 8 characters'
    if (form.password !== form.confirm) e.confirm = 'Passwords must match'
    if (form.isSeller && !form.paymentQr) e.paymentQr = 'Payment QR required'
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
        setToast({ msg: data.error ?? 'Failed to send OTP', type: 'error' })
        setLoading(false)
        return
      }
      setToast({ msg: 'Verification code sent to your email.', type: 'success' })
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
        setToast({ msg: 'Registration successful! Redirecting...', type: 'success' })
        setTimeout(() => window.location.href = '/auth/login', 1500)
      } else {
        setToast({ msg: data.error || 'Registration failed.', type: 'error' })
      }
    } catch {
      setToast({ msg: 'Network error occurred.', type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const pwStrength = getPasswordStrength(form.password)

  return (
    <div className="relative min-h-screen overflow-x-hidden font-sans">
      {/* ── Fixed cinematic horizon background ─────────────────── */}
      <div className="horizon-canvas" aria-hidden="true" />
      <div className="horizon-overlay" aria-hidden="true" />

      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

      {/* ── Top logo — always visible ───────────────────────────── */}
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

      {/* ── Auth card centered below logo ───────────────────────── */}
      <div className="relative z-20 flex flex-col items-center justify-start px-4 py-8">
        <div className="w-full max-w-[400px]">

          {/* Card */}
          <div className="glass-panel-heavy p-8 md:p-10 rounded-2xl w-full">

            {/* Heading */}
            <div className="mb-7">
              <h1 className="font-display text-[30px] text-[var(--charcoal)] leading-tight tracking-wide mb-1">
                Create account
              </h1>
              <p className="text-[11px] text-[var(--grey)] font-light tracking-wide">
                Already verified?{' '}
                <Link href="/auth/login" className="text-[var(--charcoal)] font-medium underline font-mono-co hover:text-emerald-400 transition-colors">
                  Sign in →
                </Link>
              </p>
            </div>

            {/* Google SSO */}
            <a
              href="/api/auth/google"
              className="w-full h-11 flex items-center justify-center gap-3 px-4 bg-[var(--sso-bg)] border border-[var(--sso-border)] hover:bg-[var(--sso-hover-bg)] rounded-lg text-[11px] font-mono-co text-[var(--sso-text)] transition-all duration-300 mb-5 tracking-wider backdrop-blur-sm"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 18 18" fill="none">
                <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
                <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.26c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
                <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
                <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
              </svg>
              Register with Google
            </a>

            {/* Divider */}
            <div className="flex items-center gap-3 mb-5">
              <div className="flex-1 h-px bg-[var(--glass-border)]"/>
              <span className="text-[9px] uppercase tracking-[2px] text-[var(--grey)] font-mono-co">or with email</span>
              <div className="flex-1 h-px bg-[var(--glass-border)]"/>
            </div>

            {/* Buyer / Seller toggle */}
            <div className="flex h-10 p-0.5 bg-[var(--capsule-bg)] border border-[var(--glass-border)] rounded-lg mb-6 backdrop-blur-sm">
              {([false, true] as const).map(s => (
                <button
                  key={String(s)}
                  type="button"
                  onClick={() => setField('isSeller', s)}
                  className={`flex-1 h-full rounded-md text-[9px] uppercase tracking-[2px] font-mono-co transition-all duration-200 ${
                    form.isSeller === s
                      ? (s ? 'bg-emerald-500 text-slate-950 font-semibold' : 'bg-[var(--glass-bg-heavy)] text-[var(--charcoal)] border border-[var(--glass-border)]')
                      : 'text-[var(--grey)]'
                  }`}
                >
                  {s ? 'Seller' : 'Buyer'}
                </button>
              ))}
            </div>

            {step === 'form' ? (
              <form onSubmit={handleSendOtp} className="space-y-4 animate-fade" noValidate>
                {/* Full Name */}
                <div>
                  <label className="block text-[9px] uppercase tracking-[2.5px] text-[var(--grey)] mb-2 font-mono-co">Full Name</label>
                  <input required className="input-underline" placeholder="e.g. Priyanshu Sharma"
                    value={form.name} onChange={e => setField('name', e.target.value)} />
                  <AnimatePresence>
                    {errors.name && (
                      <motion.p initial={{ opacity:0, height:0 }} animate={{ opacity:1, height:'auto' }} exit={{ opacity:0, height:0 }}
                        className="text-[10px] text-red-400 mt-1.5 font-mono-co overflow-hidden">
                        {errors.name}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-[9px] uppercase tracking-[2.5px] text-[var(--grey)] mb-2 font-mono-co">University Email</label>
                  <input type="email" required className="input-underline" placeholder="you@university.edu"
                    value={form.email} onChange={e => setField('email', e.target.value)} />
                  <AnimatePresence>
                    {errors.email && (
                      <motion.p initial={{ opacity:0, height:0 }} animate={{ opacity:1, height:'auto' }} exit={{ opacity:0, height:0 }}
                        className="text-[10px] text-red-400 mt-1.5 font-mono-co overflow-hidden">
                        {errors.email}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-[9px] uppercase tracking-[2.5px] text-[var(--grey)] mb-2 font-mono-co">Password</label>
                  <input type="password" required className="input-underline" placeholder="••••••••••••"
                    value={form.password} onChange={e => setField('password', e.target.value)} />
                  {form.password && (
                    <div className="mt-2 space-y-1 animate-scale-in">
                      <div className="flex justify-between text-[9px] font-mono-co text-[var(--grey-light)]">
                        <span>Strength</span>
                        <span className={pwStrength.score === 3 ? 'text-emerald-400' : pwStrength.score === 2 ? 'text-amber-400' : 'text-red-400'}>
                          {pwStrength.label}
                        </span>
                      </div>
                      <div className="flex gap-1.5 h-0.5">
                        <div className={`flex-1 rounded-full h-full transition-colors ${pwStrength.score >= 1 ? pwStrength.color : 'bg-white/10'}`} />
                        <div className={`flex-1 rounded-full h-full transition-colors ${pwStrength.score >= 2 ? pwStrength.color : 'bg-white/10'}`} />
                        <div className={`flex-1 rounded-full h-full transition-colors ${pwStrength.score >= 3 ? pwStrength.color : 'bg-white/10'}`} />
                      </div>
                    </div>
                  )}
                  <AnimatePresence>
                    {errors.password && (
                      <motion.p initial={{ opacity:0, height:0 }} animate={{ opacity:1, height:'auto' }} exit={{ opacity:0, height:0 }}
                        className="text-[10px] text-red-400 mt-1.5 font-mono-co overflow-hidden">
                        {errors.password}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                {/* Confirm */}
                <div>
                  <label className="block text-[9px] uppercase tracking-[2.5px] text-[var(--grey)] mb-2 font-mono-co">Confirm Password</label>
                  <input type="password" required className="input-underline" placeholder="••••••••••••"
                    value={form.confirm} onChange={e => setField('confirm', e.target.value)} />
                  <AnimatePresence>
                    {errors.confirm && (
                      <motion.p initial={{ opacity:0, height:0 }} animate={{ opacity:1, height:'auto' }} exit={{ opacity:0, height:0 }}
                        className="text-[10px] text-red-400 mt-1.5 font-mono-co overflow-hidden">
                        {errors.confirm}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                {/* Seller extras */}
                {form.isSeller && (
                  <div className="space-y-4 border-t border-[var(--glass-border)] pt-4 animate-scale-in">
                    <div className="flex items-center gap-1.5 text-[9px] uppercase tracking-[1.5px] text-[var(--grey)] font-mono-co">
                      <Server size={10} /> Developer Profile
                    </div>
                    <input className="input-underline" placeholder="College / University"
                      value={form.bio} onChange={e => setField('bio', e.target.value)} />
                    <input className="input-underline" placeholder="Core Skills (React, Node, Python...)"
                      value={form.skills} onChange={e => setField('skills', e.target.value)} />
                    <div>
                      <label className="block text-[9px] uppercase tracking-[2px] text-[var(--grey)] mb-2 font-mono-co">Payment QR Code</label>
                      <label className="flex flex-col items-center justify-center bg-[var(--glass-bg)] border border-dashed border-[var(--glass-border)] hover:border-[var(--line-hover)] p-5 rounded-lg cursor-pointer transition-all duration-300 backdrop-blur-sm">
                        <input type="file" className="hidden" accept="image/*"
                          onChange={e => setField('paymentQr', e.target.files?.[0] ?? null)} />
                        {form.paymentQr ? (
                          <div className="flex items-center gap-2 text-[var(--charcoal)] text-[11px] font-mono-co">
                            <CheckCircle size={13} className="text-emerald-400" />
                            <span className="truncate max-w-[180px]">{form.paymentQr.name}</span>
                          </div>
                        ) : (
                          <span className="text-[11px] font-mono-co text-[var(--grey)] tracking-wide">Upload UPI QR</span>
                        )}
                      </label>
                      <AnimatePresence>
                        {errors.paymentQr && (
                          <motion.p initial={{ opacity:0, height:0 }} animate={{ opacity:1, height:'auto' }} exit={{ opacity:0, height:0 }}
                            className="text-[10px] text-red-400 mt-1.5 font-mono-co overflow-hidden">
                            {errors.paymentQr}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 mt-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-[11px] tracking-[2px] uppercase font-mono-co font-semibold rounded-lg transition-all shadow-[0_4px_20px_rgba(16,185,129,0.25)] disabled:opacity-50"
                >
                  {loading ? 'Sending Code...' : 'Continue'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleSubmitFinal} className="space-y-5 animate-scale-in">
                <div className="text-center mb-2">
                  <p className="text-[14px] text-[var(--charcoal)] font-mono-co font-medium mb-1 tracking-wide">Verify email</p>
                  <p className="text-[11px] text-[var(--grey)] font-light">
                    6-digit code sent to <strong className="text-[var(--charcoal)] font-medium">{form.email}</strong>
                  </p>
                </div>
                <input
                  type="text"
                  maxLength={6}
                  required
                  className="input-underline text-center text-2xl tracking-[12px] font-mono-co py-4"
                  placeholder="000000"
                  value={otp}
                  onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
                />
                <div className="flex gap-3">
                  <button type="button" onClick={() => setStep('form')} disabled={loading}
                    className="flex-1 py-3 glass-card text-[var(--grey)] text-[10px] tracking-[2px] uppercase font-mono-co rounded-lg hover:border-[var(--line-hover)] transition-all">
                    Back
                  </button>
                  <button type="submit" disabled={loading}
                    className="flex-[2] py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-[11px] tracking-[2px] uppercase font-mono-co font-semibold rounded-lg transition-all shadow-[0_4px_20px_rgba(16,185,129,0.25)] disabled:opacity-50">
                    {loading ? 'Verifying...' : 'Complete Registration'}
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Legal */}
          <p className="text-center text-[9px] text-[var(--grey-light)] mt-5 mb-10 font-mono-co tracking-wide">
            By joining, you agree to our{' '}
            <Link href="#" className="underline hover:text-[var(--grey)] transition-colors">Terms</Link>
            {' '}and{' '}
            <Link href="#" className="underline hover:text-[var(--grey)] transition-colors">Privacy Policy</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
