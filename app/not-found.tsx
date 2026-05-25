import { Metadata } from 'next'
import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'

export const metadata: Metadata = {
  title: 'Page Not Found | OASIS',
}

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[var(--bg)] flex flex-col">
      <Navbar />
      <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
        <h2 className="font-display text-[80px] text-[var(--ink)] leading-none mb-4">404</h2>
        <p className="text-[16px] text-[var(--muted)] mb-8 max-w-sm mx-auto">
          We couldn't find the page you were looking for. It might have been moved or doesn't exist.
        </p>
        <Link href="/" className="px-6 py-3 rounded-full bg-[var(--ink)] text-[var(--bg)] text-[13px] font-medium transition-all hover:scale-105">
          Return to OASIS
        </Link>
      </div>
    </div>
  )
}
