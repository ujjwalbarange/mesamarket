import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'OASIS Admin Control Center',
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
