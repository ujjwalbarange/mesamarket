'use client'
import { ButtonHTMLAttributes, ReactNode } from 'react'
import { Loader2 } from 'lucide-react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  children: ReactNode
}

const variants = {
  primary: 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold border-transparent transition-all duration-300',
  outline: 'bg-[var(--sso-bg)] border-[var(--line)] text-[var(--grey)] hover:bg-[var(--sso-hover-bg)] hover:border-[var(--line-hover)] hover:text-[var(--charcoal)] shadow-[var(--sso-shadow)] transition-all duration-300',
  ghost:   'bg-transparent text-[var(--grey)] border-transparent hover:text-[var(--charcoal)] hover:bg-[var(--sso-hover-bg)] transition-all duration-200',
  danger:  'bg-red-500/10 border-red-950/20 text-red-500 hover:bg-red-900/20 hover:text-red-400 transition-all duration-300',
}
const sizes = {
  sm: 'px-4 py-2 text-[10px] tracking-[1.5px] rounded-md',
  md: 'px-5 py-2.5 text-[11px] tracking-[2px] rounded-lg',
  lg: 'px-7 py-3 text-[12px] tracking-[2.5px] rounded-lg',
}

export default function Button({
  variant = 'primary', size = 'md', loading, children, className = '', disabled, ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={`
        inline-flex items-center justify-center gap-2
        border uppercase font-medium font-mono-co
        transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)]
        cursor-pointer active:scale-[0.97]
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]} ${sizes[size]} ${className}
        ${loading ? 'animate-soft-pulse' : ''}
      `}
    >
      {loading && <Loader2 size={12} className="animate-spin text-current" />}
      {!loading && children}
      {loading && <span className="opacity-75">{children}</span>}
    </button>
  )
}
