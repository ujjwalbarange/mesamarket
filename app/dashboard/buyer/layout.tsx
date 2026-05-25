import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Buyer Dashboard | Manage Projects & Orders | OASIS',
}

export default function BuyerDashboardLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
