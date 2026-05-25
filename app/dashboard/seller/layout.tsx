import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Seller Portal | Earn Through Development Projects | OASIS',
}

export default function SellerDashboardLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
