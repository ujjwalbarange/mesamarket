import { ReactNode } from 'react'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Account Settings & Profile Management | OASIS',
}
import Navbar from '@/components/layout/Navbar'

export default function SettingsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen glass-page">
      <Navbar />
      <main className="max-w-7xl mx-auto px-6 lg:px-16 py-10 pt-24">{children}</main>
    </div>
  )
}
