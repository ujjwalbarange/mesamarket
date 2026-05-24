'use client'
import { Loader2 } from 'lucide-react'
import React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'glass' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  children: React.ReactNode
}

const variantStyles: Record<string, string> = {
  primary:   'bg-[var(--ink)] text-white border-transparent shadow-[0_2px_12px_rgba(15,23,42,0.22)] hover:bg-[var(--ink-soft)] hover:shadow-[0_8px_24px_rgba(15,23,42,0.28)]',
  secondary: 'bg-[var(--royal-blue)] text-white border-transparent shadow-[0_2px_12px_rgba(37,99,235,0.30)] hover:bg-[var(--accent-hover)] hover:shadow-[0_8px_28px_rgba(37,99,235,0.40)]',
  outline:   'bg-transparent text-[var(--ink)] border-[var(--line-strong)] hover:bg-[var(--bg-secondary)] hover:border-[var(--ink)]',
  ghost:     'bg-transparent text-[var(--muted)] border-transparent hover:bg-[var(--royal-blue-dim)] hover:text-[var(--royal-blue)]',
  glass:     'bg-[var(--glass)] text-[var(--ink)] border-[var(--glass-border)] backdrop-blur-md shadow-[var(--shadow-sm)] hover:bg-[var(--glass-heavy)]',
  danger:    'bg-red-600 text-white border-transparent shadow-[0_2px_12px_rgba(220,38,38,0.25)] hover:bg-red-700 hover:shadow-[0_8px_24px_rgba(220,38,38,0.35)]',
}

const sizeStyles: Record<string, string> = {
  sm: 'px-4 py-2 text-[12px] gap-1.5',
  md: 'px-5 py-2.5 text-[13px] gap-2',
  lg: 'px-7 py-3.5 text-[14px] gap-2',
}

export default function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  className = '',
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled || loading}
      className={[
        /* Base pill shape */
        'inline-flex items-center justify-center rounded-full border font-medium transition-all duration-200',
        'hover:-translate-y-px active:translate-y-0 active:scale-[0.98]',
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--royal-blue)] focus-visible:ring-offset-2',
        variantStyles[variant],
        sizeStyles[size],
        className,
      ].join(' ')}
      {...props}
    >
      {loading ? <Loader2 size={size === 'lg' ? 15 : 13} className="animate-spin shrink-0" /> : null}
      {children}
    </button>
  )
}
