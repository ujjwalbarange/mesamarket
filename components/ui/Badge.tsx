interface BadgeProps {
  variant?: 'blue' | 'cyan' | 'green' | 'amber' | 'red' | 'muted' | 'ink' | 'teal' | 'forest' | 'warning' | 'danger' | 'grey'
  size?: 'sm' | 'md'
  children: React.ReactNode
  className?: string
}

const variantMap: Record<string, string> = {
  blue:    'bg-[var(--royal-blue-dim)] text-[var(--royal-blue)] border-[rgba(37,99,235,0.20)]',
  cyan:    'bg-[var(--cyan-dim)] text-[var(--cyan)] border-[rgba(6,182,212,0.20)]',
  green:   'bg-emerald-50 text-emerald-700 border-emerald-200/60',
  amber:   'bg-amber-50 text-amber-700 border-amber-200/60',
  red:     'bg-red-50 text-red-700 border-red-200/60',
  muted:   'bg-[var(--bg-secondary)] text-[var(--muted)] border-[var(--line)]',
  ink:     'bg-[var(--ink)] text-[var(--bg)] border-transparent',
  /* Legacy aliases */
  teal:    'bg-emerald-50 text-emerald-700 border-emerald-200/60',
  forest:  'bg-emerald-50 text-emerald-700 border-emerald-200/60',
  warning: 'bg-amber-50 text-amber-700 border-amber-200/60',
  danger:  'bg-red-50 text-red-700 border-red-200/60',
  grey:    'bg-[var(--bg-secondary)] text-[var(--muted)] border-[var(--line)]',
}

const sizeMap: Record<string, string> = {
  sm: 'px-2.5 py-0.5 text-[10px]',
  md: 'px-3 py-1 text-[11px]',
}

export default function Badge({ variant = 'muted', size = 'sm', children, className = '' }: BadgeProps) {
  return (
    <span className={`inline-flex items-center rounded-full border font-medium tracking-wide ${variantMap[variant]} ${sizeMap[size]} ${className}`}>
      {children}
    </span>
  )
}
