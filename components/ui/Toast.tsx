'use client'
import { useEffect, useState } from 'react'
import { CheckCircle2, AlertCircle, X } from 'lucide-react'

interface ToastProps {
  message: string
  type?: 'success' | 'error' | 'info'
  duration?: number
  onClose: () => void
}

export default function Toast({ message, type = 'info', duration = 4000, onClose }: ToastProps) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const show = requestAnimationFrame(() => setVisible(true))
    const timer = setTimeout(() => {
      setVisible(false)
      setTimeout(onClose, 300)
    }, duration)
    return () => { cancelAnimationFrame(show); clearTimeout(timer) }
  }, [duration, onClose])

  const icons = {
    success: <CheckCircle2 size={15} className="text-emerald-500 shrink-0" />,
    error:   <AlertCircle  size={15} className="text-red-500 shrink-0" />,
    info:    <div className="w-2 h-2 rounded-full bg-[var(--royal-blue)] shrink-0" />,
  }

  return (
    <div
      className={[
        'fixed bottom-6 right-6 z-[9999] flex items-center gap-3 px-4 py-3.5',
        'rounded-full border shadow-[0_8px_32px_rgba(15,23,42,0.14),0_2px_8px_rgba(15,23,42,0.08)]',
        'max-w-[340px] min-w-[240px]',
        'bg-[var(--glass-heavy)] backdrop-blur-2xl border-[var(--glass-border)]',
        'transition-all duration-300',
        visible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-3 scale-95',
      ].join(' ')}
    >
      {icons[type]}
      <p className="flex-1 text-[13px] text-[var(--ink)] font-medium leading-snug">{message}</p>
      <button
        onClick={() => { setVisible(false); setTimeout(onClose, 300) }}
        className="ml-1 p-0.5 rounded-full text-[var(--muted)] hover:text-[var(--ink)] hover:bg-[var(--line)] transition-colors"
      >
        <X size={13} />
      </button>
    </div>
  )
}
