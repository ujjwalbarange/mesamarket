'use client'
import { useEffect, useCallback } from 'react'
import { X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
}

const sizes = { sm: 'max-w-md', md: 'max-w-lg', lg: 'max-w-2xl' }

export default function Modal({ isOpen, onClose, title, size = 'md', children }: ModalProps) {
  const handleKey = useCallback((e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }, [onClose])

  useEffect(() => {
    document.addEventListener('keydown', handleKey)
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.removeEventListener('keydown', handleKey); document.body.style.overflow = '' }
  }, [isOpen, handleKey])

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[800] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
          />
          {/* Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className={`relative w-full ${sizes[size]} bg-[var(--glass-heavy)] backdrop-blur-2xl border border-[var(--glass-border)] rounded-[24px] md:rounded-[28px] shadow-[0_32px_80px_rgba(15,23,42,0.18),0_8px_24px_rgba(15,23,42,0.12)] p-6 md:p-8`}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              {title && (
                <h2 className="font-display-medium text-[20px] text-[var(--ink)] leading-tight">{title}</h2>
              )}
              <button
                onClick={onClose}
                className="ml-auto p-2 rounded-full text-[var(--muted)] hover:text-[var(--ink)] hover:bg-[var(--line)] transition-colors"
              >
                <X size={16} />
              </button>
            </div>
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
