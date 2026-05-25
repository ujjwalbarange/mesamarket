'use client'
import { useState } from 'react'
import Link from 'next/link'
import { CheckCircle, Compass, Server, ArrowRight, ArrowLeft } from 'lucide-react'
import Image from 'next/image'
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
  if (!pw) return { score: 0, label: 'EMPTY', color: 'bg-[var(--line-strong)]' }
  let score = 0
  if (pw.length >= 8) score++
  if (/[A-Z]/.test(pw)) score++
  if (/[0-9]/.test(pw)) score++
  if (/[^A-Za-z0-9]/.test(pw)) score++
  if (score <= 1) return { score: 1, label: 'WEAK', color: 'bg-red-400' }
  if (score <= 3) return { score: 2, label: 'MEDIUM', color: 'bg-amber-400' }
  return { score: 3, label: 'STRONG', color: 'bg-emerald-400' }
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
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email.trim().toLowerCase() }),
      })
      const data = await res.json()
      if (!res.ok) { setToast({ msg: data.error ?? 'Failed to send OTP', type: 'error' }); setLoading(false); return }
      setToast({ msg: 'Verification code sent to email', type: 'success' })
      setStep('otp')
    } catch { setToast({ msg: 'Network error', type: 'error' }) }
    finally { setLoading(false) }
  }

  const handleSubmitFinal = async (ev: React.FormEvent) => {
    ev.preventDefault()
    if (otp.length !== 6) return setToast({ msg: 'Enter 6-digit code', type: 'error' })
    setLoading(true)
    try {
      const qrBase64 = form.paymentQr ? await toBase64(form.paymentQr) : undefined
      const res = await fetch('/api/auth/register', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          otp,
          email: form.email.trim().toLowerCase(), 
          password: form.password, 
          name: form.name,
          isSeller: form.isSeller,
          bio: form.bio, 
          skills: form.skills, 
          paymentQr: qrBase64
        }),
      })
      const data = await res.json()
      if (!res.ok) { setToast({ msg: data.error ?? 'Registration failed', type: 'error' }); setLoading(false); return }
      window.location.href = form.isSeller ? '/dashboard/seller' : '/dashboard/buyer'
    } catch { setToast({ msg: 'Network error', type: 'error' }) }
    finally { setLoading(false) }
  }

  const pwStrength = getPasswordStrength(form.password)

  return (
    <div className="min-h-screen aurora-page overflow-hidden flex">
      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

      {/* ── Left panel — cinematic editorial ── */}
      <div className="hidden lg:flex flex-col flex-1 relative overflow-hidden bg-[var(--ink)] p-14">
        <div className="absolute inset-0">
          <div className="aurora-orb-blue w-[500px] h-[500px] top-[-20%] right-[-20%] opacity-40" style={{ position: 'absolute' }} />
          <div className="aurora-orb-cyan w-[400px] h-[400px] bottom-[-20%] left-[-10%] opacity-30" style={{ position: 'absolute' }} />
        </div>

        <Link href="/" className="relative z-10 flex items-center gap-2.5 w-fit">
          <div className="w-9 h-9 rounded-xl overflow-hidden border border-white/20 flex items-center justify-center">
            <Image src="/logo.jpg" alt="OASIS Logo" width={36} height={36} className="object-cover w-full h-full" />
          </div>
          <span className="font-display-medium text-[13px] tracking-[3px] uppercase text-[var(--bg)]">OASIS</span>
        </Link>

        <div className="relative z-10 mt-auto max-w-md">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}>
            <h1 className="font-display text-[64px] leading-[0.95] text-[var(--bg)] mb-6">
              Build your<br />future.
            </h1>
            <p className="text-[16px] text-[var(--bg)] opacity-60 leading-relaxed font-light mb-10">
              Join the marketplace where vetted engineers and forward-thinking brands connect to build incredible software.
            </p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }} className="p-5 rounded-2xl bg-white/8 border border-white/12 backdrop-blur-sm">
            <p className="text-[14px] text-[var(--bg)] opacity-80 font-light leading-relaxed mb-3">
              "Being a seller on OASIS helped me pay my tuition while building real-world products for actual companies."
            </p>
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-indigo-500 flex items-center justify-center text-[11px] font-semibold text-white">S</div>
              <div>
                <div className="text-[12px] font-medium text-[var(--bg)]">Sanya K.</div>
                <div className="text-[10px] text-[var(--bg)] opacity-50">Pro Seller · CS Senior</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── Right panel — form ── */}
      <div className="flex flex-col items-center flex-1 lg:max-w-[540px] px-6 py-12 overflow-y-auto">
        <Link href="/" className="lg:hidden flex items-center gap-2.5 mb-10 w-full">
          <div className="w-8 h-8 rounded-xl overflow-hidden flex items-center justify-center shadow-md">
            <Image src="/logo.jpg" alt="OASIS Logo" width={32} height={32} className="object-cover w-full h-full" />
          </div>
          <span className="font-display-medium text-[13px] tracking-[3px] uppercase text-[var(--ink)]">OASIS</span>
        </Link>

        <div className="w-full max-w-[400px] my-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}>
            <div className="mb-8">
              <h2 className="font-display text-[36px] text-[var(--ink)] leading-tight mb-2">Create account</h2>
              <p className="text-[14px] text-[var(--muted)] font-light">
                Already verified? <Link href="/auth/login" className="text-[var(--ink)] font-semibold hover:text-[var(--royal-blue)] transition-colors">Sign in →</Link>
              </p>
            </div>

            {step === 'form' ? (
              <>
                <a href="/api/auth/google" className="w-full flex items-center justify-center gap-3 py-3.5 px-4 rounded-full border border-[var(--line-strong)] bg-[var(--surface)] hover:bg-[var(--bg-secondary)] text-[13px] font-medium text-[var(--ink)] transition-all hover:-translate-y-px shadow-[var(--shadow-xs)] mb-6">
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 18 18" fill="none"><path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/><path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.26c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/><path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/><path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/></svg>
                  Register with Google
                </a>

                <div className="flex items-center gap-4 mb-6">
                  <div className="flex-1 h-px bg-[var(--line)]" />
                  <span className="text-[11px] text-[var(--muted-light)] font-medium">or</span>
                  <div className="flex-1 h-px bg-[var(--line)]" />
                </div>

                <div className="flex p-1 bg-[var(--bg-secondary)] rounded-full mb-6 border border-[var(--line)]">
                  {([false, true] as const).map(s => (
                    <button key={String(s)} type="button" onClick={() => setField('isSeller', s)}
                      className={`flex-1 py-2 rounded-full text-[12px] font-semibold transition-all ${
                        form.isSeller === s ? 'bg-[var(--surface)] text-[var(--ink)] shadow-[var(--shadow-sm)]' : 'text-[var(--muted)] hover:text-[var(--ink)]'
                      }`}>
                      {s ? 'Seller Account' : 'Buyer Account'}
                    </button>
                  ))}
                </div>

                <form onSubmit={handleSendOtp} className="space-y-4" noValidate>
                  <div>
                    <label className="block text-[11px] uppercase tracking-[2px] text-[var(--muted)] font-semibold mb-2">Full Name</label>
                    <input required className="input-field" placeholder="e.g. Priyanshu Sharma" value={form.name} onChange={e => setField('name', e.target.value)} />
                    {errors.name && <p className="text-[11px] text-red-500 mt-1.5">{errors.name}</p>}
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-[2px] text-[var(--muted)] font-semibold mb-2">Email</label>
                    <input type="email" required className="input-field" placeholder="you@university.edu" value={form.email} onChange={e => setField('email', e.target.value)} />
                    {errors.email && <p className="text-[11px] text-red-500 mt-1.5">{errors.email}</p>}
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-[2px] text-[var(--muted)] font-semibold mb-2">Password</label>
                    <input type="password" required className="input-field" placeholder="••••••••••••" value={form.password} onChange={e => setField('password', e.target.value)} />
                    {form.password && (
                      <div className="mt-2.5">
                        <div className="flex justify-between text-[10px] font-medium mb-1">
                          <span className="text-[var(--muted-light)]">Strength</span>
                          <span className={pwStrength.score === 3 ? 'text-emerald-500' : pwStrength.score === 2 ? 'text-amber-500' : 'text-red-500'}>{pwStrength.label}</span>
                        </div>
                        <div className="flex gap-1 h-1">
                          <div className={`flex-1 rounded-full transition-colors ${pwStrength.score >= 1 ? pwStrength.color : 'bg-[var(--line-strong)]'}`} />
                          <div className={`flex-1 rounded-full transition-colors ${pwStrength.score >= 2 ? pwStrength.color : 'bg-[var(--line-strong)]'}`} />
                          <div className={`flex-1 rounded-full transition-colors ${pwStrength.score >= 3 ? pwStrength.color : 'bg-[var(--line-strong)]'}`} />
                        </div>
                      </div>
                    )}
                    {errors.password && <p className="text-[11px] text-red-500 mt-1.5">{errors.password}</p>}
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-[2px] text-[var(--muted)] font-semibold mb-2">Confirm Password</label>
                    <input type="password" required className="input-field" placeholder="••••••••••••" value={form.confirm} onChange={e => setField('confirm', e.target.value)} />
                    {errors.confirm && <p className="text-[11px] text-red-500 mt-1.5">{errors.confirm}</p>}
                  </div>

                  {form.isSeller && (
                    <div className="space-y-4 pt-4 mt-2 border-t border-[var(--line)]">
                      <div className="flex items-center gap-2 text-[11px] uppercase tracking-[2px] text-[var(--muted)] font-semibold">
                        <Server size={12} /> Developer Profile
                      </div>
                      <input className="input-field" placeholder="College / University" value={form.bio} onChange={e => setField('bio', e.target.value)} />
                      <input className="input-field" placeholder="Core Skills (React, Node, Python...)" value={form.skills} onChange={e => setField('skills', e.target.value)} />
                      
                      <div>
                        <label className="block text-[11px] uppercase tracking-[2px] text-[var(--muted)] font-semibold mb-2">Payment QR Code</label>
                        <label className="flex flex-col items-center justify-center border-2 border-dashed border-[var(--line-strong)] hover:border-[var(--ink)] bg-[var(--surface)] p-6 rounded-2xl cursor-pointer transition-all">
                          <input type="file" className="hidden" accept="image/*" onChange={e => setField('paymentQr', e.target.files?.[0] ?? null)} />
                          {form.paymentQr ? (
                            <div className="flex items-center gap-2 text-[var(--ink)] text-[13px] font-medium">
                              <CheckCircle size={15} className="text-emerald-500" />
                              <span className="truncate max-w-[200px]">{form.paymentQr.name}</span>
                            </div>
                          ) : (
                            <span className="text-[13px] font-medium text-[var(--muted)]">Upload UPI QR</span>
                          )}
                        </label>
                        {errors.paymentQr && <p className="text-[11px] text-red-500 mt-1.5">{errors.paymentQr}</p>}
                      </div>
                    </div>
                  )}

                  <button type="submit" disabled={loading}
                    className="w-full py-4 mt-4 rounded-full bg-[var(--ink)] text-[var(--bg)] text-[13px] font-semibold flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(15,23,42,0.25)] hover:bg-[var(--ink-soft)] hover:-translate-y-px transition-all disabled:opacity-50">
                    {loading ? 'Sending Code...' : <><span>Continue</span><ArrowRight size={14} /></>}
                  </button>
                </form>
              </>
            ) : (
              <form onSubmit={handleSubmitFinal} className="space-y-6">
                <div className="text-center mb-4">
                  <p className="text-[16px] text-[var(--ink)] font-medium mb-1">Verify email</p>
                  <p className="text-[13px] text-[var(--muted)] font-light">
                    6-digit code sent to <strong className="text-[var(--ink)] font-medium">{form.email}</strong>
                  </p>
                </div>
                <input
                  type="text" maxLength={6} required
                  className="w-full text-center text-3xl tracking-[16px] font-display-medium py-6 bg-[var(--surface)] border border-[var(--line-strong)] rounded-2xl text-[var(--ink)] outline-none focus:border-[var(--royal-blue)] focus:ring-2 focus:ring-[var(--royal-blue-dim)] transition-all"
                  placeholder="000000" value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
                />
                <div className="flex gap-3">
                  <button type="button" onClick={() => setStep('form')} disabled={loading}
                    className="flex items-center justify-center gap-2 px-6 py-4 rounded-full border border-[var(--line-strong)] text-[var(--muted)] text-[13px] font-semibold hover:text-[var(--ink)] hover:bg-[var(--line)] transition-all">
                    <ArrowLeft size={14} /> Back
                  </button>
                  <button type="submit" disabled={loading}
                    className="flex-1 py-4 rounded-full bg-[var(--ink)] text-[var(--bg)] text-[13px] font-semibold shadow-[0_4px_20px_rgba(15,23,42,0.25)] hover:bg-[var(--ink-soft)] hover:-translate-y-px transition-all disabled:opacity-50">
                    {loading ? 'Verifying...' : 'Complete Registration'}
                  </button>
                </div>
              </form>
            )}

            <p className="text-center text-[12px] text-[var(--muted-light)] mt-8 font-light">
              By joining, you agree to our <Link href="#" className="underline hover:text-[var(--muted)] transition-colors">Terms</Link> and <Link href="#" className="underline hover:text-[var(--muted)] transition-colors">Privacy Policy</Link>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
